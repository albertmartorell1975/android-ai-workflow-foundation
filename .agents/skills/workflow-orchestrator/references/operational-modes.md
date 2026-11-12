# Operational Modes & Standardized Output Report

This document defines the 4 execution modes, precondition gates, and report schemas for `@workflow-orchestrator`.

## 1. Four Operational Modes (`plan` | `execute` | `publish` | `review-fix`)

When managing backlog features, delivering to GitHub, or resolving PR code reviews, `@workflow-orchestrator` operates in one of four deterministic modes:

### Mode: `plan` (planificar) — Strictly Read-Only
Produces the diagnostic execution plan report with zero mutations:
1. **Zero Side Effects**: Must not mutate git, GitHub, or local files. Strictly prohibits `git fetch`, `git push`, `git commit`, `git checkout`, `git stash`, `git worktree add`, or `gh issue/pr` mutations.
2. **Deterministic Inputs**: Resolves `feature_ids`, `base_branch` (default `develop`), and inspects `feature_list.json`, `PROGRESS.md`, `git status --porcelain -uno`, `git worktree list`, and `gh` status read-only.
3. **Precondition Evaluation**: Checks dependencies, clean base, permissions, and hydration targets.
4. **Output Report**: Emits the structured report with `status: planned` or `blocked` and `pr: none`.

### Mode: `execute` (executar) — Autonomous Local Pipeline
Executes the feature pipeline through all roles until locally accepted:
1. **Precondition Gate**: Must pass all 4 preconditions before mutating state.
2. **Pre-flight Base Synchronization**:
   - Executes `git fetch origin <base_branch> --prune`.
   - Sequential execution: executes `git checkout <base_branch> && git pull --ff-only origin <base_branch>`.
   - Parallel wave execution (root workspace stays on base): advances local ref via `git fetch origin <base_branch>:<base_branch>`.
   - Detects local `feature/*` branches whose PRs are already merged and removes them (`git branch -D feature/<old-id>`).
3. **Common Base SHA**: Fixes `base_sha = $(git rev-parse origin/<base_branch>)`. All concurrent worktrees branch from this exact commit.
4. **GitHub Issue Sync**: Reuses existing issue or creates `[<feature-id>] <title>`.
5. **Pipeline Execution**: Spawns hydrated worktree (`.worktrees/impl-<id>`) and runs the 5-stage loop (`workflow-planner -> workflow-implementer -> workflow-validator -> workflow-documenter -> Stage 5 local atomic commits`), honoring any `require_review_after` human checkpoints configured in `feature_list.json` (or requested via prompt) before proceeding to subsequent stages.
6. **Issue Evidence & CI Delivery**: Updates the issue body with verification evidence. Automatically executes clean push `git push -u origin feature/<feature-id>` and opens the structured evidence PR targeting `base_branch` (`develop`) with `BypassSandbox: true` so that GitHub Actions CI runs immediately (if any `git push` or `gh` command fails in the sandbox, retry immediately with `BypassSandbox: true` before falling back to a manual browser URL). Returns root workspace to `base_branch`. Merging is 100% human-owned.

### Mode: `publish` (publicar) — GitHub PR Delivery
Pushes validated commits and opens a Pull Request:
1. **Acceptance Gate**: Requires `status === "accepted"` in `feature_list.json` and existing `validation-report.md`. Status `"passing"` is strictly refused.
2. **Push Gate**: Requires explicit push permission granted by the user in the current run (default is denied).
3. **PR Publication**: Runs `git push -u origin feature/<feature-id>`, reuses or creates the PR targeting `base_branch` (`develop`), and formats the body with structured evidence per `@git-governance` using `BypassSandbox: true` (always retry with `BypassSandbox: true` if sandboxed network/credential access fails before falling back to a manual browser URL).
4. **Never Merge**: Autonomous merging (`gh pr merge`) is strictly prohibited.
5. **Return Root Workspace to Base**: Immediately switches root workspace back to `<base_branch>` (`git checkout <base_branch>`).

### Mode: `review-fix` (revisar-corregir) — Post-PR Review Feedback Loop (Multi-Round)
Processes developer review comments on an open Pull Request across 1 or $N$ rounds without polluting the root workspace:
1. **Target Check**: `feature/<feature-id>` exists and has an open PR targeting `base_branch` (`develop`).
2. **Feedback Extraction**: Fetch reviews, inline diff comments, and PR conversation comments newer than the latest branch commit via `gh api` (self-authored `COMMENTED` reviews count).
3. **Repair Round (No Planner)**: Persist `## PR Review Round #N` in `pr-review.md`, rehydrate the implementer worktree, run `Implementer -> Validator -> Documenter`, push the delta, and restore `accepted`. Contract changes to `spec.md` are escalated, never applied.

Full procedure, `gh api` endpoints, and the self-authored PR rule: **[PR Review Loop](pr-review-loop.md)**.

---

## 2. Four Deterministic Preconditions

Checked before `execute` or `publish` is allowed to mutate anything (`plan` evaluates these read-only):

1. **Dependencies Accepted, PR-Clean & Merged**: Every direct and transitive `depends_on` id is `accepted`, has no pending PR feedback (`pending_pr_review == false`), and its PR is merged into `base_branch`. Otherwise the dependent feature is blocked/skipped (see [PR Review Loop](pr-review-loop.md), Section 2).
2. **Clean Base**: `git status --porcelain -uno` returns empty `""`, no merge or rebase in progress, and `base_branch` is fetched and fast-forwarded to match `origin/<base_branch>`.
3. **Permissions**: `gh auth status` succeeds when targeting GitHub. Push permission is granted for `accepted` feature branches; merging is strictly prohibited.
4. **Independent Hydrated Environments**: One worktree per feature, hydrated with `local.properties` (with `sdk.dir`), `.env`, and uncommitted properties.

---

## 3. Standardized Output Report

Header: mode, repository, base branch, base SHA, push permission (granted/denied), reused vs created artifacts.

Per feature, report:
- `feature`: feature id.
- `session`: provider session command (e.g., `gemini`, `claude`, `opencode run --dir <worktree>`) or `none` in plan mode.
- `branch`: `feature/<id> @ <base_sha>`.
- `status`: `blocked`, `planned`, `in_progress`, `passing`, `accepted`, `published`, `refused`.
- `commit`: atomic commit hashes or `none`.
- `evidence`: validation summary and test counts.
- `pr`: PR URL when published/existing, otherwise `none`.
