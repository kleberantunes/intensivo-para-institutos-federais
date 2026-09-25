# Intensivo IF

Plataforma de preparação regionalizada para processos seletivos dos Institutos Federais brasileiros.

## Objetivo

Permitir que cada estudante escolha o estado e a instituição onde pretende fazer a prova, estude por área, acompanhe o próprio desempenho e acesse provas e gabaritos oficiais da sua região.

## Problema que resolve

Materiais de processos seletivos dos Institutos Federais ficam dispersos em portais diferentes, com formatos e conteúdos que variam por instituição. O Intensivo IF reúne a jornada de preparação em uma interface única e direciona o estudante ao acervo oficial correto.

## Público-alvo

- Estudantes do 9º ano candidatos a cursos técnicos integrados ao Ensino Médio.
- Candidatos a cursos técnicos subsequentes.
- Famílias, professores e cursinhos que apoiam a preparação.

## Stack utilizada

- HTML5 semântico, CSS3 responsivo e JavaScript ES6+.
- Arquitetura estática local-first, sem dependências de build.
- `localStorage` para preferências, respostas, desempenho e caderno de erros.
- Hospedagem compatível com OpenAI Sites, Firebase Hosting e GitHub Pages.

## Arquitetura do sistema

- `dist/`: aplicação web pronta para publicação.
- `dist/data.js`: cadastro de UFs, instituições, fontes oficiais e questões.
- `dist/app.js`: roteamento, onboarding, simulados e progresso.
- `docs/`: decisões de produto, arquitetura e curadoria.
- `integrations/`: especificações para Firebase, Drive, Sheets e futuras APIs.
- `commercial/`: posicionamento comercial e estratégia de versões.
- `tests/`: verificações automatizadas do conteúdo estático.

O MVP usa conteúdo autoral alinhado às áreas recorrentes e mantém links para acervos oficiais. Questões identificadas como “autorais” não são apresentadas como reprodução de prova oficial.

## Como executar

Abra `dist/index.html` diretamente no navegador ou execute:

```powershell
python -m http.server 8000 --directory dist
```

Depois acesse `http://localhost:8000`.

## Roadmap inicial

- [x] v0.1.0: seleção de UF, modalidade e instituição; estudo por área; simulado regional; progresso local; acervos verificados de RS e SC.
- [ ] v0.2.0: curadoria oficial para as 27 UFs e importador de bancos de questões.
- [ ] v0.3.0: autenticação Google e sincronização opcional.
- [ ] v0.4.0: painel pedagógico para turmas e professores.
- [ ] v1.0.0: catálogo nacional revisado, planos de estudo por edital e operação comercial.

## Status

MVP v0.1.0. Os links oficiais devem ser revisados periodicamente, pois portais institucionais podem mudar.

Developed by AK Labs
