---
name: kotlin-style
description: Strict adherence to Official Kotlin Coding Conventions for the MeteoMartoCompose project. Ensures consistency in code layout, naming, and structure to minimize technical debt.
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
3.  **Function Declarations**: Business logic, sorted by visibility (public first) or logical flow.
4.  **Companion Object**: MUST be situated at the very end of the class, just before the closing brace.

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
*   KDoc for public APIs and complex logic.
*   Keep comments in English.

## 7. Error Handling & Logic Flow
*   **No Control Flow via Exceptions**: NEVER use `try-catch` blocks to manage standard application logic or navigation. 
*   **Proactive State Checking**: Always check conditions proactively (e.g., using `if`, `isEmpty()`, `hasRoute<T>()`, etc.) before performing an action that might fail. 
*   **Exception Rationale**: Exceptions must be reserved for truly exceptional and unpredictable system failures (e.g., I/O errors, network loss), not for predictable UI or navigation states.

---
**Enforcement**: Every agent MUST verify their proposed code changes against this checklist as part of their "Definition of Done".
