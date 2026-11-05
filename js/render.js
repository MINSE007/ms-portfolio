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
  // data-edit="hero.title1" 처럼 표시해 두면 관리자 모드에서 바로 고칠 수 있어요
  function ed(path){return ' data-edit="'+path+'"'}
  MSP.esc=esc;

  /* ── 영화: 역할 분류 (키스탭 + ~부 묶음) ── */
  var CATS=[
    ['dir','연출',['연출','연출부','스크립터']],
    ['cam','촬영',['촬영','촬영부']],
    ['light','조명',['조명','조명부']],
    ['snd','음향',['음향','음향부']],
    ['prod','제작',['제작','PD','제작부']],
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
    return rs.slice().sort(function(a,b){return (ORDER[a]||0)-(ORDER[b]||0)}).map(function(r){
      return isKey(r)?'<span class="k">'+esc(r)+'</span>':esc(r);
    }).join(' · ');
  }
  function counts(){
    var films=S.film.films||[],aw=0;
    films.forEach(function(f){(f.records||[]).forEach(function(x){if(WIN.test(x))aw++})});
    return {films:films.length,awards:aw,next:(S.film.next||[]).length};
  }

  /* ── 섹션 이름표 ── */
  var NAMES={youtube:'유튜브',film:'영화',edit:'편집',contact:'Contact'};
  MSP.NAMES=NAMES;
  function visible(){return (S.layout||[]).filter(function(x){return x.show!==false&&SECTIONS[x.id]})}

  /* ── 첫 화면 ── */
  function renderHero(){
    var h=S.hero,c=counts();
    var sub=esc(h.sub);
    if(h.subStrong){var k=esc(h.subStrong);sub=sub.replace(k,'<b>'+k+'</b>')}
    var facts=(h.facts||[]).map(function(f,i){
      var v=String(f.value),auto=v.indexOf('auto:')===0;
      var n=auto?c[v.slice(5)]:v;
      return '<div class="fact"><strong>'+(auto?esc(n):'<span'+ed('hero.facts.'+i+'.value')+'>'+esc(n)+'</span>')+'<small'+ed('hero.facts.'+i+'.unit')+'>'+esc(f.unit)+'</small></strong><span'+ed('hero.facts.'+i+'.label')+'>'+esc(f.label)+'</span></div>';
    }).join('');
    $('hero').innerHTML='<div class="wrap">'+
      '<p class="eyeline"'+ed('site.eyebrow')+'>'+esc(S.site.eyebrow)+'</p>'+
      '<h1 id="heroTitle"><span class="l l1"'+ed('hero.title1')+'>'+esc(h.title1)+'</span><span class="l l2"'+ed('hero.title2')+'>'+esc(h.title2)+'</span></h1>'+
      '<p class="sub"'+ed('hero.sub')+'>'+sub+'</p>'+
      '<div class="ctas"><a class="btn" href="'+esc(S.youtube.channel.url)+'" target="_blank" rel="noopener"><span'+ed('hero.btn1')+'>'+esc(h.btn1)+'</span> ↗</a><a class="btn ghost" href="#film"'+ed('hero.btn2')+'>'+esc(h.btn2)+'</a></div>'+
      '<div class="facts">'+facts+'</div></div>';
  }

  /* ── 섹션 머리 (번호는 보이는 순서대로 자동) ── */
  function head(key,num,extra){
    var d=S[key];
    return '<div class="sh"><div><span class="eb">'+String(num).padStart(2,'0')+' <span'+ed(key+'.en')+'>'+esc(d.en)+'</span>'+(d.badge?' <span class="lv"'+ed(key+'.badge')+'>'+esc(d.badge)+'</span>':'')+'</span>'+
      '<h2'+ed(key+'.title')+'>'+esc(d.title)+'</h2>'+(d.desc!=null?'<p'+ed(key+'.desc')+'>'+esc(d.desc)+'</p>':'')+'</div>'+(extra||'')+'</div>';
  }

  /* ── 섹션들 ── */
  var SECTIONS={
    youtube:function(n){
      var y=S.youtube,ch=y.channel;
      var vids=(y.videos||[]).map(function(v,i){
        return '<a class="vid glass" href="https://www.youtube.com/watch?v='+encodeURIComponent(v.id)+'" target="_blank" rel="noopener"><div class="thumb" data-yt="'+esc(v.id)+'"><span class="play"></span></div><div class="info"><h3'+ed('youtube.videos.'+i+'.title')+'>'+esc(v.title)+'</h3><span>YouTube ↗</span></div></a>';
      }).join('');
      return head('youtube',n)+'<div class="yt">'+
        '<div class="chan glass"><div><div class="avatar" id="avatar">CW</div><small>YOUTUBE CHANNEL</small>'+
        '<h3'+ed('youtube.channel.name')+'>'+esc(ch.name)+'</h3><span class="handle"'+ed('youtube.channel.handle')+'>'+esc(ch.handle)+'</span>'+
        '<p class="tl"'+ed('youtube.channel.tagline')+'>'+esc(ch.tagline)+'</p></div>'+
        '<a class="btn" href="'+esc(ch.url)+'" target="_blank" rel="noopener"><span'+ed('youtube.channel.button')+'>'+esc(ch.button)+'</span> ↗</a></div>'+
        '<div class="vids">'+vids+'</div></div>';
    },
    film:function(n){
      var f=S.film,films=f.films||[];
      var awards=[];
      films.forEach(function(x){(x.records||[]).forEach(function(r){if(WIN.test(r))awards.push([x.title,r])})});
      var used={};films.forEach(function(x){(x.roles||[]).forEach(function(r){if(CAT[r])used[CAT[r]]=1})});
      var tabs='<button class="tab" type="button" data-r="all" aria-pressed="true">전체</button>'+
        CATS.filter(function(c){return used[c[0]]}).map(function(c){return '<button class="tab" type="button" data-r="'+c[0]+'" aria-pressed="false">'+c[1]+'</button>'}).join('');
      return head('film',n)+
        '<div class="film-top">'+
          '<div class="box glass"><h3><span'+ed('film.nextTitle')+'>'+esc(f.nextTitle||'준비 중인 작품')+'</span><b class="num">'+(f.next||[]).length+'</b></h3><div class="nexts">'+
            (f.next||[]).map(function(x){return '<span class="nx">'+esc(x.title)+(x.role?'<em>'+esc(x.role)+'</em>':'')+'</span>'}).join('')+'</div></div>'+
          '<div class="box glass"><h3>수상 · 입선<b class="num">'+awards.length+'</b></h3><ul class="awards">'+
            awards.map(function(a){return '<li><b title="'+esc(a[0])+'">'+esc(a[0])+'</b><span>'+esc(a[1])+'</span></li>'}).join('')+'</ul></div>'+
        '</div>'+
        '<div class="box glass">'+
          '<div class="fbar"><h3>필모그래피<b class="num" id="fShown">'+films.length+'</b></h3>'+
          '<div class="tools"><div class="tabs" role="group" aria-label="분야별 보기" id="ftabs">'+tabs+'</div>'+
          '<button class="sort" type="button" id="sortBtn">최신순 ↓</button></div></div>'+
          '<div id="films"></div>'+
        '</div>';
    },
    edit:function(n){
      var e=S.edit;
      var ICON={
        plan:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
        prod:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
        edit:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
        cam:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>'
      };
      var sk=(e.skills||[]).map(function(s,i){
        return '<div class="sk glass"><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICON[s.icon]||ICON.edit)+'</svg></span>'+
          '<h3><span'+ed('edit.skills.'+i+'.title')+'>'+esc(s.title)+'</span><small'+ed('edit.skills.'+i+'.en')+'>'+esc(s.en)+'</small></h3><p'+ed('edit.skills.'+i+'.desc')+'>'+esc(s.desc)+'</p></div>';
      }).join('');
      return head('edit',n)+'<div class="edit"><div class="edit-lead glass"><div class="yrs"><span'+ed('edit.years')+'>'+esc(e.years)+'</span><b>년</b><small>EDITING CAREER</small></div>'+
        '<p'+ed('edit.lead')+'>'+esc(e.lead)+'</p></div><div class="skills">'+sk+'</div></div>';
    },
    contact:function(n){
      var c=S.contact;
      return '<div class="sh"><div><span class="eb">'+String(n).padStart(2,'0')+' <span'+ed('contact.en')+'>'+esc(c.en)+'</span></span><h2'+ed('contact.title')+'>'+esc(c.title)+'</h2></div></div>'+
        '<div class="dual"><div class="door glass"><div><small'+ed('contact.clientEyebrow')+'>'+esc(c.clientEyebrow)+'</small><h3'+ed('contact.clientTitle')+'>'+esc(c.clientTitle)+'</h3><p'+ed('contact.clientDesc')+'>'+esc(c.clientDesc)+'</p></div>'+
        '<div class="clist"><div class="ci"><span class="k">EMAIL</span><span class="v" id="cEmail"'+ed('contact.email')+'>'+esc(c.email)+'</span><button class="cp" type="button" data-for="cEmail">복사</button></div>'+
        '<div class="ci"><span class="k">INSTAGRAM</span><a class="v" href="'+esc(c.instagramUrl)+'" target="_blank" rel="noopener"'+ed('contact.instagram')+'>'+esc(c.instagram)+'</a><span></span></div></div></div>'+
        '<a class="door glass" href="'+esc(S.youtube.channel.url)+'" target="_blank" rel="noopener"><div><small'+ed('contact.viewerEyebrow')+'>'+esc(c.viewerEyebrow)+'</small><h3'+ed('contact.viewerTitle')+'>'+esc(c.viewerTitle)+'</h3><p'+ed('contact.viewerDesc')+'>'+esc(c.viewerDesc)+'</p></div><span class="arrow"><span'+ed('contact.viewerLink')+'>'+esc(c.viewerLink)+'</span> ↗</span></a></div>';
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
    if(!films.length){box.innerHTML='<p class="empty">이 분야로 참여한 작품이 아직 없어요.</p>';return}
    var years={};films.forEach(function(o){(years[o.f.year]=years[o.f.year]||[]).push(o)});
    var ys=Object.keys(years).sort(function(a,b){return fstate.dir==='new'?b-a:a-b});
    box.innerHTML=ys.map(function(y){
      var list=years[y];if(fstate.dir==='old')list=list.slice().reverse();
      return '<div class="yg"><div class="yr">'+esc(y)+'</div><ul>'+list.map(function(o){
        var f=o.f,rec=f.records||[];
        var main=rec.filter(function(x){return WIN.test(x)||ENTRY.test(x)}),rest=rec.filter(function(x){return !(WIN.test(x)||ENTRY.test(x))});
        var open=fstate.open[o.i];
        var res=main.map(function(x){return '<span class="'+(WIN.test(x)?'win':'ent')+'">'+esc(x)+'</span>'}).join('');
        if(rest.length){
          if(open)res+=rest.map(function(x){return '<span>'+esc(x)+'</span>'}).join('');
          res+='<button class="more" type="button" data-i="'+o.i+'" aria-expanded="'+(open?'true':'false')+'">'+(open?'접기':(main.length?'기록 '+rest.length+'개 더':'기록 보기'))+'</button>';
        }
        return '<li class="fr"><span class="t">'+esc(f.title)+'</span><span class="ro">'+roleText(f.roles||[])+'</span><span class="res">'+res+'</span></li>';
      }).join('')+'</ul></div>';
    }).join('');
  }

  /* ── 위쪽 메뉴 · 맨 아래 ── */
  function renderNav(){
    $('logoText').textContent=S.site.name;
    $('nav').innerHTML=visible().map(function(x){return '<a href="#'+x.id+'">'+esc(NAMES[x.id])+'</a>'}).join('');
  }
  function renderFooter(){
    var f=S.footer;
    $('footer').innerHTML='<div class="wrap"><div><span class="logo"><span class="badge-ms">MS</span><span>'+esc(S.site.name)+'</span></span>'+
      '<div class="info"><span'+ed('footer.info')+'>'+esc(f.info)+'</span><br><span'+ed('footer.info2')+'>'+esc(f.info2)+'</span></div></div>'+
      '<div class="links"><a href="'+esc(S.youtube.channel.url)+'" target="_blank" rel="noopener">YouTube</a><a href="'+esc(S.contact.instagramUrl)+'" target="_blank" rel="noopener">Instagram</a>'+
      '<button class="fbtn" id="replay" type="button">▶ 인트로 다시 보기</button><button class="fbtn" id="toTop" type="button">↑ TOP</button></div>'+
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
    (MSP.onRender||[]).forEach(function(fn){fn()});
  }
  MSP.render=render;
  MSP.drawFilms=drawFilms;

  /* ── 이미지 (불러오지 못하면 기본 모양 그대로) ── */
  function loadImages(){
    var av=$('avatar'),src=S.youtube.channel.avatar;
    if(av&&src){var im=new Image();im.alt='';im.onload=function(){av.appendChild(im)};im.src=src}
    document.querySelectorAll('.thumb[data-yt]').forEach(function(box){
      var im=new Image();im.alt='';im.loading='lazy';
      im.onload=function(){box.insertBefore(im,box.firstChild)};
      im.src='https://img.youtube.com/vi/'+encodeURIComponent(box.getAttribute('data-yt'))+'/hqdefault.jpg';
    });
  }

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
      var i=t.getAttribute('data-i');fstate.open[i]=!fstate.open[i];drawFilms();return;
    }
    if((t=e.target.closest('.cp'))){
      if(root.classList.contains('admin'))return;
      var el=$(t.getAttribute('data-for'));if(!el)return;
      var sel=function(){var rg=document.createRange();rg.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(rg)};
      try{navigator.clipboard.writeText(el.textContent).then(function(){t.textContent='복사됨';setTimeout(function(){t.textContent='복사'},1500)},sel)}catch(err){sel()}
      return;
    }
    if(e.target.closest('#toTop')){window.scrollTo({top:0,behavior:'smooth'});return}
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
