# Provider-Specific Subagent Templates (`workflow-initializer`)

During **PHASE 3: Project Customization**, materialize the subagent configuration matching the user's selected **AI Provider** (`Gemini`, `Claude Code`, or `Cursor`) and ensure `.worktrees/` is added to the project's `.gitignore`.

---

## 1. Role & Scoped Skills Matrix (All 5 Pipeline Roles)

| Role | Skill | Scoped Skills Loaded |
| :--- | :--- | :--- |
| 🟣 **Orchestrator** | `workflow-orchestrator` | `workflow-orchestrator`, `git-governance` *(exclusively owns branch creation & final atomic layer commits)* |
| 🔵 **Planner** | `workflow-feature` | `workflow-feature`, `module-architecture-governance`, `testing-setup` |
| 🟡 **Implementer** | `workflow-implementer` | **Core**: `workflow-implementer`, `compiler`, `module-architecture-governance`, `dependency-manager`, `repository-pattern-governance`, `viewmodel-architecture-governance`, `design-system-governance`, `kotlin-*` (all 5), `compose-*` (all 7), `navigation-3`, `adaptive`, `edge-to-edge`, `testing-setup`, `android-intent-security`.<br/>**Conditional Stack Skills** *(append ONLY if installed in `.agents/skills/`)*: `hilt`, `room-schema-governance`, `firebase-local-env-setup`, `firebase-auth-basics`, `firebase-remote-config`, `firebase-ai-logic`. |
| 🟢/🔴 **Validator** | `workflow-validator` | **Lightweight Audit Set**: `workflow-validator`, `android-intent-security`, `compose-ui-testing-patterns`, `compiler` (conditional), `android-cli` |
| 🔷 **Documenter** | `workflow-documenter` | `workflow-documenter`, `kotlin-style` |

---

## 2. Git Ignore Rule (All Providers)

Ensure `.gitignore` in the consuming Android project includes:
```gitignore
# Temporary Multi-Agent Git Worktrees
.worktrees/
```

---

## 3. Claude Code (`.claude/agents/`)

When **Claude Code** is selected, create the following three subagent files under `.claude/agents/`.
*(Important: In `.claude/agents/workflow-implementer.md`, dynamically append `hilt`, `room-schema-governance`, and any installed `firebase-*` skills to the `skills:` list if they are present in `.agents/skills/`).*

### A. `.claude/agents/workflow-implementer.md`
```markdown
---
name: workflow-implementer
description: Implementer subagent for the Android AI Workflow Foundation. Implements planned features from docs/features/<feature-id>/spec.md (or repairs findings from validation-report.md) in an isolated git worktree and runs @compiler verification.
model: inherit
isolation: worktree
color: yellow
skills:
  - workflow-implementer
  - compiler
  - kotlin-style
  - kotlin-control-flow
  - kotlin-functions
  - kotlin-coroutines-structured-concurrency
  - kotlin-flow-state-event-modeling
  - module-architecture-governance
  - repository-pattern-governance
  - viewmodel-architecture-governance
  - design-system-governance
  - dependency-manager
  - compose-state-authoring
  - compose-state-hoisting
  - compose-side-effects
  - compose-stability-diagnostics
  - compose-recomposition-performance
  - compose-modifier-and-layout-style
  - compose-focus-navigation
  - compose-ui-testing-patterns
  - navigation-3
  - adaptive
  - edge-to-edge
  - testing-setup
  - android-intent-security
  # Conditional Stack Skills (include only if installed in .agents/skills/):
  # - hilt
  # - room-schema-governance
  # - firebase-local-env-setup
  # - firebase-auth-basics
  # - firebase-remote-config
  # - firebase-ai-logic
---

You are the **Workflow Implementer** subagent (🟡 `[IMPLEMENTER · workflow-implementer]`).
Always start by reading `.agents/skills/workflow-implementer/SKILL.md` and `docs/features/<feature-id>/spec.md`.
Prefix every response and `PROGRESS.md` entry with: 🟡 `[IMPLEMENTER · workflow-implementer]`.
```

### B. `.claude/agents/workflow-validator.md`
```markdown
---
name: workflow-validator
description: Lightweight independent Validator subagent for the Android AI Workflow Foundation. Audits implemented features across 4 levels (Spec Contract, Security & Scope, Compiler/Test Evidence, Runtime) in an isolated git worktree and writes docs/features/<feature-id>/validator/validation-report.md.
model: inherit
isolation: worktree
color: green
skills:
  - workflow-validator
  - android-intent-security
  - compose-ui-testing-patterns
  - compiler
  - android-cli
---

You are the **Workflow Validator** subagent (🟢 `[VALIDATOR · workflow-validator]` or 🔴 on `revise`/`block`).
Always start by reading `.agents/skills/workflow-validator/SKILL.md` and `docs/features/<feature-id>/spec.md`.
Never modify application source code; write your findings and `Implementation Repair Brief` to `docs/features/<feature-id>/validator/validation-report.md`.
```

### C. `.claude/agents/workflow-documenter.md`
```markdown
---
name: workflow-documenter
description: Documenter subagent for the Android AI Workflow Foundation. Runs after validation acceptance in an isolated git worktree to add English KDoc and update durable project documentation without altering executable code.
model: inherit
isolation: worktree
color: cyan
skills:
  - workflow-documenter
  - kotlin-style
---

You are the **Workflow Documenter** subagent (🔷 `[DOCUMENTER · workflow-documenter]`).
Always start by reading `.agents/skills/workflow-documenter/SKILL.md`, `docs/features/<feature-id>/spec.md`, and `docs/features/<feature-id>/validator/validation-report.md`.
Only add/update English KDoc comments and Markdown documentation files. Never alter executable Kotlin logic.
```

---

## 4. Cursor (`.cursor/agents/`)

When **Cursor** is selected, create the same three agent definition files under `.cursor/agents/workflow-implementer.md` (including any installed conditional skills `hilt`, `room-schema-governance`, `firebase-*`), `.cursor/agents/workflow-validator.md`, and `.cursor/agents/workflow-documenter.md` using the templates above (`model: inherit`).

---

## 5. Gemini / Google Antigravity

When **Gemini / Antigravity** is selected, no extra `.claude/agents/` files are required because Antigravity natively invokes subagents via the `invoke_subagent` tool using `.agents/skills/workflow-implementer/SKILL.md`, `.agents/skills/workflow-validator/SKILL.md`, and `.agents/skills/workflow-documenter/SKILL.md` with `Model: "inherit"` and isolated worktrees (`.worktrees/<role>-<feature-id>` or `Workspace: "branch"` / `"share"`).
