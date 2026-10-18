const $=s=>document.querySelector(s);
const root=document.documentElement;
let tasks=[],filter='all';
try{tasks=JSON.parse(localStorage.getItem('ember-todo')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('ember-todo',JSON.stringify(tasks))}catch(e){}};
$('#date').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});

/* ---- Light / Dark mode event ---- */
function applyMode(mode,announce){
  root.dataset.theme=mode;root.dataset.mode=mode;
  $('#knob').textContent=mode==='dark'?'🌙':'☀️';
  $('#theme').setAttribute('aria-checked',mode==='dark');
  try{localStorage.setItem('ember-theme',mode)}catch(e){}
  if(announce){const t=$('#toast');t.textContent=mode==='dark'?'🌙 Dark mode on':'☀️ Light mode on';
    t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1400)}
}
let saved=null;try{saved=localStorage.getItem('ember-theme')}catch(e){}
applyMode(saved||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'),false);
$('#theme').addEventListener('click',()=>applyMode(root.dataset.mode==='dark'?'light':'dark',true));

function render(){
  const list=$('#list');list.innerHTML='';
  const shown=tasks.filter(t=>filter==='all'||(filter==='done')===t.done);
  shown.forEach(t=>{
    const li=document.createElement('li');li.className='card'+(t.done?' done':'');
    li.innerHTML='<div class="tag"></div><button class="chk" aria-label="Complete">'+(t.done?'✓':'')+'</button><span class="txt"></span><button class="del" aria-label="Delete">✕</button>';
    li.querySelector('.txt').textContent=t.text;
    li.querySelector('.chk').onclick=()=>{t.done=!t.done;save();if(t.done&&tasks.every(x=>x.done))confetti();render()};
    li.querySelector('.del').onclick=()=>{li.classList.add('out');setTimeout(()=>{tasks=tasks.filter(x=>x!==t);save();render()},230)};
    list.appendChild(li);
  });
  if(!shown.length){list.innerHTML='<div class="empty"><i>🔥</i>'+(tasks.length?'Nothing here':'Your list is empty. Add your first task.')+'</div>'}
  const d=tasks.filter(t=>t.done).length,n=tasks.length,p=n?Math.round(d/n*100):0;
  $('#pct').textContent=p+'%';$('#arc').style.strokeDashoffset=220-220*p/100;
  $('#cnt').textContent=d+' of '+n+' tasks done';
  $('#left').textContent=(n-d)+' remaining';
  $('#msg').textContent=!n?'Start with one small task':p===100?'All done. Nice work! 🎉':p>=50?'Halfway there, keep going!':'One step at a time';
}
function add(){
  const v=$('#in').value.trim();if(!v)return;
  tasks.unshift({text:v,done:false});$('#in').value='';save();render();
}
function confetti(){
  const c=['#ff6a00','#ff9a3d','#ffb366','#ffffff','#1a1a1a'];
  for(let i=0;i<50;i++){const e=document.createElement('div');e.className='conf';
    e.style.left=Math.random()*100+'vw';e.style.background=c[i%5];
    e.style.animationDelay=Math.random()*.4+'s';e.style.animationDuration=1.2+Math.random()+'s';
    document.body.appendChild(e);setTimeout(()=>e.remove(),2800)}
}
$('#addb').onclick=add;
$('#in').addEventListener('keydown',e=>{if(e.key==='Enter')add()});
$('#tabs').onclick=e=>{const f=e.target.dataset.f;if(!f)return;filter=f;
  document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.f===f));render()};
$('#clear').onclick=()=>{tasks=tasks.filter(t=>!t.done);save();render()};
render();
