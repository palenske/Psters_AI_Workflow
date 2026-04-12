#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const CURSOR_INSTALL_SCRIPT = path.join(REPO_ROOT, "scripts", "install-plugin-local.sh");
const TRAE_SRC_DIR = path.join(REPO_ROOT, ".trae");
const CLAUDE_SRC_DIR = path.join(REPO_ROOT, ".claude");
const CLAUDE_PLUGIN_SRC_DIR = path.join(REPO_ROOT, ".claude-plugin");

function printHelp() {
  console.log(`Usage:
  node scripts/install-workflow-bridge.mjs [--to cursor|trae|claude-code|all] [--project <path>]

Examples:
  node scripts/install-workflow-bridge.mjs --to cursor
  node scripts/install-workflow-bridge.mjs --to trae --project /path/to/target-project
  node scripts/install-workflow-bridge.mjs --to claude-code --project /path/to/target-project
  node scripts/install-workflow-bridge.mjs --to all --project /path/to/target-project
`);
}

function parseArgs(argv) {
  const args = {
    to: "claude-code",
    project: process.cwd()
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    }
    if (token === "--to") {
      args.to = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--project") {
      args.project = argv[i + 1] || "";
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  if (!["cursor", "trae", "claude-code", "all"].includes(args.to)) {
    throw new Error(`Invalid --to value: ${args.to}`);
  }
  if (!args.project) {
    throw new Error("Missing --project value");
  }
  return args;
}

function installCursor() {
  const result = spawnSync("bash", [CURSOR_INSTALL_SCRIPT], {
    cwd: REPO_ROOT,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    throw new Error("Cursor local plugin installation failed");
  }
}

async function installTrae(projectPath) {
  const targetTraeDir = path.join(projectPath, ".trae");

  // Remove existing directory if it exists
  await fs.rm(targetTraeDir, { recursive: true, force: true });

  // Copy .trae directory
  await fs.cp(TRAE_SRC_DIR, targetTraeDir, { recursive: true });

  return { traeDir: targetTraeDir };
}

async function installClaudeCode(projectPath) {
  const targetClaudeDir = path.join(projectPath, ".claude");
  const targetPluginDir = path.join(projectPath, ".claude-plugin");

  // Remove existing directories if they exist
  await fs.rm(targetClaudeDir, { recursive: true, force: true });
  await fs.rm(targetPluginDir, { recursive: true, force: true });

  // Copy .claude directory
  await fs.cp(CLAUDE_SRC_DIR, targetClaudeDir, { recursive: true });

  // Copy .claude-plugin directory
  await fs.cp(CLAUDE_PLUGIN_SRC_DIR, targetPluginDir, { recursive: true });

  return {
    claudeDir: targetClaudeDir,
    pluginDir: targetPluginDir
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectPath = path.resolve(args.project);

  const runCursor = args.to === "cursor" || args.to === "all";
  const runTrae = args.to === "trae" || args.to === "all";
  const runClaudeCode = args.to === "claude-code" || args.to === "all";

  if (runCursor) {
    console.log("\n📦 Installing for Cursor...");
    installCursor();
  }

  if (runTrae) {
    console.log("\n📦 Installing for Trae...");
    const result = await installTrae(projectPath);
    console.log(`Installed .trae/ directory to: ${result.traeDir}`);
  }

  if (runClaudeCode) {
    console.log("\n📦 Installing for Claude Code...");
    const result = await installClaudeCode(projectPath);
    console.log(`Installed .claude/ directory to: ${result.claudeDir}`);
    console.log(`Installed .claude-plugin/ directory to: ${result.pluginDir}`);
  }

  console.log("\n✅ Done.");
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
