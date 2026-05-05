/**
 * render.js
 * 台本JSON → 音声合成 → props生成 → Remotionレンダリング を一括実行する。
 *
 * 使い方:
 *   node scripts/render.js examples/sample.json
 *   node scripts/render.js examples/sample.json --composition=StudyVideoVertical
 *   node scripts/render.js examples/sample.json --output=output/videos/shorts/sample.mp4
 *   node scripts/render.js examples/sample.json --skip-synthesize=true
 *
 * 出力:
 *   output/videos/<台本JSONファイル名>.mp4
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const REMOTION_DIR = path.join(ROOT, "remotion");

const [, , scriptPath, ...rawArgs] = process.argv;
if (!scriptPath) {
  console.error("使い方: node scripts/render.js <台本JSON> [--composition=StudyVideo|StudyVideoVertical] [--output=<mp4>] [--skip-synthesize=true]");
  process.exit(1);
}

const options = parseOptions(rawArgs);
const composition = options.composition ?? "StudyVideo";

const absScriptPath = path.resolve(scriptPath);
const script = JSON.parse(fs.readFileSync(absScriptPath, "utf-8"));

// 出力ディレクトリ名はJSONファイル名をそのまま使う（ASCII安全）
const slug = path.basename(absScriptPath, ".json");
const audioDir = path.join(ROOT, "output", "audio", slug);
const propsPath = absScriptPath.replace(".json", ".props.json");
const outputVideo = options.output
  ? path.resolve(options.output)
  : path.join(ROOT, "output", "videos", `${slug}.mp4`);

fs.mkdirSync(path.dirname(outputVideo), { recursive: true });

// ---- Step 1: 音声合成 ----
if (options["skip-synthesize"] === "true") {
  console.log("🎙  Step 1: 音声合成をスキップ...");
} else {
  console.log("🎙  Step 1: 音声合成...");
  run(`node scripts/synthesize.js "${absScriptPath}" "${audioDir}"`, ROOT);
}

// ---- Step 2: タイミングprops生成 ----
console.log("\n⏱  Step 2: propsファイル生成...");
run(`node scripts/make-props.js "${absScriptPath}" "${audioDir}"`, ROOT);

// ---- Step 3: Remotionレンダリング ----
console.log("\n🎬  Step 3: 動画レンダリング...");
const relativeProps = path.relative(REMOTION_DIR, propsPath).replace(/\\/g, "/");
const relativeOutput = path.relative(REMOTION_DIR, outputVideo).replace(/\\/g, "/");
run(
  `npx remotion render ${composition} "${relativeOutput}" --props="${relativeProps}"`,
  REMOTION_DIR
);

console.log(`\n✅ 完成: ${outputVideo}`);

function parseOptions(args) {
  const parsed = {};

  for (const arg of args) {
    if (!arg.startsWith("--")) {
      throw new Error(`未知の引数です: ${arg}`);
    }
    const [key, ...valueParts] = arg.slice(2).split("=");
    const value = valueParts.join("=");
    if (!value) {
      throw new Error(`値が必要です: ${arg}`);
    }
    parsed[key] = value;
  }

  if (
    parsed.composition !== undefined &&
    parsed.composition !== "StudyVideo" &&
    parsed.composition !== "StudyVideoVertical"
  ) {
    throw new Error(`未知のcompositionです: ${parsed.composition}`);
  }

  if (
    parsed["skip-synthesize"] !== undefined &&
    parsed["skip-synthesize"] !== "true" &&
    parsed["skip-synthesize"] !== "false"
  ) {
    throw new Error(`--skip-synthesize は true または false を指定してください: ${parsed["skip-synthesize"]}`);
  }

  return parsed;
}

function run(cmd, cwd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}
