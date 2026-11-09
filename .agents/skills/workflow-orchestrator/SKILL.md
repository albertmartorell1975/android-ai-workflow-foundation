---
name: workflow-orchestrator
description: Master multi-agent orchestrator for the Android AI Workflow Foundation. Coordinates feature development in Standalone Feature Mode, Backlog Queue Mode (feature_list.json), and GitHub PR delivery across four operational modes (plan, execute, publish, review-fix), managing hydrated git worktrees and delegating sequentially to workflow-planner (Planner), workflow-implementer, workflow-validator, and workflow-documenter.
metadata:
  author: Albert Martorell Garcia / Antonio Leiva / Nino Ruano
  version: 2.2.0
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

Every agent in the pipeline MUST prefix its responses, status updates, and `PROGRESS.md` entries with its assigned color badge:
* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`** — Pipeline coordination, `feature_list.json`, `git worktree` management, and final `@git-governance` commits/PRs.
* 🔵 **`[PLANNER · workflow-planner]`** — Technical diagnosis and specification at `docs/features/<feature-id>/spec.md`.
* 🟡 **`[IMPLEMENTER · workflow-implementer]`** — Clean Architecture code, pure JVM unit tests, and `@compiler` verification in an isolated worktree.
* 🟢 **`[VALIDATOR · workflow-validator]`** *(or 🔴 on `REVISE` / `BLOCK`)* — Strictly read-only 4-level independent audit (Spec Contract, Clean Architecture & Security, Test/Compiler Evidence, Runtime) returning an `accept` / `revise` / `block` verdict with an `Implementation Repair Brief` in its response.
* 🔷 **`[DOCUMENTER · workflow-documenter]`** — English KDoc, durable documentation sync, and checklist completion in an isolated worktree.

---

## 1. Orchestrator Scoped Skills & Git Governance Ownership

The Orchestrator (`workflow-orchestrator`) operates with a minimal, focused skill set:
* **`workflow-orchestrator`** — Master pipeline state machine, `feature_list.json` queue selection, `git worktree` coordination, and GitHub delivery.
* **`git-governance`** — **Exclusively owned by the Orchestrator.** The Orchestrator uses `git-governance` to diagnose branches, create `feature/<feature-id>` from `develop` (`base_sha`), execute atomic Conventional Commits (`Domain -> Data -> UseCases -> UI -> Docs`), format structured Pull Requests, and reconcile parallel wave rebases. Subagents never run `git-governance` or create final commits on `feature/<feature-id>`.

---

## 2. Entry Modes & Four Operational Modes

### Entry Modes

#### Mode A: Standalone / Ad-hoc Feature Mode
Triggered when the user provides a concrete feature idea or request directly (e.g., *"Use `@workflow-orchestrator` to build a biometric login screen"*):
1. Derive a clean `kebab-case` `<feature-id>` (e.g., `biometric-login`).
2. Check if `feature_list.json` and `PROGRESS.md` exist at the repository root:
   - If they **do not exist** yet, create a lightweight `feature_list.json` and `PROGRESS.md` containing this feature entry (`status: "not_started"`).
   - If they **already exist**, append or select the `<feature-id>` entry in `feature_list.json` (never overwrite existing features).
3. Ensure the unified feature directory structure exists (`docs/features/<feature-id>/ui/screens/`, `resources/`, `validator/`).
4. Execute the Feature Pipeline for `<feature-id>`.

#### Mode B: Project / Backlog Queue Mode (`feature_list.json`)
Triggered when the user asks to continue the project backlog, run the next available feature, or parallelize ready features from `feature_list.json`:
0. **Pre-flight Base Synchronization (Mandatory)**: Verify working tree is clean (`git status --porcelain -uno` empty), run `git fetch origin develop --prune`, fast-forward local `develop` (`git checkout develop && git pull --ff-only origin develop`), and prune local `feature/*` branches whose PR is already `MERGED` on GitHub (`git branch -D feature/<old-feature-id>`).
1. Read `AGENTS.md`, `PROGRESS.md`, `CONSTRAINTS.md`, and `feature_list.json`.
2. Select target feature(s) in priority order: (a) resuming any feature in `in_progress` or `passing`, (b) the first `not_started` feature whose `depends_on` are all `accepted`.
3. Support parallel feature execution when requested across independent worktrees.

### Operational Modes (`plan` | `execute` | `publish` | `review-fix`)
Evaluates the **4 Deterministic Preconditions** (dependencies accepted, clean base, permissions, hydrated environments) before running:
- **`plan` (planificar)**: Strictly read-only (zero git/GitHub mutations). Evaluates preconditions, resolves reuse targets, and produces the diagnostic Output Report.
- **`execute` (executar)**: Autonomous pipeline to `accepted` state across isolated hydrated worktrees. Upon reaching `status: accepted` at Stage 5, automatically executes Stage 6 (clean push to `origin feature/<id>` and opens the structured PR targeting `develop` so GitHub Actions CI runs). Merging remains 100% human-owned. Root workspace returns to `develop`.
- **`publish` (publicar)**: Standalone/ad-hoc PR delivery for existing accepted features if not already published. Never merges.
- **`review-fix` (revisar-corregir)**: Post-PR review feedback loop. Rehydrates isolated worktrees from `feature/<feature-id>`, runs implementer/validator/documenter on requested PR changes, and pushes the updated delta back to the open PR. Never merges.

> **See [Operational Modes & Output Report](references/operational-modes.md)** for detailed mode specifications, precondition checks, and output schemas.

---

## 3. Hard Governance Rules

- **Single Responsibility**: The orchestrator coordinates and commits; it never writes application code, tests, or KDoc directly while a subagent owns that role.
- **Role-Tuned Model Selection**: Invoke subagents with their role-assigned model tier (`inherit` for `workflow-planner` and `workflow-validator`; `flash` for `workflow-implementer` and `workflow-documenter` in Antigravity/Gemini — see **[Subagent Providers](references/subagent-providers.md)** for Claude Code and Cursor mappings).
- **Bounded Repair Loop (`MAX_REPAIR_ATTEMPTS = 2`) & Human Decision Gate (`needs_human_review`)**:
  - The repair cycle between `workflow-implementer` and `workflow-validator` is strictly bounded to a maximum of 2 repair attempts.
  - If unresolved after 2 repairs, autonomous looping stops immediately, the worktree is preserved intact, status is set to `needs_human_review`, and the user is presented with 4 clear pathways (Manual Override, Human Hint, Re-plan `spec.md`, Cancel).
- **Proactive Human Checkpoints (`require_review_after`)**:
  - Optional Human-in-the-Loop checkpoints configured per feature in `feature_list.json` (`"require_review_after": "planner" | "implementer" | "validator" | ["planner", "validator"]`) or specified ad-hoc in the user prompt. Any unrecognized value is treated permissively as `null`.
  - When a checkpointed stage completes, pause autonomous progression, display the stage summary with clickable artifact links, and present 4 structured review options:
    1. **`[Approve & Proceed]`**: Deliverables verified; continue to next pipeline stage.
    2. **`[Human Guidance / Hint]`**: User provides corrective feedback; stage re-runs or next stage receives guidance.
    3. **`[Manual Worktree Edits]`**: User directly edits or tests in the active worktree before signaling the orchestrator to resume.
    4. **`[Abort / Defer]`**: Safely aborts or suspends feature processing, preserving worktree state.
- **Worktree & Artifact Hydration**: Always copy `local.properties` (with `sdk.dir`) and uncommitted environment files into new worktrees before running subagents so Gradle can compile. At Stage 3 (Validator), also transfer compiled APK artifacts (`app/build/outputs/apk/`) from `.worktrees/impl-<feature-id>` and pre-install onto any active emulator/device before launching `workflow-validator`.
- **Push Net on Accepted Feature Branches & Never Merge**: When a feature reaches `status: accepted`, automatically execute a clean push (`git push -u origin feature/<feature-id>`) and create the Pull Request via `gh pr create` with `BypassSandbox: true`. Force push, pushing unaccepted code, and autonomous merging (`gh pr merge`) are strictly prohibited.

---

## 4. The 7-Stage Feature Pipeline

```text
[1. Planner: workflow-planner] 🔵 ──► creates docs/features/<feature-id>/spec.md (*)
  ▼
[2. Implementer: workflow-implementer] 🟡 (.worktrees/impl-<id>) ──► code + tests + @compiler (*)
  ▼
[3. Validator: workflow-validator] 🟢/🔴 (.worktrees/val-<id>, hydrated APK + emulator pre-install)
  ├── REVISE (attempts < 2) ──► loops back to Stage 2 (Implementer) with Repair Brief
  ├── REVISE (attempts == 2) ─► 🛑 Human Decision Gate (1. Override | 2. Hint | 3. Re-plan | 4. Cancel)
  └── ACCEPT (*) ─────────────► proceeds to Stage 4
  ▼
[4. Documenter: workflow-documenter] 🔷 (.worktrees/doc-<id>) ──► English KDoc + durable docs + spec.md [x]
  ▼
[5. Consolidation & Layer Commits: @git-governance] 🟣 ──► atomic commits (Domain->Data->UseCases->UI->Docs)
  ▼
[6. GitHub PR Delivery: Automatic on Accepted] 🟣 (BypassSandbox: true) ──► push + open PR -> CI runs
  ▼
[7. Post-PR Review Loop (review-fix Round #1..#N)] ──► pr-review.md -> Stage 2 -> 3 -> 4 -> 5 -> push delta
  ▼
[🛑 Human Merge]  (* = Optional Human-in-the-Loop Checkpoint if configured in require_review_after or prompt)
```

### Stage Execution Rules
1. **Stage 1: Planning (`workflow-planner`)**: Check if `docs/features/<feature-id>/spec.md` exists and is current. Spawn `workflow-planner` (🔵) to inspect repository architecture, formulate up to 3 Necessary Questions if ambiguous, and write `docs/features/<feature-id>/spec.md` without modifying executable code. Honor `require_review_after: "planner"` checkpoint if set.
2. **Stage 2: Implementation (`workflow-implementer`)**: Create `.worktrees/impl-<feature-id>` from `feature/<feature-id>` and hydrate local Android environment files (`local.properties`, `.env`, `keystore.properties`, `app/google-services.json`). Spawn `workflow-implementer` (🟡) to build Clean Architecture layers, add tests, run `@compiler` verification, record evidence, and set status to `passing`. Honor `require_review_after: "implementer"` checkpoint if set.
3. **Stage 3: Independent Validation (`workflow-validator`)**: Create `.worktrees/val-<feature-id>`, hydrate environment properties, copy compiled APK artifacts (`app/build/outputs/apk/`) from `.worktrees/impl-<feature-id>`, and pre-install onto active emulator/device if available. Spawn `workflow-validator` (🟢/🔴) in read-only mode and persist `docs/features/<feature-id>/validator/validation-report.md`:
   - If `revise`: increment `repair_attempts++`. If `< MAX_REPAIR_ATTEMPTS`, route repair brief to Implementer (Stage 2). If `>= MAX_REPAIR_ATTEMPTS`, trigger **Human Decision Gate** (`needs_human_review`).
   - If `block`: Stop immediately and report blocker.
   - If `accept`: Honor `require_review_after: "validator"` checkpoint if set; otherwise proceed directly to Stage 4.
4. **Stage 4: Documentation (`workflow-documenter`)**: Spawn `workflow-documenter` (🔷) in `.worktrees/doc-<feature-id>` to author English KDoc on public classes, update durable documentation (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`), and mark `[x]` items in `spec.md`.
5. **Stage 5: Worktree Consolidation & Layer Commits (`@git-governance`)**: Merge validated & documented worktree state into `feature/<feature-id>`, remove temporary worktrees and `wt/*` branches, run `./gradlew prepareKotlinBuildScriptModel --build-cache` if build files (`libs.versions.toml`, `*.gradle.kts`) changed, set `feature_list.json` status to `"accepted"`, append evidence to `PROGRESS.md`, and create atomic Conventional Commits (`Domain -> Data -> UseCases -> UI -> Docs`). In `execute` mode, proceed immediately to Stage 6.
6. **Stage 6: GitHub Issue & PR Publication**: Execute with `BypassSandbox: true`: push `git push -u origin feature/<feature-id>`, check `gh auth status`, and create PR targeting `develop` with structured evidence (if any `git push` or `gh` command fails in the sandbox, retry immediately with `BypassSandbox: true` before falling back to a manual browser URL). Return root workspace to `develop` (`git checkout develop`).
7. **Stage 7: Post-PR Code Review Loop (`review-fix` Mode — Multi-Round)**: Checkout `feature/<feature-id>`, append `## PR Review Round #N` to `docs/features/<feature-id>/validator/pr-review.md`, reset `feature_list.json` to `"in_progress"` (`repair_attempts = 0`), and commit the brief. Rehydrate `.worktrees/impl-<feature-id>`, run `workflow-implementer` -> `workflow-validator` (with APK hydration & emulator pre-install, auditing Round `#N` delta and cumulative diff) -> `workflow-documenter`, consolidate Round `#N` delta via atomic commits, push cleanly (`BypassSandbox: true`), clean worktrees, and return root workspace to `develop`.

---

## 5. Output Reporting & References

The orchestrator emits a standardized execution report (`feature`, `session`, `branch`, `status`, `commit`, `evidence`, `pr`) at the conclusion of any run mode:
* **[Operational Modes & Output Report](references/operational-modes.md)** — Detailed mode specifications, precondition checks, and output schemas.
* **[Git Worktree Lifecycle](references/worktree-lifecycle.md)** — Isolated worktree creation, Android/APK hydration, emulator pre-install, and consolidation commands.
* **[Subagent Providers & Model Tier Configuration](references/subagent-providers.md)** — Provider invocation protocols and model tier matrix.
* **[Contract Evals](references/evals.md)** — Deterministic verification of `plan` and `publish` modes with zero side effects.
