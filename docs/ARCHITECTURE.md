# Arquitetura

O MVP é uma SPA estática, sem framework e sem etapa de build. A decisão reduz custo operacional, permite uso offline após o carregamento e mantém compatibilidade com hospedagens estáticas.

## Módulos

- `data.js`: fonte editorial versionada. Em uma futura API, este contrato será preservado como DTO de catálogo.
- `app.js`: estado local, navegação por renderização, geração de simulados e agregação de métricas.
- `styles.css`: design system do produto e responsividade.

## Evolução prevista

1. Extrair questões, fontes e instituições para JSON validado por schema.
2. Adicionar pipeline de ingestão com revisão humana obrigatória.
3. Sincronizar progresso via Firebase Auth/Firestore sem remover o modo anônimo.
4. Criar painel administrativo com RBAC e trilha de auditoria editorial.

Developed by AK Labs
