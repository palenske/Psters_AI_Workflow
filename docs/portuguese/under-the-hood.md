# Por Dentro do Workflow

Este documento explica por que o Psters AI Workflow funciona e como ele funciona internamente.

Se voce quer apenas uso pratico, leia `getting-started.md` e `commands-reference.md`.
Se voce quer entender arquitetura e mecanismo interno, leia esta pagina.

## Por que este workflow funciona

O workflow funciona porque combina cinco camadas de controle:

1. Orquestracao explicita (`/pwf-*`)
2. Guardrails persistentes (rules)
3. Procedimentos reutilizaveis (skills)
4. Especializacao por subtarefa (agents)
5. Lembretes de ciclo de vida (hooks)

Essas camadas reduzem aleatoriedade e transformam IA em sistema de entrega previsivel.

## Filosofia central

- O desenvolvedor escolhe o caminho.
- A IA executa o caminho escolhido com rigor.
- Documentacao e tratada como memoria operacional.

O foco e consistencia de entrega, nao velocidade one-shot sem controle.

## Arquitetura do sistema na pratica

Cadeia de execucao:

`command` -> `rules` -> `skills` -> `agents` -> `hooks` -> relatorio final

Cada camada resolve um problema diferente.

## Commands: camada de orquestracao

Commands vivem em `.opencode/commands/` (ou `.windsurf/commands/`).

Sao os pontos de entrada do usuario (`/pwf-*`) e:

- definem a sequencia de etapas,
- forcam fases obrigatorias (ex.: docs-first em comandos de work),
- definem contrato de saida esperado.

Commands respondem: "Qual fluxo deve rodar agora?"

## Rules: camada de politica

Rules vivem em `.opencode/AGENTS.md` (ou `.windsurf/AGENTS.md`), que fornece:
- Guardrails operacionais
- Padrões de commit
- Disciplina de migracao
- Políticas de build

Sao restricoes persistentes que valem independentemente do estilo do prompt:

- convencao de commit,
- disciplina de migration,
- fronteira de escopo de documentacao,
- guardrails operacionais.

Rules respondem: "O que sempre precisa continuar verdadeiro?"

## Skills: camada de procedimento

Skills vivem em `plugins/psters-ai-workflow/skills/<skill>/SKILL.md`.

Uma skill e um playbook reutilizavel para padroes recorrentes:

- debugging,
- verificacao antes de concluir,
- manutencao de docs apos implementacao,
- carregamento de baseline de docs.

Skills evitam inchaco de commands: um procedimento pode ser reutilizado em varios fluxos.

Skills respondem: "Como essa classe de trabalho deve ser executada?"

## Agents: camada de especializacao

Agents vivem em `plugins/psters-ai-workflow/agents/`.

Commands acionam agents para responsabilidades focadas:

- agents de research mapeiam contexto e padroes existentes,
- agents de review detectam riscos/regressoes/seguranca/performance,
- agents de docs geram e sincronizam documentacao canonica.

Agents respondem: "Qual especialista e melhor para esta subtarefa?"

## Hooks: camada de seguranca do ciclo de vida

Hooks vivem em `plugins/psters-ai-workflow/hooks/`.

Sao verificacoes automaticas por evento:

- apos edicao: rastrear se codigo e docs mudaram,
- antes/depois de shell: lembrar convencoes criticas,
- evento stop: alertar quando codigo mudou sem atualizacao de docs.

Hooks nao substituem commands. Eles reforcam disciplina em volta da execucao.

## Por que documentacao e obrigatoria neste sistema

Sem docs atualizadas, cada execucao de IA comeca parcialmente cega.
Com docs atualizadas, cada execucao de IA comeca com memoria de projeto.

Por isso `/pwf-work` e `/pwf-work-plan` sao docs-first e docs-maintenance por design.

## Como a qualidade e controlada

Qualidade nao e um unico passo. E um sistema em camadas:

- qualidade de plano: `/pwf-plan`
- quality gates de requisitos: `/pwf-checklist`, `/pwf-clarify`, `/pwf-analyze`
- qualidade de implementacao: disciplina de `/pwf-work*`
- qualidade de revisao: `/pwf-review`
- qualidade de memoria: update e curadoria de docs

Esse modelo em camadas escala melhor que prompting ad-hoc.

## Equivoco comum

"Se o modelo for bom o suficiente, nao precisa dessa estrutura."

Na pratica, capacidade de modelo nao substitui capacidade de processo.
O workflow existe para manter estabilidade de saida entre:

- diferentes versoes de modelo,
- diferentes contribuidores,
- diferentes niveis de maturidade do projeto.

## Modelo mental para usuarios avancados

- Commands orquestram.
- Rules limitam.
- Skills padronizam.
- Agents especializam.
- Hooks reforcam higiene do ciclo de vida.

Quando essas cinco partes estao alinhadas, o workflow fica previsivel, auditavel e evolutivo.
