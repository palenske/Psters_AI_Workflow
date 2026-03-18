---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](../README.md) | [Workflow](../guides/workflow.md) | [Protocolo](../reference/session-protocol.md)

# Templates de Prompts de Sessão

Templates prontos para copiar e colar ao iniciar, retomar ou encerrar sessões de testes.

---

## 🚀 Retomada de Sessão — Backend {#retomada-backend}

```markdown
# RETOMADA DE SESSÃO DE TESTES — Backend (sm-iter-api)

## Contexto
- Framework: NestJS 10 + Prisma 5.6 + MySQL + Keycloak + AWS SQS
- Ferramenta: Jest 27 + ts-jest
- Cobertura atual: functions 3.88% / lines 4.17% / branches 3.51%
- Threshold: functions 3% / lines 4% / branches 3%

## Leitura Obrigatória (nesta ordem)
1. `apps/sm-iter-api/TEST-PROGRESS.md`
2. `.windsurf/testing/rules/backend.md`
3. `.windsurf/testing/reference/session-protocol.md`
4. `.windsurf/testing/guides/backend-implementation.md`

## Estado Atual
- ✅ 26 arquivos de teste criados (utils + use cases de alunos)
- ⚠️ Mocks centralizados ainda não existem em `src/test/mocks/`
- ❌ Módulos de faturamento sem cobertura (prioridade alta)

## Próxima Sessão
1. Criar infraestrutura de mocks em `src/test/mocks/` (prisma, aws, keycloak, event-emitter)
2. Implementar testes de use cases de faturamento:
   - CreateFaturaUseCase.spec.ts
   - CancelarFaturaUseCase.spec.ts
   - SendInvoiceEmailUseCase.spec.ts
   - GetFaturaByIdUseCase.spec.ts
3. Elevar threshold para branches: 20%, functions: 30%, lines: 30%

## Instruções
- Leia os arquivos acima
- Apresente resumo do estado atual
- Proponha plano com blocos claros
- Aguarde aprovação antes de implementar

## Regras Permanentes
- Plan antes de Act
- Um módulo por vez — verde antes de avançar
- Nunca altere `jest.config.js` sem aprovação
- Mocks sempre em `src/test/mocks/`
- Estrutura AAA obrigatória (Arrange/Act/Assert)
```

---

## 🚀 Retomada de Sessão — Frontend {#retomada-frontend}

```markdown
# RETOMADA DE SESSÃO DE TESTES — Frontend (sm-iter-painel)

## Contexto
- Framework: Next.js 14.2 + React 18.2 + TypeScript 5.5
- Ferramenta: Vitest 2.1 + Testing Library + jsdom
- Cobertura atual: functions 5.20% / lines 0.28% / branches 8.15%
- Threshold: 0.1% (temporário)

## Leitura Obrigatória (nesta ordem)
1. `apps/sm-iter-painel/TEST-PROGRESS.md`
2. `.windsurf/testing/rules/frontend.md`
3. `.windsurf/testing/reference/session-protocol.md`
4. `.windsurf/testing/guides/frontend-implementation.md`

## Estado Atual
- ✅ 3 arquivos de teste criados (lib/string, hooks/useIntegration, hooks/useFetch)
- ✅ Setup de testes configurado (ResizeObserver, matchMedia, etc.)
- ⚠️ Providers reais sendo usados — mockar quando necessário
- ⚠️ ~150 avisos de lint pendentes

## Próxima Sessão
1. Cobrir hooks críticos restantes:
   - useDashboardData.test.ts
   - useDebounce.test.ts
   - useTable.test.ts
   - useDashboardAdminData.test.ts (se necessário)
2. Cobrir componentes puros:
   - AutoColoredTag.test.tsx
   - StatusDisplay.test.tsx
3. Criar mocks de APIs/providers conforme necessário

## Instruções
- Leia os arquivos acima
- Apresente resumo do estado atual
- Proponha plano com blocos claros
- Aguarde aprovação antes de implementar

## Regras Permanentes
- Plan antes de Act
- Um hook/componente por vez — verde antes de avançar
- Nunca use `getByTestId` — queries semânticas sempre
- Nunca altere `vitest.config.ts` sem aprovação
- Use `renderWithProviders` e `renderHookWithProviders`
```

---

## 📊 Checkpoint de Cobertura {#checkpoint}

```markdown
# CHECKPOINT DE COBERTURA — [Backend | Frontend]

## Objetivo
Auditar estado atual dos testes sem implementar nada novo.

## Instruções
1. Leia `TEST-PROGRESS.md` do projeto alvo
2. Execute `pnpm test:cov` (ou `pnpm test:coverage`)
3. Analise relatório por módulo/diretório

## Reporte
Para cada módulo, classifique:
- ✅ Cobertura adequada (≥ meta atual)
- ⚠️ Cobertura parcial (abaixo da meta, mas com testes)
- ❌ Sem cobertura (zero testes)
- 📋 Bloqueios conhecidos (mock complexo, dependência circular)

## Output Esperado

### Cobertura Global
- Functions: X%
- Lines: X%
- Branches: X%

### Por Módulo
- shared/utils: ✅ 85% / ⚠️ 60% / ❌ 0%
- core/useCases/alunos: ✅ 74%
- core/useCases/faturamento: ❌ 0%

### Threshold Atual
- Configurado: functions X% / lines X% / branches X%
- Status: ✅ Passando / ❌ Bloqueando pipeline

### Recomendações
1. [Prioridade 1]
2. [Prioridade 2]
3. [Prioridade 3]

### Ajuste de Threshold
- Necessário? Sim/Não
- Justificativa: [se sim]

⚠️ NÃO implemente nada. Apenas audite e reporte.
```

---

## 🏁 Encerramento de Sessão {#encerramento}

```markdown
# ENCERRAMENTO DE SESSÃO DE TESTES

## Validação
- [ ] `pnpm test` verde (zero falhas)
- [ ] `pnpm test:cov` executado
- [ ] TEST-PROGRESS.md atualizado com cobertura real
- [ ] Próximos arquivos documentados
- [ ] Bloqueios registrados

## Gerar Output de Sessão

Siga o formato em `.windsurf/testing/reference/session-protocol.md`:

### STATUS
✅ Verde / ⚠️ Parcial / ❌ Quebrado

### ARQUIVOS CRIADOS
- src/.../NomeDoArquivo.spec.ts
  Cobre: [o que testa]
  Casos: [happy path | erro X | edge case Y]

### COBERTURA ATUAL
| Módulo | Functions | Lines | Branches |
|--------|-----------|-------|----------|
| [módulo] | X% | X% | X% |
| GLOBAL | X% | X% | X% |

### DECISÕES
1. [decisão] — [justificativa]

### BLOQUEIOS
| Módulo | Motivo | O que precisa |
|--------|--------|---------------|
| ... | ... | ... |

### PRÓXIMA SESSÃO
1. [arquivo] — [contexto]
2. [arquivo] — [contexto]

⚠️ NÃO implemente nada novo. Apenas valide e documente.
```


---

## 🔧 Criar Mock Centralizado

```markdown
# CRIAR MOCK CENTRALIZADO — [Nome do Serviço/Dependência]

## Contexto
- Projeto: [Backend | Frontend]
- Dependência: [nome da lib/serviço]
- Motivo: [duplicação em múltiplos testes | nova dependência]

## Localização
- Backend: `apps/sm-iter-api/src/test/mocks/[nome].mock.ts`
- Frontend: `apps/sm-iter-painel/test/utils/[nome].ts`

## Requisitos
1. Mockar todos os métodos públicos relevantes
2. Adicionar comentário `// @MOCK` em cada método mockado
3. Exportar função factory `create[Nome]Mock()` para reset entre testes
4. Incluir tipos TypeScript completos
5. Documentar uso no topo do arquivo

## Após Criação
1. Atualizar README.md do diretório de mocks
2. Refatorar testes existentes que usam mocks inline
3. Rodar `pnpm test` para confirmar que nada quebrou
```

---

## 🧪 Implementar Teste Específico

```markdown
# IMPLEMENTAR TESTE — [Nome do Arquivo]

## Alvo
- Arquivo: `[caminho completo]`
- Tipo: [Use Case | Hook | Componente | Util | Guard | Service]
- Prioridade: [Alta | Média | Baixa]

## Dependências
- Mocks necessários: [lista]
- Providers necessários: [lista para frontend]
- Setup especial: [se houver]

## Casos de Teste Obrigatórios
1. **Happy path** — comportamento esperado com entrada válida
2. **Validações** — campos obrigatórios, formatos inválidos
3. **Edge cases** — null, undefined, arrays vazios, strings vazias
4. **Erros** — exceções esperadas (NotFoundException, etc.)
5. **Side effects** — chamadas a repositórios, eventos emitidos

## Checklist Pós-Implementação
- [ ] Todos os casos cobertos
- [ ] Estrutura AAA seguida
- [ ] Mocks centralizados usados (não inline)
- [ ] `pnpm test -- [arquivo]` verde
- [ ] Cobertura do arquivo ≥ 80%
- [ ] Nenhum `console.log` ou código de debug
```

---

**Uso:** Copie o template relevante, preencha os campos marcados com `[...]` e cole no chat do Windsurf.
