import type { Brief, Cue } from "./types";
import { packCues } from "./time";

function id() {
  return crypto.randomUUID();
}

export function hackathonBeats(durationMs: number): Cue[] {
  const t = Math.max(durationMs, 8000);
  const beats: { p: number; label: string; hint: string }[] = [
    { p: 0, label: "오프닝", hint: "한 문장으로 문제를 던지세요." },
    { p: 0.1, label: "문제", hint: "누가, 왜, 얼마나 불편한지." },
    { p: 0.25, label: "솔루션", hint: "우리가 만든 것을 한 줄로." },
    { p: 0.4, label: "라이브 데모", hint: "클릭 동선만 따라가게 설명하세요." },
    { p: 0.8, label: "차별점", hint: "왜 하필 이 방식인지." },
    { p: 0.92, label: "클로징", hint: "다음에 할 일과 한 줄 부탁." },
  ];
  return beats.map((b) => ({
    id: id(),
    startMs: Math.round(t * b.p),
    text: `${b.label} — ${b.hint}`,
  }));
}

export const SAMPLE_BRIEF: Brief = {
  name: "TAKE FIVE",
  problem:
    "해커톤 시연 영상을 급하게 찍으면 말이 흔들리고, 대본과 화면이 따로 놉니다.",
  solution:
    "영상을 먼저 찍고, 타임코드에 맞춰 대본을 쓴 뒤, AI 목소리나 내 목소리로 나레이션을 입힙니다.",
  demo: "화면 녹화, 큐 대본, AI 보이스, 볼륨 믹서, 자막, 내보내기",
  tone: "plain",
};

export function sampleCues(durationMs: number): Cue[] {
  const lines = [
    "화면을 먼저 찍고, 말은 나중에.",
    "설명 영상이 늘 급합니다.",
    "녹화부터 내보내기까지, 한곳에서.",
    "AI로 입히거나 직접 읽습니다.",
  ];
  const cues = lines.map((text, i) => ({
    id: id(),
    startMs: Math.round((durationMs * i) / lines.length),
    text,
  }));
  return packCues(cues, durationMs);
}

export const TONE_LABEL: Record<Brief["tone"], string> = {
  serious: "진지하게",
  light: "경쾌하게",
  plain: "담백하게",
};
