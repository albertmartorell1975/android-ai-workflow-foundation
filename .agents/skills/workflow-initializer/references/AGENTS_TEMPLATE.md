# Instructions for Agents - [PROJECT_NAME]

## Project Overview

[Describe the project purpose, target platform, domain, and main goals.]

* **UI Architecture Pattern**: `[ARCHITECTURE]`
* **Module Topology**: `[MODULE_TOPOLOGY]` (Governed by `.agents/skills/module-architecture-governance/SKILL.md`)
  - *Layer-Based*: `:domain` -> `:usecases` <- `:data` -> `:app`
  - *Feature-First*: `:<feature>:domain`, `:<feature>:usecases`, `:<feature>:data`, `:<feature>:presentation` + `:core:*` + `:app` (Integrator)
* **Dependency Injection**: `[DI_TOOL]`
* **Persistence**: `[PERSISTENCE]`
* **AI Provider**: `[AI_PROVIDER]`

## Read First

1. `PROGRESS.md` — Current verified state and session history (when present).
2. `feature_list.json` — Feature backlog, dependencies (`depends_on`), and status (`not_started`, `in_progress`, `passing`, `accepted`, `blocked`).
3. `CONSTRAINTS.md` — Operational `MUST` / `MUST NOT` rules discovered during development.
4. `CONTEXT.md` & `docs/build-brief.md` — Domain glossary and product scope (when present).
5. `.agents/skills/README.md` — Active Foundation skills and technical guardrails.

Read additional documentation when relevant:
* `ARCHITECTURE.md` — Module boundaries and data flows.
* `DESIGN.md` — Visual tokens, core screens, and Android Resource Conversion Policy.
* `docs/features/<feature-id>/spec.md` — Feature contract for the active feature.
* `docs/features/<feature-id>/validator/validation-report.md` — Independent validation report and repair brief.

---

## Unified Multi-Agent Workflow (`foundation`)

This project uses the **Android AI Workflow Foundation Unified Multi-Agent Pipeline** (`.agents/workflow.json` -> `"activeWorkflow": "foundation"`).

### Visual Identity Badges (Mandatory)
Every agent and subagent MUST prefix its responses and `PROGRESS.md` entries with its assigned color badge:
* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`** — Pipeline coordination, `feature_list.json`, `git worktree` management, and final `@git-governance` commits.
* 🔵 **`[PLANNER · workflow-feature]`** — Feature diagnosis and unified specification (`docs/features/<feature-id>/spec.md`).
* 🟡 **`[IMPLEMENTER · workflow-implementer]`** — Clean Architecture code, tests, and `@compiler` verification in an isolated `git worktree`.
* 🟢 **`[VALIDATOR · workflow-validator]`** *(or 🔴 on `revise` / `block`)* — Independent 4-level validation and `docs/features/<feature-id>/validator/validation-report.md` in an isolated `git worktree`.
* 🔷 **`[DOCUMENTER · workflow-documenter]`** — English KDoc and durable Markdown documentation in an isolated `git worktree`.

### Two Ways to Run Work
1. **Project / Backlog Mode**:
   - Use `@build-brief` (for product discovery) and `@harness-starter` (to derive `feature_list.json`, `PROGRESS.md`, and `init.sh`).
   - Run `@workflow-orchestrator` to execute the next ready feature (or parallelize independent ready features) from `feature_list.json`.
2. **Standalone Feature Mode (Ad-hoc)**:
   - Request a feature directly via `@workflow-orchestrator` (or `@workflow-feature`).
   - The orchestrator automatically registers the feature in `feature_list.json` and `PROGRESS.md`, generates `docs/features/<feature-id>/spec.md`, and launches the subagents (`implementer` -> `validator` -> `documenter`) in isolated `git worktree` instances with `model: inherit`.

---

## Startup Workflow

Before writing code:
1. Confirm the working directory (`pwd`) and active git branch (`git branch --show-current`).
2. Read `PROGRESS.md` and `feature_list.json` (if present) to inspect current verified state.
3. Run `./init.sh` (or `@compiler` verification) when checking baseline health.

## Path-Based Skill Triggers

* **Module Creation & Migration (`settings.gradle.kts`, `**/build.gradle.kts`)**: Strictly follow `.agents/skills/module-architecture-governance/SKILL.md` (and `references/feature-modularization-strategy.md` when using or migrating to Feature-First sub-modules).
* **Data & Domain Layer (`**/data/**`, `**/domain/**`)**: Strictly apply the Clean Architecture, SSOT, and `DomainError` mapping rules in `.agents/skills/repository-pattern-governance/SKILL.md`.
* **UI / Presentation & ViewModels (`**/ui/**`, `**/presentation/**`, `**/*ViewModel.kt`)**: Strictly apply the Passive Initialization Mandate and Hybrid UI State rules in `.agents/skills/viewmodel-architecture-governance/SKILL.md` and Compose guardrails in `.agents/skills/compose-*/SKILL.md`.

## Working Rules

* Work on one feature at a time per worktree (`WIP=1`).
* Subagents operate in isolated `git worktree` directories (`.worktrees/`) using `model: inherit` by default.
* Subagents never push or create final commits on `feature/<feature-id>`; **`workflow-orchestrator`** consolidates the validated & documented worktree and creates atomic layer-by-layer Conventional Commits via `git-governance`.
* Never execute `git push` or `git merge` into `develop`/`main` without explicit user authorization.
* All code comments, KDoc, commit messages, and technical specs **MUST be written in English**.
* Apply **KISS**: prefer simple, modular solutions aligned with existing repository patterns.

## Required Feature Artifacts (`docs/features/<feature-id>/`)

* `docs/features/<feature-id>/spec.md` — Unified feature specification.
* `docs/features/<feature-id>/ui/screens/` — Full-screen reference mockups (NEVER converted to drawables).
* `docs/features/<feature-id>/ui/resources/` — Raw PNG/JPEG graphic assets (converted to `.webp` in the target UI module: `app/src/main/res/drawable/ic_<name>.webp` in Layer-Based topology, or `<feature>/presentation/src/main/res/drawable/ic_<name>.webp` / `core/designsystem/src/main/res/drawable/` in Feature-First topology).
* `docs/features/<feature-id>/validator/validation-report.md` — Independent validation report (`accept` | `revise` | `block`).

## Definition of Done

A feature is complete only when:
1. `docs/features/<feature-id>/spec.md` is created and all acceptance scenarios are implemented by `workflow-implementer`.
2. `@compiler` verification suite (`assembleDebug`, `lintDebug`, `testDebugUnitTest`) passes with recorded evidence.
3. `workflow-validator` returns `accept` in `docs/features/<feature-id>/validator/validation-report.md`.
4. `workflow-documenter` updates English KDoc, durable docs, and marks `[x]` in `spec.md`.
5. `workflow-orchestrator` cleans up temporary worktrees, sets `status: "accepted"` in `feature_list.json`, updates `PROGRESS.md`, and creates layer-specific Conventional Commits on `feature/<feature-id>`.
