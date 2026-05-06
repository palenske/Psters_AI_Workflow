# Extension Hooks — Historical Reference

This document describes the automation capabilities that existed in the original Cursor plugin and what is available in Windsurf and OpenCode today.

---

## Cursor Hooks (Historical)

The original Cursor plugin used a `hooks.json` system with Node.js scripts that ran on specific editor events:

### 1. `afterFileEdit` — Edit Tracking
- Tracked when code or documentation files were edited
- Maintained state in `.cursor/hooks/state/psters-ai-workflow.json`
- Detected when code was changed without updating docs

### 2. `stop` — Documentation Reminder
- Fired when the user stopped a Cursor session
- Checked if code was changed without documentation updates
- Displayed reminder to run `/pwf-doc update` or `/pwf-doc-capture`

### 3. `beforeShellExecution` (git commit) — Commit Convention
- Ran before `git commit` commands
- Reminded about commit convention: `[TICKET-XXXX] message`
- Suggested using `/pwf-commit-changes` for structured commits

### 4. `afterShellExecution` (typeorm:generate) — Migration Chain
- Fired after `typeorm:generate` commands
- Reminded about the atomic migration chain (generate → review → run → test → commit)

---

## Current Platform Capabilities

### Windsurf

Windsurf uses `extensions.json` with workflow-specific hook points:

| Hook Point | Available | Used By |
|------------|-----------|---------|
| `before_plan` | Yes | Advisory guidance |
| `after_plan` | Yes | `default-plan-consistency-check` |
| `before_work_plan` | Yes | Advisory guidance |
| `after_work_plan` | Yes | Advisory guidance |
| `before_work` | Yes | Advisory guidance |
| `after_work` | Yes | Advisory guidance |
| `afterFileEdit` | No | Not available |
| `stop` | No | Not available |
| Shell hooks | No | Not available |

### OpenCode

OpenCode doesn't have an extension hook system. Instead, lifecycle guidance is embedded directly in command templates:

- Documentation reminders are part of the `/pwf-work` and `/pwf-work-plan` finish steps
- Commit conventions are enforced via `AGENTS.md` rules
- Migration discipline is enforced via rules in `AGENTS.md`

---

## How Discipline is Maintained Today

Since automatic hooks are limited, discipline is enforced through:

1. **Workflow steps**: Documentation maintenance is a mandatory step in `/pwf-work` and `/pwf-work-plan`
2. **Rules in AGENTS.md**: Operational guardrails, commit standards, and migration discipline are always loaded
3. **Verification gates**: `verification-before-completion` skill requires evidence before claiming "done"
4. **Team discipline**: The "anti-vibe-coding" philosophy requires humans to follow the workflow

---

**Last updated**: 2026-05-05
**Status**: Reference documentation
