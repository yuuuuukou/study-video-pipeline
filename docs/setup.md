# Setup

## 1. Install Remotion Dependencies

```powershell
npm install --prefix remotion
```

## 2. Start VOICEVOX

Start the VOICEVOX GUI app, then check the local API.

```powershell
Invoke-RestMethod "http://localhost:50021/version"
```

## 3. Check Speaker IDs

```powershell
Invoke-RestMethod "http://localhost:50021/speakers"
```

Update `remotion/src/speaker-config.json` if your speaker/style IDs differ.

## 4. Render

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
