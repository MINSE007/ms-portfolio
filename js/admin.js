/* =====================================================================
   admin.js — 관리자 모드
   켜는 법: 맨 아래 '관리자 로그인' → 아이디·비밀번호 (단축키·주소 끝 #admin도 로그인 창이 떠요)
           한 번 로그인하면 이 탭을 닫기 전까지 다시 안 물어봐요.
   할 수 있는 것:
     · 화면의 글자(점선 테두리)를 눌러서 바로 고치기 — Enter로 줄바꿈, Esc로 끝내기
     · [배치] 섹션 순서 바꾸기 / 숨기기
     · [유튜브] 채널 주소·프로필 사진·영상 추가/삭제
     · [외주] 외주 작업 추가/수정/삭제
     · [영화] 필모그래피, 지금 만들고 있는 영화(프리/프로덕션/포스트)
     · [설정] 관리자 단축키, 사이트 이름, 인트로 단어
     · [저장] GitHub에 저장 → js/data.js 가 새로 저장되고 1~2분 뒤 사이트에 반영
   바뀐 내용은 저장 전까지 이 브라우저에만 임시로 남아요(다른 사람에게는 안 보여요).
   ===================================================================== */
(function(){
  var REPO={owner:'MINSE007',repo:'ms-portfolio',path:'js/data.js',branch:'main'};
  var S=window.SITE,MSP=window.MSP,root=document.documentElement,esc=MSP.esc;
  var panel=document.getElementById('admin');
  var ORIG=JSON.stringify(S);
  var on=false,tab='layout',saveT=0,renderT=0,recording=false;

  /* ── 저장소에 쓰는 data.js 머리말 ── */
  var HEADER=['/* =====================================================================',
    '   MS Portfolio — 사이트 내용 (글·작품·연락처는 전부 여기서 고쳐요)',
    '   ---------------------------------------------------------------------',
    '   · 따옴표 "..." 안의 글만 바꾸면 돼요. 쉼표(,)와 괄호는 지우지 마세요.',
    '   · 글 안의 \\n 은 "여기서 줄바꿈" 표시예요.',
    '   · 관리자 모드에서 고치고 "GitHub에 저장"을 누르면 이 파일이 통째로 새로 저장돼요.',
    '   · layout: 섹션 순서와 보이기(show) / film.films: 필모그래피',
    '     film.picks: 대표작 3편 / dasi: 다시, 변신 (steps 진행 상황: done 완료 · now 진행 중 · todo 예정)',
    '     역할: 연출 연출부 스크립터 / 촬영 촬영부 / 조명 조명부 / 음향 음향부 /',
    '           제작 PD 제작부 / 미술 미술부 / 편집 편집부 / 배우',
    '   ===================================================================== */',''].join('\n');
  function toFile(){return HEADER+'window.SITE = '+JSON.stringify(S,null,2)+';\n'}

  /* ── 경로로 값 쓰기 (예: "hero.facts.0.label") ── */
  function setPath(obj,path,val){
    var k=path.split('.'),o=obj;
    for(var i=0;i<k.length-1;i++){if(o[k[i]]==null)o[k[i]]=/^\d+$/.test(k[i+1])?[]:{};o=o[k[i]]}
    o[k[k.length-1]]=val;
  }
  function replaceSite(data){Object.keys(S).forEach(function(k){delete S[k]});Object.keys(data).forEach(function(k){S[k]=data[k]})}

  /* ── 단축키 ── */
  var DEF_KEY='Ctrl+Shift+E';
  function currentKey(){var k=null;try{k=localStorage.getItem('msp-shortcut')}catch(e){}return k||(S.admin&&S.admin.shortcut)||DEF_KEY}
  function keyName(e){
    var k=e.code&&/^Key[A-Z]$/.test(e.code)?e.code.slice(3):e.code&&/^Digit\d$/.test(e.code)?e.code.slice(5):(e.key.length===1?e.key.toUpperCase():e.key);
    if(['Control','Shift','Alt','Meta'].indexOf(e.key)>=0)return null;
    var p=[];if(e.ctrlKey)p.push('Ctrl');if(e.altKey)p.push('Alt');if(e.shiftKey)p.push('Shift');if(e.metaKey)p.push('Meta');
    p.push(k);return p.join('+');
  }
  function setKey(k){
    S.admin=S.admin||{};S.admin.shortcut=k;
    try{localStorage.setItem('msp-shortcut',k)}catch(e){}
    saveDraft();
  }

  /* ── 다시, 변신 진행 상황 편집 칸 ── */
  var STG=[['pre','프리 프로덕션'],['prod','프로덕션'],['post','포스트 프로덕션']];
  var STN=[['done','완료'],['now','진행 중'],['todo','예정']];
  function dasiEditor(){
    var D=S.dasi;if(!D)return '';D.steps=D.steps||{pre:[],prod:[],post:[]};
    return inp('dasi.video',D.video||'','① 영상 주소 (유튜브 · 비우면 \'영상 준비 중\')','url')+'<div class="ad-2">'+inp('dasi.director',D.director||'','감독')+inp('dasi.kind',D.kind||'','형식')+'</div>'+
      '<label class="ad-f"><span>지금 단계</span><select data-f="dasi.stage" id="ad-dstage">'+STG.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===(D.stage||'pre')?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label>'+
      STG.map(function(c){
        var list=D.steps[c[0]]||[];
        return '<div class="ad-sub sm"><span>'+c[1]+' · '+list.length+'개</span><button type="button" data-a="addStep" data-s="'+c[0]+'">+ 할 일</button></div>'+
          list.map(function(x,i){
            var p='dasi.steps.'+c[0]+'.'+i+'.';
            return '<div class="ad-card ad-2">'+inp(p+'name',x.name,'할 일')+
              '<label class="ad-f"><span>상태</span><select data-f="'+p+'state" id="ad-st-'+c[0]+'-'+i+'">'+STN.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===x.state?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></label>'+
              '<button type="button" class="ad-del" data-a="delStep" data-s="'+c[0]+'" data-i="'+i+'">삭제</button></div>';
          }).join('');
      }).join('');
  }

  /* ── 임시 저장 ── */
  function dirty(){return JSON.stringify(S)!==ORIG}
  function saveDraft(){
    clearTimeout(saveT);
    saveT=setTimeout(function(){
      try{if(dirty())localStorage.setItem('msp-draft',JSON.stringify(S));else localStorage.removeItem('msp-draft')}catch(e){}
      status();
      scheduleAuto();
    },250);
  }

  /* ── 화면 글자 바로 고치기 (Enter = 줄바꿈, Esc = 끝내기) ── */
  function makeEditable(){
    document.querySelectorAll('[data-edit]').forEach(function(n){
      if(on){
        try{n.contentEditable='plaintext-only'}catch(e){n.contentEditable='true'}
        if(n.contentEditable!=='plaintext-only')n.contentEditable='true';
        n.spellcheck=false;
      }else n.removeAttribute('contenteditable');
    });
  }
  (MSP.onRender=MSP.onRender||[]).push(function(){if(on){makeEditable();drawPanel()}});
  /* ── 글자 도구 (미리캔버스·포토샵처럼): 관리자 모드에서 글자를 누르면 위에 도구 막대가 뜸 ──
     크기 −/+ · 굵게 · 색 · 정렬 · 원래대로 → data.js 의 style 에 저장 (자동 저장) */
  var tb=null,tbEl=null;
  var SW=[['','기본','var(--text)'],['acc','보라','var(--acc)'],['muted','회색','var(--muted)'],['gold','노랑','var(--gold)'],['red','빨강','#E5484D']];
  function tbBuild(){
    tb=document.createElement('div');tb.id='adTool';tb.setAttribute('role','toolbar');tb.setAttribute('aria-label','글자 도구');
    tb.innerHTML='<button type="button" data-t="s-" title="작게">A−</button><b id="adTs">100%</b><button type="button" data-t="s+" title="크게">A+</button><i></i>'+
      '<button type="button" data-t="b" title="굵게" class="t-b">B</button><i></i>'+
      SW.map(function(c){return '<button type="button" data-t="c" data-v="'+c[0]+'" title="'+c[1]+'" class="t-sw"><span style="background:'+c[2]+'"></span></button>'}).join('')+'<i></i>'+
      '<button type="button" data-t="a" data-v="left" title="왼쪽 정렬">⇤</button><button type="button" data-t="a" data-v="center" title="가운데 정렬">↔</button><button type="button" data-t="a" data-v="right" title="오른쪽 정렬">⇥</button><i></i>'+
      '<button type="button" data-t="r" title="원래대로">↺</button>';
    document.body.appendChild(tb);
    tb.addEventListener('mousedown',function(e){e.preventDefault()}); // 누를 때 글자 선택이 풀리지 않게
    tb.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b||!tbEl)return;
      var path=tbEl.getAttribute('data-edit');S.style=S.style||{};var o=S.style[path]=Object.assign({},S.style[path]);
      var t=b.dataset.t;
      if(t==='s+')o.s=Math.min(3,Math.round(((o.s||1)+.1)*10)/10);
      else if(t==='s-')o.s=Math.max(.4,Math.round(((o.s||1)-.1)*10)/10);
      else if(t==='b')o.b=o.b===900?400:900;
      else if(t==='c'){if(b.dataset.v)o.c=b.dataset.v;else delete o.c}
      else if(t==='a')o.a=o.a===b.dataset.v?'':b.dataset.v;
      else if(t==='r'){delete S.style[path];o=null}
      if(o){if(o.s===1)delete o.s;if(!o.a)delete o.a;if(!Object.keys(o).length)delete S.style[path]}
      MSP.applyStyles&&MSP.applyStyles();tbSync();tbPlace();saveDraft();
    });
  }
  function tbSync(){
    if(!tb||!tbEl)return;var o=((S.style||{})[tbEl.getAttribute('data-edit')])||{};
    document.getElementById('adTs').textContent=Math.round((o.s||1)*100)+'%';
    tb.querySelector('.t-b').classList.toggle('on',o.b===900);
    tb.querySelectorAll('.t-sw').forEach(function(x){x.classList.toggle('on',(x.dataset.v||'')===(o.c||''))});
    tb.querySelectorAll('[data-t="a"]').forEach(function(x){x.classList.toggle('on',x.dataset.v===o.a)});
  }
  function tbPlace(){
    if(!tb||!tbEl)return;var r=tbEl.getBoundingClientRect();
    var top=r.top-tb.offsetHeight-10;if(top<70)top=r.bottom+10;
    tb.style.top=Math.round(top)+'px';tb.style.left=Math.round(Math.max(8,Math.min(innerWidth-tb.offsetWidth-8,r.left)))+'px';
  }
  document.addEventListener('focusin',function(e){
    if(!on)return;var el=e.target.closest&&e.target.closest('[data-edit]');
    if(!el||panel.contains(el)){return}
    if(!tb)tbBuild();tbEl=el;tb.hidden=false;
    document.querySelectorAll('.ad-sel').forEach(function(x){x.classList.remove('ad-sel')});el.classList.add('ad-sel');
    tbSync();tbPlace();
  });
  document.addEventListener('focusout',function(e){
    setTimeout(function(){if(tb&&!(document.activeElement&&document.activeElement.closest&&document.activeElement.closest('[data-edit]'))){tb.hidden=true;if(tbEl)tbEl.classList.remove('ad-sel');tbEl=null}},150);
  });
  window.addEventListener('scroll',function(){if(tb&&!tb.hidden)tbPlace()},{passive:true});

  // 화면에서 바로 고친 것(진행 상황 등)을 임시 저장하고 다시 그림
  MSP.adminCommit=function(){saveDraft();MSP.render()};
  document.addEventListener('input',function(e){
    if(!on)return;
    var n=e.target.closest&&e.target.closest('[data-edit]');
    if(!n||panel.contains(n))return;
    var v=n.innerText.replace(/ /g,' ').replace(/[ \t]*\n[ \t]*/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
    if(n.dataset.list)v=v.split(/\s*[·,\n]\s*/).filter(Boolean);
    setPath(S,n.getAttribute('data-edit'),v);
    saveDraft();
  });
  document.addEventListener('keydown',function(e){
    if(on&&e.key==='Escape'&&e.target.closest&&e.target.closest('[data-edit]')){e.target.blur()}
  });
  // 관리자 모드에서는 링크를 눌러도 이동하지 않게 (글자를 고쳐야 하니까)
  document.addEventListener('click',function(e){
    if(on&&!panel.contains(e.target)&&e.target.closest('a')){e.preventDefault()}
  },true);

  /* ── 패널 ── */
  function inp(path,val,label,type,extra){
    var id='ad-'+path.replace(/[^a-z0-9]/gi,'-');
    return '<label class="ad-f" for="'+id+'"><span>'+label+'</span><input id="'+id+'"'+(type?' type="'+type+'"':'')+' data-f="'+path+'"'+(extra||'')+' value="'+esc(val==null?'':val)+'"></label>';
  }
  function rng(path,label,min,max){
    var v=path.split('.').reduce(function(o,k){return o&&o[k]},S);v=typeof v==='number'?v:1;var id='ad-'+path.replace(/[^a-z0-9]/gi,'-');
    return '<label class="ad-f" for="'+id+'"><span>'+label+' <b id="'+id+'-v">'+Math.round(v*100)+'%</b></span><input id="'+id+'" type="range" min="'+min+'" max="'+max+'" step=".05" data-f="'+path+'" value="'+v+'"></label>';
  }
  function area(path,val,label){
    var id='ad-'+path.replace(/[^a-z0-9]/gi,'-');
    return '<label class="ad-f" for="'+id+'"><span>'+label+'</span><textarea id="'+id+'" rows="3" data-f="'+path+'">'+esc(val==null?'':val)+'</textarea></label>';
  }
  var TABS=[['layout','배치'],['yt','유튜브'],['out','외주'],['film','영화'],['ed','편집'],['set','설정'],['save','저장']];
  function drawPanel(){
    if(!on)return;
    var html='<div class="ad-head"><b>관리자 모드</b><span class="ad-tag">'+esc(currentKey())+'</span><button type="button" class="ad-x" data-a="off" aria-label="관리자 모드 끄기">끄기</button><button type="button" data-a="logout">로그아웃</button></div>'+
      '<button type="button" class="ad-auto" id="adAuto" data-tab="save"></button>'+
      '<div class="ad-tabs">'+TABS.map(function(t){return '<button type="button" data-tab="'+t[0]+'" aria-pressed="'+(tab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div><div class="ad-body">';
    if(tab==='layout'){
      html+='<p class="ad-tip">글자는 화면에서 <b>점선 테두리</b>가 있는 곳을 눌러 바로 고치면 돼요.<br><b>Enter</b>는 줄바꿈, <b>Esc</b>는 끝내기예요.</p><ol class="ad-list">'+
        S.layout.map(function(x,i){
          return '<li><span class="ad-name">'+esc((S[x.id]&&S[x.id].title)||MSP.NAMES[x.id]||x.id)+'</span>'+
            '<label class="ad-chk"><input type="checkbox" id="ad-show-'+x.id+'" data-a="show" data-i="'+i+'"'+(x.show!==false?' checked':'')+'> 보이기</label>'+
            '<button type="button" data-a="up" data-i="'+i+'"'+(i===0?' disabled':'')+' aria-label="위로">↑</button>'+
            '<button type="button" data-a="down" data-i="'+i+'"'+(i===S.layout.length-1?' disabled':'')+' aria-label="아래로">↓</button></li>';
        }).join('')+'</ol>';
    }else if(tab==='yt'){
      var ch=S.youtube.channel,V=S.youtube.videos||[];
      html+=inp('youtube.channel.url',ch.url,'채널 주소','url')+inp('youtube.channel.avatar',ch.avatar,'프로필 사진 주소 (비워두면 글자 아이콘)','url')+
        area('youtube.channel.desc',ch.desc,'채널 설명 (Enter로 줄바꿈)')+
        '<div class="ad-sub"><b>영상 '+V.length+'개</b><button type="button" data-a="addVid">+ 영상 추가</button></div>'+
        V.map(function(v,i){
          return '<div class="ad-card">'+inp('youtube.videos.'+i+'.title',v.title,'제목')+
            inp('youtube.videos.'+i+'.id','https://www.youtube.com/watch?v='+v.id,'영상 주소','url',' data-yt="1"')+
            '<button type="button" class="ad-del" data-a="delVid" data-i="'+i+'">이 영상 삭제</button></div>';
        }).join('');
    }else if(tab==='out'){
      var W=(S.outsource&&S.outsource.works)||[];
      html+='<p class="ad-tip">영상 주소를 넣으면 카드에 "영상 보기" 버튼이 생겨요. 연도는 비워둬도 돼요.</p>'+
        '<div class="ad-sub"><b>외주 작업 '+W.length+'개</b><button type="button" data-a="addWork">+ 외주 추가</button></div>'+
        W.map(function(w,i){
          var p='outsource.works.'+i+'.';
          return '<div class="ad-card">'+inp(p+'title',w.title,'제목')+'<div class="ad-2">'+inp(p+'client',w.client,'의뢰')+inp(p+'year',w.year,'연도')+'</div>'+
            inp(p+'role',w.role,'맡은 일')+area(p+'desc',w.desc,'설명')+inp(p+'link',w.link,'영상 주소','url')+
            '<button type="button" class="ad-del" data-a="delWork" data-i="'+i+'">이 외주 삭제</button></div>';
        }).join('');
    }else if(tab==='film'){
      var F=S.film,st=F.stages||{};
      html+='<div class="ad-sub"><b>대표작 3편</b></div><p class="ad-tip">영상 주소를 넣으면 영상이 나와요. 제목을 비우면 \'준비 중입니다\' 칸이 돼요.</p>'+
        (F.picks||[]).map(function(x,i){
          var p='film.picks.'+i+'.';
          return '<div class="ad-card">'+'<div class="ad-2">'+inp(p+'title',x.title,'제목')+inp(p+'sub',x.sub,'부제')+'</div>'+
            '<div class="ad-2">'+inp(p+'year',x.year,'연도')+inp(p+'role',x.role,'맡은 일')+'</div>'+
            area(p+'desc',x.desc,'개요 (시놉시스)')+inp(p+'video',x.video,'영상 주소 (유튜브)','url')+'</div>';
        }).join('')+
        '<div class="ad-sub"><b>다시, 변신 · 진행 상황</b></div>'+dasiEditor()+
        '<div class="ad-sub"><b>필모그래피 '+F.films.length+'편</b><button type="button" data-a="addFilm">+ 작품 추가</button></div>'+
        '<p class="ad-tip">역할·기록은 쉼표(,)로 나눠 적어요. 기록에는 수상·상영 이력을 넣으면 작품 옆에 나와요.</p>'+
        F.films.map(function(f,i){
          var p='film.films.'+i+'.';
          return '<div class="ad-card">'+inp(p+'title',f.title,'제목')+
            '<div class="ad-2">'+inp(p+'year',f.year,'연도','number')+inp(p+'roles',(f.roles||[]).join(', '),'역할','',' data-list="1"')+'</div>'+
            inp(p+'records',(f.records||[]).join(', '),'기록','',' data-list="1"')+inp(p+'note',f.note||'','오른쪽 메모 (예: 프리 프로덕션 진행 중 · 비우면 사라져요)')+
            '<button type="button" class="ad-del" data-a="delFilm" data-i="'+i+'">이 작품 삭제</button></div>';
        }).join('');
    }else if(tab==='ed'){
      var E=S.edit;E.timeline=E.timeline||{years:[],tracks:[],clips:[]};var TL=E.timeline;TL.clips=TL.clips||[];
      var yo=function(sel){return (TL.years||[]).map(function(y,i){return '<option value="'+i+'"'+(i===sel?' selected':'')+'>'+esc(y)+'</option>'}).join('')};
      var to=function(sel){return (TL.tracks||[]).map(function(t){return '<option'+(t===sel?' selected':'')+'>'+esc(t)+'</option>'}).join('')};
      html+='<p class="ad-tip">프리미어 시퀀스처럼 보이는 타임라인이에요. 클립 = 줄 위에 놓이는 막대.<br>스크롤하면 빨간 재생선이 지나가며 닿은 클립의 제목·설명이 위 화면에 나와요.</p>'+
        inp('edit.timeline.name',TL.name||'','시퀀스 이름 (맨 위 탭)')+
        inp('edit.timeline.years',(TL.years||[]).join(', '),'눈금 (쉼표로 나눔, 왼쪽부터)','',' data-list="1"')+
        inp('edit.timeline.tracks',(TL.tracks||[]).join(', '),'줄 이름 (V = 영상 · 보라 / A = 소리 · 초록)','',' data-list="1"')+
        '<div class="ad-sub"><b>클립 '+TL.clips.length+'개</b><button type="button" data-a="addClip">+ 클립 추가</button></div>'+
        TL.clips.map(function(c,i){
          var p='edit.timeline.clips.'+i+'.';
          return '<div class="ad-card">'+inp(p+'title',c.title,'제목')+
            '<div class="ad-2"><label class="ad-f"><span>줄</span><select data-f="'+p+'track" id="ad-ct-'+i+'">'+to(c.track)+'</select></label>'+
            '<label class="ad-f"><span>시작</span><select data-f="'+p+'from" data-num="1" id="ad-cf-'+i+'">'+yo(+c.from||0)+'</select></label></div>'+
            '<div class="ad-2"><label class="ad-f"><span>끝</span><select data-f="'+p+'to" data-num="1" id="ad-cto-'+i+'">'+yo(c.to==null?+c.from||0:+c.to)+'</select></label><span></span></div>'+
            area(p+'desc',c.desc,'설명 (재생선이 닿으면 위 화면에 나와요)')+
            '<button type="button" class="ad-del" data-a="delClip" data-i="'+i+'">이 클립 삭제</button></div>';
        }).join('');
    }else if(tab==='set'){
      S.ui=S.ui||{};S.intro=S.intro||{};var sl=S.intro.slate=S.intro.slate||{};
      html+='<div class="ad-sub"><b>관리자 모드 단축키</b></div>'+
        '<div class="ad-key"><kbd id="adKey">'+esc(currentKey())+'</kbd><button type="button" data-a="recKey" id="adRec">'+(recording?'키를 눌러 주세요…':'바꾸기')+'</button><button type="button" data-a="resetKey">처음대로</button></div>'+
        '<p class="ad-tip">"바꾸기"를 누른 뒤 원하는 조합을 누르면 돼요. 예: Ctrl+Alt+M<br>Ctrl·Alt 중 하나는 꼭 같이 눌러야 해요. 이 컴퓨터에는 바로 적용되고, 다른 컴퓨터에는 GitHub에 저장한 뒤 적용돼요.</p>'+
        '<div class="ad-sub"><b>화면 크기</b><button type="button" data-a="resetUI">처음대로</button></div>'+
        rng('ui.zoom','전체 크기 (글자·카드 모두)',.8,1.25)+rng('ui.hero','첫 화면 큰 제목',.6,1.3)+rng('ui.title','섹션 제목 (유튜브·영화…)',.6,1.4)+rng('ui.gap','섹션 사이 간격',.5,1.5)+
        '<div class="ad-sub"><b>인트로 슬레이트</b></div>'+
        '<div class="ad-2">'+inp('intro.slate.studio',sl.studio,'제작사')+inp('intro.slate.director',sl.director,'디렉터')+'</div>'+
        '<div class="ad-2">'+inp('intro.slate.scene',sl.scene,'씬')+inp('intro.slate.cut',sl.cut,'컷')+'</div>'+inp('intro.slate.take',sl.take,'테이크')+
        '<div class="ad-sub"><b>사이트</b></div>'+inp('site.name',S.site.name,'사이트 이름 (왼쪽 위 로고)')+
        inp('intro.cuts',((S.intro&&S.intro.cuts)||[]).join(', '),'인트로 단어 (쉼표로 나눔, 순서대로 나와요)','',' data-list="1"')+
        '<button type="button" data-a="playIntro">인트로 미리 보기</button>';
    }else{
      var tok='';try{tok=localStorage.getItem('msp-gh-token')||''}catch(e){}
      html+='<p class="ad-state" id="adState"></p>'+
        '<div class="ad-sub"><b>GitHub에 저장</b></div>'+
        '<p class="ad-tip">GitHub에서 만든 <b>토큰</b>을 한 번 넣어두면 이 컴퓨터에서는 계속 쓸 수 있어요. 토큰은 이 브라우저에만 저장되고 사이트 파일에는 들어가지 않아요.</p>'+
        '<label class="ad-f" for="adToken"><span>토큰</span><input id="adToken" type="password" autocomplete="off" placeholder="github_pat_…" value="'+esc(tok)+'"></label>'+
        '<button type="button" data-a="autoToggle">'+(autoOn()?'✓ 자동 저장 켜짐 (끄기)':'자동 저장 꺼짐 (켜기)')+'</button>'+
        '<p class="ad-tip">자동 저장이 켜져 있으면 고치고 2초 뒤 저절로 저장되고, 1분쯤 뒤 모든 사람 화면에 반영돼요.</p>'+
        '<button type="button" class="ad-main" data-a="push">지금 바로 저장</button>'+
        '<p class="ad-msg" id="adMsg" role="status"></p>'+
        '<div class="ad-sub"><b>다른 방법</b></div>'+
        '<button type="button" data-a="copy">data.js 내용 복사</button>'+
        '<button type="button" class="ad-del" data-a="discard">바뀐 내용 모두 버리기</button>';
    }
    var keepScroll=panel.querySelector('.ad-body');keepScroll=keepScroll?keepScroll.scrollTop:0;
    panel.innerHTML=html+'</div>';
    var body=panel.querySelector('.ad-body');if(body)body.scrollTop=keepScroll;
    status();
    setChip(!autoOn()?'off':!getToken()?'notoken':dirty()?'wait':'ok');
  }
  function status(){
    var n=document.getElementById('adState');
    if(n)n.textContent=dirty()?'● 저장 안 된 변경이 있어요. (이 브라우저에 임시 보관 중)':'바뀐 내용이 없어요.';
    panel.classList.toggle('is-dirty',dirty());
  }
  function msg(t,ok){var n=document.getElementById('adMsg');if(n){n.textContent=t;n.className='ad-msg'+(ok?' ok':' err')}}
  function ytId(v){var m=String(v).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,})/);return m?m[1]:String(v).trim()}

  panel.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.dataset.tab){tab=b.dataset.tab;recording=false;drawPanel();return}
    var a=b.dataset.a,i=+b.dataset.i,L=S.layout,F=S.film;
    if(a==='off'){setOn(false);return}
    if(a==='logout'){try{sessionStorage.removeItem(AUTH_KEY)}catch(err){}setOn(false);return}
    if(a==='recKey'){recording=true;drawPanel();return}
    if(a==='resetKey'){try{localStorage.removeItem('msp-shortcut')}catch(err){}setKey(DEF_KEY);drawPanel();return}
    if(a==='playIntro'){setOn(false);setTimeout(function(){MSP.playIntro&&MSP.playIntro()},50);return}
    if(a==='up'&&i>0){L.splice(i-1,0,L.splice(i,1)[0])}
    else if(a==='down'&&i<L.length-1){L.splice(i+1,0,L.splice(i,1)[0])}
    else if(a==='addVid'){S.youtube.videos=S.youtube.videos||[];S.youtube.videos.push({title:'새 영상',id:''})}
    else if(a==='delVid'){S.youtube.videos.splice(i,1)}
    else if(a==='addFilm'){F.films.unshift({title:'새 작품',year:new Date().getFullYear(),roles:[],records:[]})}
    else if(a==='delFilm'){F.films.splice(i,1)}
    else if(a==='addClip'){var TL=S.edit.timeline;TL.clips=TL.clips||[];TL.clips.push({track:(TL.tracks||['V1'])[Math.min(2,(TL.tracks||[]).length-1)]||'V1',from:0,to:0,title:'새 클립',desc:''})}
    else if(a==='delClip'){S.edit.timeline.clips.splice(i,1)}
    else if(a==='addStep'){var D=S.dasi;D.steps=D.steps||{};(D.steps[b.dataset.s]=D.steps[b.dataset.s]||[]).push({name:'새 할 일',state:'todo'})}
    else if(a==='delStep'){S.dasi.steps[b.dataset.s].splice(i,1)}
    else if(a==='addWork'){
      if(!S.outsource)S.outsource={en:'OUTSOURCING',badge:'WORK',title:'외주',desc:'',works:[]};
      if(!S.layout.some(function(x){return x.id==='outsource'}))S.layout.splice(1,0,{id:'outsource',show:true});
      S.outsource.works.unshift({title:'새 외주 작업',client:'',year:'',role:'',desc:'',link:''});
    }
    else if(a==='delWork'){S.outsource.works.splice(i,1)}
    else if(a==='copy'){
      var t=toFile();
      try{navigator.clipboard.writeText(t).then(function(){msg('복사했어요. GitHub의 js/data.js 에 붙여 넣으면 돼요.',true)},function(){msg('복사가 막혀 있어요. GitHub에 저장 버튼을 써 주세요.')})}catch(err){msg('복사가 막혀 있어요.')}
      return;
    }
    else if(a==='discard'){
      try{localStorage.removeItem('msp-draft')}catch(err){}
      replaceSite(JSON.parse(ORIG));MSP.render();msg('바뀐 내용을 모두 버리고 원래대로 돌렸어요.',true);return;
    }
    else if(a==='push'){push(false);return}
    else if(a==='resetUI'){S.ui={zoom:1,hero:1,title:1,gap:1};MSP.applyUI&&MSP.applyUI();saveDraft();drawPanel();return}
    else if(a==='autoToggle'){try{localStorage.setItem('msp-auto',autoOn()?'0':'1')}catch(err){}drawPanel();scheduleAuto();return}
    else return;
    saveDraft();MSP.render();
  });
  panel.addEventListener('change',function(e){
    var c=e.target;
    if(c.dataset.a==='show'){S.layout[+c.dataset.i].show=c.checked;saveDraft();MSP.render()}
  });
  panel.addEventListener('input',function(e){
    var c=e.target,p=c.dataset.f;if(!p)return;
    var v=c.value;
    if(c.dataset.list)v=v.split(',').map(function(s){return s.trim()}).filter(Boolean);
    else if(c.type==='number'||c.dataset.num)v=parseInt(v,10)||0;
    else if(c.type==='range'){v=parseFloat(v)||1;var rl=document.getElementById(c.id+'-v');if(rl)rl.textContent=Math.round(v*100)+'%';setPath(S,p,v);MSP.applyUI&&MSP.applyUI();saveDraft();return}
    else if(c.dataset.yt)v=ytId(v);
    setPath(S,p,v);saveDraft();
    // 패널 입력칸에 커서가 있으니 본문만 다시 그림
    clearTimeout(renderT);renderT=setTimeout(renderPage,400);
  });
  // 패널은 그대로 두고 본문만 다시 그림 (입력 중인 칸이 사라지지 않게)
  function renderPage(){var hook=MSP.onRender;MSP.onRender=[function(){if(on)makeEditable()}];try{MSP.render()}finally{MSP.onRender=hook}}

  /* ── GitHub에 저장 ── */
  function b64(str){var bytes=new TextEncoder().encode(str),bin='';for(var i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);return btoa(bin)}
  /* 저장 방식: 고치고 2초 동안 손을 멈추면 GitHub에 자동 저장 (토큰이 있을 때) → 1분쯤 뒤 모든 사람 화면에 반영
     저장 중에 또 고치면 끝난 뒤 한 번 더 저장 (순서대로 하나씩) */
  var busy=false,again=false,lastSha=null,autoT=0;
  function getToken(){var el=document.getElementById('adToken');var t=(el&&el.value||'').trim();if(!t){try{t=localStorage.getItem('msp-gh-token')||''}catch(e){}}return t}
  function autoOn(){try{return localStorage.getItem('msp-auto')!=='0'}catch(e){return true}}
  function scheduleAuto(){clearTimeout(autoT);if(!on||!autoOn()||!getToken()||!dirty())return;setChip('wait');autoT=setTimeout(function(){push(true)},2000)}
  function setChip(st,extra){
    var c=document.getElementById('adAuto');if(!c)return;
    var T={off:'자동 저장 꺼짐',notoken:'토큰을 넣으면 자동 저장돼요',wait:'고치는 중…',saving:'저장하는 중…',ok:'✓ 저장됨 · 1분쯤 뒤 사이트에 반영',err:'저장 실패 — [저장] 탭 확인'};
    c.textContent=T[st]+(extra?' '+extra:'');c.className='ad-auto st-'+st;
  }
  async function push(silent){
    var token=getToken();
    if(!token){if(!silent)msg('토큰을 먼저 넣어 주세요.');setChip('notoken');return}
    if(busy){again=true;return}
    busy=true;
    try{localStorage.setItem('msp-gh-token',token)}catch(e){}
    var api='https://api.github.com/repos/'+REPO.owner+'/'+REPO.repo+'/contents/'+REPO.path;
    var h={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json'};
    var snap=JSON.stringify(S);
    if(!silent)msg('저장하는 중…',true);setChip('saving');
    var fail=function(t){busy=false;msg(t);setChip('err')};
    try{
      for(var tryN=0;tryN<2;tryN++){
        if(!lastSha||tryN>0){
          var r=await fetch(api+'?ref='+REPO.branch,{headers:h,cache:'no-store'});
          if(r.status===401)return fail('토큰이 맞지 않아요. 토큰을 다시 확인해 주세요.');
          if(r.status===403||r.status===404)return fail('이 토큰으로는 저장소에 들어갈 수 없어요. 토큰에 ms-portfolio 저장소의 Contents 읽기/쓰기 권한을 주세요.');
          if(!r.ok)return fail('GitHub이 응답하지 않아요 ('+r.status+'). 잠시 뒤 다시 해 주세요.');
          lastSha=(await r.json()).sha;
        }
        var w=await fetch(api,{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},h),
          body:JSON.stringify({message:'관리자 모드에서 내용 수정',content:b64(toFile()),sha:lastSha,branch:REPO.branch})});
        if(w.status===409||w.status===422){lastSha=null;continue} // 그 사이 파일이 바뀜 → 새로 읽고 한 번 더
        if(w.status===403||w.status===404)return fail('토큰에 쓰기 권한이 없어요. Contents 권한을 "읽기/쓰기"로 해 주세요.');
        if(!w.ok)return fail('저장에 실패했어요 ('+w.status+').');
        try{lastSha=(await w.json()).content.sha}catch(e){lastSha=null}
        ORIG=snap;try{if(!dirty())localStorage.removeItem('msp-draft')}catch(e){}
        busy=false;status();setChip('ok');if(!silent)msg('저장했어요! 1분쯤 뒤 사이트에 반영돼요.',true);
        if(again||dirty()){again=false;scheduleAuto()}
        return;
      }
      fail('그 사이 파일이 여러 번 바뀌었어요. 잠시 뒤 다시 해 주세요.');
    }catch(err){
      fail('이 화면에서는 GitHub에 연결할 수 없어요. (Claude 미리보기 화면은 외부 연결이 막혀 있어요. 실제 사이트에서 해 주세요.)');
    }
  }

  /* ── 켜기 / 끄기 ── */
  function setOn(v){
    if(v===on)return;on=v;
    root.classList.toggle('admin',on);
    panel.hidden=!on;
    if(on){
      if(MSP.skipIntro)MSP.skipIntro();
      var d=null;try{d=JSON.parse(localStorage.getItem('msp-draft')||'null')}catch(e){}
      if(d&&d.site&&d.film){
        // 예전 임시본에 없는 새 항목은 원본에서 채워 넣기
        var o=JSON.parse(ORIG);Object.keys(o).forEach(function(k){if(!(k in d))d[k]=o[k]});
        if(d.dasi&&!d.dasi.steps&&o.dasi){d.dasi.steps=o.dasi.steps;d.dasi.stage=o.dasi.stage}
        if(!d.film.picks)d.film.picks=o.film.picks;
        if(d.edit&&!d.edit.timeline&&o.edit)d.edit.timeline=o.edit.timeline;
        (o.layout||[]).forEach(function(x,i){if(!d.layout.some(function(y){return y.id===x.id}))d.layout.splice(Math.min(i,d.layout.length),0,x)});
        replaceSite(d);
      }
      MSP.render();
      if(d){tab='save';drawPanel();msg('지난번에 저장 안 한 변경을 불러왔어요.',true)}
    }else{
      recording=false;makeEditable();if(tb)tb.hidden=true;
      if(location.hash==='#admin')try{history.replaceState(null,'',location.pathname+location.search)}catch(e){location.hash=''}
    }
  }
  /* ── 관리자 로그인 (맨 아래 '관리자 로그인' · 단축키 · 주소 끝 #admin) ──
     비밀번호는 파일에 그대로 적지 않고, 암호처럼 바꾼 값(SHA-256)만 넣어 둠.
     ※ 이 로그인은 '편집 화면'을 여는 문이에요. 실제 사이트에 저장하는 건 GitHub 토큰이 있어야만 돼요. */
  var AUTH_KEY='msp-auth',AUTH_HASH='7dff07c1895eb0cb8961bfcac30d129cfabdb30d23d157c8f11b1c83e0d03bd7';
  function authed(){try{return sessionStorage.getItem(AUTH_KEY)===AUTH_HASH}catch(e){return false}}
  async function sha(t){var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
  var box=null;
  function showLogin(){
    if(!box){
      box=document.createElement('div');box.id='adLogin';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','관리자 로그인');
      box.innerHTML='<form class="al-card" autocomplete="on"><div class="al-head"><span class="badge-ms">MS</span><b>관리자 로그인</b></div>'+
        '<label class="ad-f" for="alId"><span>아이디</span><input id="alId" name="username" autocomplete="username" required></label>'+
        '<label class="ad-f" for="alPw"><span>비밀번호</span><input id="alPw" name="password" type="password" autocomplete="current-password" required></label>'+
        '<p class="al-msg" id="alMsg" role="status"></p>'+
        '<div class="al-btns"><button type="button" class="al-x" data-al="close">닫기</button><button type="submit" class="al-go">로그인</button></div></form>';
      document.body.appendChild(box);
      box.addEventListener('click',function(e){if(e.target===box||e.target.closest('[data-al="close"]'))hideLogin()});
      box.querySelector('form').addEventListener('submit',async function(e){
        e.preventDefault();var m=document.getElementById('alMsg');
        var id=document.getElementById('alId').value.trim(),pw=document.getElementById('alPw').value;
        var h='';try{h=await sha('msp-admin-v1|'+id+'|'+pw)}catch(err){m.textContent='이 화면에서는 로그인할 수 없어요. (https 주소에서 열어 주세요)';return}
        if(h!==AUTH_HASH){m.textContent='아이디 또는 비밀번호가 맞지 않아요.';document.getElementById('alPw').value='';return}
        try{sessionStorage.setItem(AUTH_KEY,h)}catch(err){}
        hideLogin();setOn(true);
      });
    }
    box.hidden=false;document.getElementById('alMsg').textContent='';
    setTimeout(function(){var f=document.getElementById('alId');if(f)f.focus()},30);
  }
  function hideLogin(){if(box){box.hidden=true;document.getElementById('alPw').value=''}}
  function requestOn(){if(on)return;if(authed())setOn(true);else showLogin()}
  MSP.adminLogin=requestOn;
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box&&!box.hidden)hideLogin()});
  if(location.hash==='#admin')requestOn();
  window.addEventListener('hashchange',function(){if(location.hash==='#admin')requestOn()});
  document.addEventListener('keydown',function(e){
    // 새 단축키 기록 중
    if(recording){
      var k=keyName(e);if(!k)return;e.preventDefault();
      if(e.key==='Escape'){recording=false;drawPanel();return}
      if(!(e.ctrlKey||e.altKey||e.metaKey)){var n=document.getElementById('adKey');if(n)n.textContent='Ctrl이나 Alt를 같이 눌러 주세요';return}
      recording=false;setKey(k);drawPanel();return;
    }
    var name=keyName(e);
    if(name&&name.toLowerCase()===currentKey().toLowerCase()){e.preventDefault();if(on)setOn(false);else requestOn()}
  });
  document.addEventListener('click',function(e){
    if(e.target.closest('#adminLogin')){e.preventDefault();if(on)setOn(false);else requestOn();return}
    if(e.detail===3&&e.target.closest('#copyR')&&!on)requestOn();
  });
})();
