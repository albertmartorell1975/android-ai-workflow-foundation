# Instructions for Agents - [PROJECT_NAME]

## Project Overview & Architecture Map

[Describe the project purpose, target platform, domain, and main goals.]

* **UI Architecture**: `MVVM (Hybrid UI State & Passive Initialization)` (`.agents/skills/viewmodel-architecture-governance/SKILL.md`)
* **Module Topology**: `[MODULE_TOPOLOGY]` (`.agents/skills/module-architecture-governance/SKILL.md`)
* **Dependency Injection**: `Hilt` (`.agents/skills/hilt/SKILL.md`)
* **Persistence**: `Room` (`.agents/skills/room-schema-governance/SKILL.md`)

## Deterministic Quality & Safety Gates (The Harness)

* **Fast Compile Check (Iterative Coding)**: `./gradlew compileDebugKotlin` (fast Kotlin & KSP syntax check).
* **Full APK & Hilt DI Graph Check**: `./gradlew assembleDebug` (verifies full Hilt graph, resources, Manifest, and builds the APK).
* **Canonical Verification Gate (`@compiler`)**: `./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache`
* **CI Gate**: `.github/workflows/gate.yml` runs automatically on every Pull Request targeting `develop` or `main`.
* **Active Pre-Execution Hooks**: Destructive commands (`rm -rf`, `git reset --hard`, autonomous `gh pr merge`) and commits exceeding the `AGENTS.md` size budget (max 120 lines / 6 KB) are deterministically blocked by project safety hooks.

## Core Guardrails (MUST / NEVER)

* **NEVER** push directly to `main`/`develop`, force-push, or merge Pull Requests autonomously (`@git-governance`).
* **NEVER** import `android.*` dependencies in `:domain` modules or hardcode secrets/API keys.
* **ALWAYS** execute feature work in an isolated `git worktree` (`WIP=1`) and pass the Local Verification Gate before completion.
* **ALWAYS** preserve the `AGENTS.md` instruction budget (< 100 lines target, 120 lines hard cap); codify new recurring lessons into `CONSTRAINTS.md`.

## Context Routing (Read First)

1. `PROGRESS.md` — Current verified state, last gate execution, and session log.
2. `feature_list.json` — Feature backlog, `depends_on`, checkpoints (`require_review_after`), and status (`not_started`, `in_progress`, `passing`, `accepted`, `blocked`).
3. `CONSTRAINTS.md` — Durable `MUST` / `MUST NOT` rules discovered via harness feedback loops.
4. `CONTEXT.md` & `docs/build-brief.md` — Domain glossary and product scope (when present).
5. `.agents/skills/README.md` — On-demand (*Just-In-Time*) modular skills and technical guardrails.

Read on demand: `ARCHITECTURE.md`, `DESIGN.md`, `docs/features/<feature-id>/spec.md`, `docs/features/<feature-id>/validator/validation-report.md`, and `docs/features/<feature-id>/validator/pr-review.md` (`Round #1..#N`).

---

## Unified Multi-Agent Workflow (`foundation`)

Every agent and subagent MUST prefix its responses and `PROGRESS.md` entries with its assigned badge:
* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`** — Pipeline coordination, `feature_list.json`, `git worktree` lifecycle, APK hydration, atomic `@git-governance` commits, and PR publication + CI gate trigger.
* 🔵 **`[PLANNER · workflow-planner]`** — Feature diagnosis and unified specification (`docs/features/<feature-id>/spec.md`).
* 🟡 **`[IMPLEMENTER · workflow-implementer]`** — Clean Architecture code, pure JVM tests, and `@compiler` verification in an isolated `git worktree`.
* 🟢 **`[VALIDATOR · workflow-validator]`** *(or 🔴 on `revise` / `block`)* — Read-only 4-level validation (Spec, Security, Compiler/Tests, Runtime) and `validation-report.md` in an isolated `git worktree` (`MAX_REPAIR_ATTEMPTS = 2`).
* 🔷 **`[DOCUMENTER · workflow-documenter]`** — English KDoc and durable Markdown docs (`CONSTRAINTS.md`, `ARCHITECTURE.md`, `PROGRESS.md`) in an isolated `git worktree` after acceptance.

### Human Checkpoints & Execution Modes
* **Checkpoints (`require_review_after`)**: Configurable per feature (`"planner"`, `"implementer"`, `"validator"`, or array). Recommended high-leverage pattern: supervise after `"planner"` (`spec.md`) and via GitHub Pull Request review.
* **Execution Modes**:
  1. **Backlog Mode**: `@build-brief` -> `@harness-starter` -> `@workflow-orchestrator` (auto-detects open PR reviews first, then executes ready features from `feature_list.json` whose `depends_on` are accepted, PR-clean, and merged into `develop`).
  2. **Standalone Mode**: Pass an ad-hoc feature to `@workflow-orchestrator` -> runs the same pre-flight PR audit & `depends_on` PR-clean gate, registers, plans, implements, validates, documents in isolated worktrees, opens the PR, and supports the `review-fix` loop.
  3. **Post-PR Review (`review-fix`)**: Automatically extracts GitHub PR review & inline code comments via `gh api` (or user prompt) into `pr-review.md` (`## PR Review Round #N`), repairs, re-validates, and pushes the delta to the open PR while blocking dependent features until resolved.
