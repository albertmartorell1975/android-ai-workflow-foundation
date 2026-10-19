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
2. 🔵 **Planner (`workflow-feature`)**: Analyzes the feature and generates the unified contract at `docs/features/<feature-id>/spec.md`.
3. 🟡 **Implementer (`workflow-implementer`)**: Runs in an isolated worktree, implements Clean Architecture layers + tests, executes the `compiler` verification suite, and marks the feature `passing`.
4. 🟢 **Validator (`workflow-validator`)**: Runs in an isolated worktree, audits the implementation across 4 validation levels, and writes `docs/features/<feature-id>/validator/validation-report.md` (`accept`, `revise`, or `block`).
5. 🔷 **Documenter (`workflow-documenter`)**: Runs in an isolated worktree after `accept`, updates KDoc and durable docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `spec.md`), and updates `PROGRESS.md`.

## Startup Workflow

Before writing code:

1. Confirm the working directory and active git branch (`git branch --show-current`).
2. Read `PROGRESS.md` for current verified state and next step.
3. Read `feature_list.json` to inspect active or ready features.
4. Run `./init.sh` (or the `@compiler` baseline check) when verifying project health.

## Working Rules

- Work on one feature at a time per worktree (`WIP=1`).
- Never push or merge to `develop`/`main` without explicit user authorization (`git-governance`).
- Subagents do not create final commits on the main feature branch; the orchestrator consolidates and commits after validation acceptance and documentation.
- Apply **KISS** and follow the active skills in `.agents/skills/`.
```

## `init.sh`

Purpose: canonical non-blocking startup/verification gate.

### Pre-bootstrap variant

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Repository: $(pwd)"
echo "Harness status: pre-bootstrap"
echo "Android application stack is not initialized yet."
echo "Next step: run workflow-orchestrator on the first bootstrap feature in feature_list.json."
```

### Bootstrapped Android variant

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Repository: $(pwd)"
echo "Running baseline Android unit tests and lint checks..."
./gradlew testDebugUnitTest lintDebug --quiet
echo "Baseline verification passed."
```

## `PROGRESS.md`

Purpose: current verified state first, lightweight history second.

```md
# Progress Log

## Current Verified State

- Repository root: `[absolute or relative path]`
- Standard startup/verification gate: `./init.sh` (`./gradlew testDebugUnitTest lintDebug`)
- Current next ready feature: `[feature id]`
- Current blocker: `[none / blocker]`
- Last verified at: `[date or not yet verified]`

## Session Log

### Session 001

- Date: `[date]`
- Agent: 🟣 `[ORCHESTRATOR · harness-starter]`
- Goal: Initialize the project startup harness.
- Completed: `AGENTS.md`, `init.sh`, `PROGRESS.md`, `CONSTRAINTS.md`, and `feature_list.json` created or updated.
- Verification run: `[json validation / chmod / gradle check]`
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
      "./gradlew testDebugUnitTest lintDebug",
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
