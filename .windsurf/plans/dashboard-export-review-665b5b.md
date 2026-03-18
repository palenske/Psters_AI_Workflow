# Dashboard Snapshot & Export Separation Plan
This document sets the scope for isolating heavy export workloads from real-time dashboard rendering while preparing inputs for `/pwf-plan` and `/pwf-brainstorm`.

## Objectives
1. Guarantee that export-only responsibilities (Excel generation + S3 upload) live exclusively behind the dashboard download action.
2. Define a lightweight snapshot pipeline for `/painel/dashboard` that fetches only on-demand data, avoiding export-grade aggregates.
3. Map frontend responsibilities (server vs. client components) so snapshot data is consumed incrementally with clear boundaries.
4. Capture findings, open questions, and required decisions for the upcoming `/pwf-brainstorm` artifact.

## Focus Areas
1. **Backend export flow audit**
   - Trace `ExportDashboardUseCase` interactions with `DashboardDataFetcher`, `DashboardMetricsBuilder`, `DashboardSnapshotAssembler`, and `DashboardWorkbookBuilder`.
   - Identify compute-intensive segments (roles/filters, nested relations, workbook generation) that must not run on regular page loads.
   - Document how `GetDashboardSnapshotUseCase` currently reuses the same stack and why it must be replaced or refactored.
2. **Controller + route responsibilities**
   - Review `DashboardController` (`/dashboard/snapshot`) and `FilesController` (`/files/dashboard-export`) to highlight DTO differences, authorization scopes, and shared dependencies on the use case.
   - Recommend routing changes (e.g., dedicated lightweight snapshot use case + controller) to ensure export logic is never invoked during snapshot retrieval.
3. **Frontend data consumption**
   - Analyze `fetchDashboardSnapshot` (`apps/sm-iter-painel/services/dashboard.ts`) and its usage in `apps/sm-iter-painel/app/painel/dashboard/page.tsx`.
   - Describe server-only responsibilities (session retrieval, initial payload) versus client-side hydration requirements for components like `DashboardContent`.
   - List candidate slices for on-demand fetching (e.g., engagement charts, ranking tables) to keep initial render light.

## Deliverables for `/pwf-brainstorm`
- Consolidated findings from backend and frontend reviews with citations.
- Decision statements addressing: export isolation, lightweight snapshot data contract, client/server boundary split, caching strategy.
- Up to five open questions that materially affect architecture (e.g., caching layer choice, pagination strategy for detail panels).
- Recommendation whether `/pwf-plan` should operate on new snapshot API first or parallelize with frontend refactor.

## Next Actions
1. Finish evidence gathering from the identified files and related DTOs/services.
2. Draft the `/pwf-brainstorm` decision document using this outline as context.
3. Run `/pwf-plan <brainstorm-path>` once the brainstorm captures final decisions.
