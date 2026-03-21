# Adaptação de Agentes para Trae

Este documento explica as diferenças entre o sistema de agentes do Cursor e do Trae, e como adaptar os workflows corretamente.

---

## Problema

O plugin original foi desenvolvido para **Cursor**, que possui uma ferramenta chamada **Task** para invocar subagentes com `subagent_type: generalPurpose`. O **Trae não possui essa ferramenta**.

### Erro Típico

```
Não consigo executar o /pwf-plan agora porque o fluxo exige rodar os agentes via Task tool (subagent_type: generalPurpose), e essa ferramenta não está disponível neste ambiente.
```

---

## Diferenças entre Cursor e Trae

| Aspecto | Cursor | Trae |
|---------|--------|----------|
| **Ferramenta de subagentes** | `Task` tool com `subagent_type: generalPurpose` | `skill` tool |
| **Invocação paralela** | Suportada nativamente via Task | Suportada via múltiplas chamadas de ferramentas |
| **Hooks de editor** | `hooks.json` com scripts `.mjs` | `extensions.json` com hook points limitados |
| **Eventos de edição** | `afterFileEdit`, `stop`, `beforeShellExecution`, etc. | Apenas hook points de workflow |

---

## Solução: Adaptação para Trae

### 1. **Substituir Task tool por abordagem direta**

**Cursor (original):**
```markdown
Spawn agents in parallel via Task tool (`subagent_type: generalPurpose`):
- repo-research-analyst
- learnings-researcher
```

**Trae (adaptado):**
```markdown
Execute research agents directly (Trae does not use Task tool):
- Read and execute `agents/research/repo-research-analyst.md` instructions
- Read and execute `agents/research/learnings-researcher.md` instructions

You can execute these in parallel by calling multiple tools simultaneously.
```

### 2. **Abordagem de Invocação de Agentes no Trae**

O Trae permite invocar agentes de duas formas:

#### Opção A: Execução Direta (Recomendada)
O agente principal lê o arquivo do agente especializado e executa suas instruções diretamente:

```markdown
1. Read `agents/research/repo-research-analyst.md`
2. Execute the agent's instructions with the given context
3. Consolidate findings
```

**Vantagens:**
- Não depende de ferramentas específicas
- Funciona em qualquer ambiente
- Mantém controle total do fluxo

**Desvantagens:**
- Menos isolamento entre agentes
- Contexto compartilhado pode crescer

#### Opção B: Skill Tool (Quando Aplicável)
Para agentes que foram convertidos em skills:

```markdown
Use the skill tool to invoke:
- skill: orchestrating-multi-agents
- skill: systematic-debugging
```

**Vantagens:**
- Isolamento de contexto
- Reutilização de lógica complexa

**Desvantagens:**
- Requer conversão prévia de agentes em skills
- Nem todos os agentes podem ser skills

### 3. **Paralelização no Trae**

O Trae suporta chamadas paralelas de ferramentas. Para executar múltiplos agentes em paralelo:

```markdown
Execute the following agents simultaneously by reading their files:
1. `agents/research/repo-research-analyst.md`
2. `agents/research/learnings-researcher.md`
3. `agents/workflow/spec-flow-analyzer.md`

Read all three files in parallel, then execute their instructions with the provided context.
```

---

## Padrão de Adaptação

### Template Original (Cursor)

```markdown
### Round 1 — Always (spawn all in parallel via Task tool, `subagent_type: generalPurpose`):

- **repo-research-analyst** — maps file paths, services, DTOs
- **learnings-researcher** — surfaces relevant solutions
- **spec-flow-analyzer** — finds missing flows, edge cases
```

### Template Adaptado (Trae)

```markdown
### Round 1 — Always (execute all research agents):

Execute the following agents by reading and applying their instructions:

1. **repo-research-analyst** (`agents/research/repo-research-analyst.md`)
   - Maps file paths, services, DTOs, entities, rules, existing enums, migration state
   - Input: feature description, affected modules
   - Output: concrete file paths and existing patterns

2. **learnings-researcher** (`agents/research/learnings-researcher.md`)
   - Surfaces relevant solutions from `docs/solutions/`
   - Input: feature description, technical domain
   - Output: applicable patterns and learnings

3. **spec-flow-analyzer** (`agents/workflow/spec-flow-analyzer.md`)
   - Finds missing flows, edge cases, error states
   - Input: feature requirements
   - Output: Given/When/Then acceptance criteria

**Execution approach**: Read all three agent files, then execute their instructions with the provided context. You can read multiple files in parallel.
```

---

## Workflows que Precisam de Adaptação

Arquivos que referenciam "Task tool" e precisam ser atualizados:

1. `workflows/pwf-plan.md` - Múltiplas referências em research rounds
2. `workflows/pwf-brainstorm.md` - Research agent pack
3. `workflows/pwf-work.md` - Research e review agents
4. `workflows/pwf-work-plan.md` - Review agents
5. `workflows/pwf-review.md` - Review agents paralelos
6. `workflows/pwf-doc.md` - Docs agents
7. `workflows/pwf-commit-changes.md` - Per-repo workers
8. `skills/commit-changes/SKILL.md` - Parallel subagents

---

## Checklist de Adaptação

Para adaptar um workflow do Cursor para o Trae:

- [ ] Remover referências a "Task tool"
- [ ] Remover referências a "`subagent_type: generalPurpose`"
- [ ] Substituir por instruções de execução direta
- [ ] Especificar caminhos completos dos agentes
- [ ] Manter instruções de paralelização (Trae suporta)
- [ ] Adicionar inputs/outputs esperados de cada agente
- [ ] Testar o workflow adaptado

---

## Limitações Conhecidas

### Hooks Não Migrados

Os seguintes hooks do Cursor **não funcionam** no Trae:

- `afterFileEdit` - Rastreamento de edições
- `stop` - Lembrete de documentação ao parar sessão
- `beforeShellExecution` - Convenção de commits
- `afterShellExecution` - Cadeia atômica de migrations

**Alternativa**: Lembretes manuais nos workflows ou disciplina da equipe.

Veja `docs/hooks-reference.md` para detalhes completos.

---

## Exemplo Completo de Adaptação

### Antes (Cursor)

```markdown
## 1. Research

### Round 1 — Always (spawn all in parallel via Task tool, `subagent_type: generalPurpose`):

- **repo-research-analyst** — maps file paths
- **learnings-researcher** — surfaces solutions

Use collision-safe agent naming in prompts:
- `psters-ai-workflow:research:<agent-name>`
```

### Depois (Trae)

```markdown
## 1. Research

### Round 1 — Always (execute research agents):

Execute the following agents by reading and applying their instructions:

1. **repo-research-analyst** (`agents/research/repo-research-analyst.md`)
   - Purpose: Maps file paths, services, DTOs, entities, existing patterns
   - Input: Feature description, affected modules/areas
   - Output: Concrete file paths, existing enums, migration state

2. **learnings-researcher** (`agents/research/learnings-researcher.md`)
   - Purpose: Surfaces relevant solutions from `docs/solutions/`
   - Input: Feature description, technical domain
   - Output: Applicable patterns, previous solutions, best practices

**Execution**: Read both agent files and execute their instructions with the provided context. You can read multiple files in parallel to optimize performance.

**Consolidation**: After executing both agents, consolidate findings into a single research summary with exact file paths, method names, and applicable patterns.
```

---

## Status da Adaptação

- ✅ Documentação de referência criada
- ⬜ Workflows atualizados
- ⬜ Skills atualizados
- ⬜ Testes de validação

---

**Última atualização**: 2026-03-19  
**Versão**: 1.0  
**Status**: Documento de referência para adaptação Cursor → Trae
