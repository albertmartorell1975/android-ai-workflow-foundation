# Android AI Workflow Foundation - AGENTS.md Context Size Guard Hook (PowerShell)
#
# PURPOSE & PLATFORM COMPATIBILITY:
# - Language: PowerShell (.ps1). Windows-native implementation using built-in PowerShell engine.
# - Target Providers: Windows environments with Gemini / Antigravity or Cursor.
# - Single Responsibility: Enforces the strict 10 KB (10,240 bytes) limit on AGENTS.md before
#   allowing any git commit, preventing the "lost in the middle" degradation in AI context windows.
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
                if ($item.Length -gt 10240) {
                    $sizeKb = [math]::Round($item.Length / 1024, 1)
                    $blockReason = "Blocked by Android AI Workflow Foundation context size hook: '$cand' is $($item.Length) bytes ($sizeKb KB), which exceeds the maximum limit of 10 KB (10,240 bytes) to prevent the 'lost in the middle' effect in AI context windows. Please trim '$cand' by moving detailed rules into CONSTRAINTS.md or references/ before committing."
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
