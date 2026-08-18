---
name: kotlin-style
description: Strict adherence to Official Kotlin Coding Conventions for the MeteoMartoCompose project. Ensures consistency in code layout, naming, and structure to minimize technical debt.
version: 1.0.0
keywords:
  - kotlin
  - coding-conventions
  - style-guide
  - formatting
  - companion-object
---

## 1. Class Layout & Order
To maintain readability, all Kotlin classes MUST follow this declaration order:
1.  **Properties and Initializer Blocks**: Grouped by visibility and purpose.
2.  **Secondary Constructors**: Following the primary constructor.
3.  **Function Declarations**: Business logic, sorted by visibility (public first) or logical flow.
4.  **Companion Object**: MUST be situated at the very end of the class, just before the closing brace.

## 2. Naming Conventions
*   **Classes/Objects**: PascalCase (e.g., `RemoteConfigMapper`).
*   **Functions/Properties**: camelCase (e.g., `mapToThreshold`).
*   **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_THRESHOLD`).

## 3. Formatting
*   Use 4 spaces for indentation.
*   Avoid "Magic Numbers": All literal values used as thresholds or defaults must be extracted to constants.
*   Trailing Commas: Always use trailing commas in multi-line parameter lists to reduce diff noise.

## 4. Documentation
*   KDoc for public APIs and complex logic.
*   Keep comments in English.

---
**Enforcement**: Every agent MUST verify their proposed code changes against this checklist as part of their "Definition of Done".
