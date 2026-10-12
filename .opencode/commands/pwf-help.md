---
description: "Explain all available Psters Workflow commands and the recommended end-to-end flow. Read-only guidance command for onboarding and quick orientation."
---

# Psters Workflow Command Guide

Use this command to explain the workflow to the user in a simple, practical way.
This is a read-only guidance command: it should not edit files, run deployments, or create commits.

## What to explain first

1. The workflow intent:
   - predictable execution,
   - docs-first context,
   - explicit user control over quality gates.
2. The default flow:
   - `/pwf-brainstorm` -> `/pwf-plan` -> `/pwf-work-plan`
3. Optional quality gates:
   - `/pwf-clarify`, `/pwf-checklist`, `/pwf-analyze`, `/pwf-review`
4. Documentation and learnings commands:
   - `/pwf-doc`, `/pwf-doc-foundation`, `/pwf-doc-runbook`, `/pwf-doc-capture`, `/pwf-doc-refresh`
5. Closing and delivery commands:
   - `/pwf-commit-changes`, `/pwf-aws-lambda-deploy` (when relevant)
6. Workspace bootstrap command (when starting from scratch):
   - `/pwf-setup-workspace`

## Explain all commands (quick map)

- `/pwf-help` — explain all commands and workflow path
- `/pwf-setup` — initialize or repair docs workflow structure
- `/pwf-setup-workspace` — create recommended multi-root `*_Repos` + `*_Workspace` layout
- `/pwf-brainstorm` — explore idea, scope, and architecture options
- `/pwf-plan` — convert context into executable phases/tasks
- `/pwf-clarify` — resolve ambiguity before execution (optional)
- `/pwf-checklist` — generate requirement quality gates (optional)
- `/pwf-analyze` — run read-only consistency analysis (optional)
- `/pwf-work-plan` — execute one planned phase
- `/pwf-work` — execute direct focused implementation outside a formal plan
- `/pwf-work-light` — fast path for trivial/local changes
- `/pwf-work-tdd` — tests-first execution when explicitly requested
- `/pwf-review` — heavy multi-agent review pass
- `/pwf-doc` — force canonical technical documentation updates
- `/pwf-doc-foundation` — create/refresh core project docs baseline
- `/pwf-doc-runbook` — create/refresh operational runbooks
- `/pwf-doc-capture` — register reusable learnings and patterns
- `/pwf-doc-refresh` — curate/refresh `docs/solutions/` lifecycle
- `/pwf-commit-changes` — create structured, ticket-aware commits
- `/pwf-aws-lambda-deploy` — deploy Lambda changes with guarded script flow

## Talking points

When answering, tailor depth to user need:

- New user: explain the default path and when to pick `/pwf-work` vs `/pwf-work-plan`.
- Advanced user: highlight optional gates and command trade-offs.
- Fast question: provide a short command chooser and one-line recommendations.

Always use prefixed command names (`/pwf-*`) when presenting examples.

## Internal components (who uses who)

Use this map when the user asks how the plugin pieces connect:

- `workflows/` — user entry points (`/pwf-*`). They orchestrate the workflow.
- `AGENTS.md` — guardrails applied during execution (naming, migrations, docs policy, safety).
- `skills/` — reusable procedural playbooks invoked by workflows (debugging, verification, commit orchestration).
- **Design skills** — `taste-skill` (anti-slop frontend rules), `web-design-guidelines` (UI/a11y audit), `awesome-design-md` (brand `DESIGN.md` systems). Work commands auto-load them for UI tasks; design agents require them.
- `agents/` — specialized subagent definitions that workflows spawn for focused work (research, review, docs, workflow sync, design).
- `assets/` — supporting resources (review agent selection mapping, documentation playbooks).

Execution model in practice:
`workflow` -> applies `rules` -> may call `skills` -> may execute `agents` -> `extensions` provide advisory guidance at lifecycle events.

Design pass (UI features): `awesome-design-md` (tokens) → `taste-skill` (structure) → build → `web-design-guidelines` (audit) → design agents on demand.

## Next Recommended Commands

- `/pwf-brainstorm` to start feature discovery
- `/pwf-plan` to create an implementation plan
- `/pwf-work-plan` to execute phase by phase
- `/pwf-work` for focused direct changes
- `/pwf-setup-workspace` when bootstrapping a new multi-root project
