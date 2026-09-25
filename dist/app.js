const $ = (s) => document.querySelector(s);
const app = $('#app');
const STORAGE_KEY = 'aklabs-intensivo-if-v1';
const initial = {answered:0,correct:0,errors:[],bySubject:{}};
function emptyProgress(){return {...initial,errors:[],bySubject:{}};}
const progress = Object.assign(emptyProgress(), JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
let activeUserId = null;
let examFilterState = '';
const data = window.IF_DATA;

function isAuthenticated(){
  return !!activeUserId || (window.cloudSync && typeof window.cloudSync.isReady === 'function' && window.cloudSync.isReady());
}
window.isIFAuthenticated = isAuthenticated;

function updateNavVisibility(){
  const authed = isAuthenticated();
  const nav = $('#nav');
  const menuBtn = $('#menuBtn');
  if(nav) nav.classList.toggle('hidden', !authed);
  if(menuBtn) menuBtn.classList.toggle('hidden', !authed);
}

function save(){
  if(!activeUserId) return;
  localStorage.setItem(`${STORAGE_KEY}:user:${activeUserId}`, JSON.stringify(progress));
  if(window.cloudSync && typeof window.cloudSync.scheduleSave === 'function'){
    window.cloudSync.scheduleSave(progress);
  }
}
function toast(message){
  const el=$('#toast');
  if(!el) return;
  el.textContent=message;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),2200);
}
window.toast = toast;
window.getProgressState = () => progress;

window.useIFAccount = (uid) => {
  if(activeUserId === uid) return;
  if(activeUserId) save();
  const accountData = localStorage.getItem(`${STORAGE_KEY}:user:${uid}`);
  for(const key of Object.keys(progress)) delete progress[key];
  Object.assign(progress, emptyProgress(), JSON.parse(accountData || '{}'));
  activeUserId = uid;
  updateNavVisibility();
};

window.applyCloudProgress = (cloudProgress) => {
  for(const key of Object.keys(progress)) delete progress[key];
  Object.assign(progress, emptyProgress(), cloudProgress);
  save();
  if(typeof window.refreshRoute === 'function'){
    window.refreshRoute();
  }
};

// Um único banco nacional: sem restrição de UF ou instituição
function questionPool(){ return data.questions; }
function shuffle(items){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [result[i],result[j]]=[result[j],result[i]];}
  return result;
}
function quizQuestions(subject){
  const available=questionPool().filter(q=>!subject||q.subject===subject);
  return shuffle(available).slice(0,Math.min(subject?5:10,available.length));
}

let currentRouteName = 'login', currentRouteArg = null;
function route(name, arg){
  if(!isAuthenticated() && name !== 'login'){
    toast('Acesso restrito. Faça login com o Google para continuar.');
    name = 'login';
  }
  currentRouteName = name || (isAuthenticated() ? 'home' : 'login');
  currentRouteArg = arg;
  updateNavVisibility();
  const pages = {home, login, study, exams, progress:progressPage, quiz};
  (pages[currentRouteName] || login)(arg);
  app.focus();
  if($('#nav')) $('#nav').classList.remove('open');
}
window.refreshRoute = () => route(currentRouteName, currentRouteArg);

document.addEventListener('click', e => {
  const b = e.target.closest('[data-route]');
  if(!b) return;
  if(!isAuthenticated() && b.dataset.route !== 'login'){
    toast('Acesso restrito. Faça login com o Google para continuar.');
    route('login');
    return;
  }
  route(b.dataset.route, b.dataset.arg);
});

if($('#menuBtn')) $('#menuBtn').onclick = () => $('#nav').classList.toggle('open');

function initTheme(){
  const btn = typeof document !== 'undefined' ? (document.getElementById ? document.getElementById('themeToggleBtn') : (document.querySelector ? document.querySelector('#themeToggleBtn') : null)) : null;
  const docEl = typeof document !== 'undefined' ? document.documentElement : null;
  const getTheme = () => (docEl && typeof docEl.getAttribute === 'function' && docEl.getAttribute('data-theme') === 'dark') ? 'dark' : 'light';
  const applyTheme = (theme) => {
    if(docEl){
      if(theme === 'dark'){
        if(typeof docEl.setAttribute === 'function') docEl.setAttribute('data-theme', 'dark');
      } else {
        if(typeof docEl.removeAttribute === 'function') docEl.removeAttribute('data-theme');
      }
    }
    if(btn){
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      if(typeof btn.setAttribute === 'function'){
        btn.setAttribute('title', theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
        btn.setAttribute('aria-label', theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
      }
    }
    const meta = typeof document !== 'undefined' && typeof document.querySelector === 'function' ? document.querySelector('meta[name="theme-color"]') : null;
    if(meta && typeof meta.setAttribute === 'function'){
      meta.setAttribute('content', theme === 'dark' ? '#091715' : '#063b35');
    }
  };

  applyTheme(getTheme());

  if(btn){
    btn.onclick = () => {
      const next = getTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('aklabs-theme', next);
      } catch(e) {}
    };
  }
}
initTheme();

window.onIFLogin = () => {
  updateNavVisibility();
  route('home');
};

window.onIFLogout = () => {
  if(activeUserId) save();
  activeUserId = null;
  for(const key of Object.keys(progress)) delete progress[key];
  Object.assign(progress, emptyProgress());
  updateNavVisibility();
  route('login');
};

function login(){
  if(isAuthenticated()){
    app.innerHTML=`<div class="shell narrow">
      <section class="login-card">
        <span class="eyebrow">Acesso Liberado · Google Conectado</span>
        <h1>Bem-vindo de volta!</h1>
        <p>Você já está conectado com o Google. Seus resultados, simulados e progresso estão sendo salvos com segurança na nuvem.</p>
        <div class="actions">
          <button class="btn primary" data-route="home">Entrar na plataforma</button>
          <button class="btn light" data-route="progress">Ver meu progresso</button>
        </div>
      </section>
    </div>`;
    return;
  }

  app.innerHTML=`<div class="shell">
    <div class="login-hero">
      <div class="login-hero-content">
        <span class="eyebrow-badge">Plataforma Nacional · Institutos Federais</span>
        <h1>Sua aprovação no Instituto Federal começa aqui.</h1>
        <p class="login-hero-sub">Estude com questões oficiais de processos seletivos de todo o Brasil, resolva simulados com gabaritos comentados e acompanhe sua evolução em tempo real.</p>
        <div class="login-cta-box">
          <button class="btn-google-hero" id="loginHeroBtn" type="button">
            <svg class="google-icon-hero" viewBox="0 0 24 24" width="22" height="22">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Entrar com o Google para Acessar</span>
          </button>
          <div class="login-secure-notice">
            <span>🔒 Acesso exclusivo com conta Google. Seus resultados e simulados ficam salvos com segurança.</span>
          </div>
        </div>
      </div>

      <div class="login-hero-card">
        <div class="hero-metric-pill">✨ 100% Gratuito</div>
        <h3>O que você encontra no IFintenso:</h3>
        <ul class="login-feature-list">
          <li>
            <strong>🎯 Banco Nacional de Questões</strong>
            <span>Questões reais de provas oficiais do IFSC, IFSP, IFG, IFRN, IFPE e outros, com resolução e gabarito comentado.</span>
          </li>
          <li>
            <strong>⚡ Simulados Inteligentes</strong>
            <span>Treine no formato real dos exames de seleção e descubra onde você precisa reforçar seus estudos.</span>
          </li>
          <li>
            <strong>☁️ Sincronização em Nuvem</strong>
            <span>Inicie no computador e continue no celular. Seu desempenho fica salvo na sua conta Google.</span>
          </li>
          <li>
            <strong>📚 Caderno de Erros Automático</strong>
            <span>Revise facilmente as questões que você errou para não repetir os mesmos equívocos na prova real.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>`;

  const heroBtn = $('#loginHeroBtn');
  if(heroBtn){
    heroBtn.onclick = () => {
      const topBtn = $('#loginBtn');
      if(topBtn) topBtn.click();
      else toast('Preparando conexão com o Google...');
    };
  }
}

function home(){
  const rate=progress.answered?Math.round(progress.correct/progress.answered*100):0;
  app.innerHTML=`<div class="shell">
    <section class="welcome">
      <div><span class="eyebrow">Sua preparação nacional</span><h1>Estude com questões de todo o Brasil.</h1><p>Questões oficiais organizadas por matéria, acervo de provas e simulados no formato dos Institutos Federais.</p><div class="actions"><button class="btn primary" data-route="quiz">Começar simulado</button><button class="btn light" data-route="exams">Ver provas anteriores</button></div></div>
      <aside class="profile-card"><span class="profile-label">Meu progresso</span><strong>${progress.answered} questões respondidas</strong><span>${window.cloudSync?.isReady()?'Sincronização com Google ativada':'Salvo na sua conta'}</span><button data-route="progress">Ver desempenho</button></aside>
    </section>
    <section class="metrics" aria-label="Resumo do progresso"><div><strong>${progress.answered}</strong><span>questões respondidas</span></div><div><strong>${rate}%</strong><span>taxa de acerto</span></div><div><strong>${questionPool().length}</strong><span>questões disponíveis</span></div></section>
    <div class="section-title"><div><span class="eyebrow">Seu caminho</span><h2>O que fazer agora</h2></div></div>
    <section class="cards"><button class="feature" data-route="study"><span class="feature-number">01</span><h3>Estudar por matéria</h3><p>Escolha a área e pratique com questões oficiais de todo o Brasil.</p></button><button class="feature featured" data-route="quiz"><span class="feature-number">02</span><h3>Simulado nacional</h3><p>Uma rodada completa no padrão dos Institutos Federais.</p></button><button class="feature" data-route="exams"><span class="feature-number">03</span><h3>Provas reais</h3><p>Consulte cadernos e gabaritos oficiais por estado.</p></button></section>
  </div>`;
}

function study(){
  const subjects=[...new Set(questionPool().map(q=>q.subject))];
  app.innerHTML=`<div class="shell"><div class="section-title"><div><span class="eyebrow">Banco nacional</span><h1>Escolha uma área</h1><p>Pratique com questões de todos os estados, com indicação da origem.</p></div></div><section class="subject-grid">${subjects.map((s,i)=>`<button class="subject" data-route="quiz" data-arg="${s}"><span>0${i+1}</span><h2>${s}</h2><p>${questionPool().filter(q=>q.subject===s).length} questões disponíveis</p></button>`).join('')}</section></div>`;
}

function quiz(subject){
  const pool=quizQuestions(subject);
  app.innerHTML=`<div class="shell narrow"><div class="section-title"><div><span class="eyebrow">${subject||'Simulado nacional'}</span><h1>${pool.length} questões para avançar</h1><p>Responda tudo e receba a explicação de cada item.</p></div></div><form id="quizForm">${pool.map((q,n)=>`<article class="question"><div class="question-meta"><span>${q.subject}</span><span>${q.region==='BR'?'Questão geral':q.region}</span></div><h2>${n+1}. ${q.text}</h2><div class="options">${q.options.map((o,i)=>`<label><input type="radio" name="q${n}" value="${i}"><span>${String.fromCharCode(65+i)}</span>${o}</label>`).join('')}</div></article>`).join('')}<button class="btn primary submit" type="submit">Finalizar simulado</button></form></div>`;
  $('#quizForm').onsubmit=e=>{e.preventDefault(); const answers=pool.map((q,n)=>e.target.elements['q'+n]?.value); if(answers.some(x=>x===undefined||x===''))return toast('Responda todas as questões.'); let hits=0; pool.forEach((q,n)=>{const ok=Number(answers[n])===q.answer; if(ok)hits++; progress.answered++; progress.correct+=ok?1:0; progress.bySubject[q.subject]=progress.bySubject[q.subject]||{answered:0,correct:0}; progress.bySubject[q.subject].answered++; progress.bySubject[q.subject].correct+=ok?1:0; if(!ok)progress.errors.unshift({text:q.text,answer:q.options[q.answer],explanation:q.explanation});}); progress.errors=progress.errors.slice(0,20); save(); result(pool,answers,hits);};
}

function result(pool,answers,hits){
  app.innerHTML=`<div class="shell narrow"><section class="result-head"><span class="eyebrow">Resultado</span><strong>${hits}/${pool.length}</strong><h1>${hits/pool.length>=.7?'Ótimo ritmo. Continue assim.':'Seu próximo estudo já está claro.'}</h1></section><div class="review">${pool.map((q,n)=>{const ok=Number(answers[n])===q.answer;return `<article class="review-item ${ok?'ok':'bad'}"><span>${ok?'Acertou':'Revise'}</span><h3>${q.text}</h3><p><b>Resposta:</b> ${q.options[q.answer]}</p><p>${q.explanation}</p>${q.source?`<small>${q.source}</small>`:''}</article>`}).join('')}</div><div class="actions"><button class="btn primary" data-route="quiz">Novo simulado</button><button class="btn light" data-route="progress">Ver progresso</button></div></div>`;
}

function exams(){
  const available=Object.entries(data.sources).flatMap(([uf,sources])=>sources.filter(s=>s.institution!=='MEC').map(s=>({...s,uf})));
  const filtered=examFilterState?available.filter(s=>s.uf===examFilterState):available;
  const options=data.states.map(s=>`<option value="${s[0]}" ${s[0]===examFilterState?'selected':''}>${s[1]} (${s[0]})</option>`).join('');
  app.innerHTML=`<div class="shell"><div class="section-title"><div><span class="eyebrow">Acervo oficial</span><h1>Provas e gabaritos</h1><p>Consulte cadernos e gabaritos oficiais das instituições. Você pode filtrar por estado a qualquer momento.</p></div></div><label class="exam-filter">Filtrar por Estado <select id="examState"><option value="">Todos os estados (${available.length} links)</option>${options}</select></label>${filtered.length?`<section class="exam-list">${filtered.map(s=>`<a class="exam" href="${s.url}" target="_blank" rel="noopener"><div><span>${s.institution} · ${s.uf}</span><h2>${s.title}</h2><p>${s.detail}</p></div><strong>Ver acervo ↗</strong></a>`).join('')}</section>`:`<section class="empty"><h2>Ainda não há links cadastrados para este estado.</h2><p>Continue praticando com o banco nacional enquanto ampliamos o acervo.</p><button class="btn primary" data-route="study">Estudar agora</button></section>`}</div>`;
  $('#examState').onchange=e=>{examFilterState=e.target.value;exams();};
}

function progressPage(){
  const rate=progress.answered?Math.round(progress.correct/progress.answered*100):0; const rows=Object.entries(progress.bySubject);
  app.innerHTML=`<div class="shell"><div class="section-title"><div><span class="eyebrow">Desempenho</span><h1>Seu progresso</h1><p>Seus dados estão sincronizados com sua conta Google.</p></div></div><section class="metrics large"><div><strong>${progress.answered}</strong><span>respondidas</span></div><div><strong>${progress.correct}</strong><span>acertos</span></div><div><strong>${rate}%</strong><span>aproveitamento</span></div></section><section class="progress-layout"><article class="panel"><h2>Por área</h2>${rows.length?rows.map(([s,v])=>{const p=Math.round(v.correct/v.answered*100);return `<div class="subject-progress"><div><b>${s}</b><span>${p}%</span></div><i><em style="width:${p}%"></em></i></div>`}).join(''):'<p class="muted">Faça seu primeiro simulado para ver a análise por área.</p>'}</article><article class="panel"><h2>Erros recentes</h2>${progress.errors.length?progress.errors.slice(0,4).map(e=>`<details><summary>${e.text}</summary><p><b>Resposta:</b> ${e.answer}<br>${e.explanation}</p></details>`).join(''):'<p class="muted">Nenhum erro registrado ainda.</p>'}</article></section></div>`;
}

route('login');
