# Subagent Providers & Git Worktree Protocol

This reference defines how `workflow-orchestrator` spawns isolated subagents (`workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`) across AI IDE providers while guaranteeing **`git worktree` isolation**, **scoped skills**, **visual color badges**, and **role-tuned model tier assignment**.

---

## 1. Visual Badges & Worktree Isolation

Every agent in the pipeline identifies itself with its canonical color badge (see Visual Identity Protocol in `workflow-orchestrator/SKILL.md`):
* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`**
* 🔵 **`[PLANNER · workflow-planner]`**
* 🟡 **`[IMPLEMENTER · workflow-implementer]`**
* 🟢/🔴 **`[VALIDATOR · workflow-validator]`**
* 🔷 **`[DOCUMENTER · workflow-documenter]`**

**Isolation Principle**: Each subagent (`implementer`, `validator`, `documenter`) executes exclusively in its dedicated `git worktree`. Subagents never commit directly to `feature/<feature-id>`; they commit only to temporary `wt/*` branches. Only `workflow-orchestrator` merges the finalized work and creates atomic Conventional Commits via `@git-governance`.

---

## 2. Git Worktree Lifecycle & State Handoff

Because Git does not allow two worktrees to check out the exact same branch name simultaneously, and because subagents must operate without interfering with each other's execution context, the orchestrator and subagents follow this exact handoff protocol for `<feature-id>`:

### Step A: Prepare Feature Branch (Orchestrator)
Before spawning subagents, ensure `develop` is synchronized, explicit base branching is enforced, and `docs/features/<feature-id>/spec.md` is committed:

#### 1. Sequential Mode (Root Workspace on Feature Branch)
```bash
# Sync base branch first
git fetch origin develop --prune
git checkout develop
git pull --ff-only origin develop

# Explicitly branch from develop (NEVER git checkout -B without start-point!)
git checkout -B feature/<feature-id> develop
git add docs/features/<feature-id>/ feature_list.json PROGRESS.md
git commit -m "docs(spec): [<feature-id>] add unified feature specification"
```

#### 2. Parallel Wave Mode (Root Workspace Stays on `develop`)
When running parallel wave features, the root workspace stays on `develop` to prevent branch collisions. Each parallel feature is instantiated in its own isolated worktree directly from `origin/develop`:
```bash
git fetch origin develop --prune
git worktree add -B feature/<feature-id> .worktrees/<feature-id> origin/develop
```

### Step B: Implementer Worktree (`workflow-implementer`) & Android Environment Hydration
Create an isolated worktree on temporary branch `wt/impl-<feature-id>` branched from `feature/<feature-id>`:
```bash
git worktree add -B wt/impl-<feature-id> .worktrees/impl-<feature-id> feature/<feature-id>
```

#### 🛡 Android Environment Hydration (Crucial)
Git worktrees only check out tracked files. Git-ignored files containing local SDK paths, build environment properties, or local credentials do not travel with the worktree. Immediately after creating any worktree, hydrate it from the repository root:
```bash
# Bash / macOS / Linux
cp -n local.properties .worktrees/impl-<feature-id>/ 2>/dev/null || true
cp -n .env .worktrees/impl-<feature-id>/ 2>/dev/null || true
cp -n keystore.properties .worktrees/impl-<feature-id>/ 2>/dev/null || true
if [ -f app/google-services.json ]; then
  mkdir -p .worktrees/impl-<feature-id>/app
  cp -n app/google-services.json .worktrees/impl-<feature-id>/app/ 2>/dev/null || true
fi

# PowerShell / Windows
if (Test-Path "local.properties") { Copy-Item "local.properties" ".worktrees/impl-<feature-id>/" -Force }
if (Test-Path ".env") { Copy-Item ".env" ".worktrees/impl-<feature-id>/" -Force }
if (Test-Path "keystore.properties") { Copy-Item "keystore.properties" ".worktrees/impl-<feature-id>/" -Force }
if (Test-Path "app/google-services.json") {
  New-Item -ItemType Directory -Path ".worktrees/impl-<feature-id>/app" -Force | Out-Null
  Copy-Item "app/google-services.json" ".worktrees/impl-<feature-id>/app/" -Force
}
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
* **Handoff & Worktree State Transitions**:
  - Persist report: Orchestrator saves `docs/features/<feature-id>/validator/validation-report.md`.
  - Always clean up validator worktree:
    ```bash
    git worktree remove .worktrees/val-<feature-id> --force
    # Physical cleanup of untracked build artifacts (e.g., .gradle/ daemon caches)
    # Bash / macOS / Linux:
    rm -rf .worktrees/val-<feature-id> 2>/dev/null || true
    # PowerShell / Windows:
    Remove-Item -Path ".worktrees/val-<feature-id>" -Recurse -Force -ErrorAction SilentlyContinue
    ```
  - **Verdict `ACCEPT`**: Proceed directly to Step D (`workflow-documenter`).
  - **Verdict `REVISE` (Within limit: `repair_attempts < MAX_REPAIR_ATTEMPTS`)**:
    * Re-invoke `workflow-implementer` in existing worktree `.worktrees/impl-<feature-id>` with the repair brief.
  - **Verdict `REVISE` (Limit reached: `needs_human_review`)**:
    * **Preserve Worktree**: Keep `.worktrees/impl-<feature-id>` intact (do **NOT** delete or reset) while awaiting user direction.
    * **Worktree Handling per Decision**:
      - *1. Override (`accept`)*: Leave worktree as is -> proceed directly to Step D (`workflow-documenter`).
      - *2. Human Hint (`hint`)*: Re-run implementer in `.worktrees/impl-<feature-id>` with the developer's guidance -> re-run validator.
      - *3. Re-plan (`replan`)*: Update `spec.md` on base feature branch; reset `.worktrees/impl-<feature-id>` to new spec state.
      - *4. Cancel (`cancel`)*: Remove worktree (`git worktree remove .worktrees/impl-<feature-id> --force`), delete `wt/*` branches, leaving `develop` untouched.
  - **Verdict `BLOCK`**: Clean up temporary worktrees and set status to `"blocked"`.

### Step D: Documenter Worktree (`workflow-documenter`)
Once the Validator returns `ACCEPT`, create an isolated worktree on temporary branch `wt/doc-<feature-id>` starting from `wt/impl-<feature-id>`:
```bash
git worktree add -B wt/doc-<feature-id> .worktrees/doc-<feature-id> wt/impl-<feature-id>
```
* Inside `.worktrees/doc-<feature-id>`, the Documenter adds English KDoc, updates durable Markdown docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `spec.md`), updates `PROGRESS.md`, and commits to `wt/doc-<feature-id>`.

### Step E: Consolidation & Worktree Cleanup (Orchestrator)
Once `workflow-documenter` finishes:
1. Remove the temporary worktrees and purge untracked build caches (e.g., `.gradle/` daemon caches):
   ```bash
   # Remove git worktrees
   git worktree remove .worktrees/impl-<feature-id> --force
   git worktree remove .worktrees/val-<feature-id> --force 2>/dev/null || true
   git worktree remove .worktrees/doc-<feature-id> --force

   # Physical cleanup of untracked build artifacts / daemon caches
   # Bash / macOS / Linux:
   rm -rf .worktrees/impl-<feature-id> .worktrees/val-<feature-id> .worktrees/doc-<feature-id>
   rmdir .worktrees 2>/dev/null || true

   # PowerShell / Windows:
   Remove-Item -Path ".worktrees/impl-<feature-id>", ".worktrees/val-<feature-id>", ".worktrees/doc-<feature-id>" -Recurse -Force -ErrorAction SilentlyContinue
   if ((Test-Path ".worktrees") -and ((Get-ChildItem ".worktrees" -Force | Measure-Object).Count -eq 0)) { Remove-Item ".worktrees" -Force }
   ```
2. Bring the validated & documented changes onto `feature/<feature-id>` (either via `git merge --squash wt/doc-<feature-id>` followed by `git reset` to stage atomic commits per Clean Architecture layer per `git-governance`, or fast-forward merge).
3. **Root Workspace Gradle Sync (Build Files Detection)**:
   If the consolidated changes touch build configuration files (e.g., `gradle/libs.versions.toml`, `settings.gradle.kts`, or any module's `build.gradle.kts`), immediately trigger the canonical model preparation on the root workspace:
   ```bash
   ./gradlew prepareKotlinBuildScriptModel --build-cache
   ```
   This synchronizes dependencies and IDE build models in the root project so the active workspace stays consistent with the changes made in the worktrees. Remind the user in the handoff summary to tap "Sync Now" if Android Studio displays its external modification banner.
4. Delete the temporary `wt/*` branches:
   ```bash
   git branch -D wt/impl-<feature-id> wt/val-<feature-id> wt/doc-<feature-id>
   ```

> **Note for `.gitignore` / AI Context Exclusion**: `.worktrees/` must always be ignored by Git (`.gitignore`) so temporary worktree folders are never accidentally tracked.

---

## 3. Provider-Specific Subagent Invocation & Model Tier Matrix

Each subagent is configured with a role-tuned model tier matching its cognitive requirements:

| Subagent Role | Antigravity / Gemini | Claude Code | Cursor |
| :--- | :--- | :--- | :--- |
| 🔵 **`workflow-planner`** | `inherit` | `opus` | `inherit` |
| 🟡 **`workflow-implementer`** | `flash` | `sonnet` | `fast` |
| 🟢 **`workflow-validator`** | `inherit` | `opus` | `inherit` |
| 🔷 **`workflow-documenter`** | `flash` | `haiku` | `fast` |

### A. Gemini / Google Antigravity
In Antigravity, subagents are defined under `.agents/agents/` and invoked using the native `invoke_subagent` tool:
* **`TypeName`**:
  - Use `"self"` for write-capable subagents (`workflow-planner`, `workflow-implementer`, `workflow-documenter`) so they receive full file-editing and terminal execution tools in their worktree.
  - Use `"workflow-validator"` (or custom read-only subagent with `EnableWriteTools: false`) for `workflow-validator` so it remains strictly read-only.
* **`Model`**:
  - `"inherit"` for `workflow-planner` and `workflow-validator` (inherits active UI model, e.g. Gemini 4 Argon, for deep architectural reasoning and independent 4-level audit without requiring manual model dropdown switching).
  - `"flash"` for `workflow-implementer` and `workflow-documenter` (fast deterministic code/test generation and KDoc/Markdown synthesis).
* **`Role`**:
  - `"🔵 Planner (workflow-planner)"`
  - `"🟡 Implementer (workflow-implementer)"`
  - `"🟢 Validator (workflow-validator)"` (set `EnableWriteTools: false` if defined via `define_subagent`)
  - `"🔷 Documenter (workflow-documenter)"`
* **`Workspace`**: `"inherit"`
* **`Prompt`**: Instruct the subagent to read its corresponding `.agents/agents/workflow-<role>.md` file (materialized by `workflow-initializer`) to acquire its skills, scope boundaries, and base instructions. Pass dynamic handoff payload (feature ID, spec path, repair brief on revise, or target questions).

### B. Cursor (`.cursor/agents/`)
Cursor loads subagent definitions from `.cursor/agents/<name>.md` (materialized by `workflow-initializer`):
* `model`: `inherit` for `workflow-planner` and `workflow-validator`; `fast` for `workflow-implementer` and `workflow-documenter`.
* Roles: `workflow-planner.md`, `workflow-implementer.md`, `workflow-validator.md`, `workflow-documenter.md`.
* For `workflow-validator.md`: `readonly: true` ensures the evaluator cannot modify any files on disk.
* For `workflow-planner.md`: writes strictly to `docs/features/<feature-id>/spec.md`, `feature_list.json`, and `PROGRESS.md`.
* Executes inside the workspace or isolated `.worktrees/<role>-<feature-id>` worktree.

### C. Claude Code (`.claude/agents/`)
Claude Code natively loads subagents from `.claude/agents/<name>.md` (materialized by `workflow-initializer`):
* `name`: `workflow-planner` | `workflow-implementer` | `workflow-validator` | `workflow-documenter`
* `model`: `opus` for `workflow-planner` and `workflow-validator`; `sonnet` for `workflow-implementer`; `haiku` for `workflow-documenter`.
* `isolation`: `worktree` (for implementer, validator, documenter)
* `color`: `blue` | `yellow` | `green` | `cyan`
* `skills`: The explicit scoped list of Foundation skills for that specific role.
* For `workflow-planner.md`: restricted to planning and specification authoring without modifying executable code.
* For `workflow-validator.md`: `disallowedTools: [Write, Edit]` guarantees strict read-only operation.
