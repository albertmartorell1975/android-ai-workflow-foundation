# Android AI Workflow Foundation - Safety Hook for Windows / Antigravity (PowerShell)
#
# PURPOSE & PLATFORM COMPATIBILITY:
# - Language: PowerShell (.ps1). Windows-native implementation using built-in PowerShell engine.
# - Target Providers: Windows environments with Gemini / Antigravity or Cursor.
# - Alternative Choice: Native Windows alternative for environments without Node.js runtime installed.
#   (For the primary universal multi-platform Node.js hook, see block-rm-rf.template.js).
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

$blockReason = "Blocked by Android AI Workflow Foundation safety hook: Executing 'rm -rf' (recursive forced deletion) is strictly prohibited in this project to prevent accidental data or source code loss."

# Check if command contains rm with recursive and force flags
$isBlocked = $false
$segments = $command -split '[;&|\r\n]'

foreach ($seg in $segments) {
    $trimmed = $seg.Trim()
    if ($trimmed -match '(?:^|\s)(?:(?:sudo|command)\s+)?(?:\/[\w.-]+\/)?rm\s+(.+)$') {
        $argsPart = $Matches[1]
        $hasRecursive = ($argsPart -match '-[a-zA-Z]*[rR]' -or $argsPart -match '--recursive')
        $hasForce = ($argsPart -match '-[a-zA-Z]*f' -or $argsPart -match '--force' -or $argsPart -match '-fo')
        if ($hasRecursive -and $hasForce) {
            $isBlocked = $true
            break
        }
    }
}

if ($isBlocked) {
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
