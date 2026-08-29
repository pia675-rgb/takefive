import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-ai-D31dFm9e.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var briefSchema = object({
	name: string().max(80),
	problem: string().max(500),
	solution: string().max(500),
	demo: string().max(800),
	tone: _enum([
		"serious",
		"light",
		"plain"
	]),
	durationSec: number().min(3).max(420)
});
var ttsSchema = object({
	text: string().min(1).max(2500),
	voiceId: string().min(1).max(40),
	speed: number().min(.7).max(1.5)
});
var sttSchema = object({
	base64: string().min(1).max(18e6),
	mime: string().max(80)
});
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "363edf024cb19c6043138ac5f90a948c88693eb191b5929972001fcd8d39630f",
	name: "getAiStatus",
	filename: "src/lib/ai/studio-ai.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	return { available: Boolean(process.env.XAI_API_KEY) };
});
var generateScript_createServerFn_handler = createServerRpc({
	id: "232d6b3ff90385172d5c5bd2465796d35a7aa80f10b2d9082a98bfbd4838d8c5",
	name: "generateScript",
	filename: "src/lib/ai/studio-ai.ts"
}, (opts) => generateScript.__executeServer(opts));
var generateScript = createServerFn({ method: "POST" }).validator(briefSchema).handler(generateScript_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI를 사용할 수 없습니다"
	};
	const toneLine = data.tone === "serious" ? "톤: 차분하고 신뢰감 있게. 과장 금지." : data.tone === "light" ? "톤: 가볍고 리듬감 있게. 그래도 정보는 또렷하게." : "톤: 담백한 구어체. 발표 멘트가 아니라 옆에 앉아 설명하는 말투.";
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
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 1800,
			temperature: .6,
			messages: [{
				role: "user",
				content: prompt
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `대본 생성 실패 (${res.status})`
	};
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	try {
		return {
			ok: true,
			cues: parseCues(text, data.durationSec)
		};
	} catch {
		return {
			ok: false,
			error: "대본 형식을 읽지 못했습니다. 다시 시도해 주세요."
		};
	}
});
var synthesizeSpeech_createServerFn_handler = createServerRpc({
	id: "a8eebe88bf826b68aa2c5168edd1bb09c0256a9e3dc7593354785ee6655a516c",
	name: "synthesizeSpeech",
	filename: "src/lib/ai/studio-ai.ts"
}, (opts) => synthesizeSpeech.__executeServer(opts));
var synthesizeSpeech = createServerFn({ method: "POST" }).validator(ttsSchema).handler(synthesizeSpeech_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI를 사용할 수 없습니다"
	};
	const res = await fetch("https://api.x.ai/v1/tts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			text: data.text,
			voice_id: data.voiceId,
			language: "ko",
			speed: data.speed,
			output_format: {
				codec: "mp3",
				sample_rate: 24e3,
				bit_rate: 128e3
			}
		})
	});
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		return {
			ok: false,
			error: `음성 생성 실패 (${res.status})${errText ? `: ${errText.slice(0, 120)}` : ""}`
		};
	}
	const buf = Buffer.from(await res.arrayBuffer());
	return {
		ok: true,
		mime: res.headers.get("content-type") || "audio/mpeg",
		base64: buf.toString("base64")
	};
});
var transcribeAudio_createServerFn_handler = createServerRpc({
	id: "37b761e06913459188d55188d472c912d96b5ef8c31745a576fe3f68d19291df",
	name: "transcribeAudio",
	filename: "src/lib/ai/studio-ai.ts"
}, (opts) => transcribeAudio.__executeServer(opts));
var transcribeAudio = createServerFn({ method: "POST" }).validator(sttSchema).handler(transcribeAudio_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI를 사용할 수 없습니다"
	};
	const bin = Buffer.from(data.base64, "base64");
	const form = new FormData();
	form.append("language", "ko");
	form.append("format", "true");
	form.append("file", new Blob([new Uint8Array(bin)], { type: data.mime || "audio/wav" }), data.mime.includes("wav") ? "clip.wav" : "clip.webm");
	const res = await fetch("https://api.x.ai/v1/stt", {
		method: "POST",
		headers: { Authorization: `Bearer ${apiKey}` },
		body: form
	});
	if (!res.ok) return {
		ok: false,
		error: `받아쓰기 실패 (${res.status})`
	};
	const body = await res.json();
	const text = (body.text ?? "").trim();
	const words = (body.words ?? []).map((w) => ({
		text: String(w.text ?? "").trim(),
		start: Number(w.start ?? 0),
		end: Number(w.end ?? w.start ?? 0)
	})).filter((w) => w.text.length > 0);
	if (!text && !words.length) return {
		ok: false,
		error: "인식된 말이 없습니다"
	};
	return {
		ok: true,
		text,
		words
	};
});
function parseCues(raw, durationSec) {
	const src = raw.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? raw;
	const start = src.indexOf("{");
	const end = src.lastIndexOf("}");
	if (start < 0 || end < 0) throw new Error("no json");
	const cues = (JSON.parse(src.slice(start, end + 1)).cues ?? []).map((c) => ({
		startSec: Number(c.startSec ?? c.start ?? 0),
		text: String(c.text ?? "").trim()
	})).filter((c) => c.text.length > 0).slice(0, 12).map((c) => ({
		startSec: Math.max(0, Math.min(durationSec - .4, c.startSec)),
		text: c.text.slice(0, 280)
	}));
	if (!cues.length) throw new Error("empty");
	cues.sort((a, b) => a.startSec - b.startSec);
	cues[0].startSec = 0;
	return cues;
}
//#endregion
export { generateScript_createServerFn_handler, getAiStatus_createServerFn_handler, synthesizeSpeech_createServerFn_handler, transcribeAudio_createServerFn_handler };
