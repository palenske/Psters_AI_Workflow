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

## MCP Configuration

The plugin uses MCP servers configured in `.windsurf/mcp.json`:

- **context7**: Documentation retrieval via `@upstash/context7-mcp`
- **antd**: Ant Design component library integration
- **stitch**: UI generation and design system tools

## Agent organization

Agents are organized by domain in `.windsurf/agents/`:

- `research/`: Exploration and information gathering agents
- `review/`: Code review and quality assurance agents  
- `docs/`: Documentation generation and maintenance agents
- `workflow/`: Workflow execution and orchestration agents
- `design/`: UI/UX design and component generation agents

When referencing agents in prompts, use the directory structure:
- `agents/research/<agent-name>`
- `agents/review/<agent-name>`
- `agents/docs/<agent-name>`
- `agents/workflow/<agent-name>`
- `agents/design/<agent-name>`

## Skills

Reusable skills are available in `.windsurf/skills/`:

- `commit-changes/`: Multi-repo commit orchestration
- `commit-changes-repo-worker/`: Per-repo commit worker
- `fast-validation/`: Quick TypeScript validation without full build
- `orchestrating-multi-agents/`: Parallel subagent management
- `requesting-code-review/`: Standardized review requests
- `receiving-code-review/`: Review feedback processing
- `systematic-debugging/`: 4-phase root-cause debugging
- `test-driven-development/`: TDD workflow (opt-in)
- `verification-before-completion/`: Pre-completion verification
- `using-psters-workflow/`: Workflow meta-skill
- `git-worktree/`: Worktree management
- `finishing-a-development-branch/`: Branch closure discipline
- `nestjs-conventions/`: NestJS patterns
- `angular-conventions/`: Angular patterns
- `deploy-lambda/`: AWS Lambda deployment
- `docs-baseline-loading/`: Foundation docs loading
- `docs-maintenance-after-work/`: Post-work doc maintenance
- `antd-mcp/`: Ant Design MCP integration

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
