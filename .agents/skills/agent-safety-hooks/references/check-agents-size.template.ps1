# Android AI Workflow Foundation - AGENTS.md Context Size Guard Hook (PowerShell)
#
# PURPOSE & PLATFORM COMPATIBILITY:
# - Language: PowerShell (.ps1). Windows-native implementation using built-in PowerShell engine.
# - Target Providers: Windows environments with Gemini / Antigravity or Cursor.
# - Single Responsibility: Enforces the strict instruction budget (120 lines / 6 KB [6,144 bytes])
#   on AGENTS.md before allowing any git commit, preventing "lost in the middle" and context rot
#   degradation in AI context windows.
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

    if ($trimmed -match '\bgit\s+commit\b') {
        foreach ($cand in @("AGENTS.md", "agents.md")) {
            if (Test-Path $cand) {
                $item = Get-Item $cand
                $lines = @(Get-Content $cand).Count
                if ($lines -gt 120 -or $item.Length -gt 6144) {
                    $sizeKb = [math]::Round($item.Length / 1024, 1)
                    $blockReason = "Blocked by Android AI Workflow Foundation context size hook: '$cand' is $lines lines and $($item.Length) bytes ($sizeKb KB), which exceeds the instruction budget hard cap of 120 lines / 6 KB (6,144 bytes) to prevent 'lost in the middle' and context rot degradation. Please trim '$cand' (target < 100 lines) by moving detailed rules into CONSTRAINTS.md or references/ before committing."
                    break
                }
            }
        }
        if ($blockReason) { break }
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
