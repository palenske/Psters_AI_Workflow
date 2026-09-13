import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const AGENTS_DIR = path.join(process.cwd(), ".opencode", "agents");

function listAgentFiles() {
  const files = [];
  for (const category of readdirSync(AGENTS_DIR, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;
    const categoryDir = path.join(AGENTS_DIR, category.name);
    for (const file of readdirSync(categoryDir)) {
      if (file.endsWith(".md")) {
        files.push({
          relativePath: `${category.name}/${file}`,
          fullPath: path.join(categoryDir, file)
        });
      }
    }
  }
  return files;
}

test("every agent has well-formed frontmatter with an explicit tools/permission policy", () => {
  const files = listAgentFiles();
  assert.ok(files.length > 0, "expected to find agent files under .opencode/agents");

  for (const { relativePath, fullPath } of files) {
    const content = readFileSync(fullPath, "utf8");
    const match = content.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(match, `${relativePath}: missing YAML frontmatter block`);

    const frontmatter = match[1];
    assert.match(frontmatter, /^description:/m, `${relativePath}: missing description`);
    assert.match(frontmatter, /^mode: subagent/m, `${relativePath}: expected mode: subagent`);
    assert.match(frontmatter, /^tools:/m, `${relativePath}: missing tools: policy`);
    assert.match(frontmatter, /^permission:/m, `${relativePath}: missing permission: policy`);
  }
});

test("read-only categories (research, review) never allow edit/write/patch", () => {
  const files = listAgentFiles().filter(
    ({ relativePath }) => relativePath.startsWith("research/") || relativePath.startsWith("review/")
  );
  assert.ok(files.length > 0);

  for (const { relativePath, fullPath } of files) {
    const content = readFileSync(fullPath, "utf8");
    assert.match(content, /write: false/, `${relativePath}: research/review agents must not have write access`);
    assert.match(content, /edit: false/, `${relativePath}: research/review agents must not have edit access`);
    assert.match(content, /permission:\n\s+edit: deny/, `${relativePath}: research/review agents must deny edit permission`);
  }
});
