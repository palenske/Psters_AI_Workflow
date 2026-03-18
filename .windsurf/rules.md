# Regras Gerais do Projeto — sm-iter Monorepo

> **Ativação:** Estas regras são aplicadas automaticamente pelo Windsurf em todo o workspace.
> **Escopo:** Todos os projetos do monorepo (api, painel, integrations)

---

## 🎯 Princípios Fundamentais

### 1. Monorepo com pnpm Workspaces
- Sempre use `pnpm --filter [package]` para comandos específicos
- Nunca rode comandos na raiz sem filtro
- Respeite as dependências entre pacotes

### 2. TypeScript Strict Mode
- Todos os projetos usam TypeScript strict
- Nunca use `any` sem justificativa explícita
- Sempre tipar retornos de funções

### 3. Commits Semânticos
- Formato: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`
- Scope: `api`, `painel`, `integrations`, `docs`

---

## 🧪 Regras de Testes

### Ativação de Regras Específicas
Quando trabalhar com testes, as seguintes regras são ativadas:

**Backend (sm-iter-api):**
- `.windsurf/testing/rules/backend.md` — Regras operacionais de testes
- Ativação: Ao trabalhar em arquivos `.spec.ts` ou em `src/test/`

**Frontend (sm-iter-painel):**
- `.windsurf/testing/rules/frontend.md` — Regras operacionais de testes
- Ativação: Ao trabalhar em arquivos `.test.ts`, `.test.tsx` ou em `test/`

### Hierarquia de Regras
1. **Regras gerais** (este arquivo) — Sempre ativas
2. **Regras de testes** (`.windsurf/testing/rules/`) — Ativas em contexto de testes
3. **Regras de projeto** — Específicas de cada app

---

## 📋 Regras de Código

### Nomenclatura
- **Arquivos:** PascalCase para componentes/classes, camelCase para utils
- **Variáveis:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Interfaces:** Prefixo `I` (ex: `IUserRepository`)
- **Types:** PascalCase sem prefixo

### Estrutura de Arquivos
- Colocação (colocation): Arquivos relacionados juntos
- Testes ao lado do arquivo testado
- Barrel exports (`index.ts`) quando necessário

### Imports
- Sempre use path aliases (`@/...`)
- Organize: externos → internos → relativos
- Remova imports não utilizados

---

## 🚫 Proibições

### Nunca Fazer
- ❌ Commitar código com `console.log` (exceto em utils de log)
- ❌ Usar `any` sem comentário explicativo
- ❌ Deixar TODOs sem issue/ticket associado
- ❌ Alterar configs sem aprovação (jest, vitest, tsconfig, etc.)
- ❌ Fazer chamadas diretas a APIs em testes unitários
- ❌ Usar `getByTestId` em testes de frontend

### Sempre Fazer
- ✅ Rodar testes antes de commitar
- ✅ Atualizar documentação quando mudar comportamento
- ✅ Seguir padrões estabelecidos no projeto
- ✅ Pedir aprovação para mudanças estruturais

---

## 🔄 Workflow de Desenvolvimento

### 1. Antes de Começar
- Ler documentação relevante
- Entender o contexto do que será alterado
- Propor plano antes de implementar

### 2. Durante Desenvolvimento
- Commits pequenos e frequentes
- Testes passando a cada mudança
- Seguir padrões do projeto

### 3. Antes de Finalizar
- Rodar todos os testes
- Verificar lint
- Atualizar documentação
- Revisar mudanças

---

## 📚 Documentação do Projeto

### Estrutura
```
.windsurf/
├── rules.md                           ← Este arquivo (regras gerais)
├── testing/                           ← Documentação de testes
│   ├── README.md                      ← Índice de testes
│   ├── rules/                         ← Regras específicas de testes
│   ├── guides/                        ← Guias de implementação
│   ├── templates/                     ← Templates reutilizáveis
│   └── reference/                     ← Referência rápida
└── (outras regras conforme necessário)

apps/sm-iter-api/
├── RETOMADA.md                        ← Prompt de retomada backend
└── TEST-PROGRESS.md                   ← Estado dos testes

apps/sm-iter-painel/
├── RETOMADA.md                        ← Prompt de retomada frontend
└── TEST-PROGRESS.md                   ← Estado dos testes
```

### Quando Consultar

| Situação | Documentação |
|----------|--------------|
| Regras gerais do projeto | `.windsurf/rules.md` (este arquivo) |
| Trabalhar com testes backend | `.windsurf/testing/rules/backend.md` |
| Trabalhar com testes frontend | `.windsurf/testing/rules/frontend.md` |
| Retomar sessão de testes | `apps/*/RETOMADA.md` |
| Ver estado atual dos testes | `apps/*/TEST-PROGRESS.md` |

---

## 🎯 Contexto de Ativação das Regras

### Regras Sempre Ativas
- ✅ Este arquivo (`.windsurf/rules.md`)
- ✅ Princípios fundamentais
- ✅ Nomenclatura e estrutura
- ✅ Proibições gerais

### Regras Ativadas por Contexto

**Ao trabalhar com testes:**
- Arquivo termina com `.spec.ts`, `.test.ts`, `.test.tsx`
- Diretório contém `test/` ou `__tests__/`
- Arquivo `RETOMADA.md` ou `TEST-PROGRESS.md` aberto

**Regras ativadas:**
- `.windsurf/testing/rules/backend.md` (se backend)
- `.windsurf/testing/rules/frontend.md` (se frontend)
- Todas as regras de `.windsurf/testing/`

**Ao trabalhar com API:**
- Diretório `apps/sm-iter-api/`
- Regras específicas de NestJS, Prisma, Keycloak

**Ao trabalhar com Frontend:**
- Diretório `apps/sm-iter-painel/`
- Regras específicas de Next.js, React, Ant Design

---

## 🔍 Como o Windsurf Aplica as Regras

1. **Regras Globais** — Sempre lidas ao iniciar workspace
2. **Regras de Contexto** — Lidas quando arquivos relevantes são abertos
3. **Prompts de Retomada** — Lidos quando explicitamente colados no chat
4. **Hierarquia** — Regras específicas sobrescrevem regras gerais

---

## ✅ Checklist de Conformidade

Antes de finalizar qualquer tarefa:

- [ ] Código segue nomenclatura padrão
- [ ] Imports organizados e sem não-utilizados
- [ ] Testes passando
- [ ] Sem `console.log` ou código de debug
- [ ] Documentação atualizada (se necessário)
- [ ] Commits semânticos
- [ ] Regras específicas do contexto seguidas

---

**Última atualização:** 2026-03-04
**Mantido por:** Equipe sm-iter
