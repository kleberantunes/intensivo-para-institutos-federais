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
const fakeElement = () => ({ innerHTML:'', classList:{toggle(){},remove(){},add(){}}, focus(){}, value:'', onclick:null });
const elements = new Map();
const storage = new Map();
const appContext = vm.createContext({
  window:{IF_DATA:data},
  document:{querySelector(selector){if(!elements.has(selector)) elements.set(selector,fakeElement()); return elements.get(selector);},addEventListener(){}},
  localStorage:{getItem(key){return storage.get(key) || null;},setItem(key,value){storage.set(key,value);},removeItem(key){storage.delete(key);}},
  sessionStorage:{getItem(){return null;},setItem(){},removeItem(){}},
  console,
  setTimeout
});
vm.runInContext(fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8'), appContext);
for (const state of data.states) {
  vm.runInContext(`progress.state = '${state[0]}'`, appContext);
  if (vm.runInContext('questionPool().length', appContext) !== data.questions.length) errors.push(`Banco incompleto em ${state[0]}.`);
}
if (!elements.get('#app').innerHTML.includes('Entrar com Google')) errors.push('A página inicial de login não foi exibida.');
vm.runInContext("route('home')", appContext);
if (!elements.get('#app').innerHTML.includes('Estude com questões de todo o Brasil')) errors.push('O início ainda exige a seleção da UF.');
vm.runInContext("route('study')", appContext);
if (!elements.get('#app').innerHTML.includes('Banco nacional')) errors.push('O estudo não abriu sem UF.');
const regions = new Set(vm.runInContext('questionPool().map(q => q.region)', appContext));
if (!['SC','SP','GO','RN','PE'].every(uf => regions.has(uf))) errors.push('Questões oficiais de SC, SP, GO, RN ou PE ausentes no banco.');
vm.runInContext("window.useIFAccount('estudante-a'); progress.answered=7; save(); window.onIFLogout(); window.useIFAccount('estudante-b')", appContext);
if (vm.runInContext('progress.answered', appContext) !== 0) errors.push('O progresso de uma conta vazou para outra.');
vm.runInContext("window.onIFLogout(); window.useIFAccount('estudante-a')", appContext);
if (vm.runInContext('progress.answered', appContext) !== 7) errors.push('O progresso salvo da conta não foi restaurado.');
for (const [uf, sources] of Object.entries(data.sources)) {
  for (const source of sources) if (!source.url.startsWith('https://')) errors.push(`Fonte sem HTTPS em ${uf}.`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Conteúdo válido: ${data.states.length} UFs, ${data.questions.length} questões e ${Object.values(data.sources).flat().length} fontes oficiais.`);
