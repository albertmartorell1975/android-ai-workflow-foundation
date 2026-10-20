# Android AI Workflow Foundation - Safety Hook for Windows / Antigravity (PowerShell)
#
# PURPOSE & PLATFORM COMPATIBILITY:
# - Language: PowerShell (.ps1). Windows-native implementation using built-in PowerShell engine.
# - Target Providers: Windows environments with Gemini / Antigravity or Cursor.
# - Alternative Choice: Native Windows alternative for environments without Node.js runtime installed.
#   (For the primary universal multi-platform Node.js hook, see block-rm-rf.template.js).
#
# Intercepts shell execution before it runs to strictly block:
# - Destructive deletions: rm -rf, rmdir /s /q
# - Destructive Git resets: git reset --hard
# - Destructive Git cleans: git clean -f
# - Autonomous PR merges: gh pr merge (must always be human-approved)
# - Destructive force pushes: git push --force / -f
$ErrorActionPreference = "SilentlyContinue"

$rawInput = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($rawInput)) {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

try {
    $payload = ConvertFrom-Json $rawInput
    $command = $payload.toolCall.args.CommandLine
    if ([string]::IsNullOrWhiteSpace($command)) {
        $command = $payload.command
    }
} catch {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

$blockReason = $null
$segments = $command -split '[;&|\r\n]'

foreach ($seg in $segments) {
    $trimmed = $seg.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) { continue }

    # 1. rm -rf or rmdir /s /q
    if ($trimmed -match '(?:^|\s)(?:(?:sudo|command)\s+)?(?:\/[\w.-]+\/)?rm\s+(.+)$') {
        $argsPart = $Matches[1]
        $hasRecursive = ($argsPart -match '-[a-zA-Z]*[rR]' -or $argsPart -match '--recursive')
        $hasForce = ($argsPart -match '-[a-zA-Z]*f' -or $argsPart -match '--force' -or $argsPart -match '-fo')
        if ($hasRecursive -and $hasForce) {
            $blockReason = "Blocked by Android AI Workflow Foundation safety hook: Executing 'rm -rf' (recursive forced deletion) is strictly prohibited to prevent accidental data loss."
            break
        }
    }
    if ($trimmed -match '\brmdir\s+.*\/s\b' -and $trimmed -match '\brmdir\s+.*\/q\b') {
        $blockReason = "Blocked by Android AI Workflow Foundation safety hook: Executing 'rmdir /s /q' is strictly prohibited."
        break
    }

    # 2. git reset --hard
    if ($trimmed -match '\bgit\s+reset\s+--hard\b') {
        $blockReason = "Blocked by Android AI Workflow Foundation safety hook: Executing 'git reset --hard' is strictly prohibited because it can permanently discard uncommitted changes. Please manage Git state cleanly or ask the user."
        break
    }

    # 3. git clean -f
    if ($trimmed -match '\bgit\s+clean\s+-[a-zA-Z]*f' -or $trimmed -match '\bgit\s+clean\s+.*--force\b') {
        $blockReason = "Blocked by Android AI Workflow Foundation safety hook: Executing 'git clean -f' (forced untracked removal) is strictly prohibited."
        break
    }

    # 4. gh pr merge
    if ($trimmed -match '\bgh\s+pr\s+merge\b') {
        $blockReason = "Blocked by Android AI Workflow Foundation safety hook: Autonomous 'gh pr merge' is strictly prohibited. Merging a Pull Request is exclusively reserved for human review on GitHub."
        break
    }

    # 5. git push --force
    if ($trimmed -match '\bgit\s+push\s+.*(?:--force\b|-f\b)') {
        $blockReason = "Blocked by Android AI Workflow Foundation safety hook: Executing force push ('git push --force' or '-f') is strictly prohibited."
        break
    }
}

if ($blockReason) {
    @{
        decision = "deny"
        reason = $blockReason
    } | ConvertTo-Json -Compress
} else {
    @{
        decision = "allow"
    } | ConvertTo-Json -Compress
}
exit 0
