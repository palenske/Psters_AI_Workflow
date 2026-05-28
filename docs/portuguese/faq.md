# FAQ

## Eu instalei o plugin e ele nao funciona. O que devo checar primeiro?

Primeiro valide o contexto de execucao.

Se voce instalou via WSL, mas o plugin nao aparece, verifique se voce esta usando um editor com suporte nativo.

Veja o guia de WSL:

- [Comece em 10 Minutos](getting-started.md)

Checklist rapido:

- confirme onde voce rodou `./scripts/install-plugin-local.sh`
- confirme onde o workspace foi aberto no Cursor (Windows vs WSL)
- recarregue o Cursor depois da instalacao

## Preciso sempre usar `/pwf-plan`?

Nao. Use `/pwf-plan` para mudancas multi-etapas ou de maior risco.
Para fixes pequenos e ajustes pontuais, use `/pwf-work`.

## Qual a diferenca entre `/pwf-work` e `/pwf-work-plan`?

- `/pwf-work-plan`: executa fases planejadas, uma por vez.
- `/pwf-work`: executa mudancas focadas fora de plano formal.

Ambos leem docs primeiro e atualizam docs no proprio fluxo obrigatorio.

## Qual a diferenca entre os comandos da familia `/pwf-doc`?

- `/pwf-doc`: documentacao tecnica canonica por escopo (modulo, feature, arquitetura, ADR, update).
- `/pwf-doc-foundation`: docs base do projeto (infrastructure, architecture, integrations, environments, glossary).
- `/pwf-doc-runbook`: runbooks operacionais em `docs/runbooks/`.
- `/pwf-doc-capture`: artefatos de aprendizado reutilizavel (problema/solucao e padroes).

## Se `/pwf-work` e `/pwf-work-plan` ja atualizam docs, por que usar a familia `/pwf-doc`?

Use quando quiser forcar explicitamente uma saida de documentacao especifica.

## Quem decide o proximo comando: desenvolvedor ou IA?

O desenvolvedor decide.  
O Psters foi feito para execucao previsivel: controle com o desenvolvedor, execucao com a IA.

## Esse workflow realmente obriga documentacao?

Sim. `/pwf-work` e `/pwf-work-plan` leem docs antes de implementar e atualizam docs antes de concluir.
E assim que os padroes do projeto se mantem ao longo do tempo.

## Hooks sao obrigatorios?

Hooks sao guardrails recomendados. Eles reforcam disciplina e lembretes, mas o fluxo principal continua sendo pelos comandos.

## Esse workflow depende de linguagem/framework especifico?

Nao. O workflow e agnostico de linguagem e framework.
