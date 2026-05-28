# Under the Hood

This document explains why the Psters AI Workflow works and how it works internally.

If you only want usage, read `getting-started.md` and `commands-reference.md`.
If you want architecture-level understanding, read this page.

## Why this workflow works

The workflow is effective because it combines five constraints:

1. Explicit orchestration (`/pwf-*` commands)
2. Persistent guardrails (rules)
3. Reusable execution procedures (skills)
4. Specialized decomposition (agents)
5. Lifecycle reminders (hooks)

These constraints reduce randomness and convert AI assistance into a predictable delivery system.

## Core philosophy

- The developer chooses the path.
- AI executes the selected path with rigor.
- Documentation is treated as operational memory.

This means the workflow optimizes for consistency over one-shot speed.

## System architecture in practice

The execution chain is:

`command` -> `rules` -> `skills` -> `agents` -> `hooks` -> final report

Each layer has a different job.

## Commands: the orchestration layer

Commands live in `.opencode/commands/` (or `.windsurf/commands/`).

They are user entry points (`/pwf-*`) that:

- define sequence of steps,
- enforce mandatory phases (for example docs-first in work commands),
- define expected output contract.

Commands answer: "What flow should run now?"

## Rules: the policy layer

Rules live in `.opencode/AGENTS.md` (or `.windsurf/AGENTS.md`), which provides:
- Operational guardrails
- Commit standards
- Migration discipline
- Build policies

Rules are persistent constraints that shape behavior regardless of prompt style:

- commit convention,
- migration discipline,
- documentation scope boundary,
- operational guardrails.

Rules answer: "What must always remain true?"

## Skills: the procedure layer

Skills live in `plugins/psters-ai-workflow/skills/<skill>/SKILL.md`.

A skill is a reusable playbook for recurring work patterns:

- debugging,
- verification before completion,
- post-work documentation maintenance,
- docs baseline loading.

Skills prevent command bloat: one procedure can be reused by many commands.

Skills answer: "How should this class of work be executed?"

## Agents: the specialization layer

Agents live in `plugins/psters-ai-workflow/agents/`.

Commands spawn agents for focused responsibilities:

- research agents map context and existing patterns,
- review agents detect risks/regressions/security/performance issues,
- docs agents generate or synchronize canonical documentation.

Agents answer: "Who is the best specialist for this subtask?"

## Hooks: the lifecycle safety layer

Hooks live in `plugins/psters-ai-workflow/hooks/`.

Hooks are automatic event-driven checks:

- after edits: track whether code and docs changed,
- before/after shell commands: remind critical conventions,
- stop event: warn when docs were skipped after code edits.

Hooks do not replace commands. They reinforce discipline around command execution.

## Why docs are mandatory in this system

Without updated docs, each AI run starts partially blind.
With updated docs, each AI run starts with project memory.

That is why `/pwf-work` and `/pwf-work-plan` are docs-first and docs-maintaining by design.

## How quality is controlled

Quality is not one single step. It is layered:

- plan quality: `/pwf-plan`
- requirement quality gates: `/pwf-checklist`, `/pwf-clarify`, `/pwf-analyze`
- implementation quality: `/pwf-work*` discipline
- review quality: `/pwf-review`
- memory quality: docs update + docs curation commands

This multi-layer model is why the workflow scales better than ad-hoc prompting.

## Common misconception

"If AI is strong enough, we do not need this structure."

In practice, model capability does not replace process capability.
The workflow exists to keep output stable across:

- different model versions,
- different contributors,
- different project maturity levels.

## Mental model for advanced users

- Commands orchestrate.
- Rules constrain.
- Skills standardize.
- Agents specialize.
- Hooks enforce lifecycle hygiene.

When these five parts are aligned, the workflow remains predictable, auditable, and evolvable.
