# Architectural & Scope Discipline (`workflow-planner`)

## 1. Repository and Architectural Discipline

The generated specification (`docs/features/<feature-id>/spec.md`) must be repository-aware. Before defining implementation steps, inspect the smallest sufficient amount of repository context required to make the specification concrete.

Prefer:
* established module boundaries (`module-architecture-governance`),
* existing repository and error-mapping abstractions (`repository-pattern-governance`),
* existing ViewModel passive initialization and hybrid UI state patterns (`viewmodel-architecture-governance`),
* existing naming and Kotlin conventions (`kotlin-style`),
* existing dependency injection patterns,
* existing testing seams (`testing-setup`, `compose-ui-testing-patterns`),
* existing design-system components (`design-system-governance`),
* and adjacent feature implementations.

**Constraint:** Do not introduce a new architectural pattern when an established compatible pattern already exists. Do not invent files, classes, modules, endpoints, database schemas, or infrastructure that are not supported by the feature requirements or repository evidence.

---

## 2. Scope Discipline & Feature Slicing

The generated specification must remain focused on the single selected `<feature-id>` (`WIP=1`). Do not expand the scope into:
* unrelated refactors,
* broad architecture migrations,
* unrelated documentation work,
* speculative future features,
* or general technical cleanup.

A small behavior-preserving refactor may be included only when it directly enables the requested feature and can be validated independently.

If a requested feature is too broad to complete in one focused pipeline pass (e.g., it requires multiple independent data models and multiple unrelated screens, or the spec would far exceed 250 lines), stop and recommend splitting it into smaller dependent entries in `feature_list.json`.

---

## 3. Validation Awareness

Every `docs/features/<feature-id>/spec.md` must specify how **`workflow-implementer`** and **`workflow-validator`** will verify the feature:
1. **Static & Architecture Audit**: Clean Architecture layer boundaries, Compose stability/modifier rules, and Android Intent security.
2. **Compiler & Unit Tests (`@compiler`)**: `./gradlew assembleDebug`, `./gradlew lintDebug`, and `./gradlew testDebugUnitTest`.
3. **Compose UI Tests**: Verification of UI states (`Loading`, `Error`, `Empty`, `Success`) and user interactions via `compose-ui-testing-patterns`.
4. **Runtime / Emulator Verification (`@android-cli`)**: Concrete user journey steps to verify on an active Android emulator/device when available.

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