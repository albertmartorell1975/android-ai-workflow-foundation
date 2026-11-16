# KDoc Rules (`workflow-documenter`)

## 1. KDoc Standards (`kotlin-style`)

All KDoc comments MUST be written in **English** and follow Official Kotlin Coding Conventions:

- **Focus on "Why" and Contract, Not Obvious Syntax**:
  - Explain the domain purpose, state invariants, thread/coroutine expectations, and error behavior (`DomainError`).
  - Avoid redundant noise like `/** Gets the name. @return the name */` on self-explanatory getters.
- **Recommended KDoc Tags**:
  - `@param <name>` — only when the parameter carries specific constraints, units, or non-obvious semantics.
  - `@return` — when the return value (such as `Result<T, DomainError>` or `Flow<UiState>`) has specific emission or error semantics.
  - `@property <name>` — on primary constructor properties of Domain models and `UiState` data classes.
- **Formatting**:
  ```kotlin
  /**
   * Synchronizes user profile preferences between local DataStore and remote API,
   * acting as the Single Source of Truth (SSOT).
   *
   * @property userId Unique identifier of the authenticated user.
   */
  ```

---

## 2. Zero Code & Zero Markdown Mutation Guardrails

When adding KDoc to `.kt` files:
- Edit only around class, interface, function, and property headers.
- **Never** modify imports, package declarations, annotations (`@HiltViewModel`, `@Composable`, `@Inject`), parameter defaults, or function bodies.
- Preserve all existing comments and KDoc that are still accurate.
- **Never** modify Markdown (`.md`) or JSON files (`spec.md`, `ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `PROGRESS.md`, `feature_list.json`). Updating project Markdown documentation and harness state is the exclusive responsibility of **`workflow-orchestrator`** during Stage 5 Consolidation.
