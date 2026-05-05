#!/bin/bash
# Copilot エージェントによる無断 git push を防ぐための preToolUse フック。
# bash ツールの toolArgs.command に `git push` が含まれていたら拒否する。

set -e
INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName // empty')
if [ "$TOOL_NAME" != "bash" ]; then
  exit 0
fi

COMMAND=$(echo "$INPUT" | jq -r '.toolArgs' | jq -r '.command // empty')

# `git push` 系コマンドを検出する。`git push --dry-run` も運用上シンプルに拒否する。
if echo "$COMMAND" | grep -qiE '(^|[^A-Za-z0-9_-])git[[:space:]]+push([[:space:]]|$)'; then
  jq -nc \
    --arg reason "git push はユーザーの明示的な承認なしには許可されていません。コミットのみ実行し、push はユーザーに依頼してください。" \
    '{permissionDecision: "deny", permissionDecisionReason: $reason}'
  exit 0
fi

exit 0
