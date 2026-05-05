# Setup / セットアップ

## 日本語

### 1. Remotionの依存関係をインストールする

```powershell
npm install --prefix remotion
```

### 2. VOICEVOXを起動する

VOICEVOXのGUIアプリを起動し、ローカルAPIが使えることを確認します。

```powershell
Invoke-RestMethod "http://localhost:50021/version"
```

### 3. 話者IDを確認する

```powershell
Invoke-RestMethod "http://localhost:50021/speakers"
```

あなたの環境の話者/スタイルIDが初期値と異なる場合は、`remotion/src/speaker-config.json` を更新してください。

### 4. レンダリングする

```powershell
node scripts/render.js examples/sample.json
```

生成されるファイル:

```text
output/audio/sample/*.wav
examples/sample.props.json
remotion/public/audio/sample/*.wav
output/videos/sample.mp4
```

---

## English follows

### 1. Install Remotion Dependencies

```powershell
npm install --prefix remotion
```

### 2. Start VOICEVOX

Start the VOICEVOX GUI app, then check the local API.

```powershell
Invoke-RestMethod "http://localhost:50021/version"
```

### 3. Check Speaker IDs

```powershell
Invoke-RestMethod "http://localhost:50021/speakers"
```

Update `remotion/src/speaker-config.json` if your speaker/style IDs differ.

### 4. Render

```powershell
node scripts/render.js examples/sample.json
```

Generated files:

```text
output/audio/sample/*.wav
examples/sample.props.json
remotion/public/audio/sample/*.wav
output/videos/sample.mp4
```
