# Banco nacional de questões dos Institutos Federais

## Resultado da pesquisa inicial

O inventário nacional está em `integrations/if-exam-source-registry.json`. Ele cobre os 38 Institutos Federais e distingue quatro situações: acervo confirmado, histórico de seleções, material localizado apenas em campus/edição e acervo ainda não localizado.

Não existe um acervo nacional único. Além disso, nem todo processo seletivo utiliza prova: há edições por sorteio, histórico escolar, Enem ou combinações desses critérios. Por isso, a ausência de caderno de prova não deve ser registrada como falha de coleta sem antes conferir o edital da edição.

## Regra jurídica e editorial

1. O produto pode indexar a página oficial e seus metadados.
2. PDF oficial deve permanecer no domínio da instituição; não deve ser republicado pelo projeto sem autorização.
3. Antes de reproduzir uma questão, registrar instituição, edição, modalidade, caderno, número, URL oficial, data de acesso e resultado da revisão de direito de uso.
4. Questões transcritas passam por revisão pedagógica e de acessibilidade; imagens, charges e textos de terceiros exigem revisão específica de direitos autorais.
5. Quando não houver autorização clara, produzir questão autoral alinhada à matriz do edital, sem paráfrase próxima do enunciado original.

## Modelo recomendado

Cada prova deve gerar um registro `exam`, e cada item importável um registro `question`.

Campos mínimos de `exam`: `institutionId`, `year`, `term`, `admissionType`, `modality`, `examUrl`, `answerKeyUrl`, `officialDomain`, `retrievedAt`, `checksum`, `rightsStatus` e `reviewStatus`.

Campos mínimos de `question`: `examId`, `number`, `subject`, `topic`, `statement`, `options`, `answer`, `explanation`, `assetRefs`, `sourceLocator`, `rightsStatus`, `pedagogicalReview` e `status`.

## Pipeline

1. Descobrir e validar a página oficial de cada IF.
2. Inventariar por edição e modalidade, sem baixar em massa.
3. Calcular checksum dos documentos permitidos para detectar alterações.
4. Extrair texto para uma fila privada de revisão, mantendo referência de página e questão.
5. Revisar direitos, gabarito, disciplina, assunto, acessibilidade e explicação.
6. Publicar somente registros aprovados; manter auditoria de quem revisou e quando.

## Próxima prioridade de coleta

- Fechar os anexos dos acervos já confirmados: IFBA, IFAL, IFAM, IFG, IFMG, IFSULDEMINAS, IFRS e IFSC.
- Investigar páginas por edição nos IFs marcados `not_located`, começando pelas instituições com prova objetiva vigente.
- Solicitar autorização institucional para reprodução de questões e elementos gráficos.
- Integrar a fila editorial ao Google Sheets e exportar JSON validado para o app.

Developed by AK Labs
