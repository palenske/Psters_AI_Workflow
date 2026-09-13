#!/usr/bin/env node
//
// Adds an explicit `tools:` / `permission:` block to every agent's YAML
// frontmatter in `.opencode/agents/`, per OpenCode's documented agent schema
// (https://opencode.ai/docs/agents). Previously, agents relied purely on
// prose ("keep one orchestrator owner", "ask before high-risk execution")
// with no enforcement — any subagent could edit files or run shell commands
// regardless of its stated role. This gives read-only agents (research,
// review, and read-only workflow/design agents) real, OpenCode-enforced
// restrictions instead of only asking nicely.
//
// Idempotent: agents that already declare a `tools:` key are left untouched.
// Re-run safely after adding new agents — only new/unmigrated files change.
//
// Usage: node scripts/apply-agent-permission-defaults.mjs [--dry-run]

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AGENTS_DIR = path.join(ROOT, ".opencode", "agents");

// Read-only: analysis, review, and planning agents that should never edit
// files or run mutating shell commands.
const READ_ONLY = {
  block: {
    tools: { write: false, edit: false, patch: false },
    permission: { edit: "deny", bash: "ask" }
  }
};

// Write-enabled: agents whose entire job is producing or modifying files
// (docs, design iteration, PR-comment implementation).
const WRITE_ENABLED = {
  block: {
    tools: { write: true, edit: true, patch: true },
    permission: { edit: "allow", bash: "ask" }
  }
};

// Category defaults. `docs/*` and `design/*` default to write-enabled
// because that's their job; `research/*` and `review/*` default to
// read-only. `workflow/*` has no safe default (mixed) — every file there
// must appear in FILE_OVERRIDES below, and the script will error if one
// doesn't.
const CATEGORY_DEFAULTS = {
  research: READ_ONLY,
  review: READ_ONLY,
  docs: WRITE_ENABLED,
  design: WRITE_ENABLED,
  workflow: null
};

// Explicit per-agent overrides where the category default is wrong, or
// where the category (workflow) has no safe default at all.
const FILE_OVERRIDES = {
  "workflow/bug-reproduction-validator.md": READ_ONLY, // reproduces bugs, doesn't fix them
  "workflow/lint.md": {
    block: {
      tools: { write: false, edit: false, patch: false },
      permission: { edit: "deny", bash: "allow" } // its whole job is running lint commands
    }
  },
  "workflow/plan-document-reviewer.md": READ_ONLY,
  "workflow/spec-flow-analyzer.md": READ_ONLY,
  "workflow/pr-comment-resolver.md": WRITE_ENABLED, // implements requested PR changes
  "design/design-implementation-reviewer.md": READ_ONLY // reviews design vs implementation, doesn't edit
};

function toYamlBlock(block, indent = "") {
  const lines = [];
  lines.push(`${indent}tools:`);
  for (const [key, value] of Object.entries(block.tools)) {
    lines.push(`${indent}  ${key}: ${value}`);
  }
  lines.push(`${indent}permission:`);
  for (const [key, value] of Object.entries(block.permission)) {
    lines.push(`${indent}  ${key}: ${value}`);
  }
  return lines.join("\n");
}

function resolvePolicy(relativePath, category) {
  if (FILE_OVERRIDES[relativePath]) return FILE_OVERRIDES[relativePath];
  const categoryDefault = CATEGORY_DEFAULTS[category];
  if (!categoryDefault) {
    throw new Error(
      `No permission policy for "${relativePath}" — add it to FILE_OVERRIDES ` +
        `in scripts/apply-agent-permission-defaults.mjs.`
    );
  }
  return categoryDefault;
}

function migrateFile(filePath, relativePath, category, dryRun) {
  const content = readFileSync(filePath, "utf8");
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    console.warn(`Skipping ${relativePath}: no YAML frontmatter found.`);
    return false;
  }

  if (/^tools:/m.test(frontmatterMatch[1])) {
    return false; // already migrated
  }

  const policy = resolvePolicy(relativePath, category);
  const block = toYamlBlock(policy.block);
  const newFrontmatter = `${frontmatterMatch[1]}\n${block}`;
  const newContent = content.replace(
    frontmatterMatch[0],
    `---\n${newFrontmatter}\n---\n`
  );

  if (!dryRun) writeFileSync(filePath, newContent);
  return true;
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const categories = readdirSync(AGENTS_DIR, { withFileTypes: true }).filter((e) =>
    e.isDirectory()
  );

  let migrated = 0;
  let skipped = 0;

  for (const categoryEntry of categories) {
    const category = categoryEntry.name;
    const categoryDir = path.join(AGENTS_DIR, category);
    const files = readdirSync(categoryDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const relativePath = `${category}/${file}`;
      const filePath = path.join(categoryDir, file);
      const changed = migrateFile(filePath, relativePath, category, dryRun);
      if (changed) {
        migrated += 1;
        console.log(`${dryRun ? "[dry-run] would update" : "updated"}: ${relativePath}`);
      } else {
        skipped += 1;
      }
    }
  }

  console.log(`\nDone. ${migrated} file(s) migrated, ${skipped} already had tools/permission set.`);
}

main();
