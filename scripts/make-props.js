/**
 * make-props.js
 * wavファイルの長さを計算し、Remotion用のprops JSONを生成する。
 * 同時にwavを video/public/audio/ にコピーする。
 *
 * 使い方:
 *   node scripts/make-props.js examples/sample.json output/audio/sample
 *
 * 出力:
 *   examples/sample.props.json  （Remotion renderに渡すprops）
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FPS = 30;

const [, , scriptPath, audioDir] = process.argv;
if (!scriptPath || !audioDir) {
  console.error("使い方: node scripts/make-props.js <台本JSON> <音声ディレクトリ>");
  process.exit(1);
}

const script = JSON.parse(fs.readFileSync(scriptPath, "utf-8"));

// video/public/audio/<audioDir名>/ にwavをコピー
const audioDirName = path.basename(audioDir);
const publicAudioDir = path.join(ROOT, "video", "public", "audio", audioDirName);
fs.mkdirSync(publicAudioDir, { recursive: true });

let globalFrame = 0;
let lineIndex = 0;

const timedSections = script.sections.map((section) => {
  const sectionStartFrame = globalFrame;

  const timedLines = section.lines.map((line) => {
    const filename = `${String(lineIndex).padStart(4, "0")}_${line.speaker}.wav`;
    const srcPath = path.join(audioDir, filename);
    const dstPath = path.join(publicAudioDir, filename);

    if (!fs.existsSync(srcPath)) {
      console.warn(`  ⚠️  見つかりません: ${srcPath}`);
      lineIndex++;
      return null;
    }

    // wavファイルの長さを計算
    const durationSec = getWavDuration(srcPath);
    const durationInFrames = Math.ceil(durationSec * FPS) + 5; // 5フレームのバッファ

    // publicにコピー
    fs.copyFileSync(srcPath, dstPath);

    const timedLine = {
      speaker: line.speaker,
      // display_text 優先・無ければ text にフォールバック（読み上げ用カタカナが
      // そのまま字幕に出るのを最後の砦として防ぐより、空字幕を回避する優先）
      display_text: line.display_text ?? line.text ?? "",
      audioSrc: `audio/${audioDirName}/${filename}`,
      startFrame: globalFrame,
      durationInFrames,
    };

    console.log(`  [${lineIndex}] ${line.speaker}: ${durationSec.toFixed(2)}s → ${durationInFrames}f`);
    globalFrame += durationInFrames;
    lineIndex++;
    return timedLine;
  }).filter(Boolean);

  const sectionDuration = globalFrame - sectionStartFrame;

  return {
    section_title: section.section_title,
    slide_points: section.slide_points,
    layout: section.layout,
    compare_labels: section.compare_labels,
    video: section.video,
    lines: timedLines,
    startFrame: sectionStartFrame,
    durationInFrames: sectionDuration,
  };
});

const props = {
  title: script.title,
  sections: timedSections,
};

const propsPath = scriptPath.replace(".json", ".props.json");
fs.writeFileSync(propsPath, JSON.stringify(props, null, 2), "utf-8");

console.log("");
console.log(`✅ props出力: ${propsPath}`);
console.log(`✅ 総フレーム数: ${globalFrame} (${(globalFrame / FPS).toFixed(1)}秒)`);
console.log(`✅ 音声コピー先: ${publicAudioDir}`);

// ---- WAV duration 計算 ----
function getWavDuration(filePath) {
  const buf = fs.readFileSync(filePath);
  // WAVヘッダー解析
  const numChannels  = buf.readUInt16LE(22);
  const sampleRate   = buf.readUInt32LE(24);
  const bitsPerSample = buf.readUInt16LE(34);
  const dataSize     = buf.readUInt32LE(40);
  return dataSize / (sampleRate * numChannels * (bitsPerSample / 8));
}
