# Referencia de Hooks

**Este documento cobre a plataforma OpenCode.** No Windsurf, veja o sistema
de `extensions/` descrito em `docs/portuguese/other-editors.md` — ele e
apenas consultivo (advisory) e nao executa codigo, o que e uma diferenca
real e intencional entre as duas plataformas (nao uma lacuna a fechar).

No OpenCode, este plugin usa hooks reais, que executam script de verdade,
via a API de plugins documentada (https://opencode.ai/docs/plugins),
implementados em `.opencode/plugins/*.js`. Cada plugin retorna handlers para
eventos como `tool.execute.before`, `tool.execute.after` e `event` (ciclo de
vida da sessao).

## Tabela de plugins

| Arquivo do plugin | Gatilho | O que faz |
| --- | --- | --- |
| `docs-memory-guard.js` | `tool.execute.after` em write/edit/patch, depois `event: session.idle` | Rastreia se a sessao tocou `docs/` e/ou codigo; avisa no fim da sessao se codigo mudou sem atualizacao de docs |
| `commit-convention-guard.js` | `tool.execute.before` em `git commit -m "..."` | Avisa (ou bloqueia, com `PWF_STRICT_COMMIT_CONVENTION=1`) se a mensagem nao tem o prefixo `[TICKET-XXXX]` |
| `typeorm-migration-guard.js` | `tool.execute.after` em `typeorm:generate` | Lembra de rodar a migration localmente imediatamente (cadeia atomica) |

O estado do `docs-memory-guard.js` e persistido por sessao do OpenCode em
`.opencode/state/docs-memory-guard.json` dentro do seu projeto.

## Por que esses plugins importam

- Evitam desvio silencioso de processo.
- Mantem documentacao conectada a implementacao.
- Melhoram consistencia sem bloquear trabalho normal (os tres sao
  consultivos por padrao; so o guard de commit pode virar bloqueio rigido).

## Importante

Plugins sao reforco. Quem conduz o fluxo continuam sendo os comandos:

- `/pwf-work` e `/pwf-work-plan` para implementacao
- familia `/pwf-doc` para saidas explicitas de documentacao
- `/pwf-review` para loops de feedback de qualidade

## Estendendo

Para adicionar um novo plugin, crie `.opencode/plugins/seu-plugin.js`
exportando uma funcao async que retorna um objeto de hooks (veja os tres
exemplos acima para o padrao), e adicione cobertura em
`tests/plugins/plugins-regression.test.mjs`. O arquivo
`.opencode/plugins/package.json` ja declara `"type": "module"`, entao
`export`/`import` ESM funciona tanto dentro do OpenCode quanto na suite de
testes.
