# Dashboard Snapshot & Export Refactor Plan
This plan separates the lightweight dashboard snapshot flow from the heavy export pipeline and realigns the painel dashboard data consumption to meet the new architecture.

## Overview
We will create a dedicated snapshot service tailored for fast `/painel/dashboard` rendering while confining workbook generation to the download action. The backend will expose a lean API with on-demand sections, and the frontend will request data incrementally, avoiding unnecessary aggregates.

## Scope / Work Breakdown
1. Backend snapshot separation (API + use cases + DTOs).
2. Frontend data-fetch integration and client/server boundary cleanup.
3. Export pipeline hardening, instrumentation, and admin download UX adjustments.

## Proposed Solution
- Introduce a `DashboardSnapshotService` that handles the minimal data set needed for dashboard widgets, independent of `ExportDashboardUseCase`. `GetDashboardSnapshotUseCase` will consume this new service, while `DashboardController` will expose additional query parameters for selective sections.
- Keep `ExportDashboardUseCase` dedicated to Excel generation and S3 upload, invoked only via `FilesController` when the user clicks download.
- On the painel app, make `fetchDashboardSnapshot` accept section flags, leverage Next.js server actions for session/headers, and lazily hydrate client components (`DashboardAdminContainer`, `DashboardAlunoContainer`) via dedicated hooks.

## Technical Considerations
- Reuse existing repositories (`DashboardDataFetcher`, `DashboardMetricsBuilder`) selectively; avoid N+1 queries by ensuring Prisma includes match needed relations only.
- Respect `nest-keycloak-connect` role guards already present in `DashboardController` and `FilesController`.
- Frontend must keep existing permission guard and SSR requirements; avoid leaking tokens to the client.
- Plan for future caching layer (e.g., cache tags per customer) but keep out of MVP scope.

## Acceptance Criteria
1. Dashboard page SSR no longer depends on workbook/export stack; snapshot endpoint responds within agreed SLA (<1s on staging dataset).
2. Export download button still produces identical Excel output and uploads to S3 without regression.
3. Frontend supports toggling optional sections (detailed engagement, ranking) without reloading the whole page.
4. Error handling: dashboard fetch errors display actionable UI, export errors surface toast + log entry.

## Implementation Plan
| Phase | Name | Depends On | Status |
|-------|------|------------|--------|
| 1 | Backend Snapshot Separation | None | ⬜ Pending |
| 2 | Frontend Dashboard Integration | Phase 1 | ⬜ Pending |
| 3 | Export Pipeline Hardening | Phase 2 | ⬜ Pending |

---

### Phase 1: Backend Snapshot Separation
**Status**: ⬜ Pending  
**Objective**: Deliver a standalone snapshot flow that avoids export-heavy computations.  
**Dependencies**: None

- [ ] T001 [US1] Create `DashboardSnapshotService` in `apps/sm-iter-api/src/core/application/services/DashboardSnapshotService.ts`
  - Implement methods to fetch lightweight aggregates (users summary, course/trilha highlights) using existing repositories; accept `DashboardSnapshotRequest` flags.
- [ ] T002 [US1] Refactor `GetDashboardSnapshotUseCase` in `apps/sm-iter-api/src/core/application/useCases/GetDashboardSnapshotUseCase.ts`
  - Inject the new service and remove direct dependency on `ExportDashboardUseCase.getDashboardSnapshot`.
  - Ensure response type matches `DashboardSnapshotResponse` but only builds requested sections.
- [ ] T003 [US1] Update `DashboardController` in `apps/sm-iter-api/src/core/infra/controllers/DashboardController.ts`
  - Accept `sections` or boolean flags in DTO, validate payload, and call the refactored use case.
  - Add logging and metrics for snapshot latency (CLS scoped request ID).
- [ ] T004 [US1] Add DTO/schema updates in `apps/sm-iter-api/src/core/infra/controllers/dtos/DashboardSnapshotDTO.ts`
  - Define optional booleans for each section (`includeAlunoResumo`, `includeEngajamento`, etc.) with defaults.
- [ ] T005 [US1] Cover the new flow with integration/unit tests under `apps/sm-iter-api/src/core/application/useCases/__tests__/GetDashboardSnapshotUseCase.spec.ts`
  - Mock `DashboardSnapshotService` to ensure optional sections behave correctly.

After Phase 1: run `pnpm --filter sm-iter-api test` and `pnpm --filter sm-iter-api build`.

---

### Phase 2: Frontend Dashboard Integration
**Status**: ⬜ Pending  
**Objective**: Consume the new snapshot API with granular data requests and cleaner client/server boundaries.  
**Dependencies**: Phase 1

- [ ] T006 [US2] Enhance `fetchDashboardSnapshot` in `apps/sm-iter-painel/services/dashboard.ts`
  - Accept `sections` argument, forward to backend, and support ISR/cache tags for static pieces while keeping sensitive data `no-store`.
- [ ] T007 [US2] Adjust `app/painel/dashboard/page.tsx`
  - Request only the sections needed for initial render (e.g., summary + aluno cards) and pass section flags to client components.
- [ ] T008 [US2] Update `DashboardContent` and `DashboardAdminContainer` in `apps/sm-iter-painel/components/ui/PainelLayout/Content/DashboardContent/*`
  - Split props into lightweight SSR snapshot vs. client-side hooks for on-demand panels (engagement charts, rankings).
  - Add loading/error UI for deferred sections and trigger client fetch via `useIntegration` or SWR with the new API contract.
- [ ] T009 [US2] Revise `DashboardAlunoContainer` to rely on server-provided snapshot data first, falling back to client fetch only for mutations.
- [ ] T010 [US2] Extend dashboard types in `apps/sm-iter-painel/types/dashboard.ts`
  - Encode section flags and response slices to keep TypeScript aligned with backend contract.

After Phase 2: `pnpm --filter sm-iter-painel lint && pnpm --filter sm-iter-painel build`.

---

### Phase 3: Export Pipeline Hardening
**Status**: ⬜ Pending  
**Objective**: Ensure heavy export logic is isolated and observability is in place.  
**Dependencies**: Phase 2

- [ ] T011 [US3] Review `FilesController` in `apps/sm-iter-api/src/core/infra/controllers/FilesController.ts`
  - Confirm only the export endpoint instantiates `ExportDashboardUseCase`; log user ID and filters for traceability.
- [ ] T012 [US3] Update `ExportDashboardUseCase` in `apps/sm-iter-api/src/core/application/useCases/ExportDashboardUseCase.ts`
  - Remove any snapshot helper methods, enforce guards that prevent calling execute without explicit export intent, and add structured logs for S3 uploads.
- [ ] T013 [US3] Add admin download trigger in painel (button wiring)
  - In `DashboardAdmin` UI, ensure download button calls `/files/dashboard-export` via authenticated fetch and shows progress/error states.
- [ ] T014 [US3] Instrument monitoring
  - Add metrics hooks (e.g., Prometheus or log entries) for export duration and failures inside `ExportDashboardUseCase` and expose them through existing observability pipeline.

After Phase 3: run both builds (`pnpm --filter sm-iter-api build`, `pnpm --filter sm-iter-painel build`) and perform manual download smoke test.

## ✅ Master Checklist
### Phase 1: Backend Snapshot Separation
- [ ] T001 [US1]
- [ ] T002 [US1]
- [ ] T003 [US1]
- [ ] T004 [US1]
- [ ] T005 [US1]
- [ ] Build/tests pass (API)

### Phase 2: Frontend Dashboard Integration
- [ ] T006 [US2]
- [ ] T007 [US2]
- [ ] T008 [US2]
- [ ] T009 [US2]
- [ ] T010 [US2]
- [ ] Lint/build pass (painel)

### Phase 3: Export Pipeline Hardening
- [ ] T011 [US3]
- [ ] T012 [US3]
- [ ] T013 [US3]
- [ ] T014 [US3]
- [ ] Final builds + manual download test

## Clarifications
All critical questions resolved during planning; any future discoveries should be logged under `.windsurf/plans/dashboard-snapshot-export-plan-665b5b.clarifications.md` if needed.
