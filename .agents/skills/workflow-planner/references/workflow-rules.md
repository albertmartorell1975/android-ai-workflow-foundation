# Architectural & Scope Discipline (`workflow-planner`)

## 1. Repository and Architectural Discipline

The generated specification (`docs/features/<feature-id>/spec.md`) must be repository-aware. Before defining implementation steps, inspect the smallest sufficient amount of repository context required to make the specification concrete.

Prefer:
* established module boundaries (`module-architecture-governance`),
* existing repository and error-mapping abstractions (`repository-pattern-governance`),
* existing ViewModel passive initialization and hybrid UI state patterns (`viewmodel-architecture-governance`),
* existing naming and Kotlin conventions (`kotlin-style`),
* existing dependency injection patterns,
* existing testing seams (`testing-setup`),
* existing design-system components (`design-system-governance`),
* and adjacent feature implementations.

**Constraint:** Do not introduce a new architectural pattern when an established compatible pattern already exists. Do not invent files, classes, modules, endpoints, database schemas, or infrastructure that are not supported by the feature requirements or repository evidence.

---

## 2. Scope Discipline & Human-Reviewable PR Slicing

Every `<feature-id>` in `feature_list.json` maps `1:1` to a single Pull Request (`WIP=1`). An AI-generated PR is held to the exact same reviewability bar as a human PR: if a diff bundles too many concerns to review properly, it is too big to merge. Do not enforce rigid file or line-count caps; instead, enforce **semantic sub-slicing** and forbid scope expansion into:
* unrelated refactors or piggybacked follow-up cleanups from prior PRs,
* broad cross-cutting migrations mixed with feature behavior,
* unrelated documentation work,
* speculative future features,
* or general technical cleanup.

A small behavior-preserving refactor may be included only when it directly enables the requested feature and can be reviewed cleanly alongside it.

### Evaluating `Expected File Changes` (What Counts vs. What Is Excluded)
When diagnosing scope breadth in Phase 1:
* **Counted (Human-Reviewed Code & Tests)**: `.kt`, `.java`, `.kts`, `AndroidManifest.xml`, non-generated resource values (`strings.xml`, `config.xml`), and `*Test.kt` files.
* **Excluded (Non-Code Visuals, Snapshots & Harness Artifacts)**: graphic icons/drawables (`*.webp`, `*.png`), Roborazzi golden snapshots (`**/snapshots/*.png`), Room exported schemas (`**/schemas/*.json`), and harness state/docs (`docs/features/**`, `PROGRESS.md`, `feature_list.json`).

If `Expected File Changes` (counted files only) spans multiple independently verifiable sub-tasks — e.g., multiple independent screens/routes, multiple distinct component families, or a cross-cutting contract/infrastructure change bundled with all downstream screen/module migrations — **stop in Phase 1 and propose splitting `<feature-id>` into ordered sub-entries in `feature_list.json` chained via `depends_on`** (updating downstream `depends_on` references cleanly without reopening project discovery).

---

## 3. Validation Awareness

Every `docs/features/<feature-id>/spec.md` must specify how **`workflow-implementer`** and **`workflow-validator`** will verify the feature:
1. **Static & Architecture Audit**: Clean Architecture layer boundaries, Compose stability/modifier rules, and Android Intent security.
2. **Compiler & Unit Tests (`@compiler`)**: `./gradlew assembleDebug`, `./gradlew lintDebug`, and `./gradlew testDebugUnitTest`.
3. **Visual Validation**: UI states (`Loading`, `Error`, `Empty`, `Success`) covered by stateless `@Preview`s (`testing-setup` §3.6). No Compose UI tests for screens.
4. **Runtime / Emulator Verification (`@android-cli`)**: When `UI Involved: yes`, the `Given / When / Then` Acceptance Scenarios are executed by `workflow-validator` (Level 4) as `@android-cli` journeys on an active emulator/device (`SKIPPED` when headless).

---

## 4. Unified Feature Folder Rule

All feature artifacts belong under the canonical directory:
```text
docs/features/<feature-id>/
├── spec.md
├── ui/
│   ├── screens/     # Reference layout mockups (NEVER converted to drawables)
│   └── resources/   # Raw PNG/JPEG assets (MUST be converted to res/drawable/ic_*.webp)
└── validator/
    └── validation-report.md
```

Whenever changes affect `.agents/skills/`, the specification's **Durable Documentation Impact** section MUST also instruct `workflow-documenter` to run `git status .agents/skills/` and synchronize `.agents/skills/README.md`.