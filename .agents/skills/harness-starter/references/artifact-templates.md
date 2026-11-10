# Minimal Harness Artifact Templates

Use these templates as starting points. Adapt content to the repository's discovery docs or existing Android project structure. Keep the generated files concise.

## `AGENTS.md`

Purpose: concise, provider-agnostic harness map and landing page for agents (aligned with `.agents/skills/workflow-initializer/references/AGENTS_TEMPLATE.md`; strictly < 120 lines / < 6 KB).

```md
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
  1. **Backlog Mode**: `@build-brief` -> `@harness-starter` -> `@workflow-orchestrator` (executes ready features from `feature_list.json`).
  2. **Standalone Mode**: Pass an ad-hoc feature to `@workflow-orchestrator` -> registers, plans, implements, validates, documents in isolated worktrees, and opens the PR against `develop`.
  3. **Post-PR Review (`review-fix`)**: Pass PR review feedback to `@workflow-orchestrator` -> logs `## PR Review Round #N` in `pr-review.md`, repairs, re-validates, and pushes the delta to the open PR.
```

## `.github/workflows/gate.yml`

- **Purpose**: Deterministic GitHub Actions Quality Gate for Pull Requests. Executes a headless, non-interactive Gradle check in the cloud (checkout -> JDK setup -> Gradle cache -> `testDebugUnitTest` and `lintDebug`). Unlike the AI-driven `@compiler` skill (which runs in the local IDE with code analysis, Compose previews, and optional asset generation), `gate.yml` is a pure CI script running on GitHub infrastructure with zero AI intervention.
- **JDK Configuration**: Defaults to JDK 17 (the mandatory baseline for AGP 8.x+ and Kotlin 2.0). If the project specifies `jvmToolchain(21)` or targets Android SDK 36+, configure `java-version: '21'`.
- **Lifecycle**: Inspected and materialized **once** during repository harness initialization by `@harness-starter`. Standard feature commits in `@workflow-orchestrator` and `@git-governance` never create or alter CI workflows.

```yaml
name: Quality Gate

on:
  pull_request:
    branches:
      - develop
      - main

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: Verify Gradle Quality Gate
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17' # AGP 8.x baseline. Update to '21' if project uses jvmToolchain(21) or SDK 36+

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          cache-read-only: ${{ github.ref != 'refs/heads/develop' && github.ref != 'refs/heads/main' }}

      - name: Make gradlew executable
        run: chmod +x gradlew

      - name: Run Canonical Gate Command
        run: ./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache
```

## `PROGRESS.md`

Purpose: current verified state first, lightweight history second.

```md
# Progress Log

## Current Verified State

- Repository root: `[absolute or relative path]`
- Standard startup/verification gate: `@compiler` canonical check (`./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache`)
- Current next ready feature: `[feature id]`
- Current blocker: `[none / blocker]`
- Last verified at: `[date or not yet verified]`

## Session Log

### Session 001

- Date: `[date]`
- Agent: 🟣 `[ORCHESTRATOR · harness-starter]`
- Goal: Initialize the project startup harness.
- Completed: `AGENTS.md`, `PROGRESS.md`, `CONSTRAINTS.md`, `feature_list.json`, and `.github/workflows/gate.yml` created or updated.
- Verification run: `[json validation / gradle check]`
- Files or artifacts updated: `[list]`
- Next best step: `[run workflow-orchestrator for <feature-id>]`
```

## `CONSTRAINTS.md`

Purpose: durable operational `MUST` / `MUST NOT` rules discovered during implementation or architecture setup.

```md
# Operational Constraints

Record only durable `MUST` and `MUST NOT` rules that future sessions and subagents must obey. Do not duplicate general rules already covered in `AGENTS.md` or `.agents/skills/`.

- **MUST**: Keep `domain` modules pure Kotlin with zero Android framework dependencies.
- **MUST NOT**: Convert full-screen layout mockups under `docs/features/<feature-id>/ui/screens/` into Android drawable resources.
```

## `feature_list.json`

Purpose: machine-readable feature state. Generate valid JSON only.

Schema:

```json
[
  {
    "id": "short-kebab-case-id",
    "area": "product-area",
    "title": "Short feature title",
    "user_visible_behavior": "What the user or system can observe when this works.",
    "depends_on": [],
    "status": "not_started",
    "require_review_after": null,
    "spec_path": "docs/features/short-kebab-case-id/spec.md",
    "validation_path": "docs/features/short-kebab-case-id/validator/validation-report.md",
    "verification": [
      "./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache",
      "Concrete acceptance or pure JVM unit test verification step."
    ],
    "evidence": [],
    "notes": "Relevant constraints, source docs, dependencies, or known risks."
  }
]
```

Status values:

- `not_started`: Feature has not entered implementation yet.
- `in_progress`: Currently being implemented or repaired by `workflow-implementer`.
- `passing`: `workflow-implementer` completed implementation and passed `@compiler` self-verification; ready for `workflow-validator`.
- `accepted`: `workflow-validator` returned `accept`, `workflow-documenter` updated documentation, and `workflow-orchestrator` persisted acceptance.
- `blocked`: Implementation or validation cannot proceed due to an explicit blocker recorded in `notes` and `PROGRESS.md`.

`require_review_after` values (Optional Human-in-the-Loop Checkpoints):

- `null` (or omitted): Unattended autonomous execution. Pipeline runs `planner -> implementer -> validator -> documenter` without stopping.
- `"planner"`: Pause after `workflow-planner` creates `docs/features/<feature-id>/spec.md`. The developer inspects architecture decisions, API contracts, and acceptance scenarios before code is written.
- `"implementer"`: Pause after `workflow-implementer` passes compiler self-verification (`status: passing`), before `workflow-validator` audits.
- `"validator"`: Pause after `workflow-validator` returns `accept`, before `workflow-documenter` and final git consolidation. The developer reviews the code diff and `validation-report.md`.
- `["planner", "validator"]` (Array): Pause at multiple stages for critical features (e.g. payment flows, core architecture shifts).
- *Permissive Evaluation*: Any unrecognized string, unknown value, or invalid stage name is treated permissively as `null` (autonomous flow continues without blocking).
