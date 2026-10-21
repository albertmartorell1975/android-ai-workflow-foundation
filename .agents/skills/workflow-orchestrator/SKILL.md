---
name: workflow-orchestrator
description: Master multi-agent orchestrator for the Android AI Workflow Foundation. Coordinates feature development in Standalone Feature Mode, Backlog Queue Mode (feature_list.json), and GitHub PR delivery across three execution modes (plan, execute, publish), managing hydrated git worktrees and delegating sequentially to workflow-planner (Planner), workflow-implementer, workflow-validator, and workflow-documenter.
metadata:
  author: Albert Martorell Garcia / Antonio Leiva / Nino Ruano
  version: 2.1.0
  keywords:
    - orchestrator
    - multi-agent
    - git-worktree
    - feature-flow
    - github-flow
    - pipeline
---

# Origin

Combines the Foundation Workflow architecture by Albert Martorell Garcia with the multi-agent orchestration and loop engineering model originally created by Antonio Leiva / Nino Ruano for the AI Expert course.

# Workflow Orchestrator (`workflow-orchestrator`)

## Visual Identity Protocol (Mandatory)

To make agent activity immediately recognizable in the chat and logs, every agent in the pipeline MUST prefix its responses, status updates, and `PROGRESS.md` entries with its assigned color badge:

* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`** — Pipeline coordination, `feature_list.json`, `git worktree` management, and final `@git-governance` commits/PRs.
* 🔵 **`[PLANNER · workflow-planner]`** — Technical diagnosis and specification at `docs/features/<feature-id>/spec.md`.
* 🟡 **`[IMPLEMENTER · workflow-implementer]`** — Clean Architecture code, unit/UI tests, and `@compiler` verification in an isolated worktree.
* 🟢 **`[VALIDATOR · workflow-validator]`** *(or 🔴 on `REVISE` / `BLOCK`)* — Strictly read-only 4-level independent audit (Spec Contract, Clean Architecture & Security, Test/Compiler Evidence, Runtime) returning an `accept` / `revise` / `block` verdict with an `Implementation Repair Brief` in its response.
* 🔷 **`[DOCUMENTER · workflow-documenter]`** — English KDoc, durable documentation sync, and checklist completion in an isolated worktree.

---

## 1. Orchestrator Scoped Skills & Git Governance Ownership

The Orchestrator (`workflow-orchestrator`) operates with a minimal, focused skill set:
* **`workflow-orchestrator`** — Master pipeline state machine, `feature_list.json` queue selection, `git worktree` coordination, and GitHub delivery.
* **`git-governance`** — **Exclusively owned by the Orchestrator.** The Orchestrator uses `git-governance` to diagnose branches, create `feature/<feature-id>` from `develop` (`base_sha`), execute atomic Conventional Commits (`Domain -> Data -> UseCases -> UI -> Docs`), format structured Pull Requests, and reconcile parallel wave rebases. Subagents never run `git-governance` or create final commits on `feature/<feature-id>`.

---

## 2. Entry Modes & Three Operational Modes

### Entry Modes

#### Mode A: Standalone / Ad-hoc Feature Mode
Triggered when the user provides a concrete feature idea or request directly (e.g., *"Use `@workflow-orchestrator` to build a biometric login screen"*):
1. Derive a clean `kebab-case` `<feature-id>` (e.g., `biometric-login`).
2. Check if `feature_list.json` and `PROGRESS.md` exist at the repository root:
   - If they **do not exist** yet, create a lightweight `feature_list.json` and `PROGRESS.md` containing this feature entry (`status: "not_started"`).
   - If they **already exist**, append or select the `<feature-id>` entry in `feature_list.json`.
3. Ensure the unified feature directory structure exists (`docs/features/<feature-id>/ui/screens/`, `resources/`, `validator/`).
4. Execute the Feature Pipeline for `<feature-id>`.

#### Mode B: Project / Backlog Queue Mode (`feature_list.json`)
Triggered when the user asks to continue the project backlog, run the next available feature, or parallelize ready features from `feature_list.json`:
1. Read `AGENTS.md`, `PROGRESS.md`, `CONSTRAINTS.md`, and `feature_list.json`.
2. Select target feature(s) in priority order:
   - Resuming any feature currently in `in_progress` or `passing`.
   - The first `not_started` feature whose `depends_on` are all `accepted`.
3. Support parallel feature execution when requested across independent worktrees.

---

### Three Operational Modes (`plan` | `execute` | `publish`)

When coordinating backlog features or delivering to GitHub, the orchestrator evaluates the **4 Deterministic Preconditions** (dependencies accepted, clean base, permissions, hydrated environments) and executes in one of three modes:
- **`plan` (planificar)**: Strictly read-only (zero git/GitHub mutations). Evaluates preconditions, resolves reuse targets, and produces the diagnostic Output Report.
- **`execute` (executar)**: Autonomous pipeline to `accepted` state across isolated hydrated worktrees. Commits remain local.
- **`publish` (publicar)**: Requires `accepted` status and explicit push permission. Pushes `feature/<id>` and creates the structured PR. Never merges.

> **See [Operational Modes & Output Report](references/operational-modes.md)** for detailed mode specifications, precondition checks, and output schemas.

---

## 3. Hard Governance Rules

- **Single Responsibility**: The orchestrator coordinates and commits; it never writes application code, tests, or KDoc directly while a subagent owns that role.
- **Default Model Selection**: Always invoke subagents with **`model: inherit`** by default.
- **Bounded Repair Loop (`MAX_REPAIR_ATTEMPTS = 2`) & Human Decision Gate (`needs_human_review`)**:
  - The repair cycle between `workflow-implementer` and `workflow-validator` is strictly bounded to a maximum of 2 repair attempts.
  - If unresolved after 2 repairs, autonomous looping stops immediately, the worktree is preserved intact, status is set to `needs_human_review`, and the user is presented with 4 clear pathways (Manual Override, Human Hint, Re-plan `spec.md`, Cancel).
- **Proactive Human Checkpoints (`require_review_after`)**:
  - The pipeline supports optional, declarative Human-in-the-Loop checkpoints configured per feature in `feature_list.json` (`"require_review_after": "planner" | "implementer" | "validator" | ["planner", "validator"]`) or specified ad-hoc in the user prompt.
  - When a checkpointed stage completes, the orchestrator pauses autonomous progression, displays the stage summary with clickable artifact links, and presents 4 structured review options:
    1. **`[Approve & Proceed]`**: Deliverables verified; continue to next pipeline stage.
    2. **`[Human Guidance / Hint]`**: User provides corrective feedback; stage re-runs or next stage receives guidance.
    3. **`[Manual Worktree Edits]`**: User directly edits or tests in the active worktree before signaling the orchestrator to resume.
    4. **`[Abort / Defer]`**: Safely aborts or suspends feature processing, preserving worktree state.
  - **Permissive Evaluation**: Any unrecognized value or invalid stage name in `require_review_after` is treated permissively as `null` (the autonomous flow proceeds without stopping or failing).
- **Worktree Hydration**: Always copy `local.properties` (with `sdk.dir`) and uncommitted environment files into new worktrees before running subagents so Gradle can compile.
- **Never Push Without Authorization**: Do not execute `git push` unless running in authorized `publish` mode.
- **Never Merge**: Never execute `gh pr merge` or enable auto-merge.

---

## 4. The 6-Stage Feature Pipeline

```text
[1. Planner: workflow-planner] ◄────────────────────────────────┐
       │  (creates docs/features/<feature-id>/spec.md)          │
       ▼ (*)                                                    │ (3. Re-plan)
[2. Implementer: workflow-implementer]  ◄─────────────┐         │
       │  (hydrated worktree -> code + @compiler)     │         │
       ▼ (*)                                          │         │
[3. Validator: workflow-validator]                    │         │
       │                             │                │         │
(ACCEPT) (*)                         │ (REVISE)       │ (Auto   │
       │                             ▼                │  repair │
       │                  [Attempts <= MAX (2)?]      │  pass)  │
       │                    ├── Yes ──────────────────┤         │
       │                    │                         │         │
       │                    └── No (Limit reached)    │         │
       │                           │                  │         │
       │                           ▼                  │         │
       │              [🛑 Human Decision Gate]        │         │
       │                (needs_human_review)          │         │
       │ ◄────────────────├── 1. Override             │         │
       │                  ├── 2. Human Hint ──────────┘         │
       │                  ├── 3. Re-plan ───────────────────────┘
       │                  └── 4. Cancel ──► [Clean & Abort]
       │
       ▼
[4. Documenter: workflow-documenter]
       │  (isolated worktree -> KDoc + durable docs + spec.md [x])
       ▼
[5. Consolidation & Layer-Specific Commits: @git-governance]
       │  (atomic commits: Domain -> Data -> UseCases -> UI -> Docs)
       ▼
[6. GitHub PR Delivery: publish mode]  (Optional / On Request)
       └── Push to remote + Structured Evidence PR (Closes #ID) -> Human Merge

(*) Optional Human-in-the-Loop Checkpoint if configured in `require_review_after` ("planner", "implementer", "validator") or requested via prompt.
```

### Stage 1: Planning (`workflow-planner` Subagent)
- Check if `docs/features/<feature-id>/spec.md` exists and is current.
- Spawn **`workflow-planner`** (🔵 `[PLANNER · workflow-planner]`). It reads repository architecture, formulates up to 3 Necessary Questions if ambiguous, and writes `docs/features/<feature-id>/spec.md` without modifying executable code.
- **Checkpoint Check `(*)`**: If `"planner"` is specified in `feature.require_review_after` (or requested via prompt), pause before Stage 2 and prompt for Human Approval.

### Stage 2: Implementation (`workflow-implementer` in Hydrated Worktree)
- Create isolated worktree `.worktrees/impl-<feature-id>` from `feature/<feature-id>` and hydrate local Android environment files (`local.properties`, `.env`, `keystore.properties`).
- Spawn **`workflow-implementer`** (🟡 `[IMPLEMENTER · workflow-implementer]`). It builds Clean Architecture layers, adds tests, runs `@compiler` verification, records evidence, and sets status to `passing`.
- **Checkpoint Check `(*)`**: If `"implementer"` is specified in `feature.require_review_after` (or requested via prompt), pause before Stage 3 and prompt for Human Approval.

### Stage 3: Independent Validation (`workflow-validator` in Worktree)
- Spawn **`workflow-validator`** (🟢/🔴) in read-only mode in an isolated worktree.
- Persist `docs/features/<feature-id>/validator/validation-report.md`.
- If `revise`: increment `repair_attempts++`. If `< MAX_REPAIR_ATTEMPTS`, route repair brief to Implementer (Stage 2). If `>= MAX_REPAIR_ATTEMPTS`, trigger **Human Decision Gate** (`needs_human_review`).
- If `block`: Stop immediately and report blocker.
- If `accept`: **Checkpoint Check `(*)`** — If `"validator"` is specified in `feature.require_review_after` (or requested via prompt), pause before Stage 4 and present the diff & `validation-report.md` for Human Approval. Otherwise, proceed directly to Stage 4.

### Stage 4: Documentation (`workflow-documenter` in Worktree)
- Spawn **`workflow-documenter`** (🔷 `[DOCUMENTER · workflow-documenter]`).
- Authors English KDoc on public classes, updates durable documentation (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`), and marks `[x]` items in `spec.md`.

### Stage 5: Worktree Consolidation & Layer Commits (`@git-governance`)
1. Merge the validated & documented worktree state back into `feature/<feature-id>` and remove temporary worktrees (`git worktree remove` + physical filesystem cleanup of untracked caches + `git branch -d`).
2. Update `feature_list.json` status to `"accepted"` and append evidence to `PROGRESS.md`.
3. Create atomic Conventional Commits per **`git-governance`** (`Domain -> Data -> UseCases -> UI -> Docs`), formatted as `<type>(<scope>): [<feature-id>] <subject>`.
4. If running in local `execute` mode, present the handoff summary.

### Stage 6: GitHub Issue & PR Publication (`publish` Mode)
Triggered when the user requests `publish` mode or requests PR creation:
1. **Gate Verification**: Ensure feature status is `"accepted"` in `feature_list.json` and explicit push permission is granted.
2. **Push Branch**: Run `git push -u origin feature/<feature-id>`.
3. **Idempotent PR Creation via GitHub CLI (`gh`)**:
   - Verify GitHub CLI: check `gh auth status`. If available, check if PR exists: `gh pr list --state all --head "feature/<feature-id>" --base <base_branch>`.
   - If not present and `gh` is available: create PR with `gh pr create` targeting `base_branch` (`develop`) using the structured evidence body template from `git-governance/references/github-delivery.md`.
   - If `gh` is missing or unauthenticated: notify the user and provide the direct browser URL (`https://github.com/<owner>/<repo>/pull/new/feature/<feature-id>`) with pre-filled PR title and markdown body for one-click manual creation.
4. **Never Merge**: Report PR URL. CI executes `.github/workflows/gate.yml`. The human developer performs review and merge.

---

## 5. Output Reporting & References

The orchestrator emits a standardized execution report (`feature`, `session`, `branch`, `status`, `commit`, `evidence`, `pr`) at the conclusion of any run mode.

> **See [Operational Modes & Output Report](references/operational-modes.md)** for detailed mode specifications, precondition checks, and output schemas.
> **See [Contract Evals](references/evals.md)** for deterministic verification of `plan` and `publish` modes with zero side effects.
> **See [Subagent Providers & Git Worktree Protocol](references/subagent-providers.md)** for provider-specific worktree execution.
