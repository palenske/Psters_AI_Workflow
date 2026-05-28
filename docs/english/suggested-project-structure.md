# Suggested Project Structure

This workflow recommends a **two-folder project topology**:

- `<ProjectName>_Repos` -> all source code repositories
- `<ProjectName>_Workspace` -> workflow/docs/editor-level context

## Why this structure

Separating code repositories from workflow context improves operational clarity:

- code is isolated from workflow metadata and docs artifacts,
- docs and editor-level context remain centralized,
- multi-repo projects become easier to navigate in one editor window.

## Recommended layout

```text
<base-path>/
  <ProjectName>_Repos/
    frontend/
    backend/
  <ProjectName>_Workspace/
    docs/
    <editor-config>/
      .opencode/ (if using OpenCode)
      .windsurf/ (if using Windsurf)
    <ProjectName>.code-workspace
```

## How to use in OpenCode/Windsurf

1. Open `<ProjectName>_Workspace/<ProjectName>.code-workspace`.
2. Work from that multi-root workspace:
   - edit code in repos,
   - keep docs and workflow controls in workspace root.

This allows one window to manage both delivery and documentation lifecycle.

## Command to bootstrap this layout

Use:

- `/pwf-setup-workspace`

This command creates/repairs the folder layout and generates the `.code-workspace` file.

After that, run:

- `/pwf-setup` to initialize docs skeleton in workspace root.

## Existing project migration

If your repos already exist, do not move files blindly.

Recommended order:

1. create/reuse `<ProjectName>_Workspace`,
2. generate `.code-workspace` referencing existing repos,
3. optionally move repos into `<ProjectName>_Repos` only after explicit confirmation and backup.

## Practical default

For most teams:

- one frontend repo + one backend repo in `<ProjectName>_Repos`,
- one centralized docs/workflow root in `<ProjectName>_Workspace`.

This is the baseline model used by this workflow.
