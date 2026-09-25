# Changelog — IFintenso

Todas as mudanças relevantes deste projeto estão documentadas neste arquivo.
O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e este projeto adota o [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## 📌 Diretriz de Registro Contínuo (Changelog Policy)

> **Regra Obrigatória do Projeto:**
> Sempre que houver qualquer modificação no código-fonte, arquitetura, design, testes ou dados:
> 1. Atualizar este arquivo (`CHANGELOG.md`) com a versão, data e detalhamento das alterações.
> 2. Exibir o bloco de **Change Log** detalhado na resposta ao usuário em todas as conversas.

---

## [0.9.0-dev] - 2026-09-25

### Adicionado
- **Expansão do Banco Nacional para ≥ 300 questões (em andamento):**
  - Integração de novas questões oficiais extraídas de provas e gabaritos definitivos (IFMG, IFBA, IFRS, IFMS, IFAL, IFSC).
  - Elevação inicial do banco de 75 para 105 questões válidas com resolução comentada.
  - Pipeline de automação para extração em lote dos cadernos oficiais para atingir a meta mínima de 300 questões.
- **Política Ativa de Change Log Contínuo:**
  - Instituição da obrigatoriedade de versionamento e registro de changelog para todas as conversas e alterações do projeto.

---

## [0.8.0] - 2026-09-25

### Modificado
- **Identidade Visual Sem Emojis (100% SVG Vetorial):**
  - Remoção de todos os emojis dos arquivos de distribuição (`index.html`, `admin.html`, `app.js`, `styles.css`).
  - Substituição por ícones vetoriais SVG inline:
    - Alternância de tema com ícones de Sol e Lua SVG.
    - Menu lateral com ícone de barras (hamburger) SVG.
    - Campo de busca com ícone de lupa SVG.
    - Barreira de autenticação com cadeado de segurança SVG.
- **Design Retangular Sharp (Bordas Retas):**
  - Aplicação estrita de `border-radius: 0 !important` em todos os elementos da interface (botões, cartões, inputs, modais, badges e menus).
- **Modo Escuro Preto Puro (`#000000`):**
  - Fundo em preto absoluto (`--paper: #000000`).
  - Superfícies e cartões em tons ultra-escuros (`#0d0d0d` e `#0a0a0a`).
  - Linhas divisórias e bordas sutis (`#262626`).
  - Destaques em verde lima oficial do IF (`--lime: #c4ec44` e `--lime-hover: #b8d93f`).
  - Script anti-flicker com persistência em `localStorage` sob a chave `aklabs-theme`.
- **Testes e Deploy:**
  - Validação automatizada em `tests/validate-content.mjs` cobrindo ausência de emojis, paleta escura, bordas retas e autenticação.
  - Publicação e validação no ar em `https://ifintenso.web.app`.

---

## [0.7.0] - 2026-09-25

### Adicionado
- **Banco Nacional Ampliado (75 questões):**
  - Expansão do acervo de 12 para 75 questões oficiais com gabaritos conferidos, cobrindo IFRS, IFSC, IFSP, IFG, IFRN, IFPE, IFMS, IFBA, IFMG e IFAL.
  - Distribuição equilibrada entre Matemática, Língua Portuguesa, Ciências da Natureza e Ciências Humanas.
- **Barreira Estrita de Login ("Se não logar não entra"):**
  - O aplicativo não permite acesso a rotas de estudo, simulados ou desempenho sem autenticação Google prévia.
  - Proteção de rotas no front-end (`app.js`) redirecionando imediatamente para a tela de login caso o usuário tente navegar sem sessão ativa.
  - Isolamento de dados por conta: cada usuário autenticado mantém seu progresso isolado, com reset no logout.
- **Remoção da Seleção Obrigatória de UF/Unidade:**
  - A tela inicial não exige mais a escolha de estado ou campus para iniciar os estudos, disponibilizando o banco nacional diretamente.

---

## [0.4.3] - 2026-09-25

### Corrigido
- Correção no fluxo de redirecionamento pós-login chamando explicitamente `route('home')`.
- Atualização do cache-busting para `v0.4.1` nos links de scripts e estilos.
- Configuração de cabeçalhos HTTP `no-cache, no-store, must-revalidate` em `firebase.json` para evitar carregamento de versões obsoletas nos navegadores.

---

## [0.4.2] - 2026-09-25

### Corrigido
- Restauração da função utilitária `toast()` ausente no bundle do app.
- Correção da navegação interativa na montagem de planos de estudo personalizados.

---

## [0.4.1] - 2026-09-24

### Alterado
- Configuração do projeto oficial no Firebase Hosting: `ifintenso` (`ifintenso.web.app`) sob o projeto `intensivo-if-2026`.
- Atualização dos arquivos `.firebaserc` e `firebase.json`.

---

## [0.4.0] - 2026-09-24

### Adicionado
- **Renomeação do Produto:** Marca unificada para **IFintenso**.
- **Autenticação com Google (Firebase Auth):** Login com 1 clique para estudantes e professores.
- **Sincronização em Nuvem (Cloud Firestore):** Salvamento automático de simulados, histórico de erros, métricas de acertos e preferências.
- **Arquitetura Local-First Híbrida:** Funcionamento contínuo em modo offline via `localStorage` com fusão inteligente ao conectar à internet.
- **Painel Administrativo (`admin.html`):** Dashboard com KPIs da turma, acompanhamento regional, bloqueio e liberação de estudantes.
- **Regras de Segurança (`firestore.rules`):** Isolamento de progresso por UID e controle administrativo restrito a `ADMIN_EMAILS`.

---

## [0.1.0] - 2026-09-24

### Adicionado
- Estrutura inicial do projeto Intensivo IF com suporte às 27 Unidades Federativas.
- Banco inicial com questões nacionais e contextualizações regionais para RS e SC.
- Módulos de simulado por área, caderno de erros local e análise de pontuação.
- Acervos oficiais verificados de provas e gabaritos do IFRS e IFSC.
- Layout responsivo para desktop e dispositivos móveis.

---

*Desenvolvido por AK Labs*
