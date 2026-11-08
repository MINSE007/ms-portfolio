/* =====================================================================
   intro.js — 컷 편집식 타이포 인트로 (약 3.6초, 건너뛰기 가능)
   단어는 data.js 의 intro.cuts, 슬로건은 hero.title1 / title2 를 써요.
   컷 모양 바꾸기: 아래 LOOK 목록 — [모양, 자리, 배경, 움직임, 길이(ms)]
     모양: fill 채움 / out 외곽선 / acc 보라 글씨
     자리: bl 왼쪽아래 / br 오른쪽아래 / tl 왼쪽위 / tr 오른쪽위 / l 왼쪽 / r 오른쪽 / c 가운데
           (뒤에 ' crop-r' 이나 ' crop-l' 을 붙이면 화면 밖으로 잘려 나감)
     배경: dark 어둡게 / light 밝게 / acc 보라
     움직임: zoom 줌 / left·right 옆으로 / up 위로 / blur 초점 맞추기
   ===================================================================== */
(function(){
  var LOOK=[
    ['fill','bl','dark','zoom',230],
    ['out','r crop-r','dark','left',190],
    ['fill','l','light','right',190],
    ['acc','tr','dark','up',220],
    ['fill','c','dark','blur',210],
    ['fill','bl','light','zoom',170],
    ['fill','c','acc','zoom',210],
    ['fill','r','dark','left',320]
  ];
  var DEFAULT_CUTS=['YOUTUBE','FILM','EDIT','8년','상상','을','현실','로.'];
  var HOLD=720, FLY=750;
  var MSP=window.MSP||{},S=window.SITE,root=document.documentElement;
  var el=document.getElementById('intro');if(!el)return;
  var stage=document.getElementById('iCuts'),slog=document.getElementById('iSlogan');
  var take=document.getElementById('iTake'),seg=document.getElementById('iSeg');
  var timers=[],running=false;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function at(ms,fn){timers.push(setTimeout(fn,ms))}
  function pad(n){return String(n).padStart(2,'0')}
  function isCalm(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}

  // 글자 수에 맞춰 화면에 꽉 차는 크기 정하기 (한글은 넓게, 영문은 좁게 계산)
  function fontSize(t){
    var w=0;Array.from(t).forEach(function(c){w+=/[가-힣一-龥]/.test(c)?1:/[A-Z0-9]/.test(c)?.68:.4});
    var byW=86/Math.max(w,1.2), byH=62*innerHeight/innerWidth;
    return Math.min(byW,byH,34).toFixed(2)+'vw';
  }

  function build(){
    var cuts=(S.intro&&S.intro.cuts&&S.intro.cuts.length)?S.intro.cuts:DEFAULT_CUTS;
    stage.innerHTML=cuts.map(function(t,i){
      var L=LOOK[i%LOOK.length],sty=L[0];
      // 외곽선은 영문에만 (한글은 글꼴 획이 겹쳐 보여서 채움으로)
      if(sty==='out'&&/[가-힣一-龥]/.test(String(t)))sty='fill';
      return '<div class="cut s-'+sty+' p-'+L[1]+' m-'+L[3]+'"><span class="tx" style="--fs:'+fontSize(String(t))+'">'+esc(t)+'</span></div>';
    }).join('');
    seg.innerHTML=cuts.map(function(){return '<i></i>'}).join('');
    slog.innerHTML='<span class="sl-in"><span class="ln l1"><span>'+esc(S.hero.title1)+'</span></span><span class="ln l2"><span>'+esc(S.hero.title2)+'</span></span></span>';
    document.getElementById('iName').textContent=S.site.name;
    return cuts.length;
  }

  // 슬로건을 첫 화면 제목과 똑같은 폭으로 맞추고, 제목 자리 기준으로 화면 가운데까지의 거리를 잼
  function place(){
    var h1=document.getElementById('heroTitle');if(!h1)return null;
    var r=h1.getBoundingClientRect();
    slog.style.width=r.width+'px';slog.style.left=r.left+'px';slog.style.top=r.top+'px';
    var tw=0;slog.querySelectorAll('.ln>span').forEach(function(s){
      var rg=document.createRange();rg.selectNodeContents(s);tw=Math.max(tw,rg.getBoundingClientRect().width);
    });
    return {dx:(innerWidth-tw)/2-r.left,dy:(innerHeight-slog.offsetHeight)/2-r.top};
  }

  function show(i,n){
    var cs=stage.children,ss=seg.children;
    for(var k=0;k<cs.length;k++){cs[k].classList.toggle('on',k===i);if(ss[k])ss[k].classList.toggle('on',k<=i)}
    if(i>=0){el.setAttribute('data-bg',LOOK[i%LOOK.length][2]);take.textContent='TAKE '+pad(i+1)+' / '+pad(n)}
  }

  function finish(){
    if(!running)return;running=false;
    timers.forEach(clearTimeout);timers=[];
    root.classList.add('entered');
    el.classList.add('gone');
    root.classList.remove('intro-on');
  }

  function play(){
    timers.forEach(clearTimeout);timers=[];running=true;
    var calm=isCalm();
    el.className='';el.removeAttribute('data-bg');if(calm)el.classList.add('calm');
    root.classList.remove('entered');root.classList.add('intro-on');
    window.scrollTo(0,0);
    var n=build();
    slog.style.transition='none';slog.style.transform='none';
    var go=function(){
      if(!running)return;
      var t=60;
      for(var i=0;i<n;i++)(function(i){at(t,function(){show(i,n)});t+=calm?320:LOOK[i%LOOK.length][4]})(i);
      at(t,function(){
        show(-1,n);el.removeAttribute('data-bg');
        var p=place();
        if(p&&!calm)slog.style.transform='translate('+p.dx+'px,'+p.dy+'px)';
        void slog.offsetWidth;slog.style.transition='';
        el.classList.add('p-slogan');
      });
      at(t+HOLD,function(){
        var h1=document.getElementById('heroTitle');
        if(h1){var r=h1.getBoundingClientRect();slog.style.left=r.left+'px';slog.style.top=r.top+'px'}
        el.classList.add('p-fly');slog.style.transform='none';
        root.classList.add('entered');
      });
      at(t+HOLD+FLY,finish);
    };
    // 글꼴이 다 불러와진 뒤 시작해야 크기가 정확해요 (최대 1.2초 기다림)
    var started=false,start=function(){if(!started){started=true;go()}};
    try{document.fonts.ready.then(start)}catch(e){start()}
    setTimeout(start,1200);
  }

  el.addEventListener('click',finish);
  document.getElementById('skip').addEventListener('click',function(e){e.stopPropagation();finish()});
  document.addEventListener('keydown',function(e){if(running&&(e.key==='Escape'||e.key==='Enter'))finish()});

  MSP.playIntro=function(){if(!root.classList.contains('admin'))play()};
  MSP.skipIntro=finish;

  if(root.classList.contains('intro-on')){
    if(document.visibilityState==='hidden'){
      document.addEventListener('visibilitychange',function v(){if(document.visibilityState==='visible'){document.removeEventListener('visibilitychange',v);play()}});
    }else play();
  }
})();
