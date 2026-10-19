# Provider Specifications & Lifecycle Hook Matrix

This document defines the exact lifecycle hooks specifications, event mappings, schema locations, and input/output contracts for the three AI providers supported by the Foundation:
1. **Anthropic / Claude Code**
2. **Google Gemini / Antigravity**
3. **Cursor**

---

## 1. Provider Comparison Matrix

| Dimension | Anthropic / Claude Code | Google Gemini / Antigravity | Cursor |
| :--- | :--- | :--- | :--- |
| **Config File** | `.claude/settings.json` | `.agents/hooks.json` | `.cursor/hooks.json` |
| **Scripts Directory** | `.claude/hooks/` | `.agents/hooks/` | `.cursor/hooks/` |
| **Pre-Tool / Pre-Shell** | `PreToolUse` | `PreToolUse` | `beforeShellExecution` |
| **Post-Tool / Post-Shell** | `PostToolUse`, `PostToolUseFailure` | `PostToolUse` | `afterShellExecution` |
| **Turn / Session Events** | `SessionStart`, `SessionEnd`, `Stop`, `UserPromptSubmit` | `SessionStart`, `Stop`, `PreInvocation`, `PostInvocation` | `beforeSubmitPrompt`, `afterResponse` |
| **Matcher Syntax** | Tool name regex (`Bash`, `Edit\|Write`, `mcp__.*`) | Tool name string/regex (`run_command`, `*`) | Event-specific target |
| **Input Delivery** | JSON via `stdin` (`tool_name`, `tool_input`) | JSON via `stdin` (`toolCall.name`, `toolCall.args`) | JSON via `stdin` (`command`, `cwd`) |
| **Blocking Mechanism** | Exit 2 with stderr OR JSON `hookSpecificOutput.permissionDecision: "deny"` | JSON stdout `{"decision": "deny", "reason": "..."}` | JSON stdout `{"permission": "deny", ...}` |

---

## 2. Provider Schemas & Configuration

### A. Claude Code (`.claude/settings.json`)

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "if": "Bash(git commit *)",
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/check-commit.js"],
            "timeout": 30
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/auto-lint.js"],
            "async": true
          }
        ]
      }
    ]
  }
}
```

* **Input format (stdin)**:
  ```json
  {
    "session_id": "...",
    "transcript_path": "...",
    "cwd": "/path/to/project",
    "hook_event_name": "PreToolUse",
    "tool_name": "Bash",
    "tool_input": {
      "command": "git commit -m 'feat: something'"
    }
  }
  ```
* **Blocking output (stdout)**:
  ```json
  {
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": "Reason displayed to the model"
    }
  }
  ```

---

### B. Gemini / Antigravity (`.agents/hooks.json`)

```json
{
  "commit-guard": {
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          {
            "type": "command",
            "command": "node ./hooks/check-commit.js",
            "timeout": 30
          }
        ]
      }
    ]
  },
  "auto-formatter": {
    "PostToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          {
            "type": "command",
            "command": "node ./hooks/auto-lint.js"
          }
        ]
      }
    ]
  }
}
```

* **Input format (stdin)**:
  ```json
  {
    "conversationId": "...",
    "workspacePaths": ["/path/to/project"],
    "stepIdx": 10,
    "toolCall": {
      "name": "run_command",
      "args": {
        "CommandLine": "git commit -m 'feat: something'"
      }
    }
  }
  ```
* **Blocking output (stdout)**:
  ```json
  {
    "decision": "deny",
    "reason": "Reason displayed to the model"
  }
  ```

---

### C. Cursor (`.cursor/hooks.json`)

```json
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "command": "node .cursor/hooks/check-commit.js"
      }
    ],
    "afterShellExecution": [
      {
        "command": "node .cursor/hooks/auto-lint.js"
      }
    ]
  }
}
```

* **Input format (stdin)**:
  ```json
  {
    "command": "git commit -m 'feat: something'",
    "cwd": "/path/to/project"
  }
  ```
* **Blocking output (stdout)**:
  ```json
  {
    "permission": "deny",
    "user_message": "Reason displayed to the user",
    "agent_message": "Reason displayed to the model"
  }
  ```
