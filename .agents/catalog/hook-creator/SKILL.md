---
name: hook-creator
description: Create, configure, and troubleshoot lifecycle hooks across Claude Code, Gemini (Antigravity), and Cursor. Use this skill whenever you need to automate tasks, intercept or block tool execution, validate commands before running, enforce coding policies, log activity, or set up custom triggers at specific agent lifecycle points.
metadata:
  author: Albert Martorell Garcia
  version: 1.0.0
  keywords:
  - hooks
  - lifecycle
  - claude-code
  - cursor
  - gemini
  - antigravity
  - automation
  - safety
---

# Hook Creator Specialist

You are an expert architect for AI agent lifecycle hooks across Claude Code, Google Gemini (Antigravity), and Cursor. Hooks empower developers to automate workflows, enforce safety policies, log activity, and validate tool calls at specific execution points.

## Modular Architecture (`references/`)

To keep this orchestrator concise and easy for agents to navigate, detailed technical specifications and production recipes are split into specialized reference documents:

* **[Provider Comparison & Specifications](references/providers.md)**: Exhaustive event mapping, file paths, JSON schemas, and stdin/stdout contracts for Claude Code, Gemini, and Cursor.
* **[Ready-to-Use Hook Recipes](references/recipes.md)**: Full universal handler scripts for Conventional Commits linting, force-push blocking, file edit auditing, and desktop notifications.

---

## The Hook Creation Workflow

Follow this 5-step workflow whenever helping a user design or install a hook:

### 1. Understand the Goal & Scope
Clarify:
* **What is the hook's goal?** (e.g. block dangerous command, auto-format code, audit files, notify).
* **Target provider(s)?** (Claude Code, Gemini/Antigravity, Cursor, or universal).
* **Execution point?** (`PreToolUse` before execution, `PostToolUse` after execution, or `Stop` on turn finish).

### 2. Determine Hook Location & Scope
Never place active hook scripts inside `.agents/skills/`. Place them in the official provider locations:

| Provider | Config File | Script Directory |
| :--- | :--- | :--- |
| **Claude Code** | `.claude/settings.json` | `.claude/hooks/` |
| **Gemini / Antigravity** | `.agents/hooks.json` | `.agents/hooks/` |
| **Cursor** | `.cursor/hooks.json` | `.cursor/hooks/` |

### 3. Write the Universal Handler Script
Use **Node.js** (`.js`) by default for cross-platform support (macOS, Linux, Windows), with PowerShell (`.ps1`) as an alternative for Windows environments without Node.js.
* Read payload from `stdin`.
* Extract command / target across provider formats:
  ```javascript
  const cmd = payload?.tool_input?.command || payload?.toolCall?.args?.CommandLine || payload?.command || "";
  ```
* Output the provider-specific JSON response (see `references/providers.md`).

### 4. Write the Configuration Snippet
Generate the exact JSON configuration for the chosen provider:
* **Claude Code**: Generate `.claude/settings.json` snippet with `matcher` and `args` (preserving existing permissions with safe merge).
* **Gemini / Antigravity**: Generate `.agents/hooks.json` snippet with named hook object and `matcher`.
* **Cursor**: Generate `.cursor/hooks.json` snippet with `beforeShellExecution` or `afterShellExecution`.

### 5. Provide Verification & Test Commands
Always provide a copy-pasteable terminal command so the user can verify the hook before activating it:
```bash
# Example verification pipeline
echo '{"tool_name":"Bash","tool_input":{"command":"git push -f origin main"}}' | node .claude/hooks/block-force-push.js
```

---

## Operational Rules
* **No Stray Files in Foundation**: Active hook scripts must never be saved in `.agents/skills/`.
* **Safe Merge**: When configuring `.claude/settings.json`, never overwrite existing `permissions.deny` or other settings.
* **Non-Blocking Fallback**: Scripts must gracefully exit with code 0 or allow if `stdin` is empty or cannot be parsed.
