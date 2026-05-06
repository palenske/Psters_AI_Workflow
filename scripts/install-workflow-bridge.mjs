#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const WINDSURF_SRC = path.join(REPO_ROOT, ".windsurf");
const OPENCODE_SRC = path.join(REPO_ROOT, ".opencode");

function printHelp() {
  console.log(`Usage:
  node scripts/install-workflow-bridge.mjs [--to windsurf|opencode|all] [--project <path>]

Examples:
  node scripts/install-workflow-bridge.mjs --to windsurf --project /path/to/target-project
  node scripts/install-workflow-bridge.mjs --to opencode --project /path/to/target-project
  node scripts/install-workflow-bridge.mjs --to all --project /path/to/target-project
`);
}

function parseArgs(argv) {
  const args = {
    to: "all",
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

  if (!["windsurf", "opencode", "all"].includes(args.to)) {
    throw new Error(`Invalid --to value: ${args.to}. Must be windsurf, opencode, or all.`);
  }
  if (!args.project) {
    throw new Error("Missing --project value");
  }
  return args;
}

async function installWindsurf(projectPath) {
  const targetDir = path.join(projectPath, ".windsurf");

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.cp(WINDSURF_SRC, targetDir, { recursive: true });

  return { windsurfDir: targetDir };
}

async function installOpenCode(projectPath) {
  const targetDir = path.join(projectPath, ".opencode");

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.cp(OPENCODE_SRC, targetDir, { recursive: true });

  return { opencodeDir: targetDir };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectPath = path.resolve(args.project);

  const runWindsurf = args.to === "windsurf" || args.to === "all";
  const runOpenCode = args.to === "opencode" || args.to === "all";

  if (runWindsurf) {
    console.log("\nInstalling for Windsurf...");
    const result = await installWindsurf(projectPath);
    console.log(`Installed .windsurf/ to: ${result.windsurfDir}`);
  }

  if (runOpenCode) {
    console.log("\nInstalling for OpenCode...");
    const result = await installOpenCode(projectPath);
    console.log(`Installed .opencode/ to: ${result.opencodeDir}`);
  }

  console.log("\nDone. Restart your editor to activate the workflow.");
  console.log("Start with: /pwf-help");
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
