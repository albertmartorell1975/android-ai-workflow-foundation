# GitHub Delivery, PR Guidelines & Parallel Wave Rebase

This document defines the deterministic GitHub integration rules for `@git-governance` when publishing feature branches to GitHub as Pull Requests.

> [!IMPORTANT]
> **Sandbox Boundary & Network Mandate**: All GitHub CLI (`gh`) and remote Git commands (`push`, `fetch`) require network access and OS keychain credentials and **MUST be executed outside the sandbox (`BypassSandbox: true`)**.
> If any command fails due to network isolation or unauthenticated status inside the sandbox, **immediately retry with `BypassSandbox: true`** before falling back to manual browser URLs.

## 1. Deterministic Identities & Idempotent Reuse Lookups (Read-Only)

Before creating any GitHub artifact, the agent MUST run read-only lookups to prevent duplicates:

- **Issue**:
  - Format: `[<feature-id>] <feature title from feature_list.json>`
  - Lookup: `gh issue list --state all --search "[<feature-id>] in:title"`
  - Reuse if found; create with `gh issue create` only if absent.
- **Branch**:
  - Format: `feature/<feature-id>` (or `feature/#<issue-id>-<feature-id>`)
  - Lookup: `git branch --list "feature/<feature-id>"`
  - Must branch from a common `base_sha = $(git rev-parse origin/<base_branch>)` (default base: `develop`).
- **Pull Request**:
  - Head: `feature/<feature-id>` targeting `base_branch` (`develop`).
  - Title: `[<feature-id>] <feature title>`
  - Lookup: `gh pr list --state open --head "feature/<feature-id>" --base <base_branch>`
  - Reuse if an open PR is found; create with `gh pr create` when `publish` mode is authorized and no open PR exists (never reuse a `CLOSED` unmerged PR).

---

## 2. Structured PR Body Template ("A PR is reviewed without guessing")

Every PR MUST be opened using a structured evidence body (`--body-file` or inline) following this exact schema:

```markdown
## Context & Issue
- Closes #[issue-number]
- Feature Specification: `docs/features/<feature-id>/spec.md`
- Status: Accepted by Independent Validator

## Architecture & Layer Scope
- **Domain**: [Entities, Value Objects, Domain Errors, Repository Interfaces]
- **Data**: [Repository Implementations, Data Sources, Mappers, DTOs]
- **Use Cases**: [Single-responsibility Interactors]
- **UI / Presentation**: [ViewModels, Jetpack Compose Screens, Navigation3 Scenes]

## Verification & Acceptance Evidence
- **Local Quality Gate**: Passed canonical `@compiler` check (`./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache`).
- **Validation Report**: `docs/features/<feature-id>/validator/validation-report.md`
- **Compose UI / Unit Tests**: [Number of tests passed, e.g., 28 unit tests, 4 screenshot/UI tests]

## How to Test Manually
1. [Step 1 to navigate to the feature]
2. [Step 2 to verify UI interaction / state]
```

---

## 3. Parallel Wave Reconciliation (`Rebase + @compiler Gate`)

When multiple features execute concurrently in parallel worktrees branching from the same `base_sha`, they both update `feature_list.json` and `PROGRESS.md`:

1. When **PR 1** is merged into `develop` by the human reviewer, **PR 2** will have merge conflicts on `feature_list.json` and `PROGRESS.md`.
2. The agent reconciles PR 2 deterministically:
   - Run `git fetch origin develop && git rebase origin/develop`.
   - Resolve conflicts in `feature_list.json` (preserve BOTH feature entries with status `"accepted"`) and `PROGRESS.md` (keep session entries from both).
   - Re-run the canonical `@compiler` gate command:
     ```bash
     ./gradlew testDebugUnitTest lintDebug --parallel --build-cache --configuration-cache
     ```
   - Only when `exit_code == 0`, update the remote PR branch with lease protection:
     ```bash
     git push --force-with-lease
     ```
   - CI in `.github/workflows/gate.yml` will automatically re-verify the rebased commits on GitHub Actions.

---

## 4. Never Merge Rule ("A deny is never ignored")

- The agent **MUST NEVER** execute `gh pr merge` or enable auto-merge.
- Merging to `develop` or `main` is strictly reserved for the human engineer after reviewing the diff, PR evidence, and green CI status.

---

## 5. Post-Merge Base Synchronization, PR Review Inspection & Local Branch Pruning

Once a PR is merged into `develop` by the human reviewer on GitHub (or upon starting the next feature/wave in `@workflow-orchestrator`):

1. **Synchronize Base**:
   ```bash
   git fetch origin develop --prune
   git checkout develop
   git pull --ff-only origin develop
   ```
2. **Prune Merged or Cancelled-PR Branches**:
   Inspect closed PRs (`gh pr list --state closed --base develop --json number,headRefName,mergedAt`):
   - **Merged PRs (`mergedAt != null`)**: remove merged local feature branches (`git branch -D feature/<old-feature-id>`).
   - **Closed without Merge (`mergedAt == null` — Cancelled Feature Rollback)**: if a PR for `feature/<feature-id>` was closed without merging, delete both the local branch (`git branch -D feature/<feature-id>`) and the remote branch (`git push origin --delete feature/<feature-id>`), leaving `<feature-id>` in `status: "not_started"` on `develop` (exact pre-feature state) so it can be redone in a future session without branch collisions. Do not auto-restart it blindly in the same turn; ask the user whether to defer it and continue with an independent feature or retry with new instructions.
3. **Inspect Open PRs for Pending Review Comments (`review-fix` Auto-Detection & `depends_on` Gate)**:
   Before selecting the next feature from `feature_list.json`, inspect all open PRs targeting `develop` (`BypassSandbox: true`):
   ```bash
   gh pr list --state open --base develop --json number,headRefName,reviewDecision,headRefOid
   ```
   For each open PR (`feature/<feature-id>`), fetch reviews, inline code comments, general PR comments, and GraphQL thread resolution (`isResolved`) created after the latest commit on `feature/<feature-id>`:
   ```bash
   gh api repos/{owner}/{repo}/pulls/<pr-number>/reviews
   gh api repos/{owner}/{repo}/pulls/<pr-number>/comments
   gh api repos/{owner}/{repo}/issues/<pr-number>/comments
   ```
   - **Self-Authored PR Review Detection (`Comment -> Submit review`) & Resolved Thread Filtering**: Because `gh pr create` uses the developer's own GitHub account, GitHub greys out *Request changes* on self-authored PRs and the developer submits reviews using **`Comment`** (`state == "COMMENTED"`). Any unresolved review submission (`COMMENTED` or `CHANGES_REQUESTED`), unresolved inline diff comment (`isResolved == false`), or general PR comment created after the latest commit timestamp on `feature/<feature-id>` sets `pending_pr_review = true`, extracts each comment (`path`, `line`, `diff_hunk`, `body`) into `docs/features/<feature-id>/validator/pr-review.md` (`## PR Review Round #N`), and triggers the `review-fix` loop. If all review threads are marked resolved (`isResolved == true`), `pending_pr_review` is `false`.
   - **Strict `depends_on` PR Gate**: Any downstream feature in `feature_list.json` that depends (directly or transitively via `depends_on`) on a feature with pending PR review comments or an unmerged open PR MUST be skipped/blocked until that PR is resolved and merged into `develop`. Independent features with no dependency on the open PR may proceed normally.
