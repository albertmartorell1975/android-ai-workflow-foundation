# Adversarial Stress Audits (`workflow-validator` — Section 3.5)

Perform every applicable audit below before issuing `accept`, and record each concrete attempt (`attempt -> result`) in the **Adversarial Attempts Log** (Section 3.2 of [Validation Rubric](validation-rubric.md)).

---

## 1. State Machine & Dead-State Audit (`ViewModel` / `UiState`)
- Trace every state transition (`Loading -> Success`, `Loading -> Error -> Retry -> Loading -> Success`, `Success -> leave screen -> re-enter`, rotation/recreation).
- Every `UiState` field MUST be both written AND read by the UI. A flag that is never read (e.g. `isRefreshing`) is a **dead state -> `REVISE`**.
- Retry/refresh MUST give visible feedback (content switches to `Loading` or an overlay is rendered).
- Re-entering a screen must not trigger redundant network/AI calls when valid data is already loaded.

## 2. Lifecycle, Process Death & Concurrency Audit
- Verify `collectAsStateWithLifecycle` over `collectAsState`; `LaunchedEffect` keys (idempotent on `MainActivity` recreation); no stored `CoroutineScope`s; `CancellationException` rethrown; no double-launch races.
- **Single-Activity Process Death Resilience (Trigger #18)**:
  - Verify every non-root `NavHost` destination and shared sub-graph `ViewModel` can cold-restore directly after LMK kill without relying on mutable RAM state in `@Singleton`/`Application`/`companion object` (*Single Entry Point Illusion*).
  - Verify critical user inputs, filters, tabs, and sub-graph drafts use `rememberSaveable`, `SavedStateHandle`, or SSOT (and `rememberNavBackStack` for Nav 3).
  - Verify zero critical persistence inside `onCleared()` / `onDestroy()`.
  - Verify ID-only payloads in `SavedStateHandle` / routes (no `TransactionTooLargeException` risk).
  - Verify pure JVM `SavedStateHandle(mapOf(...))` cold-restoration coverage exists whenever a `ViewModel` uses `SavedStateHandle` (dedicated `@Test` or integrated into a cohesive `*ViewModelTest` within the strict test budget).

## 3. Edge-Case Probing
Probe empty lists, empty/blank AI strings, single item, huge lists, offline/timeout/401/5xx, malformed JSON, duplicate IDs, division by zero, and locale (`ca`/`es`) text overflow.

## 4. Test Falsifiability & Value Audit ("Mutation Thought-Experiment")
Whenever `*Test.kt` files were added or modified, populate the **Per-Test Value & Falsifiability Audit** table (`@Test` | Subject & real complexity | Production line that would fail if inverted/deleted | `KEEP` / `CONSOLIDATE` / `DELETE`) applying the filters in [Architecture & SOLID Audit](architecture-solid-audit.md). Verify intermediate transitions are asserted, not only the final state. Any `DELETE` or `CONSOLIDATE` row triggers `REVISE`.

## 5. Spec Drift Diff & Checklist Item Audit
- Compare `spec.md` Expected File Changes, signatures, return types, and named tests against the real `git diff`. Report every divergence (unless explicitly requested in `pr-review.md`).
- **Audit every `[x]` checkbox in `spec.md` Section 6 (`Actionable Implementation Checklist`)**: Cross-examine each claimed `[x]` against `git diff <file>`. If a checklist item is marked `[x]` but the code diff lacks it or implemented something different, report it as **CRITICAL** or **HIGH/MEDIUM Spec Drift**.

## 6. Static Grep Sweep & Android Runtime Guard
- **Android Runtime vs Host JVM Guard**: In `:app`, `System.getenv(...)`, `System.getProperty(...)`, and host file reads (e.g. `local.properties`) return empty/null on Android devices/emulators. Any DI provider (`NetworkModule`) supplying API keys or endpoints must resolve them via `BuildConfig.*` (or assets/resources); relying solely on host environment resolution in `:app` is a **CRITICAL** finding.
- **Declarative BuildConfig Provisioning**: Secrets and API keys must be provisioned via Google's official `secrets-gradle-plugin` and `local.defaults.properties`. Manual `java.util.Properties` loading or raw string concatenations in `buildConfigField` inside `build.gradle.kts` MUST be flagged as **REVISE** per `dependency-manager`.
- **Grep Sweep Over Changed Files**: Check for hardcoded `.fillMaxSize()` / `.fillMaxWidth()` on component roots, `R.string` in ViewModels, default params / nullables in `Dto`, `Entity`, `Domain` models, or `*UiModel` *(excluding top-level `*UiState`)*, `fontSize < 12.sp`, `catch (Exception)` around suspend calls, `ca`/`es` `strings.xml` key parity, and test count vs. budget.
