/* =====================================================================
   intro.js — 키워드 타이포 인트로 (약 5초, 건너뛰기 가능)
   키워드는 data.js 의 intro.keywords, 슬로건은 hero.title1 / title2 를 써요.
   시간 조절: 아래 STEP(키워드 하나 머무는 시간), HOLD(슬로건 머무는 시간)
   ===================================================================== */
(function(){
  var STEP=950, HOLD=1000, FLY=1000;
  var MSP=window.MSP||{},S=window.SITE,root=document.documentElement;
  var el=document.getElementById('intro');if(!el)return;
  var roll=document.getElementById('iRoll'),slog=document.getElementById('iSlogan');
  var count=document.getElementById('iCount'),bar=document.getElementById('iBar');
  var timers=[],running=false;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function at(ms,fn){timers.push(setTimeout(fn,ms))}
  function pad(n){return String(n).padStart(2,'0')}
  function isCalm(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}

  function build(){
    var kws=(S.intro&&S.intro.keywords)||[];
    roll.innerHTML=kws.map(function(k){
      var letters=Array.from(String(k.en)).map(function(c,j){return '<span class="ch" style="--i:'+j+'">'+(c===' '?'&nbsp;':esc(c))+'</span>'}).join('');
      return '<div class="w"><span class="en">'+letters+'</span><span class="ko"><span>'+esc(k.ko)+'</span></span></div>';
    }).join('');
    slog.innerHTML='<span class="ln l1"><span>'+esc(S.hero.title1)+'</span></span><span class="ln l2"><span>'+esc(S.hero.title2)+'</span></span>';
    document.getElementById('iEb').textContent=S.site.name;
    return kws.length;
  }

  // 슬로건을 첫 화면 제목과 똑같은 폭으로 맞추고, 끝 위치(제목 자리)를 기준으로 가운데까지의 거리를 잼
  function place(){
    var h1=document.getElementById('heroTitle');if(!h1)return null;
    var r=h1.getBoundingClientRect();
    slog.style.width=r.width+'px';slog.style.left=r.left+'px';slog.style.top=r.top+'px';
    var tw=0;slog.querySelectorAll('.ln>span').forEach(function(s){
      var rg=document.createRange();rg.selectNodeContents(s);tw=Math.max(tw,rg.getBoundingClientRect().width);
    });
    var h=slog.offsetHeight;
    return {dx:(innerWidth-tw)/2-r.left,dy:(innerHeight-h)/2-r.top};
  }

  function show(i,n){
    var ws=roll.children;
    for(var k=0;k<ws.length;k++){
      ws[k].classList.toggle('in',k===i);
      ws[k].classList.toggle('out',k<i||(i<0&&ws[k].classList.contains('in')));
    }
    if(i>=0){count.textContent=pad(i+1)+' / '+pad(n);bar.style.width=((i+1)/n*100)+'%'}
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
    el.className='';if(calm)el.classList.add('calm');
    root.classList.remove('entered');root.classList.add('intro-on');
    window.scrollTo(0,0);
    var n=build();
    slog.style.transition='none';slog.style.transform='none';
    var go=function(){
      if(!running)return;
      at(80,function(){el.classList.add('p-on')});
      for(var i=0;i<n;i++)(function(i){at(220+i*STEP,function(){show(i,n)})})(i);
      var tEnd=220+n*STEP;
      at(tEnd,function(){
        show(-1,n);
        var p=place();
        if(p&&!calm){slog.style.transform='translate('+p.dx+'px,'+p.dy+'px)'}
        void slog.offsetWidth;slog.style.transition='';
        el.classList.add('p-slogan');
      });
      at(tEnd+HOLD,function(){
        var h1=document.getElementById('heroTitle');
        if(h1){var r=h1.getBoundingClientRect();slog.style.left=r.left+'px';slog.style.top=r.top+'px'}
        el.classList.add('p-fly');slog.style.transform='none';
        root.classList.add('entered');
      });
      at(tEnd+HOLD+FLY,finish);
    };
    // 글꼴이 다 불러와진 뒤 시작해야 슬로건 크기가 정확해요 (최대 1.2초 기다림)
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
