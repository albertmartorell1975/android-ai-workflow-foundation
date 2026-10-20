# GitHub Delivery, PR Guidelines & Parallel Wave Rebase

This document defines the deterministic GitHub integration rules for `@git-governance` when publishing feature branches to GitHub as Pull Requests.

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
  - Lookup: `gh pr list --state all --head "feature/<feature-id>" --base <base_branch>`
  - Reuse if found; create only when `publish` mode is authorized and no open PR exists.

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
