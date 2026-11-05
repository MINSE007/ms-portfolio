/* =====================================================================
   admin.js — 관리자 모드 (시험판)
   켜는 법: 주소 끝에 #admin 을 붙이거나, Ctrl+Shift+E, 또는 맨 아래 © 글자를 세 번 클릭
   할 수 있는 것:
     · 화면의 글자(점선 테두리)를 눌러서 바로 고치기
     · 섹션 순서 바꾸기 / 숨기기
     · 영화 작품·준비 중 작품 추가·수정·삭제
     · GitHub에 저장 → js/data.js 가 새로 저장되고 1~2분 뒤 사이트에 반영
   바뀐 내용은 저장 전까지 이 브라우저에만 임시로 남아요(다른 사람에게는 안 보여요).
   ===================================================================== */
(function(){
  var REPO={owner:'MINSE007',repo:'ms-portfolio',path:'js/data.js',branch:'main'};
  var S=window.SITE,MSP=window.MSP,root=document.documentElement,esc=MSP.esc;
  var panel=document.getElementById('admin');
  var ORIG=JSON.stringify(S);
  var on=false,tab='layout',saveT=0,renderT=0;

  /* ── 저장소에 쓰는 data.js 머리말 ── */
  var HEADER=['/* =====================================================================',
    '   MS Portfolio — 사이트 내용 (글·작품·연락처는 전부 여기서 고쳐요)',
    '   ---------------------------------------------------------------------',
    '   · 따옴표 "..." 안의 글만 바꾸면 돼요. 쉼표(,)와 괄호는 지우지 마세요.',
    '   · 관리자 모드(주소 끝에 #admin)에서 고치고 "GitHub에 저장"을 누르면',
    '     이 파일이 통째로 새로 저장돼요.',
    '   · 숫자(참여한 영화·수상·제작 예정)는 작품 목록을 세서 자동으로 나와요.',
    '   · layout: 섹션 순서와 보이기(show), film.films: 작품 목록',
    '     역할: 연출 연출부 스크립터 / 촬영 촬영부 / 조명 조명부 / 음향 음향부 /',
    '           제작 PD 제작부 / 미술 미술부 / 편집 편집부 / 배우',
    '     기록: 수상·입선·감독상·장상·은상·동상 → ★수상, 출품 → 바로 보임, 나머지 → 접힘',
    '   ===================================================================== */',''].join('\n');
  function toFile(){return HEADER+'window.SITE = '+JSON.stringify(S,null,2)+';\n'}

  /* ── 경로로 값 읽고 쓰기 (예: "hero.facts.0.label") ── */
  function setPath(obj,path,val){
    var k=path.split('.'),o=obj;
    for(var i=0;i<k.length-1;i++){o=o[k[i]];if(o==null)return}
    o[k[k.length-1]]=val;
  }
  function replaceSite(data){Object.keys(S).forEach(function(k){delete S[k]});Object.keys(data).forEach(function(k){S[k]=data[k]})}

  /* ── 임시 저장 ── */
  function dirty(){return JSON.stringify(S)!==ORIG}
  function saveDraft(){
    clearTimeout(saveT);
    saveT=setTimeout(function(){
      try{if(dirty())localStorage.setItem('msp-draft',JSON.stringify(S));else localStorage.removeItem('msp-draft')}catch(e){}
      status();
    },250);
  }
  function rerender(){clearTimeout(renderT);renderT=setTimeout(function(){MSP.render()},350)}

  /* ── 화면 글자 바로 고치기 ── */
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
  document.addEventListener('input',function(e){
    if(!on)return;
    var n=e.target.closest&&e.target.closest('[data-edit]');
    if(!n||panel.contains(n))return;
    setPath(S,n.getAttribute('data-edit'),n.innerText.replace(/\s*\n\s*/g,' ').trim());
    saveDraft();
  });
  document.addEventListener('keydown',function(e){
    if(on&&e.key==='Enter'&&e.target.closest&&e.target.closest('[data-edit]')){e.preventDefault();e.target.blur()}
  });
  // 관리자 모드에서는 링크를 눌러도 이동하지 않게 (글자를 고쳐야 하니까)
  document.addEventListener('click',function(e){
    if(on&&!panel.contains(e.target)&&e.target.closest('a')){e.preventDefault()}
  },true);

  /* ── 패널 ── */
  function row(label,inner){return '<label class="ad-f"><span>'+label+'</span>'+inner+'</label>'}
  function drawPanel(){
    if(!on)return;
    var html='<div class="ad-head"><b>관리자 모드</b><span class="ad-tag">시험판</span><button type="button" class="ad-x" data-a="off" aria-label="관리자 모드 끄기">끄기</button></div>'+
      '<div class="ad-tabs">'+[['layout','배치'],['out','외주'],['film','영화'],['save','저장']].map(function(t){return '<button type="button" data-tab="'+t[0]+'" aria-pressed="'+(tab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div><div class="ad-body">';
    if(tab==='layout'){
      html+='<p class="ad-tip">글자는 화면에서 <b>점선 테두리</b>가 있는 곳을 눌러 바로 고치면 돼요.</p><ol class="ad-list">'+
        S.layout.map(function(x,i){
          return '<li><span class="ad-name">'+esc(MSP.NAMES[x.id]||x.id)+'</span>'+
            '<label class="ad-chk"><input type="checkbox" id="ad-show-'+x.id+'" data-a="show" data-i="'+i+'"'+(x.show!==false?' checked':'')+'> 보이기</label>'+
            '<button type="button" data-a="up" data-i="'+i+'"'+(i===0?' disabled':'')+' aria-label="위로">↑</button>'+
            '<button type="button" data-a="down" data-i="'+i+'"'+(i===S.layout.length-1?' disabled':'')+' aria-label="아래로">↓</button></li>';
        }).join('')+'</ol>';
    }else if(tab==='out'){
      var W=(S.outsource&&S.outsource.works)||[];
      html+='<p class="ad-tip">영상 주소를 넣으면 카드에 "영상 보기" 버튼이 생겨요.</p>'+
        '<div class="ad-sub"><b>외주 작업 '+W.length+'개</b><button type="button" data-a="addWork">+ 외주 추가</button></div>'+
        W.map(function(w,i){
          var f=function(k,label,type){return row(label,'<input id="ad-w'+k+'-'+i+'"'+(type?' type="'+type+'"':'')+' data-f="outsource.works.'+i+'.'+k+'" value="'+esc(w[k])+'">')};
          return '<div class="ad-card">'+f('title','제목')+'<div class="ad-2">'+f('client','의뢰')+f('year','연도')+'</div>'+f('role','맡은 일')+f('desc','설명')+f('link','영상 주소','url')+
            '<button type="button" class="ad-del" data-a="delWork" data-i="'+i+'">이 외주 삭제</button></div>';
        }).join('');
    }else if(tab==='film'){
      html+='<p class="ad-tip">역할·기록은 쉼표(,)로 나눠 적어요. 예: 촬영부, 조명부</p>'+
        '<div class="ad-sub"><b>필모그래피 '+S.film.films.length+'편</b><button type="button" data-a="addFilm">+ 작품 추가</button></div>'+
        S.film.films.map(function(f,i){
          return '<div class="ad-card">'+
            row('제목','<input id="ad-ft-'+i+'" data-f="film.films.'+i+'.title" value="'+esc(f.title)+'">')+
            '<div class="ad-2">'+row('연도','<input id="ad-fy-'+i+'" type="number" data-f="film.films.'+i+'.year" value="'+esc(f.year)+'">')+
            row('역할','<input id="ad-fr-'+i+'" data-f="film.films.'+i+'.roles" data-list="1" value="'+esc((f.roles||[]).join(', '))+'">')+'</div>'+
            row('기록','<input id="ad-fc-'+i+'" data-f="film.films.'+i+'.records" data-list="1" value="'+esc((f.records||[]).join(', '))+'">')+
            '<button type="button" class="ad-del" data-a="delFilm" data-i="'+i+'">이 작품 삭제</button></div>';
        }).join('')+
        '<div class="ad-sub"><b>준비 중인 작품 '+S.film.next.length+'편</b><button type="button" data-a="addNext">+ 추가</button></div>'+
        S.film.next.map(function(x,i){
          return '<div class="ad-card ad-2">'+row('제목','<input id="ad-nt-'+i+'" data-f="film.next.'+i+'.title" value="'+esc(x.title)+'">')+
            row('역할','<input id="ad-nr-'+i+'" data-f="film.next.'+i+'.role" value="'+esc(x.role)+'">')+
            '<button type="button" class="ad-del" data-a="delNext" data-i="'+i+'">삭제</button></div>';
        }).join('');
    }else{
      var tok='';try{tok=localStorage.getItem('msp-gh-token')||''}catch(e){}
      html+='<p class="ad-state" id="adState"></p>'+
        '<div class="ad-sub"><b>GitHub에 저장</b></div>'+
        '<p class="ad-tip">GitHub에서 만든 <b>토큰</b>을 한 번 넣어두면 이 컴퓨터에서는 계속 쓸 수 있어요. 토큰은 이 브라우저에만 저장되고 사이트 파일에는 들어가지 않아요.</p>'+
        row('토큰','<input id="adToken" type="password" autocomplete="off" placeholder="github_pat_…" value="'+esc(tok)+'">')+
        '<button type="button" class="ad-main" data-a="push">GitHub에 저장</button>'+
        '<p class="ad-msg" id="adMsg" role="status"></p>'+
        '<div class="ad-sub"><b>다른 방법</b></div>'+
        '<button type="button" data-a="copy">data.js 내용 복사</button>'+
        '<button type="button" class="ad-del" data-a="discard">바뀐 내용 모두 버리기</button>';
    }
    panel.innerHTML=html+'</div>';
    status();
  }
  function status(){
    var n=document.getElementById('adState');
    if(n)n.textContent=dirty()?'● 저장 안 된 변경이 있어요. (이 브라우저에 임시 보관 중)':'바뀐 내용이 없어요.';
    panel.classList.toggle('is-dirty',dirty());
  }
  function msg(t,ok){var n=document.getElementById('adMsg');if(n){n.textContent=t;n.className='ad-msg'+(ok?' ok':' err')}}

  panel.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.dataset.tab){tab=b.dataset.tab;drawPanel();return}
    var a=b.dataset.a,i=+b.dataset.i,L=S.layout,F=S.film;
    if(a==='off'){setOn(false);return}
    if(a==='up'&&i>0){L.splice(i-1,0,L.splice(i,1)[0])}
    else if(a==='down'&&i<L.length-1){L.splice(i+1,0,L.splice(i,1)[0])}
    else if(a==='addFilm'){F.films.unshift({title:'새 작품',year:new Date().getFullYear(),roles:[],records:[]})}
    else if(a==='delFilm'){F.films.splice(i,1)}
    else if(a==='addNext'){F.next.push({title:'새 작품',role:''})}
    else if(a==='addWork'){
      if(!S.outsource)S.outsource={en:'OUTSOURCING',badge:'WORK',title:'외주',desc:'',works:[]};
      if(!S.layout.some(function(x){return x.id==='outsource'}))S.layout.splice(1,0,{id:'outsource',show:true});
      S.outsource.works.unshift({title:'새 외주 작업',client:'',year:String(new Date().getFullYear()),role:'',desc:'',link:''});
    }
    else if(a==='delWork'){S.outsource.works.splice(i,1)}
    else if(a==='delNext'){F.next.splice(i,1)}
    else if(a==='copy'){
      var t=toFile();
      try{navigator.clipboard.writeText(t).then(function(){msg('복사했어요. GitHub의 js/data.js 에 붙여 넣으면 돼요.',true)},function(){msg('복사가 막혀 있어요. 이 브라우저에서는 GitHub에 저장 버튼을 써 주세요.')})}catch(err){msg('복사가 막혀 있어요.')}
      return;
    }
    else if(a==='discard'){
      try{localStorage.removeItem('msp-draft')}catch(err){}
      replaceSite(JSON.parse(ORIG));MSP.render();msg('바뀐 내용을 모두 버리고 원래대로 돌렸어요.',true);return;
    }
    else if(a==='push'){push();return}
    else return;
    saveDraft();MSP.render();
  });
  panel.addEventListener('change',function(e){
    var c=e.target;if(c.dataset.a==='show'){S.layout[+c.dataset.i].show=c.checked;saveDraft();MSP.render()}
  });
  panel.addEventListener('input',function(e){
    var c=e.target,p=c.dataset.f;if(!p)return;
    var v=c.value;
    if(c.dataset.list)v=v.split(',').map(function(s){return s.trim()}).filter(Boolean);
    else if(c.type==='number')v=parseInt(v,10)||0;
    else v=v.trim()===''&&c.type==='url'?'':v;
    setPath(S,p,v);saveDraft();
    // 패널 입력칸에 커서가 있으니 본문만 다시 그림
    clearTimeout(renderT);renderT=setTimeout(renderPage,400);
  });
  // 패널은 그대로 두고 본문만 다시 그림 (입력 중인 칸이 사라지지 않게)
  function renderPage(){var hook=MSP.onRender;MSP.onRender=[function(){if(on)makeEditable()}];try{MSP.render()}finally{MSP.onRender=hook}}

  /* ── GitHub에 저장 ── */
  function b64(str){var bytes=new TextEncoder().encode(str),bin='';for(var i=0;i<bytes.length;i++)bin+=String.fromCharCode(bytes[i]);return btoa(bin)}
  async function push(){
    var inp=document.getElementById('adToken'),token=(inp&&inp.value||'').trim();
    if(!token){msg('토큰을 먼저 넣어 주세요.');return}
    try{localStorage.setItem('msp-gh-token',token)}catch(e){}
    var api='https://api.github.com/repos/'+REPO.owner+'/'+REPO.repo+'/contents/'+REPO.path;
    var h={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json'};
    msg('저장하는 중…',true);
    try{
      var r=await fetch(api+'?ref='+REPO.branch,{headers:h,cache:'no-store'});
      if(r.status===401){msg('토큰이 맞지 않아요. 토큰을 다시 확인해 주세요.');return}
      if(r.status===404){msg('저장소를 찾지 못했어요. 토큰에 ms-portfolio 저장소 권한(Contents: 읽기/쓰기)이 있는지 확인해 주세요.');return}
      if(r.status===403){msg('이 토큰으로는 저장소를 볼 수 없어요. 토큰에 ms-portfolio 저장소의 Contents 읽기/쓰기 권한을 주세요.');return}
      if(!r.ok){msg('GitHub이 응답하지 않아요 ('+r.status+'). 잠시 뒤 다시 눌러 주세요.');return}
      var cur=await r.json();
      r=await fetch(api,{method:'PUT',headers:Object.assign({'Content-Type':'application/json'},h),
        body:JSON.stringify({message:'관리자 모드에서 내용 수정',content:b64(toFile()),sha:cur.sha,branch:REPO.branch})});
      if(r.status===403||r.status===404){msg('토큰에 쓰기 권한이 없어요. Contents 권한을 "읽기/쓰기"로 해 주세요.');return}
      if(r.status===409||r.status===422){msg('그 사이 파일이 바뀌었어요. 다시 한 번 눌러 주세요.');return}
      if(!r.ok){msg('저장에 실패했어요 ('+r.status+').');return}
      ORIG=JSON.stringify(S);try{localStorage.removeItem('msp-draft')}catch(e){}
      status();msg('저장했어요! 1~2분 뒤 사이트에 반영돼요.',true);
    }catch(err){
      msg('이 화면에서는 GitHub에 연결할 수 없어요. (Claude 미리보기 화면은 외부 연결이 막혀 있어요. 실제 사이트에서 저장해 주세요.)');
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
        // 예전 임시본에 없는 새 항목(예: 외주)은 원본에서 채워 넣기
        var o=JSON.parse(ORIG);Object.keys(o).forEach(function(k){if(!(k in d))d[k]=o[k]});
        (o.layout||[]).forEach(function(x,i){if(!d.layout.some(function(y){return y.id===x.id}))d.layout.splice(Math.min(i,d.layout.length),0,x)});
        replaceSite(d);
      }
      MSP.render();
      if(d){tab='save';drawPanel();msg('지난번에 저장 안 한 변경을 불러왔어요.',true)}
    }else{
      makeEditable();
      if(location.hash==='#admin')try{history.replaceState(null,'',location.pathname+location.search)}catch(e){location.hash=''}
    }
  }
  if(location.hash==='#admin')setOn(true);
  window.addEventListener('hashchange',function(){if(location.hash==='#admin')setOn(true)});
  document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(e.key==='E'||e.key==='e')){e.preventDefault();setOn(!on)}});
  document.addEventListener('click',function(e){if(e.detail===3&&e.target.closest('#copyR')&&!on)setOn(true)});
})();
