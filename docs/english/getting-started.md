# Getting Started (10 Minutes)

This guide helps you run the workflow end-to-end for the first time without losing predictability.

## Core idea before you start

- The developer controls the path.
- AI executes the chosen step with rigor.
- Documentation is mandatory operational memory, not optional notes.

## 1) Install plugin locally

 1. `./scripts/install-plugin-local.sh`
 2. Restart your editor (OpenCode or Windsurf).

**Windows + WSL:** If you installed from WSL but the plugin is not visible, see [Getting Started](getting-started.md).

## 2) Initialize project docs skeleton

Run:

- `/pwf-setup-workspace` (recommended when creating a new multi-root project layout)
- `/pwf-setup`

`/pwf-setup-workspace` creates the recommended `<ProjectName>_Repos` + `<ProjectName>_Workspace` structure and generates a `.code-workspace` file.
`/pwf-setup` creates or repairs the project documentation baseline used by work commands.

## 3) Learn commands before execution

Run:

- `/pwf-help`

If you are unsure about a command, ask `/pwf-help` to explain that command without executing it.

## 4) Execute the primary workflow

1. `/pwf-brainstorm` -> define scope, architecture direction, and key decisions.
2. `/pwf-plan` -> generate phased implementation tasks.
3. Optional quality gates after plan:
   - `/pwf-checklist`
   - `/pwf-clarify`
   - `/pwf-analyze`
4. `/pwf-work-plan` -> execute one phase per run, repeat until all phases are complete.
5. `/pwf-review` -> deep risk/regression pass when needed.
6. `/pwf-commit-changes` -> structured local commits.

## 5) Alternative execution lane

Use `/pwf-work` when the change is focused and outside a formal plan:

- small fixes
- minor local adjustments
- follow-up changes after planned phases

`/pwf-work` still enforces docs-first context and docs maintenance.

## 6) Documentation commands (explicit output)

- `/pwf-doc` -> scoped technical docs update.
- `/pwf-doc-foundation` -> baseline docs (`infrastructure`, `architecture`, `integrations`, `environments`, `glossary`).
- `/pwf-doc-runbook` -> operational runbooks.
- `/pwf-doc-capture` -> reusable learnings/patterns.
- `/pwf-doc-refresh` -> curate `docs/solutions/` lifecycle.

## 7) Validate plugin setup

Run:

- `node scripts/validate-template.mjs`
