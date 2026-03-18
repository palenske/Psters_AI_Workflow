---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Backend](../guides/backend-implementation.md) | [Frontend](../guides/frontend-implementation.md)

# Referência de Comandos

Comandos úteis para execução de testes no monorepo sm-iter.

---

## 🔧 Backend (sm-iter-api)

### Comandos Básicos

```bash
# Rodar todos os testes
pnpm --filter sm-iter-api test

# Rodar arquivo específico
pnpm --filter sm-iter-api test -- CreateAlunoUseCase.spec.ts

# Rodar testes que contenham "Aluno" no nome
pnpm --filter sm-iter-api test -- --testNamePattern="Aluno"

# Rodar testes de um diretório específico
pnpm --filter sm-iter-api test -- src/core/application/useCases/
```

### Watch Mode

```bash
# Watch mode (re-executa ao salvar)
pnpm --filter sm-iter-api test:watch

# Watch apenas arquivo específico
pnpm --filter sm-iter-api test:watch -- CreateAlunoUseCase.spec.ts
```

### Cobertura

```bash
# Gerar relatório de cobertura
pnpm --filter sm-iter-api test:cov

# Cobertura com threshold específico
pnpm --filter sm-iter-api test:coverage

# Ver relatório HTML (após gerar cobertura)
open apps/sm-iter-api/coverage/lcov-report/index.html
```

### Opções Úteis

```bash
# Rodar apenas testes que falharam
pnpm --filter sm-iter-api test -- --onlyFailures

# Limpar cache do Jest
pnpm --filter sm-iter-api test -- --clearCache
```

---

## ⚛️ Frontend (sm-iter-painel)

### Comandos Básicos

```bash
# Rodar todos os testes
pnpm --filter sm-iter-painel test

# Rodar arquivo específico
pnpm --filter sm-iter-painel test -- string.test.ts

# Rodar testes que contenham "string" no nome
pnpm --filter sm-iter-painel test -- --grep="string"

# Rodar testes de um diretório específico
pnpm --filter sm-iter-painel test -- hooks/
```

### UI Mode (Interativo)

```bash
# UI mode (interface visual)
pnpm --filter sm-iter-painel test:ui

# UI mode com porta específica
pnpm --filter sm-iter-painel vitest --ui --port 5174
```

### Watch Mode

```bash
# Watch mode (implícito no Vitest)
pnpm --filter sm-iter-painel test

# Watch apenas arquivo específico
pnpm --filter sm-iter-painel test -- string.test.ts --watch
```

### Cobertura

```bash
# Gerar relatório de cobertura
pnpm --filter sm-iter-painel test:coverage

# Cobertura com threshold específico
pnpm --filter sm-iter-painel vitest run --coverage

# Ver relatório HTML (após gerar cobertura)
open apps/sm-iter-painel/coverage/index.html
```

### Opções Úteis

```bash
# Run mode (sem watch)
pnpm --filter sm-iter-painel vitest run

# Limpar cache do Vitest
pnpm --filter sm-iter-painel vitest --clearCache
```


---

## 📊 Análise de Cobertura

### Backend (Jest)

```bash
# Gerar cobertura
pnpm --filter sm-iter-api test:cov

# Arquivos gerados
apps/sm-iter-api/coverage/
├── lcov-report/
│   └── index.html          ← Abrir no navegador
├── lcov.info               ← Para CI/CD
└── coverage-final.json     ← JSON raw
```

### Frontend (Vitest)

```bash
# Gerar cobertura
pnpm --filter sm-iter-painel test:coverage

# Arquivos gerados
apps/sm-iter-painel/coverage/
├── index.html              ← Abrir no navegador
├── lcov.info               ← Para CI/CD
└── coverage-final.json     ← JSON raw
```

### Interpretar Relatório

```
Cobertura por tipo:
- Statements: Linhas de código executadas
- Branches: Condicionais (if/else) testadas
- Functions: Funções chamadas
- Lines: Linhas totais cobertas

Cores no relatório HTML:
- Verde: ≥ 80% de cobertura
- Amarelo: 50-79% de cobertura
- Vermelho: < 50% de cobertura
```


---

## 📝 Referência Rápida

### Jest (Backend)

| Comando | Descrição |
|---------|-----------|
| `pnpm test` | Rodar todos os testes |
| `pnpm test:watch` | Watch mode |
| `pnpm test:cov` | Cobertura |
| `pnpm test:debug` | Debug |
| `--testNamePattern="X"` | Filtrar por nome |
| `--onlyFailures` | Apenas falhas |
| `--clearCache` | Limpar cache |

### Vitest (Frontend)

| Comando | Descrição |
|---------|-----------|
| `pnpm test` | Rodar todos os testes |
| `pnpm test:ui` | UI mode |
| `pnpm test:coverage` | Cobertura |
| `vitest run` | Run mode (sem watch) |
| `--grep="X"` | Filtrar por nome |
| `--changed` | Apenas alterados |
| `--clearCache` | Limpar cache |

---

**Próximo passo:** Use estes comandos durante o desenvolvimento e debugging de testes.
