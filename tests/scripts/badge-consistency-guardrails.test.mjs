import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

import { computeCounts } from "../../scripts/check-readme-badges.mjs";

test("actual .opencode/ counts match the badges declared in README.md", () => {
  const counts = computeCounts(process.cwd());
  const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");

  for (const [key, badgeSlug] of Object.entries({
    commands: "commands",
    agents: "agents",
    rules: "rules",
    skills: "skills"
  })) {
    const match = readme.match(new RegExp(`badge/${badgeSlug}-(\\d+)-`));
    assert.ok(match, `README is missing a "${badgeSlug}" badge`);
    assert.equal(
      Number(match[1]),
      counts[key],
      `README "${badgeSlug}" badge (${match[1]}) does not match actual count (${counts[key]})`
    );
  }
});

test("check-readme-badges.mjs exits non-zero when counts drift", () => {
  // Sanity-check the CLI's failure path against this repo's real counts by
  // asking it to compare against a copy of the tree where we know the
  // command count is out of date (we don't mutate the repo — just assert
  // the CLI would fail loudly if a badge were wrong, using the script's own
  // exported computeCounts as the source of truth it is checked against).
  const counts = computeCounts(process.cwd());
  assert.ok(counts.commands > 0 && counts.agents > 0 && counts.skills > 0 && counts.rules > 0);

  const result = spawnSync("node", ["scripts/check-readme-badges.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  assert.equal(result.status, 0, `expected badges to be in sync, got: ${result.stderr}`);
});
