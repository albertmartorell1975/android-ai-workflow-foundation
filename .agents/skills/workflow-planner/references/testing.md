# Pragmatic High-Value Testing & Anti-Overengineering Strategy

The goal of testing is to ensure the reliability of complex logic, critical calculations, error recovery, and user interactions, while strictly avoiding test bloat, cross-layer duplication, and the maintenance burden of testing boilerplate ("Watermelon tests": green on the outside, empty on the inside).

## 1. Strict Test Budget (Hard Caps)

To prevent test inflation and keep the test suite fast and maintainable:
- **Per Test Class Cap**: Write **1 to 3 cohesive `@Test` methods maximum per test class**. Group related branch assertions of a single pure function (e.g., `toDomainError()` or `Enum.fromString()`) into 1–2 cohesive `@Test` methods covering happy path + corner/error cases instead of fragmenting them into 8 separate 2-line `@Test` methods.
- **Per Feature Slice Cap**: A feature specification (`spec.md`) and implementation MUST introduce **at most 4 to 8 `@Test` methods in total across all layers**, unless a complex algorithmic requirement explicitly justifies more.

## 2. Single-Layer Assertion Rule (Zero Cross-Layer Redundancy)

- Each behavior, business rule, or corner case MUST be tested **ONCE at the lowest layer that owns the logic**, and **NEVER re-tested at higher layers**.
  - Domain computed properties and math are tested ONLY in `:domain`. Do NOT re-assert domain calculations inside `RepositoryTest` or `UseCaseTest`.
  - JSON parsing, caching, and exception-to-`DomainError` mapping are tested ONLY in `:data`.
  - Multi-repository orchestration and fallback flows are tested ONLY in `:usecases`.
  - UI state rendering and user interactions are tested ONLY in `:app` (`*ScreenTest`).
  - Static checks (such as `MissingTranslation` across locales) are enforced by `./gradlew lintDebug`; NEVER spin up Robolectric UI tests merely to verify translated string resources.

## 3. Mandatory Rule: Zero Trivial Tests

Strictly FORBID planning or writing tests for:
1. **Language & Model Boilerplate**: Kotlin `data class` constructors, getter/setter assignments, default field instantiations, or simple copy calls.
2. **Static Preview Data & Constants**: Hardcoded preview factories (`*PreviewData`), UI option lists, or static string tables.
3. **1:1 Pass-Through UseCases**: UseCases that only act as a direct bridge delegating to a single repository method with zero conditional branches, calculations, or orchestration.
4. **1:1 Mappers**: Trivial mapping between objects with identical field names and types that perform no transformation or fallback logic.
5. **Collection Wrappers**: In-memory data sources that merely wrap standard library collections (`mutableListOf`, local variables).
6. **Isolated Atomic UI Composables**: Testing leaf or atomic UI components in isolation when they are already exercised through a screen-level integration test (`*ScreenTest`).

## 4. High-Value Testing Targets

Focus the 4–8 tests per feature strictly on components with high regression risk:

1. **Domain Logic & Math Calculations**:
   - Conditional logic (`if`, `when`), loops, differentials, ratios, rankings, and mathematical calculations.
   - Boundary and corner cases (division by zero, negative values, empty collections, extreme ranges).
2. **Error & Exception Mapping**:
   - Technical exceptions (`IOException`, `HttpException`, timeouts, serialization failures, `CancellationException` rethrow) translated into typed domain errors (`DomainError`).
3. **Multi-Source Orchestration & Resilient Fallbacks**:
   - UseCases or Repositories that coordinate multiple data sources and provide graceful fallbacks or degraded mode behavior when one source fails.
4. **Complex Parsing & Serialization**:
   - JSON deserialization with optional/nullable fields, markdown code fence stripping, or custom serializable mappers.
5. **Screen-Level Compose UI Tests (`*ScreenTest`)**:
   - **1 to 3 tests per full screen** covering initial rendering, state transitions (`Loading`, `Error`, `Empty`, `Success`), and key user interactions (filter tabs, form submissions, navigation callbacks).

## 5. Testing Standards & Conventions

- **Tools**: JUnit 4 / JUnit 5, lightweight fakes (preferred over heavy mocking), Turbine (for testing Kotlin StateFlow/Flow), and Compose UI Test Rule with Robolectric.
- **Naming**: Use descriptive names like `should_ReturnError_when_NetworkFails()` or `given_InvalidRound_when_Requested_then_ReturnsNotFound()`.
- **Isolation**: Each test must be independent, reproducible, and focus on a single cohesive behavioral contract.
