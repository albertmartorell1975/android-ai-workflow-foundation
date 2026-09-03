---
name: compiler
description: Centralized project verification and compilation engine. Handles Gradle Sync, Lint, Compilation, and Deployment.
metadata:
  author: Albert Martorell Garcia
  version: 1.1.0
  keywords:
  - compile
  - build
  - lint
  - verification
  - quality
  - performance
---
# Project Compiler & Verification Specialist

This skill serves as the project's quality gateway. It ensures that any code changes meet the technical standards of **MeteoMartoCompose** by executing a comprehensive suite of static analysis and build commands.

## Skill Capabilities

As a Skill, `compiler` provides both standalone actions and a complete verification suite:

### 1. Standalone Actions (Immediate Execution)
- **Environment Validation (MANDATORY)**: Before any compilation, the agent MUST verify that the local environment matches the project's requirements:
  - Check that `java -version` matches the `jvmToolchain` defined in `build.gradle.kts`.
  - Check that the IDE's Gradle JDK (from `.idea/gradle.xml`) is correctly aligned.
  - If a mismatch is detected, the agent MUST stop and report the configuration error to the user before attempting any build.
- **Static Analysis**: To be executed on specific files during development.
  - **Command**: `analyze_file [file_path]`
- **Code Cleanliness**: Agents MUST remove all unused imports, variables, and functions detected during the analysis phase or identified through manual review.

### 2. Full Verification Suite (Final "Definition of Done")
To be executed in order BEFORE finalizing any task:
1. **Lint & Analysis**: Run `analyze_file` on all modified files and clean up unused code (imports, variables).
2. **Logic Verification**: Run Unit Tests for all modified modules (e.g., `./gradlew :usecases:test`).
3. **Deployment & Final Build**: Run `android run` (or visual verification with `render_compose_preview`). This command automatically compiles, assembles, and installs the app, saving redundant build cycles.
4. **Foundation Synchronization (MANDATORY)**: If any file in `.agents/skills/` was modified during the task, update `skills-lock.json` with the new hashes and then execute the `foundation-evolve` skill to promote changes to the central repository.
5. **Room Schema Verification**: If any `@Entity` class was modified, verify that the `MeteoMartoDatabase` version has been incremented and all entities are correctly registered with trailing commas.
6. **Skill Lock Integrity**: Verify that `skills-lock.json` is synchronized with the actual content of the `.agents/skills/` directory.

## Build Performance Guidelines (MANDATORY)

To minimize token usage and wait times, all agents MUST follow these performance rules:

1. **Modular Verification**: In the "Logic Verification" phase, DO NOT run a full project build if only one module was modified. Use targeted Gradle tasks (e.g., `./gradlew :domain:test` instead of `./gradlew test`).
2. **On-Demand Documentation**: Dokka documentation tasks are **disabled by default** to optimize developer velocity. They are OPTIONAL during development but RECOMMENDED before finalizing major design system updates or during release phases using the `-PgenerateDocs` flag to verify KDoc integrity.
3. **Parallel & Cache Execution**: When running shell-based Gradle commands, always use the following flags to maximize performance:
   - `--parallel`: Executes tasks in parallel.
   - `--build-cache`: Reuses outputs from previous builds.
   - `--configuration-cache`: Caches the result of the configuration phase.
4. **KSP Optimization Check**: Ensure the project uses the optimized KSP configuration in `build.gradle.kts`:
   ```kotlin
   ksp {
       arg("dagger.formatGeneratedSource", "disabled")
   }
   ```
5. **Incremental Sync**: Only trigger `gradle_sync` when changes to `libs.versions.toml` or `build.gradle.kts` are completed and verified by the agent's logic. Avoid redundant syncs during mid-refactor.

## Operational Rules
- Agents MUST invoke this skill before finalizing any task.
- A task is NOT complete if any command in this skill fails.
- All Android resources (XML) must have their IDs and references verified through this skill.
- **Governance Verification**: When modifying `.md` files, agents MUST verify that all internal links and file references are valid, resolvable, and case-sensitive according to the filesystem.
