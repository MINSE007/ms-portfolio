/* =====================================================================
   render.js — data.js 내용을 읽어서 화면을 그려요
   (글을 바꾸려면 data.js를, 모양을 바꾸려면 css 파일을 고치면 돼요)
   ===================================================================== */
(function(){
  var S=window.SITE;
  var root=document.documentElement;
  var MSP=window.MSP=window.MSP||{};
  MSP.site=S;

  /* ── 도우미 ── */
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function $(id){return document.getElementById(id)}
  function pad(n){return String(n).padStart(2,'0')}
  // data-edit="hero.title1" 처럼 표시해 두면 관리자 모드에서 바로 고칠 수 있어요
  function ed(path){return ' data-edit="'+path+'"'}
  function or(v,d){return v==null||v===''?d:v}
  // 글 안의 \n 을 줄바꿈으로
  function txt(s){return esc(s).replace(/\n/g,'<br>')}
  MSP.esc=esc;MSP.txt=txt;

  /* ── 영화: 역할 분류 (키스탭 + ~부 묶음) ── */
  var CATS=[
    ['dir','연출',['연출','연출부','스크립터']],
    ['cam','촬영',['촬영','촬영부']],
    ['light','조명',['조명','조명부']],
    ['snd','음향',['음향','음향부']],
    ['prod','제작',['제작','PD','라인PD','제작부']],
    ['art','미술',['미술','미술부']],
    ['edit','편집',['편집','편집부']],
    ['act','배우',['배우']]
  ];
  var CAT={},ORDER={};
  CATS.forEach(function(c,i){c[2].forEach(function(r){CAT[r]=c[0];ORDER[r]=i})});
  function isKey(r){return !/부$/.test(r)&&r!=='스크립터'}
  var WIN=/수상|은상|동상|입선|감독상|장상/, ENTRY=/출품/;
  MSP.WIN=WIN;
  function roleText(rs){
    return (rs||[]).slice().sort(function(a,b){return (ORDER[a]||0)-(ORDER[b]||0)}).map(function(r){
      return isKey(r)?'<span class="k">'+esc(r)+'</span>':esc(r);
    }).join(' · ');
  }
  function stageList(){var st=(S.film&&S.film.stages)||{};return [].concat(st.pre||[],st.prod||[],st.post||[])}
  function counts(){
    var films=S.film.films||[],aw=0;
    films.forEach(function(f){(f.records||[]).forEach(function(x){if(WIN.test(x))aw++})});
    var mine=(S.dasi&&S.dasi.title)?1:0; // '다시, 변신'도 제작 중인 영화로 셈
    return {films:films.length,awards:aw,stages:stageList().length+mine,next:stageList().length+mine};
  }

  /* ── 섹션 이름표 ── */
  var NAMES={youtube:'유튜브',outsource:'외주',film:'영화',dasi:'다시, 변신',edit:'편집',contact:'연락'};
  function ytOf(v){var m=String(v||'').match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,})/);return m?m[1]:(/^[\w-]{11}$/.test(String(v||'').trim())?String(v).trim():'')}
  MSP.NAMES=NAMES;
  function visible(){return (S.layout||[]).filter(function(x){return x.show!==false&&SECTIONS[x.id]&&S[x.id]})}

  /* ── 첫 화면 ── */
  function renderHero(){
    var h=S.hero,c=counts();
    var sub=txt(h.sub);
    if(h.subStrong){var k=esc(h.subStrong);sub=sub.replace(k,'<b>'+k+'</b>')}
    var facts=(h.facts||[]).map(function(f,i){
      var v=String(f.value),auto=v.indexOf('auto:')===0;
      var n=auto?c[v.slice(5)]:v;
      return '<div class="fact"><strong>'+(auto?esc(n):'<span'+ed('hero.facts.'+i+'.value')+'>'+esc(n)+'</span>')+'<small'+ed('hero.facts.'+i+'.unit')+'>'+esc(f.unit)+'</small></strong><span'+ed('hero.facts.'+i+'.label')+'>'+esc(f.label)+'</span></div>';
    }).join('');
    $('hero').innerHTML='<div class="wrap">'+
      '<div class="h-meta mono"><span'+ed('hero.metaLeft')+'>'+esc(or(h.metaLeft,'PORTFOLIO — 2026'))+'</span><span'+ed('hero.metaRight')+'>'+esc(or(h.metaRight,'유튜브 · 영화 · 편집 — MS'))+'</span></div>'+
      '<div class="h-main"><div>'+
        '<h1 id="heroTitle"><span class="l l1"'+ed('hero.title1')+'>'+esc(h.title1)+'</span><span class="l l2"'+ed('hero.title2')+'>'+esc(h.title2)+'</span></h1>'+
        '<p class="sub"'+ed('hero.sub')+'>'+sub+'</p>'+
        '<div class="ctas"><a class="btn" href="'+esc(S.youtube.channel.url)+'" target="_blank" rel="noopener"><span'+ed('hero.btn1')+'>'+esc(h.btn1)+'</span> ↗</a><a class="btn ghost" href="#film"'+ed('hero.btn2')+'>'+esc(h.btn2)+'</a></div>'+
      '</div></div>'+
      '<div class="facts" style="--n:'+Math.max(1,(h.facts||[]).length)+'">'+facts+'</div></div>';
  }

  /* ── 섹션 머리 (번호는 보이는 순서대로 자동) ── */
  function head(key,num){
    var d=S[key];
    return '<div class="sh rv"><div><div class="no mono"><span>'+pad(num)+'</span><span'+ed(key+'.en')+'>'+esc(d.en)+'</span>'+(d.badge?'<span class="lv"'+ed(key+'.badge')+'>'+esc(d.badge)+'</span>':'')+'</div>'+
      '<h2'+ed(key+'.title')+'>'+esc(d.title)+'</h2></div>'+(d.desc!=null?'<p'+ed(key+'.desc')+'>'+txt(d.desc)+'</p>':'')+'</div>';
  }

  /* ── 다시, 변신 진행 상황: ③ 프리 ④ 프로덕션 ⑤ 포스트 — 줄 하나씩, 마우스를 올리면(폰은 누르면) 자세히 펼쳐짐
     관리자 모드: 줄이 늘 펼쳐져 있고, 단계 이름을 누르면 '지금 단계', 상태 글자를 누르면 진행 중→완료→예정 */
  var STEPS=[['pre','PRE-PRODUCTION','프리 프로덕션'],['prod','PRODUCTION','프로덕션'],['post','POST-PRODUCTION','포스트 프로덕션']];
  var STATE={done:'완료',now:'진행 중',todo:'예정'};
  function stageRows(d){
    var steps=d.steps||{},cur=STEPS.map(function(x){return x[0]}).indexOf(d.stage||'pre');if(cur<0)cur=0;
    return STEPS.map(function(x,i){
      var list=steps[x[0]]||[],dn=list.filter(function(it){return it.state==='done'}).length,nw=list.filter(function(it){return it.state==='now'}).length;
      var pct=list.length?Math.round((dn+nw*.5)/list.length*100):0;
      var cls=i<cur?'past':i===cur?'cur':'next',lab=i<cur?'완료':i===cur?'진행 중':'예정';
      var items=list.map(function(it,j){var p='dasi.steps.'+x[0]+'.'+j+'.';var st=STATE[it.state]?it.state:'todo';
        return '<li class="pg-it is-'+st+'"><i aria-hidden="true"></i><span'+ed(p+'name')+'>'+esc(it.name)+'</span>'+
          '<button type="button" class="pg-st" data-pg="state" data-s="'+x[0]+'" data-i="'+j+'" tabindex="-1">'+STATE[st]+'</button>'+
          '<button type="button" class="pg-del adm-only" data-pg="del" data-s="'+x[0]+'" data-i="'+j+'" aria-label="삭제">×</button></li>'}).join('');
      return '<div class="dz-row dz-stage '+cls+' rv" tabindex="0"><div class="dz-sh">'+
          '<span class="dz-no num">'+pad(i+3)+'</span>'+
          '<button type="button" class="pg-node" data-pg="stage" data-s="'+x[0]+'" tabindex="-1"><span class="mono">'+x[1]+'</span><b>'+x[2]+'</b></button>'+
          '<span class="dz-bar" aria-hidden="true"><i style="width:'+pct+'%"></i></span>'+
          '<span class="dz-cnt num">'+dn+' / '+list.length+'</span>'+
          '<span class="dz-badge">'+lab+'</span><span class="dz-chev" aria-hidden="true"></span></div>'+
        '<div class="dz-more"><div class="dz-in"><ul>'+(items||'<li class="pg-it is-todo"><i aria-hidden="true"></i><span>아직 정한 할 일이 없어요</span></li>')+'</ul>'+
          '<button type="button" class="pg-add adm-only" data-pg="add" data-s="'+x[0]+'">+ 할 일 추가</button></div></div></div>';
    }).join('');
  }

  /* ── 섹션들 ── */
  var ICON={
    plan:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    prod:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
    edit:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
    cam:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>'
  };
  var SECTIONS={
    youtube:function(n){
      var y=S.youtube,ch=y.channel,vids=y.videos||[];
      var grid=vids.map(function(v,i){
        return '<a class="vid rv" href="https://www.youtube.com/watch?v='+encodeURIComponent(v.id)+'" target="_blank" rel="noopener"><div class="thumb" data-yt="'+esc(v.id)+'"><span class="play"></span></div>'+
          '<div class="info"><span class="idx">'+pad(i+1)+'</span><h3'+ed('youtube.videos.'+i+'.title')+'>'+esc(v.title)+'</h3></div></a>';
      }).join('');
      return head('youtube',n)+'<div class="yt">'+
        '<aside class="chan glass rv"><div class="ch-top"><div class="avatar" id="avatar">CW</div><div><h3'+ed('youtube.channel.name')+'>'+esc(ch.name)+'</h3><span class="handle"'+ed('youtube.channel.handle')+'>'+esc(ch.handle)+'</span></div></div>'+
        '<p class="tl"'+ed('youtube.channel.tagline')+'>'+txt(ch.tagline)+'</p>'+
        '<p class="ch-desc"'+ed('youtube.channel.desc')+'>'+txt(or(ch.desc,''))+'</p>'+
        '<a class="btn" href="'+esc(ch.url)+'" target="_blank" rel="noopener"><span'+ed('youtube.channel.button')+'>'+esc(ch.button)+'</span> ↗</a></aside>'+
        '<div class="vids">'+grid+'</div></div>';
    },
    outsource:function(n){
      var o=S.outsource,works=o.works||[];
      return head('outsource',n)+'<div class="cases'+(works.length===1?' solo':'')+'">'+works.map(function(w,i){
        var p='outsource.works.'+i+'.';
        var m=String(w.link||'').match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,})/);
        var th=m?'<a class="cs-thumb thumb" data-yt="'+esc(m[1])+'" href="'+esc(w.link)+'" target="_blank" rel="noopener" aria-label="영상 보기"><span class="play"></span></a>':'';
        return '<article class="case glass rv'+(th?' has-th':'')+'">'+th+'<div class="cs-body"><div class="cs-top"><span class="cs-no">CASE '+pad(i+1)+'</span>'+(w.year?'<span'+ed(p+'year')+'>'+esc(w.year)+'</span>':'')+'</div>'+
          '<h3'+ed(p+'title')+'>'+esc(w.title)+'</h3>'+
          '<dl class="meta"><dt>의뢰</dt><dd'+ed(p+'client')+'>'+esc(w.client)+'</dd><dt>맡은 일</dt><dd'+ed(p+'role')+'>'+esc(w.role)+'</dd></dl>'+
          '<p'+ed(p+'desc')+'>'+txt(w.desc)+'</p>'+
          (w.link?'<a class="cs-link" href="'+esc(w.link)+'" target="_blank" rel="noopener">영상 보기 ↗</a>':'')+'</div></article>';
      }).join('')+'</div>';
    },
    film:function(n){
      var f=S.film,films=f.films||[];
      var used={};films.forEach(function(x){(x.roles||[]).forEach(function(r){if(CAT[r])used[CAT[r]]=1})});
      var tabs='<button class="tab" type="button" data-r="all" aria-pressed="true">전체</button>'+
        CATS.filter(function(c){return used[c[0]]}).map(function(c){return '<button class="tab" type="button" data-r="'+c[0]+'" aria-pressed="false">'+c[1]+'</button>'}).join('');
      // 대표작 3편: 영상이 있으면 썸네일(누르면 그 자리에서 재생), 없으면 '영상 준비 중'
      var picks=(f.picks||[]).map(function(x,i){
        var p='film.picks.'+i+'.',id=ytOf(x.video);
        if(!x.title)return '<article class="pk pk-empty glass rv"><div class="pk-v"><span>준비 중입니다</span></div><div class="pk-b"><h4>준비 중입니다</h4><p class="pk-d">다음 대표작이 곧 올라옵니다.</p></div></article>';
        var v=id?'<button type="button" class="pk-v thumb" data-yt="'+esc(id)+'" data-play="'+esc(id)+'" aria-label="'+esc(x.title)+' 영상 재생"><span class="play"></span></button>'
                :'<div class="pk-v"><span>영상 준비 중입니다</span></div>';
        return '<article class="pk glass rv">'+v+'<div class="pk-b">'+
          '<div class="pk-m"><span class="num"'+ed(p+'year')+'>'+esc(x.year)+'</span><span'+ed(p+'role')+'>'+esc(x.role)+'</span></div>'+
          '<h4'+ed(p+'title')+'>'+esc(x.title)+'</h4>'+(x.sub?'<span class="pk-s"'+ed(p+'sub')+'>'+esc(x.sub)+'</span>':'')+
          '<p class="pk-d'+(x.desc?'':' wait')+'"'+ed(p+'desc')+'>'+(x.desc?txt(x.desc):'개요 준비 중입니다.')+'</p></div></article>';
      }).join('');
      return head('film',n)+
        (picks?'<div class="sub-h rv"><h3'+ed('film.picksTitle')+'>'+esc(or(f.picksTitle,'대표작'))+'</h3></div><div class="picks">'+picks+'</div>':'')+
        '<div class="box glass rv">'+
          '<div class="fbar"><div class="sub-h"><h3>필모그래피<b class="num" id="fShown">'+films.length+'</b></h3></div>'+
          '<div class="tools"><div class="tabs" role="group" aria-label="분야별 보기" id="ftabs">'+tabs+'</div>'+
          '<button class="sort" type="button" id="sortBtn">최신순 ↓</button></div></div>'+
          '<div class="clip" id="filmClip"><div id="films"></div></div>'+
          '<button class="more-all" type="button" id="moreAll" aria-expanded="false" aria-controls="filmClip"><span>전체 필모그래피 보기</span><i aria-hidden="true"></i></button>'+
        '</div>';
    },
    dasi:function(n){
      var d=S.dasi,id=ytOf(d.video);
      var ppl=(d.people||[]).map(function(x,i){return '<li><b'+ed('dasi.people.'+i+'.name')+'>'+esc(x.name)+'</b><span'+ed('dasi.people.'+i+'.desc')+'>'+esc(x.desc)+'</span></li>'}).join('');
      // ① 영상 칸
      var v=id?'<button type="button" class="dz-v thumb" data-yt="'+esc(id)+'" data-play="'+esc(id)+'" aria-label="다시, 변신 영상 재생"><span class="play"></span></button>'
              :'<div class="dz-v dz-wait"><span class="dz-wn mono">01 · FILM</span><b>영상 준비 중입니다</b><small>촬영을 마치면 이곳에서 볼 수 있어요.</small></div>';
      return head('dasi',n)+'<div class="dz">'+
        '<div class="dz-top"><div class="dz-box dz-vbox rv">'+v+'</div>'+
        // ② 개요 · 감독 · 로그라인
        '<div class="dz-box dz-info rv"><span class="mono">02 · OVERVIEW</span>'+
          '<dl class="dz-dl"><dt>형식</dt><dd'+ed('dasi.kind')+'>'+esc(d.kind)+'</dd><dt>감독</dt><dd'+ed('dasi.director')+'>'+esc(d.director)+'</dd>'+
          '<dt>맡은 일</dt><dd'+ed('dasi.role')+'>'+esc(d.role)+'</dd><dt>지금</dt><dd class="dz-live"'+ed('dasi.status')+'>'+esc(d.status)+'</dd></dl>'+
          '<p class="dz-log"'+ed('dasi.logline')+'>'+txt(d.logline)+'</p>'+
          (d.note?'<p class="dz-q"'+ed('dasi.note')+'>'+txt(d.note)+'</p>':'')+
          (ppl?'<ul class="dz-ppl">'+ppl+'</ul>':'')+'</div></div>'+
        stageRows(d)+'</div>';
    },
    edit:function(n){
      var e=S.edit;
      var rows=(e.skills||[]).map(function(s,i){
        var p='edit.skills.'+i+'.';
        return '<li class="sv rv"><span class="sv-no num">'+pad(i+1)+'</span>'+
          '<h3><span'+ed(p+'title')+'>'+esc(s.title)+'</span><small'+ed(p+'en')+'>'+esc(s.en)+'</small></h3>'+
          '<p'+ed(p+'desc')+'>'+txt(s.desc)+'</p>'+
          '<span class="sv-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICON[s.icon]||ICON.edit)+'</svg></span></li>';
      }).join('');
      return head('edit',n)+'<div class="ed2 rv"><p class="ed-lead"'+ed('edit.lead')+'>'+txt(e.lead)+'</p>'+
        '<div class="ed-yr"><b class="num"><span'+ed('edit.years')+'>'+esc(e.years)+'</span><small>년</small></b><span class="mono">EDITING CAREER</span></div></div>'+
        '<ol class="svc">'+rows+'</ol>';
    },
    contact:function(n){
      var c=S.contact;
      return '<div class="no mono" style="color:var(--acc);display:flex;gap:10px"><span>'+pad(n)+'</span><span'+ed('contact.en')+'>'+esc(c.en)+'</span></div>'+
        '<h2 class="ct-title rv"'+ed('contact.title')+'>'+esc(c.title)+'</h2>'+
        '<div class="dual"><div class="door glass rv"><div><small class="mono"'+ed('contact.clientEyebrow')+'>'+esc(c.clientEyebrow)+'</small><h3'+ed('contact.clientTitle')+'>'+esc(c.clientTitle)+'</h3><p'+ed('contact.clientDesc')+'>'+txt(c.clientDesc)+'</p></div>'+
        '<div class="clist"><div class="ci"><span class="k mono">EMAIL</span><a class="v" id="cEmail" href="mailto:'+esc(c.email)+'"'+ed('contact.email')+'>'+esc(c.email)+'</a><button class="cp" type="button" data-for="cEmail">복사</button></div></div></div>'+
        '<a class="door glass rv" href="'+esc(S.youtube.channel.url)+'" target="_blank" rel="noopener"><div><small class="mono"'+ed('contact.viewerEyebrow')+'>'+esc(c.viewerEyebrow)+'</small><h3'+ed('contact.viewerTitle')+'>'+esc(c.viewerTitle)+'</h3><p'+ed('contact.viewerDesc')+'>'+txt(c.viewerDesc)+'</p></div><span class="arrow"><span'+ed('contact.viewerLink')+'>'+esc(c.viewerLink)+'</span> ↗</span></a></div>';
    }
  };

  /* ── 필모그래피 목록 (연도별) ── */
  var fstate={cat:'all',dir:'new',open:{}};
  function drawFilms(){
    var box=$('films');if(!box)return;
    var films=(S.film.films||[]).map(function(f,i){return {f:f,i:i}}).filter(function(o){
      return fstate.cat==='all'||(o.f.roles||[]).some(function(r){return CAT[r]===fstate.cat});
    });
    $('fShown').textContent=films.length;
    if(!films.length){box.innerHTML='<p class="empty">이 분야로 참여한 작품이 아직 없어요.</p>';applyClip();return}
    var years={};films.forEach(function(o){(years[o.f.year]=years[o.f.year]||[]).push(o)});
    var ys=Object.keys(years).sort(function(a,b){return fstate.dir==='new'?b-a:a-b});
    box.innerHTML=ys.map(function(y){
      var list=years[y];if(fstate.dir==='old')list=list.slice().reverse();
      return '<div class="yg"><div class="yr">'+esc(y)+'</div><ul>'+list.map(function(o){
        var f=o.f,rec=f.records||[];
        var main=rec.filter(function(x){return WIN.test(x)||ENTRY.test(x)}),rest=rec.filter(function(x){return !(WIN.test(x)||ENTRY.test(x))});
        var open=!!fstate.open[o.i];
        var res=main.map(function(x){return '<span class="'+(WIN.test(x)?'win':'ent')+'">'+esc(x)+'</span>'}).join('');
        if(rest.length){
          res+='<span class="xr"><span class="xr-in">'+rest.map(function(x){return '<span>'+esc(x)+'</span>'}).join('')+'</span></span>'+
            '<button class="more" type="button" data-i="'+o.i+'" data-label="'+(main.length?'기록 '+rest.length+'개 더':'기록 보기')+'" aria-expanded="'+open+'">'+(open?'접기':(main.length?'기록 '+rest.length+'개 더':'기록 보기'))+'</button>';
        }
        if(f.note)res='<span class="fnote"'+ed('film.films.'+o.i+'.note')+'>'+esc(f.note)+'</span>'+res; // 오른쪽 여백 메모 (예: 프리 프로덕션 진행 중)
        return '<li class="fr'+(open?' open':'')+'"><span class="t">'+esc(f.title)+'</span><span class="ro">'+roleText(f.roles)+'</span><span class="res">'+res+'</span></li>';
      }).join('')+'</ul></div>';
    }).join('');
    applyClip();
  }

  /* ── 필모그래피: 처음엔 몇 줄만, '전체 보기'를 누르면 부드럽게 펼쳐짐 ── */
  var PREVIEW=8;
  function previewH(){
    var box=$('films');if(!box)return null;
    var rows=box.querySelectorAll('.fr');if(rows.length<=PREVIEW)return null;
    return Math.round(rows[PREVIEW-1].getBoundingClientRect().bottom-box.getBoundingClientRect().top);
  }
  function label(){
    var btn=$('moreAll');if(!btn)return;
    var n=$('films').querySelectorAll('.fr').length;
    btn.querySelector('span').textContent=fstate.all?'필모그래피 접기':'전체 필모그래피 보기 ('+n+'편)';
    btn.setAttribute('aria-expanded',String(!!fstate.all));
  }
  function applyClip(){
    var clip=$('filmClip'),btn=$('moreAll');if(!clip)return;
    var h=previewH();
    if(h==null){clip.style.maxHeight='none';clip.classList.add('full');btn.hidden=true;return}
    btn.hidden=false;clip.classList.remove('full');
    clip.classList.toggle('open',!!fstate.all);
    clip.style.maxHeight=fstate.all?'none':h+'px';
    label();
  }
  function toggleAll(){
    var clip=$('filmClip');if(!clip)return;
    var h=previewH();if(h==null)return;
    fstate.all=!fstate.all;clip.classList.toggle('open',fstate.all);label();
    clip.style.maxHeight=clip.getBoundingClientRect().height+'px';
    void clip.offsetHeight;
    if(fstate.all){
      clip.style.maxHeight=$('films').scrollHeight+'px';
      var done=function(e){if(e.target!==clip)return;clip.removeEventListener('transitionend',done);if(fstate.all)clip.style.maxHeight='none'};
      clip.addEventListener('transitionend',done);
    }else{
      clip.style.maxHeight=h+'px';
      var top=clip.closest('.box').getBoundingClientRect().top;
      if(top<0)scrollToY(top+scrollY-100);
    }
  }

  /* ── 위쪽 메뉴 · 맨 아래 ── */
  function renderNav(){
    $('logoText').textContent=S.site.name;
    $('nav').innerHTML=visible().map(function(x){var t=x.id==='contact'?NAMES.contact:or(S[x.id]&&S[x.id].title,NAMES[x.id]);return '<a href="#'+x.id+'">'+esc(t)+'</a>'}).join('');
  }
  function renderFooter(){
    var f=S.footer;
    $('footer').innerHTML='<div class="wrap"><div><span class="logo"><span class="badge-ms">MS</span><span>'+esc(S.site.name)+'</span></span>'+
      '<div class="info"><span'+ed('footer.info')+'>'+esc(f.info)+'</span><br><span'+ed('footer.info2')+'>'+esc(f.info2)+'</span></div></div>'+
      '<div class="links"><a href="'+esc(S.youtube.channel.url)+'" target="_blank" rel="noopener">YouTube</a><a href="'+esc(S.contact.instagramUrl)+'" target="_blank" rel="noopener">Instagram</a>'+
      '<button class="fbtn" id="adminLogin" type="button">관리자 로그인</button><button class="fbtn" id="replay" type="button">▶ 인트로 다시 보기</button><button class="fbtn" id="toTop" type="button">↑ TOP</button></div>'+
      '<div class="bottom"><span'+ed('footer.address')+'>'+esc(f.address)+'</span><span id="copyR"'+ed('footer.copyright')+'>'+esc(f.copyright)+'</span></div></div>';
  }

  /* ── 전체 그리기 ── */
  function render(){
    renderNav();renderHero();
    $('sections').innerHTML=visible().map(function(x,i){
      return '<section class="sec" id="'+x.id+'">'+SECTIONS[x.id](i+1)+'</section>';
    }).join('');
    renderFooter();
    drawFilms();
    loadImages();
    reveal();
    navSpy();
    fitChan();
    (MSP.onRender||[]).forEach(function(fn){fn()});
  }
  MSP.render=render;

  /* ── 유튜브 채널 카드 높이 = 영상 썸네일 4개 영역 (아래 제목 글씨까지 내려가지 않게) ── */
  function fitChan(){
    var ch=document.querySelector('.chan'),th=document.querySelectorAll('.vids .thumb');
    if(!ch||!th.length)return;
    ch.style.height='';
    if(getComputedStyle(ch.parentNode).gridTemplateColumns.split(' ').length<2)return; // 한 줄로 쌓이는 좁은 화면은 그대로
    // 위치는 offsetTop으로 잼 (나타나는 효과로 살짝 움직이는 중이어도 정확하게)
    var abs=function(el){var y=0;while(el){y+=el.offsetTop;el=el.offsetParent}return y};
    var last=th[th.length-1];
    ch.style.height=Math.max(0,Math.round(abs(last)+last.offsetHeight-abs(ch)))+'px';
  }
  MSP.fitChan=fitChan;
  window.addEventListener('resize',function(){clearTimeout(fitChan.t);fitChan.t=setTimeout(fitChan,120)});
  try{document.fonts.ready.then(fitChan)}catch(e){}

  /* ── 위쪽 메뉴: 지금 보고 있는 섹션에 표시가 미끄러져 따라감 ── */
  var spy=null;
  function navSpy(){
    var nav=$('nav');if(!nav)return;
    var ind=document.createElement('i');ind.className='nav-ind';nav.appendChild(ind);
    function mark(id){
      var on=null;nav.querySelectorAll('a').forEach(function(a){var hit=a.getAttribute('href')==='#'+id;a.classList.toggle('on',hit);if(hit)on=a});
      nav.classList.toggle('has-on',!!on);
      if(on){ind.style.width=on.offsetWidth+'px';ind.style.transform='translateX('+on.offsetLeft+'px)'}
    }
    if(spy)spy.disconnect();
    if(!('IntersectionObserver' in window))return;
    var seen={};
    spy=new IntersectionObserver(function(es){
      es.forEach(function(x){seen[x.target.id]=x.isIntersecting});
      var cur=null;document.querySelectorAll('#sections .sec').forEach(function(sec){if(seen[sec.id]&&!cur)cur=sec.id});
      mark(cur);
    },{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('#sections .sec').forEach(function(sec){spy.observe(sec)});
  }
  MSP.drawFilms=drawFilms;

  /* ── 이미지 (불러오지 못하면 기본 모양 그대로) ── */
  function loadImages(){
    var av=$('avatar'),src=S.youtube.channel.avatar;
    if(av&&src){var im=new Image();im.alt='';im.onload=function(){av.appendChild(im)};im.src=src}
    document.querySelectorAll('.thumb[data-yt]').forEach(function(box){
      // 화면에 먼저 붙여 두고(그래야 '늦게 불러오기'가 작동함), 다 불러오면 서서히 나타남
      // v1111: 화면 밖이어도 바로 불러오기(늦게 불러오기 끔) + 더 가벼운 webp 먼저, 없으면 jpg
      var id=encodeURIComponent(box.getAttribute('data-yt'));
      var im=new Image();im.alt='';im.decoding='async';
      im.onload=function(){im.classList.add('ok')};
      im.onerror=function(){if(!im.dataset.jpg){im.dataset.jpg=1;im.src='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'}else im.remove()};
      box.insertBefore(im,box.firstChild);
      im.src='https://i.ytimg.com/vi_webp/'+id+'/hqdefault.webp';
    });
  }

  /* ── 스크롤하면 살짝 떠오르기 (화면 아래쪽에 있는 것만, 관리자 모드에선 끔) ── */
  var io=null;
  function reveal(){
    if(io)io.disconnect();
    if(!('IntersectionObserver' in window)||root.classList.contains('admin'))return;
    io=new IntersectionObserver(function(es){es.forEach(function(x){
      if(!x.isIntersecting)return;var t=x.target;io.unobserve(t);t.classList.remove('wait');
      setTimeout(function(){t.classList.remove('anim');t.style.transitionDelay=''},1100);
    })},{rootMargin:'0px 0px -8% 0px'});
    var vh=innerHeight;
    document.querySelectorAll('.rv').forEach(function(el,i){
      if(el.getBoundingClientRect().top>vh){el.classList.add('wait','anim');el.style.transitionDelay=((i%4)*60)+'ms';io.observe(el)}
    });
  }

  /* ── 배경 빛: 마우스를 천천히 따라옴 (MS 클라처럼) ── */
  (function(){
    var bg=$('bg');
    try{if(!matchMedia('(pointer:fine)').matches)return}catch(e){return}
    var tx=.78,ty=.18,x=tx,y=ty,raf=0;
    function step(){
      x+=(tx-x)*.06;y+=(ty-y)*.06;
      bg.style.setProperty('--gx',(x*100).toFixed(2)+'%');bg.style.setProperty('--gy',(y*100).toFixed(2)+'%');
      raf=(Math.abs(tx-x)>.001||Math.abs(ty-y)>.001)?requestAnimationFrame(step):0;
    }
    window.addEventListener('pointermove',function(e){tx=e.clientX/innerWidth;ty=e.clientY/innerHeight;if(!raf)raf=requestAnimationFrame(step)},{passive:true});
  })();

  /* ── 쭈우욱 미끄러지는 스크롤 (멀수록 조금 더 길게, 처음·끝은 부드럽게) ── */
  var scrollRaf=0;
  function scrollToY(y){
    cancelAnimationFrame(scrollRaf);
    var from=scrollY,dist=y-from;if(Math.abs(dist)<2)return;
    var dur=Math.min(1600,600+Math.abs(dist)*.18),t0=performance.now();
    var ease=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
    (function step(now){
      var p=Math.min(1,(now-t0)/dur);window.scrollTo(0,from+dist*ease(p));
      if(p<1)scrollRaf=requestAnimationFrame(step);
    })(t0);
  }
  // 손으로 스크롤하면 바로 멈춤
  ['wheel','touchstart','keydown'].forEach(function(ev){window.addEventListener(ev,function(){cancelAnimationFrame(scrollRaf)},{passive:true})});
  MSP.scrollToY=scrollToY;

  /* ── 클릭 동작 (다시 그려도 계속 동작하도록 문서 전체에서 받음) ── */
  document.addEventListener('click',function(e){
    var t;
    if((t=e.target.closest('#ftabs .tab'))){
      fstate.cat=t.getAttribute('data-r');
      document.querySelectorAll('#ftabs .tab').forEach(function(x){x.setAttribute('aria-pressed',String(x===t))});
      drawFilms();return;
    }
    if((t=e.target.closest('#sortBtn'))){
      fstate.dir=fstate.dir==='new'?'old':'new';
      t.textContent=fstate.dir==='new'?'최신순 ↓':'오래된순 ↑';
      drawFilms();return;
    }
    if((t=e.target.closest('#films .more'))){
      var i=t.getAttribute('data-i'),li=t.closest('.fr'),op=!fstate.open[i];fstate.open[i]=op;
      li.classList.toggle('open',op);t.setAttribute('aria-expanded',String(op));t.textContent=op?'접기':t.getAttribute('data-label');
      if(!fstate.all)setTimeout(applyClip,460);return;
    }
    if((t=e.target.closest('#moreAll'))){toggleAll();return}
    // 다시, 변신 진행 상황 — 관리자 모드에서만 바로 고치기
    if((t=e.target.closest('[data-pg]'))&&root.classList.contains('admin')&&MSP.adminCommit){
      var D=S.dasi,k=t.getAttribute('data-s'),j=+t.getAttribute('data-i'),act=t.getAttribute('data-pg');D.steps=D.steps||{};var L=D.steps[k]=D.steps[k]||[];
      if(act==='stage')D.stage=k;
      else if(act==='state'){var nx={todo:'now',now:'done',done:'todo'};L[j].state=nx[L[j].state]||'now'}
      else if(act==='add')L.push({name:'새 할 일',state:'todo'});
      else if(act==='del')L.splice(j,1);
      MSP.adminCommit();return;
    }
    // 다시, 변신 단계 줄: 폰(마우스 없음)에서는 누르면 펼치고 다시 누르면 접기
    if((t=e.target.closest('.dz-stage'))&&!root.classList.contains('admin')){
      var hov=false;try{hov=matchMedia('(hover:hover)').matches}catch(err){}
      if(!hov){t.classList.toggle('open');if(!t.classList.contains('open'))t.blur()}
      return;
    }
    // 대표작: 누르면 그 자리에서 유튜브 영상 재생
    if((t=e.target.closest('[data-play]'))&&!root.classList.contains('admin')){
      var fr=document.createElement('iframe');
      fr.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(t.getAttribute('data-play'))+'?autoplay=1&rel=0';
      fr.title=t.getAttribute('aria-label')||'영상';fr.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';fr.allowFullscreen=true;
      var box=document.createElement('div');box.className='pk-v pk-on';box.appendChild(fr);t.replaceWith(box);return;
    }
    if((t=e.target.closest('.logo'))&&!root.classList.contains('admin')){e.preventDefault();scrollToY(0);return}
    if((t=e.target.closest('.cp'))){
      if(root.classList.contains('admin'))return;
      var el=$(t.getAttribute('data-for'));if(!el)return;
      var sel=function(){var rg=document.createRange();rg.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(rg)};
      try{navigator.clipboard.writeText(el.textContent).then(function(){t.textContent='복사됨';setTimeout(function(){t.textContent='복사'},1500)},sel)}catch(err){sel()}
      return;
    }
    if(e.target.closest('#toTop')){scrollToY(0);return}
    if(e.target.closest('#replay')){if(MSP.playIntro)MSP.playIntro(true);return}
  });

  /* ── 다크/라이트 ── */
  $('tg').addEventListener('click',function(){
    var n=root.getAttribute('data-theme')==='light'?'dark':'light';
    root.setAttribute('data-theme',n);
    try{localStorage.setItem('msp-theme',n)}catch(e){}
  });

  render();
})();
