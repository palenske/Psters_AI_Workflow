# FAQ

## I installed the plugin and it is not working. What should I check first?

Check your runtime context first.

If you installed from WSL but the plugin is not visible in your editor, verify that you are using an editor with native support.

Use the WSL guidance here:

- [Windows + WSL setup instructions](getting-started.md)

Quick checks:

- confirm where you ran `./scripts/install-plugin-local.sh`
- confirm where Cursor opened your workspace (Windows vs WSL)
- reload Cursor after installation

## Should I always use `/pwf-plan`?

No. Use `/pwf-plan` for multi-step or higher-risk changes.
For small fixes and narrow adjustments, use `/pwf-work`.

## What is the difference between `/pwf-work` and `/pwf-work-plan`?

- `/pwf-work-plan`: execute planned phases one by one.
- `/pwf-work`: execute focused changes outside a formal plan.

Both read docs first and update docs in their own mandatory flow.

## What is the difference between the `/pwf-doc` family commands?

- `/pwf-doc`: canonical technical documentation by scope (module, feature, architecture, ADR, update).
- `/pwf-doc-foundation`: project baseline docs (infrastructure, architecture, integrations, environments, glossary).
- `/pwf-doc-runbook`: operational runbooks under `docs/runbooks/`.
- `/pwf-doc-capture`: reusable learning artifacts (problem/solution and patterns).

## If `/pwf-work` and `/pwf-work-plan` already update docs, why use the `/pwf-doc` family?

Use them when you want to force a specific documentation output explicitly.

## Who decides what command runs next: developer or AI?

Developer decides.  
Psters is built for predictable execution: control stays with the developer, AI executes the selected command.

## Does this workflow enforce documentation?

Yes. `/pwf-work` and `/pwf-work-plan` read docs before implementation and update docs before completion.
This is how project standards remain stable over time.

## Are hooks mandatory?

Hooks are recommended guardrails. They reinforce discipline and reminders, but core workflow still happens through commands.

## Is this workflow tied to a specific language/framework?

No. The workflow is language-agnostic and framework-agnostic.
