import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const briefSchema = z.object({
  name: z.string().max(80),
  problem: z.string().max(500),
  solution: z.string().max(500),
  demo: z.string().max(800),
  tone: z.enum(["serious", "light", "plain"]),
  durationSec: z.number().min(3).max(420),
});

const ttsSchema = z.object({
  text: z.string().min(1).max(2500),
  voiceId: z.string().min(1).max(40),
  speed: z.number().min(0.7).max(1.5),
});

const sttSchema = z.object({
  base64: z.string().min(1).max(18_000_000),
  mime: z.string().max(80),
});

const refitSchema = z.object({
  source: z.string().min(1).max(12_000),
  durationSec: z.number().min(3).max(420),
  title: z.string().max(80).optional(),
});

export const getAiStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    return { available: Boolean(process.env.XAI_API_KEY) };
  },
);

export const generateScript = createServerFn({ method: "POST" })
  .validator(briefSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI를 사용할 수 없습니다" };

    const toneLine =
      data.tone === "serious"
        ? "톤: 차분하고 신뢰감 있게. 과장 금지."
        : data.tone === "light"
          ? "톤: 가볍고 리듬감 있게. 그래도 정보는 또렷하게."
          : "톤: 담백한 구어체. 발표 멘트가 아니라 옆에 앉아 설명하는 말투.";

    const prompt = `해커톤 시연 영상의 나레이션 대본을 한국어로 작성하라.

작품명: ${data.name || "무제"}
문제: ${data.problem || "(미입력)"}
솔루션: ${data.solution || "(미입력)"}
데모에서 보여줄 것: ${data.demo || "(미입력)"}
영상 길이: ${Math.round(data.durationSec)}초
${toneLine}

규칙:
- 화면을 이미 찍은 뒤 입히는 보이스오버다. "지금부터 시연하겠습니다" 같은 사회자 멘트는 넣지 마라.
- 구어체. 짧은 문장. 한 큐는 1~3문장.
- 영상 길이에 맞춰 큐 시작 시각을 초 단위로 배치하라. 첫 큐는 0초.
- 큐는 4~10개. 데모 구간에 시간을 가장 많이 줘라. (대략 40~50%)
- 마지막 큐는 클로징.
- JSON만 출력. 키: cues: [{ startSec: number, text: string }]
- 마크다운 펜스 금지.`;

    return completeCues(apiKey, prompt, data.durationSec);
  });

export const refitScript = createServerFn({ method: "POST" })
  .validator(refitSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI를 사용할 수 없습니다" };

    const sec = Math.round(data.durationSec);
    const targetChars = Math.max(40, Math.round(sec * 5.4));
    const cueMin = sec < 20 ? 2 : sec < 45 ? 3 : 4;
    const cueMax = sec < 15 ? 4 : sec < 40 ? 6 : sec < 90 ? 8 : sec < 180 ? 10 : 12;
    const source = data.source.slice(0, 8000);

    const prompt = `업로드된 나레이션 대본을 영상 길이에 맞게 다시 짜라. 원문을 그대로 읽지 마라.

작품: ${data.title || "시연"}
영상 길이: ${sec}초
말할 총량: 공백 제외 약 ${targetChars}자. 이보다 길면 반드시 줄여라. 짧으면 억지로 늘리지 마라.
큐 개수: ${cueMin}~${cueMax}개. 첫 큐 0초, 마지막 큐는 영상이 끝나기 전에 말이 끝나게.

원본 대본:
"""
${source}
"""

규칙:
- 핵심 주장, 제품명, 수치, 데모 순서는 유지.
- 군더더기·반복·사회자 멘트는 빼라.
- 한국어 구어체. 한 큐 1~3문장.
- 원본 타임코드가 영상보다 길면 버리고, 0~${sec}초 안에 다시 배치.
- 말이 서로 겹치지 않게 시작 시각을 떨어뜨려라.
- JSON만 출력. 키: cues: [{ startSec: number, text: string }]
- 마크다운 펜스 금지.`;

    return completeCues(apiKey, prompt, data.durationSec);
  });

async function completeCues(apiKey: string, prompt: string, durationSec: number) {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 1800,
      temperature: 0.45,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    return { ok: false as const, error: `대본 생성 실패 (${res.status})` };
  }
  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = body.choices?.[0]?.message?.content ?? "";
  try {
    const parsed = parseCues(text, durationSec);
    return { ok: true as const, cues: parsed };
  } catch {
    return {
      ok: false as const,
      error: "대본 형식을 읽지 못했습니다. 다시 시도해 주세요.",
    };
  }
}

export const synthesizeSpeech = createServerFn({ method: "POST" })
  .validator(ttsSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI를 사용할 수 없습니다" };

    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: data.text,
        voice_id: data.voiceId,
        language: "ko",
        speed: data.speed,
        output_format: {
          codec: "mp3",
          sample_rate: 24000,
          bit_rate: 128000,
        },
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false as const,
        error: `음성 생성 실패 (${res.status})${errText ? `: ${errText.slice(0, 120)}` : ""}`,
      };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: true as const,
      mime: res.headers.get("content-type") || "audio/mpeg",
      base64: buf.toString("base64"),
    };
  });

export const transcribeAudio = createServerFn({ method: "POST" })
  .validator(sttSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI를 사용할 수 없습니다" };

    const bin = Buffer.from(data.base64, "base64");
    const form = new FormData();
    form.append("language", "ko");
    form.append("format", "true");
    form.append(
      "file",
      new Blob([new Uint8Array(bin)], { type: data.mime || "audio/wav" }),
      data.mime.includes("wav") ? "clip.wav" : "clip.webm",
    );

    const res = await fetch("https://api.x.ai/v1/stt", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    if (!res.ok) {
      return { ok: false as const, error: `받아쓰기 실패 (${res.status})` };
    }
    const body = (await res.json()) as {
      text?: string;
      duration?: number;
      words?: { text?: string; start?: number; end?: number }[];
    };
    const text = (body.text ?? "").trim();
    const words = (body.words ?? [])
      .map((w) => ({
        text: String(w.text ?? "").trim(),
        start: Number(w.start ?? 0),
        end: Number(w.end ?? w.start ?? 0),
      }))
      .filter((w) => w.text.length > 0);
    if (!text && !words.length) {
      return { ok: false as const, error: "인식된 말이 없습니다" };
    }
    return { ok: true as const, text, words };
  });

function parseCues(raw: string, durationSec: number) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const src = fenced?.[1] ?? raw;
  const start = src.indexOf("{");
  const end = src.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("no json");
  const json = JSON.parse(src.slice(start, end + 1)) as {
    cues?: { startSec?: number; start?: number; text?: string }[];
  };
  const cues = (json.cues ?? [])
    .map((c) => ({
      startSec: Number(c.startSec ?? c.start ?? 0),
      text: String(c.text ?? "").trim(),
    }))
    .filter((c) => c.text.length > 0)
    .slice(0, 12)
    .map((c) => ({
      startSec: Math.max(0, Math.min(durationSec - 0.4, c.startSec)),
      text: c.text.slice(0, 280),
    }));
  if (!cues.length) throw new Error("empty");
  cues.sort((a, b) => a.startSec - b.startSec);
  return cues;
}
