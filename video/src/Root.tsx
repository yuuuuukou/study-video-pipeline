import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { StudyVideo } from "./StudyVideo";
import type { StudyVideoProps } from "./types";

/**
 * DEFAULT_PROPS は開発時（npx remotion studio）のプレビュー専用。
 * 実際のレンダリング（render.js）では make-props.js が生成した
 * *.props.json が --props で渡されるため、ここの値は上書きされる。
 * → 見た目の確認用ダミーデータなので内容が古くても動作に影響しない。
 */
const DEFAULT_PROPS: StudyVideoProps = {
  title: "git worktreeの使い方",
  sections: [
    {
      section_title: "git worktreeとは",
      layout: "bullets",
      slide_points: [
        "1リポジトリを複数フォルダに同時展開できる",
        "ブランチ切り替え不要で並行作業が可能",
        "同じ .git を共有するので履歴は一元管理",
      ],
      startFrame: 0,
      durationInFrames: 918,
      lines: [
        { speaker: "speaker2", display_text: "git worktreeって何？", audioSrc: "audio/sample/0000_speaker2.wav", startFrame: 0, durationInFrames: 133 },
        { speaker: "speaker1", display_text: "1つのリポジトリを複数のフォルダに同時展開できる仕組みだよ。", audioSrc: "audio/sample/0001_speaker1.wav", startFrame: 133, durationInFrames: 292 },
        { speaker: "speaker2", display_text: "ブランチ切り替えしなくていいの？", audioSrc: "audio/sample/0002_speaker2.wav", startFrame: 425, durationInFrames: 126 },
        { speaker: "speaker1", display_text: "そう！mainブランチの作業と並行で別ブランチの作業ができるよ。", audioSrc: "audio/sample/0003_speaker1.wav", startFrame: 551, durationInFrames: 367 },
      ],
    },
    {
      section_title: "基本コマンド",
      layout: "code",
      slide_points: [
        "# 新しいworktreeを作成",
        "git worktree add ../my-feature -b feature/my-task",
        "",
        "# 一覧確認",
        "git worktree list",
        "",
        "# 削除",
        "git worktree remove ../my-feature",
      ],
      startFrame: 918,
      durationInFrames: 400,
      lines: [
        { speaker: "speaker2", display_text: "どうやって使うの？", audioSrc: "audio/sample/0004_speaker2.wav", startFrame: 918, durationInFrames: 70 },
        { speaker: "speaker1", display_text: "git worktree add にパスとブランチ名を指定すればOKだよ。", audioSrc: "audio/sample/0005_speaker1.wav", startFrame: 988, durationInFrames: 330 },
      ],
    },
    {
      section_title: "worktree vs ブランチ切り替え",
      layout: "compare",
      slide_points: [
        "作業のたびにブランチ切り替えが必要",   // Before 1
        "切り替え不要・フォルダで並行作業",      // After 1
        "IDEが毎回設定をリロードする",           // Before 2
        "IDEを複数ウィンドウで同時起動できる",   // After 2
        "stash/commit し忘れに注意",             // Before 3
        "互いの作業が干渉しない",                // After 3
      ],
      startFrame: 1318,
      durationInFrames: 300,
      lines: [],
    },
    {
      section_title: "参考：Azureのコンピューティングざっくり",
      layout: "table",
      slide_points: [
        "比較項目|VM (IaaS)|App Service (PaaS)|Functions (サーバレス)|AS for Container|AKS (Kubernetes)",
        "インフラ管理|ユーザー担当|Microsoft担当|Microsoft担当|Microsoft担当|共有責任 (中)",
        "スケーリング|手動/複雑|容易/自動|容易/自動|容易/自動|高度/自動",
        "OSアクセス|完全可能|不可|不可|コンテナ内のみ|コンテナ内のみ",
        "管理負荷|非常に高い|低い|低い|低い|高い",
        "最適な用途|レガシー/特殊OS|Webアプリ/API|API|ポータブルなWeb|マイクロサービス",
      ],
      startFrame: 1618,
      durationInFrames: 300,
      lines: [],
    },
    {
      section_title: "image レイアウト デモ",
      layout: "image",
      slide_points: [
        "characters/speaker1.svg",
        "話者アイコンSVGを画像レイアウトで表示",
        "キャプションは複数行書ける",
      ],
      startFrame: 1918,
      durationInFrames: 300,
      lines: [],
    },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StudyVideo"
        component={StudyVideo}
        defaultProps={DEFAULT_PROPS}
        calculateMetadata={({ props }) => {
          const last = props.sections.at(-1);
          const total = last ? last.startFrame + last.durationInFrames : 150;
          return { durationInFrames: total };
        }}
        fps={30}
        width={1280}
        height={720}
      />
      {/* YouTube Shorts 向け縦長 (1080x1920) */}
      <Composition
        id="StudyVideoVertical"
        component={StudyVideo}
        defaultProps={DEFAULT_PROPS}
        calculateMetadata={({ props }) => {
          const last = props.sections.at(-1);
          const total = last ? last.startFrame + last.durationInFrames : 150;
          return { durationInFrames: total };
        }}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
