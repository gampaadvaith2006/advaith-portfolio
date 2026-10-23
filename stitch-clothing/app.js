let wardrobeSpeed=1;
let motionPaused=false;
const looks = [
  {image:'portrait.webp',garment:'shirt.webp',title:'Signature striped shirt',label:'SIGNATURE STRIPES',type:'THE ORIGINAL LOOK',description:'Dark charcoal shirt with fine vertical stripes, an open collar, and light tailored trousers.',color:'#f1f0e9'},
  {image:'cream.webp',garment:'cream-shirt.webp',title:'Raglan sweatshirt',label:'RAGLAN SWEATSHIRT',type:'DEMO OUTFIT / AI STYLE PREVIEW',description:'A cream sweatshirt with dark raglan sleeves. This additional outfit is an AI-created styling concept.',color:'#ede9e1'},
  {image:'charcoal.webp',garment:'charcoal-shirt.webp',title:'Charcoal overshirt',label:'THE OVERSHIRT',type:'DEMO OUTFIT / AI STYLE PREVIEW',description:'A washed charcoal overshirt over a black T-shirt. This additional outfit is an AI-created styling concept.',color:'#e9eae3'}
];
const $ = s => document.querySelector(s);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const stage = $('.collection-stage'), model = $('#model'), detailModel = $('#detail-model');
const leftGarment = $('.garment-left'), rightGarment = $('.garment-right');
let current = 0, playing = !reducedMotion.matches, busy = false, queued = null;
let shirtView = false, timer, switchTimer, finishTimer, scrollLook = 0;
let saved = [];
try { const value = JSON.parse(localStorage.getItem('stitch-saved') || '[]'); if(Array.isArray(value)) saved=value.filter(i=>Number.isInteger(i)&&i>=0&&i<3); } catch {}
const wrap = i => (i % looks.length + looks.length) % looks.length;
const clamp = n => Math.max(0,Math.min(1,n));
const activeAnimations = [];
const incoming = document.createElement('img'), outgoing = document.createElement('img');
for (const [image,kind] of [[incoming,'incoming'],[outgoing,'outgoing']]) {
  image.className = 'flying-garment '+kind;
  image.alt = ''; image.setAttribute('aria-hidden','true'); stage.append(image);
}

function updateSaved() {
  const active = saved.includes(current);
  $('#saved-count').textContent = saved.length;
  $('#save-look').innerHTML = active ? 'LOOK SAVED <span>✓</span>' : 'SAVE THIS LOOK <span>+</span>';
  $('#save-look').setAttribute('aria-pressed',active);
  $('#save-status').textContent = active ? 'This look is saved on this device.' : 'Save your favorite look on this device.';
}
function renderLook(index) {
  current = wrap(index);
  const look = looks[current];
  model.src = 'assets/'+look.image; model.alt = look.type+': '+look.title;
  detailModel.src = model.src; detailModel.alt = model.alt; shirtView=false;
  leftGarment.querySelector('img').src = 'assets/'+looks[wrap(current-1)].garment;
  rightGarment.querySelector('img').src = 'assets/'+looks[wrap(current+1)].garment;
  $('#view-toggle').textContent = 'VIEW GARMENT ↗';
  $('#look-type').textContent=look.type;
  $('#look-name').textContent=String(current+1).padStart(2,'0')+' — '+look.label;
  $('#slide-counter').textContent=String(current+1).padStart(2,'0')+' / 03';
  $('#product-name').textContent=look.title; $('#product-note').textContent=look.type;
  $('#look-description').textContent=look.description;
  stage.style.backgroundColor=look.color;
  document.querySelectorAll('.swatch').forEach((button,i)=>{button.classList.toggle('selected',i===current);button.setAttribute('aria-pressed',i===current);});
  updateSaved();
}

// A garment crosses the stationary portrait, covers the shirt, and reveals the new outfit.
function selectLook(index, animate=true, direction=1) {
  index=wrap(index);
  if(busy){queued={index,animate,direction};return;}
  if(index===current)return;
  const visible=stage.getBoundingClientRect().bottom>0 && $('#collection').getBoundingClientRect().top<innerHeight;
  if(!animate || reducedMotion.matches || motionPaused || !visible){renderLook(index);return;}
  busy=true; stage.classList.add('wardrobe-changing');
  const w=stage.clientWidth,h=stage.clientHeight,mobile=w<=640;
  const centerX=w*(mobile?.605:.545), centerY=h*(mobile?.62:.54);
  const garmentWidth=w*(mobile?.50:.245), garmentHeight=h*(mobile?.31:.43);
  const x=centerX-garmentWidth/2, y=centerY-garmentHeight/2;
  const travel=w*(mobile?.52:.34), from=x+travel*direction, to=x-travel*direction;
  const at=(tx,ty,scale,angle,rotateY=0)=>`translate3d(${tx}px,${ty}px,0) rotate(${angle}deg) rotateY(${rotateY}deg) scale(${scale})`;
  for(const img of [incoming,outgoing]){img.style.width=garmentWidth+'px';img.style.height=garmentHeight+'px';}
  incoming.src='assets/'+looks[index].garment; outgoing.src='assets/'+looks[current].garment;
  leftGarment.style.opacity='0'; rightGarment.style.opacity='0';
  const timing={duration:1250/wardrobeSpeed,easing:'linear',fill:'both'};
  activeAnimations.push(incoming.animate([
    {transform:at(from,y,1,12*direction,-24*direction),opacity:.24,offset:0},
    {transform:at(x+travel*.24*direction,y-10,.84,4*direction),opacity:.85,offset:.36},
    {transform:at(x,y,.70,0),opacity:1,offset:.53},
    {transform:at(x,y+4,.68,0),opacity:0,offset:.74},
    {transform:at(x,y+4,.68,0),opacity:0,offset:1}
  ],timing));
  activeAnimations.push(outgoing.animate([
    {transform:at(x,y,.70,0),opacity:0,offset:0},
    {transform:at(x,y,.70,0),opacity:0,offset:.39},
    {transform:at(x-travel*.2*direction,y-8,.82,-5*direction),opacity:.65,offset:.58},
    {transform:at(to,y,1,-12*direction,24*direction),opacity:.24,offset:1}
  ],timing));
  switchTimer=setTimeout(()=>{
    renderLook(index);
    $('.slide-label').animate([{opacity:0,transform:'translate(-25%, 10px)'},{opacity:1,transform:'translate(-25%, 0)'}],{duration:400,fill:'both'});
  },610/wardrobeSpeed);
  finishTimer=setTimeout(()=>{
    activeAnimations.splice(0).forEach(a=>a.cancel());
    stage.classList.remove('wardrobe-changing');leftGarment.style.opacity='';rightGarment.style.opacity='';
    busy=false;
    if(queued){const next=queued;queued=null;selectLook(next.index,next.animate,next.direction);}
  },1260/wardrobeSpeed);
}

function renderPlay(){const b=$('#auto-toggle');b.textContent=playing?'PAUSE Ⅱ':'PLAY ▷';b.setAttribute('aria-pressed',playing);b.setAttribute('aria-label',playing?'Pause outfit slideshow':'Play outfit slideshow');}
function resetTimer(){clearInterval(timer);if(playing&&!reducedMotion.matches&&!motionPaused)timer=setInterval(()=>{const r=stage.getBoundingClientRect();if(document.visibilityState==='visible'&&r.top<=innerHeight*.4&&r.bottom>innerHeight*.5&&!busy)selectLook(current+1,true,1);},3300/wardrobeSpeed);}
$('#next').onclick=()=>{selectLook(current+1,true,1);resetTimer();};
$('#previous').onclick=()=>{selectLook(current-1,true,-1);resetTimer();};
$('#auto-toggle').onclick=()=>{playing=!playing;renderPlay();resetTimer();};
document.querySelectorAll('[data-look]').forEach(b=>b.onclick=()=>{selectLook(Number(b.dataset.look),!b.classList.contains('swatch'));resetTimer();if(b.classList.contains('look-card'))$('#details').scrollIntoView({behavior:'smooth'});});
$('#save-look').onclick=()=>{saved=saved.includes(current)?saved.filter(i=>i!==current):[...saved,current];try{localStorage.setItem('stitch-saved',JSON.stringify(saved));}catch{}updateSaved();};
$('#saved-link').onclick=()=>{if(saved.length)selectLook(saved[0],false);$('#details').scrollIntoView({behavior:'smooth'});};
$('#view-toggle').onclick=()=>{
  const swap=()=>{shirtView=!shirtView;detailModel.src='assets/'+(shirtView?looks[current].garment:looks[current].image);detailModel.alt=shirtView?'Isolated garment product preview':looks[current].title;$('#view-toggle').textContent=shirtView?'VIEW OUTFIT ↗':'VIEW GARMENT ↗';};
  if(reducedMotion.matches){swap();return;}
  const a=detailModel.animate([{transform:'rotateY(0deg)',opacity:1},{transform:'rotateY(90deg)',opacity:0}],{duration:240,fill:'forwards'});
  a.onfinish=()=>{swap();a.cancel();detailModel.animate([{transform:'rotateY(-90deg)',opacity:0},{transform:'rotateY(0deg)',opacity:1}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'});};
};
$('#menu-button').onclick=()=>{const m=$('#menu');m.hidden=!m.hidden;$('#menu-button').setAttribute('aria-expanded',!m.hidden);};
document.querySelectorAll('#menu a').forEach(a=>a.onclick=()=>{$('#menu').hidden=true;$('#menu-button').setAttribute('aria-expanded','false');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#menu').hidden=true;$('#menu-button').setAttribute('aria-expanded','false');}if(scrollY<$('#collection').offsetHeight-innerHeight){if(e.key==='ArrowRight'){selectLook(current+1,true,1);resetTimer();}if(e.key==='ArrowLeft'){selectLook(current-1,true,-1);resetTimer();}}});
let startX;stage.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;},{passive:true});stage.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>50){selectLook(current+(d<0?1:-1),true,d<0?1:-1);resetTimer();}},{passive:true});

// Scroll holds the collection in view while the three outfits play, then releases it.
let ticking=false;
function updateScroll(){
  const span=Math.max(1,$('#collection').offsetHeight-innerHeight);
  const progress=clamp(scrollY/span);
  document.documentElement.style.setProperty('--progress',progress.toFixed(4));
  if(scrollY<=span&&!reducedMotion.matches&&!motionPaused){
    const next=Math.min(2,Math.floor(progress*2.85));
    if(next!==scrollLook){const direction=next>scrollLook?1:-1;scrollLook=next;selectLook(next,true,direction);resetTimer();}
  }
  if(!reducedMotion.matches&&!motionPaused){
    for(const section of document.querySelectorAll('.editorial,.campaign')){
      const r=section.getBoundingClientRect(), p=clamp((innerHeight-r.top)/(innerHeight+r.height));
      section.style.setProperty('--section-progress',p.toFixed(4));
    }
    const r=$('.editorial').getBoundingClientRect(), enter=clamp(1-r.top/innerHeight);
    $('.editorial').style.clipPath=`inset(${(1-enter)*10}% ${(1-enter)*6}% 0)`;
  }
  ticking=false;
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}},{passive:true});
addEventListener('resize',updateScroll,{passive:true});
const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}},{threshold:.12});
document.querySelectorAll('.look-card,.section-heading,.product-copy,.product-image,.product-info').forEach((el,i)=>{el.classList.add('scroll-reveal');el.style.setProperty('--reveal-delay',`${(el.classList.contains('look-card')?i%5:0)*80}ms`);revealObserver.observe(el);});
for(const look of looks)for(const src of [look.image,look.garment]){const img=new Image();img.src='assets/'+src;}
renderLook(0);renderPlay();resetTimer();updateScroll();
reducedMotion.addEventListener('change',()=>{playing=!reducedMotion.matches;renderPlay();resetTimer();if(reducedMotion.matches){clearTimeout(switchTimer);clearTimeout(finishTimer);activeAnimations.splice(0).forEach(a=>a.cancel());busy=false;queued=null;stage.classList.remove('wardrobe-changing');leftGarment.style.opacity='';rightGarment.style.opacity='';$('.editorial').style.clipPath='';}});

document.addEventListener("stitch-motion",event=>{motionPaused=event.detail.paused;playing=!motionPaused;renderPlay();resetTimer();});
document.addEventListener("stitch-select-look",event=>selectLook(event.detail.index,false));

document.addEventListener("stitch-motion-settings",event=>{wardrobeSpeed=event.detail.speed;resetTimer();});
