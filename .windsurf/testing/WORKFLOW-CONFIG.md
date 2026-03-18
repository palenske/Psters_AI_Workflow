---
Documentação de Testes — sm-iter Monorepo
Última atualização: 2026-03-04
Windsurf + GPT-5.1 Codex
---

> 📖 **Navegação:** [Índice Principal](./README.md) | [Regras Backend](./rules/backend.md) | [Regras Frontend](./rules/frontend.md)

# Workflow Automático de Testes - sm-iter

Configuração do workflow automático para implementação contínua de testes unitários no monorepo sm-iter.

---

## 🚀 Entrada do Desenvolvedor

O desenvolvedor inicia uma sessão colando no chat do Windsurf (modo Plan):

```
Retomar testes — Backend
```

ou

```
Retomar testes — Frontend
```

---

## 🔄 Fases Automáticas da LLM

### Fase 1: Preparação Automática

**A LLM executa automaticamente:**

1. **Leitura obrigatória (nesta ordem):**
   - `apps/sm-iter-[api|painel]/TEST-PROGRESS.md` — Estado atual real do projeto
   - `.windsurf/testing/rules/[backend|frontend].md` — Regras operacionais
   - `.windsurf/testing/guides/[backend|frontend]-implementation.md` — Padrões técnicos

2. **Análise do progresso:**
   - Cobertura atual (functions%, lines%, branches%)
   - Último arquivo criado
   - Bloqueios ativos
   - Próximos arquivos planejados

3. **Apresentação ao desenvolvedor:**
   ```
   📊 Estado Atual dos Testes — [Backend|Frontend]
   
   Cobertura:
   - Functions: X%
   - Lines: X%
   - Branches: X%
   
   Último arquivo: [nome]
   Status: ✅ Verde / ⚠️ Parcial / ❌ Bloqueado
   
   Bloqueios: [lista ou "nenhum"]
   
   Próximos arquivos sugeridos (baseado em TEST-PROGRESS.md):
   1. [arquivo] — [contexto]
   2. [arquivo] — [contexto]
   3. [arquivo] — [contexto]
   ```

4. **Pergunta ao desenvolvedor:**
   ```
   Qual módulo/diretório/arquivo você quer testar nesta sessão?
   
   Opções:
   - Seguir a ordem sugerida acima
   - Especificar outro caminho/módulo
   - Criar mocks primeiro (se necessário)
   ```

### Fase 2: Seleção de Alvo

**O desenvolvedor responde com:**
- "Seguir ordem sugerida"
- "Testar [caminho/módulo/arquivo específico]"
- "Criar mocks de [X]"

### Fase 3: Planejamento

**A LLM cria um plano detalhado:**

```
📝 Plano de Implementação

Bloco 1: [Mocks/Setup] (se necessário)
  - Criar/atualizar src/test/mocks/[arquivo].ts
  - Validar com pnpm test
  ✅ Aguardar aprovação

Bloco 2: [Arquivo 1]
  - Implementar [caminho]/[arquivo].spec.ts
  - Casos: [lista de cenários]
  - Validar com pnpm test -- [arquivo]
  ✅ Aguardar aprovação

Bloco 3: [Arquivo 2]
  - Implementar [caminho]/[arquivo].spec.ts
  - Casos: [lista de cenários]
  - Validar com pnpm test -- [arquivo]
  ✅ Aguardar aprovação

Estimativa: [N] arquivos nesta sessão
```

**Aguarda aprovação explícita do desenvolvedor.**

### Fase 4: Implementação Contínua

**A LLM executa em loop:**

```
Para cada bloco:
  1. Implementar arquivo de teste
  2. Rodar pnpm test -- [arquivo]
  3. Apresentar resultado:
     ✅ Verde — [N] testes passando
     ❌ Falhou — [erro]
  4. Se verde:
     - Apresentar resumo rápido
     - Perguntar: "Continuar para próximo bloco?"
  5. Se falhou:
     - Analisar erro
     - Corrigir
     - Revalidar
  6. Aguardar confirmação
  7. Avançar para próximo bloco
```

**Formato de feedback contínuo:**
```
✅ [Arquivo].spec.ts — VERDE
   Casos cobertos:
   - [cenário 1]
   - [cenário 2]
   - [cenário 3]
   
   Testes: [N] passando
   
Próximo: [nome do próximo arquivo]
Continuar? (aguardando confirmação)
```

### Fase 5: Checkpoints Intermediários

**Gatilhos para checkpoint:**
- A cada 3-5 arquivos criados
- Antes de mudar de módulo
- Quando solicitado pelo desenvolvedor ("checkpoint" ou "status")
- Se detectar perda de contexto

**Ação da LLM:**
```
🔍 Checkpoint Intermediário

Arquivos criados neste bloco:
- [arquivo 1] — ✅ Verde
- [arquivo 2] — ✅ Verde
- [arquivo 3] — ✅ Verde

Testes: ✅ Todos verdes
Próximo módulo: [nome]

Continuar ou fazer pausa?
```

### Fase 6: Encerramento de Sessão

**Gatilhos de encerramento:**
- Desenvolvedor diz: "encerra", "fecha", "até amanhã", "por hoje é isso"
- Bloqueio sem resolução após 2 tentativas
- Solicitação de status final
- Contexto > 70% preenchido

**Procedimento automático da LLM:**

1. **Parar implementação imediatamente**

2. **Executar validações:**
   ```bash
   # Backend
   pnpm --filter sm-iter-api test
   pnpm --filter sm-iter-api test:cov
   
   # Frontend
   pnpm --filter sm-iter-painel test -- --run
   pnpm --filter sm-iter-painel test:coverage
   ```

3. **Atualizar TEST-PROGRESS.md** com dados reais

4. **Gerar Output de Sessão** (formato do session-protocol.md):
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   OUTPUT DE SESSÃO — [Backend|Frontend]
   Data: DD/MM/AAAA | Sessão: #N
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   STATUS: ✅/⚠️/❌
   
   ARQUIVOS CRIADOS: [lista]
   COBERTURA ATUAL: [tabela com valores reais]
   MOCKS: [novos ou alterados]
   DECISÕES: [importantes]
   BLOQUEIOS: [ativos]
   PRÓXIMA SESSÃO: [prioridades]
   
   PROMPT DE RETOMADA: [bloco completo para próxima sessão]
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

5. **Aguardar confirmação** do desenvolvedor

---

## 🎯 REGRAS CRÍTICAS

### ⚠️ Exemplos são Ilustrativos

**IMPORTANTE:** As menções de funções e arquivos nas regras e guias são **ILUSTRATIVOS e EXEMPLOS**.

**A LLM DEVE:**
- ✅ Usar exemplos como **referência de padrão**
- ✅ Aplicar os padrões ao **código REAL do projeto**
- ✅ Consultar `TEST-PROGRESS.md` para saber o **estado real**
- ✅ Listar arquivos reais do projeto (via grep/find)
- ✅ Adaptar templates aos nomes e estruturas reais

**A LLM NÃO DEVE:**
- ❌ Copiar literalmente os exemplos das regras
- ❌ Criar testes para funções que não existem
- ❌ Assumir estrutura sem verificar o código real
- ❌ Propor arquivos sem confirmar que o código-fonte existe

### 📋 Auditoria de Progresso Obrigatória

**Antes de propor qualquer arquivo:**

1. Ler `TEST-PROGRESS.md` completamente
2. Verificar se o arquivo de teste já existe
3. Verificar se há bloqueios documentados
4. Confirmar que o código-fonte existe (via grep/find)
5. Verificar dependências e mocks necessários

**Nunca assumir, sempre verificar.**

### 🔄 Ritmo de Trabalho

**Um arquivo por vez:**
- Implementar
- Validar (rodar teste)
- Confirmar verde
- Apresentar resumo
- Aguardar confirmação
- Avançar

**Nunca:**
- Implementar múltiplos arquivos sem validação intermediária
- Avançar com testes quebrando
- Assumir que está tudo certo sem rodar comandos
- Pular a etapa de aprovação

### 💬 Comunicação Clara

**Formato de feedback padronizado:**

```
✅ [Arquivo].spec.ts — VERDE
   Casos cobertos:
   - [cenário 1]
   - [cenário 2]
   - [cenário 3]
   
   Testes: [N] passando
   
Próximo: [arquivo]
Continuar? (aguardando confirmação)
```

**Formato de erro:**

```
❌ [Arquivo].spec.ts — FALHOU
   Erro: [mensagem do erro]
   
   Analisando...
   [análise do problema]
   
   Corrigindo...
```

---

## 📁 Estrutura de Arquivos Importantes

### Backend (sm-iter-api)

```
apps/sm-iter-api/
├── TEST-PROGRESS.md              ← Fonte de verdade (ler primeiro)
├── RETOMADA.md                   ← Prompt de retomada completo
├── PROMPT-RAPIDO.md              ← Prompt de retomada rápida
├── src/
│   ├── test/
│   │   ├── mocks/                ← Mocks centralizados
│   │   │   ├── prisma.mock.ts
│   │   │   ├── aws.mock.ts
│   │   │   ├── keycloak.mock.ts
│   │   │   └── event-emitter.mock.ts
│   │   └── setup.ts              ← Setup global
│   ├── shared/utils/             ← Utils (começar aqui)
│   └── core/
│       ├── application/
│       │   ├── useCases/         ← Use cases (prioridade)
│       │   ├── services/
│       │   └── providers/
│       └── domain/
└── jest.config.js                ← Não alterar sem aprovação
```

### Frontend (sm-iter-painel)

```
apps/sm-iter-painel/
├── TEST-PROGRESS.md              ← Fonte de verdade (ler primeiro)
├── RETOMADA.md                   ← Prompt de retomada completo
├── PROMPT-RAPIDO.md              ← Prompt de retomada rápida
├── test/
│   ├── utils/                    ← Helpers de teste
│   │   ├── providers.tsx
│   │   ├── router.ts
│   │   ├── session.ts
│   │   └── render.tsx
│   └── setupTests.ts             ← Mocks globais
├── lib/                          ← Utils (começar aqui)
├── hooks/                        ← Hooks customizados (prioridade)
├── components/                   ← Componentes
└── vitest.config.ts              ← Não alterar sem aprovação
```

---

## 🚀 Comandos de Referência

### Backend

```bash
# Rodar todos os testes
pnpm --filter sm-iter-api test

# Rodar arquivo específico
pnpm --filter sm-iter-api test -- [arquivo].spec.ts

# Cobertura (valores reais)
pnpm --filter sm-iter-api test:cov

# Watch mode (desenvolvimento)
pnpm --filter sm-iter-api test:watch
```

### Frontend

```bash
# Rodar todos os testes
pnpm --filter sm-iter-painel test -- --run

# Rodar arquivo específico
pnpm --filter sm-iter-painel test -- --run [arquivo].test.ts

# Cobertura (valores reais)
pnpm --filter sm-iter-painel test:coverage

# UI mode (interativo)
pnpm --filter sm-iter-painel test:ui
```

---

## ✅ Checklist de Sessão

### Início
- [ ] LLM leu TEST-PROGRESS.md
- [ ] LLM leu regras operacionais
- [ ] LLM apresentou resumo do estado
- [ ] Desenvolvedor apontou o alvo
- [ ] LLM propôs plano detalhado
- [ ] Desenvolvedor aprovou o plano

### Durante
- [ ] Um arquivo por vez
- [ ] Teste rodado após cada arquivo
- [ ] Verde confirmado antes de avançar
- [ ] Feedback claro apresentado
- [ ] Confirmação aguardada

### Fim
- [ ] Todos os testes rodados
- [ ] Cobertura coletada (valores reais)
- [ ] TEST-PROGRESS.md atualizado
- [ ] Output de sessão gerado
- [ ] Próximos passos documentados

---

## 🎯 Vantagens Deste Workflow

1. **Contexto Preservado:** TEST-PROGRESS.md mantém histórico entre sessões
2. **Feedback Contínuo:** Desenvolvedor vê progresso em tempo real
3. **Flexível:** Pode seguir ordem sugerida ou escolher alvos específicos
4. **Seguro:** Verde antes de avançar, sem quebrar pipeline
5. **Documentado:** Output de sessão permite retomada perfeita
6. **Eficiente:** LLM conduz o processo, desenvolvedor apenas orienta

---

**Uso:** Este workflow é ativado automaticamente quando o desenvolvedor cola o prompt de retomada rápida no chat do Windsurf.
