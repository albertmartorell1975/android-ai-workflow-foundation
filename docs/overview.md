# Architecture Overview

The **Android AI Workflow Foundation v2.0.0** is a unified multi-agent framework for Android development. It combines Clean Architecture engineering guardrails, persistent project harness state (`feature_list.json`, `PROGRESS.md`, `CONSTRAINTS.md`), and isolated **`git worktree`** subagents under human supervision.

The Foundation structures development across three modular layers:

1. **Project Initialization & Harness Setup** (`workflow-initializer`, `build-brief`, `harness-starter`)
2. **Unified Multi-Agent Feature Pipeline** (`workflow-orchestrator`, `workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`)
3. **Shared Engineering Guardrails & Android Expertise** (`compiler`, `git-governance`, Clean Architecture, Hilt, Room, Firebase, Kotlin, and Jetpack Compose skills)

---

### High-Level Architecture

```text
               PHASE 1: INITIALIZATION, DISCOVERY & HARNESS SETUP
          ─────────────────────────────────────────────────────────────
                            [Foundation Installation]
                                       │
                                       ▼
                            [workflow-initializer]
                                       │
                   ┌───────────────────┴───────────────────┐
                   │ (New Product / MVP / Epic)            │ (Existing Codebase)
                   ▼                                       ▼
             [@build-brief] (Product Discovery)            │
                   │                                       │
                   ▼                                       │
             [@harness-starter] ◄──────────────────────────┘
             (Creates AGENTS.md, PROGRESS.md, CONSTRAINTS.md, feature_list.json)
                                       │
                                       ▼
                         PHASE 2: FEATURE EXECUTION MODES
          ─────────────────────────────────────────────────────────────
                   ┌───────────────────┴───────────────────┐
                   │                                       │
             [Mode A: Standalone Feature]            [Mode B: Backlog Queue Mode]
             (Ad-hoc / Single Feature Run)           (Process feature_list.json queue)
                   │                                       │
                   └───────────────────┬───────────────────┘
                                       │
                                       ▼
                      SHARED MULTI-AGENT WORKTREE PIPELINE
          ─────────────────────────────────────────────────────────────
                      [workflow-orchestrator] 🟣 (Queue & Worktrees)
                                        │
                                        ▼
                       [workflow-planner] 🔵 (Generates spec.md) ◄────────────────┐
                                        │                                         │
                                        ▼ (*)                                     │ (3. Re-plan)
                     [workflow-implementer] 🟡 (Code & Tests) ◄─────────┐         │
                                        │                               │         │
                                        ▼ (*)                           │         │
                      [workflow-validator] 🟢/🔴 (Read-Only Audit)      │         │
                        │                             │                 │         │
           (*) (ACCEPT) │                    (REVISE) │                 │         │
                        │                             ▼                 │ (Auto   │
                        │                  [Attempts <= MAX (2)?]       │  repair │
                        │                    ├── Yes ───────────────────┤  pass)  │
                        │                    │                          │         │
                        │                    └── No (Limit reached)     │         │
                        │                           │                   │         │
                        │                           ▼                   │         │
                        │              [🛑 Human Decision Gate]         │         │
                        │                (needs_human_review)           │         │
                        │ ◄────────────────├── 1. Override              │         │
                        │                  ├── 2. Human Hint ───────────┘         │
                        │                  ├── 3. Re-plan ────────────────────────┘
                        │                  └── 4. Cancel ──► [Clean & Abort]
                        │
                        ▼
                      [workflow-documenter] 🔷 (KDoc & spec.md [x])
                                        │
                                        ▼
                       [@git-governance] (Atomic Layer Commits)
                                         │
                                         ▼
                       [GitHub Delivery: publish] (Stage 6: PR + CI Gate)
                                         │
                                         ▼
                       [PR Code Review & Feedback Loop] (Stage 7: Round #1..#N) ◄──┐
                                         │ (Persists PR Review Brief in pr-review.md│
                                         │  & rehydrates Worktree wt/impl-<id>)    │
                                         ▼                                         │
                              [workflow-implementer] 🟡 ◄─────────────┐            │
                                         │ (Refactors code & tests    │            │
                                         │  + runs @compiler)         │ (Auto      │
                                         ▼                            │  repair    │
                               [workflow-validator] 🟢/🔴             │  <= 2)     │
                                         │                            │            │
                                (ACCEPT) ├─── (REVISE) ───────────────┘            │
                                         ▼                                         │
                              [workflow-documenter] 🔷                             │
                                         │ (Updates KDoc & syncs spec.md/docs)     │
                                         ▼                                         │
                                [@git-governance]                                  │
                                         │ (Consolidates delta & pushes to PR)     │
                                         └─────────────────────────────────────────┘
                                         │ (PR Approved by Human)
                                         ▼
                                 [🛑 Human Merge]

(*) Optional Human-in-the-Loop Checkpoint if configured in `require_review_after` ("planner", "implementer", "validator") or requested via prompt.
```

---

## Layer 1: Initialization, Discovery & Harness

### 1. `workflow-initializer`
Bootstraps the project environment:
* Performs Stack Auto-Inspection (Project Name, Module Topology) and executes a **Hard Stopping Gate** to prompt the developer for their target AI Provider (`Gemini / Antigravity`, `Cursor`, or `Claude Code`) and Optional Catalog Plugins before generating any project files. Standards (MVVM, Hilt, Room, Firebase) are active by default.
* Materializes `AGENTS.md`.
* Configures AI Context Exclusion (`ai-context-exclusion`), automatically excluding `.worktrees/`, `.gradle/`, and build outputs from the AI context.
* Materializes provider-specific subagent definitions (`workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter` under `.claude/agents/`, `.cursor/agents/`, or native Antigravity `.agents/agents/` configuration) using **`SUBAGENT_SKILLS.json`** (plus any installed optional catalog plugins) for single-source-of-truth skill injection with `model: inherit`, and adds `.worktrees/` to `.gitignore`.

#### 🛡 Automated AI Safety Hooks (`agent-safety-hooks`)
During project initialization, the Foundation automatically installs lifecycle safety hooks tailored to the active AI provider (**Claude Code**, **Cursor**, or **Gemini / Antigravity**):
* **Destructive Command Interception**: Intercepts shell commands before execution and strictly blocks catastrophic patterns such as `rm -rf`, `rmdir /s /q`, `Remove-Item -Recurse -Force`, `git clean -fdx`, `git reset --hard`, autonomous `gh pr merge` (ensuring PR merges are strictly human), and destructive force pushes.
* **Provider Integration**:
  * **Claude Code**: Registered as a `PreToolUse` hook in `.claude/settings.json` executing `block-rm-rf.js`.
  * **Cursor**: Registered as a `beforeShellExecution` hook under `.cursor/hooks/`.
  * **Gemini / Antigravity**: Registered via `.agents/hooks.json`.
* **Why it matters**: Autonomous subagents execute terminal commands to run Gradle builds and tests inside isolated worktrees. This automated guardrail ensures that no agent can accidentally delete project files, Gradle caches, or repository assets.

### 2. `build-brief` & `harness-starter`
* **`build-brief`**: Conducts a structured one-question-at-a-time discovery interview for new products or major modules, producing `CONTEXT.md`, `docs/build-brief.md`, `docs/domain-model.md`, and `DESIGN.md`.
* **`harness-starter`**: Derives `AGENTS.md`, `PROGRESS.md`, `CONSTRAINTS.md`, `feature_list.json`, and `.github/workflows/gate.yml` (plus `docs/features/<feature-id>/` directories), either from `build-brief` discovery docs or directly from an existing Android codebase.

---

## Supported Modular Topologies (`module-architecture-governance`)

The Foundation supports two Clean Architecture module topologies depending on app scale:

1. **Layer-Based Modular Topology (Small to Medium Apps)**:
   * `:domain` — Pure Kotlin business entities, Repository interfaces & DomainError models.
   * `:usecases` — Pure Kotlin single-responsibility interactors.
   * `:data` — Repository implementations, Room DAOs, DataSources, Network DTO mappers.
   * `:app` — Jetpack Compose UI, ViewModels, Navigation, and Dependency Injection graph.

2. **Feature-First Modular Topology (Scalable & Multi-Team Apps)**:
   * `:<feature>:domain` — Feature-scoped models, repository interfaces & use cases.
   * `:<feature>:usecases` — Feature-specific interactors.
   * `:<feature>:data` — Feature local/remote data sources & repository implementations.
   * `:<feature>:presentation` — Feature Jetpack Compose UI screens & ViewModels.
   * `:core:database`, `:core:network`, `:core:designsystem`, `:core:common` — Shared foundations.
   * `:app` — Thin application shell, global NavHost & root DI container.

---

## Layer 2: Unified Multi-Agent Feature Pipeline

Whether a developer requests a **Standalone Feature (Mode A)** or processes a **Backlog Queue from `feature_list.json` (Mode B)**, every feature executes through five specialized roles identified by visual color badges:

### 1. 🟣 Orchestrator (`workflow-orchestrator`)
* Reads `feature_list.json` and `PROGRESS.md` (creating or appending the feature entry automatically in Standalone Mode).
* Can run ready features sequentially or launch independent features (whose `depends_on` prerequisites are all `accepted`) in parallel worktrees.
* Manages the `feature/<feature-id>` branch and temporary subagent worktrees (`.worktrees/impl-<id>`, `.worktrees/val-<id>`, `.worktrees/doc-<id>`).
* Receives the read-only evaluation from `workflow-validator`, persists `docs/features/<feature-id>/validator/validation-report.md`, and bounds repair cycles to `MAX_REPAIR_ATTEMPTS = 2` (passing the `Implementation Repair Brief` directly to `workflow-implementer` on `revise` when attempts remain).
* **Dual Human-in-the-Loop Architecture**:
  - **Proactive Declarative Checkpoints (`require_review_after`)**: Features can declare optional pause points in `feature_list.json` (e.g., `"require_review_after": "planner"` or `"validator"`), or developers can request them ad-hoc via prompt. The orchestrator halts before the next stage, presents deliverables with clickable links, and offers structured options (`[Approve & Proceed]`, `[Human Hint]`, `[Manual Worktree Edits]`, `[Abort]`).
  - **Reactive Decision Gate (`needs_human_review`)**: When autonomous repair attempts exceed `MAX_REPAIR_ATTEMPTS = 2` without reaching `accept`, pauses looping immediately, preserves `.worktrees/impl-<feature-id>`, sets status to `needs_human_review`, and presents 4 resolution options (Manual Override, Human Guidance Hint, Re-plan `spec.md`, or Cancel/Defer). Once resolved to acceptance, seamlessly resumes Stage 4 (Documenter) and Stage 5 (Consolidation & Commits).
* **Exclusively owns `@git-governance`**: Consolidates the final worktree after documentation completes, synchronizes root workspace Gradle build models (`./gradlew prepareKotlinBuildScriptModel --build-cache`) if build configuration files were touched, marks the feature `accepted` in `feature_list.json`, and creates atomic layer-specific Conventional Commits (`feat(domain)`, `feat(data)`, `feat(usecases)`, `feat(ui)`, `test`, `docs`).

### 2. 🔵 Planner (`workflow-planner`)
* Spawns in a clean subagent context with edit permissions restricted strictly to specification files (`docs/features/<feature-id>/spec.md`, `feature_list.json`, `PROGRESS.md`), never modifying executable application code.
* Inspects the repository and clarifies up to 3 blocking technical questions with the user.
* Produces the unified feature contract at **`docs/features/<feature-id>/spec.md`**, combining:
  - Idea Diagnosis & Assumptions
  - Goal, Non-Goals & `Given / When / Then` Acceptance Scenarios
  - Repository Research & Expected File Changes
  - Android Layer Breakdown (`UI/UX` + `docs/features/<id>/ui/` asset rules, `API Design`, `Persistence`, `Durable Documentation Impact`)
  - Granular Clean Architecture Checklist (`Database/Models -> Domain -> Data -> UseCase -> UI -> Pragmatic Testing -> @compiler`)
  - **Pragmatic Testing Plan (`testing-setup`)**: Enforces the Strict Test Budget (1–3 focused tests per class, 2–6 tests total per feature slice) avoiding redundant or trivial getter/setter tests.

### 3. 🟡 Implementer (`workflow-implementer`)
* Runs in an isolated `git worktree` (`.worktrees/impl-<feature-id>`) that is automatically hydrated with uncommitted local Android build files (`local.properties`, `.env`, `keystore.properties`, `app/google-services.json`).
* Implements the feature (or executes the `Implementation Repair Brief` passed by `workflow-orchestrator` on a `REVISE` pass) across Layer-Based or Feature-First modules.
* **Comprehensive Core & Stack Skills**: Uses Core Architecture, Compose, Kotlin, Hilt (`hilt`), Room (`room-schema-governance`), and Firebase (`firebase-*`) skills out of the box, plus any optional catalog plugins installed in `.agents/skills/`.
* **Pragmatic High-Value Testing & Anti-Overengineering**: Strictly follows the test budget (1–3 cohesive `@Test` methods per test class, 2–6 tests per feature slice) applying the Single-Layer Assertion Rule (no cross-layer duplication). Trivial tests are strictly avoided.
* Converts raw graphic assets in `docs/features/<id>/ui/resources/` to `.webp` in `app/src/main/res/drawable/ic_<name>.webp` (or `:<feature>:presentation/src/main/res/drawable/`) while leaving screen mockups in `ui/screens/` untouched.
* **Mandatory `@compiler` Self-Verification**: Runs `./gradlew assembleDebug`, `./gradlew lintDebug`, and `./gradlew testDebugUnitTest`, recording exact command outputs in `feature_list.json` (`status: "passing"`) and `PROGRESS.md` so the Validator does not need to rebuild the entire project from scratch unless necessary.

### 4. 🟢/🔴 Validator (`workflow-validator`)
* Runs in an isolated `git worktree` (`.worktrees/val-<feature-id>`) as a **strictly read-only** code and runtime evaluator (`readonly: true` in Cursor, `disallowedTools: [Write, Edit]` in Claude Code).
* Evaluates **4 validation levels**:
  1. **Spec Contract & Acceptance Scenarios**: Verifies all `Given/When/Then` scenarios and UI states (`Loading`, `Error`, `Empty`, `Success`).
  2. **Security & Scope Discipline Audit**: Audits `android-intent-security` (`AndroidManifest.xml` exported components, deep links, Intent Redirection) and strict `WIP=1` scope adherence (`CONSTRAINTS.md`).
  3. **Compiler Evidence & Pragmatic Test Quality Audit (Worktree-Optimized)**: Audits pure JVM unit test source code (`testing-setup`), enforces the strict test budget (fails with `revise` on watermelon tests or test overengineering), and verifies recorded `@compiler` evidence, re-running `./gradlew` only if evidence is missing, suspicious, or required for runtime installation.
  4. **Runtime / Emulator Verification (`@android-cli`)**: Executes the feature's `Given/When/Then` Acceptance Scenarios as black-box `@android-cli` journeys on an active Android emulator/device when connected, or records `SKIPPED (headless)` verified via Pure JVM tests and `@Preview`s.
* **Verdict & Repair Loop**: Returns its Verdict (`accept`, `revise`, or `block`), severity-ranked Findings, and an executable **`Implementation Repair Brief`** directly in its response to **`workflow-orchestrator`** without modifying any repository files. On `revise` (when `repair_attempts < MAX_REPAIR_ATTEMPTS = 2`), the orchestrator routes the repair brief back to `workflow-implementer`. Once the implementer repairs the code and verifies `@compiler`, the orchestrator immediately hands the worktree back to `workflow-validator` for re-audit. Only upon `accept` does the pipeline advance to `workflow-documenter`. If 2 repair attempts fail, it halts at the **Human Decision Gate** (`needs_human_review`).

### 5. 🔷 Documenter (`workflow-documenter`)
* Runs in an isolated `git worktree` (`.worktrees/doc-<feature-id>`) **only after `workflow-validator` returns `accept`**.
* Strict boundary: modifies **only** English KDoc comments (`/** ... */`) and Markdown documentation files—never executable Kotlin code.
* Documents public classes across `Domain`, `Data`, `UseCases`, and `UI`, updates durable project docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `DESIGN.md`, `README.md`, `.agents/skills/README.md`), and marks `[x]` completed tasks in `docs/features/<feature-id>/spec.md`.

---

### 6. 🚀 Delivery & CI Automation (`publish` Mode)
* Consolidates atomic layer-specific commits via `@git-governance` (`feat(domain)`, `feat(data)`, `feat(usecases)`, `feat(ui)`, `test`, `docs`).
* Once explicit user authorization is granted, pushes the branch (`feature/<feature-id>`) and automatically creates a Pull Request targeting `develop` with pre-filled validation evidence.
* **Autonomous CI Quality Gate**: Triggers `.github/workflows/gate.yml` on GitHub Actions to run non-interactive `./gradlew testDebugUnitTest lintDebug`.

> [!IMPORTANT]
> **GitHub CLI (`gh`) Prerequisite for Automated PR Delivery**:
> To enable automated Pull Request creation from within the AI chat session, the system must have the official GitHub CLI (`gh`) installed and authenticated (`gh auth login`).
> - **Windows**: `winget install --id GitHub.cli`
> - **macOS**: `brew install gh`
> - **Linux**: `sudo apt install gh`
> If `gh` is absent, the orchestrator safely falls back to pushing the branch via `git push` and generating a direct browser URL, requiring the developer to click and submit the PR on GitHub manually.

---

### 7. 🔄 Post-PR Code Review & Feedback Loop (`review-fix` / PR Feedback — Multi-Round)
When the developer conducts human code review on an open Pull Request (across 1 or $N$ review rounds) and requests code quality, Clean Architecture, or SOLID improvements, the changes must **NEVER** be hacked directly into the root workspace. Instead, each review round re-enters the pipeline just like a Validator `REVISE` cycle with complete worktree isolation:
* **Round Tracking (`docs/features/<feature-id>/validator/pr-review.md`)**:
  - The orchestrator checks out `feature/<feature-id>`, appends a numbered section (`## PR Review Round #N`) with the structured **`PR Review Repair Brief`** to `docs/features/<feature-id>/validator/pr-review.md`, resets `feature_list.json` status to `"in_progress"` (`repair_attempts = 0`), and commits the brief to `feature/<feature-id>`.
* **Rehydrated Isolated Worktrees (`wt/impl-<id>` -> `wt/val-<id>` -> `wt/doc-<id>`)**:
  - Re-spawns `.worktrees/impl-<feature-id>` directly from the latest tip of `feature/<feature-id>` (which already contains all commits from initial implementation and any previous review rounds $1 \dots N-1$) and re-hydrates `local.properties`, `.env`, etc.
  - 🟡 `workflow-implementer` executes the `PR Review Repair Brief` for Round `#N`, runs `@compiler` (`assembleDebug`, `lintDebug`, `testDebugUnitTest`), and commits to `wt/impl-<feature-id>`.
  - 🟢 `workflow-validator` spawns in `.worktrees/val-<feature-id>` and verifies both: (a) the round delta (`git diff feature/<feature-id>...wt/val-<feature-id>`) against `PR Review Round #N`, and (b) the full feature diff (`git diff develop...wt/val-<feature-id>`) against `spec.md` and Clean Architecture rules (treating explicit `pr-review.md` refactorings as authorized overrides to `spec.md` signatures). Bounded repair loop (`MAX_REPAIR_ATTEMPTS = 2`) applies.
  - 🔷 `workflow-documenter` updates KDoc and synchronizes `spec.md` / `ARCHITECTURE.md` in `.worktrees/doc-<feature-id>`.
* **Incremental Delta Consolidation & PR Push**:
  - The orchestrator consolidates only the verified Round `#N` delta onto `feature/<feature-id>` via atomic commits per layer (`refactor(domain)`, `fix(ui)`, `docs`).
  - Pushes to `origin feature/<feature-id>` with `BypassSandbox: true` so the existing PR and GitHub Actions CI gate update automatically without `--force`.
  - Removes temporary worktrees/branches (`wt/*`) and returns the root workspace to `develop`. Repeatable for as many code review rounds as needed until human merge.

---

## Feature Execution Modes (Phase 2 Comparison)

Once the project harness is ready, the developer selects how features are executed:

| Aspect | Mode A: Standalone Feature Mode | Mode B: Backlog Queue Mode (`feature_list.json`) |
| :--- | :--- | :--- |
| **When to use** | Adding a specific feature, screen, or ad-hoc change on demand. | Processing a planned milestone, MVP release, or chained set of features. |
| **Trigger** | User asks for a specific feature: *"Implement the User Profile screen"*. | User tells the orchestrator: *"Process the backlog"* or *"Run next features"*. |
| **Harness Interaction** | `workflow-orchestrator` activates or appends the single feature in `feature_list.json` & `PROGRESS.md`. | `workflow-orchestrator` reads `feature_list.json` and evaluates `depends_on == "accepted"`. |
| **Lifecycle** | Runs the 4-stage pipeline for that single feature and **stops** upon acceptance and commit. | Loops through ready features sequentially, or launches independent features in **parallel worktrees**. |
| **Pipeline & Roles** | Identical: `Planner -> Implementer -> Validator -> Documenter` | Identical: `Planner -> Implementer -> Validator -> Documenter` |

---

## Why Dedicated Worktree Subagents?

1. **Independent Validation Without Self-Confirmation Bias (`workflow-validator`)**:
   An agent that writes code tends to assume its own implementation works. By launching 🟢 `workflow-validator` in a fresh context and isolated `git worktree` with strict read-only permissions, the validator objectively checks `docs/features/<id>/spec.md`, Clean Architecture rules, `android-intent-security`, and test assertions, returning an actionable `Implementation Repair Brief` to the orchestrator.
2. **Zero-Wasted Documentation Effort (`workflow-documenter`)**:
   Previously, implementers spent context window and tokens writing documentation for code that might later be rejected or refactored during validation. Now, 🔷 `workflow-documenter` runs **only after `workflow-validator` emits `accept`**, focusing exclusively on high-quality English KDoc (`kotlin-style`) and durable Markdown documentation (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `spec.md`) without touching executable code.

---

## Evolution: How the Unification Works

| Dimension | Legacy v1 Foundation | Legacy v1 AI Expert | **Unified Foundation v2.0.0** |
| :--- | :--- | :--- | :--- |
| **Agent Model** | Single agent end-to-end | 3 agents (`planner`, `implementer`, `validator`) | **5 Specialized Roles** (`🟣 Orchestrator`, `🔵 Planner`, `🟡 Implementer`, `🟢 Validator`, `🔷 Documenter`) |
| **Workspace Isolation** | Main working tree | Shared working tree | **Isolated `git worktree` per subagent** (`.worktrees/<role>-<feature-id>`) |
| **Subagent Provisioning** | Manual setup required | IDE-specific | **Agnostic & Automated** (`SUBAGENT_SKILLS.json` injection for Gemini/Cursor/Claude via `workflow-initializer`) |
| **Feature Contract** | `WORKFLOW_<NAME>.md` at root | `docs/specs/<feature-id>.md` | **Unified `docs/features/<feature-id>/spec.md`** (`Given/When/Then` + Android Clean Architecture layers) |
| **Validation Output** | Inline chat only | Optional `docs/validations/<feature-id>.md` | **Read-only Validator response** persisted by Orchestrator to `docs/features/<feature-id>/validator/validation-report.md` with `Implementation Repair Brief` |
| **Compiler Strategy** | Manual / end of flow | Re-run in both agents | **Worktree-optimized**: Implementer runs `@compiler` and records evidence; Validator audits code/tests and only re-runs `@compiler` when needed |
| **Documentation** | Mixed into implementation | Mixed into implementation | **Dedicated `workflow-documenter` subagent** running after validation `accept` |

---

## Pragmatic Testing Strategy & Tooling Governance

The Foundation enforces a **pragmatic, high-value testing strategy** (`@testing-setup`) designed to prevent test bloat, brittle suites, and "Watermelon tests" (green on the outside, empty on the inside).

### Tooling Matrix by Testing Layer

| Testing Scope | Approved Tooling | Excluded / Forbidden Tooling | Core Rationale & Decisive Advantages |
| :--- | :--- | :--- | :--- |
| **Domain & Math Logic** (`:domain`) | **JUnit 4/5** + Kotlin assertions / Truth | Instrumented tests, Mocking libraries | **Pure JVM execution in milliseconds**. Tests pure calculations, ranking algorithms, and boundary conditions without Android framework dependencies or bytecode manipulation. |
| **Data & Serialization** (`:data`) | **JUnit 4/5** + **Manual Fakes** | MockK, Mockito, Real network/DB calls | **Zero reflection & zero bytecode instrumentation overhead**. Manual in-memory Fakes (`Fake*Repository`, `Fake*DataSource`) provide deterministic state and avoid brittle implementation coupling (`verify`-style assertions). |
| **UseCase Orchestration** (`:usecases`) | **JUnit 4/5** + **Manual Fakes** | MockK, Mockito | Evaluates multi-source fallback and error translation logic using fast in-memory Fakes. 1:1 pass-through UseCases are strictly forbidden from having tests. |
| **Presentation & ViewModels** (`:app` / `:<feature>:presentation`) | **JUnit** + `MainDispatcherRule` + **Turbine** (`app.cash.turbine`) | **Robolectric**, `composeTestRule`, Espresso, UI Automator | **Pure JVM reactive testing**. ViewModels and `*UiMapper` classes are verified deterministically with `UnconfinedTestDispatcher` and Turbine. Forbidding Robolectric screen tests eliminates slow shadow-class loading, fragile text/tag matching, and Test-Induced Design Damage. |
| **Visual Screen Correctness** | **Stateless `@Preview`** + `@compiler` (`lintDebug`) | Paparazzi, Committed golden PNGs for screens | Lightweight visual inspection via `@<Prefix>ThemePreview` / `@<Prefix>DevicePreview` without bloating git storage with binary screen snapshots or dealing with unstable AGP screenshot plugins. |
| **Design System Components** (`:design-system`) | **Roborazzi** (on JVM) | Paparazzi, `com.android.compose.screenshot` (Alpha) | Roborazzi captures existing `@Preview` composables on the JVM using stable tooling compatible with JDK 21 and modern AGP without runtime device overhead. |
| **Real Flows & E2E Journeys** | **`@android-cli`** (Black-Box on emulator/device) | Espresso, `createAndroidComposeRule`, UI Automator, Maestro in repo | **Zero repo bloat & zero test harness pollution**. The feature's `Given / When / Then` Acceptance Scenarios are verified as black-box user journeys directly on active devices via `android` CLI commands (`android run`, `android layout --diff`, `android screen capture`). Skips cleanly (`SKIPPED (headless)`) in CI when no emulator is present. |

### Core Testing Invariants

1. **Pure JVM Presentation Testing**: Tests in `:app` or presentation modules are strictly limited to ViewModels (`*ViewModelTest`) and complex UI mappers (`*UiMapperTest`). No functional Robolectric tests of screens or navigation are permitted.
2. **Manual Fakes First**: Hand-crafted in-memory fakes are used for all domain interfaces. Mocking frameworks (MockK / Mockito) are strictly reserved for final platform types that cannot be faked.
3. **Strict Test Budget (Hard Caps)**:
   - **Per Class**: 1 to 3 cohesive `@Test` methods maximum per test class.
   - **Per Feature**: 2 to 6 `@Test` methods in total across all layers for a standard feature slice.
4. **Single-Layer Assertion Rule**: Every business rule or computation is tested **once** at the lowest owning layer and never re-tested higher up.
5. **Zero Trivial Tests Mandate**: Strictly forbids tests for `data class` constructors, getters/setters, static preview data, 1:1 pass-through UseCases, or trivial mappers.
6. **Zero Test-Induced Design Damage**: Production Composable signatures must never accept test-only lambdas, test tags, or slots solely to accommodate automated test harnesses.

---

## Layer 3: Shared Engineering Guardrails

All agents share the same underlying technical guardrails in `.agents/skills/`:
* **Architecture & Modules**: `module-architecture-governance`, `repository-pattern-governance`, `viewmodel-architecture-governance`, `design-system-governance`, `dependency-manager`.
* **Stack Essentials (DI, Persistence & Cloud)**: `hilt`, `room-schema-governance`, `firebase-basics`, `firebase-auth-basics`, `firebase-remote-config-basics`.
* **Kotlin & Concurrency**: `kotlin-style` (including function ownership & control flow rules), `kotlin-coroutines-structured-concurrency`, `kotlin-flow-state-event-modeling`.
* **Jetpack Compose & Navigation**: `compose-state-authoring`, `compose-state-hoisting`, `compose-side-effects`, `compose-modifier-and-layout-style`, `navigation-3`, `adaptive`, `edge-to-edge`.
* **Security, Tooling & Quality**: `compiler`, `testing-setup`, `android-intent-security`, `android-cli`, `git-governance`, `agent-safety-hooks`, `ai-context-exclusion`, `foundation-evolve`.

Additional specialized profiling, diagnostic, and library skills (`perfetto-trace-analysis`, `r8-analyzer`, `compose-recomposition-performance`, `compose-stability-diagnostics`, `compose-focus-navigation`, `camerax`, `wear-compose-m3`) are available on demand in `.agents/catalog/`.
