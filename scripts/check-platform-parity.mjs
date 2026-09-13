#!/usr/bin/env node
//
// This plugin ships near-duplicate content for two platforms:
// `.opencode/{agents,skills,commands}` and
// `.windsurf/{agents,skills,workflows}`. They are NOT generated from a
// single source — they are hand-adapted copies (different frontmatter
// dialects, different invocation models, sometimes genuinely different
// wording for the same behavior). Auto-merging them into one source of
// truth risks silently degrading whichever side wasn't "canonical" for a
// given file, which is why this script does not attempt that.
//
// Instead, this is a drift *detector*: it tells you which items exist on
// only one platform (orphans) and, for items that exist on both, whether
// their content actually diverges — surfacing the maintenance burden
// concretely so a human can decide, file by file, whether the divergence is
// intentional (platform-specific adaptation) or accidental (one side forgot
// to update). Run it after editing either tree.
//
// Usage:
//   node scripts/check-platform-parity.mjs            # human-readable report
//   node scripts/check-platform-parity.mjs --json      # machine-readable
//   node scripts/check-platform-parity.mjs --fail-on-orphans
//     exits 1 if any file exists on only one platform (safe to wire into CI;
//     content drift alone does not fail the build, since some divergence is
//     expected and intentional)

import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// category -> [opencodeDir, windsurfDir, opencodeExt/dirMode, windsurfExt/dirMode]
const MAPPINGS = [
  { name: "commands/workflows", opencode: ".opencode/commands", windsurf: ".windsurf/workflows", mode: "files" },
  { name: "agents", opencode: ".opencode/agents", windsurf: ".windsurf/agents", mode: "files" },
  { name: "skills", opencode: ".opencode/skills", windsurf: ".windsurf/skills", mode: "skill-dirs" }
];

function listFilesRecursive(dir) {
  const results = [];
  function walk(current, prefix) {
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(current, entry.name), rel);
      } else if (entry.name.endsWith(".md")) {
        results.push(rel);
      }
    }
  }
  walk(dir, "");
  return results;
}

function listSkillIds(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .filter((name) => {
        try {
          return statSync(path.join(dir, name, "SKILL.md")).isFile();
        } catch {
          return false;
        }
      });
  } catch {
    return [];
  }
}

function bodyWithoutFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
}

function compareFile(opencodePath, windsurfPath) {
  let a, b;
  try {
    a = readFileSync(opencodePath, "utf8");
  } catch {
    return "missing-opencode";
  }
  try {
    b = readFileSync(windsurfPath, "utf8");
  } catch {
    return "missing-windsurf";
  }
  return bodyWithoutFrontmatter(a) === bodyWithoutFrontmatter(b) ? "identical" : "diverged";
}

function checkFilesCategory(mapping) {
  const opencodeDir = path.join(ROOT, mapping.opencode);
  const windsurfDir = path.join(ROOT, mapping.windsurf);
  const opencodeFiles = new Set(listFilesRecursive(opencodeDir));
  const windsurfFiles = new Set(listFilesRecursive(windsurfDir));

  const onlyOpencode = [...opencodeFiles].filter((f) => !windsurfFiles.has(f));
  const onlyWindsurf = [...windsurfFiles].filter((f) => !opencodeFiles.has(f));
  const both = [...opencodeFiles].filter((f) => windsurfFiles.has(f));

  const diverged = both.filter(
    (f) => compareFile(path.join(opencodeDir, f), path.join(windsurfDir, f)) === "diverged"
  );

  return { name: mapping.name, onlyOpencode, onlyWindsurf, both: both.length, diverged };
}

function checkSkillsCategory(mapping) {
  const opencodeDir = path.join(ROOT, mapping.opencode);
  const windsurfDir = path.join(ROOT, mapping.windsurf);
  const opencodeIds = new Set(listSkillIds(opencodeDir));
  const windsurfIds = new Set(listSkillIds(windsurfDir));

  const onlyOpencode = [...opencodeIds].filter((id) => !windsurfIds.has(id));
  const onlyWindsurf = [...windsurfIds].filter((id) => !opencodeIds.has(id));
  const both = [...opencodeIds].filter((id) => windsurfIds.has(id));

  const diverged = both.filter(
    (id) =>
      compareFile(
        path.join(opencodeDir, id, "SKILL.md"),
        path.join(windsurfDir, id, "SKILL.md")
      ) === "diverged"
  );

  return { name: mapping.name, onlyOpencode, onlyWindsurf, both: both.length, diverged };
}

function main() {
  const asJson = process.argv.includes("--json");
  const failOnOrphans = process.argv.includes("--fail-on-orphans");

  const results = MAPPINGS.map((mapping) =>
    mapping.mode === "skill-dirs" ? checkSkillsCategory(mapping) : checkFilesCategory(mapping)
  );

  if (asJson) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log("Platform parity report: .opencode vs .windsurf\n");
    for (const r of results) {
      console.log(`## ${r.name}`);
      console.log(`  present on both: ${r.both}`);
      console.log(`  content diverges on both platforms: ${r.diverged.length}`);
      if (r.diverged.length) console.log(`    ${r.diverged.join(", ")}`);
      console.log(`  only in .opencode: ${r.onlyOpencode.length}`);
      if (r.onlyOpencode.length) console.log(`    ${r.onlyOpencode.join(", ")}`);
      console.log(`  only in .windsurf: ${r.onlyWindsurf.length}`);
      if (r.onlyWindsurf.length) console.log(`    ${r.onlyWindsurf.join(", ")}`);
      console.log("");
    }
    console.log(
      "Note: divergent content is expected (platform-specific adaptation) and\n" +
        "does not fail this check. Orphans (present on only one platform) are\n" +
        "usually worth a deliberate decision: port it, or document why it's\n" +
        "platform-specific."
    );
  }

  if (failOnOrphans) {
    const hasOrphans = results.some((r) => r.onlyOpencode.length > 0 || r.onlyWindsurf.length > 0);
    if (hasOrphans) process.exit(1);
  }
}

main();
