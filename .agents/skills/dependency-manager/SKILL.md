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
4. **AGP & Infrastructure Compatibility (STRICT)**: Before proposing any update or adding a new library, the agent MUST perform a **Side-Effect Analysis**:
    - **AGP Verification**: Check if the library requires a higher Android Gradle Plugin version. If so, discard the update.
    - **JDK Verification**: Check if the library (especially testing tools like Robolectric/Roborazzi) requires a higher JDK version than the project's current one.
    - **Gradle Verification**: Check for minimum Gradle version requirements.
    - **IDE Impact**: Identify if manual user intervention is needed (e.g., changing "Gradle JDK" in Android Studio settings).
    - **Blocked Action**: If any infrastructure requirement (JDK, Gradle, AGP) is not met by the current environment and cannot be updated automatically, the operation MUST be discarded and the user notified.
5. **Modern Coordinates Only**: Automatically update migrated libraries (e.g., use androidx.room:room-runtime instead of old versions, and ensure KSP processors are used instead of KAPT for Room and Hilt).
6. **Zero Redundancy Policy**: PROHIBITED from declaring the same dependency multiple times in `build.gradle.kts` files. If a dependency is part of a `bundle`, do not declare it individually. If it's managed by a `BOM`, do not specify a manual version.
7. **No Hardcoded Strings**: PROHIBITED from using direct string literals for dependencies (e.g., `implementation("com.lib:version")`) in `build.gradle.kts`. All dependencies MUST be defined in `libs.versions.toml` and referenced via the `libs` object.
8. **Layer-Aware Dependencies**: Ensure that dependencies are added to the correct module (e.g., Domain should not have Android-specific dependencies).

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
