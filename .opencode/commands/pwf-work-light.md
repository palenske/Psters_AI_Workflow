---
description: "Lightweight execution path for trivial changes (small fix/cosmetic/local refactor) with minimal overhead and core safety checks."
---

# Execute Lightweight Work

Use this for truly small/local changes.
Apply `skills/using-psters-workflow/SKILL.md` at start.

## Trivial scope criteria

All must be true:

- <= 2 files expected to change
- no new entities/migrations/endpoints
- no auth/security model changes
- no cross-repo architectural impact

If any criterion fails, use `/pwf-work` or `/pwf-work-plan` instead.

## Workflow

1. Apply `skills/docs-baseline-loading/SKILL.md` and execute baseline loading before coding.
2. Read `docs/solutions/patterns/critical-patterns.md` (if exists), directly relevant module/feature doc, and `docs/runbooks/README.md` when operational behavior is touched.
3. **If the change is UI/cosmetic (styles, components, copy on a page):** apply `skills/taste-skill/SKILL.md` for the touched surface (and `skills/awesome-design-md/SKILL.md` first if project root has `DESIGN.md`). For pure trivial CSS fixes the taste-skill pre-flight rules alone are enough — no need for a full design read.
4. Implement targeted change.
5. Run minimal verification command(s) relevant to the change.
6. Run focused documentation check:
   - update docs only if contract/behavior changed,
   - otherwise report "no doc impact" with reason.
   Work commands update docs as part of the workflow; use `/pwf-doc` or `/pwf-doc-capture` for explicit scope-targeted documentation.
7. Finish with verification evidence.

## Verification Evidence Format

Use the shared evidence format from `AGENTS.md (#operational-guardrails)`.

Project-specific override is allowed via `docs/workflow/operational-overrides.md` (if present).

## Guardrails

- If scope expands during work, stop and switch to `/pwf-work`.
- Do not use for migrations, risky deploy changes, or broad refactors.

## Next Recommended Commands

- `/pwf-review` when change risk is not purely cosmetic
- `/pwf-commit-changes` after verification
