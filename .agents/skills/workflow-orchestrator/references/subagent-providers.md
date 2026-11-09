# Subagent Providers & Model Tier Configuration

This reference defines the role-tuned model tier matrix and provider-specific invocation protocols (`Gemini / Antigravity`, `Claude Code`, and `Cursor`) for `workflow-orchestrator`.

---

## 1. Visual Badges & Role Identity

Every agent in the pipeline identifies itself with its canonical color badge:
* 🟣 **`[ORCHESTRATOR · workflow-orchestrator]`** — Pipeline coordination, `feature_list.json`, `git worktree` management, and final `@git-governance` commits/PRs.
* 🔵 **`[PLANNER · workflow-planner]`** — Technical diagnosis and specification at `docs/features/<feature-id>/spec.md`.
* 🟡 **`[IMPLEMENTER · workflow-implementer]`** — Clean Architecture code, tests, and `@compiler` verification in an isolated worktree.
* 🟢/🔴 **`[VALIDATOR · workflow-validator]`** — Independent 4-level audit (Spec, Security/Scope, Compiler/Tests, Runtime).
* 🔷 **`[DOCUMENTER · workflow-documenter]`** — English KDoc, durable documentation sync, and checklist completion in an isolated worktree.

> **See [Git Worktree Lifecycle](worktree-lifecycle.md)** for detailed worktree setup, hydration, and consolidation steps.

---

## 2. Role-Tuned Model Tier Matrix

Each subagent is configured with an optimal model tier matching its cognitive requirements:

| Subagent Role | Antigravity / Gemini | Claude Code | Cursor | Cognitive Profile |
| :--- | :--- | :--- | :--- | :--- |
| 🔵 **`workflow-planner`** | `inherit` | `opus` | `inherit` | Deep architectural reasoning & contract design |
| 🟡 **`workflow-implementer`** | `flash` | `sonnet` | `fast` | High-speed deterministic code & test generation |
| 🟢 **`workflow-validator`** | `inherit` | `opus` | `inherit` | Strict adversarial audit & security analysis |
| 🔷 **`workflow-documenter`** | `flash` | `haiku` | `fast` | Fast KDoc & Markdown documentation synthesis |

---

## 3. Provider-Specific Subagent Invocation

### A. Gemini / Google Antigravity
In Antigravity, subagents are defined under `.agents/agents/` and invoked using the native `invoke_subagent` tool:
* **`TypeName`**: Use `"self"` for ALL subagents (`workflow-planner`, `workflow-implementer`, `workflow-validator`, `workflow-documenter`). Subagents require shell execution (`run_command`) for `git diff`, Gradle (`./gradlew`), and `android-cli`. Read-only boundaries for Validator are enforced via prompt and worktree isolation.
* **`Model`**:
  - `"inherit"` for `workflow-planner` and `workflow-validator`.
  - `"flash"` for `workflow-implementer` and `workflow-documenter`.
* **`Role`**:
  - `"🔵 Planner (workflow-planner)"`
  - `"🟡 Implementer (workflow-implementer)"`
  - `"🟢 Validator (workflow-validator)"`
  - `"🔷 Documenter (workflow-documenter)"`
* **`Workspace`**: `"inherit"`
* **`Prompt`**: Instruct the subagent to read its corresponding `.agents/agents/workflow-<role>.md` file (materialized by `workflow-initializer`). Pass dynamic handoff payload (feature ID, spec path, repair brief on revise, or PR review brief).

### B. Cursor (`.cursor/agents/`)
Cursor loads subagent definitions from `.cursor/agents/<name>.md`:
* `model`: `inherit` for `workflow-planner` and `workflow-validator`; `fast` for `workflow-implementer` and `workflow-documenter`.
* Roles: `workflow-planner.md`, `workflow-implementer.md`, `workflow-validator.md`, `workflow-documenter.md`.
* For `workflow-validator.md`: `readonly: true` ensures the evaluator cannot modify any files on disk.
* For `workflow-planner.md`: writes strictly to `docs/features/<feature-id>/spec.md`, `feature_list.json`, and `PROGRESS.md`.
* Executes inside the workspace or isolated `.worktrees/<role>-<feature-id>` worktree.

### C. Claude Code (`.claude/agents/`)
Claude Code natively loads subagents from `.claude/agents/<name>.md`:
* `name`: `workflow-planner` | `workflow-implementer` | `workflow-validator` | `workflow-documenter`
* `model`: `opus` for planner/validator; `sonnet` for implementer; `haiku` for documenter.
* `isolation`: `worktree` (for implementer, validator, documenter).
* `color`: `blue` | `yellow` | `green` | `cyan`.
* `skills`: The explicit scoped list of Foundation skills for that specific role.
* For `workflow-validator.md`: `disallowedTools: [Write, Edit]` guarantees strict read-only operation.
