const $ = (s) => document.querySelector(s);
const app = $('#app');
const STORAGE_KEY = 'aklabs-intensivo-if-v1';
const initial = {state:'',institution:'',level:'integrado',answered:0,correct:0,errors:[],bySubject:{}};
const progress = Object.assign(initial, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
const data = window.IF_DATA;

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  if(window.cloudSync && typeof window.cloudSync.scheduleSave === 'function'){
    window.cloudSync.scheduleSave(progress);
  }
}
window.toast = toast;
window.getProgressState = () => progress;
window.applyCloudProgress = (cloudProgress) => {
  Object.assign(progress, cloudProgress);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  if(typeof window.refreshRoute === 'function'){
    window.refreshRoute();
  }
};
function stateInfo(){ return data.states.find(s=>s[0]===progress.state); }
function questionPool(){ return data.questions.filter(q=>q.region==='BR'||q.region===progress.state); }
let currentRouteName = 'home', currentRouteArg = null;
function route(name,arg){
  currentRouteName = name || 'home';
  currentRouteArg = arg;
  const pages={home,setup,study,exams,progress:progressPage,quiz};
  (pages[name]||home)(arg); app.focus(); $('#nav').classList.remove('open');
}
window.refreshRoute = () => route(currentRouteName, currentRouteArg);
document.addEventListener('click',e=>{const b=e.target.closest('[data-route]'); if(b) route(b.dataset.route,b.dataset.arg);});
$('#menuBtn').onclick=()=>$('#nav').classList.toggle('open');

function home(){
  if(!progress.state) return setup();
  const info=stateInfo(); const rate=progress.answered?Math.round(progress.correct/progress.answered*100):0;
  app.innerHTML=`<div class="shell">
    <section class="welcome">
      <div><span class="eyebrow">Sua preparação para ${info[1]}</span><h1>Estude com o foco da sua região.</h1><p>Questões por área, acervo de provas oficiais e um plano que aprende com seus resultados.</p><div class="actions"><button class="btn primary" data-route="quiz">Começar simulado</button><button class="btn light" data-route="exams">Ver provas anteriores</button></div></div>
      <aside class="profile-card"><span class="profile-label">Minha seleção</span><strong>${progress.institution||info[2]}</strong><span>${progress.level==='integrado'?'Técnico integrado ao Ensino Médio':'Técnico subsequente'}</span><button data-route="setup">Alterar região</button></aside>
    </section>
    <section class="metrics" aria-label="Resumo do progresso"><div><strong>${progress.answered}</strong><span>questões respondidas</span></div><div><strong>${rate}%</strong><span>taxa de acerto</span></div><div><strong>${questionPool().length}</strong><span>questões disponíveis</span></div></section>
    <div class="section-title"><div><span class="eyebrow">Seu caminho</span><h2>O que fazer agora</h2></div></div>
    <section class="cards"><button class="feature" data-route="study"><span class="feature-number">01</span><h3>Estudar por matéria</h3><p>Escolha a área e pratique com explicações imediatas.</p></button><button class="feature featured" data-route="quiz"><span class="feature-number">02</span><h3>Simulado regional</h3><p>Uma rodada equilibrada com questões gerais e da sua UF.</p></button><button class="feature" data-route="exams"><span class="feature-number">03</span><h3>Provas reais</h3><p>Acesse cadernos e gabaritos publicados pelas instituições.</p></button></section>
  </div>`;
}

function setup(){
  const options=data.states.map(s=>`<option value="${s[0]}" ${s[0]===progress.state?'selected':''}>${s[1]} (${s[0]})</option>`).join('');
  app.innerHTML=`<div class="shell narrow"><section class="setup-head"><span class="eyebrow">Personalize sua preparação</span><h1>Onde você fará a prova?</h1><p>Usamos sua região para mostrar Institutos Federais, materiais e questões mais relevantes.</p></section><form id="setupForm" class="setup-form"><label>Estado<select id="stateSelect" required><option value="">Selecione seu estado</option>${options}</select></label><label>Instituição<select id="institutionSelect" required></select></label><fieldset><legend>Modalidade</legend><label class="radio"><input type="radio" name="level" value="integrado" ${progress.level!=='subsequente'?'checked':''}> Técnico integrado ao Ensino Médio</label><label class="radio"><input type="radio" name="level" value="subsequente" ${progress.level==='subsequente'?'checked':''}> Técnico subsequente</label></fieldset><button class="btn primary" type="submit">Montar meu plano</button></form></div>`;
  const stateSelect=$('#stateSelect'), institutionSelect=$('#institutionSelect');
  const updateInstitutions=()=>{const s=data.states.find(x=>x[0]===stateSelect.value); const list=data.institutions[stateSelect.value]||[s?s[2]:'Instituto Federal']; institutionSelect.innerHTML=list.map(x=>`<option ${x===progress.institution?'selected':''}>${x}</option>`).join('');};
  stateSelect.onchange=updateInstitutions; updateInstitutions();
  $('#setupForm').onsubmit=e=>{e.preventDefault(); progress.state=stateSelect.value; progress.institution=institutionSelect.value; progress.level=e.target.level.value; save(); toast('Plano regional configurado.'); home();};
}

function study(){
  if(!progress.state)return setup();
  const subjects=[...new Set(questionPool().map(q=>q.subject))];
  app.innerHTML=`<div class="shell"><div class="section-title"><div><span class="eyebrow">Banco regional</span><h1>Escolha uma área</h1><p>As questões regionais aparecem junto à base nacional.</p></div></div><section class="subject-grid">${subjects.map((s,i)=>`<button class="subject" data-route="quiz" data-arg="${s}"><span>0${i+1}</span><h2>${s}</h2><p>${questionPool().filter(q=>q.subject===s).length} questões disponíveis</p></button>`).join('')}</section></div>`;
}

function quiz(subject){
  if(!progress.state)return setup();
  let pool=questionPool().filter(q=>!subject||q.subject===subject); pool=pool.sort(()=>Math.random()-.5).slice(0,Math.min(subject?5:10,pool.length));
  app.innerHTML=`<div class="shell narrow"><div class="section-title"><div><span class="eyebrow">${subject||'Simulado regional'}</span><h1>${pool.length} questões para avançar</h1><p>Responda tudo e receba a explicação de cada item.</p></div></div><form id="quizForm">${pool.map((q,n)=>`<article class="question"><div class="question-meta"><span>${q.subject}</span><span>${q.region==='BR'?'Base nacional':q.region}</span></div><h2>${n+1}. ${q.text}</h2><div class="options">${q.options.map((o,i)=>`<label><input type="radio" name="q${n}" value="${i}"><span>${String.fromCharCode(65+i)}</span>${o}</label>`).join('')}</div></article>`).join('')}<button class="btn primary submit" type="submit">Finalizar simulado</button></form></div>`;
  $('#quizForm').onsubmit=e=>{e.preventDefault(); const answers=pool.map((q,n)=>e.target.elements['q'+n]?.value); if(answers.some(x=>x===undefined||x===''))return toast('Responda todas as questões.'); let hits=0; pool.forEach((q,n)=>{const ok=Number(answers[n])===q.answer; if(ok)hits++; progress.answered++; progress.correct+=ok?1:0; progress.bySubject[q.subject]=progress.bySubject[q.subject]||{answered:0,correct:0}; progress.bySubject[q.subject].answered++; progress.bySubject[q.subject].correct+=ok?1:0; if(!ok)progress.errors.unshift({text:q.text,answer:q.options[q.answer],explanation:q.explanation});}); progress.errors=progress.errors.slice(0,20); save(); result(pool,answers,hits);};
}

function result(pool,answers,hits){
  app.innerHTML=`<div class="shell narrow"><section class="result-head"><span class="eyebrow">Resultado</span><strong>${hits}/${pool.length}</strong><h1>${hits/pool.length>=.7?'Ótimo ritmo. Continue assim.':'Seu próximo estudo já está claro.'}</h1></section><div class="review">${pool.map((q,n)=>{const ok=Number(answers[n])===q.answer;return `<article class="review-item ${ok?'ok':'bad'}"><span>${ok?'Acertou':'Revise'}</span><h3>${q.text}</h3><p><b>Resposta:</b> ${q.options[q.answer]}</p><p>${q.explanation}</p>${q.source?`<small>${q.source}</small>`:''}</article>`}).join('')}</div><div class="actions"><button class="btn primary" data-route="quiz">Novo simulado</button><button class="btn light" data-route="progress">Ver progresso</button></div></div>`;
}

function exams(){
  if(!progress.state)return setup(); const info=stateInfo(); const sources=data.sources[progress.state]||[];
  app.innerHTML=`<div class="shell"><div class="section-title"><div><span class="eyebrow">Acervo oficial · ${info[1]}</span><h1>Provas e gabaritos da sua região</h1><p>Os links levam aos portais das próprias instituições. Confirme sempre o edital do processo seletivo atual.</p></div></div>${sources.length?`<section class="exam-list">${sources.map(s=>`<a class="exam" href="${s.url}" target="_blank" rel="noopener"><div><span>${s.institution}</span><h2>${s.title}</h2><p>${s.detail}</p></div><strong>Ver acervo ↗</strong></a>`).join('')}</section>`:`<section class="empty"><span class="eyebrow">Curadoria em expansão</span><h2>O acervo específico de ${info[1]} será adicionado em breve.</h2><p>Enquanto isso, você já pode praticar com a base nacional e as questões da sua região. A plataforma não exibe links não verificados.</p><button class="btn primary" data-route="study">Estudar agora</button></section>`}</div>`;
}

function progressPage(){
  if(!progress.state)return setup(); const rate=progress.answered?Math.round(progress.correct/progress.answered*100):0; const rows=Object.entries(progress.bySubject);
  app.innerHTML=`<div class="shell"><div class="section-title"><div><span class="eyebrow">Desempenho local</span><h1>Seu progresso</h1><p>Os dados ficam neste dispositivo e podem ser apagados a qualquer momento.</p></div></div><section class="metrics large"><div><strong>${progress.answered}</strong><span>respondidas</span></div><div><strong>${progress.correct}</strong><span>acertos</span></div><div><strong>${rate}%</strong><span>aproveitamento</span></div></section><section class="progress-layout"><article class="panel"><h2>Por área</h2>${rows.length?rows.map(([s,v])=>{const p=Math.round(v.correct/v.answered*100);return `<div class="subject-progress"><div><b>${s}</b><span>${p}%</span></div><i><em style="width:${p}%"></em></i></div>`}).join(''):'<p class="muted">Faça seu primeiro simulado para ver a análise por área.</p>'}</article><article class="panel"><h2>Erros recentes</h2>${progress.errors.length?progress.errors.slice(0,4).map(e=>`<details><summary>${e.text}</summary><p><b>Resposta:</b> ${e.answer}<br>${e.explanation}</p></details>`).join(''):'<p class="muted">Nenhum erro registrado ainda.</p>'}</article></section></div>`;
}
home();
