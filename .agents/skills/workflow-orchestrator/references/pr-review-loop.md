# Open PR Audit, `depends_on` PR Gate & Post-PR Review Loop

This reference defines how `@workflow-orchestrator` detects GitHub code review feedback, gates dependent features, and runs the `review-fix` loop (Stage 7). It applies to **both** Standalone Mode (Mode A) and Backlog Queue Mode (Mode B).

> [!IMPORTANT]
> All `gh` and remote `git` commands require network and credentials: run them with `BypassSandbox: true`.

---

## 1. Shared Step 0: Pre-flight Sync & Open PR Audit

Run before any Mode A or Mode B work:

1. **Sync base & prune merged or closed-unmerged branches**:
   - Working tree clean (`git status --porcelain -uno` empty).
   - `git fetch origin develop --prune`, then `git checkout develop && git pull --ff-only origin develop`.
   - Query closed PRs targeting `develop`:
     ```bash
     gh pr list --state closed --base develop --json number,headRefName,mergedAt
     ```
   - **Merged PRs (`mergedAt != null`)**: delete the local `feature/<id>` branch (`git branch -D feature/<id>`).
   - **Closed without Merge (`mergedAt == null` — Cancelled Feature Rollback)**: if a `feature/<id>` branch still exists locally or on `origin` for a PR that was closed without merging, the implementation was rejected/cancelled. Return the repository to the exact pre-feature state:
     1. Delete the local branch (`git branch -D feature/<id>`), delete the remote branch (`git push origin --delete feature/<id>`), and remove any residual `.worktrees/*-<id>` worktrees.
     2. Keep `<id>` as `"status": "not_started"` in `feature_list.json` on `develop` (so it can be redone in the near or distant future without extra commits).
     3. **Do not auto-restart `<id>` blindly**: ask the developer whether to skip `<id>` in this session and continue with the next independent feature in `feature_list.json`, or re-run `<id>` now with new instructions.
2. **List open PRs**:
   ```bash
   gh pr list --state open --base develop --json number,headRefName,reviewDecision,headRefOid
   ```
3. **Compare feedback against the latest branch commit** (`headRefOid` commit date) and thread resolution state for each open PR:
   ```bash
   gh api repos/{owner}/{repo}/pulls/<pr>/reviews     # state, body, submitted_at
   gh api repos/{owner}/{repo}/pulls/<pr>/comments    # path, line, diff_hunk, body, created_at
   gh api repos/{owner}/{repo}/issues/<pr>/comments   # body, created_at
   # Check whether review threads were resolved in the GitHub UI (isResolved: true)
   gh api graphql -f query='query($owner:String!,$name:String!,$pr:Int!){repository(owner:$owner,name:$name){pullRequest(number:$pr){reviewThreads(first:50){nodes{isResolved}}}}}' -F owner='{owner}' -F name='{repo}' -F pr=<pr>
   ```
4. **Classify each open PR**:
   - `pending_pr_review = true` — any unresolved review thread (`isResolved == false`), `COMMENTED` / `CHANGES_REQUESTED` review with unresolved comments, or PR conversation comment is newer than the latest commit. (If all review threads on the PR are marked `isResolved == true` in GitHub, treat as resolved: `pending_pr_review = false`).
   - `awaiting_pr_merge = true` — open PR with no newer unresolved feedback.

### Self-Authored PR Rule
`gh pr create` opens the PR under the developer's own account, so GitHub disables *Approve* and *Request changes*. The developer reviews with inline comments + **`Comment` -> `Submit review`** (`state == "COMMENTED"`). A `COMMENTED` review therefore counts as actionable feedback.

---

## 2. `depends_on` PR Gate

A dependency (direct or transitive) is satisfied only when **all three** hold:

1. `status === "accepted"` in `feature_list.json`.
2. `pending_pr_review == false`.
3. Its PR is **merged into `develop`**.

If any dependency fails the gate:
- **Mode B**: skip the dependent feature and select the next `not_started` feature whose dependencies all pass.
- **Mode A**: block the requested feature from branching off `develop`; offer to run `review-fix` on the dependency first when it has pending feedback.
- **Parallel waves**: only features with fully satisfied dependencies may run concurrently.

### Mode B Selection Priority
1. Features with `pending_pr_review == true` -> `review-fix`.
2. Features in `in_progress` or `passing` -> resume.
3. First `not_started` feature passing the `depends_on` PR gate.

---

## 3. Stage 7: `review-fix` Loop

### Trigger
Detection happens on the **next orchestrator invocation** (*"continue"*, *"review-fix"*, or any new feature request) through Shared Step 0. No GitHub Action or background watcher is required. Feedback passed directly in the prompt is also accepted.

### No Planner Rule
`workflow-planner` is never re-run during code review. The loop is strictly `Implementer -> Validator -> Documenter`, and `spec.md` must remain unchanged. If a comment requires a contract change (new behavior, new acceptance scenario, scope change), stop and escalate to the developer: recommend a new `feature_list.json` entry or an explicit re-plan.

### Execution
1. Check out `feature/<feature-id>` and append `## PR Review Round #N` to `docs/features/<feature-id>/validator/pr-review.md`, grouping findings by `path`, `line`, `diff_hunk`, and reviewer instruction.
2. Set `feature_list.json` status to `"in_progress"` (`repair_attempts = 0`) and commit the brief.
3. Rehydrate `.worktrees/impl-<feature-id>` from the tip of `feature/<feature-id>` (see [Worktree Lifecycle](worktree-lifecycle.md), Step F).
4. Run `workflow-implementer` -> `@compiler` -> `workflow-validator` (APK hydration + emulator pre-install; audits the Round `#N` delta and cumulative diff; `MAX_REPAIR_ATTEMPTS = 2`) -> `workflow-documenter`.
5. Consolidate only the Round `#N` delta via atomic layer commits, `git push origin feature/<feature-id>`, set status back to `"accepted"`, clean worktrees, and return the root workspace to `develop`.

Dependent features stay blocked until the PR has no pending feedback and is merged. Merging is 100% human-owned.
