---
name: kotlin-style
description: Strict adherence to Official Kotlin Coding Conventions for the project. Ensures consistency in code layout, naming, and structure to minimize technical debt.
version: 1.2.0
keywords:
  - kotlin
  - coding-conventions
  - style-guide
  - formatting
  - naming
  - error-handling
---

## 1. Class Layout & Order
To maintain readability, all Kotlin classes MUST follow this declaration order:
1.  **Properties and Initializer Blocks**: Grouped by visibility and purpose.
2.  **Secondary Constructors**: Following the primary constructor.
3.  **Public/Internal Functions**: The entry points and public API of the class.
4.  **Private Functions**: Helper methods and implementation details. These MUST be situated after all public functions to keep the API at the top.
5.  **Companion Object**: MUST be situated at the very end of the class, just before the closing brace.

### The Step-down Rule
Organize functions so that they can be read as a narrative from top to bottom. A high-level function should be followed by the lower-level private functions it calls. If a private function is shared by multiple public ones, place it at the very bottom of the function block.

## 2. Naming Conventions
*   **Classes/Objects**: PascalCase (e.g., `RemoteConfigMapper`).
*   **Functions/Properties**: lowerCamelCase (e.g., `mapToThreshold`). 
*   **Descriptive over Brief**: Prioritize readability over brevity. Avoid abbreviations that obscure meaning. Property names MUST be descriptive and start with a lowercase letter (e.g., use `medium` instead of `m`, `extraSmall` instead of `xs`).
*   **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_THRESHOLD`).

## 3. Imports
*   **No Wildcards**: Always use explicit imports. Never use `import paquet.*`.
*   **Unused Imports**: Unused imports MUST be removed as part of the "Definition of Done".

## 4. Modifier Order
Always follow the **canonical order** of Kotlin modifiers to avoid lint warnings and maintain consistency. The most common order is:
1.  Visibility (`public`, `internal`, `private`)
2.  `override`
3.  `suspend`
4.  `inline`, `infix`, `operator`
5.  `data`

**Example**:
*   ✅ `suspend operator fun invoke(...)`
*   ❌ `operator suspend fun invoke(...)`

## 5. Formatting
*   Use 4 spaces for indentation.
*   Avoid "Magic Literals": All literal values (Strings, Numbers, URI schemes, etc.) used as thresholds, defaults, or keys MUST be extracted to centralized constants (e.g., `AppConstants`).
*   Trailing Commas: Always use trailing commas in multi-line parameter lists to reduce diff noise.

## 6. Documentation
*   **Role Boundary in Multi-Agent Pipeline**: In the multi-agent workflow, authoring KDoc is owned **exclusively** by `workflow-documenter` (Stage 4) after independent validation acceptance. `workflow-implementer` (Stage 2) MUST NOT write KDoc comments (`/** ... */`) when generating or editing code, ensuring `workflow-documenter` can author them following validation.
*   **KDoc Standards**: When authored by `workflow-documenter`, provide concise English KDoc for public APIs, classes, interfaces, and complex domain interactors.
*   **Inline Comments**: Keep inline comments minimal and strictly in English, explaining only non-obvious operational logic.

## 7. Error Handling & Logic Flow
*   **No Control Flow via Exceptions**: NEVER use `try-catch` blocks to manage standard application logic or navigation. 
*   **Proactive State Checking**: Always check conditions proactively (e.g., using `if`, `isEmpty()`, `hasRoute<T>()`, etc.) before performing an action that might fail. 
*   **Exception Rationale**: Exceptions must be reserved for truly exceptional and unpredictable system failures (e.g., I/O errors, network loss), not for predictable UI or navigation states.

## 8. Function Ownership & Extension Boundaries
*   **Semantic Owner First**: Place functions on the smallest accurate semantic owner. Extension syntax changes call shape, never ownership.
*   **No Extensions on Primitives or External Common Types**: Reject extensions on `String`, primitives, collections, and third-party types that encode domain construction or policy (e.g., ❌ `fun String.toUserId()`; ✅ `UserId.parse(rawString)` or `UserId(rawString)`).
*   **Use Companion Factory or Named Constructor**: Construction, parsing, or type transformations belong in companion factory functions or constructors of the target domain model.

## 9. Control Flow & Branch Exhaustiveness
*   **Subject `when`**: When classifying a single variable, always use a subject `when (state)` instead of repeated checks (`if (state == ...)`).
*   **Exhaustive Without Fake `else`**: For closed domains (sealed interfaces, sealed classes, enums), handle every case explicitly. Never add a blanket `else -> ...` solely to silence the compiler.
*   **Flatten Preconditions Early**: Use `val item = nullableItem ?: return` or `require(...)` to exit early and keep the happy path unnested.
*   **Guard Conditions**: Use guard conditions (`when (event) { is Event.Message if event.isUnread -> ... }`) when an extra branch-local predicate refines a primary type match.

---
**Enforcement**: Every agent MUST verify their proposed code changes against this checklist as part of their "Definition of Done".
