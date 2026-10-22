/* Additions: animated stat counters + "Ask my terminal". Rolling ticker is pure CSS. */
(function(){
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId=id=>document.getElementById(id);

/* ---------- animated counters ---------- */
function runCount(el){
  const n=+el.dataset.n,s=el.dataset.s,dur=1700,t0=performance.now();
  (function step(t){
    const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);
    el.textContent=Math.round(n*e)+(p<1?'':s);
    if(p<1)requestAnimationFrame(step);else el.classList.add('counted');
  })(t0);
}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);runCount(e.target)}}),{threshold:.6});
document.querySelectorAll('.stat b,.featured-counts b').forEach(el=>{
  const m=el.textContent.trim().match(/^(\d+)(\D*)$/);
  if(!m)return;
  el.dataset.n=m[1];el.dataset.s=m[2];
  if(!reduced){el.textContent='0'+m[2];io.observe(el)}
});

/* ---------- terminal ---------- */
const out=byId('term-out'),input=byId('term-in');
if(!out||!input)return;
const history=[];let hi=0;
function say(text,cls){const d=document.createElement('div');if(cls)d.className=cls;d.textContent=text;out.appendChild(d);out.scrollTop=out.scrollHeight}
function skillsText(){
  try{
    return Object.entries(groups).filter(([k])=>k!=='all').map(([k,v])=>v+':\n  '+tiles.filter(t=>t[2]===k).map(t=>t[1]).join(', ')).join('\n\n');
  }catch(e){return 'Python, C, JavaScript, HTML, CSS, Node.js, Machine Learning'}
}
function projectsText(){
  try{
    const list=[['BotCorp','AI automation · Live showcase']].concat(projects.map(p=>[p[0],p[1]]));
    return list.map((p,i)=>(i+1)+'. '+p[0]+'  ('+p[1]+')').join('\n')+'\n\nMore on github.com/gampaadvaith2006';
  }catch(e){return 'BotCorp, IT Company Platform. See github.com/gampaadvaith2006'}
}
const CMD={
  help:()=>'Commands:\n  about      who I am\n  skills     tools I use\n  projects   things I have built\n  education  where I study\n  contact    how to reach me\n  resume     open my resume PDF\n  clear      clear the screen',
  about:()=>"Gampa Advaith, B.Tech CSE (AI & ML) at St. Peter's Engineering College.\nI learn by building: AI-assisted apps, NLP experiments and automation workflows in Python and JavaScript.\nLooking for AI/ML, Python and software engineering internships.",
  skills:skillsText,
  projects:projectsText,
  education:()=>"B.Tech, Computer Science and Engineering (AI & ML)\n  St. Peter's Engineering College (currently pursuing)\nIntermediate (MPC)\n  Gurukrupa Junior College, 2024\nClass 10\n  Celestial High School, 2022",
  contact:()=>'Phone:    7893222590\nEmail:    gampaadvaith2006@gmail.com\nLocation: Siddipet, Telangana, India, 502103\nLinkedIn: linkedin.com/in/gampa-advaith-818228326\nGitHub:   github.com/gampaadvaith2006',
  resume:()=>{window.open('assets/Gampa-Advaith-Resume.pdf','_blank','noopener');return 'Opening resume PDF…'}
};
function exec(raw){
  const v=raw.trim().toLowerCase();
  if(!v)return;
  history.push(v);hi=history.length;
  say('$ '+v,'tcmd');
  if(v==='clear'){out.textContent='';return}
  say(CMD[v]?CMD[v]():'Command not found: '+v+'. Type help.');
}
say('Welcome. Type help to see what I can show you.');
input.addEventListener('keydown',e=>{
  if(e.key==='Enter'){exec(input.value);input.value=''}
  else if(e.key==='ArrowUp'&&history.length){hi=Math.max(0,hi-1);input.value=history[hi];e.preventDefault()}
  else if(e.key==='ArrowDown'){hi=Math.min(history.length,hi+1);input.value=history[hi]||'';e.preventDefault()}
});
byId('term-cmds').addEventListener('click',e=>{const b=e.target.closest('button[data-c]');if(b)exec(b.dataset.c)});
document.querySelector('.term-in').addEventListener('click',()=>input.focus());
})();
