#!/usr/bin/env node
//
// Resolves enabled Windsurf advisory extensions for a given hook point.
//
// NOTE: this is a Windsurf-only concept. Windsurf's extension system is
// advisory-only (it can only suggest a message at a hook point, it cannot
// execute code) — see `.windsurf/extensions/extensions.json` and
// `.windsurf/README.md`. OpenCode has since gained a *real* script-executing
// plugin API instead (see `.opencode/plugins/`), so this resolver is not
// used there.
//
// Previously this pointed at `plugins/psters-ai-workflow/extensions/
// extensions.json`, a path that was removed from the repo in v1.1.0 when
// the Cursor-specific `plugins/` directory was deleted. That left this
// script permanently broken. Fixed to read the real Windsurf extensions
// file, with an override for testing/other layouts.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function resolveExtensionsPath(root) {
  if (process.env.WORKFLOW_EXTENSIONS_PATH) {
    return path.resolve(process.env.WORKFLOW_EXTENSIONS_PATH);
  }
  return path.join(root, ".windsurf", "extensions", "extensions.json");
}

function loadExtensions(extensionsPath) {
  if (!existsSync(extensionsPath)) {
    throw new Error(
      `Extensions file not found: ${extensionsPath}\n` +
        `Set WORKFLOW_EXTENSIONS_PATH to point at your project's ` +
        `.windsurf/extensions/extensions.json if it lives elsewhere.`
    );
  }
  const raw = readFileSync(extensionsPath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.extensions) ? parsed.extensions : [];
}

export function resolveEnabledExtensions(hookPoint, root = process.cwd()) {
  const extensionsPath = resolveExtensionsPath(root);
  return loadExtensions(extensionsPath).filter(
    (ext) => ext && ext.enabled === true && ext.hookPoint === hookPoint
  );
}

function main() {
  const hookPoint = process.argv[2];
  if (!hookPoint) {
    process.stderr.write("Usage: node scripts/resolve-workflow-extensions.mjs <hook-point>\n");
    process.exit(1);
  }

  let enabled;
  try {
    enabled = resolveEnabledExtensions(hookPoint);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        hookPoint,
        count: enabled.length,
        extensions: enabled
      },
      null,
      2
    )}\n`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

