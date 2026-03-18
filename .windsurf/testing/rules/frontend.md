---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Guia de Implementação](../guides/frontend-implementation.md) | [Workflow](../guides/workflow.md)

# Regras Operacionais — Frontend (sm-iter-painel)

Regras permanentes para sessões de implementação de testes unitários no frontend Next.js + React.

---

## 📋 Leitura Obrigatória ao Iniciar Qualquer Sessão

Antes de qualquer ação no painel, leia os arquivos abaixo **nesta ordem exata**.
Não implemente nada, não sugira código, não faça perguntas até concluir a leitura.

```
1. apps/sm-iter-painel/TEST-PROGRESS.md             ← cobertura atual, roadmap, bloqueios
2. .windsurf/testing/rules/frontend.md              ← este arquivo (fluxo + restrições)
3. .windsurf/testing/reference/session-protocol.md  ← contrato de comunicação e formato de output
4. .windsurf/testing/guides/workflow.md             ← regras de processo, plan/act, thresholds
5. .windsurf/testing/guides/frontend-implementation.md ← padrões técnicos, ordem de prioridades
```

Após a leitura, apresente ao usuário:
- Cobertura atual (functions%, lines%, branches%) conforme TEST-PROGRESS.md
- Status da última sessão e últimos arquivos tocados
- Próximos arquivos planejados
- Bloqueios ativos (se houver)

**Aguarde instrução explícita antes de executar qualquer modificação.**

---

## 🎯 Plan Antes de Act

- Sempre elabore um plano com blocos claros antes de mudar qualquer arquivo.
- O plano precisa listar: arquivos de teste, mocks necessários, utilitários tocados e ordem de execução.
- Nenhum código é alterado antes do plano ser aprovado pelo usuário.

---

## 🔄 Execução em Blocos (Um Domínio por Vez)

```
Bloco 1 — Mocks/setup
  └── Atualizar test/setupTests.ts, test/utils/*, vitest.config.ts (se aprovado)
  └── Rodar pnpm vitest run [arquivo] → confirmar verde → aguardar aprovação

Bloco 2 — Utils/helpers
  └── Implementar suites de lib/*, utils/*
  └── Rodar pnpm vitest run lib/*.test.ts → confirmar verde → aguardar aprovação

Bloco N — Hook ou componente alvo
  └── Um hook/componente por vez
  └── Rodar pnpm vitest run [caminho].test.ts após cada arquivo
  └── Verde antes de avançar para o próximo
```

---

## ⚙️ Regras Permanentes (Frontend)

### Comportamento Geral
- ❌ Nunca iniciar implementação sem aprovação explícita
- ❌ Nunca alterar `vitest.config.ts`, `tsconfig.json` ou scripts de package sem autorização
- ❌ Nunca usar `getByTestId` — sempre queries semânticas (`getByRole`, `getByLabelText`, etc.)
- ❌ Nunca fazer chamadas HTTP reais; use mocks (`vi.mock`, MSW) ou utilitários centralizados
- ✅ Um arquivo de teste por vez — garantir verde antes de avançar para outro módulo

### Mocks & Providers
- ✅ Mocks compartilhados residem em `apps/sm-iter-painel/test/utils/` (providers, router, session, auth, etc.)
- ✅ Todo mock de módulo deve estar documentado com comentário `// @MOCK` quando aplicável
- ❌ Evitar duplicar mocks inline; se não existir utilitário, criar em `test/utils/` antes

### Thresholds
- 🎯 Meta final: `branches ≥ 70%`, `functions ≥ 80%`, `lines ≥ 80%` (Vitest + jsdom)
- ❌ Nunca elevar thresholds acima da cobertura real
- ❌ Nunca reduzir sem registrar justificativa no output da sessão
- ✅ Pipeline (CI) não deve quebrar por metas irreais — ajustar progressivamente

### Estrutura
- ✅ Arquivo de teste sempre ao lado do arquivo alvo (`Button.tsx` ↔ `Button.test.tsx`)
- ✅ Estrutura AAA obrigatória: Arrange / Act / Assert com asserts de comportamento
- ✅ Hooks testados com `renderHookWithProviders`
- ✅ Componentes com `renderWithProviders` e queries acessíveis

---

## 🏁 Encerramento de Sessão

Quando o usuário sinalizar término:
- "encerra", "por hoje", "até amanhã"
- Bloqueio após 2 tentativas
- Solicitação de status
- Janela > 70% preenchida

**Execute:**
1. Interrompa qualquer implementação
2. Rode `pnpm vitest run` (ou `pnpm test` se configurado) — registre o resultado
3. Rode `pnpm test:coverage` — colete números reais
4. Atualize `apps/sm-iter-painel/TEST-PROGRESS.md` com cobertura, arquivos criados, próximos passos e bloqueios
5. Gere o Output de Sessão seguindo [session-protocol.md](../reference/session-protocol.md)
6. Aguarde confirmação do usuário antes de finalizar

> ⚠️ **Nunca estime cobertura**; reporte apenas valores reais do `pnpm test:coverage`.
> ⚠️ Se qualquer teste falhar, o status deve ser ❌ no output.

---

## 🗺️ Mapa dos Arquivos de Referência

| Arquivo | Propósito | Quando usar |
|---------|-----------|-------------|
| `apps/sm-iter-painel/TEST-PROGRESS.md` | Estado vivo (cobertura, roadmap, bloqueios) | Início e fim de toda sessão |
| `reference/session-protocol.md` | Formato do output e retomada | Início/fim ou checkpoints |
| `guides/frontend-implementation.md` | Padrões técnicos, ordem de prioridade | Ao planejar cada módulo |
| `guides/workflow.md` | Regras de fluxo, plan/act, thresholds | Ao decidir processos |

---

## 📁 Localização dos Arquivos no Projeto

```
apps/sm-iter-painel/
├── TEST-PROGRESS.md             ← atualizar em toda sessão
├── vitest.config.ts             ← ambiente jsdom + thresholds (não alterar sem ok)
├── test/
│   ├── setupTests.ts            ← mocks globais (ResizeObserver, matchMedia, etc.)
│   └── utils/
│       ├── providers.tsx        ← TestProviders com Auth/Customization/Produtos
│       ├── router.ts            ← createMockRouter / resetRouterMocks
│       ├── session.ts           ← builders de sessão/useSession
│       └── render.tsx           ← renderWithProviders / renderHookWithProviders
└── hooks/, components/, lib/    ← arquivos alvo (tests lado a lado)

.windsurf/testing/
├── README.md                    ← índice principal
├── rules/
│   └── frontend.md              ← este arquivo
├── guides/
│   ├── frontend-implementation.md
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

- **Framework:** Next.js 14.2 + React 18.2 + TypeScript 5.5
- **Estado:** Context API + SWR para data-fetching
- **UI:** Ant Design 5.8 + styled-components
- **Formulários:** React Hook Form 7.43 + Yup
- **Testes:** Vitest 2.1 + @testing-library/react + jsdom
- **Cobertura atual:** ~5% (em expansão)

---

## ✅ Checklist de Sessão

### Início
- [ ] Ler TEST-PROGRESS.md
- [ ] Ler este arquivo (rules/frontend.md)
- [ ] Apresentar resumo do estado atual
- [ ] Propor plano com blocos claros
- [ ] Aguardar aprovação

### Durante
- [ ] Implementar um hook/componente por vez
- [ ] Rodar testes após cada arquivo
- [ ] Confirmar verde antes de avançar
- [ ] Usar queries semânticas (nunca getByTestId)
- [ ] Seguir estrutura AAA

### Fim
- [ ] Rodar `pnpm test` — confirmar verde
- [ ] Rodar `pnpm test:coverage` — coletar números reais
- [ ] Atualizar TEST-PROGRESS.md
- [ ] Gerar output de sessão
- [ ] Documentar bloqueios e próximos passos

---

**Lembre-se:** Plan → Act → Test → Update → Repeat
