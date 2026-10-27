---
name: testing-setup
description: Analyze and create a pragmatic, high-value testing strategy for native Android apps - install testing libraries, set up test infrastructure, enforce strict test budgets (anti-overengineering), and create harnesses for unit tests, UI tests, and screenshot tests.
metadata:
  author: Albert Martorell Garcia
  version: 2.2.0
  keywords:
  - android
  - testing
  - pragmatic-testing
  - ui tests
  - screenshot tests
  - architecture
  - best-practices
---

## Step 1: Analyze the current testing setup

To understand the testing setup of an existing project, look for these key dependencies in the project's configuration (e.g., `libs.versions.toml` or `build.gradle`):

1. **Dependency Injection**: Identify the framework (e.g., Hilt, Koin, vanilla Dagger).
2. **Unit Testing**: Identify the core framework (e.g., JUnit 4, JUnit 5).
3. **Mocking/Fakes**: Identify the preferred approach (prefer lightweight Manual Fakes over heavy mocking frameworks when possible).
4. **Coroutine & Flow Testing**: Check for utilities like `kotlinx-coroutines-test` and `Turbine`.
5. **Simulation Engine**: Check if the project uses Robolectric for JVM-based UI testing.
6. **Visual Regression**: Identify if a screenshot tool is used (e.g., Roborazzi, Paparazzi, Dropshots, Shot).
7. **Environment**: Ensure the JDK version is compatible with the project's `compileSdk` and testing tools.

## Step 2: Set up the Testing Infrastructure

Configure the chosen frameworks following their official guidelines. Ensure that:
- Testing dependencies are correctly scoped (`testImplementation`, `androidTestImplementation`, `kspTest`, etc.).
- A clear boundary exists between production and test code (e.g., using a `TestApplication` class for DI isolation).

## Step 3: Pragmatic High-Value Testing Strategy & Anti-Overengineering

To prevent "Watermelon tests" (green on the outside, empty on the inside) and unsustainable maintenance overhead, strictly enforce these three governance rules:

### 3.1 Strict Test Budget (Hard Caps)
- **Per Test Class Cap**: Write **1 to 3 cohesive `@Test` methods maximum per test class**. Group related branch assertions of a single pure function (such as exception mapping or enum parsing) into 1–2 cohesive `@Test` methods rather than splitting them into 8 micro-tests.
- **Per Feature Slice Cap**: Introduce **at most 4 to 8 `@Test` methods in total across all layers** for a standard feature slice.

### 3.2 Single-Layer Assertion Rule (Zero Cross-Layer Redundancy)
- Test each business rule, calculation, or edge case **ONCE at the lowest layer that owns the logic**, and NEVER re-test it at higher layers:
  - **Domain (`:domain`)**: Pure mathematical calculations, differentials, rankings, and boundary conditions.
  - **Data (`:data`)**: Complex JSON serialization/deserialization, caching behavior, and `Throwable`-to-`DomainError` mapping.
  - **UseCases (`:usecases`)**: Multi-repository orchestration and fallback behavior when a dependency fails.
  - **UI (`:app` / `:<feature>:presentation`)**: ViewModel state transitions (`Loading`, `Error`, `Empty`, `Success`) and **1 to 3 screen-level Compose tests (`*ScreenTest`)** verifying rendering and user interactions.

### 3.3 Zero Trivial Tests Mandate
Strictly **FORBID** writing tests for:
1. Kotlin `data class` constructors, property getters/setters, or default values.
2. Static preview data (`*PreviewData`) or hardcoded navigation option lists.
3. 1:1 pass-through UseCases that merely delegate to a single repository method without branching or transformation.
4. 1:1 mappers that copy identical fields without transformation logic.
5. In-memory data sources that merely wrap standard library collections (`mutableListOf`, local variables).
6. Isolated child/atomic Compose components when already exercised by the parent `*ScreenTest`, or Robolectric tests checking string translations (already verified statically by `lintDebug`).

### 3.4 Visual Regression (Screenshot Testing — When Configured)
- **Scope**: Design System components and visual states of screens.
- **Pragmatic Dimensions**: Focus on dimensions that impact UX (Light vs. Dark, LTR vs. RTL, Standard vs. Max Font Scale).

## Step 4: Refactor for Testability

If high-value code is hard to test, apply these principles:
- **Stateless UI**: Hoist all state and events to make the UI a pure function of its state.
- **Dependency Inversion**: Use interfaces for external services (API, DB, System) to allow swapping them for Fakes in tests.

## Step 5: Documentation & Governance

- Document test execution commands and strategy in `AGENTS.md` or `CONSTRAINTS.md`.
- Ensure all new features obey the **Pragmatic High-Value Testing Rule** and **Strict Test Budget** before being marked `passing` or `accepted`.

---
**Enforcement**: All AI agents (`workflow-planner`, `workflow-implementer`, `workflow-validator`) must enforce these anti-overengineering bounds.
