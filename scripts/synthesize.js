/**
 * synthesize.js
 * 台本JSON → VOICEVOX API → wavファイル群
 *
 * 使い方:
 *   node synthesize.js <台本JSONパス> <出力ディレクトリ>
 *
 * 例:
 *   node scripts/synthesize.js examples/sample.json output/audio/sample
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPEAKER_CONFIG_PATH = path.join(__dirname, "..", "video", "src", "speaker-config.json");

// --- 設定（ここを変えるだけで話者が変わる）---
const VOICEVOX_URL = "http://localhost:50021";
const SPEAKER_CONFIG = JSON.parse(fs.readFileSync(SPEAKER_CONFIG_PATH, "utf-8"));
const SPEAKERS = Object.fromEntries(
  Object.entries(SPEAKER_CONFIG).map(([speakerKey, cfg]) => [speakerKey, cfg.voicevoxId])
);

// --- メイン ---
const [, , scriptPath, outputDir] = process.argv;
if (!scriptPath || !outputDir) {
  console.error("使い方: node synthesize.js <台本JSON> <出力ディレクトリ>");
  process.exit(1);
}

const script = JSON.parse(fs.readFileSync(scriptPath, "utf-8"));
fs.mkdirSync(outputDir, { recursive: true });

console.log(`📖 台本: ${script.title}`);
console.log(`🎯 出力先: ${outputDir}`);
console.log("");

let lineIndex = 0;
for (const [sectionIndex, section] of script.sections.entries()) {
  console.log(`📂 Section ${sectionIndex + 1}: ${section.section_title}`);
  for (const line of section.lines) {
    const speakerId = SPEAKERS[line.speaker];
    if (speakerId === undefined) {
      console.warn(`  ⚠️  未知のspeaker: ${line.speaker} スキップ`);
      lineIndex++;
      continue;
    }

    const filename = `${String(lineIndex).padStart(4, "0")}_${line.speaker}.wav`;
    const outputPath = path.join(outputDir, filename);

    process.stdout.write(`  [${lineIndex}] ${line.speaker}: ${line.display_text.slice(0, 30)}...`);

    try {
      const wav = await synthesize(line.text, speakerId);
      fs.writeFileSync(outputPath, wav);
      console.log(` ✅`);
    } catch (e) {
      console.log(` ❌ ${e.message}`);
    }

    lineIndex++;
  }
}

console.log("");
console.log("✨ 完了");

// --- VOICEVOX API ---
async function synthesize(text, speakerId) {
  // Step 1: audio_query
  const query = await postJson(
    `${VOICEVOX_URL}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
    {}
  );

  // Step 2: synthesis
  const wav = await postJsonBinary(
    `${VOICEVOX_URL}/synthesis?speaker=${speakerId}`,
    query
  );

  return wav;
}

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      let buf = "";
      res.on("data", (chunk) => (buf += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(buf)); }
        catch (e) { reject(new Error(`JSON parse error: ${buf.slice(0, 100)}`)); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function postJsonBinary(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}
