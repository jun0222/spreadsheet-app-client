#!/bin/bash

# 置き換える環境変数
# 必須環境変数のチェック
if [ -z "$GAS_SHEET_ID" ] || [ -z "$GAS_SHEET_NAME" ] || [ -z "$GAS_ALLOWED_UID" ] || [ -z "$GAS_FIREBASE_API_KEY" ]; then
  echo "❌ 必須環境変数が未設定です。"
  exit 1
fi

# テンプレートファイル
INPUT_FILE="gas/text-share-app-backend.template.js"
# 出力ファイル
OUTPUT_FILE="gas/dist/text-share-app-backend.js"

# sed でプレースホルダを置換して出力
sed \
  -e "s|{{GAS_SHEET_ID}}|$GAS_SHEET_ID|g" \
  -e "s|{{GAS_SHEET_NAME}}|$GAS_SHEET_NAME|g" \
  -e "s|{{GAS_ALLOWED_UID}}|$GAS_ALLOWED_UID|g" \
  -e "s|{{GAS_FIREBASE_API_KEY}}|$GAS_FIREBASE_API_KEY|g" \
  "$INPUT_FILE" > "$OUTPUT_FILE"

echo "✅ 環境変数を置き換えました: $OUTPUT_FILE"
