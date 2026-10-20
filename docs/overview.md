# Architecture Overview

The **Android AI Workflow Foundation v2.0.0** is a unified multi-agent framework for Android development. It combines Clean Architecture engineering guardrails, persistent project harness state (`feature_list.json`, `PROGRESS.md`, `CONSTRAINTS.md`), and isolated **`git worktree`** subagents under human supervision.

The Foundation structures development across three modular layers:

1. **Project Initialization & Harness Setup** (`workflow-initializer`, `build-brief`, `harness-starter`)
2. **Unified Multi-Agent Feature Pipeline** (`workflow-orchestrator`, `workflow-feature`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`)
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
             (Creates AGENTS.md, init.sh, PROGRESS.md, CONSTRAINTS.md, feature_list.json)
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
                      [workflow-feature] 🔵 (Generates spec.md)
                                       │
                                       ▼
                    [workflow-implementer] 🟡 (Code & Tests) ◄──────┐
                                       │                            │ (REVISE + Repair Brief)
                                       ▼                            │
                     [workflow-validator] 🟢/🔴 (Read-Only Audit) ──┘
                                       │
                                       │ (ACCEPT)
                                       ▼
                     [workflow-documenter] 🔷 (KDoc & spec.md [x])
                                       │
                                       ▼
                      [@git-governance] (Atomic Layer Commits)
```

---

## Layer 1: Initialization, Discovery & Harness

### 1. `workflow-initializer`
Bootstraps the project environment:
* Performs Stack Diagnosis (`Project Name`, `Module Topology` [Layer-Based vs Feature-First], `AI Provider`, `MVVM`/`MVI`, `Hilt`/`Koin`, `Room`/`SQLDelight`).
* Materializes `AGENTS.md` and `.agents/workflow.json` (`"activeWorkflow": "foundation"`).
* Configures AI Context Exclusion (`ai-context-exclusion`), automatically excluding `.worktrees/`, `.gradle/`, and build outputs from the AI context.
* Materializes provider-specific subagent definitions (`.claude/agents/`, `.cursor/agents/`, or native Antigravity `.agents/agents/` configuration) using **`SUBAGENT_SKILLS.json`** (plus any installed optional catalog plugins) for single-source-of-truth skill injection with `model: inherit`, and adds `.worktrees/` to `.gitignore`.

#### 🛡 Automated AI Safety Hooks (`agent-safety-hooks`)
During project initialization, the Foundation automatically installs lifecycle safety hooks tailored to the active AI provider (**Claude Code**, **Cursor**, or **Gemini / Antigravity**):
* **Destructive Command Interception**: Intercepts shell commands before execution and strictly blocks catastrophic patterns such as `rm -rf`, `rmdir /s /q`, `Remove-Item -Recurse -Force`, `git clean -fdx`, and root-level directory purges.
* **Provider Integration**:
  * **Claude Code**: Registered as a `PreToolUse` hook in `.claude/settings.json` executing `block-rm-rf.js`.
  * **Cursor**: Registered as a `beforeShellExecution` hook under `.cursor/hooks/`.
  * **Gemini / Antigravity**: Registered via `.agents/hooks.json`.
* **Why it matters**: Autonomous subagents execute terminal commands to run Gradle builds and tests inside isolated worktrees. This automated guardrail ensures that no agent can accidentally delete project files, Gradle caches, or repository assets.

### 2. `build-brief` & `harness-starter`
* **`build-brief`**: Conducts a structured one-question-at-a-time discovery interview for new products or major modules, producing `CONTEXT.md`, `docs/build-brief.md`, `docs/domain-model.md`, and `DESIGN.md`.
* **`harness-starter`**: Derives `AGENTS.md`, `init.sh`, `PROGRESS.md`, `CONSTRAINTS.md`, and `feature_list.json` (plus `docs/features/<feature-id>/` directories), either from `build-brief` discovery docs or directly from an existing Android codebase.

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
* Receives the read-only evaluation from `workflow-validator`, persists `docs/features/<feature-id>/validator/validation-report.md`, and passes the `Implementation Repair Brief` directly to `workflow-implementer` on `revise`.
* **Exclusively owns `@git-governance`**: Consolidates the final worktree after documentation completes, marks the feature `accepted` in `feature_list.json`, and creates atomic layer-specific Conventional Commits (`feat(domain)`, `feat(data)`, `feat(usecases)`, `feat(ui)`, `test`, `docs`).

### 2. 🔵 Planner (`workflow-feature`)
* Inspects the repository and clarifies up to 3 blocking technical questions with the user.
* Produces the unified feature contract at **`docs/features/<feature-id>/spec.md`**, combining:
  - Idea Diagnosis & Assumptions
  - Goal, Non-Goals & `Given / When / Then` Acceptance Scenarios
  - Repository Research & Expected File Changes
  - Android Layer Breakdown (`UI/UX` + `docs/features/<id>/ui/` asset rules, `API Design`, `Persistence`, `Durable Documentation Impact`)
  - Granular Clean Architecture Checklist (`Database/Models -> Domain -> Data -> UseCase -> UI -> Testing -> @compiler`)

### 3. 🟡 Implementer (`workflow-implementer`)
* Runs in an isolated `git worktree` (`.worktrees/impl-<feature-id>`).
* Implements the feature (or executes the `Implementation Repair Brief` passed by `workflow-orchestrator` on a `REVISE` pass) across Layer-Based or Feature-First modules.
* **Comprehensive Core & Stack Skills**: Uses Core Architecture, Compose, Kotlin, Hilt (`hilt`), Room (`room-schema-governance`), and Firebase (`firebase-*`) skills out of the box, plus any optional catalog plugins installed in `.agents/skills/`.
* Converts raw graphic assets in `docs/features/<id>/ui/resources/` to `.webp` in `app/src/main/res/drawable/ic_<name>.webp` (or `:<feature>:presentation/src/main/res/drawable/`) while leaving screen mockups in `ui/screens/` untouched.
* **Mandatory `@compiler` Self-Verification**: Runs `./gradlew assembleDebug`, `./gradlew lintDebug`, and `./gradlew testDebugUnitTest`, recording exact command outputs in `feature_list.json` (`status: "passing"`) and `PROGRESS.md` so the Validator does not need to rebuild the entire project from scratch unless necessary.

### 4. 🟢/🔴 Validator (`workflow-validator`)
* Runs in an isolated `git worktree` (`.worktrees/val-<feature-id>`) as a **strictly read-only** code and runtime evaluator (`readonly: true` in Cursor, `disallowedTools: [Write, Edit]` in Claude Code).
* Evaluates **4 validation levels**:
  1. **Spec Contract & Acceptance Scenarios**: Verifies all `Given/When/Then` scenarios and UI states (`Loading`, `Error`, `Empty`, `Success`).
  2. **Security & Scope Discipline Audit**: Audits `android-intent-security` (`AndroidManifest.xml` exported components, deep links, Intent Redirection) and strict `WIP=1` scope adherence (`CONSTRAINTS.md`).
  3. **Compiler Evidence & Test Quality Audit (Worktree-Optimized)**: Audits unit and Compose UI test source code (`compose-ui-testing-patterns`) and verifies recorded `@compiler` evidence, re-running `./gradlew` only if evidence is missing, suspicious, or required for runtime installation.
  4. **Runtime / Emulator Verification (`@android-cli`)**: Verifies the user flow on an active Android emulator/device when connected, or documents verification via Unit + Compose UI tests when headless.
* Returns its Verdict (`accept`, `revise`, or `block`), severity-ranked Findings, and an executable **`Implementation Repair Brief`** directly in its response to **`workflow-orchestrator`** without modifying any repository files.

### 5. 🔷 Documenter (`workflow-documenter`)
* Runs in an isolated `git worktree` (`.worktrees/doc-<feature-id>`) **only after `workflow-validator` returns `accept`**.
* Strict boundary: modifies **only** English KDoc comments (`/** ... */`) and Markdown documentation files—never executable Kotlin code.
* Documents public classes across `Domain`, `Data`, `UseCases`, and `UI`, updates durable project docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `DESIGN.md`, `README.md`, `.agents/skills/README.md`), and marks `[x]` completed tasks in `docs/features/<feature-id>/spec.md`.

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

## Layer 3: Shared Engineering Guardrails

All agents share the same underlying technical guardrails in `.agents/skills/`:
* **Architecture & Modules**: `module-architecture-governance`, `repository-pattern-governance`, `viewmodel-architecture-governance`, `design-system-governance`, `dependency-manager`.
* **Stack Essentials (DI, Persistence & Cloud)**: `hilt`, `room-schema-governance`, `firebase-basics`, `firebase-auth-basics`, `firebase-remote-config-basics`.
* **Kotlin & Concurrency**: `kotlin-style` (including function ownership & control flow rules), `kotlin-coroutines-structured-concurrency`, `kotlin-flow-state-event-modeling`.
* **Jetpack Compose & Navigation**: `compose-state-authoring`, `compose-state-hoisting`, `compose-side-effects`, `compose-modifier-and-layout-style`, `compose-ui-testing-patterns`, `navigation-3`, `adaptive`, `edge-to-edge`.
* **Security, Tooling & Quality**: `compiler`, `testing-setup`, `android-intent-security`, `android-cli`, `git-governance`, `agent-safety-hooks`, `ai-context-exclusion`, `foundation-evolve`.

Additional specialized profiling, diagnostic, and library skills (`perfetto-trace-analysis`, `r8-analyzer`, `compose-recomposition-performance`, `compose-stability-diagnostics`, `compose-focus-navigation`, `camerax`, `wear-compose-m3`) are available on demand in `.agents/catalog/`.
