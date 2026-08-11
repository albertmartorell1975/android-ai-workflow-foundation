---
name: git-governance
description: Defines a strict Git Flow branching model and commit conventions for AI agents. Based on the Vincent Driessen branching model.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords:
  - git-flow
  - branching-model
  - commit-conventions
  - devops
---
# Git Governance Specialist

This skill enforces the **Git Flow** branching model (as described by nvie.com) for all development tasks. It ensures that every code change is properly isolated in the correct branch type and that commit messages follow a consistent, descriptive pattern.

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
   - **Fetch First**: Execute `git fetch origin [parent-branch]` to get the latest changes before branching.
   - **Contextual Branch Diagnosis**:
     - For **Hotfixes**: Always branch from `main`.
     - For **Features**: Always branch from `develop`.
     - For **Bugfixes**: Analyze where the code currently resides (feature, release, or develop). Fetch the parent first.
   - **Naming Convention**: Include the Task/Issue ID if available (e.g., `feature/MM-123-description`).

2. **Maintenance (Rebase Policy)**:
   - For complex or long-lived feature branches, the agent must periodically check if the parent branch (e.g., `develop`) has moved ahead.
   - Propose a `git rebase [parent-branch]` to the user to keep the feature branch up-to-date and maintain a linear history.

3. **Commit Policy**:
   - Commits must be **atomic** and **Layer-Specific**. Do not mix changes that affect different Clean Architecture layers (e.g., Domain and Data) in the same commit.
   - Use **Conventional Commits** with **Module Scopes**: `<type>(<module>): [ID] <subject>`.
   - Sequential commits should follow the development flow: Domain -> Data -> UseCases -> UI.
   - Example: `feat(data): [MM-123] implement firebase remote config source`.
   - Include the Task ID in every commit message.
   - **Automated Staging**: Agents **MUST** perform `git add [file]` immediately after creating or modifying any file.

4. **Staging Verification**:
   - Before completing any task or stage, the agent **MUST execute `git status`** to verify that no new or modified files remain unstaged.

5. **Push, Merge & Commit Restriction**:
   - **PROHIBITED**: Agents are NOT allowed to `git commit`, `git push`, or `git merge` autonomously.
   - **Review Protocol**: The agent must prepare the changes, notify the user, and **wait for the user to perform the commit manually** through the IDE or terminal. This ensures the user can review every file modification before it is recorded in the history.

## Workflow Patterns

### ROLE AND GOAL
Act as an expert DevOps and Git Flow Architect. Your goal is to manage the local Git repository state, ensuring all changes are committed to the correct branch type with high-quality, professional messages.

---

### PHASE 1: REPOSITORY DIAGNOSIS
Before any code change:
1. Check the current branch (`git branch --show-current`).
2. Verify the base branch (`develop` or `main`) is up to date.
3. Propose the name of the new branch based on the task type (feature, bugfix, etc.).

---

### PHASE 2: LOCAL EXECUTION
1. Create and switch to the new branch.
2. Perform atomic commits as the implementation progresses through the layers (Domain -> Data -> UseCase -> UI).
3. Ensure every commit message is technical and descriptive.

---

### PHASE 3: REVIEW READY
Once the task is finished:
1. Provide a summary of all local commits made.
2. Inform the user that the branch is ready for review, push, and merge.

## Documentation & References
- [Branching Conventions](references/conventions.md)
- [Official Git Flow Source](https://nvie.com/posts/a-successful-git-branching-model/)
