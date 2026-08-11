---
name: compiler
description: Centralized project verification and compilation engine. Handles Gradle Sync, Lint, Compilation, and Deployment.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords:
  - compile
  - build
  - lint
  - verification
  - quality
---
# Project Compiler & Verification Specialist

This skill serves as the project's quality gateway. It ensures that any code changes meet the technical standards of **MeteoMartoCompose** by executing a comprehensive suite of static analysis and build commands.

## Skill Capabilities

As a Skill, `compiler` provides both standalone actions and a complete verification suite:

### 1. Standalone Actions (Immediate Execution)
- **Static Analysis**: To be executed on specific files during development.
  - **Command**: `analyze_file [file_path]`
- **Code Cleanliness**: Agents MUST remove all unused imports and redundant code detected during the analysis phase.

### 2. Full Verification Suite (Final "Definition of Done")
To be executed in order BEFORE finalizing any task:
1. **Lint & Analysis**: Run `analyze_file` on all modified files.
2. **Cleanliness**: Ensure no unused imports remain in any modified file.
3. **Compilation**: Run `./gradlew compileDebugKotlin`.
4. **Project Integrity**: Run `./gradlew assembleDebug`.
5. **Deployment**: `android run` and visual verification.

## Operational Rules
- Agents MUST invoke this skill before finalizing any task.
- A task is NOT complete if any command in this skill fails.
- All Android resources (XML) must have their IDs and references verified through this skill.
- **Governance Verification**: When modifying `.md` files, agents MUST verify that all internal links and file references are valid, resolvable, and case-sensitive according to the filesystem.
