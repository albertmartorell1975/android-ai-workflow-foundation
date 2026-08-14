---
name: dependency-manager
description: Strict protocol for dependency management in the libs.versions.toml file.
metadata:
  author: Albert Martorell Garcia
  version: 1.2.0
  keywords: [dependencies, toml, version-catalog, stability, ksp, hilt, bom, agp-compatibility]
---

# Dependency Integrity Architect

this skill establishes an unbreakable protocol to ensure the compatibility and modernity of dependencies in **MeteoMartoCompose**.

## Golden Rules (MANDATORY)

1. **Anti-Hallucination Policy**: PROHIBITED from inventing or hallucinating version numbers. If the version is not found via `version_lookup`, the agent must ask the user or consult official documentation.
2. **Kebab-case Enforcement**: All library aliases and versions in the TOML file MUST use kebab-case (e.g., `androidx-room-runtime`).
3. **BOM & Plugin Alignment**: For Firebase and Jetpack Compose, use the BOM declaration where applicable. For the Compose Compiler, ensure it aligns with the `org.jetbrains.kotlin.plugin.compose` plugin corresponding to the current Kotlin version.
4. **AGP Compatibility Verification**: Before proposing any update to Core libraries (Hilt, KSP, Compose, Navigation), the agent MUST:
    - Identify the current project AGP version from `libs.versions.toml`.
    - Verify via official release notes (using `web_search` or `search_android_docs`) if the new library version requires a higher AGP version.
    - **Blocked Action**: If the library requires an AGP version higher than the project's current one, the update MUST be discarded.
5. **Modern Coordinates Only**: Automatically update migrated libraries (e.g., use androidx.room:room-runtime instead of old versions, and ensure KSP processors are used instead of KAPT for Room and Hilt).

## Update Protocols

### 1. Strict Atomic Updates
- **No Mixing**: Prohibited from adding new libraries and updating existing versions in the same operation.
- **One by One**: Core changes (Kotlin, KSP, Hilt, Compose) must be handled in separate commits.
- Every change requires a cycle of:
  1. Single targeted change in TOML.
  2. `gradle_sync`.
  3. `gradle_build` of the impacted module.
  4. Unit test verification.

### 2. KSP Management
- The KSP version must exactly match the Kotlin version (e.g., Kotlin `2.0.21` -> KSP `2.0.21-1.0.26`). Do not assume compatibility without verification.

### 3. Fail-and-Revert Policy (STRICT)
- In case of a `gradle_sync` or `gradle_build` failure following a `libs.versions.toml` change:
    - **PROHIBITED**: Trying alternative versions or making iterative "guesses".
    - **MANDATORY**: Perform an immediate **Rollback** of the `libs.versions.toml` file to its last working state.
    - **Resolution**: Provide the user with the exact error log and wait for explicit technical instructions.
