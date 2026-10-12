# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog.

## [2.2.0] - 2026-10-12

### Added

- **Design layer instrumented with three skills** (`.opencode/skills/`, OpenCode-only):
  - `taste-skill` — full anti-slop frontend playbook vendored from
    [tasteskill.dev](https://www.tasteskill.dev/)
    (`Leonxlnx/taste-skill`, `design-taste-frontend` v2, MIT). Brief
    inference, three dials, design-system mapping, typography/color/layout
    hard rules, motion skeletons, pre-flight check. Frontmatter name aligned
    to directory (`taste-skill`); body is upstream content plus provenance note.
  - `web-design-guidelines` — UI/a11y audit skill vendored from
    `vercel-labs/agent-skills` (MIT). Fetches Vercel Web Interface Guidelines
    at review time and emits `file:line` findings. Description extended with
    plugin trigger phrases; body is upstream content plus provenance note.
  - `awesome-design-md` — brand-matching UI workflow adapted from
    `VoltAgent/awesome-design-md` (MIT) + Google Stitch DESIGN.md spec.
    Select a brand analysis from the collection (or author a custom
    `DESIGN.md`), install it at project root, build from its tokens, verify
    against its do's/don'ts. Documents composition order with `taste-skill`,
    `web-design-guidelines`, and `agents/design/*`.
- **Design Layer section** in `.opencode/README.md` and a **Design & UI
  Quality** block in `.opencode/AGENTS.md` skills list, documenting the
  recommended full pass:
  `awesome-design-md` → `taste-skill` → build → `web-design-guidelines` →
  design agents on demand.
- **Design skill wiring so the stack is actually used** (not just present):
  - All three `agents/design/*` agents now have a **mandatory skill stack**
    in their prompts (awesome-design-md when DESIGN.md/brand applies →
    taste-skill always → web-design-guidelines after final pass). The
    "no left border bars" hard rule is softened to defer to
    DESIGN.md/taste-skill when those explicitly require a different pattern.
  - Work commands auto-load the stack for UI scope:
    `/pwf-work` (Step 1 conditional + Step 3 + Step 4 audit),
    `/pwf-work-plan` (Step 2 + Step 3 audit), `/pwf-work-light` (cosmetic
    UI path), `/pwf-brainstorm` (UX-relevant research + Phase 3.5),
    `/pwf-plan` (section 2e records design read in plans),
    `/pwf-review` (web-design-guidelines on UI diffs + design-skill preload
    before design agents).
  - `assets/review-agent-selection-mapping.md` gained a **Design skill
    stack** note; `skills/visual-brainstorm-companion` loads design skills
    before spawning design agents; `/pwf-help` documents the design pass.
  - `AGENTS.md` gained a **Design skill loading policy (mandatory)**
    including precedence: plugin design skills win over generic/global
    design guidance when both are available.

### Notes

- Skills are `.opencode/`-only for now (parity orphans, same policy as
  `bullmq`/`prisma`/`typeorm`); `tests/scripts/platform-parity.test.mjs`
  continues to pass unchanged.
- Badge counts updated: `skills` 24 → 27 (README.md, README-EN.md);
  `.opencode/README.md` structure note 21 → 27 (also fixed the stale "21"
  alt-text that predated the 2.1.0 badge fix).

## [2.1.0] - 2026-09-12

### Fixed

- **Real OpenCode hooks, replacing dead code.** `docs/*/hooks-reference.md` and
  `docs/*/under-the-hood.md` described a hook system living in
  `plugins/psters-ai-workflow/hooks/` (`track-edit.mjs`, `doc-guard-stop.mjs`,
  `commit-convention-reminder.mjs`, `migration-atomic-reminder.mjs`). That
  directory was deleted in v1.1.0 along with `plugins/`, and none of those
  files existed anywhere in the repo since — the "hooks" system was pure
  documentation with nothing behind it, and `.opencode/README.md` had
  separately (and correctly) noted "OpenCode doesn't have an extensions hook
  system", contradicting the other docs. Replaced with three real, tested
  OpenCode plugins in `.opencode/plugins/` (`docs-memory-guard.js`,
  `commit-convention-guard.js`, `typeorm-migration-guard.js`), built on
  OpenCode's actual plugin API (`tool.execute.before`, `tool.execute.after`,
  `event`). All hooks/plugins docs (EN + PT) updated to match reality.
- **Dead test suites replaced with real ones.** `tests/hooks/
  hooks-regression.test.mjs` spawned five scripts that didn't exist, under a
  `CURSOR_PLUGIN_ROOT` env var left over from before v1.1.0; it was never
  wired into CI, so it had been silently rotting. `tests/scripts/
  release-script-guardrails.test.mjs` asserted the existence of a
  `scripts/release-plugin.sh` that also never existed. Both removed and
  replaced with tests that exercise real files: `tests/plugins/
  plugins-regression.test.mjs`, `tests/agents/
  agent-permission-frontmatter.test.mjs`, `tests/scripts/
  badge-consistency-guardrails.test.mjs`, `tests/scripts/
  resolve-workflow-extensions.test.mjs`, `tests/scripts/
  platform-parity.test.mjs`.
- **`scripts/resolve-workflow-extensions.mjs` pointed at a dead path.** It
  read `plugins/psters-ai-workflow/extensions/extensions.json`, the same
  removed directory above, so it always crashed. Fixed to read the real
  `.windsurf/extensions/extensions.json` (this is a Windsurf-only, advisory
  concept), with a `WORKFLOW_EXTENSIONS_PATH` override.
- **README badges were stale.** `agents` badge said 46, actual count was 51;
  `skills` badge said 21, actual count was 23. Fixed, and added
  `scripts/check-readme-badges.mjs` (with `--fix`) plus a CI check so this
  can't silently drift again.
- **CI ran nothing.** The only workflow was `sync-wiki.yml`; the test suite
  above was never executed automatically. Added `.github/workflows/
  tests.yml`, which runs `npm test`, the badge check, and the platform
  parity report on every push/PR.

### Added

- **Enforced agent permissions.** Every one of the 51 `.opencode/agents/*`
  files now declares an explicit `tools:`/`permission:` policy in its
  frontmatter (OpenCode's documented agent schema). `research/*` and
  `review/*` agents are now read-only at the OpenCode permission level
  (`edit: deny`), not just by prompt instruction — see
  `scripts/apply-agent-permission-defaults.mjs` for the policy table
  (idempotent, safe to re-run after adding new agents).
- **`scripts/check-platform-parity.mjs`.** `.opencode/` and `.windsurf/` are
  hand-maintained duplicates, not generated from one source, and had already
  drifted (three skills — `bullmq`, `prisma`, `typeorm` — exist only in
  `.opencode/`). Rather than risk an automated merge that could silently
  degrade whichever side wasn't canonical for a given file, this script
  reports orphaned and diverged files so a maintainer can reconcile them
  deliberately.
- `package.json` at the repo root with `npm test` / `npm run check:badges` /
  `npm run check:parity`, purely for maintainers — not consumed by OpenCode
  or Windsurf at runtime.

## [2.0.0] - 2026-05-27

### Changed

- **Repository focus shift**: Official support narrowed to **Opencode** (canonical) and **Windsurf** (derivative). Removed all references to Cursor, Claude Code, and Trae from documentation.
- **Cleaned legacy references**: Updated all documentation to remove Cursor-specific instructions, WSL setups, and editor-specific paths.
- **Documentation consolidation**: Updated FAQ, getting-started, suggested-project-structure, and under-the-hood to focus on Opencode/Windsurf workflows.
- **Links updated**: All references to legacy Cursor documentation now point to current getting-started guides.

### Removed

- All Cursor-specific documentation and setup instructions.
- Cursor and Claude Code references from main README, docs, and metadata.

### Added

- Clear statement that Opencode is the canonical repository for this workflow.
- Explicit documentation that Windsurf is a supported derivative using `.windsurf/` structure.

## [1.1.0] - 2026-05-05

### Changed

- Official support narrowed to **Windsurf** and **OpenCode** only. Cursor, Claude Code, and Trae integrations removed.
- Restructured repository: removed `.cursor/`, `.cursor-plugin/`, `.trae/`, `.claude/`, and `plugins/` directories.
- Main `README.md` rewritten to focus on Windsurf and OpenCode installation and usage.
- `.windsurf/README.md` updated — Windsurf is now a first-class platform, not an adaptation.
- `scripts/install-workflow-bridge.mjs` rewritten for Windsurf and OpenCode only.
- `docs/english/other-editors.md` and `docs/portuguese/other-editors.md` rewritten to document Windsurf and OpenCode setup.

### Added

- `.opencode/` directory with full OpenCode adaptation: 20 commands, 46 agents, 21 skills, consolidated rules in `AGENTS.md`.

### Removed

- `.claude/`, `.cursor/`, `.cursor-plugin/`, `.trae/`, `plugins/` directories and all contained files.
- `scripts/install-plugin-local.sh` and `scripts/install-claude-code.sh`.

## [1.0.0] - 2026-03-18

### Added

- Introduced a complete prefixed command suite (`/pwf-*`) with dedicated commands for setup, docs operations, quality gates, and specialized work lanes.
- Added reusable workflow assets and specialist agents for architecture docs, infrastructure docs, ADR generation, review mapping, and plan synchronization.
- Added new documentation guides in English and Portuguese, including suggested project structure and under-the-hood architecture.

### Changed

- Refined command orchestration to reduce duplication by extracting baseline loading and docs maintenance into shared skills.
- Expanded workflow documentation and wiki generation with curated language hubs, clearer onboarding flows, and improved deep-link navigation.
- Standardized plugin policies and guardrails for command naming, docs scope boundaries, operational behavior, and commit/release safety.

### Fixed

- Corrected command and docs path consistency after command-family migration, including anti-drift docs handling and setup behavior.
- Improved release checks and template validation coverage to catch metadata/version drift earlier.

## [0.1.7] - 2026-03-16

### Changed

- Removed `aws-cli-only.mdc` and `user-facing-text.mdc` from the plugin rules (project-specific rules that do not belong in the generic workflow plugin).
- Added `commits.mdc` to the repository-level `.cursor/rules/` (maintainer-only convention, not part of the installable plugin).
- Cleaned up stale references to removed rules in `skills/angular-conventions/SKILL.md`, `agents/research/ux-consistency-reviewer.md`, and `plugins/psters-ai-workflow/README.md`.

## [0.1.6] - 2026-03-16

### Removed

- `docs/english/add-a-plugin.md` and `docs/portuguese/add-a-plugin.md`: leftover template files, removed from all READMEs and docs indexes.
- Removed all references in `README.md`, `plugins/psters-ai-workflow/README.md`, `docs/english/README.md`, `docs/portuguese/README.md`, and all `.wiki-export/` variants.

## [0.1.5] - 2026-03-16

### Added

- New documentation page: "Using the workflow outside Cursor" (EN and PT-BR):
  - `docs/english/other-editors.md`
  - `docs/portuguese/other-editors.md`
  - Covers: why Cursor is recommended (Marketplace auto-updates, hooks, agents), Claude Code setup (slash commands), Windsurf, VS Code + GitHub Copilot, and generic approach for any AI tool.
  - Includes feature comparison table across tools.
- Updated `README.md` (EN and PT-BR install sections): added link to other-editors doc, idempotency note for the install script, and Marketplace auto-update note.
- Updated `docs/english/README.md` and `docs/portuguese/README.md`: added `other-editors.md` to the file index.

## [0.1.4] - 2026-03-16

### Fixed

- Mermaid diagram rendering errors on GitHub caused by `/` at the start of node labels (e.g. `[/brainstorm]` parsed as trapezoid shape). Wrapped all such labels in quotes (`["/brainstorm"]`).
- Affected files: `README.md`, `docs/english/workflow-methodology.md`, `docs/portuguese/workflow-methodology.md`, `docs/english/extreme-programming.md`, `docs/portuguese/extreme-programming.md`, and all `.wiki-export/` variants.

## [0.1.3] - 2026-03-16

### Added

- Model selection guidance across planning and execution steps:
  - New section in `docs/english/workflow-methodology.md`: "Choosing the right model for each step"
  - New section in `docs/portuguese/workflow-methodology.md`: "Escolhendo o modelo certo para cada etapa"
  - New section in `README.md` (EN and PT-BR): model recommendation table per command
  - Covers rationale: planning steps (`/brainstorm`, `/plan`, `/review`) require high-capability models; execution steps (`/work-plan`, `/work`) work well with mid-tier models in auto mode

## [0.1.2] - 2026-03-16

### Added

- Maintainer release automation script:
  - `scripts/release-plugin.sh`
- Repository-level maintainer workflow helpers:
  - `.cursor/commands/develop-plugin.md`
  - `.cursor/commands/release-plugin.md`
  - `.cursor/rules/plugin-maintainer-flow.mdc`
- Claude-focused maintainer helpers:
  - `.claude/README.md`
  - `.claude/commands/develop-plugin.md`
  - `.claude/commands/release-plugin.md`
  - `.claude/agents/plugin-submission-reviewer.md`
  - `.claude/agents/plugin-release-manager.md`
- README section documenting the maintainer release flow.

## [0.1.1] - 2026-03-16

### Added

- Local manual installer script for the plugin:
  - `scripts/install-plugin-local.sh`

### Changed

- Updated getting-started docs (EN/PT) to use the installer script instead of manual copy commands.
- Refined command UX for all plugin commands by rewriting each command's first title and opening explanation for clearer discoverability and faster understanding in the command picker.
  - `/brainstorm` -> Step 1 framing
  - `/plan` -> Step 2 framing
  - `/work-plan` -> Step 3 framing
  - `/review` -> Step 4 framing
  - `/commit-changes` -> Step 5 framing
  - `/work`, `/doc`, `/compound`, `/deploy-lambda` -> concise purpose-first titles and first-line guidance

## [0.1.0] - 2026-03-16

### Added

- Initial `psters-ai-workflow` plugin structure and manifests.
- Core command set:
  - `/brainstorm`
  - `/plan`
  - `/work-plan`
  - `/work`
  - `/review`
  - `/doc`
  - `/compound`
  - `/deploy-lambda`
  - `/commit-changes`
- Rules, skills, and agents migrated and generalized for project-agnostic usage.
- Context7 MCP integration via plugin `mcp.json` and guidance rule.
- Hook automation:
  - documentation guard on session stop
  - commit convention reminder
  - migration reminder
  - code/docs edit tracking
- Bilingual documentation baseline (English and Portuguese):
  - methodology
  - commands reference
  - Extreme Programming alignment
  - getting started
  - command recipes
  - hooks reference
  - FAQ
  - add-a-plugin guide
- Contribution and community files:
  - `CONTRIBUTING.md`
  - `CODE_OF_CONDUCT.md`
  - GitHub issue and PR templates
  - Discord community link in root README
- Repository governance and release scaffolding:
  - `LICENSE` (MIT)
  - this `CHANGELOG.md`
