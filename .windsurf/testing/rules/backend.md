---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Guia de Implementação](../guides/backend-implementation.md) | [Workflow](../guides/workflow.md)

# Regras Operacionais — Backend (sm-iter-api)

Regras permanentes para sessões de implementação de testes unitários no backend NestJS.

---

## 📋 Leitura Obrigatória ao Iniciar Qualquer Sessão

Antes de qualquer ação, leia os arquivos abaixo **nesta ordem exata**.
Não implemente nada, não sugira código, não faça perguntas até ter lido todos.

```
1. apps/sm-iter-api/TEST-PROGRESS.md                ← estado atual: cobertura, bloqueios, próximos arquivos
2. .windsurf/testing/rules/backend.md               ← este arquivo, para relembrar o fluxo
3. .windsurf/testing/reference/session-protocol.md  ← contrato de comunicação e formato de output
4. .windsurf/testing/guides/backend-implementation.md ← padrões técnicos, mocks, ordem de implementação
5. .windsurf/testing/guides/workflow.md             ← regras de fluxo, plan/act, thresholds
```

Após a leitura, apresente:
- Cobertura atual (functions%, lines%, branches%)
- Status da última sessão
- Próximos arquivos planejados
- Bloqueios ativos (se houver)

**Aguarde instrução do usuário antes de avançar.**

---

## 🎯 Plan Antes de Act

- Sempre produza um plano com blocos claros antes de implementar qualquer coisa.
- O plano deve listar: arquivos a criar, mocks necessários e ordem de execução.
- Nenhum código é alterado antes do plano ser aprovado pelo usuário.

---

## 🔄 Execução em Blocos (Um Módulo por Vez)

```
Bloco 1 — Mocks/setup
  └── Criar ou atualizar src/test/mocks/* e src/test/setup.ts
  └── Rodar pnpm test → confirmar verde → aguardar aprovação

Bloco 2 — Utils/helpers
  └── Implementar specs dos utilitários selecionados
  └── Rodar pnpm test → confirmar verde → aguardar aprovação

Bloco N — Módulo alvo (use case, guard, service...)
  └── Um módulo por vez
  └── Rodar pnpm test -- [arquivo].spec.ts após cada arquivo
  └── Verde antes de avançar para o próximo
```

---

## ⚙️ Regras Permanentes

### Comportamento Geral
- ❌ Nunca inicie implementação sem aprovação explícita
- ❌ Nunca altere `jest.config.js` sem aprovação explícita
- ❌ Nunca faça chamadas reais a banco, HTTP ou filas em testes unitários
- ✅ Um arquivo de teste por vez — verde antes de avançar

### Injeção de Dependências (HTTP/axios)
- ✅ Qualquer service/use case que faça chamadas HTTP deve receber o cliente (p.ex. `AxiosInstance`) via construtor, mantendo fallback interno (`client || axios.create(...)`).
- ✅ Testes unitários devem instanciar esses serviços passando mocks explícitos, evitando reliance em `axios.create` global.
- ✅ Quando um helper como `BaseAxios`/`BaseProvider` encapsular a criação do cliente, também deve aceitar instâncias injetadas.
- 🎯 Objetivo: permitir mocks determinísticos sem recorrer a monkeypatch global de axios e reduzir falsos positivos em testes.

### Mocks
- ✅ Todos os mocks residem em `apps/sm-iter-api/src/test/mocks/`
- ✅ Todo método mockado deve ter o comentário `// @MOCK`
- ❌ Nunca criar mocks inline duplicados — se não existir, criar em `src/test/mocks/` primeiro

### Thresholds
- ❌ Nunca aumentar thresholds além da cobertura real atual
- ❌ Nunca diminuir thresholds sem justificativa registrada no output da sessão
- ✅ Pipeline nunca deve ser bloqueado por threshold irrealista

---

## 🏁 Encerramento de Sessão

Ao detectar qualquer um destes sinais:
- "encerra", "fecha", "até amanhã", "por hoje é isso"
- Bloqueio sem resolução após 2 tentativas
- Solicitação de status
- Janela > 70% preenchida

**Execute:**
1. Pare toda implementação
2. Rode `pnpm test` — registre o resultado
3. Rode `pnpm test:cov` — colete os números reais
4. Atualize `apps/sm-iter-api/TEST-PROGRESS.md`
5. Emita o Output de Sessão conforme [session-protocol.md](../reference/session-protocol.md)
6. Aguarde confirmação do usuário antes de encerrar

> ⚠️ **Nunca estime cobertura** — só valores reais do `pnpm test:cov`.
> ⚠️ Se qualquer teste estiver falhando, o status é ❌, não ⚠️.

---

## 🗺️ Mapa dos Arquivos de Referência

| Arquivo | Propósito | Quando usar |
|---------|-----------|-------------|
| `apps/sm-iter-api/TEST-PROGRESS.md` | Estado vivo: cobertura, inventário, bloqueios | Início e fim de toda sessão |
| `reference/session-protocol.md` | Formato do output e prompt de retomada | Início e fim de toda sessão |
| `guides/backend-implementation.md` | Padrões técnicos, mocks, ordem de prioridade | Ao implementar qualquer teste |
| `guides/workflow.md` | Regras de fluxo, plan/act, thresholds progressivos | Ao tomar decisões de processo |

---

## 📁 Localização dos Arquivos no Projeto

```
apps/sm-iter-api/
├── TEST-PROGRESS.md                    ← atualizar ao fim de cada sessão
├── jest.config.js                      ← nunca alterar sem aprovação
└── src/
    └── test/
        ├── setup.ts
        └── mocks/
            ├── prisma.mock.ts
            ├── aws.mock.ts
            ├── keycloak.mock.ts
            └── event-emitter.mock.ts

.windsurf/testing/
├── README.md                           ← índice principal
├── rules/
│   └── backend.md                      ← este arquivo
├── guides/
│   ├── backend-implementation.md
│   └── workflow.md
├── templates/
│   ├── session-prompts.md
│   ├── mock-creation.md
│   └── test-implementation.md
└── reference/
    ├── commands.md
    ├── patterns.md
    └── session-protocol.md
```

---

## 🎯 Stack Tecnológica — Referência Rápida

- **Framework:** NestJS 10 + TypeScript 4.3
- **ORM:** Prisma 5.6 + MySQL
- **Autenticação:** Keycloak (nest-keycloak-connect)
- **Mensageria:** AWS SQS + @nestjs/event-emitter
- **Integrações:** AWS S3/SES/SQS, Mercado Pago, Bitrix, HeyGen, OpenAI
- **Validação:** class-validator + class-transformer
- **Testes:** Jest 27 + ts-jest

---

## ✅ Checklist de Sessão

### Início
- [ ] Ler TEST-PROGRESS.md
- [ ] Ler este arquivo (rules/backend.md)
- [ ] Apresentar resumo do estado atual
- [ ] Propor plano com blocos claros
- [ ] Aguardar aprovação

### Durante
- [ ] Implementar um módulo por vez
- [ ] Rodar testes após cada arquivo
- [ ] Confirmar verde antes de avançar
- [ ] Usar mocks centralizados
- [ ] Seguir estrutura AAA

### Fim
- [ ] Rodar `pnpm test` — confirmar verde
- [ ] Rodar `pnpm test:cov` — coletar números reais
- [ ] Atualizar TEST-PROGRESS.md
- [ ] Gerar output de sessão
- [ ] Documentar bloqueios e próximos passos

---

**Lembre-se:** Plan → Act → Test → Update → Repeat
