# Workflow Implementer Rules

## 1. Role Separation & Documentation Boundary

In the unified Foundation pipeline, implementation and documentation are separated across dedicated subagents:

- **`workflow-implementer` (🟡)** focuses 100% on Clean Architecture code, graphic asset conversion, unit/UI tests, `@compiler` verification, and updating `feature_list.json` (`passing`) + `PROGRESS.md`.
- **`workflow-documenter` (🔷)** runs after independent validation (`accept`) to author English KDoc, update `ARCHITECTURE.md` / `README.md`, and check off `[x]` items in `docs/features/<feature-id>/spec.md`.

**Exception (`CONSTRAINTS.md` & `spec.md`)**:
- Read `CONSTRAINTS.md` before implementing. If implementation or verification reveals a critical operational rule (`MUST` / `MUST NOT`) that future features must obey, append it to `CONSTRAINTS.md`.
- If implementation discovers that `docs/features/<feature-id>/spec.md` was factually blocked or required a necessary technical deviation, document the exact deviation in `PROGRESS.md` so `workflow-validator` and `workflow-documenter` can verify it.

---

## 2. Self-Verification & Evidence Rules (Worktree Optimization)

Because `workflow-validator` operates in a separate `git worktree` and avoids re-running expensive full Android Gradle builds when valid evidence is present, the implementer's self-verification evidence must be **complete, exact, and verifiable**:

1. Execute the **`compiler`** skill verification suite:
   - `./gradlew assembleDebug`
   - `./gradlew lintDebug`
   - `./gradlew testDebugUnitTest`
2. Record the exact command strings, task outcomes (`BUILD SUCCESSFUL`, number of tests passed), and test class names in both `feature_list.json` (`evidence` array) and `PROGRESS.md`.
3. If a check cannot run in the current repository state, record the exact technical reason and blocker. Never fake or fabricate command output.

Feature status convention:

- `in_progress`: Implementation or repair pass is underway.
- `passing`: Implementation is complete, `@compiler` verification passed, and detailed evidence is recorded in `feature_list.json` and `PROGRESS.md`. Ready for `workflow-validator`.
- `accepted`: Reserved exclusively for `workflow-orchestrator` after `workflow-validator` returns `accept` and `workflow-documenter` completes. Implementers MUST NOT set `accepted`.
- `blocked`: Implementation cannot continue with the current spec/context.

---

## 3. Canonical `@compiler` Quality Gate Rule

Once a repository has a runnable Android baseline, the quality gate is defined deterministically by the canonical `@compiler` invocation:

```bash
./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache
```

- **Exit code 0 (`BUILD SUCCESSFUL`)**: Quality gate passed. The implementer may mark the feature `passing`.
- **Exit code != 0 (`BUILD FAILED`)**: Quality gate failed. The implementer MUST repair the failure before requesting validation.
- During an explicitly pre-bootstrap phase where Android Gradle files do not yet exist, record that bootstrap is pending in `PROGRESS.md` and proceed with initial harness/module scaffolding.

---

## 4. Scope & Graphic Assets Rules

- **One feature per worktree session (`WIP=1`)**: Do not implement opportunistic adjacent features from `feature_list.json`.
- **No false `passing` status**: Never mark a feature `passing` with failing tests or compilation errors.
- **Graphic Assets Rule (`docs/features/<feature-id>/ui/`)**:
  - Convert raw PNG/JPEG graphic assets located in `docs/features/<feature-id>/ui/resources/` (or `docs/ui/resources/`) into optimized `.webp` format and place them in the target UI module:
    * **Layer-Based topology**: `app/src/main/res/drawable/ic_<name>.webp`
    * **Feature-First topology**: `<feature>/presentation/src/main/res/drawable/ic_<name>.webp` (or `core/designsystem/src/main/res/drawable/ic_<name>.webp` if shared across features).
  - **NEVER** convert full-screen mockups or screenshots located in `docs/features/<feature-id>/ui/screens/` (or `docs/ui/screens/`), which serve as visual reference layout guides only.
