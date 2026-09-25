# IFintenso

Plataforma de preparação regionalizada para processos seletivos dos Institutos Federais brasileiros.

## Objetivo

Permitir que cada estudante estude por área em um banco nacional único, acompanhe o próprio desempenho e consulte provas e gabaritos oficiais por estado. O login com Google sincroniza o progresso; também é possível estudar sem conta, com dados salvos neste navegador.

## Público-alvo

- Estudantes do 9º ano candidatos a cursos técnicos integrados ao Ensino Médio.
- Candidatos a cursos técnicos subsequentes.
- Famílias, professores e cursinhos que apoiam a preparação.

---

## Stack e Arquitetura

- **Frontend:** HTML5 semântico, CSS3 responsivo e JavaScript ES6+ puro, sem dependências de build ou bundlers.
- **Arquitetura Local-First:** O estudo pode começar sem login e grava respostas no `localStorage`; o login Google exige conexão.
- **Autenticação & Nuvem (Firebase):**
  - **Google Sign-In:** Login com 1 clique usando popup OAuth oficial do Google.
  - **Cloud Firestore:** Sincronização contínua do estado, simulados e histórico de erros.
  - **Smart Merge:** O estudante pode começar no computador sem login; ao entrar com o Google, os dados locais são mesclados com a nuvem sem perda.
- **Painel de Controle de Acesso (`admin.html`):** Dashboard exclusivo para administradores com métricas de desempenho e controle de suspensão/liberação de acesso com 1 clique.

---

## Como Executar Localmente

Abra `dist/index.html` diretamente no navegador ou inicie um servidor HTTP local:

```bash
# Com Python:
python -m http.server 8000 --directory dist

# Ou com Node:
npx serve dist
```

Acesse `http://localhost:8000`.

---

## Painel de Controle de Acesso (Administrador)

A plataforma conta com um dashboard administrativo completo localizado em [`dist/admin.html`](file:///C:/Users/Kleber/.gemini/antigravity/scratch/intensivo-para-institutos-federais/dist/admin.html).

### Recursos do Painel:
- **Métricas Globais:** Total de estudantes, alunos ativos, alunos bloqueados, total de questões resolvidas e média geral de acertos.
- **Acompanhamento Regional:** Visualização da UF escolhida por cada estudante.
- **Controle de Acesso em Tempo Real:** Botão para **Bloquear** ou **Liberar** o acesso de qualquer estudante com 1 clique.
- **Busca e Filtros:** Pesquisa instantânea por nome, e-mail ou UF.
- **Acompanhamento Pedagógico Individual:** Visualização dos erros recentes e desempenho por matéria de cada aluno.
- **Atalho Automático:** Quando um e-mail de administrador (configurado em `ADMIN_EMAILS`) faz login no app, um botão **"⚙️ Painel Admin"** aparece na barra superior.

---

## Como Configurar o Firebase e Publicar

### 1. Criar o Projeto no Firebase (100% Gratuito)
1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie o projeto `intensivo-if-2026`.

### 2. Ativar a Autenticação com Google
1. Acesse **Build > Authentication > Sign-in method**.
2. Clique em **Google**, ative, selecione seu e-mail de suporte e salve.

### 3. Publicação em Produção (Firebase Hosting)
```bash
firebase deploy
```
URL ao vivo: `https://ifintenso.web.app`
Painel Admin: `https://ifintenso.web.app/admin.html`

---

## Estrutura do Repositório

```text
├── dist/
│   ├── index.html               # Aplicação principal do estudante
│   ├── admin.html               # Dashboard de controle de acesso (Admin)
│   ├── admin.js                 # Lógica de gestão e acompanhamento
│   ├── admin.css                # Estilos do painel de controle
│   ├── styles.css               # Estilos base e temas visuais
│   ├── data.js                  # Catálogo de UFs, instituições e questões
│   ├── app.js                   # Roteamento, simulados e progresso
│   ├── auth.js                  # Autenticação Google & Sincronização Firestore
│   ├── firebase-config.js       # Credenciais ativas da aplicação
│   └── firebase-config.example.js # Template de configuração
├── firestore.rules              # Regras de segurança e controle de acesso
├── firebase.json                # Configuração do Firebase Hosting e Firestore
├── CHANGELOG.md                 # Histórico de versões
└── README.md                    # Documentação do projeto
```

---

## Roadmap

- [x] v0.1.0: Seleção de UF, instituição e modalidade; estudo por área; simulado regional; progresso local.
- [x] Banco único de questões de todo o Brasil, sem seleção obrigatória de UF; provas anteriores filtradas por estado dentro do acervo.
- [x] Página inicial de login Google com opção de estudo local e questões adaptadas de provas oficiais do IFSC e IFSP, com gabaritos conferidos.
- [x] v0.4.0: Autenticação Google via Firebase Auth, sincronização no Firestore e Dashboard de controle de acesso e acompanhamento pedagógico (`admin.html`).
- [ ] v1.0.0: Catálogo nacional ampliado e planos de estudo por edital.

Developed by AK Labs
