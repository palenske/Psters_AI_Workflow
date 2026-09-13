# Hooks Reference

**This document covers the OpenCode platform.** For Windsurf, see the
`extensions/` system described in `docs/english/other-editors.md` — it is
advisory-only and cannot execute code, which is a real, intentional
difference between the two platforms (not a gap to be closed).

On OpenCode, this plugin uses real, script-executing hooks via the
documented plugin API (https://opencode.ai/docs/plugins), implemented in
`.opencode/plugins/*.js`. Each plugin returns handlers for events like
`tool.execute.before`, `tool.execute.after`, and `event` (session lifecycle).

## Plugin table

| Plugin file | Trigger | What it does |
| --- | --- | --- |
| `docs-memory-guard.js` | `tool.execute.after` on write/edit/patch, then `event: session.idle` | Tracks whether a session touched `docs/` and/or code; warns at session end if code changed without a doc update |
| `commit-convention-guard.js` | `tool.execute.before` on `git commit -m "..."` | Warns (or blocks, with `PWF_STRICT_COMMIT_CONVENTION=1`) if the message is missing the `[TICKET-XXXX]` prefix |
| `typeorm-migration-guard.js` | `tool.execute.after` on `typeorm:generate` | Reminds you to run the migration locally immediately (atomic chain) |

State for `docs-memory-guard.js` is persisted per OpenCode session to
`.opencode/state/docs-memory-guard.json` in your project.

## Why these plugins matter

- They prevent silent process drift.
- They keep documentation tied to implementation.
- They improve consistency without blocking normal work (all three are
  advisory by default; only the commit guard can be switched to hard-block).

## Important

Plugins are reinforcement. Core commands still drive the workflow:

- `/pwf-work` and `/pwf-work-plan` for implementation
- `/pwf-doc` family for explicit documentation outputs
- `/pwf-review` for quality feedback loops

## Extending

To add a new plugin, create `.opencode/plugins/your-plugin.js` exporting an
async function that returns a hooks object (see the three examples above for
the pattern), and add coverage in `tests/plugins/plugins-regression.test.mjs`.
`.opencode/plugins/package.json` already declares `"type": "module"` so ESM
`export`/`import` works both inside OpenCode and in the test suite.

