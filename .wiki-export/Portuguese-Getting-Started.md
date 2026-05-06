> Source: `docs/portuguese/getting-started.md`

# Comece em 10 Minutos

Este guia ajuda voce a executar o workflow de ponta a ponta pela primeira vez, com previsibilidade.

## Ideia central antes de comecar

- O caminho fica sob controle do desenvolvedor.
- A IA executa a etapa escolhida com rigor.
- Documentacao e memoria operacional obrigatoria.

## 1) Instalar plugin localmente

1. `./scripts/install-plugin-local.sh`
2. Reinicie o Windsurf/OpenCode (ou recarregue a janela).

## 2) Inicializar esqueleto de docs no projeto

Rode:

- `/pwf-setup-workspace` (recomendado quando for criar um layout multi-root novo)
- `/pwf-setup`

`/pwf-setup-workspace` cria a estrutura recomendada `<NomeProjeto>_Repos` + `<NomeProjeto>_Workspace` e gera um arquivo `.code-workspace`.
`/pwf-setup` cria/repara a base de documentacao usada pelos comandos de execucao.

## 3) Entender comandos antes de executar

Rode:

- `/pwf-help`

Se tiver duvida sobre um comando, peca ao `/pwf-help` para explicar o comando sem executar.

## 4) Executar o fluxo principal

1. `/pwf-brainstorm` -> definir escopo, direcao de arquitetura e decisoes principais.
2. `/pwf-plan` -> gerar tarefas de implementacao em fases.
3. Quality gates opcionais depois do plano:
   - `/pwf-checklist`
   - `/pwf-clarify`
   - `/pwf-analyze`
4. `/pwf-work-plan` -> executar uma fase por vez e repetir ate concluir todas as fases.
5. `/pwf-review` -> revisao profunda quando necessario.
6. `/pwf-commit-changes` -> commits locais estruturados.

## 5) Faixa alternativa de execucao

Use `/pwf-work` quando a mudanca for focada e fora de plano formal:

- fixes pequenos
- ajustes locais
- follow-up apos fases planejadas

`/pwf-work` tambem forca leitura de docs antes e manutencao de docs depois.

## 6) Comandos de documentacao (saida explicita)

- `/pwf-doc` -> atualizacao tecnica por escopo.
- `/pwf-doc-foundation` -> docs base (`infrastructure`, `architecture`, `integrations`, `environments`, `glossary`).
- `/pwf-doc-runbook` -> runbooks operacionais.
- `/pwf-doc-capture` -> aprendizados/padroes reutilizaveis.
- `/pwf-doc-refresh` -> curadoria do ciclo de vida em `docs/solutions/`.

## 7) Validar setup do plugin

Execute:

- `node scripts/validate-template.mjs`
