---
name: dependency-manager
description: Strict protocol for dependency management in the libs.versions.toml file.
metadata:
  author: Albert Martorell Garcia
  version: 1.1.0
  keywords: [dependencies, toml, version-catalog, stability, ksp, hilt, bom]
---

# Dependency Integrity Architect

This skill establishes an unbreakable protocol to ensure the compatibility and modernity of dependencies in **MeteoMartoCompose**.

## Golden Rules (MANDATORY)

1. **Anti-Hallucination Policy**: PROHIBITED from inventing or hallucinating version numbers. If the version is not found via `version_lookup`, the agent must ask the user or consult official documentation.
2. **Kebab-case Enforcement**: All library aliases and versions in the TOML file MUST use kebab-case (e.g., `androidx-room-runtime`).
3. **BOM & Plugin Alignment**: For Firebase and Jetpack Compose, use the BOM declaration where applicable. For the Compose Compiler, ensure it aligns with the `org.jetbrains.kotlin.plugin.compose` plugin corresponding to the current Kotlin version.
4. **Modern Coordinates Only**: Automatically update migrated libraries (e.g., use androidx.room:room-runtime instead of old versions, and ensure KSP processors are used instead of KAPT for Room and Hilt).
5. **Bundle Grouping**: Group related libraries that share a version (or are used together) in the `[bundles]` section (e.g., `compose-bundle = { modules = ["ui", "ui-graphics", "material3"] }` or `compose = ["ui", "ui-graphics"]` depending on the Gradle version style guide used in the project).

## Update Protocols

### 1. Atomic Updates
- Do not update Kotlin, KSP, and Hilt simultaneously.
- Every core change (Kotlin/KSP/Compose) requires a cycle of:
  1. Change in TOML.
  2. `gradle_sync`.
  3. `gradle_build` of the impacted module.
  4. Unit test verification.

### 2. KSP Management
- The KSP version must exactly match the Kotlin version (e.g., Kotlin `2.0.21` -> KSP `2.0.21-1.0.26`). Do not assume compatibility without verification.

### 3. Security Rollback
- In case of an "Internal compiler error", the agent must perform an immediate rollback of the `libs.versions.toml` file.
