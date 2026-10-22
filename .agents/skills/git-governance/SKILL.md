---
name: git-governance
description: Defines a strict Git Flow branching model, commit conventions, and idempotent GitHub PR delivery with parallel rebase rules for AI agents. Based on the Vincent Driessen branching model.
metadata:
  author: Albert Martorell Garcia
  version: 1.2.0
  keywords:
  - git-flow
  - branching-model
  - commit-conventions
  - devops
  - github-pr
---
# Git Governance Specialist

This skill enforces the **Git Flow** branching model (as described by nvie.com) and deterministic GitHub delivery for all development tasks. It ensures that every code change is properly isolated in the correct branch type, commit messages follow atomic layer-specific Conventional Commits, and GitHub Pull Requests are published with structured evidence without guessing.

## Core Branching Model

Agents must identify the correct parent branch based on the task type and the current state of the repository:

| Branch Type | Parent Branch | Prefix | Description |
| :--- | :--- | :--- | :--- |
| **Feature** | `develop` | `feature/` | New functionality or non-critical improvements. |
| **Bugfix** | *Dynamic* | `bugfix/` | Fixes for existing issues. Parent is `develop`, a `release/` branch, or the specific `feature/` branch where the bug was found. |
| **Hotfix** | `main` | `hotfix/` | Critical fixes for code already in production. |
| **Release** | `develop` | `release/` | Preparation for a new production release. |

## Operational Rules for Agents

1. **Branch Creation & Synchronization**: Before starting a task, the agent must ensure the local repository is synchronized with the remote:
   - **Fetch & Fast-Forward First**: Execute `git fetch origin [parent-branch] --prune` to get the latest changes before branching. Ensure the local parent branch is fast-forwarded: `git checkout [parent-branch] && git pull --ff-only origin [parent-branch]`.
   - **Explicit Base Branching**: Always specify the base branch explicitly (`git checkout -B feature/<feature-id> develop` or `origin/develop`). Never execute `git checkout -B` against an implicit `HEAD`.
   - **Contextual Branch Diagnosis**:
     - For **Hotfixes**: Always branch from `main`.
     - For **Features**: Always branch from `develop`.
     - For **Bugfixes**: Analyze where the code currently resides (feature, release, or develop). Fetch the parent first.
   - **Naming Convention**: Include the Task/Issue ID if available (e.g., `feature/<feature-id>` or `feature/#14-<feature-id>`).

2. **Maintenance (Rebase Policy)**:
   - For complex or long-lived feature branches, the agent must periodically check if the parent branch (e.g., `develop`) has moved ahead.
   - Propose a `git rebase [parent-branch]` to the user to keep the feature branch up-to-date and maintain a linear history.

3. **Commit Policy**:
   - Commits must be **atomic** and **Layer-Specific**. Do not mix changes that affect different Clean Architecture layers (e.g., Domain and Data) in the same commit.
   - Use **Conventional Commits** with **Module Scopes**: `<type>(<module>): [ID] <subject>`.
   - Sequential commits should follow the development flow: Domain -> Data -> UseCases -> UI -> Docs.
   - Example: `feat(data): [catalog-filter] implement firebase remote config source`.
   - Include the Task ID in every commit message.
   - **Automated Staging**: Agents **MUST** perform `git add [file]` immediately after creating or modifying any file.

4. **Staging Verification**:
   - Before completing any task or stage, the agent **MUST execute `git status`** to verify that no new or modified files remain unstaged.

5. **Execution Boundary & Explicit Consent**:
   - **Default Mode (Manual)**: By default, the agent diagnoses branches, stages files (`git add`), and generates Conventional Commit messages. The agent MUST present the proposed `git commit` command and wait for the user to execute it manually.
   - **Override Mode (Autonomous)**: The agent IS AUTHORIZED to execute `git commit`, `git push`, or `git merge` autonomously via shell commands **ONLY IF** the user explicitly commands it (e.g., "commit and push this", "apply git-governance to push", or "publish this PR").
   - Without explicit user authorization in the current prompt, autonomous commits and pushes remain strictly PROHIBITED.

## Workflow Patterns

### ROLE AND GOAL
Act as an expert DevOps and Git Flow Architect. Your goal is to manage repository state, ensuring all changes are committed to the correct branch type with high-quality, professional messages, and published idempotently to GitHub.

---

### PHASE 1: REPOSITORY DIAGNOSIS
Before any code change:
1. Check the current branch (`git branch --show-current`).
2. Verify and fast-forward the base branch (`develop` or `main`) from remote (`git fetch origin [base] --prune && git pull --ff-only origin [base]`).
3. Propose the name of the new branch based on the task type (feature, bugfix, etc.).

---

### PHASE 2: LOCAL EXECUTION
1. Create and switch to the new branch.
2. As the implementation progresses through the layers (Domain -> Data -> UseCase -> UI -> Docs), stage the files (`git add`) for each logical step.
3. Propose atomic, Conventional Commit messages for each stage to the user. Do not execute the commits yourself unless explicit consent was granted.

---

### PHASE 3: REVIEW READY
Once the task is finished:
1. Verify all modified files are staged (`git status`).
2. Provide a summary of the staged changes and the proposed commit commands.
3. **Action based on Consent**: If the user explicitly requested autonomous execution, execute the commit and push operations. Otherwise, wait for the user to manually execute them.

---

### PHASE 4: GITHUB DELIVERY & PULL REQUESTS (`gh` CLI)
Triggered **ONLY** when the user or `@workflow-orchestrator` explicitly requests GitHub delivery or PR publication (`publish` mode). In standard feature development, execution stops at Phase 3 (commits stay local on `feature/<feature-id>`). When authorized:
1. **Idempotent Reuse**: Look up existing issues (`gh issue list`) and PRs (`gh pr list`) before creating any artifact to avoid duplication.
2. **Structured Evidence PR**: Open the PR targeting `base_branch` (`develop`) using the structured evidence schema (`Closes #ID`, architecture layers, `@compiler` verification, and manual test steps).
3. **Parallel Wave Rebase**: If a concurrent PR was merged into `develop`, rebase, reconcile `feature_list.json` / `PROGRESS.md`, verify via `@compiler`, and push with lease protection (`git push --force-with-lease`).
4. **Never Merge**: Autonomous merging (`gh pr merge`) is strictly prohibited. Merging is 100% human-owned.
5. **Return Root to Base**: Immediately check out `base_branch` (`git checkout develop`) after PR publication.

> **See [GitHub Delivery & PR Guidelines](references/github-delivery.md)** for exact lookup commands, the complete PR body template, and parallel wave rebase instructions.

## Documentation & References
- [GitHub Delivery & PR Guidelines](references/github-delivery.md)
- [Branching Conventions](references/conventions.md)
- [Official Git Flow Source](https://nvie.com/posts/a-successful-git-branching-model/)
