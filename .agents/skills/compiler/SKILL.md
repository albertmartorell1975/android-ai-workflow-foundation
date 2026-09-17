---
name: compiler
description: Centralized project verification and compilation engine. Handles Gradle Sync, Lint, Compilation, and Deployment.
metadata:
  author: Albert Martorell Garcia
  version: 1.2.0
  keywords:
  - compile
  - build
  - lint
  - verification
  - quality
  - performance
  - reports
  - documentation
---
# Project Compiler & Verification Specialist

This skill serves as the project's quality gateway. It ensures that any code changes meet technical standards by executing a comprehensive suite of static analysis and build commands.

## Skill Capabilities

As a Skill, `compiler` provides both standalone actions and a complete verification suite:

### 1. Standalone Actions (Immediate Execution)
- **Environment Validation (MANDATORY)**: Before any compilation, the agent MUST verify that the local environment matches requirements (Java version, Gradle JDK).
- **Structural Sync (MANDATORY)**: Any modification to `.gradle.kts`, `libs.versions.toml`, or `gradle.properties` MUST be immediately followed by a `gradle_sync` call.
- **Static Analysis**: To be executed on specific files during development via `analyze_file`.
- **Code Cleanliness**: Agents MUST remove all unused imports, variables, and functions.

### 2. Full Verification Suite (Final "Definition of Done")
To be executed in order BEFORE finalizing any task:
1. **Lint & Analysis**: Run `analyze_file` on all modified files and clean up unused code.
2. **Logic Verification**: Run Unit Tests for modified modules (e.g., `./gradlew :feature:test`).
3. **Deployment & Final Build**: Run `android run` (or `render_compose_preview` for UI).
4. **Reports & Assets Generation**:
   - **Visual Snapshots (Roborazzi)**: `./gradlew recordRoborazziDebug` to update reference images.
   - **Code Coverage (Jacoco)**: `./gradlew jacocoTestReport` to generate coverage reports.
   - **Technical Documentation (Dokka)**: `./gradlew :dokkaGenerateHtml -PgenerateDocs` to verify KDoc integrity.
5. **Foundation Synchronization (MANDATORY)**: If any file in `.agents/skills/` was modified, update hashes and execute `foundation-evolve`.
6. **Room Schema Verification**: If any `@Entity` class was modified, verify that the Database version has been incremented and all entities are correctly registered.
7. **Skill Lock Integrity**: Verify that `skills-lock.json` is synchronized with the actual content of the `.agents/skills/` directory.

## Build Performance Guidelines (MANDATORY)

1. **Modular Verification**: Use targeted Gradle tasks instead of full project builds.
2. **On-Demand Documentation**: Dokka tasks are disabled by default; use `-PgenerateDocs` only when needed.
3. **Optimization Flags**: Use `--parallel`, `--build-cache`, and `--configuration-cache` for shell-based commands.
4. **KSP Optimization Check**: Ensure the project uses the optimized KSP configuration in build files.
5. **Incremental Sync**: Only trigger `gradle_sync` when changes to `libs.versions.toml` or build files are completed.

## Operational Rules
- Agents MUST invoke this skill before finalizing any task.
- A task is NOT complete if any command in this skill fails.
- All Android resources (XML) must have their IDs and references verified through this skill.
- **Governance Verification**: When modifying `.md` files, agents MUST verify that all internal links and file references are valid, resolvable, and case-sensitive according to the filesystem.
