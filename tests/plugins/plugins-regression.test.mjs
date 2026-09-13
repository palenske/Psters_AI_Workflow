import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { DocsMemoryGuard } from "../../.opencode/plugins/docs-memory-guard.js";
import { CommitConventionGuard } from "../../.opencode/plugins/commit-convention-guard.js";
import { TypeormMigrationGuard } from "../../.opencode/plugins/typeorm-migration-guard.js";

function tempProjectDir(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
}

test("docs-memory-guard tracks doc vs code edits per session", async () => {
  const directory = tempProjectDir("psters-plugin-track-");
  try {
    const plugin = await DocsMemoryGuard({ directory, client: undefined });

    await plugin["tool.execute.after"](
      { tool: "write", sessionID: "session-1" },
      { args: { filePath: "docs/architecture.md" } }
    );
    await plugin["tool.execute.after"](
      { tool: "edit", sessionID: "session-1" },
      { args: { filePath: "backend/src/app.ts" } }
    );
    // Path traversal payloads must be ignored, not recorded.
    await plugin["tool.execute.after"](
      { tool: "write", sessionID: "session-1" },
      { args: { filePath: "../outside.md" } }
    );

    const statePath = join(directory, ".opencode", "state", "docs-memory-guard.json");
    const saved = JSON.parse(readFileSync(statePath, "utf8"));
    assert.equal(saved.sessions["session-1"].docEdits, 1);
    assert.equal(saved.sessions["session-1"].codeEdits, 1);
    assert.equal(saved.sessions["session-1"].touched.includes("../outside.md"), false);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("docs-memory-guard warns on session.idle only when docs were skipped", async () => {
  const directory = tempProjectDir("psters-plugin-idle-");
  try {
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (msg) => warnings.push(msg);

    const plugin = await DocsMemoryGuard({ directory, client: undefined });

    await plugin["tool.execute.after"](
      { tool: "write", sessionID: "session-2" },
      { args: { filePath: "backend/src/app.ts" } }
    );
    await plugin.event({ event: { type: "session.idle", properties: { sessionID: "session-2" } } });

    console.warn = originalWarn;

    assert.ok(warnings.some((msg) => /Documentation guard/.test(msg)));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("docs-memory-guard stays silent when docs were updated in the session", async () => {
  const directory = tempProjectDir("psters-plugin-silent-");
  try {
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (msg) => warnings.push(msg);

    const plugin = await DocsMemoryGuard({ directory, client: undefined });

    await plugin["tool.execute.after"](
      { tool: "write", sessionID: "session-3" },
      { args: { filePath: "backend/src/app.ts" } }
    );
    await plugin["tool.execute.after"](
      { tool: "write", sessionID: "session-3" },
      { args: { filePath: "docs/modules/backend.md" } }
    );
    await plugin.event({ event: { type: "session.idle", properties: { sessionID: "session-3" } } });

    console.warn = originalWarn;

    assert.equal(warnings.length, 0);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("commit-convention-guard warns when ticket prefix is missing", async () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(msg);

  const plugin = await CommitConventionGuard();
  await plugin["tool.execute.before"](
    { tool: "bash" },
    { args: { command: 'git commit -m "fix: update hooks"' } }
  );

  console.warn = originalWarn;

  assert.ok(warnings.some((msg) => /Commit reminder/.test(msg)));
});

test("commit-convention-guard stays silent with a valid ticket prefix", async () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(msg);

  const plugin = await CommitConventionGuard();
  await plugin["tool.execute.before"](
    { tool: "bash" },
    { args: { command: 'git commit -m "[TICKET-1234] fix(hooks): enforce guardrails"' } }
  );

  console.warn = originalWarn;

  assert.equal(warnings.length, 0);
});

test("commit-convention-guard blocks in strict mode", async () => {
  process.env.PWF_STRICT_COMMIT_CONVENTION = "1";
  try {
    const plugin = await CommitConventionGuard();
    await assert.rejects(
      () =>
        plugin["tool.execute.before"](
          { tool: "bash" },
          { args: { command: 'git commit -m "fix: update hooks"' } }
        ),
      /Commit reminder/
    );
  } finally {
    delete process.env.PWF_STRICT_COMMIT_CONVENTION;
  }
});

test("typeorm-migration-guard warns on typeorm:generate commands", async () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(msg);

  const plugin = await TypeormMigrationGuard();
  await plugin["tool.execute.after"](
    { tool: "bash" },
    { args: { command: "npm run typeorm:generate -- src/database/migrations/NewMigration" } }
  );

  console.warn = originalWarn;

  assert.ok(warnings.some((msg) => /TypeORM atomic chain reminder/.test(msg)));
});

test("typeorm-migration-guard ignores unrelated bash commands", async () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(msg);

  const plugin = await TypeormMigrationGuard();
  await plugin["tool.execute.after"](
    { tool: "bash" },
    { args: { command: "npm run typeorm:run" } }
  );

  console.warn = originalWarn;

  assert.equal(warnings.length, 0);
});

test("commit-convention-guard ignores non-commit bash commands", async () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (msg) => warnings.push(msg);

  const plugin = await CommitConventionGuard();
  await plugin["tool.execute.before"](
    { tool: "bash" },
    { args: { command: "npm run validate" } }
  );

  console.warn = originalWarn;

  assert.equal(warnings.length, 0);
});
