export type StepId = "record" | "script" | "voice" | "export";

export type RecordMode = "screen" | "camera" | "pip" | "upload" | "sample";

export type CaptionSource = "audio" | "script";
export type VoiceKind = "ai" | "mic";
export type VoiceGender = "male" | "female";

export interface Cue {
  id: string;
  startMs: number;
  endMs?: number;
  text: string;
  kind?: "line" | "pause";
}

export interface Mixer {
  videoVolume: number;
  narrationVolume: number;
  muteOriginal: boolean;
  burnSubtitles: boolean;
}

export interface Brief {
  name: string;
  problem: string;
  solution: string;
  demo: string;
  tone: "serious" | "light" | "plain";
}

export const STEPS: { id: StepId; label: string; n: string }[] = [
  { id: "record", label: "찍기", n: "01" },
  { id: "script", label: "대본", n: "02" },
  { id: "voice", label: "목소리", n: "03" },
  { id: "export", label: "내보내기", n: "04" },
];

export const LIMIT_MS = 5 * 60 * 1000;
export const WARN_MS = 4 * 60 * 1000 + 30 * 1000;

export const VOICES = [
  { id: "orion", name: "오리온", hint: "시네마틱 내레이션", gender: "male" },
  { id: "leo", name: "레오", hint: "무게감 있는", gender: "male" },
  { id: "rex", name: "렉스", hint: "또렷하고 분명한", gender: "male" },
  { id: "sal", name: "살", hint: "부드럽고 균형 잡힌", gender: "male" },
  { id: "perseus", name: "페르세우스", hint: "신뢰감", gender: "male" },
  { id: "atlas", name: "아틀라스", hint: "자신감 있는", gender: "male" },
  { id: "lux", name: "럭스", hint: "차분한", gender: "male" },
  { id: "rigel", name: "리겔", hint: "프로페셔널", gender: "male" },
  { id: "zagan", name: "자간", hint: "드라마틱", gender: "male" },
  { id: "helix", name: "헬릭스", hint: "다이나믹", gender: "male" },
  { id: "eve", name: "이브", hint: "따뜻하고 또렷한", gender: "female" },
  { id: "ara", name: "아라", hint: "맑고 밝은", gender: "female" },
  { id: "luna", name: "루나", hint: "차분한", gender: "female" },
  { id: "iris", name: "아이리스", hint: "부드러운", gender: "female" },
  { id: "aurora", name: "오로라", hint: "경쾌한", gender: "female" },
  { id: "liora", name: "리오라", hint: "신뢰감", gender: "female" },
  { id: "celeste", name: "셀레스트", hint: "우아한", gender: "female" },
  { id: "carina", name: "카리나", hint: "또렷하고 분명한", gender: "female" },
  { id: "ursa", name: "우르사", hint: "무게감 있는", gender: "female" },
] as const;

export type VoiceId = (typeof VOICES)[number]["id"];

export const DEFAULT_VOICE_ID: VoiceId = "orion";
export const DEFAULT_FEMALE_VOICE_ID: VoiceId = "eve";

export function voicesByGender(gender: VoiceGender) {
  return VOICES.filter((v) => v.gender === gender);
}

export function voiceGender(id: string): VoiceGender {
  return VOICES.find((v) => v.id === id)?.gender ?? "male";
}

export const CANVAS = {
  bg: "#09090b",
  card: "#131316",
  fg: "#f4f1ea",
  muted: "#9a958c",
  rec: "#c45c4a",
  steel: "#c5cdd6",
};
