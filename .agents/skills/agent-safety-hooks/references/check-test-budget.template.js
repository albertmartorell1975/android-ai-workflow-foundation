#!/usr/bin/env node

/**
 * Android AI Workflow Foundation - Strict Test Budget Guard Hook (JavaScript / Node.js)
 *
 * PURPOSE & PLATFORM COMPATIBILITY:
 * - Language: Node.js (JavaScript). Universal multi-platform implementation (macOS, Linux, Windows).
 * - Target Providers: Claude Code, Gemini / Antigravity, Cursor.
 * - Single Responsibility: Enforces the strict test budget (max 6 new @Test annotations per commit)
 *   before allowing any git commit, preventing trivial/watermelon test bloat.
 *
 * Materialized into the target project's hook directory:
 * - Claude Code: .claude/hooks/check-test-budget.js
 * - Gemini / Antigravity: .agents/hooks/check-test-budget.js
 * - Cursor: .cursor/hooks/check-test-budget.js
 */

const { execFileSync, execSync } = require("child_process");

const MAX_NEW_TESTS = 6;

function countAddedTestsInFile(filePath) {
  const diffOutput = execFileSync("git", ["diff", "--cached", "-U0", "--", filePath], {
    encoding: "utf8"
  });

  let count = 0;
  for (const line of diffOutput.split(/\r?\n/)) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      const matches = line.match(/@Test\b/g);
      if (matches) {
        count += matches.length;
      }
    }
  }
  return count;
}

function checkTestBudgetOnCommit(commandLine) {
  if (!commandLine || typeof commandLine !== "string") {
    return null;
  }

  const segments = commandLine.split(/(?:;|\|\||&&|\||&|\r?\n|`|\$\()/);
  const hasCommit = segments.some((raw) => /\bgit\s+commit\b/i.test(raw.trim()));
  if (!hasCommit) {
    return null;
  }

  try {
    const stagedOutput = execSync("git diff --cached --name-only", { encoding: "utf8" }).trim();
    if (!stagedOutput) {
      return null;
    }

    const testFiles = stagedOutput
      .split(/\r?\n/)
      .map((file) => file.trim())
      .filter((file) => file.endsWith("Test.kt"));

    if (testFiles.length === 0) {
      return null;
    }

    let totalNewTests = 0;
    for (const file of testFiles) {
      try {
        totalNewTests += countAddedTestsInFile(file);
      } catch (_err) {
        // Ignore per-file diff errors and continue evaluating remaining files
      }
    }

    if (totalNewTests > MAX_NEW_TESTS) {
      return (
        `Blocked by Android AI Workflow Foundation test budget hook: staged changes introduce ${totalNewTests} new @Test annotations (max ${MAX_NEW_TESTS} allowed per commit). ` +
        `This violates the 'Zero Trivial Tests Mandate'. Review your *Test.kt files and delete trivial tests ` +
        `(1:1 pass-through UseCases, data class getters/properties, static preview data) or consolidate branch tests before committing.`
      );
    }
  } catch (_err) {
    // Fail open if git commands fail, avoiding blocking non-git or edge environments
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

      const blockReason = checkTestBudgetOnCommit(commandLine);
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
