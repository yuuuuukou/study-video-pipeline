# Third-Party Notices

This file explains the license scope and third-party notices referenced by
`NOTICE.md`.

This repository's own original source code is licensed under the MIT License.

That license does not grant rights to third-party software, VOICEVOX voice
libraries, generated voices, generated videos, or official character assets.
Check each project's current terms before publishing or monetizing generated
content.

## Remotion

This project uses Remotion as a third-party dependency.

Remotion is licensed separately under the Remotion License. Individuals,
for-profit organizations with 3 or fewer people, non-profit organizations, and
non-commercial evaluation use may be eligible for the Free License. Other
commercial use may require a Company License.

- Remotion License: https://github.com/remotion-dev/remotion/blob/main/LICENSE.md
- Remotion Company License: https://www.remotion.pro/license

This repository does not copy, modify, sell, rent, license, relicense, or
sublicense Remotion itself.

## VOICEVOX

This repository does not include VOICEVOX, VOICEVOX ENGINE, VOICEVOX CORE,
VOICEVOX voice libraries, generated WAV files, or generated MP4 files.

The scripts only call a locally running VOICEVOX-compatible HTTP API at
`http://localhost:50021`.

- VOICEVOX software terms: https://voicevox.hiroshiba.jp/term/
- VOICEVOX ENGINE: https://github.com/VOICEVOX/voicevox_engine

VOICEVOX requires credit notation that makes it clear VOICEVOX was used. When
using generated voices, follow the terms of each voice library.

## Voice Libraries Used By The Sample

The default `video/src/speaker-config.json` uses these VOICEVOX speakers in the
author's verification environment:

- `No.7`
- `春日部つむぎ`

These names and voice libraries are not covered by this repository's MIT
License.

### No.7

No.7 has separate terms for generated voices and character assets. The official
site lists personal or doujin video ad revenue as non-commercial use, while
some commercial cases, including enterprise account video ad revenue, are listed
as cases that require consultation.

- No.7 official site and terms: https://voiceseven.com/

### 春日部つむぎ

When using 春日部つむぎ voice output, follow the VOICEVOX terms and the
春日部つむぎ terms. Credit notation is required.

Official character materials such as standing images and Live2D models are
separate from the sample placeholders in this repository. Do not redistribute
official character assets, generated voice files, or generated videos as
reusable materials, and do not claim them as your own work.

- VOICEVOX 春日部つむぎ product page: https://voicevox.hiroshiba.jp/product/kasukabe_tsumugi/
- 春日部つむぎ official terms: https://tsumugi-official.studio.site/rule
- 春日部つむぎ official standing image material: https://booth.pm/en/items/3474402

## Generated Audio And Video

Generated audio and video files are intentionally ignored by git:

- `output/`
- `video/public/audio/`
- `examples/*.props.json`

Those generated files are not covered by this repository's MIT License. If you
publish generated videos, follow the VOICEVOX terms and each voice library's
terms, including required credit notation.
