# Copilot運用メモ

このリポジトリは、台本JSONから VOICEVOX 音声と Remotion 動画を生成する `study-video-pipeline` です。

## 基本方針

- コミットメッセージは日本語を基本にする。
- `git add -A` は使わない。コミット前に `git status` または `git diff --staged` で対象ファイルを確認し、意図したファイルだけをステージする。
- push は明示的に「pushして」と指示があるまで実行しない。commit と push は別操作として扱う。
- ドキュメントやZenn記事などを書くときは、セクション単位で確認しながら進める。一度に全体を書き切らない。

## 失敗時の備忘

作業中にコマンドのクォート、JSON解析、GitHub CLI、Remotion の props 指定などで失敗した場合は、再発防止のためこのファイルに短い備忘を残す。

備忘には「何が失敗したか」「次回どう避けるか」を書く。

## コンテンツ制作

動画台本やブログ記事を作るときは、着手前に `docs/content-authoring-guidelines.md` を読む。

特に以下を守る。

- 新規動画を作る依頼では、いきなり台本JSON・音声・動画を作らない。先に `docs/video-outline-review-template.md` の形でアウトラインを提示し、ユーザーのOKを得る。
- アウトラインでは `section_title`、`layout`、スライド表示内容、`display_text`、図表・画像・表・動画クリップの有無を必ず並べる。
- ユーザーのOK前に、VOICEVOX用の `text` 作成、音声合成、props生成、Remotionレンダリングへ進まない。
- `text` は VOICEVOX 読み上げ用、`display_text` は字幕表示用として分ける。
- 読み上げ用カタカナを字幕やスライドに出さない。
- speaker1（No.7）は解説、speaker2（春日部つむぎ）は質問・リアクション・初心者目線として使う。
- 春日部つむぎに自己紹介セリフを入れない。
- ショート動画は冒頭1秒で何の動画かを提示する。

## 見た目変更時の自律検証

`remotion/src/` や `remotion/public/` 配下など、見た目に関わる変更を加えたら、完了報告前に代表フレームを確認する。

1. `npx remotion still` で代表フレームの PNG を `tmp/` に出力する。

   ```powershell
   cd remotion
   npx remotion still StudyVideo "../tmp/verify-layout.png" --frame=<N> --props="../examples/<slug>.props.json"
   ```

   縦長ショートの場合は `StudyVideoVertical` を指定する。

2. 生成PNGを `view_image` で読み、変更意図と一致しているか確認する。
3. ズレていれば修正して再確認する。
4. 結果をユーザーに要約して報告する。

検証目的では `remotion still` を優先する。フルレンダリングは、ユーザーが動画作成・書き出しを求めている場合、または明示的に許可された場合に実行する。

## 完了前チェック

見た目・レンダリングに関わる作業を「完了」と報告する前に、必要に応じて以下を確認する。

- `npm run lint --prefix remotion` など、その変更に必要な静的チェックを実行済みである。
- `npx remotion still` の代表フレームを `view_image` で確認済みである。
- 動画レイアウト・時間変化・音声同期など still だけでは不十分な変更では、短い検証レンダリングまたは本番レンダリングを実行済みである。
- GitHub Issue を close する場合は、可能な限り検証 PNG / 短尺 mp4 / 実行コマンドを Issue コメントに残してから close する。
