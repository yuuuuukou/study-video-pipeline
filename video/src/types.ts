export type Speaker = "speaker1" | "speaker2";

export type SlideLayout = "bullets" | "code" | "compare" | "image" | "table" | "video";

export type TimedLine = {
  speaker: Speaker;
  display_text: string;
  audioSrc: string; // public/ 以下のパス
  startFrame: number;
  durationInFrames: number;
};

export type TimedSection = {
  section_title: string;
  /**
   * スライドのレイアウト種別（省略時は "bullets"）
   * - bullets : 番号付き箇条書き（デフォルト）
   * - code    : コードブロック表示（slide_points の各要素を1行として表示）
   * - compare : 左右比較（even index → 左列, odd index → 右列）
   * - image   : 画像表示（slide_points[0] = 画像パス/URL, 残りはキャプション）
   * - table   : 表形式（各要素を "|" 区切りで列に分割。1行目=ヘッダ、先頭列=行ヘッダ）
   * - video   : 動画表示（video.src = public/ 以下の動画パス）
   */
  layout?: SlideLayout;
  /**
   * compare レイアウト時の左右ヘッダ。未指定時は ["Before", "After"]。
   * 例: ["VOICEVOX", "Remotion"], ["旧", "新"]
   */
  compare_labels?: [string, string];
  video?: {
    src: string;
  };
  slide_points: string[];
  lines: TimedLine[];
  startFrame: number;
  durationInFrames: number;
};

export type StudyVideoProps = {
  title: string;
  sections: TimedSection[];
};
