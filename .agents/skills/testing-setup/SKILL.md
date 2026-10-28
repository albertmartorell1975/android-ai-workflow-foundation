---
name: testing-setup
description: Analyze and create a pragmatic, high-value testing strategy for native Android apps - install testing libraries, set up test infrastructure, enforce strict test budgets (anti-overengineering), and eliminate fragile Robolectric UI test bloat.
metadata:
  author: Albert Martorell Garcia
  version: 2.3.0
  keywords:
  - android
  - testing
  - pragmatic-testing
  - pure-jvm-testing
  - viewmodel-testing
  - architecture
  - best-practices
---

## Step 1: Analyze the current testing setup

To understand the testing setup of an existing project, look for these key dependencies in the project's configuration (e.g., `libs.versions.toml` or `build.gradle`):

1. **Dependency Injection**: Identify the framework (e.g., Hilt, Koin, vanilla Dagger).
2. **Unit Testing**: Identify the core framework (JUnit 4 or JUnit 5).
3. **Mocking/Fakes**: Identify the preferred approach (prefer lightweight Manual Fakes over heavy mocking frameworks).
4. **Coroutine & Flow Testing**: Check for utilities like `kotlinx-coroutines-test` and `Turbine`.
5. **Environment**: Ensure the JDK version is compatible with the project's `compileSdk` and testing tools.

## Step 2: Set up the Testing Infrastructure

Configure the chosen frameworks following their official guidelines. Ensure that:
- Testing dependencies are correctly scoped (`testImplementation`, `androidTestImplementation`, etc.).
- A clear boundary exists between production and test code.

## Step 3: Pragmatic High-Value Testing Strategy & Anti-Overengineering

To prevent "Watermelon tests" (green on the outside, empty on the inside), test bloat, and unsustainable maintenance overhead, strictly enforce these governance rules:

### 3.1 Pure JVM Presentation Testing (Zero Robolectric UI Tests)
- Tests in `:app` and presentation modules MUST be pure JVM unit tests targeting ViewModels (`*ViewModelTest`) and complex UI mappers (`*UiMapperTest`).
- Robolectric Compose UI tests (`*ScreenTest`, `NavigationTest`) are strictly forbidden; they introduce slow execution times, brittle semantic text-matching assertions, and incentivize "Test-Induced Design Damage" (polluting production composable signatures with test-only slots/lambdas).
- UI visual correctness, theme consistency, and multi-state layouts are verified via mandatory `@Preview` (`@BcThemePreview` / `@BcDevicePreview`) coverage and `./gradlew lintDebug`.

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
6. Compose UI components via Robolectric.

### 3.5 Zero Test-Induced Design Damage
Production signatures of application Composables (such as the main App shell or Navigation NavHost) MUST NEVER be modified, polluted with screen-slot lambdas, or compromised solely to accommodate testing harnesses.

## Step 4: Refactor for Testability

If high-value code is hard to test, apply these principles:
- **Stateless UI**: Hoist all state and events to make the UI a pure function of its state.
- **Dependency Inversion**: Use interfaces for external services (API, DB, System) to allow swapping them for Fakes in tests.

## Step 5: Documentation & Governance

- Document test execution commands and strategy in `AGENTS.md` and `CONSTRAINTS.md`.
- Ensure all new features obey the **Pragmatic High-Value Testing Rule** and **Strict Test Budget** before being marked `passing` or `accepted`.
