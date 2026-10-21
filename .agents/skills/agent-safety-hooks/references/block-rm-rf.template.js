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
 * Intercepts shell execution before it runs to strictly block:
 * - Destructive deletions: rm -rf, rmdir /s /q
 * - Destructive Git resets: git reset --hard
 * - Destructive Git cleans: git clean -f
 * - Autonomous PR merges: gh pr merge (must always be human-approved)
 * - Destructive force pushes: git push --force / -f
 *
 * Materialized into the target project's hook directory:
 * - Claude Code: .claude/hooks/block-rm-rf.js
 * - Gemini / Antigravity: .agents/hooks/block-rm-rf.js
 * - Cursor: .cursor/hooks/block-rm-rf.js
 */

function isDestructiveRm(segment) {
  const rmPrefixRegex =
    /^\s*(?:(?:sudo|command|nohup|env|busybox)\s+)*(?:(?:sh|bash|zsh|cmd(?:\.exe)?|powershell(?:\.exe)?|pwsh(?:\.exe)?)\s+(?:-[a-zA-Z]+|\/[cC])\s+["']?\s*)*(?:\\|(?:\/[\w.-]+)+\/)?(?:rm|rmdir|del)\b(.*)$/i;

  const match = segment.match(rmPrefixRegex);
  if (!match) {
    return false;
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
    } else if (token === "--recursive" || /^\/[sS]$/.test(token)) {
      hasRecursive = true;
    } else if (token === "--force" || /^-fo(?:rce)?$/i.test(token) || /^\/[qQ]$/.test(token)) {
      hasForce = true;
    }

    if (hasRecursive && hasForce) {
      return true;
    }
  }

  return false;
}

function checkDestructiveCommand(commandLine) {
  if (!commandLine || typeof commandLine !== "string") {
    return null;
  }

  const segments = commandLine.split(/(?:;|\|\||&&|\||&|\r?\n|`|\$\()/);

  for (const rawSegment of segments) {
    const segment = rawSegment.trim();
    if (!segment) continue;

    // 1. Destructive RM checks (rm -rf, rmdir /s /q)
    if (isDestructiveRm(segment)) {
      return (
        "Blocked by Android AI Workflow Foundation safety hook: " +
        "Executing 'rm -rf' (recursive forced deletion) is strictly prohibited to prevent accidental data loss. " +
        "Please delete specific files safely using dedicated IDE tools or ask the user."
      );
    }

    // 2. Destructive Git Reset (git reset --hard)
    if (/\bgit\s+reset\s+--hard\b/i.test(segment)) {
      return (
        "Blocked by Android AI Workflow Foundation safety hook: " +
        "Executing 'git reset --hard' is strictly prohibited because it can permanently discard uncommitted changes " +
        "or subagent worktree work. Please manage Git state cleanly or ask the user."
      );
    }

    // 3. Destructive Git Clean (git clean -fd / -fdx / -fx)
    if (/\bgit\s+clean\s+-[a-zA-Z]*f/i.test(segment) || /\bgit\s+clean\s+.*--force\b/i.test(segment)) {
      return (
        "Blocked by Android AI Workflow Foundation safety hook: " +
        "Executing 'git clean -f' (forced untracked removal) is strictly prohibited to prevent losing local project files."
      );
    }

    // 4. Autonomous PR Merge (gh pr merge)
    if (/\bgh\s+pr\s+merge\b/i.test(segment)) {
      return (
        "Blocked by Android AI Workflow Foundation safety hook: " +
        "Autonomous 'gh pr merge' is strictly prohibited. Merging a Pull Request is exclusively reserved for human review on GitHub."
      );
    }

    // 5. Destructive Force Push (git push --force / -f)
    if (/\bgit\s+push\s+.*(?:--force\b|-f\b)/i.test(segment)) {
      return (
        "Blocked by Android AI Workflow Foundation safety hook: " +
        "Executing force push ('git push --force' or '-f') is strictly prohibited to prevent overwriting shared Git history."
      );
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

      const blockReason = checkDestructiveCommand(commandLine);
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
