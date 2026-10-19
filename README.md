# 🚀 Android AI Workflow Foundation v2.0.0

Exploring how specialized AI agents can become part of a disciplined, human-supervised Android software engineering process.

**Android AI Workflow Foundation** is a unified multi-agent development framework for Android projects. It combines shared engineering standards, Clean Architecture guardrails, persistent project harness tracking (`feature_list.json`, `PROGRESS.md`), and isolated **`git worktree`** subagents (`workflow-orchestrator`, `workflow-feature`, `workflow-implementer`, `workflow-validator`, and `workflow-documenter`).

The goal is not to automate software development blindly. The developer remains the highest-level supervisor, responsible for architecture, technical decisions, review, and final acceptance.

---

## 🏗 Unified Multi-Agent Architecture

The Foundation structures software delivery across two clear phases: a **shared discovery & harness phase** (Phase 1) followed by **flexible feature execution modes** (Phase 2) on top of a **single unified multi-agent pipeline**:

```text
ANDROID AI WORKFLOW FOUNDATION (v2.0.0)
        │
        ├── Phase 1: Project Discovery & Harness Setup
        │     ├── New Product / MVP / Epic : build-brief (discovery) → harness-starter
        │     └── Existing Codebase       : harness-starter (derives AGENTS.md, init.sh, PROGRESS.md, feature_list.json)
        │
        ├── Phase 2: Feature Execution Modes
        │     ├── Mode A: Standalone Feature Mode (Ad-hoc / on-demand single feature run)
        │     └── Mode B: Backlog Queue Mode     (Sequential or parallel processing of feature_list.json)
        │
        ├── Multi-Agent Worktree Pipeline (model: inherit + isolated git worktrees)
        │     ├── 🟣 Orchestrator (workflow-orchestrator)
        │     ├── 🔵 Planner      (workflow-feature → docs/features/<id>/spec.md)
        │     ├── 🟠 Implementer  (workflow-implementer → Code + Tests + @compiler)
        │     ├── 🟢 Validator    (workflow-validator → docs/features/<id>/validator/validation-report.md)
        │     └── 🔷 Documenter   (workflow-documenter → English KDoc + Durable Docs)
        │
        └── Shared Engineering Guardrails
              ├── Clean Architecture (Domain / Data / UseCases / UI & Dual Topologies)
              ├── Kotlin, Coroutines, Flow & Jetpack Compose Standards
              ├── Compiler Verification, Testing & Intent Security
              └── Git Governance & AI Lifecycle Safety Hooks
```

### Visual Identity Badges & Subagent Roles

Every agent in the pipeline identifies its work in chat, validation reports, and `PROGRESS.md` with a dedicated visual badge and operates with strict single-responsibility boundaries:

| Role | Core Skill | Execution Scope | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| 🟣 **Orchestrator** | `workflow-orchestrator` | Main Feature Branch (`feature/<feature-id>`) | Selects features (Standalone or from `feature_list.json`), manages `git worktree` lifecycles, coordinates subagents, handles `REVISE` loops, and creates atomic layer-by-layer Conventional Commits via `git-governance`. |
| 🔵 **Planner** | `workflow-feature` | Main Feature Branch (`feature/<feature-id>`) | Performs pre-diagnosis, asks up to 3 clarifying questions, and writes the unified contract at `docs/features/<feature-id>/spec.md` (`Given/When/Then` scenarios + Android layer breakdown + Clean Architecture checklist). |
| 🟠 **Implementer** | `workflow-implementer` | Isolated Worktree (`.worktrees/impl-<feature-id>`) | Implements Clean Architecture layers (`Domain -> Data -> UseCase -> UI`), converts `ui/resources/` assets to `.webp`, writes unit/Compose UI tests, runs the `@compiler` suite (`assembleDebug`, `lintDebug`, `testDebugUnitTest`), and sets status to `passing`. |
| 🟢/🔴 **Validator** | `workflow-validator` | Isolated Worktree (`.worktrees/val-<feature-id>`) | Lightweight read-only auditor across **4 validation levels**: (1) Spec contract, (2) Security (`android-intent-security`) & Scope Discipline, (3) `@compiler` evidence & test quality audit (`compose-ui-testing-patterns`), (4) Emulator runtime via `@android-cli` (when active). Writes `docs/features/<feature-id>/validator/validation-report.md` (`accept`, `revise` + Repair Brief, or `block`). |
| 🔷 **Documenter** | `workflow-documenter` | Isolated Worktree (`.worktrees/doc-<feature-id>`) | Runs only after `accept`. Authors English KDoc on new public classes, updates durable docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`), and checks `[x]` completed items in `spec.md` without altering executable code. |

---

## 🔄 Two Execution Modes (Phase 2)

Once the project harness is established via **`@build-brief`** and **`@harness-starter`** (or directly by `@harness-starter` on an existing app), the developer decides how to execute features:

### Mode A: Standalone Feature Mode (Ad-hoc / On-Demand)
When working on an ad-hoc requirement, screen, or single feature:
1. Invoke `@workflow-orchestrator` (or `@workflow-feature`) with your feature request (e.g., *"Implement the User Profile screen"*).
2. The orchestrator registers or activates the feature in `feature_list.json` and `PROGRESS.md`.
3. Runs the 4-stage pipeline (`Planner -> Implementer -> Validator -> Documenter`) in isolated `git worktree` directories.
4. Upon validation acceptance, documentation, and `@git-governance` commit consolidation, execution **stops**.

### Mode B: Backlog Queue Mode (`feature_list.json`)
When driving a multi-feature milestone, MVP release, or chained set of features:
1. Ensure the backlog is populated in `feature_list.json` with dependencies (`depends_on`).
2. Run **`@workflow-orchestrator`** with: *"Process the backlog"* or *"Run next ready features"*.
3. The orchestrator executes ready features sequentially—or parallelizes independent features whose `depends_on` prerequisites are `accepted` across separate `git worktree` instances.
4. Continues until the queue is finished or a blocking issue requires developer intervention.

---

## 🏛 Supported Modular Topologies (`module-architecture-governance`)

The Foundation supports two Clean Architecture module topologies depending on app scale:

### 1. Layer-Based Modular Topology (Small to Medium Apps)
Organizes code strictly by technical Clean Architecture responsibility:
```text
:domain      ──> Pure Kotlin business entities, Repository interfaces & DomainError models
:usecases    ──> Pure Kotlin single-responsibility interactors (e.g. GetUserProfileUseCase)
:data        ──> Repository implementations, Room DAOs, DataSources, Network DTO mappers
:app         ──> Jetpack Compose UI, ViewModels, Navigation, and Dependency Injection graph
```

### 2. Feature-First Modular Topology (Scalable & Multi-Team Apps)
Organizes code into independent vertical slices per feature, backed by shared core modules:
```text
:<feature>:domain        ──> Feature-scoped models, repository interfaces & use cases
:<feature>:usecases      ──> Feature-specific interactors
:<feature>:data          ──> Feature local/remote data sources & repository implementations
:<feature>:presentation  ──> Feature Jetpack Compose UI screens & ViewModels
:core:database           ──> Shared Room database schemas & entities
:core:network            ──> Shared Retrofit / Ktor network clients & interceptors
:core:designsystem       ──> Shared Material 3 tokens, colors, typography & reusable components
:core:common             ──> Result wrappers, coroutine dispatchers & shared domain utilities
:app                     ──> Thin application shell, global NavHost & root DI container
```

---

## 📁 Unified Feature Directory Structure (`docs/features/<feature-id>/`)

Every feature in the repository keeps its contract, UI assets, and validation evidence organized in one canonical folder:

```text
docs/features/<feature-id>/
├── spec.md                         # Unified contract (Given/When/Then + Android layers + Checklist)
├── ui/
│   ├── screens/                    # Full-screen reference mockups (PNG/HTML — NEVER converted to drawables)
│   └── resources/                  # Raw graphic assets (PNG/JPEG -> converted to res/drawable/ic_*.webp)
└── validator/
    └── validation-report.md        # Structured 4-level report (Verdict + Findings + Repair Brief)
```

---

## 🛠 Installation & Setup

### Step 1: Install the Foundation

Run the following command from your Android project's root directory:

```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation
```

This installs the active Foundation skills into `.agents/skills/`.

### Step 2: Activate the Initializer

Open your AI IDE (**Android Studio / Gemini**, **Antigravity**, **Claude Code**, or **Cursor**) and type:

```text
Activate workflow-initializer
```

The initializer guides the project setup:

1. **Stack Diagnosis & AI Provider Selection**:
   - **Module Topology**: `Layer-Based` (`:domain`, `:usecases`, `:data`, `:app`) or `Feature-First` (`:<feature>:*` + `:core:*`).
   - **Architecture**: `MVVM` or `MVI`.
   - **Dependency Injection**: `Hilt` or `Koin`.
   - **Persistence**: `Room` or `SQLDelight`.
   - **Active AI Provider**: `Gemini` (Antigravity), `Claude Code`, or `Cursor`.
2. **Automated Governance & Subagent Materialization**:
   - **`AGENTS.md` & `.agents/workflow.json`**: Materializes project-specific instructions and sets `"activeWorkflow": "foundation"`.
   - **Provider-Specific Subagents (`model: inherit` + `isolation: worktree`)**:
     * **Claude Code**: Materializes `.claude/agents/workflow-implementer.md`, `workflow-validator.md`, and `workflow-documenter.md` with scoped skills, color badges, and worktree isolation.
     * **Cursor**: Materializes `.cursor/agents/workflow-*.md`.
     * **Gemini / Antigravity**: Uses native `invoke_subagent` with `Model: "inherit"` and isolated worktrees.
   - **Subagent Scoped Skills & Conditional Stacks**:
     * 🟣 **`workflow-orchestrator`**: `workflow-orchestrator`, `git-governance`.
     * 🔵 **`workflow-feature`**: `workflow-feature`, `module-architecture-governance`, `testing-setup`.
     * 🟠 **`workflow-implementer`**: Core Architecture, Kotlin, Flow, Compose, Testing, and `@compiler`. Dynamically loads **conditional stack skills** (`hilt`, `room-schema-governance`, `firebase-*`) when installed in `.agents/skills/`.
     * 🟢/🔴 **`workflow-validator`**: Lightweight read-only verification (`workflow-validator`, `android-intent-security`, `compose-ui-testing-patterns`, conditional `compiler`, and `android-cli`).
     * 🔷 **`workflow-documenter`**: Documentation-only (`workflow-documenter`, `kotlin-style`).
   - **Context Exclusion (`ai-context-exclusion`)**: Materializes `.aiexclude`, `.cursorignore`, or `.claude/settings.json`, automatically ignoring `.worktrees/`, `.gradle/`, and build caches.
   - **🛡 Automated AI Safety Hooks (`agent-safety-hooks`)**:
     * Installs provider-native lifecycle interception (`PreToolUse` in Claude Code / Antigravity, `beforeShellExecution` in Cursor) via `block-rm-rf.js` / `.ps1`.
     * **Zero-Accident Guardrail**: Intercepts and blocks destructive terminal commands (such as `rm -rf`, `rmdir /s /q`, `Remove-Item -Recurse -Force`, `git clean -fdx`, and root-level deletions) before execution, ensuring autonomous subagents running in worktrees cannot damage the project.
3. **Optional Catalog Skills**:
   Select optional technology plugins from `.agents/catalog/` (such as `hilt`, `room-schema-governance`, `firebase-*`, `camerax`, `wear-compose-m3`, `perfetto-trace-analysis`, `to-plan`, `using-chrisbanes-skills`).

---

## 🧩 Skill Architecture

### 1. Active Core Workflow Skills (`.agents/skills/`)
* `workflow-initializer` — Project bootstrapping, safety hooks, context exclusions, and subagent setup.
* `build-brief` — Guided product and domain discovery before coding.
* `harness-starter` — Generates `AGENTS.md`, `init.sh`, `PROGRESS.md`, `CONSTRAINTS.md`, and `feature_list.json`.
* `workflow-orchestrator` (🟣) — Coordinates the feature backlog, `git worktree` lifecycles, subagents, and `@git-governance` commits.
* `workflow-feature` (🔵) — Feature Planner and Specification Architect (`docs/features/<id>/spec.md`).
* `workflow-implementer` (🟠) — Worktree Implementer subagent + `@compiler` self-verification.
* `workflow-validator` (🟢/🔴) — Worktree 4-level Validator subagent (`docs/features/<id>/validator/validation-report.md`).
* `workflow-documenter` (🔷) — Worktree KDoc and durable documentation subagent.
* `compiler`, `git-governance`, `foundation-evolve`.

### 2. Shared Engineering Guardrails (`.agents/skills/`)
* **`agent-safety-hooks`** — Automated pre-tool execution safety guard installed by default to block catastrophic commands (`rm -rf`, recursive deletion) across Claude Code, Cursor, and Gemini.
* **`ai-context-exclusion`** — Provider-agnostic AI context governance (`.aiexclude`, `.cursorignore`, `.claude/settings.json`) ensuring the AI never indexes `.worktrees/`, `.gradle/`, and build caches.
* **Architecture & Governance** — `dependency-manager`, `design-system-governance`, `kotlin-style`, `module-architecture-governance`, `repository-pattern-governance`, `testing-setup`, `viewmodel-architecture-governance`.
* **Platform, Compose & Concurrency** — `adaptive`, `android-cli`, `android-intent-security`, `compose-modifier-and-layout-style`, `compose-side-effects`, `compose-state-authoring`, `compose-state-hoisting`, `compose-ui-testing-patterns`, `edge-to-edge`, `kotlin-coroutines-structured-concurrency`, `kotlin-flow-state-event-modeling`, `navigation-3`.

### 3. Optional Catalog Plugins (`.agents/catalog/`)
* Activated on demand for libraries, profiling, and diagnostics (`hilt`, `room-schema-governance`, `firebase-*`, `camerax`, `wear-compose-m3`, `perfetto-trace-analysis`, `r8-analyzer`, `compose-recomposition-performance`, `compose-stability-diagnostics`, `compose-focus-navigation`, `hook-creator`, `skill-creator`, `to-plan`, `using-chrisbanes-skills`).

---

## 🔄 Maintaining & Updating

* **Sync Active Skills**: `npx skills update`
* **Evolve the Foundation**: Use `@foundation-evolve` to synchronize new or improved skills from a working project back to the Foundation repository.

---

## 🙏 Acknowledgments & Credits

* **Foundation Methodology & Clean Architecture Guardrails:** Albert Martorell Garcia.
* **Harness & Multi-Agent Spec/Validator Methodology:** Originally created by **Antonio Leiva / Nino Ruano** for the AI Expert course and unified into this Foundation with permission.
* **External Expert Patterns:** Curated Kotlin and Compose skills by **Chris Banes** and others.
* **Official Documentation:** Google Android and Firebase documentation.
