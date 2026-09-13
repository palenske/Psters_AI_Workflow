import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("check-platform-parity.mjs runs and reports the known .opencode-only skills", () => {
  const result = spawnSync("node", ["scripts/check-platform-parity.mjs", "--json"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  assert.equal(result.status, 0, `expected a clean run, got: ${result.stderr}`);

  const report = JSON.parse(result.stdout);
  const skills = report.find((r) => r.name === "skills");
  assert.ok(skills, "expected a skills section in the report");

  // These three skills are known, current orphans (added to .opencode only).
  // If this test starts failing because the array is now empty, that's
  // good news — someone ported them to .windsurf too and this assertion
  // should be relaxed/removed.
  for (const skill of ["bullmq", "prisma", "typeorm"]) {
    assert.ok(
      skills.onlyOpencode.includes(skill),
      `expected "${skill}" to still be .opencode-only; update this test if it was ported`
    );
  }
});

test("check-platform-parity.mjs --fail-on-orphans exits non-zero while orphans exist", () => {
  const result = spawnSync("node", ["scripts/check-platform-parity.mjs", "--fail-on-orphans"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  // This repo currently has known orphans (bullmq/prisma/typeorm skills), so
  // this flag should fail today. Once parity is reached, flip this
  // assertion and wire --fail-on-orphans into CI to keep it that way.
  assert.equal(result.status, 1);
});
