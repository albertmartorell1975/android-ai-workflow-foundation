#!/usr/bin/env node

/**
 * Android AI Workflow Foundation - Agent Safety Hook Template (JavaScript / Node.js)
 *
 * PURPOSE & PLATFORM COMPATIBILITY:
 * - Language: Node.js (JavaScript). Universal multi-platform implementation (macOS, Linux, Windows).
 * - Target Providers: Claude Code, Gemini / Antigravity, Cursor.
 * - Primary Choice: This is the default multi-provider hook implementation in the Foundation.
 *   (For a Windows-native PowerShell alternative without Node.js runtime requirement, see block-rm-rf.template.ps1).
 *
 * Materialized into the target project's hook directory:
 * - Claude Code: .claude/hooks/block-rm-rf.js
 * - Gemini / Antigravity: .agents/hooks/block-rm-rf.js
 * - Cursor: .cursor/hooks/block-rm-rf.js
 */

const BLOCK_REASON =
  "Blocked by Android AI Workflow Foundation safety hook: " +
  "Executing 'rm -rf' (recursive forced deletion) is strictly prohibited in this project to prevent " +
  "accidental data or source code loss. Please remove specific files safely using dedicated IDE tools " +
  "or ask the user to delete directories manually.";

function isDestructiveRmCommand(commandLine) {
  if (!commandLine || typeof commandLine !== "string") {
    return false;
  }

  const segments = commandLine.split(/(?:;|\|\||&&|\||&|\r?\n|`|\$\()/);

  const rmPrefixRegex =
    /^\s*(?:(?:sudo|command|nohup|env|busybox)\s+)*(?:(?:sh|bash|zsh|cmd(?:\.exe)?|powershell(?:\.exe)?|pwsh(?:\.exe)?)\s+(?:-[a-zA-Z]+|\/[cC])\s+["']?\s*)*(?:\\|(?:\/[\w.-]+)+\/)?rm\b(.*)$/i;

  for (const segment of segments) {
    const match = segment.match(rmPrefixRegex);
    if (!match) {
      continue;
    }

    const argsSegment = match[1] || "";
    const tokens = argsSegment
      .trim()
      .split(/\s+/)
      .map((token) => token.replace(/^["']|["']$/g, ""));

    let hasRecursive = false;
    let hasForce = false;

    for (const token of tokens) {
      if (!token || token === "--") {
        if (token === "--") break;
        continue;
      }

      if (/^-[a-zA-Z]+$/.test(token)) {
        const flags = token.slice(1);
        if (/[rR]/.test(flags)) {
          hasRecursive = true;
        }
        if (/f/i.test(flags)) {
          hasForce = true;
        }
      } else if (token === "--recursive") {
        hasRecursive = true;
      } else if (token === "--force" || /^-fo(?:rce)?$/i.test(token)) {
        hasForce = true;
      }

      if (hasRecursive && hasForce) {
        return true;
      }
    }
  }

  return false;
}

function buildResponse(payload, blocked) {
  // 1. Claude Code format (`tool_name` / `tool_input` / `hook_event_name`)
  if (
    payload &&
    (typeof payload.tool_name === "string" ||
      typeof payload.tool_input === "object" ||
      typeof payload.hook_event_name === "string")
  ) {
    if (blocked) {
      return {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: BLOCK_REASON
        }
      };
    }
    return null;
  }

  // 2. Cursor format (`beforeShellExecution` with top-level `command`)
  if (payload && typeof payload.command === "string" && !payload.toolCall) {
    if (blocked) {
      return {
        permission: "deny",
        user_message: BLOCK_REASON,
        agent_message: BLOCK_REASON
      };
    }
    return {
      permission: "allow"
    };
  }

  // 3. Antigravity / Gemini format (`toolCall` in `.agents/hooks.json`)
  if (blocked) {
    return {
      decision: "deny",
      reason: BLOCK_REASON
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

      const blocked = isDestructiveRmCommand(commandLine);
      const response = buildResponse(payload, blocked);

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
