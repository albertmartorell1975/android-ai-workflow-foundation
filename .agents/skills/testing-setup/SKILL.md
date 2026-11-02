---
name: testing-setup
description: Analyze and create a pragmatic, high-value testing strategy for native Android apps - install testing libraries, set up test infrastructure, enforce strict test budgets (anti-overengineering), eliminate fragile Robolectric UI test bloat, and delegate technology-specific testing rules to the specialized skills.
metadata:
  author: Albert Martorell Garcia
  version: 2.4.0
  keywords:
  - android
  - testing
  - pragmatic-testing
  - pure-jvm-testing
  - viewmodel-testing
  - manual-fakes
  - roborazzi
  - android-cli
  - black-box-e2e
  - architecture
  - best-practices
---

## Step 1: Analyze the current testing setup

To understand the testing setup of an existing project, look for these key dependencies in the project's configuration (e.g., `libs.versions.toml` or `build.gradle`):

1. **Dependency Injection**: Identify the framework (e.g., Hilt, Koin, vanilla Dagger).
2. **Unit Testing**: Identify the core framework (JUnit 4 or JUnit 5).
3. **Mocking/Fakes**: Identify the preferred approach (see *Manual Fakes First* in Step 2).
4. **Coroutine & Flow Testing**: Check for utilities like `kotlinx-coroutines-test` and `Turbine`.
5. **Screenshot Testing**: Check whether Roborazzi is declared (only expected in a `:design-system` module).
6. **Environment**: Ensure the JDK and AGP versions are compatible with the project's `compileSdk` and testing tools (see `dependency-manager`).

## Step 2: Set up the Testing Infrastructure

Configure the chosen frameworks following their official guidelines. Ensure that:
- Testing dependencies are correctly scoped (`testImplementation` for pure JVM tests). Do NOT declare `androidTestImplementation` dependencies (Espresso, `ui-test-junit4`, UI Automator) unless a module explicitly needs them under Step 5 (Design System exception).
- A clear boundary exists between production and test code.
- **`MainDispatcherRule`**: Every module that tests ViewModels (or any code using `viewModelScope` / `stateIn`) MUST provide a single reusable JUnit rule that calls `Dispatchers.setMain(UnconfinedTestDispatcher())` in `starting()` and `Dispatchers.resetMain()` in `finished()`. Without it, pure JVM tests fail with `Module with the Main dispatcher had failed to initialize`.
- **Manual Fakes First**: When a domain interface exists (repository, data source, API service), write a hand-made `Fake*` implementation (in-memory, deterministic) instead of using a mocking framework (MockK / Mockito). Fakes are faster, have no bytecode-instrumentation cost, and do not couple tests to implementation details (`coVerify`-style assertions). Mocking frameworks are only acceptable for types that cannot be faked (final platform classes) and only when explicitly justified.

## Step 3: Pragmatic High-Value Testing Strategy & Anti-Overengineering

To prevent "Watermelon tests" (green on the outside, empty on the inside), test bloat, and unsustainable maintenance overhead, strictly enforce these governance rules:

### 3.1 Pure JVM Presentation Testing (Zero Robolectric UI Tests)
- Tests in `:app` and presentation modules MUST be pure JVM unit tests targeting ViewModels (`*ViewModelTest`) and complex UI mappers (`*UiMapperTest`).
- Robolectric / `composeTestRule` functional tests of screens or navigation (`*ScreenTest`, `NavigationTest`) are strictly forbidden; they introduce slow execution times, brittle semantic text-matching assertions, and incentivize "Test-Induced Design Damage" (polluting production composable signatures with test-only slots/lambdas).
- The only permitted use of the Robolectric engine is as the internal renderer of Roborazzi (see 3.6), never as a functional UI test runner.

### 3.2 Strict Test Budget (Hard Caps)
- **Per Test Class Cap**: Write **1 to 3 cohesive `@Test` methods maximum per test class**. Group related branch assertions of a single pure function into 1–2 cohesive `@Test` methods rather than splitting them into 8 micro-tests.
- **Per Feature Slice Cap**: Introduce **at most 2 to 6 `@Test` methods in total across all layers** for a standard feature slice.

### 3.3 Single-Layer Assertion Rule (Zero Cross-Layer Redundancy)
- Test each business rule, calculation, or edge case **ONCE at the lowest layer that owns the logic**, and NEVER re-test it at higher layers:
  - **Domain (`:domain`)**: Pure mathematical calculations, differentials, rankings, and boundary conditions.
  - **Data (`:data`)**: Complex JSON serialization/deserialization, caching behavior, and `Throwable`-to-`DomainError` mapping.
  - **UseCases (`:usecases`)**: Multi-repository orchestration and fallback behavior when a dependency fails.
  - **Presentation (`:app` / `:<feature>:presentation`)**: ViewModel passive lifecycle and state transitions (`Loading`, `Error(DomainError)`, `Success`) and UI mapper data transformations (`*UiMapperTest`).

### 3.4 Zero Trivial Tests Mandate
Strictly **FORBID** writing tests for:
1. Kotlin `data class` constructors, property getters/setters, or default values.
2. Static preview data (`*PreviewData`) or hardcoded navigation option lists.
3. 1:1 pass-through UseCases that merely delegate to a single repository method without branching or transformation.
4. 1:1 mappers that copy identical fields without transformation logic.
5. In-memory data sources that merely wrap standard library collections (`mutableListOf`, local variables).
6. Compose screens or navigation via Robolectric.

### 3.5 Zero Test-Induced Design Damage
Production signatures of application Composables (such as the main App shell or Navigation NavHost) MUST NEVER be modified, polluted with screen-slot lambdas, or compromised solely to accommodate testing harnesses.

### 3.6 UI Visual Validation (`@Preview` & Roborazzi)
- **Feature screens (`:app` / `:<feature>:presentation`)**: Visual correctness is verified by mandatory stateless `@Preview` coverage (`@<Prefix>ThemePreview` + `@<Prefix>DevicePreview`, see `design-system-governance`) plus a clean `./gradlew assembleDebug lintDebug`. No screenshot (golden PNG) files are committed for regular feature screens.
- **Design System components (`:design-system`) or when screenshot testing is explicitly requested**: **Roborazzi** is the only approved tool, capturing the existing `@Preview` composables on the JVM. Follow `design-system-governance` (§4) for snapshot regeneration triggers, dialog previews, and `AsyncImage` handling.
- **Forbidden**: Paparazzi, and any screenshot/testing plugin in Alpha/Beta/RC state (e.g. `com.android.compose.screenshot`), in line with the Stable Versions Policy of `dependency-manager`.

### 3.7 Black-Box E2E (Complete Flows & Real Navigation)
- Complete flows and real navigation (`NavHost`, Hilt graph, Room, real screens) are validated as **black-box on an emulator/device through `@android-cli`** (`android run`, `android layout --diff`, `android screen capture`), NOT with instrumented tests inside the repository.
- The journey source of truth is the **Acceptance Scenarios (`Given / When / Then`)** of `docs/features/<feature-id>/spec.md`. When the feature has `UI Involved: yes` and an emulator/device is active, `workflow-validator` (Level 4) executes those scenarios following `android-cli` (`references/journeys.md` and `references/interact.md`). If no device is active, Level 4 is recorded as `SKIPPED (headless)` and does not block the pipeline.
- **Forbidden** for app screens and navigation: Espresso, `composeTestRule`/`createAndroidComposeRule`, UI Automator, Macrobenchmark, Maestro, and any `src/androidTest/` E2E suite.

## Step 4: Refactor for Testability

If high-value code is hard to test, apply these principles:
- **Stateless UI**: Hoist all state and events to make the UI a pure function of its state.
- **Dependency Inversion**: Use interfaces for external services (API, DB, System) to allow swapping them for Fakes in tests.

## Step 5: Technology-Specific Delegation & Design System Testing (Hub & Spoke)

This skill owns the global framework (what is tested, where, and how much). Technology-specific testing details live in the skill that owns the technology; load them only when working on that technology:

| Topic | Delegate to |
| :--- | :--- |
| Dependency Injection (no Hilt in unit tests, `@TestInstallIn` over `@UninstallModules`) | `hilt` → `references/hilt-testing-rules.md` |
| ViewModels, UI State & Flows (passive init, `stateIn`, Turbine, `MainDispatcherRule`) | `viewmodel-architecture-governance` → `references/passive-initialization.md`, `kotlin-flow-state-event-modeling` |
| Coroutines & Dispatchers (`runTest`, injected dispatchers) | `kotlin-coroutines-structured-concurrency` |
| Database schema & migrations | `room-schema-governance` |
| Repository / `DomainError` mapping tests | `repository-pattern-governance` |
| Previews & Roborazzi snapshots | `design-system-governance` |
| Design System isolated widgets | [Compose Design System Testing](references/compose-design-system-testing.md) |

**Design System exception**: `composeTestRule`, interaction-state tests (`hover`/`focus`/`press` via `MutableInteractionSource`) and semantic assertions are allowed **only inside the `:design-system` module for isolated, pure widgets**, and NEVER for application Screens or Features.

## Step 6: Documentation & Governance

- Document test execution commands and strategy in `AGENTS.md` and `CONSTRAINTS.md`.
- Ensure all new features obey the **Pragmatic High-Value Testing Rule** and **Strict Test Budget** before being marked `passing` or `accepted`.
