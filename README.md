# 🚀 Android AI Workflow Foundation v2.0.0

Exploring how specialized AI agents can become part of a disciplined, human-supervised Android software engineering process.

**Android AI Workflow Foundation** is a unified, provider-agnostic multi-agent development framework for Android projects. It combines shared engineering standards, Clean Architecture guardrails, persistent project harness tracking (`feature_list.json`, `PROGRESS.md`, `CONSTRAINTS.md`), and isolated **`git worktree`** subagents (`workflow-orchestrator`, `workflow-planner`, `workflow-implementer`, `workflow-validator`, and `workflow-documenter`).

The goal is not to automate software development blindly. The developer remains the highest-level supervisor, responsible for architecture, technical decisions, review, and final acceptance.

---

## 🏗 Multi-Agent Architecture & Specialized Roles

The Foundation organizes development into a **discovery and harness phase** (Phase 1) followed by an **isolated 5-role worktree pipeline** (Phase 2):

```text
[1. Planner: workflow-planner] 🔵 ──► creates docs/features/<feature-id>/spec.md (*)
  ▼
[2. Implementer: workflow-implementer] 🟡 (.worktrees/impl-<id>) ──► code + tests + @compiler (*)
  ▼
[3. Validator: workflow-validator] 🟢/🔴 (.worktrees/val-<id>, hydrated APK + emulator pre-install)
  ├── REVISE (attempts < 2) ──► loops back to Implementer with Repair Brief
  ├── REVISE (attempts == 2) ─► 🛑 Human Decision Gate (Override | Hint | Re-plan | Cancel)
  └── ACCEPT (*) ─────────────► proceeds to Documenter
  ▼
[4. Documenter: workflow-documenter] 🔷 (.worktrees/doc-<id>) ──► English KDoc + durable docs + spec.md
  ▼
[5. Consolidation & Layer Commits] 🟣 ──► atomic commits (Domain->Data->UseCases->UI->Docs)
  ▼
[6. Automatic GitHub PR & CI Gate] 🟣 ──► push feature/<id> + open PR vs develop -> runs .github/workflows/gate.yml
  ▼
[7. Post-PR Review Loop (review-fix Round #1..#N)] ──► pr-review.md -> Implementer -> Validator -> PR push
  ▼
[🛑 Human Merge on GitHub]  

(* = Optional Human Checkpoint via require_review_after or prompt)
```

### Visual Identity Badges & Subagent Roles

| Role | Core Skill | Execution Scope | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| 🟣 **Orchestrator** | `workflow-orchestrator` | Main Feature Branch (`feature/<id>`) | Pipeline coordination, queue selection, worktree lifecycle, APK hydration, human checkpoints, bounded repair loop (`MAX_REPAIR_ATTEMPTS = 2`), atomic layer commits (`@git-governance`), and automatic PR publication + CI trigger. |
| 🔵 **Planner** | `workflow-planner` | Clean Subagent Context (`docs/features/<id>/`) | Clarifies up to 3 questions and authors the unified contract at `docs/features/<feature-id>/spec.md` (`Given/When/Then`, layer breakdown, Clean Architecture checklist). |
| 🟡 **Implementer** | `workflow-implementer` | Isolated Worktree (`.worktrees/impl-<id>`) | Implements Clean Architecture layers (`Domain -> Data -> UseCase -> UI`), converts graphic assets, writes pure JVM tests, runs `@compiler`, and marks `passing`. |
| 🟢/🔴 **Validator** | `workflow-validator` | Isolated Worktree (`.worktrees/val-<id>`) | Strictly read-only auditor for repository files across **4 levels** (Spec, Security, `@compiler`/Tests, Emulator runtime). Can test pre-installed app or deploy hydrated APK. Emits `accept`, `revise` + Repair Brief, or `block`. |
| 🔷 **Documenter** | `workflow-documenter` | Isolated Worktree (`.worktrees/doc-<id>`) | Runs only after `accept`. Authors English KDoc on public classes, updates durable docs (`ARCHITECTURE.md`, `CONSTRAINTS.md`, `README.md`), and marks completed tasks in `spec.md`. |

---

## 🛡 Human-in-the-Loop Governance & Supervision Philosophy

The Foundation guarantees developer control without sacrificing autonomous pipeline speed:

### 1. Flexible Checkpoints Across Any Stage (`require_review_after`)
Every feature is different. A routine UI tweak does not require the same scrutiny as a biometric authentication flow, a database migration, or an in-app payment gateway:
* Any feature in `feature_list.json` can declare proactive pause points at **any stage of the loop**: `"require_review_after": "planner" | "implementer" | "validator" | ["planner", "validator"]` (or requested dynamically in the user prompt).
* When a checkpointed stage finishes, the orchestrator pauses and offers 4 structured options: **`[Approve & Proceed]`**, **`[Human Guidance / Hint]`**, **`[Manual Worktree Edits]`**, or **`[Abort / Defer]`**.

### 2. High-Leverage Recommended Pattern (Post-Planner + PR Code Review)
While checkpoints can be placed at any stage depending on the feature, the **recommended standard pattern** balances speed and engineering control by placing human supervision at the two highest-leverage points:
1. **Post-Planner (`require_review_after: "planner"`)**: Review and approve the technical contract (`docs/features/<feature-id>/spec.md`) **before** any code or tests are written.
2. **Pull Request Code Review (GitHub PR + `review-fix` loop)**: Once `spec.md` is approved, let the central loop (`Implementer ⇄ Validator -> Documenter`) execute autonomously, automatically push `feature/<feature-id>`, open the Pull Request against `develop`, and trigger the CI validation gate (`.github/workflows/gate.yml`). The developer then conducts code review directly on the PR in GitHub (inline comments + **`Comment` -> `Submit review`**) and simply tells `@workflow-orchestrator` to *continue*: pending review comments are fetched automatically via `gh api` and resolved through the `review-fix` loop.

### 3. Reactive Human Decision Gate (`needs_human_review`)
If the repair loop between Implementer and Validator cannot reach `accept` within `MAX_REPAIR_ATTEMPTS = 2`, autonomous looping stops immediately, the worktree is preserved intact, and the developer resolves it via **Override**, **Hint**, **Re-plan**, or **Cancel**.

---

## 🔄 Feature Execution & Post-PR Review Modes

In both feature execution modes (**Mode A** and **Mode B**), once `workflow-documenter` finishes, the Orchestrator consolidates atomic layer-by-layer Conventional Commits (`Domain -> Data -> UseCases -> UI -> Docs`), **automatically pushes `feature/<feature-id>` to the remote repository, opens a Pull Request against `develop`, and triggers `.github/workflows/gate.yml`** (`./gradlew testDebugUnitTest lintDebug`). Autonomous PR merging (`gh pr merge`) is strictly prohibited—merging is 100% human-owned.

1. **Mode A — Standalone Feature Mode (Ad-hoc)**: Triggered by a direct request (*"Implement User Profile screen"*). Runs the shared pre-flight base sync and open PR review audit, registers or selects the feature in `feature_list.json` (enforcing the `depends_on` PR-clean gate if it builds on an existing feature), executes the full 7-stage loop engineering pipeline through PR creation and CI validation, and automatically enters `review-fix` if the feature's PR has pending review comments.
2. **Mode B — Backlog Queue Mode (`feature_list.json`)**: Orchestrator audits open PRs first (prioritizing `review-fix` on any PR with pending review comments) and then processes ready features from `feature_list.json` whose `depends_on` are all `accepted`, PR-clean (zero unresolved PR comments), and merged into `develop`. Features that depend on an unresolved or unmerged PR are automatically skipped/blocked so independent features can proceed safely.
3. **Mode C — Post-PR Review & Feedback Loop (`review-fix` Multi-Round)**:
   - **Review on GitHub**: Add inline comments on the PR diff and finish with **`Comment` -> `Submit review`** (GitHub disables *Request changes* and *Approve* on PRs opened with your own account, so `Comment` is the expected path). General PR conversation comments are also picked up.
   - **Detection**: On the next `@workflow-orchestrator` invocation (*"continue"*, *"review-fix"*, or any new feature request), the shared pre-flight audit compares GitHub reviews/comments against the latest commit on `feature/<feature-id>` and automatically extracts any newer review body and inline file/line comments via `gh api`. No GitHub Action or background watcher is needed.
   - The orchestrator records `## PR Review Round #N` in `docs/features/<feature-id>/validator/pr-review.md` on `feature/<feature-id>`.
   - Rehydrates isolated worktrees (`wt/impl-<id>` -> `wt/val-<id>` -> `wt/doc-<id>`), runs `Implementer ⇄ Validator -> Documenter` (**never the Planner**: code review comments must fit the existing `spec.md`; contract changes are escalated as a new feature or explicit re-plan), consolidates only the Round `#N` delta via atomic layer commits, and pushes cleanly to update the open PR and re-run `.github/workflows/gate.yml` without touching the root workspace.
   - **Dependency safety**: While the PR has pending review comments or is not yet merged into `develop`, any feature that depends on it (`depends_on`, directly or transitively) stays blocked; independent features may proceed.

---

## 📁 Unified Feature Directory Structure (`docs/features/<feature-id>/`)

Every feature keeps its contract, UI assets, and review history organized in one canonical folder:

```text
docs/features/<feature-id>/
├── spec.md                         # Unified contract (Given/When/Then + Android layers + Checklist)
├── ui/
│   ├── screens/                    # Reference screen mockups (PNG/HTML — NEVER converted to drawables)
│   └── resources/                  # Raw graphic assets (PNG/JPEG -> converted to res/drawable/ic_*.webp)
└── validator/
    ├── validation-report.md        # Structured 4-level report persisted by Orchestrator
    └── pr-review.md                # Human PR review feedback & Repair Briefs (Round #1..#N)
```

---

## 🛠 Installation, Multi-Provider Adaptation & Harness Setup

> **Prerequisites**: JDK 17/21, Git 2.30+ (for `git worktree`), and **GitHub CLI (`gh auth login`)** so the Orchestrator can publish Pull Requests automatically.

### Step 1: Install Active Skills
Run from your Android project root:
```bash
npx skills add albertmartorell1975/android-ai-workflow-foundation -y
```

### Step 2: Activate the Initializer (`workflow-initializer`)
Open your AI IDE and prompt:
```text
Activate workflow-initializer
```
The initializer auto-inspects your project's module topology (*Layer-Based* vs *Feature-First*), prompts for your **AI Provider** and optional catalog plugins, generates `AGENTS.md`, and **automatically adapts subagents, safety hooks, and context exclusions** to your chosen provider:

| AI Provider | Isolated Subagents (`SUBAGENT_SKILLS.json`) | Lifecycle Safety Hooks (`agent-safety-hooks` & `hook-creator`) | AI Context Exclusion (`ai-context-exclusion`) |
| :--- | :--- | :--- | :--- |
| **Gemini / Antigravity** | `.agents/agents/workflow-*.md` (`invoke_subagent`) | `.agents/hooks.json` + `.agents/hooks/*.js` (`PreToolUse`) | `.aiexclude` (Gitignore style) |
| **Claude Code** | `.claude/agents/workflow-*.md` (`isolation: worktree`, `disallowedTools`) | `.claude/settings.json` + `.claude/hooks/*.js` (`PreToolUse`) | `.claude/settings.json` (`permissions.deny`) |
| **Cursor** | `.cursor/agents/workflow-*.md` (`readonly: true` on validator) | `.cursor/hooks.json` + `.cursor/hooks/*.js` (`beforeShellExecution`) | `.cursorignore` (Gitignore style) |

* **🛡 Automated Safety Hooks**: By default, installs `block-rm-rf.js` (blocks destructive commands like `rm -rf`, `git reset --hard`, `git clean -f`, force pushes, and autonomous `gh pr merge`) and `check-agents-size.js` (enforces the 10 KB `AGENTS.md` limit). Custom project hooks can also be created on demand via `@hook-creator`.
* **🔒 Context Exclusion & Provider Switching**: Protects `local.properties`, `.worktrees/`, `.gradle/`, and `build/` from entering the AI context, and translates exclusion rules automatically if you switch AI providers later.

### Step 3: Project Discovery & Harness (`@build-brief` & `@harness-starter`)
* **New Product / MVP**: Run `@build-brief` for guided product/domain discovery (`CONTEXT.md`, `DESIGN.md`), then run `@harness-starter`.
* **Existing Android Codebase**: Run `@harness-starter` directly to inspect the repository and generate `PROGRESS.md`, `CONSTRAINTS.md`, `feature_list.json`, and the GitHub Actions CI gate **`.github/workflows/gate.yml`**.

---

## 📚 Detailed Documentation & References

* **[Architecture & Engine Overview](docs/overview.md)** — Detailed multi-agent design, modular topologies, worktree lifecycles, and pragmatic testing strategy.
* **[Canonical Skills Index](.agents/skills/README.md)** — Complete catalog of active Foundation skills, engineering guardrails, and optional catalog plugins.
* **[Git Worktree Lifecycle](.agents/skills/workflow-orchestrator/references/worktree-lifecycle.md)** — Shell commands for worktree hydration, APK transfer, and consolidation.

---

## 🙏 Acknowledgments & Credits

* **Foundation Methodology & Clean Architecture Guardrails:** Albert Martorell Garcia.
* **Harness & Multi-Agent Spec/Validator Methodology:** Originally created by **Antonio Leiva / Nino Ruano** for the AI Expert course and unified into this Foundation with permission.
* **External Expert Patterns:** Curated Kotlin and Compose skills by **Chris Banes** and others.
