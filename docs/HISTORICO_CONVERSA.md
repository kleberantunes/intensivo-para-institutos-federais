# Histórico Completo da Conversa e Evolução do Projeto — IFintenso

Este documento registra a transcrição estruturada, o contexto, as solicitações do usuário e todas as implementações técnicas realizadas ao longo das sessões de desenvolvimento do projeto **IFintenso** (`intensivo-para-institutos-federais`).

---

## 📋 Sumário Executivo

- **Produto:** IFintenso (Plataforma Web para preparação aos Exames de Cursos Técnicos Integrados dos Institutos Federais).
- **Hospedagem:** Firebase Hosting ([https://ifintenso.web.app](https://ifintenso.web.app)).
- **Repositório:** `kleberantunes/intensivo-para-institutos-federais`.
- **Branch Ativa:** `feat/banco-300-questoes`.

---

## 💬 Trilha Cronológica de Demandas e Implementações

### Interação 1: Análise do Contexto Prévio e Retomada
- **Solicitação do Usuário:**
  > *"https://chatgpt.com/share/6ab6b810-87e8-83e9-9c91-306c2aa771cc INST FED vamos continuar?"*
- **Ações Realizadas:**
  - Extração do contexto da sessão anterior e inspeção da base de código do MVP inicial.
  - Mapeamento das funcionalidades existentes: autenticação Firebase, Firestore híbrido local-first, banco inicial com 12 questões, 27 UFs e painel de administração (`admin.html`).

---

### Interação 2: Remoção da Seleção Prévia de UF/Unidade e Foco no Login Google
- **Solicitação do Usuário:**
  > *"primeiro preciso tirar a selecao de estado e unidade do if, criar uma pagina inicial visando o login do google"*
- **Ações Realizadas:**
  - Eliminado o modal/passo obrigatório que impunha a escolha de Estado e Campus antes de permitir a visualização ou estudo.
  - Redesenhada a página de entrada (`index.html` e `app.js`), conferindo destaque prioritário ao card de login com a conta Google.
  - Acesso direto ao acervo nacional unificado após autenticação.

---

### Interação 3: Barreira Estrita de Autenticação
- **Solicitação do Usuário:**
  > *"se nao logar nao entra"*
- **Ações Realizadas:**
  - Implementação de guardas de rota no front-end (`app.js`): qualquer tentativa de navegação desautenticada para rotas de estudo, simulados, histórico ou desempenho é imediatamente interceptada e redirecionada para a tela de login.
  - Isolamento estrito de sessão: progresso e caderno de erros vinculados à conta autenticada; o logout zera o estado em memória e fecha imediatamente a navegação.
  - Criação de testes unitários em `tests/validate-content.mjs` validando que usuários anônimos não conseguem acessar as áreas internas.

---

### Interação 4: Expansão do Banco de Questões com Provas Reais
- **Solicitação do Usuário:**
  > *"preciso amplicar o banco de questoes usando tudo que podemos de todas as provas que reunimos"*
- **Ações Realizadas:**
  - Download e extração de cadernos e gabaritos oficiais:
    - IFRS (Processo Seletivo 2026/1 Integrado).
    - IFSC (Exame de Classificação).
    - IFMS (Exame de Seleção 2026 Integrado).
    - IFBA (Processo Seletivo 2025 Integrado).
    - IFMG (Processo Seletivo 2026.1 Integrado).
    - IFAL (Exame de Seleção 2026.1 Integrado).
    - Amostras de IFSP, IFG, IFRN e IFPE.
  - Ampliação do banco de 12 para **75 questões completas** com opções (A–D/E), gabarito conferido, área de conhecimento e justificativa detalhada.

---

### Interação 5: Modo Escuro com Identidade Visual do IF
- **Solicitação do Usuário:**
  > *"adicionar modo escuro como fizemos no app do sesi-rs mantendo a mesma idantidade visual porem com as cores do IF pode botar no ar"*
- **Ações Realizadas:**
  - Criação do seletor e persistência de tema (`data-theme="dark"`).
  - Configuração da paleta de cores institucional dos Institutos Federais: verde lima (`#c4ec44`), verde escuro e vermelho institucional.
  - Inserção do botão de alternância no header e script anti-flicker no `<head>`.

---

### Interação 6: Eliminação Total de Emojis, Bordas Afiadas e Dark Mode Preto Puro
- **Solicitação do Usuário:**
  > *"pode tirar todos os emojis e deixar sem borda arredondado e no modo escuro preto"*
- **Ações Realizadas:**
  - **Zero Emojis:** Varredura completa em `index.html`, `admin.html`, `app.js` e `styles.css`. Todos os emojis foram removidos e substituídos por código SVG vetorial puro.
  - **Ícones Vetoriais SVG Inline:**
    - Sol e Lua para o alternador de modo claro/escuro.
    - Barras paralelas para o menu hamburger responsivo.
    - Lupa minimalista para barra de pesquisa e filtros.
    - Cadeado de segurança para a barreira de autenticação do Google.
  - **Bordas Sem Arredondamento:** Aplicada a diretriz global `border-radius: 0 !important;` em todos os elementos da interface (botões, cartões, inputs, modais e badges).
  - **Modo Escuro Preto Puro (`#000000`):**
    - Background geral: `#000000`.
    - Superfícies/Cards: `#0d0d0d` e `#0a0a0a`.
    - Bordas: `#262626`.
    - Realces: verde lima `#c4ec44` e `#b8d93f`.
  - **Validação Automatizada:** Atualização do script `tests/validate-content.mjs` com regex de caracteres pictográficos (`/[\p{Extended_Pictographic}]/u`) e checagem de variáveis CSS.
  - **Deploy:** Publicação em produção no Firebase Hosting ([https://ifintenso.web.app](https://ifintenso.web.app)).

---

### Interação 7: Requisito de Expansão para no Mínimo 300 Questões
- **Solicitação do Usuário:**
  > *"diz que tem 75 questoes preciso de no minimo 300"*
- **Ações Realizadas:**
  - Abertura da branch `feat/banco-300-questoes`.
  - Análise dos cadernos de provas existentes na pasta `downloaded_exams` (IFMG: 48 questões, IFBA: 36 questões, IFRS: 40 questões, IFMS: 30 questões, IFAL: 40 questões, IFSC: acervo completo).
  - Estruturação do script de lote `batch_add_questions.py` para processar e normalizar enunciados, opções A–E e gabaritos oficiais.

---

### Interação 8: Criação de Log e Diretriz Permanente de Change Log
- **Solicitação do Usuário:**
  > *"crie um log com tudo que foi feito e sempre que tiver alteracar crie um change log em todas as conversas"*
- **Ações Realizadas:**
  - Atualização completa do arquivo [`CHANGELOG.md`](../CHANGELOG.md) seguindo Keep a Changelog e Semantic Versioning (versões 0.1.0 até 0.9.0-dev).
  - Fixação da regra mandatória de apresentar a seção de **Change Log** em todas as respostas sempre que houver modificações.
  - Criação do artefato de histórico e commit/push das alterações na branch de desenvolvimento.

---

### Interação 9: Geração do Arquivo Markdown da Conversa
- **Solicitação do Usuário:**
  > *"crie um md da conversa"*
- **Ações Realizadas:**
  - Compilação estruturada deste documento (`docs/HISTORICO_CONVERSA.md`) com todos os requisitos, comandos, decisões e status da aplicação.
  - Registro correspondente no `CHANGELOG.md`.

---

## 🛠️ Matriz de Decisões Técnicas e Arquitetura

| Pilar | Decisão Técnica Adotada | Motivação |
| :--- | :--- | :--- |
| **Estilo Visual** | Bordas retas (`border-radius: 0 !important`) | Estética moderna, limpa, técnica e consistente com o padrão solicitado. |
| **Paleta Escura** | Fundo `#000000` + cartões `#0d0d0d` + lima `#c4ec44` | Modo escuro de alto contraste (pure black), ideal para telas OLED e estudo noturno. |
| **Iconografia** | SVGs vetoriais inline sem emojis | Padronização profissional e renderização impecável independente do sistema operacional. |
| **Autenticação** | Firebase Auth (Google Sign-In) com bloqueio de rota | Garantir identificação de cada aluno, sincronização em nuvem e segurança de dados. |
| **Persistência** | Local-First com sincronização Cloud Firestore | Funcionamento instantâneo offline com backup seguro na nuvem quando conectado. |
| **Garantia de Qualidade**| `tests/validate-content.mjs` via Node VM | Verificação automatizada de ausência de emojis, paleta, regras de login e integridade das UFs. |

---

## 🚀 Próxima Meta

- Concluir a ingestão das questões oficiais restantes para atingir e superar **300 questões** no banco nacional (`dist/data.js`).
- Executar os testes automatizados, merge da branch `feat/banco-300-questoes` e deploy no Firebase Hosting.

---

*Documento gerado automaticamente pela equipe de engenharia AK Labs / IFintenso.*
