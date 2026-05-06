# Windsurf + OpenCode

This workflow is officially supported on **Windsurf** and **OpenCode**.

Both platforms provide native slash command support, specialized agents, reusable skills, and documentation-first workflows. Choose the one that fits your environment — the methodology is identical.

---

## Supported environments

| Feature | Windsurf | OpenCode |
|---------|----------|----------|
| Native slash commands | ✅ | ✅ |
| Rules / global context | ✅ `.windsurf/rules/` + `AGENTS.md` | ✅ `.opencode/AGENTS.md` |
| Lifecycle hooks | ✅ extensions system | ✅ embedded in commands |
| Sub-agents (parallel research) | ✅ | ✅ via `@agent` mention |
| Skills auto-discovery | ✅ | ✅ |
| MCP integration | ✅ `mcp.json` | ✅ `opencode.json` |
| Presets | ✅ `presets/presets.json` | ✅ via input |
| Auto-updates | Manual (copy) | Manual (copy) |

---

## Windsurf

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. Copy `.windsurf/` to your project root:

   ```bash
   cp -r Psters_AI_Workflow/.windsurf/ /path/to/your-project/
   ```

3. Restart Windsurf.

### Usage

Run the workflow in Windsurf exactly as designed:

```
/pwf-brainstorm add user authentication with JWT
/pwf-plan
/pwf-work-plan
/pwf-review
/pwf-commit-changes
```

### What works in Windsurf

- **All slash commands work natively.** Workflow files in `.windsurf/workflows/` are invoked as `/pwf-*`.
- **Rules work automatically.** All `.mdc` files in `.windsurf/rules/` are loaded with `alwaysApply: true`.
- **Extensions system works.** Lifecycle hooks (`before_plan`, `after_plan`, `before_work`, `after_work`) provide advisory guidance.
- **Agents work natively.** Windsurf can spawn subagents directly from workflow commands.
- **Skills are auto-discovered.** `.windsurf/skills/` are loaded on demand.
- **Presets are available.** `presets/presets.json` influences planning emphasis.

### Keeping up to date

```bash
cd Psters_AI_Workflow && git pull
cp -r .windsurf/ /path/to/your-project/
```

---

## OpenCode

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/J-Pster/Psters_AI_Workflow.git
   ```

2. Copy `.opencode/` to your project root:

   ```bash
   cp -r Psters_AI_Workflow/.opencode/ /path/to/your-project/
   ```

3. Restart OpenCode.

### Usage

Run the workflow in OpenCode:

```
/pwf-brainstorm add user authentication with JWT
/pwf-plan
/pwf-work-plan
```

Invoke subagents via `@` mention:

```
@repo-research-analyst Map all existing code related to user authentication
@security-sentinel Review this endpoint for security vulnerabilities
```

### What works in OpenCode

- **All slash commands work natively.** Command files in `.opencode/commands/` are invoked as `/pwf-*`.
- **Rules consolidated in AGENTS.md.** All operational guardrails, commit standards, migration discipline, and build policies are loaded from `.opencode/AGENTS.md`.
- **Agents work as subagents.** Defined in `.opencode/agents/`, invoked via `@agent-name`.
- **Skills are auto-discovered.** `.opencode/skills/` are loaded on demand via the `skill` tool.
- **MCP integration configured.** Context7 is set up via `.opencode/opencode.json`.

### Keeping up to date

```bash
cd Psters_AI_Workflow && git pull
cp -r .opencode/ /path/to/your-project/
```

---

## Both platforms at once

Install for both Windsurf and OpenCode:

```bash
cp -r Psters_AI_Workflow/.windsurf/ /path/to/your-project/
cp -r Psters_AI_Workflow/.opencode/ /path/to/your-project/
```

---

## Summary

**Windsurf and OpenCode are the official platforms.** Both provide full workflow support with slash commands, agents, skills, and documentation discipline. The methodology is identical — choose your preferred editor.
