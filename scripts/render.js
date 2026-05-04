/**
 * render.js
 * 台本JSON → 音声合成 → props生成 → Remotionレンダリング を一括実行する。
 *
 * 使い方:
 *   node scripts/render.js examples/sample.json
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

const [, , scriptPath] = process.argv;
if (!scriptPath) {
  console.error("使い方: node scripts/render.js <台本JSON>");
  process.exit(1);
}

const absScriptPath = path.resolve(scriptPath);
const script = JSON.parse(fs.readFileSync(absScriptPath, "utf-8"));

// 出力ディレクトリ名はJSONファイル名をそのまま使う（ASCII安全）
const slug = path.basename(absScriptPath, ".json");
const audioDir = path.join(ROOT, "output", "audio", slug);
const propsPath = absScriptPath.replace(".json", ".props.json");
const outputVideo = path.join(ROOT, "output", "videos", `${slug}.mp4`);

fs.mkdirSync(path.join(ROOT, "output", "videos"), { recursive: true });

// ---- Step 1: 音声合成 ----
console.log("🎙  Step 1: 音声合成...");
run(`node scripts/synthesize.js "${absScriptPath}" "${audioDir}"`, ROOT);

// ---- Step 2: タイミングprops生成 ----
console.log("\n⏱  Step 2: propsファイル生成...");
run(`node scripts/make-props.js "${absScriptPath}" "${audioDir}"`, ROOT);

// ---- Step 3: Remotionレンダリング ----
console.log("\n🎬  Step 3: 動画レンダリング...");
const relativeProps = path.relative(REMOTION_DIR, propsPath).replace(/\\/g, "/");
const relativeOutput = path.relative(REMOTION_DIR, outputVideo).replace(/\\/g, "/");
run(
  `npx remotion render StudyVideo "${relativeOutput}" --props="${relativeProps}"`,
  REMOTION_DIR
);

console.log(`\n✅ 完成: ${outputVideo}`);

function run(cmd, cwd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}
