# Plugin Agent Contract

This file is the operational contract for the Windsurf plugin at `.windsurf/`.

## Core principles

1. User control first
   - The user chooses workflow path and quality gates.
   - Do not silently auto-switch between `/pwf-work`, `/pwf-work-light`, `/pwf-work-tdd`, or `/pwf-work-plan`.
2. Predictable and repeatable execution
   - Prefer explicit steps and deterministic outputs.
   - Keep side-effect commands explicit and non-automatic.
3. Durable documentation
   - `docs/` is operational memory.
   - Keep docs aligned with implemented state.

## MCP Integration

The plugin supports MCP (Model Context Protocol) servers for extended capabilities:

- **Documentation retrieval**: Context7 for library/framework docs
- **UI libraries**: Component system integrations
- **Design tools**: Figma/Stitch for design-to-code workflows

## Agent organization

Agents are organized by domain:

- **research**: Exploration and information gathering
- **review**: Code review and quality assurance  
- **docs**: Documentation generation and maintenance
- **workflow**: Workflow execution and orchestration
- **design**: UI/UX design and component generation

Agents specialize by technology stack (NestJS, Next.js, Angular, etc.) and concern (architecture, data integrity, security, etc.).

## Skills

Reusable skills by category:

**Workflow & Process:**
- Commit orchestration, code review workflows, debugging discipline
- Git worktree management, branch lifecycle, verification gates

**Technology Conventions:**
- Framework-specific patterns (NestJS, Angular, Next.js)
- Deployment workflows (Lambda, containers)
- UI library integrations

**Quality & Maintenance:**
- Fast validation without full builds
- Documentation maintenance and baseline loading
- Test-driven development (opt-in)

## Path conventions

- Use logical plugin paths for internal assets:
  - `rules/...`, `skills/...`, `agents/...`, `presets/...`, `workflows/...`
- Use project-owned paths for user repository data:
  - `docs/...` (at repository root)
- For plugin scripts, use `.windsurf/scripts/` path.

## Side-effect command policy

Commands that write files, deploy, or commit must be explicit user actions:

Typical side-effect commands:
- `pwf-work`, `pwf-work-plan`, `pwf-work-light`, `pwf-work-tdd`
- `pwf-plan`, `pwf-brainstorm`, `pwf-clarify`, `pwf-checklist`, `pwf-doc`
- `pwf-doc-foundation`, `pwf-doc-runbook`
- `pwf-doc-capture`, `pwf-doc-refresh`
- `pwf-setup`, `pwf-setup-workspace`, `pwf-commit-changes`, `pwf-aws-lambda-deploy`

## Extensions System

The plugin uses Windsurf's extensions system (`.windsurf/extensions/extensions.json`) for workflow lifecycle hooks:

- `before_plan`, `after_plan` - Advisory guidance around planning
- `before_work_plan`, `after_work_plan` - Advisory guidance around phase execution  
- `before_work`, `after_work` - Advisory guidance around direct work

Current active extension: `default-plan-consistency-check` (runs after_plan)

## Multi-agent orchestration

Parallel subagents are encouraged when tasks are independent.

Guardrails:
- Keep one orchestrator owner.
- Use explicit role boundaries.
- Merge outputs into a single deterministic decision.
- Ask user before broad/high-risk autonomous execution.

## Minimal validation before release/commit

Run:
1. Lint/diagnostic checks for edited files
2. Fast validation: `npm run validate` (or project equivalent)
3. Docs consistency check for updated workflow commands

For plugin changes, update `CHANGELOG.md` appropriately.
