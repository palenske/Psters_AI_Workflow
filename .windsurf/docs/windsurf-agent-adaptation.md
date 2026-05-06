# Agent Execution Model — Windsurf and OpenCode

This document explains how agents are executed in both supported platforms. The methodology is identical — only the invocation mechanism differs.

---

## Platform Differences

| Aspect | Windsurf | OpenCode |
|--------|----------|----------|
| **Agent invocation** | Direct file read + execute | `task` tool + `@agent` mention |
| **Parallel execution** | Multiple tool calls simultaneously | Multiple tool calls simultaneously |
| **Lifecycle hooks** | `extensions.json` workflow hooks | Embedded in command templates |
| **Skills** | Auto-discovered from `skills/` | Auto-discovered via `skill` tool |
| **Agents** | Read and execute `.md` files | Subagents with frontmatter config |

---

## Agent Execution Pattern

All workflows follow the same pattern regardless of platform:

1. **Read the agent file** — the workflow reads the specialized agent's instruction file
2. **Execute the instructions** — apply the agent's logic with the given context
3. **Consolidate findings** — merge outputs into the workflow's decision flow
4. **Parallel when independent** — read multiple agent files simultaneously

### Example: Research Round in `/pwf-plan`

```markdown
### Round 1 — Always (execute research agents):

Execute the following agents by reading and applying their instructions:

1. **repo-research-analyst** (`agents/research/repo-research-analyst.md`)
   - Purpose: Maps file paths, services, DTOs, entities, existing patterns
   - Input: Feature description, affected modules
   - Output: Concrete file paths, existing enums, migration state

2. **learnings-researcher** (`agents/research/learnings-researcher.md`)
   - Purpose: Surfaces relevant solutions from `docs/solutions/`
   - Input: Feature description, technical domain
   - Output: Applicable patterns, previous solutions

**Execution**: Read both agent files and execute their instructions.
You can read multiple files in parallel to optimize performance.
```

---

## Workflows Using Agents

The following workflows spawn specialized agents:

| Workflow | Agent Categories |
|----------|-----------------|
| `/pwf-brainstorm` | research (repo, integration, PO analysis, edge cases, data model, API contract) |
| `/pwf-plan` | research + review (architecture, security, performance) + workflow (plan review) |
| `/pwf-work` | research (repo, learnings) + conditional (migration, spec flow) |
| `/pwf-work-plan` | review (agent-specific based on phase scope) |
| `/pwf-review` | review (simplicity, security, architecture, domain-specific) |
| `/pwf-doc` | docs (module writer, feature writer, infrastructure, ADR, shepherd) |
| `/pwf-commit-changes` | workflow (commit-changes-repo-worker per repo) |

---

## Skills vs Agents

**Agents** are specialized instruction files for focused research, review, or documentation tasks. They are read and executed by workflows.

**Skills** are reusable procedural playbooks that can be loaded on demand. They provide step-by-step guidance for complex processes:

| Skill | When Used |
|-------|-----------|
| `systematic-debugging` | Bug reproduction and root cause analysis |
| `verification-before-completion` | Before claiming "done" |
| `docs-baseline-loading` | Start of any implementation work |
| `docs-maintenance-after-work` | After implementation completes |
| `commit-changes-repo-worker` | Multi-repo commit orchestration |
| `finishing-a-development-branch` | Branch/worktree cleanup |
| `using-psters-workflow` | Entry point for all workflows |

---

## Limitations

Some automation available in other editors is not possible:

- **Edit tracking** — No `afterFileEdit` equivalent; documentation discipline is enforced via workflow steps
- **Shell hooks** — No `beforeShellExecution`/`afterShellExecution`; reminders are embedded in commands
- **Session stop events** — No `stop` hook; documentation reminders are in the workflow's finish step

These are handled by explicit workflow steps and team discipline.

---

**Last updated**: 2026-05-05
