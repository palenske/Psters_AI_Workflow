---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Backend](./backend-implementation.md) | [Frontend](./frontend-implementation.md)

# Workflow — Fluxo de Trabalho de Testes

Guia de processo e workflow para implementação de testes unitários no monorepo sm-iter.

---

## 🎯 Contexto

- **Monorepo:** 3 serviços (painel, backend, integrations)
- **Testes ativos:** painel (frontend) e backend
- **Ferramenta:** Windsurf + GPT-5.1 Codex
- **Abordagem:** Incremental e progressiva

---

## 📋 Regras do Fluxo de Trabalho

### 1. Toda Sessão Começa com Retomada de Contexto

**Leitura obrigatória antes de qualquer ação:**
- `TEST-PROGRESS.md` — estado atual da cobertura e roadmap
- Regras operacionais (`rules/backend.md` ou `rules/frontend.md`)
- Guia de implementação relevante

**Nunca pule esta etapa.** O contexto é essencial para decisões corretas.

### 2. Sempre Plan Antes de Act

```
PLAN → modelo propõe arquivos, mocks e ordem
  ↓
APROVAÇÃO → usuário valida o plano
  ↓
ACT → modelo implementa conforme aprovado
```

**Nunca pule direto para implementação** em módulos com múltiplas dependências.

### 3. Um Módulo por Vez

- Implemente um arquivo de teste
- Rode `pnpm test -- [arquivo]`
- Confirme verde
- Aguarde aprovação
- Avance para o próximo

**Nunca implemente múltiplos módulos no mesmo bloco.**

### 4. Execução em Blocos com Confirmação

```
Bloco 1: Mocks centralizados
  └── Criar src/test/mocks/*
  └── Rodar pnpm test
  └── Confirmar verde
  └── Aguardar aprovação

Bloco 2: Utils/helpers
  └── Implementar specs
  └── Rodar pnpm test
  └── Confirmar verde
  └── Aguardar aprovação

Bloco N: Use case/hook/componente
  └── Implementar spec
  └── Rodar pnpm test -- [arquivo]
  └── Confirmar verde
  └── Aguardar aprovação
```

### 5. Testes Verdes Antes de Encerrar

```bash
# Backend
pnpm --filter sm-iter-api test

# Frontend
pnpm --filter sm-iter-painel test
```

**Nunca encerre uma sessão com testes quebrando.**

### 6. TEST-PROGRESS.md é a Memória dos Testes

Atualizar ao concluir cada bloco com:
- ✅ Arquivos de teste criados
- 📊 Cobertura atual por módulo (functions%, lines%, branches%)
- 📝 Próximos arquivos a cobrir
- 🚫 Bloqueios encontrados

### 7. Thresholds São Progressivos

**Nunca travar o pipeline com thresholds irrealistas.**

Ajuste conforme a cobertura real cresce:

**Backend:**
| Fase | branches | functions | lines | Quando atingir |
|------|----------|-----------|-------|----------------|
| Atual | 3% | 3% | 4% | Estado atual |
| Fase 2 | 20% | 30% | 30% | Após mocks + faturamento |
| Fase 3 | 40% | 50% | 50% | Após guards + mensageria |
| Fase 4 | 60% | 70% | 70% | Após integrações |
| Meta final | 70% | 80% | 80% | Estável |

**Frontend:**
| Fase | branches | functions | lines | Quando atingir |
|------|----------|-----------|-------|----------------|
| Atual | 0.1% | 0.1% | 0.1% | Estado atual |
| Fase 2 | 30% | 40% | 40% | Após hooks críticos |
| Fase 3 | 50% | 60% | 60% | Após componentes puros |
| Fase 4 | 60% | 70% | 70% | Após formulários |
| Meta final | 70% | 80% | 80% | Estável |

### 8. Mocks com Contrato Real

Dependências externas usam mocks estruturados:
- ✅ Centralizados em `src/test/mocks/` (backend) ou `test/utils/` (frontend)
- ✅ Comentário `// @MOCK` em todos os métodos mockados
- ✅ Factory pattern para reset entre testes
- ❌ Sem chamadas reais em testes unitários

### 9. Janela Nova Quando Contexto > 70%

Use templates de retomada para recuperar contexto sem perder histórico.

Consulte: [templates/session-prompts.md](../templates/session-prompts.md)

### 10. Pendências Documentadas, Não Ignoradas

O que não pode ser testado agora vai para `TEST-PROGRESS.md` com:
- Motivo do bloqueio
- Critério para quando implementar
- Alternativas consideradas

---

## 🔄 Fluxo Padrão de uma Sessão

### Fase 1: PLAN

```
1. Ler TEST-PROGRESS.md
2. Ler regras operacionais
3. Apresentar resumo do estado atual
4. Propor lista de arquivos a criar
5. Identificar dependências e mocks necessários
6. Aguardar aprovação do usuário
```

### Fase 2: ACT (por blocos)

```
Para cada bloco:
  1. Implementar arquivo(s) de teste
  2. Rodar pnpm test -- [arquivo]
  3. Confirmar verde
  4. Aguardar aprovação
  5. Avançar para próximo bloco
```

### Fase 3: ENCERRAMENTO

```
1. Rodar pnpm test (todos)
2. Rodar pnpm test:cov
3. Atualizar TEST-PROGRESS.md com cobertura real
4. Gerar output de sessão (ver session-protocol.md)
5. Documentar próximos arquivos e bloqueios
```

---

## 📝 Padrões Técnicos Estabelecidos

### Localização dos Testes

```
# Backend — colocado junto ao arquivo
src/core/application/useCases/CreateAlunoUseCase.ts
src/core/application/useCases/CreateAlunoUseCase.spec.ts   ← aqui

# Frontend — colocado junto ao componente
src/components/Button/Button.tsx
src/components/Button/Button.test.tsx                       ← aqui
```

### Mocks Centralizados

**Backend:**
```
src/test/
├── mocks/
│   ├── prisma.mock.ts      ← PrismaClient mock
│   ├── aws.mock.ts         ← S3, SQS, SES
│   ├── keycloak.mock.ts    ← AuthGuard, token, request
│   └── event-emitter.mock.ts
└── setup.ts                ← setupFilesAfterEnv
```

**Frontend:**
```
test/
├── utils/
│   ├── providers.tsx       ← TestProviders
│   ├── router.ts           ← Mock router
│   ├── session.ts          ← Mock session
│   └── render.tsx          ← renderWithProviders
└── setupTests.ts           ← mocks globais
```

### Estrutura Obrigatória (AAA)

```typescript
it('descrição do comportamento esperado', async () => {
  // Arrange — prepara mocks e entradas
  mockRepo.findById.mockResolvedValue({ id: '1' })
  
  // Act — chama o método/componente
  const result = await useCase.execute({ id: '1' })
  
  // Assert — verifica resultado ou exceção
  expect(result).toMatchObject({ id: '1' })
})
```

### Limpeza Entre Testes

```typescript
// Backend (Jest)
afterEach(() => jest.clearAllMocks())

// Frontend (Vitest)
afterEach(() => vi.clearAllMocks())
```

---

## 🎯 Lições Aprendidas

### ✅ O Que Funciona

- **Plan antes de act** — evita mocks errados e retrabalho
- **Thresholds progressivos** — mantêm pipeline verde durante construção
- **Mocks centralizados** — eliminam boilerplate e inconsistência
- **Um módulo por vez** — garante testes coesos e fáceis de debugar
- **TEST-PROGRESS.md** — permite retomadas sem perda de contexto

### ❌ O Que Evitar

- **Threshold de 100% no início** — trava pipeline e desmotiva
- **getByTestId no frontend** — acopla teste à implementação
- **Mocks inline duplicados** — dificulta manutenção
- **Testar detalhes de implementação** — testes frágeis
- **Misturar unit e integration** — objetivos diferentes
- **Alterar configs sem aprovação** — pode quebrar CI

---

## 🚀 Comandos Rápidos

### Backend
```bash
# Todos os testes
pnpm --filter sm-iter-api test

# Arquivo específico
pnpm --filter sm-iter-api test -- CreateAlunoUseCase.spec.ts

# Watch mode
pnpm --filter sm-iter-api test:watch

# Cobertura
pnpm --filter sm-iter-api test:cov
```

### Frontend
```bash
# Todos os testes
pnpm --filter sm-iter-painel test

# Arquivo específico
pnpm --filter sm-iter-painel test -- string.test.ts

# UI mode
pnpm --filter sm-iter-painel test:ui

# Cobertura
pnpm --filter sm-iter-painel test:coverage
```

Mais comandos: [reference/commands.md](../reference/commands.md)

---

## 📚 Referências Rápidas

- [Regras Backend](../rules/backend.md)
- [Regras Frontend](../rules/frontend.md)
- [Guia Backend](./backend-implementation.md)
- [Guia Frontend](./frontend-implementation.md)
- [Templates de Sessão](../templates/session-prompts.md)
- [Protocolo de Output](../reference/session-protocol.md)
- [Padrões SOLID](../reference/patterns.md)

---

**Próximo passo:** Use os templates em [session-prompts.md](../templates/session-prompts.md) para iniciar ou retomar uma sessão.
