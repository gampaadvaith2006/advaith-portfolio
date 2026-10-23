(() => {
  const garments=['shirt.webp','cream-shirt.webp','charcoal-shirt.webp'];
  const labels=['SIGNATURE STRIPES','RAGLAN SWEATSHIRT / DEMO','CHARCOAL OVERSHIRT / DEMO'];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduce.matches||document.body.classList.contains('motion-paused');
  const image=(i,cls='')=>`<img class="${cls}" src="assets/${garments[i%3]}" alt="" draggable="false">`;
  const stream=document.createElement('div');stream.className='page-clothing-stream';stream.setAttribute('aria-hidden','true');stream.innerHTML=garments.map((_,i)=>image(i,'traveling-cloth traveling-cloth-'+i)).join('');document.body.append(stream);
  const runway=document.createElement('section');runway.className='clothing-runway';runway.setAttribute('aria-label','Animated clothing runway');runway.innerHTML=`<div class="runway-heading"><h2>ALL DAY.<br>IN MOTION.</h2><span>THE CLOTHING NEVER STOPS.</span></div><div class="runway-track" aria-hidden="true">${Array.from({length:12},(_,i)=>`<div class="runway-item" style="--item:${i}">${image(i)}<span>${String(i%3+1).padStart(2,'0')} / ${labels[i%3]}</span></div>`).join('')}</div>`;document.querySelector('.editorial').after(runway);
  const scenes=[];
  [['.editorial',3],['.campaign',4],['.kinetic-manifesto',3],['.product-section',2]].forEach(([selector,count])=>{
    const section=document.querySelector(selector),layer=document.createElement('div');
    layer.className='section-clothing-scene';layer.setAttribute('aria-hidden','true');layer.innerHTML=Array.from({length:count},(_,i)=>image(i,'scene-cloth scene-cloth-'+i)).join('');section.append(layer);scenes.push({section,images:[...layer.children]});
  });
  document.querySelectorAll('.look-card').forEach((card,i)=>{
    const frame=card.querySelector('.card-image');
    const overlay=document.createElement('div');overlay.className='card-clothing-float';overlay.setAttribute('aria-hidden','true');overlay.innerHTML=image(i);frame.append(overlay);card.style.setProperty('--card-phase',`${i*-.75}s`);
  });
  const finale=document.createElement('section');finale.className='clothing-finale';finale.setAttribute('aria-label','The collection in constant motion');finale.innerHTML=`<div class="finale-copy"><span>ONE WARDROBE. ENDLESS EXPRESSION.</span><h2>KEEP<br><em>MOVING.</em></h2><a href="#collection">REPLAY THE COLLECTION ↗</a></div><div class="finale-wheel" aria-hidden="true">${Array.from({length:6},(_,i)=>`<div class="wheel-arm" style="--arm:${i}">${image(i)}</div>`).join('')}</div>`;document.querySelector('.footer-kinetic').before(finale);
  const menu=document.querySelector('#menu'),link=document.createElement('a');link.href='#clothing-finale';finale.id='clothing-finale';link.textContent='CLOTHING FINALE';menu.append(link);link.onclick=()=>{menu.hidden=true;document.querySelector('#menu-button').setAttribute('aria-expanded','false');};
  document.querySelectorAll('.swatch').forEach((swatch,i)=>{const preview=document.createElement('span');preview.className='swatch-preview';preview.setAttribute('aria-hidden','true');preview.innerHTML=image(i);swatch.append(preview);});
  const travelers=[...stream.children];
  let raf=0,time=0,last=0,motionRate=1,motionEnergy=1;
  document.addEventListener("stitch-motion-settings",e=>{motionRate=e.detail.speed;motionEnergy=e.detail.energy;});
  const clamp=n=>Math.max(0,Math.min(1,n));
  function frame(now){
    if(paused||document.hidden){raf=0;return;}
    time+=last?Math.min(50,now-last)*motionRate:0;last=now;
    const h=innerHeight,w=innerWidth,y=scrollY,mobile=w<=640;
    travelers.forEach((cloth,i)=>{
      const x=i%2===0?w*(mobile?.94:.98):w*(mobile?.04:.025);
      const py=h*(.18+i*.27)+Math.sin(time*.00045+i*2)*h*.08;
      cloth.style.transform=`translate3d(${x+Math.sin(time*.0003+i)*w*.025}px,${py}px,0) rotate(${Math.sin(time*.0005+i)*16+(i%2?10:-10)}deg) rotateY(${Math.sin(time*.0004+i)*24}deg)`;
      cloth.style.opacity=String((mobile?.10:.19)+Math.sin(time*.0003+i)*.035);
    });
    scenes.forEach(({section,images},sceneIndex)=>{
      const r=section.getBoundingClientRect();if(r.top>h||r.bottom<0)return;
      const p=clamp((h-r.top)/(h+r.height));
      images.forEach((cloth,i)=>{
        const side=i%2===0?-1:1;
        const x=(side<0?w*.12:w*.87)+Math.sin(time*.0003+i+sceneIndex)*w*.035;
        const centerY=r.height*(.24+(i/Math.max(1,images.length-1))*.5);
        const py=centerY+(p-.5)*-h*(.2+i*.05)+Math.sin(time*.00065+i*2)*18*motionEnergy;
        cloth.style.transform=`translate3d(${x}px,${py}px,0) rotate(${side*(10+Math.sin(time*.0005+i)*9)}deg) rotateY(${Math.sin(time*.0006+i)*25}deg) scale(${.88+Math.cos(time*.0005+i)*.08})`;
      });
    });
    raf=requestAnimationFrame(frame);
  }
  function start(){if(!raf&&!paused&&!document.hidden){last=0;raf=requestAnimationFrame(frame);}}
  document.addEventListener('stitch-motion',e=>{paused=e.detail.paused||reduce.matches;if(paused){cancelAnimationFrame(raf);raf=0;}else start();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else start();});
  reduce.addEventListener('change',()=>{paused=reduce.matches||document.body.classList.contains('motion-paused');if(paused){cancelAnimationFrame(raf);raf=0;}else start();});
  start();
})();
