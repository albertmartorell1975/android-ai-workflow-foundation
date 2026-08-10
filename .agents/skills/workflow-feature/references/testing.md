# Pragmatic Testing Strategy

The goal of testing in **MeteoMartoCompose** is to ensure the reliability of complex logic and critical data transformations, avoiding the overhead of testing boilerplate or simple data pass-throughs.

## When to write Unit Tests?

Focus your efforts on **high-value targets** where the risk of regression or logic errors is high:

1.  **Business Rules (Domain/UseCases)**:
    - Any conditional logic (`if`, `when`), loops, or calculations.
    - Decision-making processes that determine the flow of the application.
2.  **Complex Mappers (Data)**:
    - Transformations between API DTOs and Domain Models that involve data cleaning, formatting, or merging multiple sources.
3.  **UI State Transitions (ViewModel)**:
    - Complex interactions where multiple events affect the `UiState`.
    - Logic that handles loading, error, and success states across asynchronous boundaries.

## When to SKIP Unit Tests?

Avoid testing code that is self-explanatory or lacks logic:

- **Simple CRUD**: UseCases that only act as a bridge calling a Repository method.
- **1:1 Mappers**: Simple mapping between objects with identical field names and types.
- **Pass-through ViewModels**: ViewModels that only expose data from a UseCase without additional processing.

## Testing Standards

- **Tools**: JUnit 5, MockK (for mocking), and Turbine (for testing Kotlin Flows).
- **Naming**: Use descriptive names like `should_ReturnError_when_NetworkFails()` or `given_HighTemp_when_CheckingThreshold_then_NotifyUser()`.
- **Isolation**: Each test must be independent and focus on a single unit of work.
