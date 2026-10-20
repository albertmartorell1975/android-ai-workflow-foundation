---
name: agent-safety-hooks
description: Automated safety hooks to block destructive actions (such as 'rm -rf', 'git reset --hard', 'git clean -f', 'gh pr merge', or forced pushes) tailored to your active AI provider (Gemini, Cursor, or Claude Code).
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords:
  - hooks
  - safety
  - security
  - pretooluse
  - claude-code
  - cursor
  - gemini
---
# Agent Safety Hooks Governance

This skill manages provider-agnostic lifecycle safety hooks for Android projects. It prevents AI agents from executing destructive shell commands such as `rm -rf`, `git reset --hard`, `git clean -f`, autonomous `gh pr merge` (ensuring PR merges are strictly human), or force pushes, by installing both the hook configuration and the hook script into the canonical hook locations of the active AI provider.

## Supported Providers & Canonical Hook Locations

Following each provider's official specification (such as [Claude Code Hook Locations](https://code.claude.com/docs/en/hooks#hook-locations)), hooks are **never executed from inside `.agents/skills/`**. Instead, this skill materializes them into the provider's official project-level hook directories so they can be committed and shared with the team:

| AI Provider | Hook Configuration File | Hook Script Location | Event / Matcher |
| :--- | :--- | :--- | :--- |
| **Claude Code** | `.claude/settings.json` | `.claude/hooks/block-rm-rf.js` | `PreToolUse` (`Bash\|PowerShell`, `if: "Bash(rm *\|git *\|gh *)"`) |
| **Gemini / Antigravity (Default)** | `.agents/hooks.json` | `.agents/hooks/block-rm-rf.js` | `PreToolUse` (`run_shell_command` / `run_command`) |
| **Cursor** | `.cursor/hooks.json` | `.cursor/hooks/block-rm-rf.js` | `beforeShellExecution` |

> [!IMPORTANT]
> **Why `.claude/settings.json` + `.claude/hooks/` instead of Skill Frontmatter?**
> Per the Claude Code documentation, hooks defined in a skill's YAML frontmatter only activate *after* that specific skill is invoked during a session. Project-wide safety guards like blocking `rm -rf` must be active on every turn from session startup, which requires placing them in `.claude/settings.json` and `.claude/hooks/`.

---

## Templates Source of Truth

Because `npx skills add` only distributes directories inside `.agents/skills/`, the baseline templates are stored in this skill's `references/` folder and materialized into the project root when `workflow-initializer` runs:

* **Hook Script Template (Node.js)**: `.agents/skills/agent-safety-hooks/references/block-rm-rf.template.js`
* **Hook Script Template (PowerShell)**: `.agents/skills/agent-safety-hooks/references/block-rm-rf.template.ps1`
* **Claude Code Config Template**: `.agents/skills/agent-safety-hooks/references/claude_hooks.template.json`
* **Gemini / Antigravity Config Template**: `.agents/skills/agent-safety-hooks/references/gemini_hooks.template.json`
* **Cursor Config Template**: `.agents/skills/agent-safety-hooks/references/cursor_hooks.template.json`

---

## Initial Materialization Protocol

When invoked during project initialization (e.g. delegated from `workflow-initializer`):

1. **Resolve Provider**: Check the selected AI Provider (`Gemini`, `Cursor`, or `Claude Code`). If omitted or ambiguous, prompt the user via `ask_user`.
2. **Materialize Hook Script (Into Official Hook Directory)**:
   - **Claude Code**: Copy `references/block-rm-rf.template.js` to `.claude/hooks/block-rm-rf.js`.
   - **Gemini / Antigravity**: Copy `references/block-rm-rf.template.js` to `.agents/hooks/block-rm-rf.js`.
   - **Cursor**: Copy `references/block-rm-rf.template.js` to `.cursor/hooks/block-rm-rf.js`.
3. **Materialize Hook Configuration**:
   - **Claude Code (`.claude/settings.json`)**:
     Read `.claude/settings.json` if it already exists (for instance, created by `ai-context-exclusion` with `permissions.deny`). Safely merge the `hooks.PreToolUse` block from `references/claude_hooks.template.json` without overwriting `permissions` or other existing keys.
   - **Gemini / Antigravity (`.agents/hooks.json`)**:
     Write `references/gemini_hooks.template.json` to `.agents/hooks.json` (merging if the file already exists).
   - **Cursor (`.cursor/hooks.json`)**:
     Write `references/cursor_hooks.template.json` to `.cursor/hooks.json` (merging if the file already exists).

---

## Actionable Checklist for Safety Hooks
- [ ] Identify the target AI provider (`Gemini`, `Cursor`, or `Claude Code`).
- [ ] Materialize the script into the provider's official hook folder (`.claude/hooks/`, `.agents/hooks/`, or `.cursor/hooks/`), never leaving the active runtime path pointing inside `.agents/skills/`.
- [ ] Materialize or safely merge the hook configuration file (`.claude/settings.json`, `.agents/hooks.json`, or `.cursor/hooks.json`).
