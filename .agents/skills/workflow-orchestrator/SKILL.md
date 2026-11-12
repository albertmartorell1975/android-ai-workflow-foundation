---
name: workflow-orchestrator
description: Master multi-agent orchestrator for the Android AI Workflow Foundation. Coordinates feature development in Standalone Feature Mode, Backlog Queue Mode (feature_list.json), and GitHub PR delivery across four operational modes (plan, execute, publish, review-fix), managing hydrated git worktrees and delegating sequentially to workflow-planner (Planner), workflow-implementer, workflow-validator, and workflow-documenter.
metadata:
  author: Albert Martorell Garcia / Antonio Leiva / Nino Ruano
  version: 2.3.0
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

Every agent MUST prefix responses, status updates, and `PROGRESS.md` entries with its badge:
* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`** — Pipeline coordination, worktrees, commits, PRs.
* 🔵 **`[PLANNER · workflow-planner]`** — `docs/features/<feature-id>/spec.md`.
* 🟡 **`[IMPLEMENTER · workflow-implementer]`** — Code, pure JVM tests, `@compiler` evidence.
* 🟢 **`[VALIDATOR · workflow-validator]`** *(🔴 on `revise` / `block`)* — Read-only 4-level audit.
* 🔷 **`[DOCUMENTER · workflow-documenter]`** — English KDoc and durable docs.

## 1. Scope & Git Ownership

- The orchestrator coordinates and commits; it never writes application code, tests, or KDoc while a subagent owns that role.
- **`git-governance` is exclusively owned by the orchestrator**: branch creation from `develop` (`base_sha`), atomic Conventional Commits (`Domain -> Data -> UseCases -> UI -> Docs`), PRs, and parallel wave rebases. Subagents never commit to `feature/<feature-id>`.

## 2. Entry Modes

Both modes start with **Shared Step 0** — base sync, merged-branch pruning, **cancelled-PR rollback** (if a PR was `CLOSED` without merge, delete local and remote `feature/<id>` branches so the repo returns to the pre-feature `not_started` state and ask whether to defer `<id>` to a future run or retry with new guidance), and the open PR audit (`gh pr list` + `gh api`) that flags `pending_pr_review` / `awaiting_pr_merge`. See **[PR Review Loop](references/pr-review-loop.md)**.

- **Mode A — Standalone**: The user requests a concrete feature. Derive a `kebab-case` `<feature-id>`, create or append its entry in `feature_list.json` / `PROGRESS.md` (never overwrite; set `depends_on` if it builds on existing features), ensure `docs/features/<feature-id>/{ui/screens,ui/resources,validator}/`, apply the `depends_on` PR gate, and run the pipeline. If the feature already has an open PR with pending feedback, run `review-fix`.
- **Mode B — Backlog Queue**: Read `AGENTS.md`, `PROGRESS.md`, `CONSTRAINTS.md`, `feature_list.json`. Select in priority order: (1) PRs with pending review -> `review-fix`; (2) `in_progress` / `passing` -> resume; (3) first `not_started` feature passing the `depends_on` PR gate. Parallel waves only for independent, fully satisfied features.

**`depends_on` PR gate**: a dependency counts only if it is `accepted`, has no pending PR feedback, **and** is merged into `develop`.

## 3. Operational Modes

| Mode | Behavior |
| :--- | :--- |
| `plan` | Strictly read-only. Evaluates preconditions (incl. PR status of dependencies) and emits the Output Report. |
| `execute` | Autonomous pipeline to `accepted`, then Stage 6 (push + PR). Never merges. |
| `publish` | PR delivery for an existing `accepted` feature. Never merges. |
| `review-fix` | Stage 7: fetch GitHub review comments, repair, re-validate, push delta. Never merges. |

Details, the 4 deterministic preconditions, and report schema: **[Operational Modes](references/operational-modes.md)**.

## 4. Hard Governance Rules

- **Role-Tuned Models**: `inherit` for Planner and Validator; `flash` for Implementer and Documenter (Antigravity). See **[Subagent Providers](references/subagent-providers.md)**.
- **Bounded Repair Loop**: `MAX_REPAIR_ATTEMPTS = 2`, then the Human Decision Gate (`needs_human_review`).
- **Human Checkpoints**: honor `require_review_after` (`planner` | `implementer` | `validator` | array). See **[Human Checkpoints](references/human-checkpoints.md)**.
- **Hydration**: copy `local.properties` and uncommitted env files into every worktree; transfer APKs and pre-install on an active emulator before the Validator.
- **Push & Never Merge**: push and open PRs only for `accepted` features (`BypassSandbox: true`). Force push, pushing unaccepted code, and `gh pr merge` are prohibited.

## 5. The 7-Stage Feature Pipeline

```text
[1. Planner] 🔵 ──► docs/features/<feature-id>/spec.md (*)
  ▼
[2. Implementer] 🟡 (.worktrees/impl-<id>) ──► code + tests + @compiler (*)
  ▼
[3. Validator] 🟢/🔴 (.worktrees/val-<id>, hydrated APK + emulator)
  ├── REVISE (attempts < 2) ──► back to Stage 2 with Repair Brief
  ├── REVISE (attempts == 2) ─► 🛑 Human Decision Gate
  └── ACCEPT (*) ─────────────► Stage 4
  ▼
[4. Documenter] 🔷 (.worktrees/doc-<id>) ──► KDoc + durable docs + spec.md [x]
  ▼
[5. Consolidation] 🟣 ──► atomic layer commits, status "accepted"
  ▼
[6. PR Delivery] 🟣 ──► push + open PR vs develop -> CI gate
  ▼
[7. review-fix Round #1..#N] ──► gh api comments -> pr-review.md -> Stages 2-5 -> push (no Planner)
  ▼
[🛑 Human Merge]   (* = optional checkpoint via require_review_after)
```

### Stage Rules
1. **Planner (`workflow-planner`)**: Reuse `docs/features/<feature-id>/spec.md` if current; otherwise spawn `workflow-planner` (max 3 Necessary Questions, no executable code). Honor `require_review_after: "planner"` if set.
2. **Implementer (`workflow-implementer`)**: Create `.worktrees/impl-<feature-id>` from `feature/<feature-id>` and hydrate local Android env files (`local.properties`, `.env`, `keystore.properties`, `app/google-services.json`); spawn `workflow-implementer` until `status: passing`. Honor `require_review_after: "implementer"` if set.
3. **Validator (`workflow-validator`)**: Create `.worktrees/val-<feature-id>`, hydrate env files, copy compiled APKs (`app/build/outputs/apk/`) from `.worktrees/impl-<feature-id>`, and pre-install onto active emulator/device; spawn read-only `workflow-validator` and persist `docs/features/<feature-id>/validator/validation-report.md`. `revise` -> repair loop (`< MAX_REPAIR_ATTEMPTS` routes back to Stage 2; `>= MAX_REPAIR_ATTEMPTS` triggers `needs_human_review`); `block` -> stop and report; `accept` -> honor `require_review_after: "validator"` if set, then proceed to Stage 4.
4. **Documenter (`workflow-documenter`)**: Spawn `workflow-documenter` in `.worktrees/doc-<feature-id>` for English KDoc on public classes, durable docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`), and `[x]` items in `spec.md`.
5. **Consolidation (`@git-governance`)**: Merge validated & documented worktree state into `feature/<feature-id>`, clean temporary worktrees and `wt/*` branches, run `./gradlew prepareKotlinBuildScriptModel --build-cache` if build files (`libs.versions.toml`, `*.gradle.kts`) changed, set `feature_list.json` status to `"accepted"`, update `PROGRESS.md`, and create atomic Conventional Commits (`Domain -> Data -> UseCases -> UI -> Docs`). In `execute` mode, proceed immediately to Stage 6.
6. **PR Delivery**: Push `git push -u origin feature/<feature-id>`, verify `gh auth status`, open the structured PR against `develop` (`BypassSandbox: true`), and return root workspace to `develop` (`git checkout develop`). Retry failed sandboxed `git`/`gh` calls with `BypassSandbox: true` before falling back to a browser URL.
7. **review-fix (`review-fix` Mode — Multi-Round)**: Triggered on the next invocation after the developer submits review comments on GitHub. Queries `gh api` (`BypassSandbox: true`), appends `## PR Review Round #N` to `docs/features/<feature-id>/validator/pr-review.md`, resets status to `"in_progress"`, and runs `Implementer -> Validator -> Documenter` only (**never the Planner**, never edits `spec.md`; contract changes are escalated to the developer). Consolidates and pushes the Round `#N` delta. Downstream features with `<feature-id>` in `depends_on` remain blocked until resolved and merged. See **[PR Review Loop](references/pr-review-loop.md)**.

Exact shell commands for every stage: **[Git Worktree Lifecycle](references/worktree-lifecycle.md)**.

## 6. Output Report & References

Every run ends with the standardized report (`feature`, `session`, `branch`, `status`, `commit`, `evidence`, `pr`).

* **[Operational Modes & Output Report](references/operational-modes.md)**
* **[PR Review Loop & `depends_on` Gate](references/pr-review-loop.md)**
* **[Human Checkpoints & Decision Gate](references/human-checkpoints.md)**
* **[Git Worktree Lifecycle](references/worktree-lifecycle.md)**
* **[Subagent Providers & Model Tiers](references/subagent-providers.md)**
* **[Contract Evals](references/evals.md)**
