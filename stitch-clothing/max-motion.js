(() => {
  const root=document.documentElement,body=document.body;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
  let motionTime=0,lastTime=0,motionRate=1,motionEnergy=1;
  document.addEventListener("stitch-motion-settings",e=>{motionRate=e.detail.speed;motionEnergy=e.detail.energy;});
  let paused=reduce.matches,raf=0,visible=true,mouse={x:0,y:0},follow={x:0,y:0};
  const stage=document.querySelector('.collection-stage');
  const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');body.append(progress);
  const cursor=document.createElement('div');cursor.className='motion-cursor';cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<span>VIEW</span>';body.append(cursor);
  const toggle=document.createElement('button');toggle.className='motion-toggle';toggle.id='motion-toggle';toggle.innerHTML='<i></i> MOTION: MAX';toggle.setAttribute('aria-label','Pause decorative motion');toggle.setAttribute('aria-pressed','true');body.append(toggle);
  const menuLink=document.createElement('a');menuLink.href='#motion-lab';menuLink.textContent='MOTION LAB';document.querySelector('#menu').append(menuLink);menuLink.onclick=()=>{document.querySelector('#menu').hidden=true;document.querySelector('#menu-button').setAttribute('aria-expanded','false');};
  stage.insertAdjacentHTML('afterbegin',`<div class="hero-atmosphere" aria-hidden="true"><span class="outline-word">IN MOTION</span><div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><span class="coordinate top-coordinate">EST. 2026 / INDEPENDENT EXPRESSION</span><span class="coordinate side-coordinate">MOVE DIFFERENT / DRESS YOUR WAY</span><i class="crosshair crosshair-one">+</i><i class="crosshair crosshair-two">+</i><div class="hero-scanline"></div></div>`);
  for(let i=0;i<16;i++){const dust=document.createElement('i');dust.className='motion-dust';dust.style.cssText=`left:${(i*37)%100}%;top:${(i*23)%100}%;--dust-delay:${i*-.7}s;--dust-duration:${7+i%5}s`;stage.querySelector('.hero-atmosphere').append(dust);}
  const marquee=document.createElement('section');marquee.className='motion-marquee';marquee.setAttribute('aria-label','Style never stands still');marquee.innerHTML=`<div class="marquee-track" aria-hidden="true">${Array(4).fill('<span>STYLE NEVER STANDS STILL</span><b>✳</b><span>WEAR IT YOUR WAY</span><b>✳</b>').join('')}</div>`;document.querySelector('#collection').after(marquee);
  const lab=document.createElement('section');lab.className='motion-lab';lab.id='motion-lab';lab.setAttribute('aria-label','Interactive rotating wardrobe');lab.innerHTML=`<div class="lab-sticky"><div class="lab-grid" aria-hidden="true"></div><div class="lab-header"><span>THE WARDROBE IN MOTION</span><span>03 LOOKS / ONE POINT OF VIEW</span></div><h2 class="lab-title">NOTHING<br>STANDS<br><em>STILL.</em></h2><div class="wardrobe-orbit"><button class="orbit-piece orbit-piece-0" data-orbit-look="0" aria-label="Explore the original striped shirt"><img src="assets/shirt.webp" alt="Striped shirt"><span>01 / SIGNATURE STRIPES ↗</span></button><button class="orbit-piece orbit-piece-1" data-orbit-look="1" aria-label="Explore the cream sweatshirt demo"><img src="assets/cream-shirt.webp" alt="Cream sweatshirt demo"><span>02 / RAGLAN SWEATSHIRT — DEMO ↗</span></button><button class="orbit-piece orbit-piece-2" data-orbit-look="2" aria-label="Explore the charcoal overshirt demo"><img src="assets/charcoal-shirt.webp" alt="Charcoal overshirt demo"><span>03 / CHARCOAL OVERSHIRT — DEMO ↗</span></button></div><div class="lab-footer"><span>SCROLL TO ROTATE THE WARDROBE ↓</span><span class="lab-degrees">000°</span></div></div>`;document.querySelector('#looks').after(lab);
  const manifesto=document.createElement('section');manifesto.className='kinetic-manifesto';manifesto.setAttribute('aria-label','Personal style manifesto');manifesto.innerHTML='<span class="manifesto-kicker">NO RULEBOOK. JUST YOU.</span><p><span>LESS ORDINARY.</span><span>MORE <em>YOU.</em></span><span>EVERY SINGLE DAY.</span></p><a href="#details" class="manifesto-link">FIND YOUR LOOK <span>↗</span></a>';document.querySelector('.campaign').after(manifesto);
  const footer=document.querySelector('footer');footer.insertAdjacentHTML('beforebegin','<div class="footer-kinetic" aria-hidden="true"><span>STITCH.</span><span>STITCH.</span><span>STITCH.</span></div>');
  document.querySelectorAll('.lab-title,.kinetic-manifesto p,.footer-kinetic').forEach(el=>el.classList.add('kinetic-text'));
  document.querySelectorAll('h1,.product-copy h2').forEach(el=>{el.classList.add('line-reveal');el.innerHTML=el.innerHTML.split(/<br\s*\/?\s*>/i).map((line,i)=>`<span class="text-line"><span style="--line:${i}">${line}</span></span>`).join('');});
  document.querySelectorAll('.look-card').forEach(card=>{card.classList.add('tilt-card');card.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--tilt-x',`${-y*11}deg`);card.style.setProperty('--tilt-y',`${x*13}deg`);card.style.setProperty('--shine-x',`${(x+.5)*100}%`);});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});});
  const magnetic=[...document.querySelectorAll('.carousel-controls button,.save-button,.small-link,.manifesto-link,#view-toggle')];
  magnetic.forEach(el=>{el.classList.add('magnetic');el.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const r=el.getBoundingClientRect();el.style.translate=`${(e.clientX-r.left-r.width/2)*.16}px ${(e.clientY-r.top-r.height/2)*.24}px`;});el.addEventListener('pointerleave',()=>{el.style.translate='0 0';});});
  document.querySelectorAll('.orbit-piece').forEach(b=>b.onclick=()=>{document.dispatchEvent(new CustomEvent('stitch-select-look',{detail:{index:Number(b.dataset.orbitLook)}}));document.querySelector('#details').scrollIntoView({behavior:paused?'auto':'smooth'});});
  document.querySelectorAll('a,button,summary').forEach(el=>{el.addEventListener('pointerenter',()=>{cursor.classList.add('is-over');cursor.classList.toggle('is-card',el.classList.contains('look-card')||el.classList.contains('orbit-piece'));});el.addEventListener('pointerleave',()=>{cursor.classList.remove('is-over','is-card');});});
  document.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;cursor.classList.add('is-visible');},{passive:true});document.addEventListener('pointerleave',()=>cursor.classList.remove('is-visible'));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('motion-in-view');}),{threshold:.18});document.querySelectorAll('.kinetic-manifesto,.lab-title,.product-copy,.section-heading,.footer-kinetic').forEach(e=>observer.observe(e));
  const labPieces=[...document.querySelectorAll('.orbit-piece')];
  function tick(frameTime){
    if(paused||!visible){raf=0;return;}
    motionTime+=lastTime?Math.min(50,frameTime-lastTime)*motionRate:0;lastTime=frameTime;const time=motionTime;
    const height=innerHeight,width=innerWidth,documentRange=Math.max(1,root.scrollHeight-height);
    root.style.setProperty('--reading',`${scrollY/documentRange}`);
    follow.x+=(mouse.x-follow.x)*.14;follow.y+=(mouse.y-follow.y)*.14;cursor.style.transform=`translate3d(${follow.x}px,${follow.y}px,0)`;
    const mx=(mouse.x-width/2)/width,my=(mouse.y-height/2)/height;
    stage.style.setProperty('--mouse-x',`${mx*20}px`);stage.style.setProperty('--mouse-y',`${my*14}px`);
    const lr=lab.getBoundingClientRect();
    if(lr.top<height&&lr.bottom>0){
      const lp=Math.max(0,Math.min(1,-lr.top/Math.max(1,lab.offsetHeight-height))),angle=lp*Math.PI*2+time*.00019;
      const orbitWidth=Math.min(width*.36*motionEnergy,width*.43,550),orbitHeight=height*.14*motionEnergy;
      labPieces.forEach((piece,i)=>{const a=angle+i*Math.PI*2/3,s=Math.sin(a),c=Math.cos(a);piece.style.transform=`translate3d(${c*orbitWidth}px,${s*orbitHeight}px,0) rotate(${c*9}deg) scale(${.8+(s+1)*.18})`;piece.style.opacity=String(.45+(s+1)*.275);piece.style.zIndex=String(Math.round((s+1)*10)+2);});
      lab.querySelector('.lab-degrees').textContent=String(Math.round(lp*360)).padStart(3,'0')+'°';lab.style.setProperty('--lab-progress',lp.toFixed(4));
    }
    const mr=manifesto.getBoundingClientRect();if(mr.top<height&&mr.bottom>0)manifesto.style.setProperty('--manifesto-progress',Math.max(0,Math.min(1,(height-mr.top)/(height+mr.height))).toFixed(4));
    const stageRect=stage.getBoundingClientRect();if(stageRect.top<height&&stageRect.bottom>0)stage.style.setProperty('--breathe',`${Math.sin(time*.0008)*7}px`);
    raf=requestAnimationFrame(tick);
  }
  function start(){if(!raf&&!paused&&visible){lastTime=0;raf=requestAnimationFrame(tick);}}
  function setPaused(value){paused=value;body.classList.toggle('motion-paused',paused);toggle.innerHTML=paused?'<i></i> MOTION: PAUSED':'<i></i> MOTION: MAX';toggle.setAttribute('aria-pressed',!paused);toggle.setAttribute('aria-label',paused?'Resume decorative motion':'Pause decorative motion');document.dispatchEvent(new CustomEvent('stitch-motion',{detail:{paused}}));if(paused){cancelAnimationFrame(raf);raf=0;}else start();}
  toggle.onclick=()=>setPaused(!paused);reduce.addEventListener('change',()=>setPaused(reduce.matches));document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(!visible){cancelAnimationFrame(raf);raf=0;}else start();});
  if(!reduce.matches&&!location.hash){
    const intro=document.createElement('div');intro.className='cinematic-intro';intro.innerHTML='<div class="intro-top"><span>STITCH CLOTHING</span><span>COLLECTION STUDY / 2026</span></div><div class="intro-word"><span>S</span><span>T</span><span>I</span><span>T</span><span>C</span><span>H</span><b>®</b></div><div class="intro-bottom"><span>INDIVIDUAL STYLE. CONSTANT MOTION.</span><button aria-label="Skip introduction">SKIP INTRO ↗</button></div><div class="intro-line"></div>';body.append(intro);body.classList.add('intro-playing');let done=false;const finish=()=>{if(done)return;done=true;intro.classList.add('intro-done');body.classList.remove('intro-playing');body.classList.add('intro-finished');setTimeout(()=>intro.remove(),850);};intro.querySelector('button').onclick=finish;setTimeout(finish,1800);
  }else body.classList.add('intro-finished');
  document.querySelectorAll('.look-card,.save-button,.orbit-piece').forEach(el=>el.addEventListener('click',e=>{if(paused)return;const ripple=document.createElement('span'),r=el.getBoundingClientRect();ripple.className='click-ripple';ripple.style.left=(e.clientX-r.left)+'px';ripple.style.top=(e.clientY-r.top)+'px';el.append(ripple);setTimeout(()=>ripple.remove(),750);}));
  setPaused(paused);start();
})();
