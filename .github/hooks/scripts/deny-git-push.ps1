# Copilot エージェントによる無断 git push を防ぐための preToolUse フック (PowerShell 版)。
$ErrorActionPreference = "Stop"

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) {
    $raw = ($input | Out-String)
}
if ([string]::IsNullOrWhiteSpace($raw)) { exit 0 }

$payload = $raw | ConvertFrom-Json
if ($payload.toolName -ne "bash") { exit 0 }

# toolArgs は JSON 文字列として渡される。
$argsObj = $payload.toolArgs | ConvertFrom-Json
$command = [string]$argsObj.command
if ([string]::IsNullOrEmpty($command)) { exit 0 }

if ($command -match '(^|[^A-Za-z0-9_-])git\s+push(\s|$)') {
    $output = @{
        permissionDecision       = "deny"
        permissionDecisionReason = "git push はユーザーの明示的な承認なしには許可されていません。コミットのみ実行し、push はユーザーに依頼してください。"
    }
    $output | ConvertTo-Json -Compress
}

exit 0
