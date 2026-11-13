# Provider-Specific Subagent Templates (`workflow-initializer`)

During **PHASE 3: Project Customization**, materialize the subagent configuration matching the user's selected **AI Provider** (`Gemini/Antigravity`, `Claude Code`, or `Cursor`) and ensure `.worktrees/` is added to the project's `.gitignore`.

This template index establishes the canonical subagent definitions for each provider SDK. To prevent context saturation, the concrete agent templates are split into provider-specific reference files:

- **Antigravity / Gemini**: [subagents/gemini.md](subagents/gemini.md)
- **Cursor**: [subagents/cursor.md](subagents/cursor.md)
- **Claude Code**: [subagents/claude.md](subagents/claude.md)

## Role-Tuned Model Tier Matrix

Each subagent is assigned the optimal model tier for its cognitive profile across providers:

| Subagent Role | Cognitive Profile | Antigravity / Gemini | Claude Code | Cursor |
| :--- | :--- | :--- | :--- | :--- |
| 🔵 **`workflow-planner`** | Deep architectural reasoning & specification design | `inherit` | `opus` | `inherit` |
| 🟡 **`workflow-implementer`** | High-speed deterministic code & test generation | `inherit` | `sonnet` | `fast` |
| 🟢 **`workflow-validator`** | Strict independent 4-level audit & security analysis | `inherit` | `opus` | `inherit` |
| 🔷 **`workflow-documenter`** | Fast KDoc & Markdown documentation synthesis | `flash` | `haiku` | `fast` |

---

## 1. Git Ignore Rule (All Providers)

Ensure `.gitignore` in the consuming Android project includes:
```gitignore
# Temporary Multi-Agent Git Worktrees
.worktrees/
```

---

## 2. Provider Template References

Consult the exact provider template file matching the user-selected AI Provider:
* For **Gemini / Antigravity**: Read and materialize from [subagents/gemini.md](subagents/gemini.md) into `.agents/agents/`.
* For **Cursor**: Read and materialize from [subagents/cursor.md](subagents/cursor.md) into `.cursor/agents/`.
* For **Claude Code**: Read and materialize from [subagents/claude.md](subagents/claude.md) into `.claude/agents/`.
