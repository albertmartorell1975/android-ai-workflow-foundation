# Instructions for Agents - [PROJECT_NAME]

## Project Overview

[Describe the project purpose, target platform, domain, and main goals.]

* **UI Architecture Pattern**: `MVVM (Hybrid UI State & Passive Initialization)` (Governed by `.agents/skills/viewmodel-architecture-governance/SKILL.md`)
* **Module Topology**: `[MODULE_TOPOLOGY]` (Governed by `.agents/skills/module-architecture-governance/SKILL.md`)
  - *Layer-Based*: `:domain` -> `:usecases` <- `:data` -> `:app`
  - *Feature-First*: `:<feature>:domain`, `:<feature>:usecases`, `:<feature>:data`, `:<feature>:presentation` + `:core:*` + `:app` (Integrator)
* **Dependency Injection**: `Hilt` (Governed by `.agents/skills/hilt/SKILL.md`)
* **Persistence**: `Room` (Governed by `.agents/skills/room-schema-governance/SKILL.md`)
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

This project uses the **Android AI Workflow Foundation Unified Multi-Agent Pipeline**.

### Visual Identity Badges (Mandatory)
Every agent and subagent MUST prefix its responses and `PROGRESS.md` entries with its assigned color badge:
* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`** — Pipeline coordination, `feature_list.json`, `git worktree` management, and final `@git-governance` commits.
* 🔵 **`[PLANNER · workflow-feature]`** — Feature diagnosis and unified specification (`docs/features/<feature-id>/spec.md`).
* 🟡 **`[IMPLEMENTER · workflow-implementer]`** — Clean Architecture code, tests, and `@compiler` verification in an isolated `git worktree`.
* 🟢 **`[VALIDATOR · workflow-validator]`** *(or 🔴 on `revise` / `block`)* — Independent 4-level validation and `docs/features/<feature-id>/validator/validation-report.md` in an isolated `git worktree`. Bounded to `MAX_REPAIR_ATTEMPTS = 2` before triggering the Human Decision Gate (`needs_human_review`).
* 🔷 **`[DOCUMENTER · workflow-documenter]`** — English KDoc and durable Markdown documentation in an isolated `git worktree`. Runs upon validator acceptance or human override.

### Two Ways to Run Work
1. **Project / Backlog Mode**:
   - Use `@build-brief` (for product discovery) and `@harness-starter` (to derive `feature_list.json`, `PROGRESS.md`, and `init.sh`).
   - Run `@workflow-orchestrator` to execute the next ready feature (or parallelize independent ready features) from `feature_list.json`.
2. **Standalone Feature Mode (Ad-hoc)**:
   - Request a feature directly via `@workflow-orchestrator` (or `@workflow-feature`).
   - The orchestrator automatically registers the feature in `feature_list.json` and `PROGRESS.md`, generates `docs/features/<feature-id>/spec.md`, and launches the subagents (`implementer` -> `validator` -> `documenter`) in isolated `git worktree` instances with `model: inherit`.
