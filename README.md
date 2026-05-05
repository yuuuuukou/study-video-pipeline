# study-video-pipeline

台本JSONから、VOICEVOXの音声とRemotionの動画を生成する最小サンプルです。

このリポジトリは、Zenn本「台本JSONから解説動画を作る: Remotion + VOICEVOX動画生成パイプライン入門」で使う公開用サンプルとして切り出したものです。

## 処理の流れ

```text
examples/sample.json
  -> scripts/synthesize.js
  -> output/audio/<slug>/*.wav
  -> scripts/make-props.js
  -> examples/<slug>.props.json
  -> Remotion render
  -> output/videos/<slug>.mp4
```

## 必要なもの

確認済み環境:

- Node.js v24.14.1
- npm 11.11.0
- Remotion 4.0.454
- VOICEVOX 0.25.1

VOICEVOXはGUIアプリを起動し、ローカルAPI `http://localhost:50021` が使える状態にしてください。

```powershell
Invoke-RestMethod "http://localhost:50021/version"
```

別のVOICEVOX互換APIに向けたい場合は、`VOICEVOX_URL` で上書きできます。

```powershell
$env:VOICEVOX_URL = "http://localhost:50021"
```

## セットアップ

```powershell
cd study-video-pipeline
npm install --prefix remotion
```

詳しいセットアップ確認は [`docs/setup.md`](docs/setup.md) も参照してください。

## 話者ID

`remotion/src/speaker-config.json` の `voicevoxId` は、あなたの環境で使うVOICEVOXの話者/スタイルIDに合わせてください。

```powershell
Invoke-RestMethod "http://localhost:50021/speakers"
```

初期値は執筆時点の検証環境で使っていた値です。

## サンプルをレンダリングする

VOICEVOXを起動した状態で実行します。

```powershell
node scripts/render.js examples/sample.json
```

出力先:

```text
output/videos/sample.mp4
```

## トラブルシュート

### 生成物を消して再実行する

生成済みファイルが古い、音声と動画がずれる、または設定変更が反映されない場合は、生成物を削除してから再実行してください。

```powershell
Remove-Item -Recurse -Force output, remotion/public/audio, examples/*.props.json -ErrorAction SilentlyContinue
node scripts/render.js examples/sample.json
```

`remotion/public/audio/` と `examples/*.props.json` はレンダリング時に再生成されます。

## ファイル構成

```text
scripts/               Node.jsのパイプラインスクリプト
remotion/              Remotionプロジェクト
examples/sample.json   最小サンプルの台本JSON
output/audio/          生成されたWAVファイル。git管理外
remotion/public/audio/ RemotionのstaticFile()用にコピーされたWAVファイル。git管理外
output/videos/         生成されたMP4ファイル。git管理外
```

## ライセンスと生成物

このリポジトリのMIT Licenseは、このリポジトリのために作成した自作ソースコードにのみ適用されます。生成ファイル、第三者ソフトウェア、素材、音声ライブラリ、生成音声、生成動画には適用されません。

このライセンスは、第三者ソフトウェア、VOICEVOX音声ライブラリ、生成音声、生成動画、公式キャラクター素材の利用権を与えるものではありません。生成物を公開・収益化する前に、`NOTICE.md` と `THIRD_PARTY_NOTICES.md` を確認してください。

## クレジットと生成物の扱い

このリポジトリには、VOICEVOX、VOICEVOX ENGINE、VOICEVOX CORE、VOICEVOX音声ライブラリ、生成WAVファイル、生成MP4ファイル、公式キャラクター素材は含まれていません。

サンプルでは、話者表示に抽象的なプレースホルダーSVGを使っています。公式の立ち絵やLive2Dモデルなどのキャラクター素材を使う場合は、それぞれの素材利用条件に従ってください。公式キャラクター素材、生成音声ファイル、生成動画を再利用可能な素材として再配布したり、自作物として扱ったりしないでください。

生成した動画を公開する場合は、VOICEVOX本体と各音声ライブラリの規約に従い、必要なクレジット表記を行ってください。

## 補足

- `output/` と `remotion/public/audio/` は生成物であり、git管理外です。
- `examples/*.props.json` は生成物であり、git管理外です。
- Remotion Studioの起動時には、プレビューや初期表示のためのダミーpropsが使われることがあります。実際のpropsは台本JSONからレンダリングして生成してください。
- このプロジェクトは第三者依存としてRemotionを使用します。RemotionはRemotion Licenseの対象です。

---

## English follows

This is a minimal sample that generates VOICEVOX audio and a Remotion video from
a script JSON file.

This repository is the public sample repository for the Zenn book "台本JSONから解説動画を作る: Remotion + VOICEVOX動画生成パイプライン入門".

## What This Does

```text
examples/sample.json
  -> scripts/synthesize.js
  -> output/audio/<slug>/*.wav
  -> scripts/make-props.js
  -> examples/<slug>.props.json
  -> Remotion render
  -> output/videos/<slug>.mp4
```

## Requirements

Verified environment:

- Node.js v24.14.1
- npm 11.11.0
- Remotion 4.0.454
- VOICEVOX 0.25.1

Start the VOICEVOX GUI app and make sure the local API at
`http://localhost:50021` is available.

```powershell
Invoke-RestMethod "http://localhost:50021/version"
```

To use another VOICEVOX-compatible API endpoint, set `VOICEVOX_URL`.

```powershell
$env:VOICEVOX_URL = "http://localhost:50021"
```

## Setup

```powershell
cd study-video-pipeline
npm install --prefix remotion
```

See [`docs/setup.md`](docs/setup.md) for a more detailed setup check.

## Speaker IDs

Update `voicevoxId` in `remotion/src/speaker-config.json` to match the
speaker/style IDs in your VOICEVOX environment.

```powershell
Invoke-RestMethod "http://localhost:50021/speakers"
```

The default values are the IDs used in the author's verification environment at
the time of writing.

## Render Sample

Run this while VOICEVOX is running:

```powershell
node scripts/render.js examples/sample.json
```

Output:

```text
output/videos/sample.mp4
```

## Troubleshooting

### Regenerate From A Clean State

If generated files are stale, audio and video are out of sync, or configuration
changes are not reflected, delete generated files and run the pipeline again.

```powershell
Remove-Item -Recurse -Force output, remotion/public/audio, examples/*.props.json -ErrorAction SilentlyContinue
node scripts/render.js examples/sample.json
```

`remotion/public/audio/` and `examples/*.props.json` are regenerated during
rendering.

## Files

```text
scripts/               Node.js pipeline scripts
remotion/              Remotion project
examples/sample.json   Minimal script JSON
output/audio/          Generated WAV files; ignored by git
remotion/public/audio/ WAV files copied for Remotion staticFile(); ignored by git
output/videos/         Generated MP4 files; ignored by git
```

## License And Generated Content

Only the original source code authored for this repository is licensed under
the MIT License. The MIT License does not apply to generated files or
third-party software, assets, voice libraries, voices, or videos.

This does not grant rights to third-party software, VOICEVOX voice libraries,
generated voices, generated videos, or official character assets. See
`NOTICE.md` and `THIRD_PARTY_NOTICES.md` before publishing or monetizing
generated content.

## Credits And Generated Content

This repository does not include VOICEVOX, VOICEVOX ENGINE, VOICEVOX CORE,
VOICEVOX voice libraries, generated WAV files, generated MP4 files, or official
character assets.

The sample uses abstract placeholder SVGs for speakers. If you use official
character materials such as standing images or Live2D models, follow the terms
for those materials. Do not redistribute official character assets, generated
voice files, or generated videos as reusable materials, and do not claim them as
your own work.

If you publish generated videos, follow the VOICEVOX terms and each voice
library's terms, including required credit notation.

## Notes

- `output/` and `remotion/public/audio/` are generated and ignored.
- `examples/*.props.json` is generated and ignored.
- Studio startup may use dummy default props for preview/bootstrap purposes;
  render from a script JSON to generate actual props.
- This project uses Remotion as a third-party dependency. Remotion is licensed
  separately under the Remotion License.
