import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../dist/data.js', import.meta.url), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const data = sandbox.window.IF_DATA;
const errors = [];

if (data.states.length !== 27) errors.push(`Esperadas 27 UFs; recebidas ${data.states.length}.`);
for (const q of data.questions) {
  if (!q.text || !Array.isArray(q.options) || q.options.length !== 4) errors.push(`Questão inválida: ${q.text || '(sem texto)'}`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) errors.push(`Gabarito inválido: ${q.text}`);
  if (!q.explanation) errors.push(`Explicação ausente: ${q.text}`);
  if (q.region !== 'BR' && !data.states.some(s => s[0] === q.region)) errors.push(`UF inválida: ${q.region}`);
}
const fakeElement = () => ({ innerHTML:'', classList:{toggle(){},remove(){},add(){}}, focus(){}, value:'', onclick:null });
const elements = new Map();
const appContext = vm.createContext({
  window:{IF_DATA:data},
  document:{querySelector(selector){if(!elements.has(selector)) elements.set(selector,fakeElement()); return elements.get(selector);},addEventListener(){}},
  localStorage:{getItem(){return null;},setItem(){}},
  console,
  setTimeout
});
vm.runInContext(fs.readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8'), appContext);
for (const state of data.states) {
  vm.runInContext(`progress.state = '${state[0]}'`, appContext);
  if (vm.runInContext('questionPool().length', appContext) !== data.questions.length) errors.push(`Banco incompleto em ${state[0]}.`);
}
vm.runInContext("progress.state = 'RS'", appContext);
if (!vm.runInContext("quizQuestions('Ciências Humanas').some(q => q.region === 'SC')", appContext)) errors.push('O simulado de RS não inclui questões de outras UFs.');
for (const [uf, sources] of Object.entries(data.sources)) {
  for (const source of sources) if (!source.url.startsWith('https://')) errors.push(`Fonte sem HTTPS em ${uf}.`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Conteúdo válido: ${data.states.length} UFs, ${data.questions.length} questões e ${Object.values(data.sources).flat().length} fontes oficiais.`);
