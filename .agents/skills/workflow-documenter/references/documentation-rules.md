# Documentation & KDoc Rules (`workflow-documenter`)

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

### Zero Code-Mutation Guardrail
When adding KDoc to `.kt` files:
- Use `replace_file_content` carefully around class/function headers only.
- **Never** modify imports, package declarations, annotations (`@HiltViewModel`, `@Composable`, `@Inject`), parameter defaults, or function bodies.
- Preserve all existing comments and KDoc that are still accurate.

---

## 2. Durable Documentation Rules (Anti-Bloat)

Code changes and durable knowledge changes travel together, but documentation must stay lean so future agents do not suffer from context rot:

- **`ARCHITECTURE.md`**:
  - Create or update only when domains, modules, layers, dependency directions, or core adapters/providers are established or changed.
  - Capture durable boundaries and data flow diagrams (`mermaid`), **not** a list of every file in the repository.
- **`CONSTRAINTS.md`**:
  - Record only operational `MUST` and `MUST NOT` rules that future features and agents must obey, with a one-line rationale.
  - Do not restate general rules already covered in `AGENTS.md` or `.agents/skills/`.
- **`AGENTS.md`**:
  - Update only if the repo-wide startup path, verification command, or global operating rules changed. Keep it short and routing-oriented.
- **`docs/features/<feature-id>/spec.md`**:
  - Check off `[x]` completed tasks in the `Actionable Implementation Checklist` and `Validator Checklist`.
  - If necessary implementation findings changed a detail of the spec (and were approved by `workflow-validator`), ensure the spec reflects the final accepted reality.
