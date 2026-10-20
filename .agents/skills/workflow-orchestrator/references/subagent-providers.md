# Subagent Providers & Git Worktree Protocol

This reference defines how `workflow-orchestrator` spawns isolated subagents (`workflow-implementer`, `workflow-validator`, `workflow-documenter`) across AI IDE providers while guaranteeing **`git worktree` isolation**, **scoped skills**, **visual color badges**, and **`model: inherit`** compatibility.

---

## 1. Visual Color Identity Table

Every agent must identify itself at the top of its output and `PROGRESS.md` entries using its visual badge:

| Role | Skill | Color | Universal Badge |
| :--- | :--- | :--- | :--- |
| **Orchestrator** | `workflow-orchestrator` | Purple (`purple`) | 🟣 `[ORCHESTRATOR · workflow-orchestrator]` |
| **Planner** | `workflow-feature` | Blue (`blue`) | 🔵 `[PLANNER · workflow-feature]` |
| **Implementer** | `workflow-implementer` | Yellow (`yellow`) | 🟡 `[IMPLEMENTER · workflow-implementer]` |
| **Validator** | `workflow-validator` | Green (`green`) / Red (`red`) | 🟢 `[VALIDATOR · workflow-validator]` *(or 🔴 on `REVISE`/`BLOCK`)* |
| **Documenter** | `workflow-documenter` | Cyan (`cyan`) | 🔷 `[DOCUMENTER · workflow-documenter]` |

---

## 2. Git Worktree Lifecycle & State Handoff

Because Git does not allow two worktrees to check out the exact same branch name simultaneously, and because subagents must operate without interfering with each other's execution context, the orchestrator and subagents follow this exact handoff protocol for `<feature-id>`:

### Step A: Prepare Feature Branch (Orchestrator)
Before spawning subagents, ensure `feature/<feature-id>` exists from `develop` and contains the committed specification `docs/features/<feature-id>/spec.md`:
```bash
git checkout -B feature/<feature-id>
git add docs/features/<feature-id>/ feature_list.json PROGRESS.md
git commit -m "docs(spec): [<feature-id>] add unified feature specification"
```

### Step B: Implementer Worktree (`workflow-implementer`)
Create an isolated worktree on temporary branch `wt/impl-<feature-id>` branched from `feature/<feature-id>`:
```bash
git worktree add -B wt/impl-<feature-id> .worktrees/impl-<feature-id> feature/<feature-id>
```
* Inside `.worktrees/impl-<feature-id>`, the Implementer writes code, runs `@compiler`, updates `feature_list.json` (`passing`) and `PROGRESS.md`, and stages + commits its work to `wt/impl-<feature-id>` (as a temporary worktree checkpoint).

### Step C: Validator Evaluation (`workflow-validator`)
Create an isolated worktree on temporary branch `wt/val-<feature-id>` starting from `wt/impl-<feature-id>`:
```bash
git worktree add -B wt/val-<feature-id> .worktrees/val-<feature-id> wt/impl-<feature-id>
```
* Inside `.worktrees/val-<feature-id>`, the Validator operates as a **strictly read-only evaluator**:
  - Audits the spec contract, diff, test implementations, and recorded compiler evidence.
  - Can rerun focused tests or `@android-cli` if needed for verification, but **never modifies source code or project files**.
  - **Does NOT write files to the repository.** Returns its verdict (`accept`, `revise`, or `block`), findings, and `Implementation Repair Brief` directly in its output summary to `workflow-orchestrator`.
* **Handoff Handling by Orchestrator**:
  - The Orchestrator receives the Validator's summary and persists `docs/features/<feature-id>/validator/validation-report.md`.
  - **If Verdict is `REVISE`**:
    * Remove `.worktrees/val-<feature-id>`.
    * Re-invoke `workflow-implementer` in `.worktrees/impl-<feature-id>`, passing the `Implementation Repair Brief` directly into its prompt.
  - **If Verdict is `ACCEPT`**:
    * Proceed to Step D (`workflow-documenter`).

### Step D: Documenter Worktree (`workflow-documenter`)
Once the Validator returns `ACCEPT`, create an isolated worktree on temporary branch `wt/doc-<feature-id>` starting from `wt/impl-<feature-id>`:
```bash
git worktree add -B wt/doc-<feature-id> .worktrees/doc-<feature-id> wt/impl-<feature-id>
```
* Inside `.worktrees/doc-<feature-id>`, the Documenter adds English KDoc, updates durable Markdown docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `spec.md`), updates `PROGRESS.md`, and commits to `wt/doc-<feature-id>`.

### Step E: Consolidation & Worktree Cleanup (Orchestrator)
Once `workflow-documenter` finishes:
1. Remove the temporary worktree directories:
   ```bash
   git worktree remove .worktrees/impl-<feature-id> --force
   git worktree remove .worktrees/val-<feature-id> --force
   git worktree remove .worktrees/doc-<feature-id> --force
   ```
2. Bring the validated & documented changes onto `feature/<feature-id>` (either via `git merge --squash wt/doc-<feature-id>` followed by `git reset` to stage atomic commits per Clean Architecture layer per `git-governance`, or fast-forward merge).
3. Delete the temporary `wt/*` branches:
   ```bash
   git branch -D wt/impl-<feature-id> wt/val-<feature-id> wt/doc-<feature-id>
   ```

> **Note for `.gitignore` / AI Context Exclusion**: `.worktrees/` must always be ignored by Git (`.gitignore`) so temporary worktree folders are never accidentally tracked.

---

## 3. Provider-Specific Subagent Invocation

### A. Gemini / Google Antigravity
In Antigravity, subagents are defined under `.agents/agents/` and invoked using the native `invoke_subagent` tool:
* **`TypeName`**: `"self"` (or custom subagent defined via `define_subagent`)
* **`Model`**: `"inherit"` (Default — ensures compatibility with the active Gemini model tier without quota or tier errors)
* **`Role`**:
  - `"🟡 Implementer (workflow-implementer)"`
  - `"🟢 Validator (workflow-validator)"` (set `EnableWriteTools: false` if defined via `define_subagent`)
  - `"🔷 Documenter (workflow-documenter)"`
* **`Workspace`**: `"inherit"` when executing inside `.worktrees/<role>-<feature-id>`
* **`Prompt`**: Instruct the subagent to read its corresponding `.agents/agents/workflow-<role>.md` file (materialized by `workflow-initializer`) to acquire its skills and base instructions. Pass dynamic handoff payload (feature ID, worktree path, spec path, and repair brief on revise).

### B. Cursor (`.cursor/agents/`)
Cursor loads subagent definitions from `.cursor/agents/<name>.md` (materialized by `workflow-initializer`):
* `model: inherit`
* For `workflow-validator.md`: `readonly: true` ensures the evaluator cannot modify any files on disk.
* Executes inside the isolated `.worktrees/<role>-<feature-id>` worktree.

### C. Claude Code (`.claude/agents/`)
Claude Code natively loads subagents from `.claude/agents/<name>.md` (materialized by `workflow-initializer`):
* `name`: `workflow-implementer` | `workflow-validator` | `workflow-documenter`
* `model`: `inherit`
* `isolation`: `worktree`
* `color`: `yellow` | `green` | `cyan`
* `skills`: The explicit scoped list of Foundation skills for that specific role.
* For `workflow-validator.md`: `disallowedTools: [Write, Edit]` guarantees strict read-only operation.
