# study-video-pipeline

台本JSONから、VOICEVOXの音声とRemotionの動画を生成する最小サンプルです。

このリポジトリは、Zenn本「台本JSONから解説動画を作る: Remotion + VOICEVOX動画生成パイプライン入門」で使う公開用サンプルとして切り出したものです。

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

VOICEVOXはGUIアプリを起動し、ローカルAPI `http://localhost:50021` が使える状態にしてください。

```powershell
Invoke-RestMethod "http://localhost:50021/version"
```

別のVOICEVOX互換APIに向けたい場合は、`VOICEVOX_URL` で上書きできます。

```powershell
$env:VOICEVOX_URL = "http://localhost:50021"
```

## Setup

```powershell
cd study-video-pipeline
npm install --prefix remotion
```

詳しいセットアップ確認は [`docs/setup.md`](docs/setup.md) も参照してください。

## Speaker IDs

`remotion/src/speaker-config.json` の `voicevoxId` は、あなたの環境で使うVOICEVOXの話者/スタイルIDに合わせてください。

```powershell
Invoke-RestMethod "http://localhost:50021/speakers"
```

初期値は執筆時点の検証環境で使っていた値です。

## Render Sample

VOICEVOXを起動した状態で実行します。

```powershell
node scripts/render.js examples/sample.json
```

出力先:

```text
output/videos/sample.mp4
```

## Troubleshooting

### Regenerate From A Clean State

生成済みファイルが古い、音声と動画がずれる、または設定変更が反映されない場合は、生成物を削除してから再実行してください。

```powershell
Remove-Item -Recurse -Force output, remotion/public/audio, examples/*.props.json -ErrorAction SilentlyContinue
node scripts/render.js examples/sample.json
```

`remotion/public/audio/` と `examples/*.props.json` はレンダリング時に再生成されます。

## Files

```text
scripts/             Node.js pipeline scripts
remotion/            Remotion project
examples/sample.json Minimal script JSON
output/audio/        Generated WAV files; ignored by git
remotion/public/audio/ WAV files copied for Remotion staticFile(); ignored by git
output/videos/       Generated MP4 files; ignored by git
```

## License

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
