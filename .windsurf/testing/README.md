# Documentação de Testes — sm-iter Monorepo

**Guia completo para implementação e manutenção de testes unitários no monorepo sm-iter (plataforma de ensino com IA).**

Última atualização: 2026-03-04 | Windsurf + GPT-5.1 Codex

---

## 🚀 Início Rápido com Workflow Automático

### Retomar Sessão de Testes

**Cole no Windsurf (modo Plan):**

```
Retomar testes — Backend
```

ou

```
Retomar testes — Frontend
```

**O que acontece:**
1. LLM lê automaticamente `TEST-PROGRESS.md` e regras
2. Apresenta estado atual e próximos arquivos sugeridos
3. Você aponta qual módulo/arquivo testar
4. LLM cria plano detalhado e aguarda aprovação
5. Implementação contínua com feedback após cada arquivo
6. Encerramento automático com output de sessão

**Documentação completa:** [`WORKFLOW-CONFIG.md`](./WORKFLOW-CONFIG.md)

---

## 📚 Documentação Detalhada

### Para Backend (sm-iter-api)

1. **Estado atual:** [`apps/sm-iter-api/TEST-PROGRESS.md`](../../apps/sm-iter-api/TEST-PROGRESS.md)
2. **Workflow automático:** [`WORKFLOW-CONFIG.md`](./WORKFLOW-CONFIG.md)
3. **Regras operacionais:** [`rules/backend.md`](./rules/backend.md)
4. **Guia de implementação:** [`guides/backend-implementation.md`](./guides/backend-implementation.md)

### Para Frontend (sm-iter-painel)

1. **Estado atual:** [`apps/sm-iter-painel/TEST-PROGRESS.md`](../../apps/sm-iter-painel/TEST-PROGRESS.md)
2. **Workflow automático:** [`WORKFLOW-CONFIG.md`](./WORKFLOW-CONFIG.md)
3. **Regras operacionais:** [`rules/frontend.md`](./rules/frontend.md)
4. **Guia de implementação:** [`guides/frontend-implementation.md`](./guides/frontend-implementation.md)

---

## 📚 Estrutura da Documentação

```
.windsurf/testing/
├── README.md                          ← Você está aqui
│
├── guides/                            ← Guias de implementação
│   ├── backend-implementation.md      ← Como implementar testes no backend
│   ├── frontend-implementation.md     ← Como implementar testes no frontend
│   └── workflow.md                    ← Fluxo de trabalho e processo
│
├── rules/                             ← Regras operacionais (leitura obrigatória)
│   ├── backend.md                     ← Regras para sessões de testes backend
│   └── frontend.md                    ← Regras para sessões de testes frontend
│
├── templates/                         ← Templates reutilizáveis
│   ├── session-prompts.md             ← Prompts de retomada e checkpoint
│   ├── mock-creation.md               ← Como criar mocks centralizados
│   └── test-implementation.md         ← Templates de testes por tipo
│
└── reference/                         ← Referência rápida
    ├── commands.md                    ← Comandos úteis (test, coverage, etc.)
    ├── patterns.md                    ← Padrões SOLID e Clean Code
    └── session-protocol.md            ← Protocolo de output de sessões
```

---

## 🚀 Fluxo de Trabalho em 3 Passos

### 1. **Ler** — Contexto e Estado Atual

**Antes de qualquer ação:**
- Leia `TEST-PROGRESS.md` do projeto alvo (backend ou frontend)
- Leia as regras operacionais (`rules/backend.md` ou `rules/frontend.md`)
- Entenda o estado atual: cobertura, arquivos criados, bloqueios

### 2. **Planejar** — Definir Escopo e Ordem

**Sempre plan antes de act:**
- Proponha lista de arquivos a criar nesta sessão
- Identifique mocks necessários
- Defina ordem de execução (blocos)
- Aguarde aprovação antes de implementar

### 3. **Implementar** — Executar em Blocos

**Um módulo por vez:**
- Implemente um arquivo de teste
- Rode `pnpm test -- [arquivo]`
- Confirme verde antes de avançar
- Atualize `TEST-PROGRESS.md` ao final

---

## 📖 Guias por Cenário

### Cenário 1: Iniciar Nova Sessão de Testes

**Backend:**
1. Use template: [`templates/session-prompts.md`](./templates/session-prompts.md#retomada-backend)
2. Siga workflow: [`guides/workflow.md`](./guides/workflow.md)
3. Implemente: [`guides/backend-implementation.md`](./guides/backend-implementation.md)

**Frontend:**
1. Use template: [`templates/session-prompts.md`](./templates/session-prompts.md#retomada-frontend)
2. Siga workflow: [`guides/workflow.md`](./guides/workflow.md)
3. Implemente: [`guides/frontend-implementation.md`](./guides/frontend-implementation.md)

### Cenário 2: Criar Mock Centralizado

1. Consulte: [`templates/mock-creation.md`](./templates/mock-creation.md)
2. Siga padrões: [`reference/patterns.md`](./reference/patterns.md)
3. Documente no README do diretório de mocks

### Cenário 3: Implementar Teste Específico

1. Use template: [`templates/test-implementation.md`](./templates/test-implementation.md)
2. Siga estrutura AAA: [`reference/patterns.md`](./reference/patterns.md#estrutura-aaa)
3. Valide com comandos: [`reference/commands.md`](./reference/commands.md)

### Cenário 4: Fazer Checkpoint de Cobertura

1. Use template: [`templates/session-prompts.md`](./templates/session-prompts.md#checkpoint)
2. Execute comandos: [`reference/commands.md`](./reference/commands.md#cobertura)
3. Atualize `TEST-PROGRESS.md`

### Cenário 5: Encerrar Sessão

1. Siga protocolo: [`reference/session-protocol.md`](./reference/session-protocol.md)
2. Atualize `TEST-PROGRESS.md`
3. Gere output de sessão

---

## 🎓 Stack Tecnológica

### Backend (sm-iter-api)
- **Framework:** NestJS 10 + TypeScript 4.3
- **ORM:** Prisma 5.6 + MySQL
- **Autenticação:** Keycloak (nest-keycloak-connect)
- **Mensageria:** AWS SQS + @nestjs/event-emitter
- **Testes:** Jest 27 + ts-jest
- **Cobertura atual:** ~4% (em expansão)

### Frontend (sm-iter-painel)
- **Framework:** Next.js 14.2 + React 18.2 + TypeScript 5.5
- **Estado:** Context API + SWR
- **UI:** Ant Design 5.8 + styled-components
- **Testes:** Vitest 2.1 + @testing-library/react + jsdom
- **Cobertura atual:** ~5% (em expansão)

---

## 📊 Estado Atual dos Testes

### Backend
| Módulo | Functions | Lines | Branches |
|--------|-----------|-------|----------|
| shared/utils | 0% | 0% | 0% |
| core/useCases/alunos | 74.19% | 77.41% | 53.20% |
| core/useCases/faturamento | 0% | 0% | 0% |
| **GLOBAL** | **3.88%** | **4.17%** | **3.51%** |

**Threshold:** branches: 3% | functions: 3% | lines: 4%

### Frontend
| Módulo | Functions | Lines | Branches |
|--------|-----------|-------|----------|
| lib/string | 100% | 93.75% | 93.75% |
| hooks/useIntegration | 100% | 100% | 100% |
| Demais módulos | 0% | 0% | 0% |
| **GLOBAL** | **5.20%** | **0.28%** | **8.15%** |

**Threshold:** branches: 0.1% | functions: 0.1% | lines: 0.1%

---

## 🎯 Roadmap

### Fase Atual — Fundação
- [x] Configurar ambiente de testes (Jest/Vitest)
- [x] Criar setup inicial com mocks globais
- [x] Implementar primeiros testes (utils + alguns use cases)
- [ ] Criar mocks centralizados (backend)
- [ ] Expandir utilitários de teste (frontend)

### Próxima Fase — Expansão
- [ ] Cobrir módulos críticos (faturamento backend, hooks frontend)
- [ ] Elevar thresholds progressivamente
- [ ] Cobrir guards, middlewares, componentes puros

### Meta Final
- [ ] Cobertura: branches 70% | functions 80% | lines 80%
- [ ] Testes de todos os módulos críticos
- [ ] Documentação completa de padrões

---

## ⚡ Comandos Rápidos

### Backend
```bash
# Rodar todos os testes
pnpm --filter sm-iter-api test

# Rodar arquivo específico
pnpm --filter sm-iter-api test -- CreateAlunoUseCase.spec.ts

# Cobertura
pnpm --filter sm-iter-api test:cov
```

### Frontend
```bash
# Rodar todos os testes
pnpm --filter sm-iter-painel test

# Rodar arquivo específico
pnpm --filter sm-iter-painel test -- string.test.ts

# Cobertura
pnpm --filter sm-iter-painel test:coverage
```

Mais comandos: [`reference/commands.md`](./reference/commands.md)

---

## 🔗 Links Rápidos

### Documentos Principais
- [Regras Backend](./rules/backend.md)
- [Regras Frontend](./rules/frontend.md)
- [Workflow Geral](./guides/workflow.md)
- [Protocolo de Sessões](./reference/session-protocol.md)

### Templates
- [Prompts de Sessão](./templates/session-prompts.md)
- [Criação de Mocks](./templates/mock-creation.md)
- [Implementação de Testes](./templates/test-implementation.md)

### Referências
- [Comandos Úteis](./reference/commands.md)
- [Padrões e Boas Práticas](./reference/patterns.md)

### Estado Vivo
- [TEST-PROGRESS Backend](../../apps/sm-iter-api/TEST-PROGRESS.md)
- [TEST-PROGRESS Frontend](../../apps/sm-iter-painel/TEST-PROGRESS.md)

---

## ❓ FAQ

### Como iniciar uma nova sessão de testes?
Use o template de retomada em [`templates/session-prompts.md`](./templates/session-prompts.md)

### Onde criar mocks centralizados?
- Backend: `apps/sm-iter-api/src/test/mocks/`
- Frontend: `apps/sm-iter-painel/test/utils/`

### Como saber o que testar primeiro?
Consulte a ordem de prioridade em:
- Backend: [`guides/backend-implementation.md`](./guides/backend-implementation.md#ordem-de-implementação)
- Frontend: [`guides/frontend-implementation.md`](./guides/frontend-implementation.md#ordem-de-implementação)

### Como ajustar thresholds?
Siga o plano progressivo em [`guides/workflow.md`](./guides/workflow.md#thresholds-progressivos)

### Onde encontrar exemplos de testes?
Consulte [`templates/test-implementation.md`](./templates/test-implementation.md) para templates por tipo

---

## 📝 Princípios Fundamentais

1. **Plan antes de Act** — Sempre propor plano antes de implementar
2. **Um módulo por vez** — Verde antes de avançar
3. **Mocks centralizados** — Nunca inline, sempre reutilizáveis
4. **Estrutura AAA** — Arrange / Act / Assert obrigatória
5. **SOLID e Clean Code** — Aplicados também aos testes
6. **TEST-PROGRESS.md** — Fonte de verdade, sempre atualizado

---

## 🆘 Suporte

- **Dúvidas sobre processo:** Consulte [`guides/workflow.md`](./guides/workflow.md)
- **Dúvidas sobre padrões:** Consulte [`reference/patterns.md`](./reference/patterns.md)
- **Dúvidas sobre comandos:** Consulte [`reference/commands.md`](./reference/commands.md)
- **Bloqueios técnicos:** Documente em `TEST-PROGRESS.md` e consulte guias de implementação

---

**Pronto para começar?** Escolha seu projeto (backend ou frontend) e siga o fluxo de 3 passos acima! 🚀
