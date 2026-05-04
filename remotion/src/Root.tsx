import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { StudyVideo } from "./StudyVideo";
import type { StudyVideoProps } from "./types";

/**
 * DEFAULT_PROPS は開発時（npx remotion studio）のプレビュー専用。
 * 実際のレンダリング（render.js）では make-props.js が生成した
 * *.props.json が --props で渡されるため、ここの値は上書きされる。
 * 音声ファイル未生成でもStudioで開きやすいよう、音声なしの静止セクションにしている。
 */
const DEFAULT_PROPS: StudyVideoProps = {
  title: "動画生成パイプラインの最小サンプル",
  sections: [
    {
      section_title: "全体像",
      layout: "bullets",
      slide_points: [
        "台本JSONを書く",
        "VOICEVOXで音声を作る",
        "Remotionで動画を書き出す",
      ],
      startFrame: 0,
      durationInFrames: 150,
      lines: [],
    },
    {
      section_title: "使うもの",
      layout: "code",
      slide_points: [
        "git clone https://github.com/yuuuuukou/study-video-pipeline.git",
        "npm install --prefix remotion",
        "node scripts/render.js examples/sample.json",
      ],
      startFrame: 150,
      durationInFrames: 150,
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
