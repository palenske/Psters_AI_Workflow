#!/usr/bin/env node
//
// Verifies that the shields.io badge counts in README.md
// (commands / agents / rules / skills) match what actually exists in
// `.opencode/`. Run with `--fix` to rewrite the badges in place instead of
// just failing.
//
// This replaces a previous test (tests/scripts/release-script-guardrails
// .test.mjs) that asserted the existence of a `scripts/release-plugin.sh`
// version-drift checker. That script never existed anywhere in this repo,
// and nothing in CI ever ran it — the badge-count drift it was presumably
// meant to catch (README said "agents: 46" while 51 existed, "skills: 21"
// while 23 existed) is the real, currently-observable version of that
// problem, so this script targets that instead.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const README_PATH = path.join(ROOT, "README.md");

function countFiles(dir, { extension, maxDepth = Infinity } = {}) {
  let count = 0;
  function walk(current, depth) {
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (depth < maxDepth) walk(full, depth + 1);
      } else if (!extension || entry.name.endsWith(extension)) {
        count += 1;
      }
    }
  }
  walk(dir, 0);
  return count;
}

function countSkillDirs(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).filter((entry) => {
      if (!entry.isDirectory()) return false;
      try {
        return statSync(path.join(dir, entry.name, "SKILL.md")).isFile();
      } catch {
        return false;
      }
    }).length;
  } catch {
    return 0;
  }
}

export function computeCounts(root = ROOT) {
  return {
    commands: countFiles(path.join(root, ".opencode", "commands"), { extension: ".md", maxDepth: 0 }),
    agents: countFiles(path.join(root, ".opencode", "agents"), { extension: ".md" }),
    rules: countFiles(path.join(root, ".opencode", "rules"), { extension: ".mdc", maxDepth: 0 }),
    skills: countSkillDirs(path.join(root, ".opencode", "skills"))
  };
}

const BADGE_PATTERNS = {
  commands: /(badge\/commands-)(\d+)(-)/,
  agents: /(badge\/agents-)(\d+)(-)/,
  rules: /(badge\/rules-)(\d+)(-)/,
  skills: /(badge\/skills-)(\d+)(-)/
};

function main() {
  const fix = process.argv.includes("--fix");
  const counts = computeCounts();
  const readme = readFileSync(README_PATH, "utf8");

  const mismatches = [];
  let updated = readme;

  for (const [key, pattern] of Object.entries(BADGE_PATTERNS)) {
    const match = readme.match(pattern);
    if (!match) continue;
    const badgeValue = Number(match[2]);
    const actual = counts[key];
    if (badgeValue !== actual) {
      mismatches.push({ key, badgeValue, actual });
      updated = updated.replace(pattern, `$1${actual}$3`);
    }
  }

  if (mismatches.length === 0) {
    console.log("README badges match actual counts:", counts);
    return;
  }

  if (fix) {
    writeFileSync(README_PATH, updated);
    console.log("Updated README badges:");
    for (const m of mismatches) {
      console.log(`  ${m.key}: ${m.badgeValue} -> ${m.actual}`);
    }
    return;
  }

  console.error("README badge counts are out of date:");
  for (const m of mismatches) {
    console.error(`  ${m.key}: badge says ${m.badgeValue}, actual is ${m.actual}`);
  }
  console.error("Run `node scripts/check-readme-badges.mjs --fix` to update them.");
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
