# Psters AI Workflow — OpenCode Plugin

Anti-vibe-coding plugin adapted for OpenCode. Enforces disciplined AI-assisted development through structured workflows, specialized agents, and documentation-first practices.

## Core Principles

1. **User control first**
   - The user chooses workflow path and quality gates.
   - Do not silently auto-switch between `/pwf-work`, `/pwf-work-light`, `/pwf-work-tdd`, or `/pwf-work-plan`.

2. **Predictable and repeatable execution**
   - Prefer explicit steps and deterministic outputs.
   - Keep side-effect commands explicit and non-automatic.

3. **Durable documentation**
   - `docs/` is operational memory.
   - Keep docs aligned with implemented state.

## MCP Integration

- **Documentation retrieval**: Context7 MCP for library/framework docs
  - Server: `context7` (npx -y @upstash/context7-mcp)
  - Required flow: `resolve-library-id` → `query-docs`
  - Use whenever implementation depends on external library/framework docs

## Agent Organization

Agents are organized by domain in `.opencode/agents/`:

- **research**: Exploration and information gathering
- **review**: Code review and quality assurance
- **docs**: Documentation generation and maintenance
- **workflow**: Workflow execution and orchestration
- **design**: UI/UX design and component generation

## Skills

Reusable skills in `.opencode/skills/`:

**Workflow & Process:**
- Commit orchestration, code review workflows, debugging discipline
- Git worktree management, branch lifecycle, verification gates

**Technology Conventions:**
- Framework-specific patterns (NestJS, Angular, Next.js)
- Deployment workflows (Lambda, containers)

**Quality & Maintenance:**
- Fast validation without full builds
- Documentation maintenance and baseline loading
- Test-driven development (opt-in)

## Multi-agent Orchestration

Parallel subagents are encouraged when tasks are independent.

Guardrails:
- Keep one orchestrator owner.
- Use explicit role boundaries.
- Merge outputs into a single deterministic decision.
- Ask user before broad/high-risk autonomous execution.

## Minimal Validation Before Release/Commit

Run:
1. Lint/diagnostic checks for edited files
2. Fast validation: `npm run validate` (or project equivalent)
3. Docs consistency check for updated workflow commands

---

# Operational Guardrails

## Policy hierarchy (who decides what)

1. User explicit instruction in the current chat
2. Project override file (if present): `docs/workflow/operational-overrides.md`
3. This file as default policy

If a project override exists, follow it for project-specific behavior.
If no override exists, use the defaults below.

## Default AWS operations policy (recommended, not forced)

- Run `aws sso login --profile <aws-profile>` before AWS CLI commands when applicable.
- Do not deploy through IAC/CDK unless project-specific rules explicitly allow it.

## Default Lambda deployment policy

- Lambda deployment uses project deployment scripts only.
- Use command `/pwf-aws-lambda-deploy` for guided Lambda deploy flow.

## Completion claims (always required)

- No "done/fixed/passing" claims without fresh verification evidence.
- Include command, exit status, and key output in the completion message.

## Verification evidence format

- `Command:` executed command
- `Result:` exit code/status
- `Evidence:` key output lines
- `Limitation:` partial coverage or constraints (if any)

## TypeORM migration discipline (default)

TypeORM migrations follow this atomic chain:

1. Generate migration (`typeorm:generate`)
2. Drift-check new migration (`schema-drift-detector`)
3. Run migration locally immediately (`typeorm:run`)

If step 3 fails, stop and fix before continuing other tasks.

---

# Commit Messages

- **ALWAYS write commit messages in English**
- **ALWAYS put a [TICKET-XXXX] prefix to the commit message** — ASK the user for the ticket number if not provided.
- Use conventional commit format with emojis when appropriate
- Format: `[TICKET-XXXX] <emoji> <type>(<scope>): <subject>`

## Commit Types

- `🚀 feat`: New feature
- `🐛 fix`: Bug fix
- `📝 docs`: Documentation changes
- `♻️ refactor`: Code refactoring
- `✅ test`: Adding or updating tests
- `⚡ perf`: Performance improvements
- `🔧 chore`: Maintenance tasks
- `🎨 style`: Code style changes (formatting, etc.)
- `🔒 security`: Security fixes
- `🚧 wip`: Work in progress

## Examples

- `[TICKET-1234] 🚀 feat(auth): add JWT authentication`
- `[TICKET-1234] 🐛 fix(api): resolve CORS configuration issue`
- `[TICKET-1234] 📝 docs: update README with deployment instructions`
- `[TICKET-1234] ♻️ refactor(users): improve service structure`
- `[TICKET-1234] ✅ test: add unit tests for auth service`
- `[TICKET-1234] ⚡ perf(database): optimize query performance`

## Guidelines

- Keep subject line under 50 characters when possible
- Use imperative mood ("add" not "added" or "adds")
- First line should be a summary
- Add detailed description in body if needed (separated by blank line)

---

# Build Policy

## TypeScript Validation (Default)

During implementation and development:
- **ALWAYS** run `tsc --noEmit` or `npm run validate` for fast type checking
- **NEVER** run `npm run build` or `next build` automatically
- Fix ALL TypeScript and lint errors before claiming completion

## Full Build (Explicit Only)

Run full build ONLY when:
1. User explicitly requests: "run the build", "build the project", etc.
2. Preparing for deployment
3. Investigating complex build-specific issues that TypeScript check cannot catch

## Anti-patterns (FORBIDDEN)

- Running `npm run build` after every small change
- Running `npm run build` as a default verification step
- Using build as a type-checking substitute

## Correct Workflow

1. After implementing changes → Run `npm run validate` or `tsc --noEmit`
2. Fix all type/lint errors
3. Report evidence: "TypeScript check: 0 errors"
4. Only run build if user explicitly asks or for deployment

## Rationale

- **Speed**: TypeScript check is ~80% faster than full build
- **Feedback loop**: Quick iteration without bundling overhead
- **Same error detection**: Catches same TypeScript and lint issues
- **Resource efficiency**: No unnecessary asset compilation

---

# TypeORM Migrations - CLI Only

## CRITICAL: Always Use TypeORM CLI for Migrations

**IMPORTANT**: You **MUST NEVER** create migration files manually. Always use the TypeORM CLI to generate migrations automatically based on entity definitions.

## CRITICAL: Generate → Drift-Check → Run IMMEDIATELY (Atomic Chain)

**THIS IS THE #1 SOURCE OF PRODUCTION BUGS.** When a migration is generated but NOT run on the local database immediately, the next `typeorm:generate` compares against the OLD schema and produces a migration with **schema drift** — it re-includes changes from the unrun migration plus new changes, creating a broken migration that will fail in production.

**THE RULE: Every migration MUST be run on the local DB immediately after generation. Never defer. Never skip. Never "do it later."**

The atomic chain (NEVER break this sequence):

1. Generate:     npm run typeorm:generate -- src/database/migrations/MigrationName
2. Drift-check:  Run schema-drift-detector agent on the new file → fix any unrelated changes
3. Run locally:  npm run typeorm:run  (or  npm run dev:migrate  for Docker)
4. Verify:       If typeorm:run fails → STOP. Fix the issue before continuing.

**BLOCKING:** Do NOT proceed to the next task, the next entity change, or the next migration until step 3 succeeds. If you need to generate a second migration in the same session, the first one MUST be run first.

**Production deployment:** Use project-specific migration scripts (e.g. `npm run migrate:localtoprod`) that:
1. Run `typeorm:run` on local DB first (fails fast if local is broken)
2. Run guard scripts to block schema dumps and wrong-baseline migrations
3. Only then run migrations on the production DB

**NEVER edit past migrations.** If a migration is wrong, create a new corrective migration.

## Why This Rule Exists

1. **Automatic Schema Detection**: TypeORM CLI compares the current database schema with entity definitions and generates the exact SQL needed
2. **Consistency**: Ensures migrations match entity definitions exactly
3. **Error Prevention**: Avoids manual errors in SQL generation
4. **Drift Prevention**: Running immediately keeps the local DB in sync so future generations are clean

## Available Commands

From backend `package.json`:

```bash
# Generate migration (compare entities with database)
npm run typeorm:generate -- src/database/migrations/MigrationName

# Create empty migration (only if absolutely necessary for custom SQL)
npm run typeorm:create -- src/database/migrations/MigrationName

# Run migrations
npm run typeorm:run

# Revert last migration
npm run typeorm:revert

# Show migration status
npm run typeorm:show
```

## Workflow: Creating a New Migration

### Step 1: Create or Update Entities

1. Create new entity files in `backend/src/database/entities/` (or project-specific path)
2. Update existing entities with new fields, relationships, or indexes
3. Ensure all `@Entity()`, `@Column()`, `@Index()`, `@ManyToOne()`, `@OneToMany()`, etc. decorators are correct

### Step 2: Update Related Entities

If adding relationships:
- Add `@OneToMany()` in the parent entity
- Add `@ManyToOne()` in the child entity
- Ensure `@JoinColumn()` is properly configured

### Step 3: Generate Migration

```bash
cd backend
npm run typeorm:generate -- src/database/migrations/DescriptiveMigrationName
```

### Step 4: Review Generated Migration

1. **Check the generated migration file** in `backend/src/database/migrations/`
2. **Verify**: All tables, indexes, foreign keys, column types match entity definitions
3. **Add custom constraints** (if needed): CHECK constraints, triggers, data migrations — only what TypeORM doesn't generate

### Step 5: Schema-drift check and run local migrations (required in /pwf-work and /pwf-work-plan)

After generating a migration, always:

1. **Run the schema-drift-detector** on the new migration file(s). Fix any unrelated table or column changes.
2. **Run migrations on the local database** so the schema stays aligned for the next phase.

### Step 6: Test Migration

```bash
npm run typeorm:run
npm run typeorm:revert  # Test rollback
npm run typeorm:run     # Apply again
```

## What NEVER to Do

❌ **NEVER create migration files manually** by copying templates or writing SQL from scratch

❌ **NEVER edit generated migrations** to change schema (instead, update entities and regenerate)

❌ **NEVER skip entity definitions** and write migrations directly

❌ **NEVER delete migration files** that have already been run in production

## Remember

**Entity definitions → TypeORM CLI → Migration file**

Never skip the middle step. Always let TypeORM generate migrations from your entity definitions.

---

# Prisma Migrations - CLI Only

## CRITICAL: Always Use Prisma CLI for Migrations

**IMPORTANT**: You **MUST NEVER** create migration files manually. Always use the Prisma CLI to generate migrations automatically based on schema changes.

## CRITICAL: Generate → Drift-Check → Run IMMEDIATELY (Atomic Chain)

**THIS IS THE #1 SOURCE OF PRODUCTION BUGS.** When a migration is generated but NOT run on the local database immediately, the next `prisma migrate dev` compares against the OLD schema and produces a migration with **schema drift**.

**THE RULE: Every migration MUST be applied on the local DB immediately after generation. Never defer. Never skip. Never "do it later."**

The atomic chain (NEVER break this sequence):

1. Generate:     npx prisma migrate dev --name MigrationName
2. Drift-check:  Review the generated migration SQL → fix any unrelated changes
3. Run locally:  npx prisma migrate dev (or npx prisma migrate deploy for non-dev)
4. Verify:       If migration fails → STOP. Fix the issue before continuing.

**BLOCKING:** Do NOT proceed to the next task, the next schema change, or the next migration until step 3 succeeds.

**Production deployment:** Use `npx prisma migrate deploy` (not `migrate dev`) in production/staging.

**NEVER edit past migrations.** If a migration is wrong, create a new corrective migration.

## Available Commands

From project root:

```bash
# Generate and apply migration (development)
npx prisma migrate dev --name MigrationName

# Generate migration without applying (for review)
npx prisma migrate dev --name MigrationName --create-only

# Apply pending migrations (production/deployment)
npx prisma migrate deploy

# Reset database and reapply all migrations (DANGER - dev only)
npx prisma migrate reset

# Show migration status
npx prisma migrate status

# Generate Prisma Client after schema changes
npx prisma generate
```

## Workflow: Creating a New Migration

### Step 1: Update Schema

1. Edit `prisma/schema.prisma`
2. Add/modify models, fields, relationships, indexes
3. Ensure all `@id`, `@default`, `@relation`, `@index`, `@unique` attributes are correct

### Step 2: Generate Migration

```bash
npx prisma migrate dev --name DescriptiveMigrationName
```

### Step 3: Review Generated Migration

1. **Check the generated SQL** in `prisma/migrations/<timestamp>_<name>/migration.sql`
2. **Verify**: All tables, indexes, foreign keys, column types match schema
3. **Add custom SQL** (if needed): Run additional SQL after migration for constraints/triggers

### Step 4: Schema-drift check and verify (required in /pwf-work and /pwf-work-plan)

After generating a migration, always:

1. **Review the generated SQL** for unrelated table or column changes
2. **Run migrations on the local database** so the schema stays aligned
3. **Generate Prisma Client**: `npx prisma generate`

### Step 5: Test Migration

```bash
npx prisma migrate status    # Check pending
npx prisma migrate deploy    # Test deploy (if using --create-only before)
```

## What NEVER to Do

❌ **NEVER create migration files manually** by copying templates or writing SQL from scratch

❌ **NEVER edit generated migrations** to change schema (instead, update schema and regenerate)

❌ **NEVER skip schema changes** and write migrations directly

❌ **NEVER delete migration files** that have already been run in production

❌ **NEVER use `migrate dev` in production** - always use `migrate deploy`

## Remember

**Schema changes → Prisma CLI → Migration file → Database**

Never skip the CLI step. Always let Prisma generate migrations from your schema.

---

# Context7 — Library Documentation First

**Always** use the Context7 MCP to fetch up-to-date documentation before implementing features or debugging issues that involve libraries or frameworks.

## How to Use

1. **Resolve library ID:** Call `resolve-library-id` (Context7 MCP server) with `libraryName` and `query`.
2. **Fetch docs:** Call `query-docs` with the resolved `libraryId` and a specific `query`.

## Known Library IDs (Powzz Stack)

- `/prisma/prisma` — Prisma ORM
- `/vercel/next.js` — Next.js framework
- `/supabase/supabase` — Supabase client/SDK
- `/anthropic/anthropic-typescript-sdk` — Anthropic/Claude SDK
- `/nestjs/docs.nestjs.com` — NestJS official docs (reference pattern)

For other libraries, resolve the ID first with `resolve-library-id`.

## When to Use

- Before implementing with Prisma, Next.js, Supabase, or any external library
- When checking schema patterns, API routes, or React Server Components
- When debugging framework-specific behavior
- When verifying migration guides or version-specific patterns

---

# No Unsolicited Markdown Files

**NEVER** create `.md` files spontaneously. Only create them when:

1. The user explicitly asks ("create a README", "document this in markdown")
2. A **workflow command** instructs it — these commands create `.md` files as part of their defined output:
   - `/pwf-brainstorm` → `docs/brainstorms/*.md`
   - `/pwf-plan` → `docs/plans/*.md`
   - `/pwf-doc-capture` → `docs/solutions/*.md`
   - `/pwf-doc` → `docs/infrastructure/*.md`, `docs/modules/*.md`, `docs/features/*.md`, `docs/decisions/*.md`
   - `/pwf-doc-foundation` → `docs/infrastructure.md`, `docs/architecture.md`, `docs/integrations.md`, `docs/environments.md`, `docs/glossary.md`
   - `/pwf-doc-runbook` → `docs/runbooks/*.md`, `docs/runbooks/README.md`
   - `/pwf-work` and `/pwf-work-plan` → update existing docs (module, feature, Lambda, pattern docs)
3. Updating an **existing** `.md` file as part of a code task (e.g. updating docs that reference changed code)

**NEVER** create unsolicited summary files, changelog files, or documentation files outside of the above cases. Provide summaries directly in chat.

---

# Docs Scope Boundary

Never mix these two `docs/` scopes:

1. **Plugin docs scope:** Root `docs/` in this workspace documents the plugin itself.
2. **Project docs scope:** `docs/` created/updated by workflow commands in the user's project.

## Required behavior

- For `/pwf-setup`, `/pwf-work`, `/pwf-work-plan`, `/pwf-work-light`, `/pwf-work-tdd`, always operate on the **target project** docs tree.
- Do not treat this repository root `docs/` as the target project docs unless the user explicitly says this repo is the target project.
- If scope is ambiguous, ask which docs scope to use before writing files.

## Canonical project docs paths

Use these paths (no `pwf-` directory prefixes):

- `docs/infrastructure.md`
- `docs/architecture.md`
- `docs/integrations.md`
- `docs/environments.md`
- `docs/glossary.md`
- `docs/runbooks/`
- `docs/runbooks/README.md`
- `docs/brainstorms/`
- `docs/plans/`
- `docs/work-plans/`
- `docs/workflow/operational-overrides.md`
- `docs/solutions/`
- `docs/modules/`
- `docs/features/`
- `docs/lambdas/`
- `docs/decisions/`

---

# Agent Namespace Convention

When referencing plugin agents in prompts, use paths relative to `.opencode/agents/`:

- `agents/research/<agent-name>`
- `agents/review/<agent-name>`
- `agents/docs/<agent-name>`
- `agents/workflow/<agent-name>`
- `agents/design/<agent-name>`

Avoid short names alone when the context is ambiguous.

---

# Command Naming Prefixes

Use explicit technology prefixes for commands that are bound to a specific platform, provider, or framework.

## Rule

- If a command is technology-specific, its name MUST start with that technology prefix.
- If a command is provider-specific, include the provider prefix first.
- Keep framework-agnostic commands generic (do not add unnecessary prefixes).

## Naming format

- Preferred format: `<provider>-<technology>-<action>`
- Example for AWS Lambda deploy: `aws-lambda-deploy`

## Examples

- `aws-lambda-deploy` (AWS-specific Lambda deploy workflow)
- `stripe-webhook-sync` (Stripe-specific operation)
- `angular-component-audit` (Angular-specific operation)

## Anti-examples

- `deploy-lambda` (missing provider/technology prefix)
- `deploy` (too generic for a tech-specific operation)

When creating or renaming commands, always apply this convention and update workflow docs accordingly.
