import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const SCRIPT = join(process.cwd(), "scripts", "resolve-workflow-extensions.mjs");

function makeFakeProject() {
  const root = mkdtempSync(join(tmpdir(), "psters-extensions-"));
  const extensionsDir = join(root, ".windsurf", "extensions");
  mkdirSync(extensionsDir, { recursive: true });
  writeFileSync(
    join(extensionsDir, "extensions.json"),
    JSON.stringify({
      version: 1,
      extensions: [
        { id: "enabled-after-plan", enabled: true, hookPoint: "after_plan" },
        { id: "disabled-after-plan", enabled: false, hookPoint: "after_plan" },
        { id: "enabled-before-work", enabled: true, hookPoint: "before_work" }
      ]
    })
  );
  return root;
}

test("resolves only enabled extensions for the requested hook point", () => {
  const root = makeFakeProject();
  try {
    const result = spawnSync("node", [SCRIPT, "after_plan"], {
      cwd: root,
      encoding: "utf8"
    });
    assert.equal(result.status, 0);
    const output = JSON.parse(result.stdout);
    assert.equal(output.count, 1);
    assert.equal(output.extensions[0].id, "enabled-after-plan");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("exits with a clear error when the extensions file is missing", () => {
  const root = mkdtempSync(join(tmpdir(), "psters-extensions-missing-"));
  try {
    const result = spawnSync("node", [SCRIPT, "after_plan"], {
      cwd: root,
      encoding: "utf8"
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Extensions file not found/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("honors WORKFLOW_EXTENSIONS_PATH override", () => {
  const root = mkdtempSync(join(tmpdir(), "psters-extensions-override-"));
  try {
    const customPath = join(root, "custom-extensions.json");
    writeFileSync(
      customPath,
      JSON.stringify({
        extensions: [{ id: "custom", enabled: true, hookPoint: "before_work" }]
      })
    );
    const result = spawnSync("node", [SCRIPT, "before_work"], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, WORKFLOW_EXTENSIONS_PATH: customPath }
    });
    assert.equal(result.status, 0);
    const output = JSON.parse(result.stdout);
    assert.equal(output.count, 1);
    assert.equal(output.extensions[0].id, "custom");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
