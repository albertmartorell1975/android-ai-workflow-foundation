# Minimal Harness Artifact Templates

Use these templates as starting points. Adapt content to the repository's discovery docs or existing Android project structure. Keep the generated files concise.

## `AGENTS.md`

Purpose: short landing page for agents.

```md
# Project Agent Instructions

This repository contains [one-sentence project summary].

## Read First

- `PROGRESS.md` — current verified state and session history.
- `feature_list.json` — feature backlog, dependencies (`depends_on`), and status (`not_started`, `in_progress`, `passing`, `accepted`, `blocked`).
- `CONSTRAINTS.md` — operational MUST / MUST NOT rules discovered during development.
- `CONTEXT.md` — domain language (when present).
- `docs/build-brief.md` — product goals and MVP scope (when present).
- `docs/domain-model.md` — core entities, relationships, and states (when present).
- `.agents/skills/README.md` — active Foundation skills and technical guardrails.

## Unified Multi-Agent Workflow (`foundation`)

Feature development is coordinated by **`workflow-orchestrator`** using isolated **`git worktree`** environments and `model: inherit` by default:

1. 🟣 **Orchestrator (`workflow-orchestrator`)**: Selects a feature (either ad-hoc from the user or the next ready feature from `feature_list.json`), manages `git worktree` lifecycles, coordinates subagents, and performs final layer-specific Conventional Commits via `git-governance`.
2. 🔵 **Planner (`workflow-planner`)**: Analyzes the feature and generates the unified contract at `docs/features/<feature-id>/spec.md`.
3. 🟡 **Implementer (`workflow-implementer`)**: Runs in an isolated worktree, implements Clean Architecture layers + tests, executes the `compiler` verification suite, and marks the feature `passing`.
4. 🟢 **Validator (`workflow-validator`)**: Runs in an isolated worktree, audits the implementation across 4 validation levels, and writes `docs/features/<feature-id>/validator/validation-report.md` (`accept`, `revise`, or `block`).
5. 🔷 **Documenter (`workflow-documenter`)**: Runs in an isolated worktree after `accept`, updates KDoc and durable docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `spec.md`), and updates `PROGRESS.md`.

## Startup Workflow

Before writing code:

1. Confirm the working directory and active git branch (`git branch --show-current`).
2. Read `PROGRESS.md` for current verified state and next step.
3. Read `feature_list.json` to inspect active or ready features.
4. Run the `@compiler` baseline check (`./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache`) when verifying project health.

## Working Rules

- Work on one feature at a time per worktree (`WIP=1`).
- Never push or merge to `develop`/`main` without explicit user authorization (`git-governance`).
- Subagents do not create final commits on the main feature branch; the orchestrator consolidates and commits after validation acceptance and documentation.
- Apply **KISS** and follow the active skills in `.agents/skills/`.
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
    "spec_path": "docs/features/short-kebab-case-id/spec.md",
    "validation_path": "docs/features/short-kebab-case-id/validator/validation-report.md",
    "verification": [
      "./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache",
      "Concrete acceptance or Compose UI test verification step."
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
