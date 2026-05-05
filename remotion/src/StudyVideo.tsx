import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  Video,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import type { StudyVideoProps, TimedSection, TimedLine, Speaker, SlideLayout } from "./types";
import speakerConfigJson from "./speaker-config.json";

// キャラクター設定（ここを変えるだけで話者が変わる）
const SPEAKER_CONFIG = speakerConfigJson as Record<Speaker, { name: string; color: string; voicevoxId: number }>;

// カラーパレット（朱茶 × 稲穂ゴールド）
const CRIMSON = "#8B1515"; // 朱茶
const GOLD = "#C4A135";    // 稲穂ゴールド
const BG = "#FAFAFA";      // 温白
const TEXT = "#2C1A1A";    // 濃茶

// 字幕がキャラを避ける場合の隙間（横長専用）
const CHAR_GAP = 24;

// ---- 寸法プリセット（横長 / 縦長 で切り替え）----
type Sizes = {
  slidePadding: string;
  titleFont: number;
  titleMarginBottom: number;
  bulletFont: number;
  bulletGap: number;
  bulletNumber: number;
  bulletNumberFont: number;
  codeFont: number;
  codePadding: string;
  compareFont: number;
  compareHeaderFont: number;
  compareGap: number;
  imgMaxHeight: number;
  imgCaptionFont: number;
  videoMaxHeight: number;
  videoCaptionFont: number;
  tableFont: number;
  subtitleFont: number;
  subtitleBottom: number;
  subtitleSidePadding: number;
  charBottom: number;
  charRight: number;
  charWidth: number;
  charHeight: number;
  charNameFont: number;
  // 横長は字幕がキャラを横に避ける。縦長はキャラの下に出すので避けない。
  subtitleAvoidsCharacter: boolean;
  // スライドコンテンツと字幕ボックスの間隔（縦長のインライン配置時のみ使用）。
  slideSubtitleGap: number;
};

const SIZES_HORIZONTAL: Sizes = {
  slidePadding: "60px 80px",
  titleFont: 46,
  titleMarginBottom: 44,
  bulletFont: 32,
  bulletGap: 28,
  bulletNumber: 36,
  bulletNumberFont: 20,
  codeFont: 26,
  codePadding: "28px 36px",
  compareFont: 28,
  compareHeaderFont: 22,
  compareGap: 24,
  imgMaxHeight: 380,
  imgCaptionFont: 26,
  videoMaxHeight: 430,
  videoCaptionFont: 26,
  tableFont: 20,
  subtitleFont: 28,
  subtitleBottom: 28,
  subtitleSidePadding: 60,
  charBottom: 100,
  charRight: 80,
  charWidth: 160,
  charHeight: 200,
  charNameFont: 20,
  subtitleAvoidsCharacter: true,
  slideSubtitleGap: 0,
};

const SIZES_VERTICAL: Sizes = {
  slidePadding: "140px 60px 60px",
  titleFont: 64,
  titleMarginBottom: 60,
  bulletFont: 46,
  bulletGap: 40,
  bulletNumber: 54,
  bulletNumberFont: 30,
  codeFont: 34,
  codePadding: "36px 40px",
  compareFont: 38,
  compareHeaderFont: 30,
  compareGap: 32,
  imgMaxHeight: 700,
  imgCaptionFont: 36,
  videoMaxHeight: 760,
  videoCaptionFont: 36,
  tableFont: 26,
  subtitleFont: 42,
  subtitleBottom: 80,
  subtitleSidePadding: 50,
  charBottom: 360,
  charRight: 60,
  charWidth: 280,
  charHeight: 350,
  charNameFont: 28,
  subtitleAvoidsCharacter: false,
  slideSubtitleGap: 48,
};

// ---- メインコンポーネント ----
export const StudyVideo: React.FC<StudyVideoProps> = ({ sections }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const isVertical = height > width;
  const S: Sizes = isVertical ? SIZES_VERTICAL : SIZES_HORIZONTAL;

  // 現在のセクションを特定
  const currentSection =
    sections.find((s) => frame >= s.startFrame && frame < s.startFrame + s.durationInFrames) ??
    sections[0];
  // 現在のセリフを特定
  const allLines = sections.flatMap((s) => s.lines);
  const currentLine =
    allLines.find((l) => frame >= l.startFrame && frame < l.startFrame + l.durationInFrames) ??
    null;

  // layout を正規化してキャラ表示可否と字幕余白を決定
  const normalizedLayout: SlideLayout = currentSection.layout ?? "bullets";
  const showCharacter = !!currentLine && !LAYOUTS_WITHOUT_CHARACTER.includes(normalizedLayout);
  const subtitleRight =
    showCharacter && S.subtitleAvoidsCharacter
      ? S.charRight + S.charWidth + CHAR_GAP
      : S.subtitleSidePadding;

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: "Noto Sans JP, sans-serif" }}>
      {/* 上部装飾バー */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ height: 10, background: CRIMSON }} />
        <div style={{ height: 4, background: GOLD }} />
      </div>
      {/* 下部装飾バー */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ height: 4, background: GOLD }} />
        <div style={{ height: 10, background: CRIMSON }} />
      </div>

      {isVertical ? (
        // 縦長: スライドと字幕を1つのflex columnコンテナに入れ、字幕をスライド直下に配置
        <AbsoluteFill
          style={{
            padding: S.slidePadding,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: S.slideSubtitleGap,
          }}
        >
          <SlideBody section={currentSection} S={S} />
          {currentLine && <SubtitleBody line={currentLine} frame={frame} S={S} />}
        </AbsoluteFill>
      ) : (
        <>
          {/* 背景スライド */}
          <SlideLayer section={currentSection} S={S} isVertical={isVertical} />
          {/* 字幕 */}
          {currentLine && (
            <SubtitleLayer line={currentLine} frame={frame} rightInset={subtitleRight} S={S} />
          )}
        </>
      )}

      {/* キャラクター */}
      {showCharacter && <CharacterLayer speaker={currentLine!.speaker} S={S} />}

      {/* 音声 */}
      {allLines.map((line, i) => (
        <Sequence key={i} from={line.startFrame} durationInFrames={line.durationInFrames}>
          <Audio src={staticFile(line.audioSrc)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ---- スライド中身（タイトル + レイアウト別コンテンツ）。AbsoluteFill ラッパーは持たない ----
const SlideBody: React.FC<{ section: TimedSection; S: Sizes }> = ({ section, S }) => {
  const opacity = 1;

  const layout = section.layout ?? "bullets";

  return (
    <div style={{ opacity, display: "flex", flexDirection: "column" }}>
      {/* セクションタイトル（全レイアウト共通） */}
      <div
        style={{
          color: CRIMSON,
          fontSize: S.titleFont,
          fontWeight: "bold",
          borderLeft: `6px solid ${GOLD}`,
          paddingLeft: 20,
          marginBottom: S.titleMarginBottom,
        }}
      >
        {section.section_title}
      </div>

      {/* レイアウト別コンテンツ */}
      {layout === "bullets"  && <BulletsContent  points={section.slide_points} S={S} />}
      {layout === "code"     && <CodeContent     lines={section.slide_points}  S={S} />}
      {layout === "compare"  && <CompareContent  points={section.slide_points} labels={section.compare_labels ?? ["Before", "After"]} S={S} />}
      {layout === "image"    && <ImageContent    points={section.slide_points} S={S} />}
      {layout === "table"    && <TableContent    rows={section.slide_points}   S={S} />}
      {layout === "video"    && <VideoContent    section={section}             S={S} />}
    </div>
  );
};

// ---- スライドレイヤー（横長用 / AbsoluteFillで全画面背景として配置）----
const SlideLayer: React.FC<{ section: TimedSection; S: Sizes; isVertical: boolean }> = ({ section, S, isVertical }) => {
  return (
    <AbsoluteFill
      style={{
        padding: S.slidePadding,
        ...(isVertical && {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }),
      }}
    >
      <SlideBody section={section} S={S} />
    </AbsoluteFill>
  );
};

// ---- bullets レイアウト（デフォルト）----
const BulletsContent: React.FC<{ points: string[]; S: Sizes }> = ({ points, S }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: S.bulletGap }}>
    {points.map((point, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: TEXT,
          fontSize: S.bulletFont,
        }}
      >
        <span
          style={{
            width: S.bulletNumber,
            height: S.bulletNumber,
            borderRadius: "50%",
            background: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: S.bulletNumberFont,
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          {i + 1}
        </span>
        {point}
      </div>
    ))}
  </div>
);

// ---- code レイアウト ----
// slide_points の各要素をコードの1行として表示する
const CodeContent: React.FC<{ lines: string[]; S: Sizes }> = ({ lines, S }) => (
  <div
    style={{
      background: "#0d1117",
      borderRadius: 12,
      padding: S.codePadding,
      border: "1px solid #30363d",
      fontFamily: "'Courier New', Consolas, monospace",
      fontSize: S.codeFont,
      lineHeight: 1.9,
    }}
  >
    {lines.map((line, i) => (
      <div key={i} style={{ display: "flex", gap: 24 }}>
        <span
          style={{
            color: "#6e7681",
            userSelect: "none",
            minWidth: 28,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {i + 1}
        </span>
        <span
          style={{
            color: "#e6edf3",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {line}
        </span>
      </div>
    ))}
  </div>
);

// ---- compare レイアウト ----
// even index (0,2,4...) → 左列、odd index (1,3,5...) → 右列
// 台本JSON で関連ペアを隣接して書けるのでスクリプト可読性が高い
const CompareContent: React.FC<{ points: string[]; labels: [string, string]; S: Sizes }> = ({ points, labels, S }) => {
  const leftItems  = points.filter((_, i) => i % 2 === 0);
  const rightItems = points.filter((_, i) => i % 2 === 1);
  const [leftLabel, rightLabel] = labels;

  return (
    <div style={{ display: "flex", gap: 0 }}>
      {/* 左列 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: S.compareGap, paddingRight: 32 }}>
        <div
          style={{
            color: "#f87171",
            fontSize: S.compareHeaderFont,
            fontWeight: "bold",
            borderBottom: "2px solid #f87171",
            paddingBottom: 8,
            marginBottom: 4,
          }}
        >
          {leftLabel}
        </div>
        {leftItems.map((item, i) => (
          <div
            key={i}
            style={{
              color: TEXT,
              fontSize: S.compareFont,
              paddingLeft: 16,
              borderLeft: "3px solid #f87171",
              lineHeight: 1.5,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* 区切り線 */}
      <div style={{ width: 1, background: "#d4c8a8", flexShrink: 0 }} />

      {/* 右列 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: S.compareGap, paddingLeft: 32 }}>
        <div
          style={{
            color: "#34d399",
            fontSize: S.compareHeaderFont,
            fontWeight: "bold",
            borderBottom: "2px solid #34d399",
            paddingBottom: 8,
            marginBottom: 4,
          }}
        >
          {rightLabel}
        </div>
        {rightItems.map((item, i) => (
          <div
            key={i}
            style={{
              color: TEXT,
              fontSize: S.compareFont,
              paddingLeft: 16,
              borderLeft: "3px solid #34d399",
              lineHeight: 1.5,
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- image レイアウト ----
// slide_points[0] = 画像パス（public/ 以下）または https:// URL
// slide_points[1..] = キャプション行
const ImageContent: React.FC<{ points: string[]; S: Sizes }> = ({ points, S }) => {
  const [imgSrc, ...captions] = points;
  const visibleCaptions = S.subtitleAvoidsCharacter ? [] : captions;
  const resolvedSrc = imgSrc
    ? imgSrc.startsWith("https://")
      ? imgSrc
      : staticFile(imgSrc)
    : null;
  const altText = captions.length > 0 ? captions.join(" ") : "スライド画像";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      {resolvedSrc && (
        <Img
          src={resolvedSrc}
          alt={altText}
          style={{
            maxWidth: "100%",
            maxHeight: S.imgMaxHeight,
            objectFit: "contain",
            borderRadius: 8,
            border: "1px solid #d4c8a8",
          }}
        />
      )}
      {visibleCaptions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignSelf: "stretch" }}>
          {visibleCaptions.map((caption, i) => (
            <div
              key={i}
              style={{
                color: TEXT,
                fontSize: S.imgCaptionFont,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {caption}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- video レイアウト ----
// section.video.src = 動画パス（public/ 以下）または https:// URL
// slide_points = キャプション行
const VideoContent: React.FC<{ section: TimedSection; S: Sizes }> = ({ section, S }) => {
  const videoSrc = section.video?.src;
  const resolvedSrc = videoSrc
    ? videoSrc.startsWith("https://")
      ? videoSrc
      : staticFile(videoSrc)
    : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      {resolvedSrc && (
        <Video
          src={resolvedSrc}
          style={{
            width: "100%",
            maxHeight: S.videoMaxHeight,
            // eslint-disable-next-line @remotion/no-object-fit-on-media-video
            objectFit: "contain",
            borderRadius: 8,
            border: "1px solid #d4c8a8",
            background: "#111827",
          }}
        />
      )}
      {section.slide_points.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignSelf: "stretch" }}>
          {section.slide_points.map((caption, i) => (
            <div
              key={i}
              style={{
                color: TEXT,
                fontSize: S.videoCaptionFont,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {caption}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- table レイアウト ----
// 各要素を "|" 区切りで列に分割。
// rows[0] = ヘッダ行、rows[1..] = データ行（先頭列は行ヘッダ）。
const TableContent: React.FC<{ rows: string[]; S: Sizes }> = ({ rows, S }) => {
  const parsed = rows.map((row) => row.split("|").map((cell) => cell.trim()));
  if (parsed.length === 0) return null;

  const [header, ...body] = parsed;
  const colCount = Math.max(...parsed.map((r) => r.length));

  // カラーパレット
  const HEADER_BG = "#4a4a4a";   // 濃グレー（ヘッダ行・列）
  const HEADER_FG = "#ffffff";
  const ROW_BG_A = "rgba(139, 21, 21, 0.05)";  // 朱茶薄色（縞 偶数行）
  const ROW_BG_B = "rgba(139, 21, 21, 0.10)";  // 朱茶やや濃（縞 奇数行）
  const BORDER = "rgba(139, 21, 21, 0.15)";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `minmax(120px, 1fr) repeat(${colCount - 1}, 1.6fr)`,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: "hidden",
        fontSize: S.tableFont,
        lineHeight: 1.3,
      }}
    >
      {/* ヘッダ行 */}
      {header.map((cell, c) => (
        <div
          key={`h-${c}`}
          style={{
            background: HEADER_BG,
            color: HEADER_FG,
            fontWeight: "bold",
            padding: "10px 14px",
            borderRight: c < colCount - 1 ? `1px solid rgba(255,255,255,0.15)` : "none",
          }}
        >
          {cell ?? ""}
        </div>
      ))}

      {/* データ行 */}
      {body.map((row, r) =>
        Array.from({ length: colCount }).map((_, c) => {
          const isRowHeader = c === 0;
          const cellValue = row[c] ?? "";
          const stripeBg = r % 2 === 0 ? ROW_BG_A : ROW_BG_B;
          return (
            <div
              key={`b-${r}-${c}`}
              style={{
                background: isRowHeader ? HEADER_BG : stripeBg,
                color: isRowHeader ? HEADER_FG : TEXT,
                fontWeight: isRowHeader ? "bold" : "normal",
                padding: "9px 14px",
                borderTop: `1px solid ${BORDER}`,
                borderRight:
                  c < colCount - 1
                    ? isRowHeader
                      ? "1px solid rgba(255,255,255,0.15)"
                      : `1px solid ${BORDER}`
                    : "none",
              }}
            >
              {cellValue}
            </div>
          );
        })
      )}
    </div>
  );
};

// キャラクターを非表示にするレイアウト（全レイアウト指定 = 常に非表示）
const LAYOUTS_WITHOUT_CHARACTER: SlideLayout[] = [
  "bullets", "code", "compare", "image", "table", "video",
];

// ---- キャラクターレイヤー ----
const CharacterLayer: React.FC<{ speaker: Speaker; S: Sizes }> = ({ speaker, S }) => {
  const name = SPEAKER_CONFIG[speaker].name;
  const color = SPEAKER_CONFIG[speaker].color;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: S.charBottom,
          right: S.charRight,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* キャラクター画像（PNG差し替え時は public/characters/speaker1.png 等を置くだけ） */}
        <Img
          src={staticFile(`characters/${speaker}.svg`)}
          width={S.charWidth}
          height={S.charHeight}
          style={{ display: "block" }}
        />
        <div
          style={{
            color: "white",
            fontSize: S.charNameFont,
            background: color,
            padding: "4px 14px",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          {name}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- 字幕中身（box本体）。position は親が決める ----
const SubtitleBody: React.FC<{ line: TimedLine; frame: number; S: Sizes }> = ({ line, frame, S }) => {
  const opacity = interpolate(
    frame - line.startFrame,
    [0, 8],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const color = SPEAKER_CONFIG[line.speaker].color;

  return (
    <div
      style={{
        background: "rgba(44,26,26,0.88)",
        borderLeft: `5px solid ${color}`,
        borderRadius: 8,
        padding: "16px 24px",
        opacity,
      }}
    >
      <div style={{ color: "white", fontSize: S.subtitleFont, lineHeight: 1.6 }}>
        {line.display_text}
      </div>
    </div>
  );
};

// ---- 字幕レイヤー（横長用 / 画面下部固定）----
const SubtitleLayer: React.FC<{ line: TimedLine; frame: number; rightInset: number; S: Sizes }> = ({ line, frame, rightInset, S }) => {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: S.subtitleBottom,
          left: S.subtitleSidePadding,
          right: rightInset,
        }}
      >
        <SubtitleBody line={line} frame={frame} S={S} />
      </div>
    </AbsoluteFill>
  );
};
