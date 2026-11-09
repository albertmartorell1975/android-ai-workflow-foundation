# Git Worktree Lifecycle & State Handoff (`workflow-orchestrator`)

Because Git does not allow two worktrees to check out the exact same branch name simultaneously, and because subagents must operate without interfering with each other's execution context, the orchestrator and subagents follow this exact handoff protocol for `<feature-id>`:

---

## 1. Step A: Prepare Feature Branch (Orchestrator)
Before spawning subagents, ensure `develop` is synchronized, explicit base branching is enforced, and `docs/features/<feature-id>/spec.md` is committed:

### 1. Sequential Mode (Root Workspace on Feature Branch)
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

### 2. Parallel Wave Mode (Root Workspace Stays on `develop`)
When running parallel wave features, the root workspace stays on `develop` to prevent branch collisions. Each parallel feature is instantiated in its own isolated worktree directly from `origin/develop`:
```bash
git fetch origin develop --prune
git worktree add -B feature/<feature-id> .worktrees/<feature-id> origin/develop
```

---

## 2. Step B: Implementer Worktree (`workflow-implementer`) & Android Hydration
Create an isolated worktree on temporary branch `wt/impl-<feature-id>` branched from `feature/<feature-id>`:
```bash
git worktree add -B wt/impl-<feature-id> .worktrees/impl-<feature-id> feature/<feature-id>
```

### 🛡 Android Environment Hydration (Reusable for `impl` & `val` Worktrees)
Git worktrees only check out tracked files. Git-ignored files containing local SDK paths, build environment properties, or local credentials do not travel with the worktree. Immediately after creating `.worktrees/impl-<feature-id>` (or `.worktrees/val-<feature-id>` in Step C), hydrate it from the repository root (`<wt>` = `impl-<feature-id>` or `val-<feature-id>`):
```bash
# Bash / macOS / Linux
cp -n local.properties .worktrees/<wt>/ 2>/dev/null || true
cp -n .env .worktrees/<wt>/ 2>/dev/null || true
cp -n keystore.properties .worktrees/<wt>/ 2>/dev/null || true
if [ -f app/google-services.json ]; then
  mkdir -p .worktrees/<wt>/app
  cp -n app/google-services.json .worktrees/<wt>/app/ 2>/dev/null || true
fi

# PowerShell / Windows
if (Test-Path "local.properties") { Copy-Item "local.properties" ".worktrees/<wt>/" -Force }
if (Test-Path ".env") { Copy-Item ".env" ".worktrees/<wt>/" -Force }
if (Test-Path "keystore.properties") { Copy-Item "keystore.properties" ".worktrees/<wt>/" -Force }
if (Test-Path "app/google-services.json") {
  New-Item -ItemType Directory -Path ".worktrees/<wt>/app" -Force | Out-Null
  Copy-Item "app/google-services.json" ".worktrees/<wt>/app/" -Force
}
```
* Inside `.worktrees/impl-<feature-id>`, the Implementer writes code, runs `@compiler`, updates `feature_list.json` (`passing`) and `PROGRESS.md`, and stages + commits its work to `wt/impl-<feature-id>`.

---

## 3. Step C: Validator Evaluation (`workflow-validator`) & APK Artifact Hydration
Create an isolated worktree on temporary branch `wt/val-<feature-id>` starting from `wt/impl-<feature-id>`:
```bash
git worktree add -B wt/val-<feature-id> .worktrees/val-<feature-id> wt/impl-<feature-id>
```

### 🛡 APK Artifact Transfer & Emulator Pre-Install
1. Run the **Android Environment Hydration** from Step B with `<wt> = val-<feature-id>`.
2. Transfer the compiled APK artifacts from `.worktrees/impl-<feature-id>` and pre-install onto any active emulator/device (if `adb` commands fail inside the sandbox due to local TCP `:5037` restrictions, re-run the `adb` step with `BypassSandbox: true`):
```bash
# Bash / macOS / Linux: Transfer APK & pre-install on active emulator
if [ -d .worktrees/impl-<feature-id>/app/build/outputs/apk ]; then
  mkdir -p .worktrees/val-<feature-id>/app/build/outputs/apk
  cp -R .worktrees/impl-<feature-id>/app/build/outputs/apk/* .worktrees/val-<feature-id>/app/build/outputs/apk/ 2>/dev/null || true
fi
APK_FILE=$(find .worktrees/val-<feature-id>/app/build/outputs/apk -name "*.apk" ! -name "*androidTest*" 2>/dev/null | head -n 1)
if [ -n "$APK_FILE" ] && command -v adb >/dev/null 2>&1 && adb get-state >/dev/null 2>&1; then
  adb install -r "$APK_FILE" 2>/dev/null || true
fi

# PowerShell / Windows: Transfer APK & pre-install on active emulator
if (Test-Path ".worktrees/impl-<feature-id>/app/build/outputs/apk") {
  New-Item -ItemType Directory -Path ".worktrees/val-<feature-id>/app/build/outputs/apk" -Force | Out-Null
  Copy-Item -Path ".worktrees/impl-<feature-id>/app/build/outputs/apk/*" -Destination ".worktrees/val-<feature-id>/app/build/outputs/apk/" -Recurse -Force
}
$apk = Get-ChildItem -Path ".worktrees/val-<feature-id>/app/build/outputs/apk" -Filter "*.apk" -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notmatch "androidTest" } | Select-Object -First 1
if ($apk -and (Get-Command "adb" -ErrorAction SilentlyContinue)) {
  if ((adb get-state 2>$null) -eq "device") { adb install -r $apk.FullName 2>$null }
}
```
* Inside `.worktrees/val-<feature-id>`, the Validator operates as a **strictly read-only evaluator for repository source code**:
  - Audits the spec contract, diff, test implementations, Clean Architecture/SOLID rules, and recorded compiler evidence.
  - Can execute `@android-cli` or `adb` journeys on the active emulator against the pre-installed application or deploy the hydrated APK artifact (`app/build/outputs/apk/...`).
  - Returns its verdict (`accept`, `revise`, or `block`), findings, and `Implementation Repair Brief` directly in its output summary to `workflow-orchestrator`.
* **Handoff & Worktree State Transitions**:
  - Persist report: Orchestrator saves `docs/features/<feature-id>/validator/validation-report.md`.
  - Always clean up validator worktree:
    ```bash
    git worktree remove .worktrees/val-<feature-id> --force
    # Bash / macOS / Linux:
    rm -rf .worktrees/val-<feature-id> 2>/dev/null || true
    # PowerShell / Windows:
    Remove-Item -Path ".worktrees/val-<feature-id>" -Recurse -Force -ErrorAction SilentlyContinue
    ```
  - **Verdict `ACCEPT`**: Proceed directly to Step D (`workflow-documenter`).
  - **Verdict `REVISE` (Within limit: `repair_attempts < MAX_REPAIR_ATTEMPTS`)**:
    * Re-invoke `workflow-implementer` in existing worktree `.worktrees/impl-<feature-id>` with the repair brief.
  - **Verdict `REVISE` (Limit reached: `needs_human_review`)**:
    * Preserve `.worktrees/impl-<feature-id>` intact while awaiting user direction across the 4 decision pathways:
      1. **Override**: Commit any manual user edits inside `.worktrees/impl-<feature-id>` to `wt/impl-<feature-id>` and proceed directly to Step D (`workflow-documenter`).
      2. **Human Hint**: Reset `repair_attempts = 1` and re-invoke `workflow-implementer` inside `.worktrees/impl-<feature-id>` with the user's hint.
      3. **Re-plan**: Remove `.worktrees/impl-<feature-id>`, delete `wt/impl-<feature-id>`, and return to Stage 1 (`workflow-planner`) to revise `spec.md`.
      4. **Cancel**: Remove `.worktrees/impl-<feature-id>`, delete `wt/impl-<feature-id>`, and leave status as `needs_human_review`.
  - **Verdict `BLOCK`**: Clean up temporary worktrees and set status to `"blocked"`.

---

## 4. Step D: Documenter Worktree (`workflow-documenter`)
Once the Validator returns `ACCEPT`, create an isolated worktree on temporary branch `wt/doc-<feature-id>` starting from `wt/impl-<feature-id>`:
```bash
git worktree add -B wt/doc-<feature-id> .worktrees/doc-<feature-id> wt/impl-<feature-id>
```
* Inside `.worktrees/doc-<feature-id>`, the Documenter adds English KDoc, updates durable Markdown docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`, `spec.md`), updates `PROGRESS.md`, and commits to `wt/doc-<feature-id>`.

---

## 5. Step E: Consolidation & Worktree Cleanup (Orchestrator)
Once `workflow-documenter` finishes:
1. Remove temporary worktrees and purge untracked build caches:
   ```bash
   git worktree remove .worktrees/impl-<feature-id> --force
   git worktree remove .worktrees/val-<feature-id> --force 2>/dev/null || true
   git worktree remove .worktrees/doc-<feature-id> --force

   # Physical cleanup
   # Bash / macOS / Linux:
   rm -rf .worktrees/impl-<feature-id> .worktrees/val-<feature-id> .worktrees/doc-<feature-id>
   rmdir .worktrees 2>/dev/null || true

   # PowerShell / Windows:
   Remove-Item -Path ".worktrees/impl-<feature-id>", ".worktrees/val-<feature-id>", ".worktrees/doc-<feature-id>" -Recurse -Force -ErrorAction SilentlyContinue
   if ((Test-Path ".worktrees") -and ((Get-ChildItem ".worktrees" -Force | Measure-Object).Count -eq 0)) { Remove-Item ".worktrees" -Force }
   ```
2. Bring changes onto `feature/<feature-id>` (`git merge --squash wt/doc-<feature-id>` + `git reset` for atomic layer commits via `git-governance`).
3. If build files were modified, run `./gradlew prepareKotlinBuildScriptModel --build-cache`.
4. Delete temporary branches: `git branch -D wt/impl-<feature-id> wt/val-<feature-id> wt/doc-<feature-id>`.

---

## 6. Step F: Post-PR Review Worktree Lifecycle (`review-fix` Mode — Multi-Round)
When the developer conducts code review on an open PR (across 1 or $N$ review rounds) and requests revisions:
1. **Never edit application code in the root workspace**. Check out `feature/<feature-id>`, append `## PR Review Round #N` with the structured `PR Review Repair Brief` to `docs/features/<feature-id>/validator/pr-review.md`, set `feature_list.json` status to `"in_progress"` (`repair_attempts = 0`), and commit the brief to `feature/<feature-id>`.
2. **Re-spawn Implementer Worktree**:
   ```bash
   git fetch origin feature/<feature-id>
   git worktree add -B wt/impl-<feature-id> .worktrees/impl-<feature-id> feature/<feature-id>
   ```
   Hydrate local files (`local.properties`, `.env`, `keystore.properties`, `app/google-services.json`).
3. **Subagent Execution Chain**:
   - 🟡 **Implementer**: Applies fixes from `pr-review.md` (`PR Review Round #N`), verifies `@compiler`, and commits to `wt/impl-<feature-id>`.
   - 🟢 **Validator**: Evaluates changes in `.worktrees/val-<feature-id>` branched from `wt/impl-<feature-id>` (with environment and compiled APK hydration + emulator pre-install per Step C), auditing both the Round `#N` delta and cumulative feature state. Bounded repair loop applies (`MAX_REPAIR_ATTEMPTS = 2`).
   - 🔷 **Documenter**: Enriches KDoc and synchronizes `spec.md` / `ARCHITECTURE.md` in `.worktrees/doc-<feature-id>`.
4. **Incremental Consolidation & PR Update**:
   - Merge `wt/doc-<feature-id>` into `feature/<feature-id>` applying **only the Round `#N` delta** via atomic layer commits (`refactor(domain)`, `refactor(data)`, `fix(ui)`, `docs`).
   - Push delta to remote: `git push origin feature/<feature-id>` (outside sandbox, `BypassSandbox: true`).
   - Remove temporary worktrees, delete `wt/*` branches, and return root workspace to `develop`:
     ```bash
     git worktree remove .worktrees/impl-<feature-id> --force
     git worktree remove .worktrees/val-<feature-id> --force 2>/dev/null || true
     git worktree remove .worktrees/doc-<feature-id> --force
     git branch -D wt/impl-<feature-id> wt/val-<feature-id> wt/doc-<feature-id>
     git checkout develop
     ```
