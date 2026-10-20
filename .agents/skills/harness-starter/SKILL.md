---
name: harness-starter
description: Create or update the minimal startup harness for an Android repository after product discovery or on an existing project before feature implementation. Use when the user asks to use harness-starter, prepare the initial repo harness, create AGENTS/init/progress/feature list, or move from discovery docs to a coding-agent-ready repository. The skill reads existing discovery docs (or inspects an existing Android repository), derives AGENTS.md, init.sh, PROGRESS.md, CONSTRAINTS.md, and feature_list.json, and sets up the unified docs/features/<feature-id>/ directories.
---

# Origin

Originally created by Antonio Leiva / Nino Ruano for the AI Expert course.
Integrated and adapted for Android AI Workflow Foundation with permission.

# Harness Starter

Use this skill to create or update the smallest useful repository harness. The output lets any orchestrator or subagent answer: what is this project, how do I start and verify it, what is the next ready feature, and what constraints apply.

## AGENTS.md Preservation

When creating or updating `AGENTS.md`:

* Preserve existing project-specific Workflow Governance and Stack Diagnosis rules when present.
* If `AGENTS.md` was already materialized by `workflow-initializer`, enrich its project summary and Read First references conservatively without overwriting the Foundation governance rules.
* Keep `AGENTS.md` short and routing-oriented. It is a landing page, not an encyclopedia.

## Hard Rules

- Do not implement product code.
- Do not initialize frameworks, install dependencies, or modify application source.
- Do not reopen product discovery unless the user asks for discovery or the repository has neither discovery docs nor an existing codebase to inspect.
- Create or update only the startup harness artifacts:
  - `AGENTS.md`
  - `init.sh`
  - `PROGRESS.md`
  - `CONSTRAINTS.md` (if durable operational rules exist)
  - `feature_list.json`
  - Dedicated feature directories under `docs/features/<feature-id>/`:
    - `docs/features/<feature-id>/ui/screens/`
    - `docs/features/<feature-id>/ui/resources/`
    - `docs/features/<feature-id>/validator/`
    *(If a folder already exists, do NOT overwrite or recreate it).*
- Preserve the repository's document language and style. If unclear, infer from existing discovery docs; ask only if there is no evidence.
- If any target file already exists, read it first and update conservatively. Do not overwrite useful human-authored content.

## Inputs To Read First

1. Discovery docs when present:
   - `CONTEXT.md`
   - `docs/build-brief.md` or `docs/product-brief.md`
   - `docs/domain-model.md`
   - `docs/risks-and-open-questions.md`
   - `DESIGN.md`
   - Optional: `docs/user-and-access-model.md`, `docs/technical-discovery.md`, `docs/mvp-scope.md`, `docs/adr/*.md`
2. Existing Android repository structure when initializing the harness on an already-created project (`settings.gradle.kts`, `gradle/libs.versions.toml`, module structure, `AGENTS.md`).

If neither discovery docs nor an existing project description exist, ask the user whether they want to run `@build-brief` first for full product discovery or provide a brief list of target features to initialize a lightweight harness.

## Workflow

### 1. Inspect Current State

Check whether each target file (`AGENTS.md`, `init.sh`, `PROGRESS.md`, `CONSTRAINTS.md`, `feature_list.json`) already exists. For existing files, preserve intent and only fix gaps needed for the harness.

### 2. Derive The Minimal Harness

Create/update the target files using `references/artifact-templates.md`:

- `AGENTS.md`: project landing page, multi-agent workflow routing, and operating rules.
- `init.sh`: standard non-blocking startup/verification gate (e.g. `./gradlew testDebugUnitTest --quiet` for bootstrapped Android projects).
- `PROGRESS.md`: current verified state and lightweight session log.
- `CONSTRAINTS.md`: operational `MUST` / `MUST NOT` rules discovered so far.
- `feature_list.json`: machine-readable feature backlog with `id`, `area`, `title`, `user_visible_behavior`, `depends_on`, `status`, `verification`, `evidence`, and `notes`.

For EVERY feature derived in `feature_list.json`, ensure its dedicated unified folder structure exists under `docs/features/<feature-id>/`:
- `docs/features/<feature-id>/ui/screens/` — for feature screen mockups and layout blueprints (PNG/HTML).
- `docs/features/<feature-id>/ui/resources/` — for feature raw graphic assets (PNG/JPEG).
- `docs/features/<feature-id>/validator/` — for structured independent validation reports (`validation-report.md`).

*Folder Existence Rule:* If a feature folder already exists, do NOT recreate or overwrite it; leave existing assets untouched.

### 3. Keep Scope Tight (Feature Slicing)

The feature list should contain session-sized feature slices, not epics and not low-level chores. Each feature must represent user-visible or system-verifiable behavior that is plausibly completable and verifiable in one focused pipeline run (`workflow-planner` -> `workflow-implementer` -> `workflow-validator` -> `workflow-documenter`).

Use this operational slicing test before writing `feature_list.json`:

- If a feature title contains multiple domains joined by "and" / "/" / commas, split it.
- If a feature would require multiple independent screens, endpoints, jobs, or integrations to verify, split it.
- If a feature cannot be verified with one small scenario plus the standard repo gate, split it.
- For a full MVP derived from `@build-brief`, expect roughly 10-30 session-sized features rather than 4-5 broad epics. For an existing project initializing a lightweight harness for upcoming work, include only the requested feature slices.

At most one feature may be `in_progress` initially (prefer all `not_started` unless active work already exists).

Use `depends_on` to express execution prerequisites. Features whose `depends_on` prerequisites are all `accepted` can be scheduled sequentially or in parallel `git worktree` instances by `@workflow-orchestrator`.

### 4. Handle Missing Technical Commands

If the Android app is not bootstrapped yet, `init.sh` should be honest and provisional:

- confirm the directory,
- report that product bootstrap is pending,
- list expected future Gradle commands (`./gradlew testDebugUnitTest lintDebug`),
- exit successfully only if this is intentional for the pre-bootstrap phase.

### 5. Quality Check

Before finishing, verify:

- `AGENTS.md` answers: what is the project, how to start, how to verify, and how the Foundation multi-agent pipeline works.
- `feature_list.json` is valid JSON.
- Every feature has `id`, `area`, `title`, `user_visible_behavior`, `depends_on`, `status`, `verification`, `evidence`, and `notes`.
- Every `depends_on` entry references an existing feature `id`, does not reference itself, and does not create a dependency cycle.
- `PROGRESS.md` names the standard startup and verification paths.
- `init.sh` is executable (`chmod +x init.sh` where supported).
- All `docs/features/<feature-id>/` subdirectories (`ui/screens`, `ui/resources`, `validator`) exist.

## Teaching Note

When explaining the result, emphasize the progression:

`Build Brief -> Harness Starter (feature_list.json + PROGRESS.md) -> Workflow Orchestrator (Planner -> Implementer -> Validator -> Documenter)`
