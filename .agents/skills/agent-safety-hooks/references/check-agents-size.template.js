#!/usr/bin/env node

/**
 * Android AI Workflow Foundation - AGENTS.md Context Size Guard Hook (JavaScript / Node.js)
 *
 * PURPOSE & PLATFORM COMPATIBILITY:
 * - Language: Node.js (JavaScript). Universal multi-platform implementation (macOS, Linux, Windows).
 * - Target Providers: Claude Code, Gemini / Antigravity, Cursor.
 * - Single Responsibility: Enforces the strict 10 KB (10,240 bytes) limit on AGENTS.md before
 *   allowing any git commit, preventing the "lost in the middle" degradation in AI context windows.
 *
 * Materialized into the target project's hook directory:
 * - Claude Code: .claude/hooks/check-agents-size.js
 * - Gemini / Antigravity: .agents/hooks/check-agents-size.js
 * - Cursor: .cursor/hooks/check-agents-size.js
 */

const fs = require("fs");
const path = require("path");

const MAX_SIZE_BYTES = 10240; // 10 KB

function checkAgentsSizeOnCommit(commandLine) {
  if (!commandLine || typeof commandLine !== "string") {
    return null;
  }

  const segments = commandLine.split(/(?:;|\|\||&&|\||&|\r?\n|`|\$\()/);

  for (const rawSegment of segments) {
    const segment = rawSegment.trim();
    if (!segment) continue;

    if (/\bgit\s+commit\b/i.test(segment)) {
      for (const candidate of ["AGENTS.md", "agents.md"]) {
        const filePath = path.resolve(process.cwd(), candidate);
        if (fs.existsSync(filePath)) {
          try {
            const stats = fs.statSync(filePath);
            if (stats.size > MAX_SIZE_BYTES) {
              return (
                `Blocked by Android AI Workflow Foundation context size hook: '${candidate}' is ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB), ` +
                "which exceeds the maximum limit of 10 KB (10,240 bytes) to prevent the 'lost in the middle' effect in AI context windows. " +
                `Please trim '${candidate}' by moving detailed rules into CONSTRAINTS.md or references/ before committing.`
              );
            }
          } catch (_err) {
            // Ignore stat errors
          }
        }
      }
    }
  }

  return null;
}

function buildResponse(payload, blockReason) {
  // 1. Claude Code format (`tool_name` / `tool_input` / `hook_event_name`)
  if (
    payload &&
    (typeof payload.tool_name === "string" ||
      typeof payload.tool_input === "object" ||
      typeof payload.hook_event_name === "string")
  ) {
    if (blockReason) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: blockReason
        }
      };
    }
    return null;
  }

  // 2. Cursor format (`beforeShellExecution` with top-level `command`)
  if (payload && typeof payload.command === "string" && !payload.toolCall) {
    if (blockReason) {
      return {
        permission: "deny",
        user_message: blockReason,
        agent_message: blockReason
      };
    }
    return {
      permission: "allow"
    };
  }

  // 3. Antigravity / Gemini format (`toolCall` in `.agents/hooks.json`)
  if (blockReason) {
    return {
      decision: "deny",
      reason: blockReason
    };
  }
  return {
    decision: "allow"
  };
}

function main() {
  let rawInput = "";
  process.stdin.setEncoding("utf8");

  process.stdin.on("data", (chunk) => {
    rawInput += chunk;
  });

  process.stdin.on("end", () => {
    try {
      const payload = rawInput.trim() ? JSON.parse(rawInput) : {};

      const commandLine =
        payload?.tool_input?.command ||
        payload?.tool_input?.CommandLine ||
        payload?.toolCall?.args?.CommandLine ||
        payload?.toolCall?.args?.command ||
        payload?.command ||
        "";

      const blockReason = checkAgentsSizeOnCommit(commandLine);
      const response = buildResponse(payload, blockReason);

      if (response !== null) {
        process.stdout.write(JSON.stringify(response) + "\n");
      }
      process.exit(0);
    } catch (_err) {
      process.exit(0);
    }
  });
}

main();
