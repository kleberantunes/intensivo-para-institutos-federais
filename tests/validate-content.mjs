import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../dist/data.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const data = sandbox.window.IF_DATA;
const errors = [];
const seen = new Set();

if (data.states.length !== 27) errors.push(`Esperadas 27 UFs; recebidas ${data.states.length}.`);
for (const q of data.questions) {
  if (!q.text || !Array.isArray(q.options) || ![4, 5].includes(q.options.length)) errors.push(`Questão inválida: ${q.text || '(sem texto)'}`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`Gabarito inválido: ${q.text}`);
  if (!q.explanation) errors.push(`Explicação ausente: ${q.text}`);
  if (q.region !== 'BR' && !data.states.some(s => s[0] === q.region)) errors.push(`UF inválida: ${q.region}`);
  if (seen.has(q.text)) errors.push(`Questão repetida: ${q.text}`);
  seen.add(q.text);
}

const fakeElement = () => ({
  innerHTML: '',
  style: { display: '' },
  classList: {
    toggle() {},
    remove() {},
    add() {},
    contains() { return false; }
  },
  focus() {},
  value: '',
  onclick: null
});

const elements = new Map();
const storage = new Map();
const appContext = vm.createContext({
  window: { IF_DATA: data },
  document: {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, fakeElement());
      return elements.get(selector);
    },
    addEventListener() {}
  },
  localStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, value); },
    removeItem(key) { storage.delete(key); }
  },
  sessionStorage: {
    getItem() { return null; },
    setItem() {},
    removeItem() {}
  },
  console,
  setTimeout
});

vm.runInContext(fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8'), appContext);

// Banco de questões nacional sem dependência regional
if (vm.runInContext('questionPool().length', appContext) !== data.questions.length) {
  errors.push('Banco nacional de questões incompleto.');
}

// 1. Sem login: a tela inicial deve apresentar o login com o Google
if (!elements.get('#app').innerHTML.includes('Entrar com o Google')) {
  errors.push('A página inicial com foco no login do Google não foi exibida.');
}

// 2. "Se não logar não entra": tentar navegar sem autenticação deve bloquear e permanecer no login
vm.runInContext("route('home')", appContext);
if (elements.get('#app').innerHTML.includes('Estude com questões de todo o Brasil')) {
  errors.push('Permitiu acesso à página home sem autenticação (regra "se não logar não entra" violada).');
}

vm.runInContext("route('study')", appContext);
if (elements.get('#app').innerHTML.includes('Banco nacional')) {
  errors.push('Permitiu acesso aos estudos sem autenticação.');
}

// 3. Ao autenticar com o Google, o acesso é liberado sem exigir seleção prévia de UF ou unidade do IF
vm.runInContext("window.useIFAccount('estudante-a'); window.onIFLogin();", appContext);
if (!elements.get('#app').innerHTML.includes('Estude com questões de todo o Brasil')) {
  errors.push('A tela inicial não foi liberada após autenticação com Google.');
}
if (elements.get('#app').innerHTML.includes('Onde você fará a prova')) {
  errors.push('Ainda existe formulário de seleção obrigatória de estado ou unidade do IF.');
}

// 4. Estudos abrem normalmente para o usuário logado
vm.runInContext("route('study')", appContext);
if (!elements.get('#app').innerHTML.includes('Banco nacional')) {
  errors.push('O estudo não abriu após autenticação.');
}

const regions = new Set(vm.runInContext('questionPool().map(q => q.region)', appContext));
if (!['SC', 'SP', 'GO', 'RN', 'PE'].every(uf => regions.has(uf))) {
  errors.push('Questões oficiais de SC, SP, GO, RN ou PE ausentes no banco.');
}

// 5. Isolamento de contas e bloqueio no logout
vm.runInContext("progress.answered = 7; save(); window.onIFLogout();", appContext);

// Após logout, o acesso deve ser bloqueado novamente
vm.runInContext("route('home')", appContext);
if (elements.get('#app').innerHTML.includes('Estude com questões de todo o Brasil')) {
  errors.push('Permitiu acesso à home após logout.');
}

// Nova conta entra limpa
vm.runInContext("window.useIFAccount('estudante-b'); window.onIFLogin();", appContext);
if (vm.runInContext('progress.answered', appContext) !== 0) {
  errors.push('O progresso de uma conta vazou para outra.');
}

// Retorno da conta anterior restaura o progresso salvo
vm.runInContext("window.onIFLogout(); window.useIFAccount('estudante-a'); window.onIFLogin();", appContext);
if (vm.runInContext('progress.answered', appContext) !== 7) {
  errors.push('O progresso salvo da conta não foi restaurado.');
}

// 6. Fontes com HTTPS
for (const [uf, sources] of Object.entries(data.sources)) {
  for (const source of sources) {
    if (!source.url.startsWith('https://')) errors.push(`Fonte sem HTTPS em ${uf}.`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validação concluída com sucesso:`);
console.log(`- ${data.states.length} UFs registradas.`);
console.log(`- ${data.questions.length} questões no banco nacional.`);
console.log(`- ${Object.values(data.sources).flat().length} fontes oficiais conferidas.`);
console.log(`- Regra "se não logar não entra" rigorosamente atendida.`);
console.log(`- Seleção obrigatória de estado e unidade do IF removida.`);
