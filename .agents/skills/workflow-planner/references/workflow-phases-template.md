# Workflow Phases & Unified Spec Template

## ROLE AND GOAL
Act as an expert Android Software Engineering Planner and Specification Architect (🔵 `[PLANNER · workflow-planner]`). Your primary goal is to transform a feature entry from `feature_list.json` or a standalone user feature request into an implementation-ready contract at **`docs/features/<feature-id>/spec.md`**.

The output must be consistent with the current repository structure, `AGENTS.md`, `CONSTRAINTS.md`, Clean Architecture boundaries, project naming conventions, and pragmatic testing strategy.

---

## PHASE 1: MANDATORY PRE-DIAGNOSIS & PR REVIEWABILITY SIZING
Before generating the final specification, the agent MUST verify that:
1. The feature has a clear `kebab-case` `<feature-id>` and is registered in `feature_list.json` (if running in Standalone Mode, add the entry to `feature_list.json` and `PROGRESS.md`).
2. All `depends_on` prerequisites in `feature_list.json` have status `accepted`.
3. **Semantic PR Slicing (Pre-Diagnosis)**: Evaluate only candidate human-reviewed code/test files (`.kt`, `.java`, `.kts`, `AndroidManifest.xml`, `strings.xml`), ignoring `.webp` visual assets, Roborazzi `snapshots/*.png`, Room `schemas/*.json`, and harness docs. Do not apply arbitrary file/LOC limits, but if the feature bundles multiple independent screens/flows, an entire component catalog, foundational contract creation + broad consumer migration, or piggybacked cleanups, stop and propose splitting `<feature-id>` into sequential `depends_on` sub-slices in `feature_list.json` (each producing one focused PR).
4. Any blocking **Necessary Questions** have been answered by the user or assumptions have been explicitly stated.

---

## PHASE 2: ARCHITECTURAL & SCENARIO DESIGN

Once context is sufficient, construct the unified specification covering behavior contracts and Android architectural layers:

### 2.1 Goal, Non-Goals & Acceptance Scenarios (`Given / When / Then`)
* Define the clear objective and explicit **Non-Goals** to prevent scope creep.
* Write concrete **Acceptance Scenarios** (`Given <state> / When <action> / Then <observable outcome>`) covering the happy path and relevant edge/error states.

### 2.2 Repository Research & Expected File Changes
* Inspect the existing repository and list the exact files inspected, existing patterns to follow, current gaps, and the concrete files to create or modify, separating **Reviewable Code & Tests** from **Excluded Assets, Snapshots & Generated Artifacts** (`.webp` icons, Roborazzi `snapshots/*.png`, Room `schemas/*.json`) so PR reviewability breadth is explicit at planning time.

### 2.3 UI/UX Layer & Visual Assets (`docs/features/<feature-id>/ui/`)
Identify whether UI changes are needed. When applicable, describe:
* UI/UX requirements and alignment with `DESIGN.md` (when present).
* Dedicated feature folders under:
  - `docs/features/<feature-id>/ui/screens/` (full-screen mockups/reference guides ONLY — **MUST NOT** be converted into Android drawables).
  - `docs/features/<feature-id>/ui/resources/` (raw PNG/JPEG graphic assets — **MUST** be converted into optimized `.webp` format in the target UI module: `app/src/main/res/drawable/ic_<name>.webp` for Layer-Based projects, or `<feature>/presentation/src/main/res/drawable/ic_<name>.webp` / `core/designsystem/src/main/res/drawable/` for Feature-First projects).
* Loading, error, empty, and success states, navigation implications (`navigation-3`), accessibility, adaptive layout considerations (`adaptive`, `edge-to-edge`), and **Process Death & State Restoration** (enumerating every distinct stateful screen, non-root destination, and critical persistable UI state for Level 4 Probes 4A & 4B).

### 2.4 API Layer
When an API is involved, define: HTTP methods, routes, request parameters, DTOs/JSON schemas, authentication requirements, and error mapping contracts. If not involved, explicitly state `"No API changes required"`.

### 2.5 Persistence Layer
When persistence is involved, detail: storage requirements (Room, DataStore), database schema changes, entities, DAO/repository changes, and migrations. If not involved, explicitly state `"No persistence changes required"`.

### 2.6 Durable Documentation Impact (For `workflow-documenter` & Stage 5)
Explicitly specify which durable documents require updates after validation passes:
* **Public KDoc Targets (`workflow-documenter`)**: List ONLY `public` classes, interfaces, and root reusable APIs with non-obvious contracts (Domain models/repositories, UseCases, ViewModels, root Design System components). Never list `internal`/`private` classes (`*Impl`, `*Primitives`, DTOs, Entities, DAOs, UI Mappers), `@Preview` functions, or repetitive 1:1 delegating wrappers.
* **`ARCHITECTURE.md`**: `create` / `update` / `not needed` — reason.
* **`CONSTRAINTS.md`**: `create` / `update` / `not needed` — reason.
* **`README.md` / `.agents/skills/README.md`**: `update` / `not needed` — reason.
* **Superseded / Legacy Docs**: `delete <paths>` / `not needed` — inspect existing `docs/` for legacy records or outdated guides superseded by this feature and explicitly schedule their deletion or replacement so stale documentation does not linger.

### 2.7 Granular Actionable Clean Architecture Checklist (For `workflow-implementer`)
Create an ordered step-by-step checklist following the project's Clean Architecture layers (adapting module names to either `Layer-Based` or `Feature-First` topology per `module-architecture-governance`):
`Database / Models → Domain (:domain or :<feature>:domain) → Data (:data or :<feature>:data) → UseCase (:usecases or :<feature>:usecases) → UI / Presentation (:app or :<feature>:presentation + :app wiring) → UI Design Assets → Pragmatic High-Value Testing (0-6 tests total) → Compiler Self-Verification`

---

## PHASE 3: OUTPUT FORMAT & STRUCTURE (`docs/features/<feature-id>/spec.md`)

1. Ensure the feature folder structure exists:
   - `docs/features/<feature-id>/ui/screens/`
   - `docs/features/<feature-id>/ui/resources/`
   - `docs/features/<feature-id>/validator/`
2. Save the specification at:
   **`docs/features/<feature-id>/spec.md`**

The file MUST follow this unified Markdown structure:

```markdown
# Feature Specification: [Feature Title]

> 🔵 **Generated by**: `[PLANNER · workflow-planner]`

## 1. Source Feature & Idea Diagnosis
* **`id`:** `<feature-id>`
* **`area`:** `<area>`
* **`depends_on`:** `[...]`
* **`status`:** `not_started`
* **`module_topology`:** `Layer-Based (:domain, :usecases, :data, :app)` | `Feature-First (:<feature>:domain, :<feature>:usecases, :<feature>:data, :<feature>:presentation + :core:* + :app)`
* **Objective:** Brief analysis of what is being built.
* **Identified Ambiguities / Assumptions:** Key technical decisions that were clarified or explicitly accepted.
* **Necessary Questions:** [Up to 3 targeted questions if unresolved, or "None — all requirements clarified."]

## 2. Goal, Non-Goals & Acceptance Scenarios

### Goal
[1-2 paragraphs describing the user/system outcome this feature enables.]

### Non-Goals
* [Behavior or adjacent feature explicitly outside this slice.]

### Job Story
When [situation/context],
I want to [motivation/action],
so I can [expected outcome].

### Acceptance Scenarios

#### Scenario 1: [Happy Path Name]
* **Given** [initial state]
* **When** [user/system action]
* **Then** [observable result]

#### Scenario 2: [Error / Edge Case Name]
* **Given** [initial state]
* **When** [user/system action]
* **Then** [observable result]

## 3. Repository Research & Expected File Changes

### Files Inspected
* `<path>` — [why it matters]

### Existing Patterns To Follow
* [Established module topology (`Layer-Based` or `Feature-First`), DI, StateFlow/ViewModel, or Repository conventions]

### Expected File Changes
* **Reviewable Code & Tests (drives semantic PR scope check):**
  * `<path>` — create/modify; [reason]
* **Excluded Visual Assets, Snapshots & Generated Artifacts (excluded from scope breadth):**
  * `<path or N/A>` — [e.g., `res/drawable/ic_*.webp`, Roborazzi `snapshots/*.png`, Room `schemas/*.json`, or `N/A`]

## 4. Android Layer Breakdown

### UI/UX & Visual Assets
* **UI Involved:** yes/no
* **Design Source:** `DESIGN.md` / `docs/features/<feature-id>/ui/screens/` / N/A
* **States & Navigation:** [Loading, Error, Empty, Success states, type-safe Navigation routes / Navigation 3 `rememberNavBackStack`, A11y, Adaptive]
* **Process Death & State Restoration:** [Enumerate EVERY distinct stateful screen, non-root destination, shared sub-graph flow, and critical interactive UI state (e.g. active search/filter, selected tab, form/draft input, modal/sheet) introduced or modified by this feature, and specify how each survives Activity recreation and OS LMK process death (`rememberSaveable` / `SavedStateHandle` / Room SSOT; ID-only route payloads) — this list drives mandatory Level 4 Probes 4A & 4B; write `N/A` only for pure stateless component/non-UI slices]
* **Graphic Assets Conversion:** [List PNG/JPEG files in `docs/features/<feature-id>/ui/resources/` to convert to `.webp` in the target UI module (`app/src/main/res/drawable/ic_<name>.webp` in Layer-Based, or `<feature>/presentation/src/main/res/drawable/ic_<name>.webp` / `core/designsystem/src/main/res/drawable/` in Feature-First), or N/A. Screen mockups in `ui/screens/` are excluded.]

### API Design
[Describe API endpoints, methods, DTOs, and error contracts, or state "No API changes required".]

### Persistence
[Describe Room/DataStore entities, DAOs, and migrations, or state "No persistence changes required".]

## 5. Durable Documentation Impact (For `workflow-documenter` & Stage 5)
* **KDoc Targets (concise public APIs only — zero `internal`/`private` types, `@Preview`s, or 1:1 wrappers):** [List new/modified `public` contracts in Domain, UseCase, or UI/Design System requiring concise 1–3 line English KDoc, or `None`]
* **`ARCHITECTURE.md`:** create / update / not needed — [reason]
* **`CONSTRAINTS.md`:** create / update / not needed — [reason]
* **`README.md` / `.agents/skills/README.md`:** update / not needed — [reason]
* **Superseded / Legacy Docs:** delete `<paths>` / not needed — [reason]

## 6. Actionable Implementation Checklist (For `workflow-implementer`)

- [ ] **MANDATORY Pre-Check:** Consult `AGENTS.md`, `CONSTRAINTS.md`, and `module-architecture-governance` for topology-specific constraints (`Layer-Based` vs `Feature-First`).
- [ ] **Database / Models (`:core:database` / `:data` / `:<feature>:data`):**
  - DTOs / Entities: default-free (`= ...` strictly forbidden) and non-nullable (`?` strictly forbidden unless explicit business rule).
  - Internal Room DAO interfaces and pure data mappers (`Dto -> Entity -> Domain`).
- [ ] **Domain (`:domain` or `:<feature>:domain`):**
  - Pure Kotlin entities (no Android/framework imports, no defaults/nullables).
  - Explicit Repository Interface: all methods return `Result<T, DomainError>` or `Flow<Result<T, DomainError>>`.
  - Typed `DomainError` sealed hierarchy.
- [ ] **UseCase (`:usecases` or `:<feature>:usecases`):**
  - Single-responsibility classes: `class <Action>UseCase @Inject constructor(private val repo: <Name>Repository)` with single `operator fun invoke(...)`. Do not plan unit tests for 1:1 pass-through UseCases.
- [ ] **Data (`:data` or `:<feature>:data`):**
  - Concrete repository implementation: `internal class <Name>RepositoryImpl @Inject constructor(...) : <Name>Repository`.
  - Interface binding in DI module: `@Binds abstract fun bind*(impl: *Impl): *` inside `@Module abstract class`.
  - Technical exceptions wrapped via `safeCall` / `.toDomainError()` rethrowing `CancellationException`.
- [ ] **UI / Presentation (`:app` or `:<feature>:presentation` + `:app` NavHost/DI wiring):**
  - Passive ViewModel: `@HiltViewModel class *ViewModel @Inject constructor(private val useCase: *UseCase) : ViewModel()`. Zero `init { launch }`, `_state.update { copy(...) }`, `content.Error(val error: DomainError)`. Persist route args, critical user inputs, and shared sub-graph state via `SavedStateHandle` or SSOT (never mutable `@Singleton` RAM caches or `onCleared()`); keep Bundle payloads ID-only.
  - UI Mapper: `internal class *UiMapper` converting Domain to `*UiModel` (default-free) without concatenating language units (`" pts"`, `"%"`).
  - Stateless Compose Screen + `@Preview` (`@BcThemePreview`) for every view state.
- [ ] **UI Design Assets & Folders:** Convert raw graphic assets in `docs/features/<feature-id>/ui/resources/` (PNG/JPEG) to `.webp` in the target UI module (`app/src/main/res/drawable/ic_<name>.webp` or `<feature>/presentation/src/main/res/drawable/ic_<name>.webp`; mockups in `ui/screens/` excluded).
- [ ] **Testing & Integration (Pragmatic High-Value Testing & Closed Test Plan):**
  - *Budget*: Max 1-3 `@Test` per class and **0-6 `@Test` total** across the feature (pure JVM only with Manual Fakes; no Compose/Robolectric screen tests; zero cross-layer duplication; zero trivial tests).
  - *Planned `*Test.kt` files*: [List exact `<ClassName>Test.kt` -> `@Test` method names and the production branch/calculation/state transition each covers — including `SavedStateHandle(mapOf(...))` cold-restoration coverage whenever a ViewModel uses `SavedStateHandle`, either dedicated or integrated into a cohesive `*ViewModelTest` — or state `0 tests` for layers with no branching/transformation logic].
- [ ] **Compiler Self-Verification (MANDATORY):** Execute the `compiler` skill verification suite (`assembleDebug`, `lintDebug`, `testDebugUnitTest`) and record evidence in `PROGRESS.md` and `feature_list.json` (`status: "passing"`).

## 7. Validator Checklist (For `workflow-validator`)

- [ ] Implementation stays strictly within `<feature-id>` scope (`WIP=1`) and `CONSTRAINTS.md`.
- [ ] All Acceptance Scenarios (`Given/When/Then`) are satisfied with real behavior (no fake/hardcoded stubs).
- [ ] Clean Architecture & SOLID invariants (`architecture-solid-audit.md`, all 18 Triggers incl. Trigger #18 Process Death) and security rules (`android-intent-security`) are respected across all layers.
- [ ] `@compiler` verification evidence is present and valid; pure JVM unit tests (`testing-setup`) verify real behavior within the strict Test Budget (1-3 tests/class, 0-6 tests/feature, zero cross-layer duplication, zero trivial/watermelon tests).
- [ ] On an active emulator with stateful UI, Level 4 Probes 4A & 4B (`PID_AFTER != PID_BEFORE`) pass across every stateful screen, non-root route, and critical persistable state declared in Section 4 (recorded in Validation Report §3.3), or Level 4 is recorded as `SKIPPED (headless)` / `N/A`.
- [ ] Structured validation report written to `docs/features/<feature-id>/validator/validation-report.md`.
```
