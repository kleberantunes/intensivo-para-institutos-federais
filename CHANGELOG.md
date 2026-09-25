# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui. O formato segue Keep a Changelog e o versionamento segue Semantic Versioning.

## [0.5.0] - 2026-09-25

### Adicionado
- Registro nacional estruturado das 38 instituições federais, com fontes oficiais, estado da descoberta e cobertura conhecida.
- Política editorial e modelo de dados para ingestão rastreável de provas e questões.
- Validação automatizada da cobertura institucional e dos campos mínimos do registro.

## [0.4.0] - 2026-09-24

### Adicionado
- **Identidade do Produto:** Marca renomeada para **IFintenso**.
- **Autenticação com Google (Firebase Auth):** Login com 1 clique no app dos Institutos Federais.
- **Sincronização em Nuvem (Cloud Firestore):** Salvamento automático de simulados, acertos, histórico de erros e seleção de instituição/UF.
- **Arquitetura Local-First Híbrida:** O aplicativo funciona offline via `localStorage` e realiza fusão inteligente ao conectar à conta Google.
- **Painel de Controle de Acesso e Alunos (`admin.html`):** Dashboard administrativo com KPIs da turma, acompanhamento regional, bloqueio e liberação de estudantes com 1 clique.
- **Segurança de Dados (`firestore.rules`):** Isolamento de progresso por UID e controle administrativo restrito a `ADMIN_EMAILS`.
- **Hospedagem Gratuita:** Configuração pronta para Firebase Hosting e GitHub Pages.

## [0.1.0] - 2026-09-24

### Adicionado
- Seleção das 27 unidades federativas, instituição e modalidade de prova.
- Banco inicial de questões nacionais e questões autorais contextualizadas para RS e SC.
- Simulado regional com correção comentada.
- Estudo por área, análise de desempenho e caderno de erros local.
- Acervos oficiais verificados de provas e gabaritos do IFRS e IFSC.
- Interface responsiva e identidade inicial do produto Intensivo IF.

Developed by AK Labs
