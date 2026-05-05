# Third-Party Notices / 第三者利用条件に関する注意

## 日本語

このファイルでは、`NOTICE.md` から参照するライセンス対象範囲と第三者利用条件を説明します。

このリポジトリのために作成した自作ソースコードは、MIT Licenseで提供します。

ただし、このライセンスは、第三者ソフトウェア、VOICEVOX音声ライブラリ、生成音声、生成動画、公式キャラクター素材の利用権を与えるものではありません。生成物を公開・収益化する前に、各プロジェクトの現行利用条件を確認してください。

### Remotion

このプロジェクトは、第三者依存としてRemotionを使用します。

RemotionはRemotion Licenseの対象です。現行のRemotion Licenseでは、個人、3人以下の営利組織、非営利組織、非商用評価などはFree Licenseの対象になり得ます。対象外の商用利用では、Company Licenseが必要になる場合があります。

- Remotion License: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
- Remotion Company License: https://www.remotion.pro/license

このリポジトリは、Remotion自体をコピー、改変、販売、貸与、ライセンス、再ライセンス、サブライセンスするものではありません。

### VOICEVOX

このリポジトリには、VOICEVOX、VOICEVOX ENGINE、VOICEVOX CORE、VOICEVOX音声ライブラリ、生成WAVファイル、生成MP4ファイルは含まれていません。

スクリプトは、ローカルで起動しているVOICEVOX互換HTTP API `http://localhost:50021` を呼び出します。

- VOICEVOXソフトウェア利用規約: https://voicevox.hiroshiba.jp/term/
- VOICEVOX ENGINE: https://github.com/VOICEVOX/voicevox_engine

VOICEVOXを利用したことが分かるクレジット表記が必要です。生成音声を利用する場合は、各音声ライブラリの規約にも従ってください。

### サンプルで使う音声ライブラリ

初期状態の `remotion/src/speaker-config.json` は、作者の検証環境で次のVOICEVOX話者を使っています。

- `No.7`
- `春日部つむぎ`

これらの名称と音声ライブラリは、このリポジトリのMIT Licenseの対象ではありません。

#### No.7

No.7には、生成音声とキャラクター素材について別の利用条件があります。公式サイトでは、個人・同人アカウントの動画広告収入は非商用利用の例として挙げられています。一方で、企業アカウントの動画広告収入を含む一部の商用利用は、相談対象として挙げられています。

- No.7公式サイト・利用条件: https://voiceseven.com/

#### 春日部つむぎ

春日部つむぎの音声を利用する場合は、VOICEVOX本体の規約と春日部つむぎ側の規約に従ってください。クレジット表記が必要です。

公式の立ち絵やLive2Dモデルなどのキャラクター素材は、このリポジトリ内のプレースホルダー素材とは別物です。公式キャラクター素材、生成音声ファイル、生成動画を再利用可能な素材として再配布したり、自作物として扱ったりしないでください。

- VOICEVOX 春日部つむぎ 製品ページ: https://voicevox.hiroshiba.jp/product/kasukabe_tsumugi/
- 春日部つむぎ 公式利用規約: https://tsumugi-official.studio.site/rule
- 春日部つむぎ 公式立ち絵素材: https://booth.pm/en/items/3474402

### 生成音声と生成動画

生成される音声・動画ファイルは、意図的にgit管理外にしています。

- `output/`
- `remotion/public/audio/`
- `examples/*.props.json`

これらの生成ファイルは、このリポジトリのMIT Licenseの対象ではありません。生成した動画を公開する場合は、VOICEVOX本体と各音声ライブラリの規約に従い、必要なクレジット表記を行ってください。

---

## English follows

This file explains the license scope and third-party notices referenced by
`NOTICE.md`.

This repository's own original source code is licensed under the MIT License.

That license does not grant rights to third-party software, VOICEVOX voice
libraries, generated voices, generated videos, or official character assets.
Check each project's current terms before publishing or monetizing generated
content.

### Remotion

This project uses Remotion as a third-party dependency.

Remotion is licensed separately under the Remotion License. Individuals,
for-profit organizations with 3 or fewer people, non-profit organizations, and
non-commercial evaluation use may be eligible for the Free License. Other
commercial use may require a Company License.

- Remotion License: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
- Remotion Company License: https://www.remotion.pro/license

This repository does not copy, modify, sell, rent, license, relicense, or
sublicense Remotion itself.

### VOICEVOX

This repository does not include VOICEVOX, VOICEVOX ENGINE, VOICEVOX CORE,
VOICEVOX voice libraries, generated WAV files, or generated MP4 files.

The scripts only call a locally running VOICEVOX-compatible HTTP API at
`http://localhost:50021`.

- VOICEVOX software terms: https://voicevox.hiroshiba.jp/term/
- VOICEVOX ENGINE: https://github.com/VOICEVOX/voicevox_engine

VOICEVOX requires credit notation that makes it clear VOICEVOX was used. When
using generated voices, follow the terms of each voice library.

### Voice Libraries Used By The Sample

The default `remotion/src/speaker-config.json` uses these VOICEVOX speakers in
the author's verification environment:

- `No.7`
- `春日部つむぎ`

These names and voice libraries are not covered by this repository's MIT
License.

#### No.7

No.7 has separate terms for generated voices and character assets. The official
site lists personal or doujin video ad revenue as non-commercial use, while
some commercial cases, including enterprise account video ad revenue, are listed
as cases that require consultation.

- No.7 official site and terms: https://voiceseven.com/

#### 春日部つむぎ

When using 春日部つむぎ voice output, follow the VOICEVOX terms and the
春日部つむぎ terms. Credit notation is required.

Official character materials such as standing images and Live2D models are
separate from the sample placeholders in this repository. Do not redistribute
official character assets, generated voice files, or generated videos as
reusable materials, and do not claim them as your own work.

- VOICEVOX 春日部つむぎ product page: https://voicevox.hiroshiba.jp/product/kasukabe_tsumugi/
- 春日部つむぎ official terms: https://tsumugi-official.studio.site/rule
- 春日部つむぎ official standing image material: https://booth.pm/en/items/3474402

### Generated Audio And Video

Generated audio and video files are intentionally ignored by git:

- `output/`
- `remotion/public/audio/`
- `examples/*.props.json`

Those generated files are not covered by this repository's MIT License. If you
publish generated videos, follow the VOICEVOX terms and each voice library's
terms, including required credit notation.
