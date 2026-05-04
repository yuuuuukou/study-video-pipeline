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
const DEFAULT_STATIC_SECTION_FRAMES = 150;

const [, , scriptPath, audioDir] = process.argv;
if (!scriptPath || !audioDir) {
  console.error("使い方: node scripts/make-props.js <台本JSON> <音声ディレクトリ>");
  process.exit(1);
}

const script = JSON.parse(fs.readFileSync(scriptPath, "utf-8"));
validateScript(script);

// video/public/audio/<audioDir名>/ にwavをコピー
const audioDirName = path.basename(audioDir);
const publicAudioDir = path.join(ROOT, "video", "public", "audio", audioDirName);
fs.mkdirSync(publicAudioDir, { recursive: true });

let globalFrame = 0;
let lineIndex = 0;

const timedSections = script.sections.map((section) => {
  const sectionStartFrame = globalFrame;
  const sectionLines = section.lines ?? [];

  const timedLines = sectionLines.map((line) => {
    const filename = `${String(lineIndex).padStart(4, "0")}_${line.speaker}.wav`;
    const srcPath = path.join(audioDir, filename);
    const dstPath = path.join(publicAudioDir, filename);

    if (!fs.existsSync(srcPath)) {
      throw new Error(`台本に対応するwavが見つかりません: ${srcPath}`);
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
  });

  const audioDuration = globalFrame - sectionStartFrame;
  const holdFrames = getHoldFrames(section);
  const staticFrames =
    sectionLines.length === 0
      ? holdFrames ?? DEFAULT_STATIC_SECTION_FRAMES
      : holdFrames;
  const sectionDuration = Math.max(audioDuration, staticFrames ?? audioDuration);

  if (sectionLines.length === 0) {
    console.log(`  [section] ${section.section_title}: linesなし → ${sectionDuration}f`);
  } else if (sectionDuration > audioDuration) {
    console.log(`  [section] ${section.section_title}: holdFramesで ${sectionDuration - audioDuration}f 延長`);
  }

  globalFrame = sectionStartFrame + sectionDuration;

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

function getHoldFrames(section) {
  if (section.holdFrames !== undefined) {
    return toPositiveInteger(section.holdFrames, "holdFrames");
  }
  if (section.durationInFrames !== undefined) {
    return toPositiveInteger(section.durationInFrames, "durationInFrames");
  }
  if (section.durationSec !== undefined) {
    const sec = Number(section.durationSec);
    if (!Number.isFinite(sec) || sec <= 0) {
      throw new Error(`durationSec は正の数にしてください: ${section.durationSec}`);
    }
    return Math.ceil(sec * FPS);
  }
  return null;
}

function toPositiveInteger(value, fieldName) {
  const frames = Number(value);
  if (!Number.isInteger(frames) || frames <= 0) {
    throw new Error(`${fieldName} は正の整数フレーム数にしてください: ${value}`);
  }
  return frames;
}

function validateScript(script) {
  if (!script || !Array.isArray(script.sections)) {
    throw new Error("台本JSONには sections 配列が必要です。");
  }

  for (const [sectionIndex, section] of script.sections.entries()) {
    if (!Array.isArray(section.lines)) {
      throw new Error(`sections[${sectionIndex}].lines は配列にしてください。`);
    }
  }
}
