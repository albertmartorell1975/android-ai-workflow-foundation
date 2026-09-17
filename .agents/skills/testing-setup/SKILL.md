---
name: testing-setup
description: Analyze and create a testing strategy for native Android apps - install
  testing libraries, set up test infrastructure, create harnesses for unit tests,
  UI tests, screenshot tests, and end-to-end tests.
metadata:
  author: Albert Martorell Garcia
  version: 2.1.0
  keywords:
  - android
  - testing
  - ui tests
  - screenshot tests
  - architecture
  - best-practices
---

## Step 1: Analyze the current testing setup

To understand the testing setup of an existing project, look for these key dependencies in the project's configuration (e.g., `libs.versions.toml` or `build.gradle`):

1. **Dependency Injection**: Identify the framework (e.g., Hilt, Koin, vanilla Dagger).
2. **Unit Testing**: Identify the core framework (e.g., JUnit 4, JUnit 5).
3. **Mocking/Fakes**: Identify the preferred approach (e.g., MockK, Mockito, or Manual Fakes).
4. **Coroutine & Flow Testing**: Check for utilities like `kotlinx-coroutines-test` and `Turbine`.
5. **Simulation Engine**: Check if the project uses Robolectric for JVM-based UI testing.
6. **Visual Regression**: Identify if a screenshot tool is used (e.g., Roborazzi, Paparazzi, Dropshots, Shot).
7. **Environment**: Ensure the JDK version is compatible with the project's `compileSdk` and testing tools.

## Step 2: Set up the Testing Infrastructure

Configure the chosen frameworks following their official guidelines. Ensure that:
- Testing dependencies are correctly scoped (`testImplementation`, `androidTestImplementation`, `kspTest`, etc.).
- A clear boundary exists between production and test code (e.g., using a `TestApplication` class for DI isolation).

## Step 3: Architecture-Driven Testing Strategy

Implement tests across three main layers:

### 3.1 Unit Testing (Business Logic)
- **Scope**: ViewModels, Repositories, UseCases, and Mappers.
- **Goal**: Verify state transitions and data integrity.
- **Pattern**: Given-When-Then. Use `runTest` for coroutines and `Turbine` for Flow verification.

### 3.2 UI Behavior Testing
- **Scope**: Interactive UI components and Feature Screens.
- **Goal**: Ensure the UI reacts correctly to user input (e.g., click triggers action, toggle changes state).
- **Execution**: Can be done on the JVM (Robolectric) for speed or on a device/emulator for high fidelity.
- **Requirement**: Target **Stateless Content** composables to maximize reuse and isolation.

### 3.3 Visual Regression (Screenshot Testing)
- **Scope**: Design System components and visual states of screens.
- **Goal**: Detect unintended visual changes.
- **Pragmatic Dimensions**: Instead of exhaustive size matrices, focus on dimensions that impact UX:
    - **Themes**: Light vs. Dark.
    - **Directionality**: LTR vs. RTL.
    - **Accessibility**: Standard vs. Maximum Font Scale (e.g., 2.0).
- **Tools**: Select the tool that fits the project workflow (e.g., Roborazzi/Paparazzi for JVM speed, Dropshots for device fidelity).

## Step 4: Refactor for Testability

If the code is hard to test, apply these principles:
- **Stateless UI**: Hoist all state and events to make the UI a pure function of its state.
- **Dependency Inversion**: Use interfaces for external services (API, DB, System) to allow swapping them for Fakes or Mocks in tests.

## Step 5: Documentation & Governance

- Maintain a `docs/testing.md` (or similar) with clear instructions on how to run, record, and verify tests.
- Ensure all new features follow the established testing pattern before being considered "Done".

---
**Enforcement**: All AI agents must adhere to the project's specific testing strategy while following these general best practices.
