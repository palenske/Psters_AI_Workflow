# Review Agent Selection Mapping

Use this mapping to choose review agents consistently based on change scope.

## Selection table

| Change pattern | Agents |
|---|---|
| `frontend/` or Angular touched | `angular-reviewer`, `julik-frontend-races-reviewer` |
| `backend/` or NestJS touched | `nestjs-reviewer` |
| `*-lambda/` or `*-processor/` touched | `lambda-reviewer` |
| Database migration/entity change | `data-integrity-guardian`, `schema-drift-detector` |
| Data-risky deploy/migration changes | `deployment-verification-agent` |
| Auth, secrets, S3, uploads, permissions | `security-sentinel` |
| New UI action, agent tool, command, prompt behavior | `agent-native-reviewer` |
| UI/design implementation changed | `design-implementation-reviewer` |
| Explicit visual refinement request | `design-iterator` |
| Figma parity/sync request | `figma-design-sync` |
| Pattern-level consistency concerns | `pattern-recognition-specialist` |
| Bug report requires reproducibility confirmation | `bug-reproduction-validator` |
| Always-on deep review baseline | `kieran-typescript-reviewer`, `code-simplicity-reviewer`, `architecture-strategist`, `learnings-researcher` |

## Notes

- Use collision-safe naming when spawning: `psters-ai-workflow:<category>:<agent-name>`.
- Run selected agents in parallel.
- Fix critical findings first; then rerun focused reviewers as needed.

## Design skill stack (mandatory when UI is in scope)

Whenever any row above selects a design agent (`design-implementation-reviewer`, `design-iterator`, `figma-design-sync`) **or** the change touches frontend/UI files, load the plugin design skills first — in this order — before running those agents:

1. `skills/awesome-design-md/SKILL.md` — if project root has `DESIGN.md` or a brand reference is in play
2. `skills/taste-skill/SKILL.md` — always for UI work (structure, anti-slop, pre-flight)
3. `skills/web-design-guidelines/SKILL.md` — after implementation/fixes, as the compliance audit

Plugin design skills take precedence over generic/global design guidance. Design agents must not skip this stack.
