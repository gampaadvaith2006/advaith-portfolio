const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced)document.body.classList.add('motion-ready');
const sections=[...document.querySelectorAll('section')];
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}},{threshold:.08});
sections.forEach(s=>observer.observe(s));
let frame=false;
function onScroll(){if(frame)return;frame=true;requestAnimationFrame(()=>{const y=scrollY;document.documentElement.style.setProperty('--progress',y/Math.max(1,document.documentElement.scrollHeight-innerHeight));document.body.classList.toggle('scrolled',y>30);let active='';for(const s of sections)if(s.getBoundingClientRect().top<innerHeight*.45)active=s.id;document.querySelectorAll('.pills a').forEach(a=>a.classList.toggle('active',a.hash==='#'+active));frame=false})}
addEventListener('scroll',onScroll,{passive:true});onScroll();
const pills=document.querySelector('.pills'),menu=$('menu-toggle');
menu.onclick=()=>{const open=pills.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'×':'☰'};
document.querySelectorAll('.pills a').forEach(a=>a.addEventListener('click',()=>{pills.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
addEventListener('keydown',e=>{if(e.key==='Escape'){pills.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}});
try{const saved=localStorage.getItem('advaith-portfolio-theme');if(saved==='dark')document.documentElement.dataset.theme='dark'}catch{}
function updateThemeLabel(){$('theme-toggle').setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme')}
updateThemeLabel();$('theme-toggle').onclick=()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('advaith-portfolio-theme',next)}catch{}updateThemeLabel()};
document.querySelectorAll('.tile').forEach((t,i)=>t.dataset.number=String(i+1).padStart(2,'0'));
const badge=document.querySelector('.id');
if(!reduced){badge.addEventListener('pointermove',e=>{const r=badge.getBoundingClientRect();badge.style.animation='none';badge.style.transform=`rotateY(${(e.clientX-r.left-r.width/2)/18}deg) rotateX(${-(e.clientY-r.top-r.height/2)/30}deg) rotate(-3deg)`});badge.addEventListener('pointerleave',()=>{badge.style.animation='';badge.style.transform=''})}
