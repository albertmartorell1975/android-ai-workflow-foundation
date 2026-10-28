# Pragmatic High-Value Testing & Anti-Overengineering Strategy

The goal of testing is to ensure the reliability of complex logic, critical calculations, and error recovery, while strictly avoiding test bloat, cross-layer duplication, and the maintenance burden of testing boilerplate ("Watermelon tests": green on the outside, empty on the inside).

## 1. Strict Test Budget (Hard Caps)

To prevent test inflation and keep the test suite fast and maintainable:
- **Per Test Class Cap**: Write **1 to 3 cohesive `@Test` methods maximum per test class**. Group related branch assertions of a single pure function into 1–2 cohesive `@Test` methods covering happy path + corner/error cases instead of fragmenting them into 8 separate 2-line `@Test` methods.
- **Per Feature Slice Cap**: A feature specification (`spec.md`) and implementation MUST introduce **at most 2 to 6 `@Test` methods in total across all layers**, unless a complex algorithmic requirement explicitly justifies more.

## 2. Single-Layer Assertion Rule (Zero Cross-Layer Redundancy)

- Each behavior, business rule, or corner case MUST be tested **ONCE at the lowest layer that owns the logic**, and **NEVER re-tested at higher layers**.
  - Domain computed properties and math are tested ONLY in `:domain`.
  - JSON parsing, caching, and exception-to-`DomainError` mapping are tested ONLY in `:data`.
  - Multi-repository orchestration and fallback flows are tested ONLY in `:usecases`.
  - ViewModel passive lifecycle and state transitions (`Loading`, `Error(DomainError)`, `Success`) and UI mapper transformations are tested ONLY in `:app` / presentation.
  - Static checks (such as `MissingTranslation` across locales) are enforced by `./gradlew lintDebug`.

## 3. Mandatory Rule: Zero Trivial Tests

Strictly FORBID planning or writing tests for:
1. **Language & Model Boilerplate**: Kotlin `data class` constructors, getter/setter assignments, default field instantiations, or simple copy calls.
2. **Static Preview Data & Constants**: Hardcoded preview factories (`*PreviewData`), UI option lists, or static string tables.
3. **1:1 Pass-Through UseCases**: UseCases that only act as a direct bridge delegating to a single repository method with zero conditional branches, calculations, or orchestration.
4. **1:1 Mappers**: Trivial mapping between objects with identical field names and types that perform no transformation or fallback logic.
5. **Collection Wrappers**: In-memory data sources that merely wrap standard library collections.
6. **Robolectric UI Tests**: Never plan or generate `*ScreenTest` or `NavigationTest` using Robolectric.

## 4. High-Value Testing Targets

Focus the 2–6 tests per feature strictly on components with high regression risk:

1. **Domain Logic & Math Calculations**:
   - Conditional logic, loops, differentials, ratios, rankings, and mathematical calculations.
   - Boundary and corner cases (division by zero, negative values, empty collections).
2. **Error & Exception Mapping**:
   - Technical exceptions translated into typed domain errors (`DomainError`).
3. **Multi-Source Orchestration & Resilient Fallbacks**:
   - UseCases that coordinate multiple data sources and provide graceful fallbacks.
4. **Complex Parsing & Serialization**:
   - JSON deserialization with optional/nullable fields, markdown code fence stripping.
5. **ViewModel & Presentation Logic (Pure JVM)**:
   - ViewModel passive lifecycle, atomic state emissions (`Loading`, `Error(DomainError)`, `Success`), and retry recovery (`*ViewModelTest`).
   - Mathematical / algorithmic UI mapper transformations (`*UiMapperTest`).

## 5. Zero Test-Induced Design Damage

Production signatures of application Composables (such as the main App shell or Navigation NavHost) MUST NEVER be modified, polluted with screen-slot lambdas, or compromised solely to accommodate testing harnesses.
