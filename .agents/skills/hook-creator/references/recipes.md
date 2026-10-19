# Complete Lifecycle Hook Recipes & Templates

This reference contains production-ready hook recipes for the Foundation across Claude Code, Gemini (Antigravity), and Cursor.

---

## Recipe 1: Conventional Commits Linter

**Goal**: Block `git commit` commands that do not adhere to Conventional Commits: `<type>(<scope>): <subject>`.

### Universal Handler Script (`check-commit.js`)
```javascript
#!/usr/bin/env node

const CONVENTIONAL_COMMIT_REGEX =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\([a-zA-Z0-9_.-]+\))?:\s.+/;

function extractCommand(payload) {
  return (
    payload?.tool_input?.command ||
    payload?.toolCall?.args?.CommandLine ||
    payload?.command ||
    ""
  );
}

function parseCommitMessage(cmd) {
  const match = cmd.match(/git\s+commit\b.*?-m\s+["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function buildResponse(payload, blocked, reason) {
  if (payload?.tool_name || payload?.hook_event_name) {
    // Claude Code
    if (blocked) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: reason
        }
      };
    }
    return {};
  }
  if (payload?.command && !payload?.toolCall) {
    // Cursor
    return blocked
      ? { permission: "deny", user_message: reason, agent_message: reason }
      : { permission: "allow" };
  }
  // Gemini / Antigravity
  return blocked ? { decision: "deny", reason: reason } : { decision: "allow" };
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const command = extractCommand(payload);

    if (/\bgit\s+commit\b/i.test(command)) {
      const message = parseCommitMessage(command);
      if (message && !CONVENTIONAL_COMMIT_REGEX.test(message)) {
        const reason =
          "Commit message violates Conventional Commits: '<type>(<scope>): <description>'. Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.";
        process.stdout.write(JSON.stringify(buildResponse(payload, true, reason)) + "\n");
        process.exit(0);
      }
    }

    process.stdout.write(JSON.stringify(buildResponse(payload, false, "")) + "\n");
    process.exit(0);
  } catch (_e) {
    process.stdout.write(JSON.stringify({ decision: "allow", permission: "allow" }) + "\n");
    process.exit(0);
  }
});
```

---

## Recipe 2: Block Force Pushes

**Goal**: Hard-block any `git push --force` or `git push -f` command to prevent overwriting shared remote branches.

### Universal Handler Script (`block-force-push.js`)
```javascript
#!/usr/bin/env node

function extractCommand(payload) {
  return (
    payload?.tool_input?.command ||
    payload?.toolCall?.args?.CommandLine ||
    payload?.command ||
    ""
  );
}

const REASON =
  "Force pushing (git push --force / -f) is strictly prohibited by project governance to prevent remote history loss.";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const command = extractCommand(payload);

    const isForcePush = /\bgit\s+push\b.*?(?:--force|-f\b|\+)/i.test(command);

    if (isForcePush) {
      if (payload?.tool_name || payload?.hook_event_name) {
        process.stdout.write(
          JSON.stringify({
            hookSpecificOutput: {
              hookEventName: "PreToolUse",
              permissionDecision: "deny",
              permissionDecisionReason: REASON
            }
          }) + "\n"
        );
      } else if (payload?.command && !payload?.toolCall) {
        process.stdout.write(
          JSON.stringify({
            permission: "deny",
            user_message: REASON,
            agent_message: REASON
          }) + "\n"
        );
      } else {
        process.stdout.write(JSON.stringify({ decision: "deny", reason: REASON }) + "\n");
      }
      process.exit(0);
    }

    process.stdout.write(JSON.stringify({ decision: "allow", permission: "allow" }) + "\n");
    process.exit(0);
  } catch (_e) {
    process.exit(0);
  }
});
```

---

## Recipe 3: Audit Trail / File Modification Logger

**Goal**: Asynchronously log every file created or modified by the agent to `.agents/audit-log.txt`.

### Universal Handler Script (`log-edits.js`)
```javascript
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const tool = payload?.tool_name || payload?.toolCall?.name || "edit";
    const file =
      payload?.tool_input?.file_path ||
      payload?.tool_input?.path ||
      payload?.toolCall?.args?.TargetFile ||
      "unknown";

    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} | TOOL: ${tool} | FILE: ${file}\n`;

    const logPath = path.resolve(process.cwd(), ".agents", "audit-log.txt");
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, logEntry, "utf8");

    process.stdout.write("{}\n");
    process.exit(0);
  } catch (_e) {
    process.exit(0);
  }
});
```

* Configured with `"async": true` in Claude Code / Gemini so it does not block the agent's turn.

---

## Recipe 4: Desktop Notification on Completion

**Goal**: Trigger a system notification when the agent finishes responding (`Stop` event).

### Handler Script (`notify-done.js`)
```javascript
#!/usr/bin/env node
const { exec } = require("child_process");
const os = require("os");

const title = "AI Workflow Foundation";
const message = "Agent finished feature work. Ready for review.";

if (os.platform() === "darwin") {
  exec(`osascript -e 'display notification "${message}" with title "${title}"'`);
} else if (os.platform() === "win32") {
  exec(
    `powershell -NoProfile -Command "[reflection.assembly]::loadwithpartialname('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('${message}', '${title}')"`
  );
} else {
  exec(`notify-send "${title}" "${message}"`);
}

process.stdout.write("{}\n");
process.exit(0);
```
