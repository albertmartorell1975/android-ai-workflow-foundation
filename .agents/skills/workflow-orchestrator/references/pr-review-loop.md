# Open PR Audit, `depends_on` PR Gate & Post-PR Review Loop

This reference defines how `@workflow-orchestrator` detects GitHub code review feedback, gates dependent features, and runs the `review-fix` loop (Stage 7). It applies to **both** Standalone Mode (Mode A) and Backlog Queue Mode (Mode B).

> [!IMPORTANT]
> All `gh` and remote `git` commands require network and credentials: run them with `BypassSandbox: true`.

---

## 1. Shared Step 0: Pre-flight Sync & Open PR Audit

Run before any Mode A or Mode B work:

1. **Sync base & prune merged branches**:
   - Working tree clean (`git status --porcelain -uno` empty).
   - `git fetch origin develop --prune`, then `git checkout develop && git pull --ff-only origin develop`.
   - Delete local `feature/*` branches whose PR is `MERGED` (`git branch -D feature/<old-feature-id>`).
2. **List open PRs**:
   ```bash
   gh pr list --state open --base develop --json number,headRefName,reviewDecision,headRefOid
   ```
3. **Compare feedback against the latest branch commit** (`headRefOid` commit date) for each open PR:
   ```bash
   gh api repos/{owner}/{repo}/pulls/<pr>/reviews     # state, body, submitted_at
   gh api repos/{owner}/{repo}/pulls/<pr>/comments    # path, line, diff_hunk, body, created_at
   gh api repos/{owner}/{repo}/issues/<pr>/comments   # body, created_at
   ```
4. **Classify each open PR**:
   - `pending_pr_review = true` — any review (`COMMENTED` or `CHANGES_REQUESTED`), inline diff comment, or PR conversation comment is newer than the latest commit.
   - `awaiting_pr_merge = true` — open PR with no newer feedback.

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
