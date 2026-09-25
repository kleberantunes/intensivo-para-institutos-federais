import assert from 'node:assert/strict';
import fs from 'node:fs';

const path = new URL('../integrations/if-exam-source-registry.json', import.meta.url);
const registry = JSON.parse(fs.readFileSync(path, 'utf8'));

assert.equal(registry.institutions.length, 38, 'O cadastro deve cobrir os 38 Institutos Federais.');
assert.equal(new Set(registry.institutions.map(({ id }) => id)).size, 38, 'IDs de instituições devem ser únicos.');

for (const institution of registry.institutions) {
  assert.ok(institution.id && institution.name, 'Instituição sem identificação.');
  assert.ok(Array.isArray(institution.uf) && institution.uf.length > 0, `${institution.id}: UF ausente.`);
  assert.match(institution.officialUrl, /^https:\/\//, `${institution.id}: URL oficial inválida.`);
  if (institution.sourceUrl) assert.match(institution.sourceUrl, /^https:\/\//, `${institution.id}: URL de fonte inválida.`);
  if (institution.archiveStatus === 'confirmed') {
    assert.ok(institution.sourceUrl, `${institution.id}: acervo confirmado sem URL.`);
    assert.ok(institution.coverage, `${institution.id}: acervo confirmado sem descrição de cobertura.`);
  }
}

const confirmed = registry.institutions.filter(({ archiveStatus }) => archiveStatus === 'confirmed').length;
console.log(`Registro válido: 38 IFs, ${confirmed} acervos centrais confirmados.`);
