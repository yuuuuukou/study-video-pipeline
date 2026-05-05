# study-video-pipeline コンテンツ制作ガイドライン

「あれこれする会」YouTube チャンネル向けに、Remotion + VOICEVOX の動画生成パイプラインでコンテンツを作るときの方針メモです。台本やブログを書く前に必ず読んでください。

## 1. チャンネル文脈

### 「あれこれする会」とは

- 主催: yuko sugawara（@yuuuuukou_tech / Zenn: yuuuuukou）
- 拠点: 秋田市、ハイブリッド開催、月1ペース、4〜6人規模
- connpass: https://arekoresurukai.connpass.com/
- YouTube: https://www.youtube.com/@あれこれする会

### コミュニティの正しい説明

- もくもく会ではない。みんなでハンズオンをやりつつ技術を探求するコミュニティ。「手を動かす」がテーマ。
- 主テーマ: Azure、GitHub Copilot、Vibe Coding、ソースコードリーディング。
- 視聴者層: インフラ初心者〜中級。

### YouTube チャンネルの位置づけ

- 既存動画は勉強会フルアーカイブが中心。
- 短尺解説動画はこれから増やしていく領域。
- VOICEVOX（No.7・春日部つむぎ）合成音声で運用する。

## 2. 動画制作の方針

### ブログ先・動画後

長尺解説動画は、先にZenn技術記事を書いてから台本化する。先に記事を書くことで、正確性のレビュー、図・コード・スクショの再利用、画面表示・字幕・読み上げ文の分離がしやすくなる。

ショート動画は、スクラップや短いメモから直接作ってよい。ただし、技術説明は実装や一次情報を確認してから書く。

### 動画タイプ別の役割

| タイプ | 尺 | 役割 |
|---|---|---|
| ショート（縦長 1080x1920） | 30秒〜1分 | 冒頭で何の動画かを即提示し、興味を引く |
| 解説（横長） | 数分〜10分 | ブログ記事ベースで技術の中身を扱う |
| 勉強会アーカイブ | 90〜120分 | 勉強会本編 |

## 3. 台本作成ルール

### 内容の正確性

- 「インストールするだけで動く」など根拠不明な説明は避ける。
- 実装に触れる説明は、`package.json`、`scripts/*.js`、`remotion/src/*` を確認してから書く。
- 「JSON台本だけで動画化できる」は不正確。正しくは「Reactでテンプレートを一度作っておけば、あとはJSON台本を書くだけ」。
- Remotion / VOICEVOX をいきなり出さず、「映像はこれ・音声はこれ」という役割分担から導入する。

### キャラ運用

- speaker1（No.7）= 解説。
- speaker2（春日部つむぎ）= 質問・リアクション・初心者目線。
- 春日部つむぎは名乗らない。自己紹介セリフを入れない。

### `text` と `display_text` の分離

- `text`: VOICEVOX 読み上げ用。英略語もカタカナ化する。
- `display_text`: 字幕用。漢字・英語そのままでよい。
- `slide_points`: スライド表示用。通常表記で書く。
- 読み上げ用カタカナが字幕やスライドに出るのはバグとして扱う。

Java でいうと、同じ DTO の中に「処理用フィールド」と「表示用フィールド」が分かれている状態です。`text` と `display_text` を混ぜないでください。

### 構成の目安

- セクション数は2〜5個程度にする。
- 1セクションの `lines` は2〜6行程度にする。
- `slide_points` は各セクション3〜4項目程度にする。
- 対話は「春日部つむぎの質問・リアクション」→「No.7の解説・補足」を基本にする。
- 技術記事や勉強メモから起こす場合は、概念 → 使い方 → まとめ、の順でセクション分けすると見やすい。

### ショート専用ルール

- 冒頭1秒で「何の動画か」を即提示する。
- 先頭セクションは必ず `lines` を入れ、無音イントロにしない。最初の音が遅いと即スワイプされやすい。
- アウトロは短くする。
- 対象視聴者を書くときは、動画単体としての対象だけを書く。チャンネル全体の対象と混ぜない。
- 「完璧じゃなくていい、手を動かそう」は勉強会のテーマ。動画にはそのまま転載しない。書く場合は参加導線として扱う。
- compare layout を使うときは `compare_labels` で意味的なラベルにする。`Before/After` のままだと文脈が弱いことがある。

### コード掲載ルール

- code layout のスニペットは、視聴者が手元で再現できる最小単位にする。
- 長いコマンドは縦長動画では折り返される前提で、読みやすい長さに整える。

## 4. レイアウト機能

| layout | 想定用途 | 注意点 |
|---|---|---|
| bullets | 番号付き箇条書き | デフォルト |
| code | コードブロック | `slide_points` の各要素が1行 |
| compare | 左右2列比較 | `compare_labels: [left, right]` でラベル指定可 |
| image | 画像＋キャプション | `slide_points[0]` が画像パス/URL、`[1..]` がキャプション |
| table | 表 | `|` 区切り、ヘッダ + データ行 |
| video | 動画クリップ＋キャプション | `video.src` が動画パス/URL、`slide_points` がキャプション |

### アセット配置

- 画像: `remotion/public/images/...`
- 動画クリップ: `remotion/public/clips/...`
- 音声: `output/audio/<slug>/` に生成され、`remotion/public/audio/<slug>/` にコピーされる。

`staticFile()` から参照するパスは `remotion/public/` からの相対パスにする。

### 縦長レイアウト

- `StudyVideoVertical` は YouTube Shorts 向けの 1080x1920。
- スライドは画面中央に配置される。
- 字幕はスライドコンテンツの直下に配置される。

## 5. ワークフロー

### Video Outline Review Gate

新規動画を作るときは、台本JSONを作る前にアウトラインレビューを必ず挟む。

目的は、`section_title` と `display_text` の流れ、スライドタイトル、図表・画像・表・動画クリップの有無を先に固定すること。Javaでいうと、実装に入る前に DTO の中身と画面遷移をレビューする工程です。

AIは、`docs/video-outline-review-template.md` の形式で次を提示し、ユーザーのOKを待つ。

- 動画タイトル、想定尺、横長/縦長、参照元
- 各 section の `section_title`
- 各 section の `layout`
- 各 section のスライド表示内容（`slide_points` 相当）
- 各 section の `display_text` アウトライン
- 図表・画像・表・動画クリップの有無、必要な素材、素材パス、生成コマンドや参照元
- 断定表現や未確認情報があれば `[要確認]` として止める

ユーザーから明示的にOKが出るまで、次へ進まない。

- VOICEVOX用の `text` を作らない
- 音声合成しない
- props生成しない
- Remotionレンダリングしない

### Zenn記事

1. frontmatter を用意する。`emoji`、`topics`、`type: tech`、`published: false` を基本にする。
2. 章立て、各章の要点、素材リスト（図・コード・スクショ）だけを先に書く。
3. ユーザー OK 後に本文を書く。
4. 本文と素材が揃ってから台本化する。

### 短尺ショート

1. Video Outline Review Gate を通す。
2. ユーザーOK後に台本JSONを作成する。公開サンプルとして残すものは `examples/<slug>.json`、作業用・生成用は `output/scripts/...` を使う。
3. VOICEVOXを起動する。
4. 音声生成と props 生成を行う。

   ```powershell
   node scripts/synthesize.js examples/<slug>.json output/audio/<slug>
   node scripts/make-props.js examples/<slug>.json output/audio/<slug>
   ```

5. 縦長でレンダリングする。

   ```powershell
   cd remotion
   npx remotion render StudyVideoVertical "../output/videos/<slug>.mp4" --props="../examples/<slug>.props.json"
   ```

6. 代表フレームや出力動画を確認し、必要なら修正して再レンダリングする。

### 横長解説動画

1. Zenn記事のアウトラインを作る。
2. 本文と素材を整える。
3. 記事から動画用の Video Outline Review Gate を作る。
4. ユーザーOK後に台本JSONを起こす。
5. `node scripts/render.js <台本JSON>` でレンダリングする。
6. レビューして修正する。

## 6. やらないこと

- 台本だけで長尺を作る。
- 新規動画でアウトラインレビューなしに台本JSON・音声・動画を作る。
- 「JSON台本だけで動画化」と説明する。
- 春日部つむぎに自己紹介させる。
- Remotion / VOICEVOX を文脈なしで紹介する。
- 実装根拠のない説明をする。
- チャンネル対象と動画対象を混在させる。
- 勉強会のテーマを動画本文にそのまま転載する。
- 字幕に読み上げ用カタカナを出す。
- ショート冒頭で「何の動画か」を提示しない。
