---
name: testing-setup
description: Analyze and create a testing strategy for native Android apps - install
  testing libraries, set up test infrastructure, create harnesses for unit tests,
  UI tests, screenshot tests, and end-to-end tests.
metadata:
  author: Albert Martorell Garcia
  version: 2.0.0
  keywords:
  - android
  - testing
  - ui tests
  - screenshot tests
  - roborazzi
  - robolectric
  - design-system
---

## Step 1: Analyze the current testing setup

To understand the testing setup of an existing project, look for these dependencies in the `libs.versions.toml` file:

1. **Dependency Injection**: Hilt is the project standard. Verify `hilt-android-testing`.
2. **Unit Testing**: JUnit 4 with `MockK` and `Turbine`.
3. **Simulation Engine**: Robolectric for JVM-based UI and behavior testing.
4. **Visual Regression**: Roborazzi for JVM-speed screenshot testing.
5. **Environment**: JDK 21 is mandatory for targeting SDK 36+.

## Step 2: Set up Hilt for Testing

Ensure testing dependencies are applied with `kspTest` and `testImplementation`.
For Robolectric tests, use a custom `@Config(application = TestApplication::class)` to avoid infrastructure leaks (Firebase, production Hilt modules).

## Step 3: Architecture-Driven Testing Standards

Follow the established architectural decisions (ADRs) of the project:

- **Stateless by Contract**: Every UI component MUST be stateless to be easily verifiable.
- **Roborazzi Preference**: Use Roborazzi for visual regression on the JVM. Avoid emulator-based screenshot tools unless hardware interaction (camera, sensors) is required.
- **Pragmatic Snapshot Testing**: Move away from rigid multi-size matrices. Focus on dimensions that impact UX:
    - **Themes**: Light vs. Dark.
    - **Directionality**: LTR vs. RTL.
    - **Accessibility**: Font scale 1.0 vs. 2.0.

## Step 4: Unit Testing (Business Logic)

Implement unit tests for ViewModels, Repositories, and UseCases.
- Use `runTest` from `kotlinx-coroutines-test`.
- Use `Turbine` to collect and verify `StateFlow` and `SharedFlow` emissions.
- Mock external dependencies with `MockK`, but prefer **Fakes** for complex repository logic.

## Step 5: UI Behavior Testing (Robolectric)

Verify UI logic using `ComposeTestRule` running on the JVM via Robolectric.
- **Goal**: Ensure the UI reacts correctly to user input (e.g., button enabled/disabled, error visibility).
- **Execution**: Run via `./gradlew :app:testDebugUnitTest`.

## Step 6: Screenshot Testing (Roborazzi)

Implement visual regression tests for Design System components and Feature Screens.
- **Component Level**: Capture previews for all Design System components.
- **Screen Level**: Capture Initial, Loading, and Error states.
- **Permutations**: Use automated previews (Theme x RTL x Scale) to scan variations.
- **Storage**: Snapshots reside in `app/src/test/snapshots/`.
- **Workflow**:
    - Record: `./gradlew recordRoborazziDebug`
    - Verify: `./gradlew verifyRoborazziDebug`

## Step 7: Navigation Testing

Verify navigation logic using `TestNavHostController` or behavior tests that check for route changes on interaction. Ensure backstacks are handled as per project requirements.

## Step 8: Documentation & Governance

- Update project testing documentation whenever a new framework or major testing pattern is introduced.
- Ensure all new features include their corresponding Unit and UI Behavior tests before merge.
- All `@Preview` functions MUST be stateless to support automated scanning.

---
**Enforcement**: All AI agents must adhere to the project's testing strategy documented in the repository.
