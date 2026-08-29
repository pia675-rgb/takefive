import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
import { _ as CircleUser, b as Captions, c as Sparkles, d as Pause, f as Monitor, g as Clapperboard, h as Download, i as Upload, l as Plus, m as FileText, n as WandSparkles, o as Trash2, p as Mic, r as Volume2, s as Square, t as X, u as Play, v as ChevronDown, x as Camera, y as Check } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as cn } from "./router-BxWpV8Ft.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
import { n as Root$1, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BrKSjzQl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("363edf024cb19c6043138ac5f90a948c88693eb191b5929972001fcd8d39630f"));
var generateScript = createServerFn({ method: "POST" }).validator(briefSchema).handler(createSsrRpc("232d6b3ff90385172d5c5bd2465796d35a7aa80f10b2d9082a98bfbd4838d8c5"));
var synthesizeSpeech = createServerFn({ method: "POST" }).validator(ttsSchema).handler(createSsrRpc("a8eebe88bf826b68aa2c5168edd1bb09c0256a9e3dc7593354785ee6655a516c"));
var transcribeAudio = createServerFn({ method: "POST" }).validator(sttSchema).handler(createSsrRpc("37b761e06913459188d55188d472c912d96b5ef8c31745a576fe3f68d19291df"));
var STEPS = [
	{
		id: "record",
		label: "찍기",
		n: "01"
	},
	{
		id: "script",
		label: "대본",
		n: "02"
	},
	{
		id: "voice",
		label: "목소리",
		n: "03"
	},
	{
		id: "export",
		label: "내보내기",
		n: "04"
	}
];
var LIMIT_MS = 3e5;
var WARN_MS = 27e4;
var VOICES = [
	{
		id: "orion",
		name: "오리온",
		hint: "시네마틱 내레이션",
		gender: "male"
	},
	{
		id: "leo",
		name: "레오",
		hint: "무게감 있는",
		gender: "male"
	},
	{
		id: "rex",
		name: "렉스",
		hint: "또렷하고 분명한",
		gender: "male"
	},
	{
		id: "sal",
		name: "살",
		hint: "부드럽고 균형 잡힌",
		gender: "male"
	},
	{
		id: "perseus",
		name: "페르세우스",
		hint: "신뢰감",
		gender: "male"
	},
	{
		id: "atlas",
		name: "아틀라스",
		hint: "자신감 있는",
		gender: "male"
	},
	{
		id: "lux",
		name: "럭스",
		hint: "차분한",
		gender: "male"
	},
	{
		id: "rigel",
		name: "리겔",
		hint: "프로페셔널",
		gender: "male"
	},
	{
		id: "zagan",
		name: "자간",
		hint: "드라마틱",
		gender: "male"
	},
	{
		id: "helix",
		name: "헬릭스",
		hint: "다이나믹",
		gender: "male"
	},
	{
		id: "eve",
		name: "이브",
		hint: "따뜻하고 또렷한",
		gender: "female"
	},
	{
		id: "ara",
		name: "아라",
		hint: "맑고 밝은",
		gender: "female"
	},
	{
		id: "luna",
		name: "루나",
		hint: "차분한",
		gender: "female"
	},
	{
		id: "iris",
		name: "아이리스",
		hint: "부드러운",
		gender: "female"
	},
	{
		id: "aurora",
		name: "오로라",
		hint: "경쾌한",
		gender: "female"
	},
	{
		id: "liora",
		name: "리오라",
		hint: "신뢰감",
		gender: "female"
	},
	{
		id: "celeste",
		name: "셀레스트",
		hint: "우아한",
		gender: "female"
	},
	{
		id: "carina",
		name: "카리나",
		hint: "또렷하고 분명한",
		gender: "female"
	},
	{
		id: "ursa",
		name: "우르사",
		hint: "무게감 있는",
		gender: "female"
	}
];
var DEFAULT_VOICE_ID = "orion";
function voicesByGender(gender) {
	return VOICES.filter((v) => v.gender === gender);
}
function voiceGender(id) {
	return VOICES.find((v) => v.id === id)?.gender ?? "male";
}
var CANVAS = {
	bg: "#09090b",
	card: "#131316",
	fg: "#f4f1ea",
	muted: "#9a958c",
	rec: "#c45c4a",
	steel: "#c5cdd6"
};
var DB_NAME = "take-five";
var STORE = "media";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function idbSet(key, value) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(value, key);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}
async function idbGet(key) {
	const db = await openDb();
	const value = await new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
	db.close();
	return value;
}
async function idbDel(key) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(key);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}
async function idbClear() {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).clear();
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
}
var videoBlob = null;
var videoUrl = null;
var narrationBlob = null;
var narrationUrl = null;
function swapUrl(prev, blob) {
	if (prev) URL.revokeObjectURL(prev);
	return blob ? URL.createObjectURL(blob) : null;
}
function setVideoBlob(blob) {
	videoBlob = blob;
	videoUrl = swapUrl(videoUrl, blob);
}
function getVideoBlob() {
	return videoBlob;
}
function getVideoUrl() {
	return videoUrl;
}
function setNarrationBlob(blob) {
	narrationBlob = blob;
	narrationUrl = swapUrl(narrationUrl, blob);
}
function getNarrationBlob() {
	return narrationBlob;
}
function getNarrationUrl() {
	return narrationUrl;
}
var VIDEO_EXT = /\.(mp4|m4v|mov|webm|mkv|avi|ogv|3gp)$/i;
/** iOS gallery files often arrive with an empty MIME type. */
function isLikelyVideoFile(file) {
	if (file.type.startsWith("video/")) return true;
	return VIDEO_EXT.test(file.name);
}
function pickRecorderMime(kind) {
	if (typeof MediaRecorder === "undefined") return void 0;
	return (kind === "video" ? [
		"video/mp4;codecs=avc1.42E01E,mp4a.40.2",
		"video/mp4;codecs=avc1.4d001f,mp4a.40.2",
		"video/mp4",
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp8,opus",
		"video/webm"
	] : [
		"audio/mp4",
		"audio/webm;codecs=opus",
		"audio/webm",
		"audio/aac"
	]).find((c) => MediaRecorder.isTypeSupported(c));
}
function videoDurationMs(blob) {
	return new Promise((resolve, reject) => {
		const el = document.createElement("video");
		el.preload = "metadata";
		const url = URL.createObjectURL(blob);
		let settled = false;
		const done = (ms) => {
			if (settled) return;
			settled = true;
			URL.revokeObjectURL(url);
			resolve(Math.max(0, ms));
		};
		const timer = window.setTimeout(() => done(0), 1500);
		el.onloadedmetadata = () => {
			if (Number.isFinite(el.duration) && el.duration > 0) {
				window.clearTimeout(timer);
				done(el.duration * 1e3);
				return;
			}
			el.ontimeupdate = () => {
				if (Number.isFinite(el.duration) && el.duration > 0) {
					window.clearTimeout(timer);
					el.ontimeupdate = null;
					done(el.duration * 1e3);
				}
			};
			try {
				el.currentTime = 1e10;
			} catch {
				window.clearTimeout(timer);
				done(0);
			}
		};
		el.onerror = () => {
			window.clearTimeout(timer);
			URL.revokeObjectURL(url);
			if (!settled) {
				settled = true;
				reject(/* @__PURE__ */ new Error("영상을 읽지 못했습니다"));
			}
		};
		el.src = url;
	});
}
function audioDurationMs(blob) {
	return new Promise((resolve, reject) => {
		const el = document.createElement("audio");
		el.preload = "metadata";
		const url = URL.createObjectURL(blob);
		el.onloadedmetadata = () => {
			const d = Number.isFinite(el.duration) ? el.duration * 1e3 : 0;
			URL.revokeObjectURL(url);
			resolve(d);
		};
		el.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("오디오를 읽지 못했습니다"));
		};
		el.src = url;
	});
}
function base64ToBlob(b64, mime) {
	const bin = atob(b64);
	const bytes = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return new Blob([bytes], { type: mime });
}
async function blobToBase64(blob) {
	const buf = await blob.arrayBuffer();
	const bytes = new Uint8Array(buf);
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
function audioBufferToWav(buffer) {
	const numCh = buffer.numberOfChannels;
	const sampleRate = buffer.sampleRate;
	const samples = buffer.length;
	const blockAlign = numCh * 2;
	const dataSize = samples * blockAlign;
	const out = new ArrayBuffer(44 + dataSize);
	const view = new DataView(out);
	const writeStr = (offset, str) => {
		for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
	};
	writeStr(0, "RIFF");
	view.setUint32(4, 36 + dataSize, true);
	writeStr(8, "WAVE");
	writeStr(12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, 1, true);
	view.setUint16(22, numCh, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * blockAlign, true);
	view.setUint16(32, blockAlign, true);
	view.setUint16(34, 16, true);
	writeStr(36, "data");
	view.setUint32(40, dataSize, true);
	const channels = [];
	for (let c = 0; c < numCh; c++) channels.push(buffer.getChannelData(c));
	let offset = 44;
	for (let i = 0; i < samples; i++) for (let c = 0; c < numCh; c++) {
		const s = Math.max(-1, Math.min(1, channels[c][i] ?? 0));
		view.setInt16(offset, s < 0 ? s * 32768 : s * 32767, true);
		offset += 2;
	}
	return new Blob([out], { type: "audio/wav" });
}
async function decodeAudioBlob(blob) {
	const ctx = new AudioContext();
	const buf = await blob.arrayBuffer();
	const audio = await ctx.decodeAudioData(buf.slice(0));
	await ctx.close();
	return audio;
}
async function stitchCueAudio(items, minDurationMs) {
	if (items.length === 0) throw new Error("붙일 오디오가 없습니다");
	const decoded = await Promise.all(items.map(async (it) => ({
		startMs: it.startMs,
		buffer: await decodeAudioBlob(it.blob)
	})));
	decoded.sort((a, b) => a.startMs - b.startMs);
	const sampleRate = decoded[0]?.buffer.sampleRate ?? 44100;
	const GAP = .14;
	let cursor = 0;
	const placed = decoded.map((d) => {
		const start = Math.max(0, d.startMs / 1e3, cursor);
		cursor = start + d.buffer.duration + GAP;
		return {
			buffer: d.buffer,
			at: start
		};
	});
	const endSec = Math.max(minDurationMs / 1e3, cursor);
	const length = Math.max(1, Math.ceil(endSec * sampleRate));
	const offline = new OfflineAudioContext(2, length, sampleRate);
	for (const d of placed) {
		const src = offline.createBufferSource();
		src.buffer = d.buffer;
		src.connect(offline.destination);
		src.start(d.at);
	}
	return {
		blob: audioBufferToWav(await offline.startRendering()),
		startsMs: placed.map((p) => Math.round(p.at * 1e3))
	};
}
async function extractAudioForStt(media) {
	const raw = await media.arrayBuffer();
	const ctx = new AudioContext();
	let decoded;
	try {
		decoded = await ctx.decodeAudioData(raw.slice(0));
	} finally {
		await ctx.close().catch(() => void 0);
	}
	const targetRate = 16e3;
	const length = Math.max(1, Math.ceil(decoded.duration * targetRate));
	const offline = new OfflineAudioContext(1, length, targetRate);
	const src = offline.createBufferSource();
	src.buffer = decoded;
	src.connect(offline.destination);
	src.start(0);
	const rendered = await offline.startRendering();
	if (peakAmplitude(rendered) < .008) throw new Error("silent");
	return {
		blob: audioBufferToWav(rendered),
		mime: "audio/wav"
	};
}
function peakAmplitude(buffer) {
	let peak = 0;
	for (let c = 0; c < buffer.numberOfChannels; c++) {
		const data = buffer.getChannelData(c);
		for (let i = 0; i < data.length; i += 64) {
			const v = Math.abs(data[i] ?? 0);
			if (v > peak) peak = v;
		}
	}
	return peak;
}
function formatTimecode(ms, withMs = false) {
	const clamped = Math.max(0, ms);
	const totalSec = Math.floor(clamped / 1e3);
	const m = Math.floor(totalSec / 60);
	const s = totalSec % 60;
	if (!withMs) return `${m}:${s.toString().padStart(2, "0")}`;
	const frac = Math.floor(clamped % 1e3 / 100);
	return `${m}:${s.toString().padStart(2, "0")}.${frac}`;
}
function formatSrtTime(ms) {
	const clamped = Math.max(0, Math.floor(ms));
	const h = Math.floor(clamped / 36e5);
	const m = Math.floor(clamped % 36e5 / 6e4);
	const s = Math.floor(clamped % 6e4 / 1e3);
	const milli = clamped % 1e3;
	return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${milli.toString().padStart(3, "0")}`;
}
/** Korean narration ≈ 370 characters / minute. */
function estimateSpeechMs(text) {
	const chars = text.replace(/\s+/g, "").length;
	if (!chars) return 0;
	return chars / 6.2 * 1e3;
}
function cueWindows(cues, durationMs) {
	const sorted = [...cues].sort((a, b) => a.startMs - b.startMs);
	return sorted.map((cue, i) => {
		if (cue.endMs && cue.endMs > cue.startMs) return {
			...cue,
			endMs: cue.endMs
		};
		const endMs = sorted[i + 1]?.startMs ?? durationMs;
		return {
			...cue,
			endMs: Math.max(endMs, cue.startMs + 400)
		};
	});
}
function packCues(cues, durationMs, gapMs = 160) {
	const sorted = [...cues].filter((c) => c.text.trim()).sort((a, b) => a.startMs - b.startMs);
	let t = 0;
	return sorted.map((c) => {
		const spoken = Math.max(400, estimateSpeechMs(c.text));
		const startMs = Math.max(0, Math.max(c.startMs, t));
		const endMs = startMs + spoken;
		t = endMs + gapMs;
		return {
			...c,
			startMs,
			endMs
		};
	});
}
function overlappingCueIds(cues) {
	const sorted = [...cues].filter((c) => c.text.trim()).sort((a, b) => a.startMs - b.startMs);
	const ids = /* @__PURE__ */ new Set();
	for (let i = 0; i < sorted.length - 1; i++) {
		const c = sorted[i];
		const spoken = estimateSpeechMs(c.text);
		const next = sorted[i + 1];
		if (spoken > 0 && c.startMs + spoken > next.startMs + 40) {
			ids.add(c.id);
			ids.add(next.id);
		}
	}
	return ids;
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	a.style.display = "none";
	document.body.appendChild(a);
	a.click();
	window.setTimeout(() => {
		a.remove();
		URL.revokeObjectURL(url);
	}, 1500);
}
function cuesToSrt(cues, durationMs) {
	return cueWindows(cues, durationMs).map((c, i) => {
		return `${i + 1}\n${formatSrtTime(c.startMs)} --> ${formatSrtTime(c.endMs)}\n${c.text.trim()}\n`;
	}).join("\n");
}
function slugify(title) {
	return title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w가-힣-]+/g, "").slice(0, 40) || "take-five";
}
function id() {
	return crypto.randomUUID();
}
function hackathonBeats(durationMs) {
	const t = Math.max(durationMs, 8e3);
	return [
		{
			p: 0,
			label: "오프닝",
			hint: "한 문장으로 문제를 던지세요."
		},
		{
			p: .1,
			label: "문제",
			hint: "누가, 왜, 얼마나 불편한지."
		},
		{
			p: .25,
			label: "솔루션",
			hint: "우리가 만든 것을 한 줄로."
		},
		{
			p: .4,
			label: "라이브 데모",
			hint: "클릭 동선만 따라가게 설명하세요."
		},
		{
			p: .8,
			label: "차별점",
			hint: "왜 하필 이 방식인지."
		},
		{
			p: .92,
			label: "클로징",
			hint: "다음에 할 일과 한 줄 부탁."
		}
	].map((b) => ({
		id: id(),
		startMs: Math.round(t * b.p),
		text: `${b.label} — ${b.hint}`
	}));
}
function sampleCues(durationMs) {
	const lines = [
		"화면을 먼저 찍고, 말은 나중에.",
		"설명 영상이 늘 급합니다.",
		"녹화부터 내보내기까지, 한곳에서.",
		"AI로 입히거나 직접 읽습니다."
	];
	return packCues(lines.map((text, i) => ({
		id: id(),
		startMs: Math.round(durationMs * i / lines.length),
		text
	})), durationMs);
}
var defaultBrief = {
	name: "",
	problem: "",
	solution: "",
	demo: "",
	tone: "plain"
};
var defaultMixer = {
	videoVolume: .25,
	narrationVolume: 1,
	muteOriginal: true,
	burnSubtitles: false
};
var useStudio = create()(persist((set, get) => ({
	hydrated: false,
	step: "record",
	title: "해커톤 시연",
	hasVideo: false,
	durationMs: 0,
	trimStartMs: 0,
	trimEndMs: 0,
	limitMs: LIMIT_MS,
	cues: [],
	captions: [],
	captionSource: null,
	brief: defaultBrief,
	voiceId: DEFAULT_VOICE_ID,
	voiceSpeed: 1,
	hasNarration: false,
	narrationKind: null,
	narrationDurationMs: 0,
	mixer: defaultMixer,
	mediaRev: 0,
	hydrate: async () => {
		try {
			const video = await idbGet("video");
			if (video) {
				setVideoBlob(video);
				let duration = get().durationMs;
				if (!duration) duration = await videoDurationMs(video);
				set({
					hasVideo: true,
					durationMs: duration,
					trimEndMs: get().trimEndMs || duration
				});
			}
			const narration = await idbGet("narration");
			if (narration) {
				setNarrationBlob(narration);
				set({ hasNarration: true });
			}
		} finally {
			set((s) => ({
				hydrated: true,
				mediaRev: s.mediaRev + 1
			}));
		}
	},
	setStep: (step) => set({ step }),
	setTitle: (title) => set({ title }),
	setBrief: (patch) => set({ brief: {
		...get().brief,
		...patch
	} }),
	setCues: (cues) => set({
		cues,
		captions: [],
		captionSource: null
	}),
	retimeCues: (cues) => set({ cues }),
	packSpeech: () => {
		const { cues, durationMs } = get();
		set({ cues: packCues(cues, durationMs) });
	},
	addCue: (atMs, text) => {
		const cue = {
			id: crypto.randomUUID(),
			startMs: Math.max(0, Math.round(atMs)),
			text: text ?? ""
		};
		set({ cues: [...get().cues, cue].sort((a, b) => a.startMs - b.startMs) });
	},
	updateCue: (id, patch) => {
		set({ cues: get().cues.map((c) => c.id === id ? {
			...c,
			...patch
		} : c).sort((a, b) => a.startMs - b.startMs) });
	},
	removeCue: (id) => set({ cues: get().cues.filter((c) => c.id !== id) }),
	setCaptions: (captions, source) => set({
		captions,
		captionSource: source
	}),
	updateCaption: (id, patch) => {
		set({ captions: get().captions.map((c) => c.id === id ? {
			...c,
			...patch
		} : c).sort((a, b) => a.startMs - b.startMs) });
	},
	removeCaption: (id) => set({ captions: get().captions.filter((c) => c.id !== id) }),
	setVoice: (voiceId, speed) => set({
		voiceId,
		voiceSpeed: speed ?? get().voiceSpeed
	}),
	setMixer: (patch) => set({ mixer: {
		...get().mixer,
		...patch
	} }),
	setTrim: (startMs, endMs) => set({
		trimStartMs: Math.max(0, startMs),
		trimEndMs: Math.max(startMs + 400, endMs)
	}),
	applyVideo: async (blob, name, durationHintMs) => {
		let duration = 0;
		try {
			duration = await videoDurationMs(blob);
		} catch {
			duration = 0;
		}
		if (durationHintMs && duration < Math.max(1e3, durationHintMs * .8)) duration = durationHintMs;
		const limit = get().limitMs;
		setVideoBlob(blob);
		await idbSet("video", blob);
		setNarrationBlob(null);
		await idbDel("narration");
		const nextTitle = name ? name.replace(/\.[^.]+$/, "") : get().title;
		const prevDur = get().durationMs;
		const cues = Boolean(name && /샘플/.test(name)) || !get().cues.length || prevDur === 0 ? sampleCues(Math.min(duration, limit)) : packCues(get().cues, Math.min(duration, limit));
		set({
			hasVideo: true,
			durationMs: duration,
			trimStartMs: 0,
			trimEndMs: Math.min(duration, limit),
			title: nextTitle,
			cues,
			captions: [],
			captionSource: null,
			hasNarration: false,
			narrationKind: null,
			narrationDurationMs: 0,
			step: "script",
			mediaRev: get().mediaRev + 1
		});
	},
	applyNarration: async (blob, kind, durationMs) => {
		setNarrationBlob(blob);
		await idbSet("narration", blob);
		set({
			hasNarration: true,
			narrationKind: kind,
			narrationDurationMs: durationMs,
			mediaRev: get().mediaRev + 1,
			step: "export"
		});
	},
	clearNarration: async () => {
		setNarrationBlob(null);
		await idbDel("narration");
		set({
			hasNarration: false,
			narrationKind: null,
			narrationDurationMs: 0,
			mediaRev: get().mediaRev + 1
		});
	},
	resetAll: async () => {
		setVideoBlob(null);
		setNarrationBlob(null);
		await idbClear();
		set({
			step: "record",
			title: "해커톤 시연",
			hasVideo: false,
			durationMs: 0,
			trimStartMs: 0,
			trimEndMs: 0,
			cues: [],
			captions: [],
			captionSource: null,
			brief: defaultBrief,
			hasNarration: false,
			narrationKind: null,
			narrationDurationMs: 0,
			mixer: defaultMixer,
			mediaRev: get().mediaRev + 1
		});
	}
}), {
	name: "take-five-studio",
	partialize: (s) => ({
		step: s.step,
		title: s.title,
		durationMs: s.durationMs,
		trimStartMs: s.trimStartMs,
		trimEndMs: s.trimEndMs,
		cues: s.cues,
		captions: s.captions,
		captionSource: s.captionSource,
		brief: s.brief,
		voiceId: s.voiceId,
		voiceSpeed: s.voiceSpeed,
		narrationKind: s.narrationKind,
		mixer: s.mixer
	})
}));
function videoSrc() {
	return getVideoUrl();
}
function narrationSrc() {
	return getNarrationUrl();
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[scale,background-color,color,opacity,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90 active:not-disabled:scale-[0.96]",
			rec: "bg-rec text-foreground hover:bg-rec/90 active:not-disabled:scale-[0.96]",
			outline: "bg-transparent shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] hover:bg-secondary active:not-disabled:scale-[0.96]",
			secondary: "bg-secondary text-secondary-foreground hover:bg-elevated active:not-disabled:scale-[0.96]",
			ghost: "hover:bg-secondary hover:text-foreground active:not-disabled:scale-[0.96]",
			steel: "bg-steel text-accent-foreground hover:bg-steel/90 active:not-disabled:scale-[0.96]"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-sm px-3 text-xs",
			lg: "h-12 rounded-lg px-5",
			icon: "size-11",
			"icon-sm": "size-9 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var VideoPane = (0, import_react.forwardRef)(function VideoPane({ src, durationMs, cues = [], captions, showCaptions = false, narrationUrl, muteOriginal = false, videoVolume = 1, narrationVolume = 1, onTime, overlay, empty, className }, ref) {
	const videoRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [t, setT] = (0, import_react.useState)(0);
	const barRef = (0, import_react.useRef)(null);
	(0, import_react.useImperativeHandle)(ref, () => ({
		play: () => void videoRef.current?.play(),
		pause: () => videoRef.current?.pause(),
		seek: (ms) => {
			if (videoRef.current) videoRef.current.currentTime = ms / 1e3;
			if (audioRef.current) audioRef.current.currentTime = ms / 1e3;
			setT(ms);
			onTime?.(ms);
		},
		toggle: () => {
			const v = videoRef.current;
			if (!v) return;
			if (v.paused) v.play();
			else v.pause();
		},
		getEl: () => videoRef.current
	}));
	(0, import_react.useEffect)(() => {
		const v = videoRef.current;
		if (!v) return;
		v.muted = muteOriginal;
		v.volume = muteOriginal ? 0 : videoVolume;
	}, [
		muteOriginal,
		videoVolume,
		src
	]);
	(0, import_react.useEffect)(() => {
		const a = audioRef.current;
		if (a) a.volume = narrationVolume;
	}, [narrationVolume, narrationUrl]);
	(0, import_react.useEffect)(() => {
		const v = videoRef.current;
		const a = audioRef.current;
		if (!v) return;
		const sync = () => {
			const ms = v.currentTime * 1e3;
			setT(ms);
			onTime?.(ms);
		};
		const onPlay = () => {
			setPlaying(true);
			if (a && narrationUrl) {
				a.currentTime = v.currentTime;
				a.play();
			}
		};
		const onPause = () => {
			setPlaying(false);
			a?.pause();
		};
		const onSeek = () => {
			if (a) a.currentTime = v.currentTime;
			sync();
		};
		v.addEventListener("timeupdate", sync);
		v.addEventListener("play", onPlay);
		v.addEventListener("pause", onPause);
		v.addEventListener("seeked", onSeek);
		v.addEventListener("ended", onPause);
		return () => {
			v.removeEventListener("timeupdate", sync);
			v.removeEventListener("play", onPlay);
			v.removeEventListener("pause", onPause);
			v.removeEventListener("seeked", onSeek);
			v.removeEventListener("ended", onPause);
		};
	}, [
		narrationUrl,
		onTime,
		src
	]);
	const windows = cueWindows(cues, durationMs);
	const activeCap = cueWindows(captions?.length ? captions : cues, durationMs).find((c) => t >= c.startMs && t < c.endMs);
	const dur = durationMs || 1;
	const scrub = (clientX) => {
		const bar = barRef.current;
		const v = videoRef.current;
		if (!bar || !v) return;
		const r = bar.getBoundingClientRect();
		const ms = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * durationMs;
		v.currentTime = ms / 1e3;
		if (audioRef.current) audioRef.current.currentTime = ms / 1e3;
		setT(ms);
		onTime?.(ms);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-h-0 flex-col gap-3", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video overflow-hidden rounded-lg bg-inset shadow-[var(--shadow-border)]",
				children: [
					src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						src,
						className: "size-full object-contain outline outline-1 -outline-offset-1 outline-foreground/10",
						playsInline: true,
						preload: "auto",
						onLoadedData: (e) => {
							const v = e.currentTarget;
							if (v.currentTime === 0) v.currentTime = .05;
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-full items-center justify-center",
						children: empty
					}),
					overlay,
					src && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute inset-0 z-[1] flex items-center justify-center bg-transparent",
						onClick: () => {
							const v = videoRef.current;
							if (!v) return;
							if (v.paused) v.play();
							else v.pause();
						},
						"aria-label": playing ? "일시정지" : "재생",
						children: !playing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-14 items-center justify-center rounded-full bg-background/70 text-foreground shadow-[var(--shadow-border)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5 size-6" })
						})
					}),
					src && showCaptions && activeCap?.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-x-4 bottom-3 z-[2] flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "max-w-[90%] rounded-md bg-background/75 px-3 py-1.5 text-center text-sm font-medium leading-snug text-foreground shadow-[var(--shadow-border)]",
							children: activeCap.text
						})
					})
				]
			}),
			src && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon-sm",
						variant: "secondary",
						onClick: () => {
							const v = videoRef.current;
							if (!v) return;
							if (v.paused) v.play();
							else v.pause();
						},
						"aria-label": playing ? "일시정지" : "재생",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-0.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: barRef,
						className: "relative h-8 flex-1 cursor-pointer",
						onPointerDown: (e) => {
							e.target.setPointerCapture(e.pointerId);
							scrub(e.clientX);
						},
						onPointerMove: (e) => {
							if (e.buttons) scrub(e.clientX);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${Math.min(100, t / dur * 100)}%` }
							})
						}), windows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel",
							style: { left: `${c.startMs / dur * 100}%` }
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-20 text-right font-mono text-xs tabular-nums text-muted-foreground",
						children: [
							formatTimecode(t),
							" / ",
							formatTimecode(durationMs)
						]
					})
				]
			}),
			narrationUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioRef,
				src: narrationUrl,
				preload: "auto"
			})
		]
	});
});
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-40", className),
	...props
}));
Label.displayName = Root.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-secondary shadow-[var(--shadow-border)] transition-[background-color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-primary", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-foreground shadow-sm transition-transform duration-150 ease-out data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-primary-foreground" })
}));
Switch.displayName = Switch$1.displayName;
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
	ref,
	className: cn("relative h-1 w-full overflow-hidden rounded-full bg-secondary", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-transform duration-150 ease-out",
		style: { transform: `translateX(-${100 - (value ?? 0)}%)` }
	})
}));
Progress.displayName = Root$1.displayName;
function stopStream(stream) {
	stream?.getTracks().forEach((t) => t.stop());
}
async function startScreenRecord(opts) {
	const display = await navigator.mediaDevices.getDisplayMedia({
		video: { frameRate: 30 },
		audio: true
	});
	const wantCam = opts.pip !== "off";
	let cam = null;
	if (opts.withMic || wantCam) try {
		cam = await navigator.mediaDevices.getUserMedia({
			audio: opts.withMic,
			video: wantCam
		});
	} catch {
		if (opts.withMic) try {
			cam = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			});
		} catch {
			stopStream(display);
			throw new Error("마이크 또는 카메라 권한이 필요합니다");
		}
	}
	const screenVideo = attachVideo(display);
	const camHasVideo = Boolean(cam?.getVideoTracks().length);
	const camVideo = cam && wantCam && camHasVideo ? attachVideo(cam) : null;
	await waitMeta(screenVideo);
	if (camVideo) await waitMeta(camVideo);
	const srcW = screenVideo.videoWidth || 1280;
	const srcH = screenVideo.videoHeight || 720;
	const scale = Math.min(1, 1600 / srcW);
	const w = Math.round(srcW * scale) || 1280;
	const h = Math.round(srcH * scale) || 720;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		stopStream(display);
		stopStream(cam);
		throw new Error("캔버스를 만들 수 없습니다");
	}
	const shape = opts.pipShape ?? "circle";
	const size = opts.pipSize ?? "md";
	const corner = opts.pip;
	let running = true;
	const draw = () => {
		if (!running) return;
		ctx.fillStyle = CANVAS.bg;
		ctx.fillRect(0, 0, w, h);
		ctx.drawImage(screenVideo, 0, 0, w, h);
		if (camVideo && corner !== "off") drawHostPip(ctx, w, h, camVideo, corner, shape, size);
		requestAnimationFrame(draw);
	};
	draw();
	const mixed = mixAudio(canvas.captureStream(30), display, cam);
	const mime = pickRecorderMime("video");
	const recorder = new MediaRecorder(mixed, mime ? { mimeType: mime } : void 0);
	const chunks = [];
	recorder.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	recorder.start(200);
	display.getVideoTracks()[0]?.addEventListener("ended", () => {
		opts.onShareEnded?.();
	});
	return {
		preview: canvas,
		stop: () => new Promise((resolve, reject) => {
			running = false;
			recorder.onerror = () => reject(/* @__PURE__ */ new Error("녹화를 저장하지 못했습니다"));
			recorder.onstop = () => {
				stopStream(display);
				stopStream(cam);
				mixed.getTracks().forEach((t) => t.stop());
				screenVideo.srcObject = null;
				if (camVideo) camVideo.srcObject = null;
				resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
			};
			if (recorder.state === "recording") recorder.stop();
			else resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
		})
	};
}
async function startCameraRecord(withMic) {
	const stream = await navigator.mediaDevices.getUserMedia({
		video: {
			facingMode: "user",
			width: { ideal: 1280 },
			height: { ideal: 720 }
		},
		audio: withMic
	});
	const video = attachVideo(stream);
	await waitMeta(video);
	const mime = pickRecorderMime("video");
	const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : void 0);
	const chunks = [];
	recorder.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	recorder.start(200);
	return {
		preview: video,
		stop: () => new Promise((resolve, reject) => {
			recorder.onerror = () => reject(/* @__PURE__ */ new Error("녹화를 저장하지 못했습니다"));
			recorder.onstop = () => {
				stopStream(stream);
				video.srcObject = null;
				resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
			};
			if (recorder.state === "recording") recorder.stop();
			else resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
		})
	};
}
function pipPlacement(frameW, frameH, corner, size) {
	const s = Math.round(Math.min(frameW, frameH) * (size === "sm" ? .2 : .28));
	const pad = Math.round(Math.min(frameW, frameH) * .032);
	return {
		x: corner === "bl" || corner === "tl" ? pad : frameW - s - pad,
		y: corner === "tr" || corner === "tl" ? pad : frameH - s - pad,
		s
	};
}
function drawHostPip(ctx, frameW, frameH, cam, corner, shape, size) {
	const { x, y, s } = pipPlacement(frameW, frameH, corner, size);
	clipPip(ctx, x, y, s, shape, () => {
		coverMirror(ctx, cam, x, y, s);
	});
	strokePip(ctx, x, y, s, shape);
}
function drawHostSilhouette(ctx, frameW, frameH, corner, shape, size) {
	const { x, y, s } = pipPlacement(frameW, frameH, corner, size);
	clipPip(ctx, x, y, s, shape, () => {
		ctx.fillStyle = CANVAS.card;
		ctx.fillRect(x, y, s, s);
		const cx = x + s / 2;
		const cy = y + s * .42;
		ctx.fillStyle = CANVAS.steel;
		ctx.beginPath();
		ctx.arc(cx, cy, s * .18, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.ellipse(cx, y + s * .92, s * .32, s * .28, 0, Math.PI, 0, true);
		ctx.fill();
	});
	strokePip(ctx, x, y, s, shape);
}
function clipPip(ctx, x, y, s, shape, paint) {
	ctx.save();
	ctx.shadowColor = "rgba(0,0,0,0.5)";
	ctx.shadowBlur = 22;
	ctx.shadowOffsetY = 8;
	ctx.fillStyle = CANVAS.bg;
	pipPath(ctx, x, y, s, shape);
	ctx.fill();
	ctx.restore();
	ctx.save();
	pipPath(ctx, x, y, s, shape);
	ctx.clip();
	paint();
	ctx.restore();
}
function strokePip(ctx, x, y, s, shape) {
	ctx.save();
	ctx.strokeStyle = "rgba(244,241,234,0.55)";
	ctx.lineWidth = Math.max(2, Math.round(s * .03));
	pipPath(ctx, x, y, s, shape);
	ctx.stroke();
	ctx.restore();
}
function pipPath(ctx, x, y, s, shape) {
	ctx.beginPath();
	if (shape === "circle") ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
	else {
		const r = Math.round(s * .14);
		ctx.moveTo(x + r, y);
		ctx.arcTo(x + s, y, x + s, y + s, r);
		ctx.arcTo(x + s, y + s, x, y + s, r);
		ctx.arcTo(x, y + s, x, y, r);
		ctx.arcTo(x, y, x + s, y, r);
		ctx.closePath();
	}
}
function coverMirror(ctx, video, x, y, s) {
	const cw = video.videoWidth || 16;
	const ch = video.videoHeight || 9;
	const scale = Math.max(s / cw, s / ch);
	const dw = cw * scale;
	const dh = ch * scale;
	ctx.save();
	ctx.translate(x + s, y);
	ctx.scale(-1, 1);
	ctx.drawImage(video, (s - dw) / 2, (s - dh) / 2, dw, dh);
	ctx.restore();
}
function mixAudio(canvasStream, display, cam) {
	const audioCtx = new AudioContext();
	const dest = audioCtx.createMediaStreamDestination();
	let connected = 0;
	const connect = (stream) => {
		if (!stream.getAudioTracks().length) return;
		audioCtx.createMediaStreamSource(stream).connect(dest);
		connected += 1;
	};
	connect(display);
	if (cam) connect(cam);
	const tracks = [...canvasStream.getVideoTracks()];
	if (connected > 0) tracks.push(...dest.stream.getAudioTracks());
	return new MediaStream(tracks);
}
function attachVideo(stream) {
	const el = document.createElement("video");
	el.muted = true;
	el.playsInline = true;
	el.autoplay = true;
	el.srcObject = stream;
	el.play();
	return el;
}
function waitMeta(el) {
	if (el.readyState >= 1) return Promise.resolve();
	return new Promise((resolve) => {
		el.onloadedmetadata = () => resolve();
		setTimeout(() => resolve(), 1500);
	});
}
var DURATION_MS = 12e3;
var CHAPTERS = [
	{
		at: 0,
		n: "01",
		title: "문제",
		sub: "현장의 불편을 한 줄로"
	},
	{
		at: 3e3,
		n: "02",
		title: "솔루션",
		sub: "지금 만든 제품이 답이다"
	},
	{
		at: 6e3,
		n: "03",
		title: "라이브 데모",
		sub: "클릭 세 번이면 이해된다"
	},
	{
		at: 9e3,
		n: "04",
		title: "임팩트",
		sub: "다음 스텝을 분명히"
	}
];
async function createSampleVideo(onProgress) {
	const w = 1280;
	const h = 720;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("캔버스를 만들 수 없습니다");
	const stream = canvas.captureStream(30);
	const audioCtx = new AudioContext();
	const dest = audioCtx.createMediaStreamDestination();
	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();
	gain.gain.value = 0;
	osc.connect(gain);
	gain.connect(dest);
	osc.start();
	dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
	const mime = pickRecorderMime("video");
	const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : void 0);
	const chunks = [];
	recorder.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	const start = performance.now();
	return new Promise((resolve, reject) => {
		recorder.onerror = () => reject(/* @__PURE__ */ new Error("샘플 영상을 만들지 못했습니다"));
		recorder.onstop = () => {
			osc.stop();
			audioCtx.close();
			stream.getTracks().forEach((t) => t.stop());
			resolve({
				blob: new Blob(chunks, { type: recorder.mimeType || "video/webm" }),
				durationMs: DURATION_MS
			});
		};
		recorder.start(80);
		drawSlide(ctx, w, h, CHAPTERS[0], 0, 0);
		const frame = () => {
			const elapsed = performance.now() - start;
			onProgress(Math.min(1, elapsed / DURATION_MS));
			const ch = [...CHAPTERS].reverse().find((c) => elapsed >= c.at) ?? CHAPTERS[0];
			drawSlide(ctx, w, h, ch, elapsed / DURATION_MS, elapsed);
			if (elapsed >= DURATION_MS) {
				recorder.stop();
				return;
			}
			requestAnimationFrame(frame);
		};
		frame();
	});
}
function drawSlide(ctx, w, h, ch, p, elapsed) {
	ctx.fillStyle = CANVAS.bg;
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = CANVAS.rec;
	ctx.fillRect(0, 0, 6, h);
	ctx.fillStyle = CANVAS.muted;
	ctx.font = "500 18px 'Noto Sans KR', sans-serif";
	ctx.fillText("TAKE FIVE  ·  SAMPLE REEL", 64, 72);
	ctx.fillStyle = CANVAS.steel;
	ctx.font = "500 22px 'Noto Sans KR', sans-serif";
	ctx.fillText(ch.n, 64, h / 2 - 64);
	ctx.fillStyle = CANVAS.fg;
	ctx.font = "400 72px 'Instrument Serif', 'Noto Sans KR', serif";
	ctx.fillText(ch.title, 64, h / 2 + 12);
	ctx.fillStyle = CANVAS.muted;
	ctx.font = "400 24px 'Noto Sans KR', sans-serif";
	ctx.fillText(ch.sub, 64, h / 2 + 64);
	const barW = w - 128;
	ctx.fillStyle = "rgba(244,241,234,0.12)";
	ctx.fillRect(64, h - 64, barW, 3);
	ctx.fillStyle = CANVAS.fg;
	ctx.fillRect(64, h - 64, barW * p, 3);
	const sec = Math.min(DURATION_MS, elapsed) / 1e3;
	ctx.fillStyle = CANVAS.muted;
	ctx.font = "500 16px ui-monospace, monospace";
	ctx.fillText(`0:${Math.floor(sec).toString().padStart(2, "0")} / 0:12`, 64, h - 36);
	drawHostSilhouette(ctx, w, h, "br", "circle", "md");
}
var CORNERS = [
	{
		id: "tl",
		label: "왼위"
	},
	{
		id: "tr",
		label: "오른위"
	},
	{
		id: "bl",
		label: "왼아래"
	},
	{
		id: "br",
		label: "오른아래"
	}
];
var VIDEO_ACCEPT = "video/*,.mp4,.mov,.m4v,.webm,.mkv";
function RecordStage({ liveHost }) {
	const applyVideo = useStudio((s) => s.applyVideo);
	const hasVideo = useStudio((s) => s.hasVideo);
	const durationMs = useStudio((s) => s.durationMs);
	const limitMs = useStudio((s) => s.limitMs);
	const resetAll = useStudio((s) => s.resetAll);
	const [withMic, setWithMic] = (0, import_react.useState)(true);
	const [withFace, setWithFace] = (0, import_react.useState)(true);
	const [pip, setPip] = (0, import_react.useState)("br");
	const [pipShape, setPipShape] = (0, import_react.useState)("circle");
	const [pipSize, setPipSize] = (0, import_react.useState)("md");
	const [countdown, setCountdown] = (0, import_react.useState)(null);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const handleRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	const finishingRef = (0, import_react.useRef)(false);
	const elapsedRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
		};
	}, []);
	const mountPreview = (el) => {
		const host = liveHost.current;
		if (!host) return;
		host.innerHTML = "";
		el.className = "size-full object-contain";
		host.appendChild(el);
	};
	const begin = async (mode) => {
		try {
			if (mode === "sample") {
				setBusy("샘플 클립을 만드는 중");
				const { blob, durationMs: sampleMs } = await createSampleVideo(() => void 0);
				await applyVideo(blob, "TAKE FIVE 샘플", sampleMs);
				toast.success("샘플 클립을 넣었습니다. 대본부터 이어서 해 보세요.");
				setBusy(null);
				return;
			}
			for (let n = 3; n >= 1; n--) {
				setCountdown(n);
				await sleep(700);
			}
			setCountdown(null);
			const handle = mode === "camera" ? await startCameraRecord(withMic) : await startScreenRecord({
				withMic,
				pip: mode === "pip" || mode === "screen" && withFace ? pip : "off",
				pipShape,
				pipSize,
				onShareEnded: () => void finish()
			});
			handleRef.current = handle;
			mountPreview(handle.preview);
			setRecording(true);
			setElapsed(0);
			elapsedRef.current = 0;
			const t0 = performance.now();
			timerRef.current = window.setInterval(() => {
				const ms = performance.now() - t0;
				elapsedRef.current = ms;
				setElapsed(ms);
				if (ms >= 3e5) finish();
			}, 80);
		} catch (err) {
			setCountdown(null);
			setBusy(null);
			const msg = err instanceof Error ? err.message : "녹화를 시작하지 못했습니다";
			toast.error(msg.includes("Permission") || msg.includes("NotAllowed") ? "권한을 허용해 주세요. 미리보기 창에서는 화면 녹화가 막힐 수 있습니다. 영상을 올리거나 샘플로 먼저 체험해 보세요." : msg);
		}
	};
	const finish = async () => {
		if (finishingRef.current) return;
		finishingRef.current = true;
		if (timerRef.current) window.clearInterval(timerRef.current);
		const handle = handleRef.current;
		handleRef.current = null;
		setRecording(false);
		setBusy("영상을 저장하는 중");
		try {
			if (!handle) return;
			const blob = await handle.stop();
			if (blob.size < 1e3) throw new Error("녹화된 내용이 없습니다");
			await applyVideo(blob, "시연 녹화", Math.max(elapsedRef.current, 400));
			toast.success("녹화했습니다. 이제 대본을 입히세요.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "저장에 실패했습니다");
		} finally {
			finishingRef.current = false;
			setBusy(null);
			setElapsed(0);
			if (liveHost.current) liveHost.current.innerHTML = "";
		}
	};
	const onFile = async (file) => {
		if (!file) return;
		if (!isLikelyVideoFile(file)) {
			toast.error("영상 파일만 올릴 수 있습니다");
			return;
		}
		setBusy("영상을 불러오는 중");
		try {
			await applyVideo(file, file.name);
			toast.success("영상을 올렸습니다");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "영상을 읽지 못했습니다");
		} finally {
			setBusy(null);
		}
	};
	const warn = elapsed >= WARN_MS;
	const overLimit = durationMs > limitMs;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground",
						children: "01 · 찍기"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-tight",
						children: "화면을 먼저 찍습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "5분 이내면 됩니다. 준비되면 바로 종료하세요. 말은 나중에 입힙니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "이 미리보기 창에서는 화면·카메라 녹화가 막히는 경우가 많습니다. 이미 찍은 영상을 올리거나 샘플로 먼저 흐름을 타 보세요."
					})
				]
			}),
			recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg bg-secondary px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "rec-dot size-2.5 rounded-full bg-rec" }), "REC"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("font-mono text-lg tabular-nums", warn && "text-rec"),
							children: [
								formatTimecode(elapsed),
								" / ",
								formatTimecode(LIMIT_MS)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: elapsed / LIMIT_MS * 100 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "rec",
						className: "w-full",
						onClick: () => void finish(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3 fill-current" }), "녹화 종료"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "언제든 종료할 수 있습니다. 5분이 되면 자동으로 멈춥니다."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
							icon: Monitor,
							title: "화면",
							hint: withFace ? "화면 + 얼굴" : "탭 또는 창",
							onClick: () => void begin("screen"),
							disabled: Boolean(busy)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
							icon: Camera,
							title: "카메라만",
							hint: "얼굴 풀샷",
							onClick: () => void begin("camera"),
							disabled: Boolean(busy)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
							icon: Upload,
							title: "영상 올리기",
							hint: "이미 찍은 파일",
							disabled: Boolean(busy),
							fileAccept: VIDEO_ACCEPT,
							onFile: (file) => void onFile(file)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
							icon: Clapperboard,
							title: "샘플",
							hint: "얼굴 캠 미리보기",
							onClick: () => void begin("sample"),
							disabled: Boolean(busy)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 rounded-lg bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "face",
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUser, { className: "size-4 text-steel" }), "얼굴 같이 찍기"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								id: "face",
								checked: withFace,
								onCheckedChange: setWithFace
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "유튜브 라이브처럼 화면 한쪽에 촬영자 얼굴을 겹칩니다. 끌 수도 있습니다."
						}),
						withFace && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutPreview, {
								corner: pip,
								shape: pipShape,
								size: pipSize
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "위치"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-1 sm:grid-cols-4",
									children: CORNERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPip(c.id),
										className: cn("h-9 rounded-sm text-xs transition-[background-color] duration-150", pip === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
										children: c.label
									}, c.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: "모양",
									value: pipShape,
									options: [["circle", "둥글게"], ["rect", "네모"]],
									onChange: setPipShape
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: "크기",
									value: pipSize,
									options: [["sm", "작게"], ["md", "보통"]],
									onChange: setPipSize
								})]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "mic",
								children: "마이크 같이 녹음"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								id: "mic",
								checked: withMic,
								onCheckedChange: setWithMic
							})]
						})
					]
				}),
				hasVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"현재 클립 ",
							formatTimecode(durationMs),
							overLimit ? " · 5분 이후는 잘라서 내보냅니다" : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							resetAll();
							toast("처음부터 다시 시작합니다");
						},
						children: "클립 버리고 다시"
					})]
				})
			] }),
			countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-background/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-8xl text-foreground",
					children: countdown
				})
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [busy, "…"]
			})
		]
	});
}
function LayoutPreview({ corner, shape, size }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-video overflow-hidden rounded-md bg-inset shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-3 rounded-sm bg-secondary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-4 top-4 text-xs tracking-wide text-muted-foreground",
				children: "화면"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute bg-steel/70", shape === "circle" ? "rounded-full" : "rounded-md", size === "sm" ? "w-1/5" : "w-1/4", "aspect-square", corner === "br" && "bottom-2 right-2", corner === "bl" && "bottom-2 left-2", corner === "tr" && "top-2 right-2", corner === "tl" && "top-2 left-2") })
		]
	});
}
function ChipRow({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1",
			children: options.map(([id, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(id),
				className: cn("h-9 flex-1 rounded-sm text-xs transition-[background-color] duration-150", value === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
				children: name
			}, id))
		})]
	});
}
function ModeCard({ icon: Icon, title, hint, onClick, disabled, fileAccept, onFile }) {
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-9 items-center justify-center rounded-md bg-secondary text-steel",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: hint
		})
	] });
	const className = "flex min-h-24 flex-col items-start gap-2 rounded-lg bg-card p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color,scale] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] hover:bg-elevated active:scale-[0.98]";
	if (onFile && fileAccept) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn(className, "cursor-pointer", disabled && "pointer-events-none opacity-40"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept: fileAccept,
			className: "sr-only",
			disabled,
			onChange: (e) => {
				const file = e.target.files?.[0];
				e.target.value = "";
				onFile(file);
			}
		}), body]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		disabled,
		className: cn(className, disabled && "opacity-40"),
		children: body
	});
}
function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md bg-inset px-3 py-2.5 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-out placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-inset px-3 py-2 text-sm text-foreground shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-[var(--shadow-border-hover)] focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-card p-5 shadow-[var(--shadow-border)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 rounded-sm p-2 text-muted-foreground transition-[background-color,color] duration-150 hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "닫기"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-8", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("font-display text-xl font-medium leading-snug", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var MAX_CUES = 40;
var MAX_LINE = 400;
function parseScriptFile(filename, raw, durationMs) {
	const text = raw.replace(/^\uFEFF/, "").trim();
	if (!text) throw new Error("빈 파일입니다");
	const lower = filename.toLowerCase();
	let cues;
	if (lower.endsWith(".srt") || looksSrt(text)) cues = parseSrt(text);
	else if (lower.endsWith(".vtt") || text.startsWith("WEBVTT")) cues = parseVtt(text);
	else {
		const timed = parseTimedTxt(text);
		cues = timed.length ? timed : parseParagraphs(text);
	}
	cues = cues.map((c) => ({
		...c,
		text: c.text.replace(/\s+/g, " ").trim().slice(0, MAX_LINE)
	})).filter((c) => c.text.length > 0).slice(0, MAX_CUES);
	if (!cues.length) throw new Error("읽을 줄이 없습니다");
	return packCues(cues, durationMs);
}
function looksSrt(text) {
	return /\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(text);
}
function parseSrt(text) {
	return text.split(/\r?\n\s*\r?\n/).map((block) => {
		const lines = block.split(/\r?\n/).filter((l) => l.trim());
		const timeIdx = lines.findIndex((l) => l.includes("-->"));
		if (timeIdx < 0) return null;
		const startMs = parseClock(lines[timeIdx].split("-->")[0] ?? "");
		const body = lines.slice(timeIdx + 1).join(" ");
		if (!body.trim()) return null;
		return cue(startMs, body);
	}).filter((c) => Boolean(c));
}
function parseVtt(text) {
	return parseSrt(text.replace(/^WEBVTT[^\n]*\n+/, ""));
}
function parseTimedTxt(text) {
	const cues = [];
	for (const line of text.split(/\r?\n/)) {
		const m = line.match(/^\s*\[?((?:\d{1,2}:)?\d{1,2}:\d{2}(?:[,.]\d{1,3})?)\]?\s+(.+?)\s*$/);
		if (!m) continue;
		cues.push(cue(parseClock(m[1]), m[2]));
	}
	return cues;
}
function parseParagraphs(text) {
	const blocks = text.split(/\n\s*\n/).map((b) => b.replace(/^\s*\d+[.)]\s+/gm, "").replace(/^\s*[-*]\s+/gm, "").replace(/\s+/g, " ").trim()).filter(Boolean);
	return (blocks.length > 1 ? blocks : text.split(/\r?\n/).map((l) => l.replace(/^\s*(\d+[.)]|[-*])\s+/, "").trim()).filter(Boolean)).map((p) => cue(0, p));
}
function cue(startMs, text) {
	return {
		id: crypto.randomUUID(),
		startMs: Math.max(0, startMs),
		text: text.trim()
	};
}
function parseClock(raw) {
	const s = raw.trim().replace(",", ".");
	const parts = s.split(":");
	if (parts.length === 3) {
		const h = Number(parts[0]);
		const m = Number(parts[1]);
		const sec = Number(parts[2]);
		return Math.round(((h * 60 + m) * 60 + sec) * 1e3);
	}
	if (parts.length === 2) {
		const m = Number(parts[0]);
		const sec = Number(parts[1]);
		return Math.round((m * 60 + sec) * 1e3);
	}
	const sec = Number(s);
	return Number.isFinite(sec) ? Math.round(sec * 1e3) : 0;
}
var MAX_CHARS = 20;
var MIN_BREAK = 8;
var MAX_MS = 4200;
var PAUSE_MS = 380;
var MAX_LINES = 80;
var TOKEN_RE = /[A-Za-z0-9]+|[가-힣]+|[.,!?。！？、，;:…]+|\s+|./gu;
var PUNCT_ONLY = /^[.,!?。！？、，;:…]+$/;
var SOFT_END = /[,.!?。！？、，;:…]$/;
function wordsToCaptions(words) {
	const cues = [];
	let buf = [];
	const flush = () => {
		if (!buf.length) return;
		const text = joinWords(buf.map((w) => w.text));
		if (!text) {
			buf = [];
			return;
		}
		cues.push({
			id: crypto.randomUUID(),
			startMs: Math.round(buf[0].start * 1e3),
			endMs: Math.round(buf[buf.length - 1].end * 1e3),
			text
		});
		buf = [];
	};
	for (const w of words) {
		if (!w.text.trim()) continue;
		if (buf.length) {
			const gap = (w.start - buf[buf.length - 1].end) * 1e3;
			const chars = visibleLen(joinWords([...buf, w].map((x) => x.text)));
			const span = (w.end - buf[0].start) * 1e3;
			if (gap >= PAUSE_MS || chars > MAX_CHARS || span > MAX_MS) flush();
		}
		buf.push(w);
	}
	flush();
	return expandCues(cues).slice(0, MAX_LINES);
}
function captionsFromCues(cues, durationMs) {
	const windows = cueWindows(cues.filter((c) => c.text.trim()), durationMs);
	const out = [];
	for (const w of windows) out.push(...timedSplit(w.text, w.startMs, w.endMs));
	return out.slice(0, MAX_LINES);
}
function textToCaptions(text, durationMs) {
	return timedSplit(text, 0, Math.max(1e3, durationMs)).slice(0, MAX_LINES);
}
function burnTrack(captions, cues) {
	const fromCaps = captions.filter((c) => c.text.trim());
	if (fromCaps.length) return fromCaps;
	return cues.filter((c) => c.text.trim());
}
function splitCaption(text) {
	const cleaned = text.replace(/\s+/g, " ").trim();
	if (!cleaned) return [];
	const chunks = cleaned.split(/(?<=[.!?。！？])\s+/).flatMap((part) => wrapLine(part.trim(), MAX_CHARS)).filter((s) => s && !PUNCT_ONLY.test(s));
	return chunks.length ? chunks : [cleaned];
}
function timedSplit(text, startMs, endMs) {
	const parts = splitCaption(text);
	if (!parts.length) return [];
	const weights = parts.map((p) => Math.max(1, visibleLen(p)));
	const total = weights.reduce((a, b) => a + b, 0);
	const span = Math.max(800, endMs - startMs);
	let t = startMs;
	return parts.map((line, i) => {
		const dur = span * weights[i] / total;
		const cue = {
			id: crypto.randomUUID(),
			startMs: Math.round(t),
			endMs: Math.round(t + dur),
			text: line
		};
		t += dur;
		return cue;
	});
}
function expandCues(cues) {
	const out = [];
	for (const cue of cues) {
		const parts = splitCaption(cue.text);
		if (parts.length <= 1) {
			out.push({
				...cue,
				text: parts[0] ?? cue.text
			});
			continue;
		}
		out.push(...timedSplit(cue.text, cue.startMs, cue.endMs ?? cue.startMs + 1e3));
	}
	return out;
}
function wrapLine(text, max) {
	if (!text) return [];
	if (visibleLen(text) <= max) return [text];
	const tokens = text.match(TOKEN_RE) ?? [text];
	const lines = [];
	let line = "";
	const flush = () => {
		const t = line.replace(/\s+/g, " ").trim();
		if (t) lines.push(t);
		line = "";
	};
	for (const tok of tokens) {
		const candidate = line + tok;
		const n = visibleLen(candidate.trim());
		if (!line.trim() || n <= max || PUNCT_ONLY.test(tok)) {
			line = candidate;
			const trimmed = line.replace(/\s+/g, " ").trim();
			if (visibleLen(trimmed) >= MIN_BREAK && SOFT_END.test(trimmed)) flush();
			continue;
		}
		flush();
		line = tok.replace(/^\s+/, "");
	}
	flush();
	return coalesce(lines, max);
}
function coalesce(lines, max) {
	const out = [];
	for (const raw of lines) {
		const line = raw.replace(/\s+/g, " ").trim();
		if (!line) continue;
		if (PUNCT_ONLY.test(line)) {
			if (out.length) out[out.length - 1] += line;
			continue;
		}
		const n = visibleLen(line);
		if (out.length && n <= 2) {
			const prev = out[out.length - 1];
			if (visibleLen(prev) + n <= max + 2) {
				out[out.length - 1] = `${prev}${line}`;
				continue;
			}
		}
		out.push(line);
	}
	return out;
}
function visibleLen(s) {
	return [...s].filter((c) => c !== " ").length;
}
function joinWords(words) {
	let out = "";
	for (const raw of words) {
		const w = raw.trim();
		if (!w) continue;
		if (!out) {
			out = w;
			continue;
		}
		out = PUNCT_ONLY.test(w) ? `${out}${w}` : `${out} ${w}`;
	}
	return out.replace(/\s+/g, " ").trim();
}
async function generateAutoCaptions(opts) {
	const media = opts.preferNarration ? getNarrationBlob() ?? getVideoBlob() : getVideoBlob() ?? getNarrationBlob();
	if (media) try {
		const extracted = await extractAudioForStt(media);
		const b64 = await blobToBase64(extracted.blob);
		if (b64.length > 17e6) return {
			ok: false,
			error: "소리가 너무 깁니다. 5분 안으로 잘라 주세요."
		};
		const res = await transcribeAudio({ data: {
			base64: b64,
			mime: extracted.mime
		} });
		if (res.ok) {
			const fromWords = wordsToCaptions(res.words);
			const captions = fromWords.length ? fromWords : textToCaptions(res.text, opts.durationMs);
			if (captions.length) return {
				ok: true,
				captions,
				source: "audio"
			};
		}
	} catch (err) {
		if ((err instanceof Error ? err.message : "") !== "silent") {}
	}
	const fromScript = captionsFromCues(opts.cues, opts.durationMs);
	if (fromScript.length) return {
		ok: true,
		captions: fromScript,
		source: "script"
	};
	return {
		ok: false,
		error: "자막을 만들 소리도, 나눌 대본도 없습니다."
	};
}
async function runAutoCaptions(preferNarration) {
	const { cues, durationMs, setCaptions, setMixer } = useStudio.getState();
	const toastId = toast.loading("자막을 만드는 중…");
	const result = await generateAutoCaptions({
		cues,
		durationMs,
		preferNarration
	});
	if (!result.ok) {
		toast.error(result.error, { id: toastId });
		return false;
	}
	setCaptions(result.captions, result.source);
	setMixer({ burnSubtitles: true });
	toast.success(result.source === "audio" ? `소리에서 자막 ${result.captions.length}줄을 만들었습니다` : `대본을 자막 ${result.captions.length}줄로 나눴습니다`, { id: toastId });
	return true;
}
function CaptionApplyToggle({ hint = false }) {
	const on = Boolean(useStudio((s) => s.mixer.burnSubtitles));
	const setMixer = useStudio((s) => s.setMixer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "자막"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1",
				children: [[true, "적용"], [false, "미적용"]].map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMixer({ burnSubtitles: value }),
					className: cn("h-9 flex-1 rounded-sm text-xs font-medium transition-[background-color] duration-150", on === value ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
					children: label
				}, label))
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "미리보기와 저장 영상에 같이 들어갑니다. 꺼도 자막 파일은 따로 받을 수 있습니다."
			})
		]
	});
}
function AutoCaptionButton({ preferNarration, className }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		size: "sm",
		variant: "outline",
		className,
		disabled: busy,
		onClick: () => {
			setBusy(true);
			runAutoCaptions(preferNarration).finally(() => setBusy(false));
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Captions, {}), busy ? "자막 만드는 중…" : "자막 자동 생성"]
	});
}
function CaptionList({ nowMs, showApply = true }) {
	const captions = useStudio((s) => s.captions);
	const captionSource = useStudio((s) => s.captionSource);
	const durationMs = useStudio((s) => s.durationMs);
	const burnSubtitles = Boolean(useStudio((s) => s.mixer.burnSubtitles));
	const setMixer = useStudio((s) => s.setMixer);
	const updateCaption = useStudio((s) => s.updateCaption);
	const removeCaption = useStudio((s) => s.removeCaption);
	const setCaptions = useStudio((s) => s.setCaptions);
	if (!captions.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"자막 ",
					captions.length,
					"줄",
					captionSource === "audio" ? " · 소리에서" : captionSource === "script" ? " · 대본에서" : "",
					burnSubtitles ? " · 적용" : " · 미적용"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [showApply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-muted-foreground transition-[color] duration-150 hover:text-foreground",
					onClick: () => setMixer({ burnSubtitles: !burnSubtitles }),
					children: burnSubtitles ? "끄기" : "적용"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs text-muted-foreground transition-[color] duration-150 hover:text-foreground",
					onClick: () => setCaptions([], null),
					children: "지우기"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex max-h-56 flex-col gap-2 overflow-auto pr-1",
			children: captions.map((cap, i) => {
				const end = cap.endMs ?? captions[i + 1]?.startMs ?? durationMs;
				const active = nowMs >= cap.startMs && nowMs < end;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("rounded-md bg-card p-2.5 shadow-[var(--shadow-border)]", active && "shadow-[var(--shadow-border-hover)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs tabular-nums text-steel",
							children: [
								formatTimecode(cap.startMs),
								"–",
								formatTimecode(end)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto rounded-sm p-1 text-muted-foreground transition-[background-color,color] duration-150 hover:bg-secondary hover:text-foreground",
							onClick: () => removeCaption(cap.id),
							"aria-label": "자막 삭제",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: cap.text,
						rows: 2,
						onChange: (e) => updateCaption(cap.id, { text: e.target.value })
					})]
				}, cap.id);
			})
		})]
	});
}
var SCRIPT_ACCEPT = ".txt,.srt,.vtt,.md,text/plain";
function ScriptStage({ nowMs, player, aiOn }) {
	const cues = useStudio((s) => s.cues);
	const durationMs = useStudio((s) => s.durationMs);
	const brief = useStudio((s) => s.brief);
	const setBrief = useStudio((s) => s.setBrief);
	const setCues = useStudio((s) => s.setCues);
	const packSpeech = useStudio((s) => s.packSpeech);
	const addCue = useStudio((s) => s.addCue);
	const updateCue = useStudio((s) => s.updateCue);
	const removeCue = useStudio((s) => s.removeCue);
	const setStep = useStudio((s) => s.setStep);
	const title = useStudio((s) => s.title);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const spoken = (0, import_react.useMemo)(() => cues.reduce((n, c) => n + estimateSpeechMs(c.text), 0), [cues]);
	const over = spoken > durationMs + 800;
	const clashes = (0, import_react.useMemo)(() => overlappingCueIds(cues), [cues]);
	const fillTemplate = () => {
		setCues(packCues(hackathonBeats(durationMs), durationMs));
		toast("5분 피치 뼈대를 넣었습니다. 문장만 바꾸면 됩니다.");
	};
	const onUpload = async (file) => {
		if (!file) return;
		if (!/\.(txt|srt|vtt|md)$/i.test(file.name) && file.type && !file.type.startsWith("text/")) {
			toast.error("txt, srt, vtt 파일만 올릴 수 있습니다");
			return;
		}
		try {
			const raw = await file.text();
			const next = parseScriptFile(file.name, raw, durationMs);
			setCues(next);
			toast.success(`대본 ${next.length}줄을 올렸습니다`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "대본을 읽지 못했습니다");
		}
	};
	const generate = async () => {
		setBusy(true);
		try {
			const res = await generateScript({ data: {
				...brief,
				name: brief.name || title,
				durationSec: Math.max(3, durationMs / 1e3)
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setCues(packCues(res.cues.map((c) => ({
				id: crypto.randomUUID(),
				startMs: Math.round(c.startSec * 1e3),
				text: c.text
			})), durationMs));
			setOpen(false);
			toast.success("대본을 썼습니다. 타임코드를 만져 화면과 맞추세요.");
		} catch {
			toast.error("대본 생성에 실패했습니다");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground",
						children: "02 · 대본"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-tight",
						children: "화면에 맞춰 말을 적습니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "줄을 누르면 그 시각으로 이동합니다. txt·srt·vtt 대본을 올릴 수 있습니다."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => addCue(nowMs),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}),
							formatTimecode(nowMs),
							"에 큐"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: fillTemplate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, {}), "5분 뼈대"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: SCRIPT_ACCEPT,
									className: "sr-only",
									onChange: (e) => {
										const file = e.target.files?.[0];
										e.target.value = "";
										onUpload(file);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}),
								"대본 올리기"
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: !aiOn,
						onClick: () => setOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}), "AI로 쓰기"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoCaptionButton, { preferNarration: false })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionList, { nowMs }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("font-mono text-xs tabular-nums", over ? "text-rec" : "text-muted-foreground"),
				children: [
					"예상 발화 ",
					formatTimecode(spoken),
					" / 영상 ",
					formatTimecode(durationMs),
					over ? " · 조금 줄여 주세요" : "",
					clashes.size ? " · 말이 겹칩니다" : ""
				]
			}),
			clashes.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "secondary",
				onClick: () => {
					packSpeech();
					toast("겹치지 않게 간격을 맞췄습니다");
				},
				children: "겹침 풀기"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "flex min-h-0 flex-1 flex-col gap-2 overflow-auto pr-1",
				children: [cues.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]",
					children: "아직 줄이 없습니다. 뼈대를 넣거나, 영상을 보다가 큐를 꽂으세요."
				}), cues.map((cue, i) => {
					const active = nowMs >= cue.startMs && nowMs < (cues[i + 1]?.startMs ?? durationMs);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("rounded-lg bg-card p-3 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150", active && "shadow-[var(--shadow-border-hover)]", clashes.has(cue.id) && "outline outline-1 outline-rec/50"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "font-mono text-xs tabular-nums text-steel",
										onClick: () => player.current?.seek(cue.startMs),
										children: formatTimecode(cue.startMs)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: formatTimecode(estimateSpeechMs(cue.text))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ml-auto rounded-sm p-1.5 text-muted-foreground transition-[background-color,color] duration-150 hover:bg-secondary hover:text-foreground",
										onClick: () => removeCue(cue.id),
										"aria-label": "줄 삭제",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
									})
								]
							}),
							clashes.has(cue.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs text-rec",
								children: "다음 줄과 말이 겹칩니다"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: cue.text,
								rows: 3,
								placeholder: "이 장면에서 할 말",
								onChange: (e) => updateCue(cue.id, { text: e.target.value }),
								onFocus: () => player.current?.seek(cue.startMs)
							})
						]
					}, cue.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: !cues.some((c) => c.text.trim()),
				onClick: () => setStep("voice"),
				children: "목소리로"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "작품만 알려 주세요" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "영상 길이에 맞춰 한국어 나레이션 큐를 씁니다." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "작품 이름",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: brief.name,
									onChange: (e) => setBrief({ name: e.target.value }),
									placeholder: title
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "문제",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: brief.problem,
									onChange: (e) => setBrief({ problem: e.target.value }),
									placeholder: "누가, 무엇이 불편한지"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "솔루션",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: brief.solution,
									onChange: (e) => setBrief({ solution: e.target.value }),
									placeholder: "우리가 만든 것"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "데모에서 보여줄 것",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									value: brief.demo,
									onChange: (e) => setBrief({ demo: e.target.value }),
									placeholder: "클릭 동선, 핵심 화면"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "말투",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: [
										["plain", "담백"],
										["serious", "진지"],
										["light", "경쾌"]
									].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setBrief({ tone: id }),
										className: cn("h-9 flex-1 rounded-sm text-xs font-medium transition-[background-color] duration-150", brief.tone === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
										children: label
									}, id))
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "닫기"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy,
						onClick: () => void generate(),
						children: busy ? "쓰는 중…" : "대본 받기"
					})] })
				] })
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
var Slider = import_react.forwardRef(({ className, value, defaultValue, ...props }, ref) => {
	const count = (value ?? defaultValue ?? [0]).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		ref,
		value,
		defaultValue,
		className: cn("relative flex w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-primary shadow-[var(--shadow-border)] transition-[box-shadow,scale] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40" }, i))]
	});
});
Slider.displayName = Slider$1.displayName;
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-11 items-center justify-center rounded-lg bg-secondary p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex h-9 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium transition-[background-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 data-[state=active]:bg-card data-[state=active]:text-foreground", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-4 focus-visible:outline-none", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-11 w-full items-center justify-between gap-2 rounded-md bg-inset px-3 text-sm shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 opacity-60" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-72 min-w-32 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
		className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
		children
	})
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-2.5 pl-8 pr-3 text-sm outline-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex size-4 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
function VoiceStage({ player, nowMs, aiOn }) {
	const cues = useStudio((s) => s.cues);
	const voiceId = useStudio((s) => s.voiceId);
	const voiceSpeed = useStudio((s) => s.voiceSpeed);
	const setVoice = useStudio((s) => s.setVoice);
	const applyNarration = useStudio((s) => s.applyNarration);
	const retimeCues = useStudio((s) => s.retimeCues);
	const hasNarration = useStudio((s) => s.hasNarration);
	const narrationKind = useStudio((s) => s.narrationKind);
	const durationMs = useStudio((s) => s.durationMs);
	const setStep = useStudio((s) => s.setStep);
	const [tab, setTab] = (0, import_react.useState)(narrationKind === "mic" ? "mic" : "ai");
	const [gender, setGender] = (0, import_react.useState)(() => voiceGender(voiceId));
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [elapsed, setElapsed] = (0, import_react.useState)(0);
	const recRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	const timerRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const previewRef = (0, import_react.useRef)(null);
	const stopPreview = () => {
		const prev = previewRef.current;
		if (!prev) return;
		prev.audio.pause();
		prev.audio.removeAttribute("src");
		prev.audio.load();
		URL.revokeObjectURL(prev.url);
		previewRef.current = null;
	};
	(0, import_react.useEffect)(() => {
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
			if (timerRef.current) window.clearInterval(timerRef.current);
			const prev = previewRef.current;
			if (prev) {
				prev.audio.pause();
				URL.revokeObjectURL(prev.url);
				previewRef.current = null;
			}
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!VOICES.some((v) => v.id === voiceId)) {
			setVoice(DEFAULT_VOICE_ID);
			setGender("male");
		}
	}, [voiceId, setVoice]);
	const lines = cues.filter((c) => c.text.trim());
	const roster = voicesByGender(gender);
	const pickGender = (next) => {
		setGender(next);
		if (!voicesByGender(next).some((v) => v.id === voiceId)) setVoice(next === "female" ? "eve" : DEFAULT_VOICE_ID);
	};
	const generateAi = async () => {
		if (!aiOn) {
			toast.error("AI 목소리를 사용할 수 없습니다");
			return;
		}
		if (!lines.length) {
			toast.error("대본이 비어 있습니다");
			return;
		}
		stopPreview();
		setBusy("나레이션을 만드는 중");
		setProgress(0);
		try {
			const packed = packCues(lines, durationMs);
			retimeCues(packed);
			const parts = [];
			for (let i = 0; i < packed.length; i++) {
				const cue = packed[i];
				const res = await synthesizeSpeech({ data: {
					text: cue.text,
					voiceId,
					speed: voiceSpeed
				} });
				if (!res.ok) throw new Error(res.error);
				parts.push({
					startMs: cue.startMs,
					blob: base64ToBlob(res.base64, res.mime)
				});
				setProgress((i + 1) / packed.length * 100);
			}
			const { blob: stitched, startsMs } = await stitchCueAudio(parts, durationMs);
			const dur = await audioDurationMs(stitched);
			retimeCues(packed.map((c, i) => ({
				...c,
				startMs: startsMs[i] ?? c.startMs
			})));
			await applyNarration(stitched, "ai", dur);
			toast.success("AI 나레이션을 입혔습니다");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "음성 생성에 실패했습니다");
		} finally {
			setBusy(null);
			setProgress(0);
		}
	};
	const previewVoice = async () => {
		if (!aiOn) return;
		stopPreview();
		setBusy("샘플을 듣는 중");
		try {
			const res = await synthesizeSpeech({ data: {
				text: "해커톤 시연, 오 분이면 충분합니다.",
				voiceId,
				speed: voiceSpeed
			} });
			if (!res.ok) throw new Error(res.error);
			const blob = base64ToBlob(res.base64, res.mime);
			const url = URL.createObjectURL(blob);
			const audio = new Audio(url);
			previewRef.current = {
				audio,
				url
			};
			audio.onended = () => {
				if (previewRef.current?.audio === audio) stopPreview();
			};
			await audio.play();
		} catch (err) {
			stopPreview();
			toast.error(err instanceof Error ? err.message : "미리듣기에 실패했습니다");
		} finally {
			setBusy(null);
		}
	};
	const startMic = async () => {
		try {
			stopPreview();
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			const mime = pickRecorderMime("audio");
			const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : void 0);
			chunksRef.current = [];
			rec.ondataavailable = (e) => {
				if (e.data.size) chunksRef.current.push(e.data);
			};
			recRef.current = rec;
			rec.start(100);
			setRecording(true);
			setElapsed(0);
			player.current?.seek(0);
			player.current?.play();
			const t0 = performance.now();
			timerRef.current = window.setInterval(() => {
				setElapsed(performance.now() - t0);
			}, 80);
		} catch {
			toast.error("마이크 권한이 필요합니다. 미리보기에서는 막힐 수 있습니다.");
		}
	};
	const stopMic = async () => {
		if (timerRef.current) window.clearInterval(timerRef.current);
		const rec = recRef.current;
		recRef.current = null;
		setRecording(false);
		player.current?.pause();
		setBusy("녹음을 저장하는 중");
		try {
			const blob = await new Promise((resolve, reject) => {
				if (!rec) {
					reject(/* @__PURE__ */ new Error("녹음이 없습니다"));
					return;
				}
				rec.onstop = () => resolve(new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" }));
				rec.onerror = () => reject(/* @__PURE__ */ new Error("녹음에 실패했습니다"));
				if (rec.state === "recording") rec.stop();
				else resolve(new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" }));
			});
			streamRef.current?.getTracks().forEach((t) => t.stop());
			streamRef.current = null;
			if (blob.size < 200) throw new Error("녹음이 너무 짧습니다");
			const dur = await audioDurationMs(blob);
			await applyNarration(blob, "mic", dur);
			toast.success("내 목소리를 입혔습니다");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "저장에 실패했습니다");
		} finally {
			setBusy(null);
		}
	};
	const activeText = lines.find((c, i) => {
		const end = lines[i + 1]?.startMs ?? durationMs;
		return nowMs >= c.startMs && nowMs < end;
	})?.text ?? lines[0]?.text ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground",
						children: "03 · 목소리"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-tight",
						children: "나레이션을 입힙니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "AI 목소리로 생성하거나, 영상을 보며 직접 읽습니다."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: tab,
				onValueChange: (v) => setTab(v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "ai",
							children: "AI 목소리"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "mic",
							children: "내가 읽기"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "ai",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "성별" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: [["female", "여자"], ["male", "남자"]].map(([id, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => pickGender(id),
										className: cn("h-9 flex-1 rounded-sm text-xs font-medium transition-[background-color] duration-150", gender === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
										children: name
									}, id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "목소리" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: voiceId,
									onValueChange: (v) => setVoice(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: roster.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: v.id,
										children: [
											v.name,
											" · ",
											v.hint
										]
									}, v.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "속도" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono tabular-nums",
										children: [voiceSpeed.toFixed(2), "×"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: .7,
									max: 1.5,
									step: .05,
									value: [voiceSpeed],
									onValueChange: ([v]) => setVoice(voiceId, v ?? 1)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "flex-1",
									disabled: !aiOn || Boolean(busy),
									onClick: () => void previewVoice(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {}), "들어보기"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "flex-1",
									disabled: !aiOn || Boolean(busy) || !lines.length,
									onClick: () => void generateAi(),
									children: busy ? "생성 중…" : "전체에 입히기"
								})]
							}),
							!aiOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "이 환경에서는 AI 목소리를 쓸 수 없습니다. 직접 읽기로 진행하세요."
							}),
							busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "mic",
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-card p-4 shadow-[var(--shadow-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "지금 읽을 줄"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-xl leading-snug",
									children: activeText || "대본이 없습니다. 이전 단계에서 줄을 적어 주세요."
								})]
							}),
							recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "rec",
								className: "w-full",
								onClick: () => void stopMic(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3 fill-current" }),
									"녹음 끝내기 · ",
									formatTimecode(elapsed)
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "flex-1",
									onClick: () => {
										player.current?.seek(0);
										player.current?.play();
									},
									children: "리허설"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "flex-1",
									variant: "rec",
									onClick: () => void startMic(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), "영상과 함께 녹음"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "텔레프롬프터가 현재 줄을 보여 줍니다. 리허설은 녹화하지 않습니다."
							})
						]
					})
				]
			}),
			hasNarration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoCaptionButton, { preferNarration: true }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionList, { nowMs }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setStep("export"),
						children: "입혀둔 목소리로 내보내기"
					})
				]
			})
		]
	});
}
function looksLikeMp4(blob) {
	return /mp4|m4v|quicktime/i.test(blob.type);
}
async function transcodeToMp4(blob, onProgress) {
	const { ALL_FORMATS, BlobSource, BufferTarget, Conversion, Input, Mp4OutputFormat, Output, Quality, canEncodeAudio, canEncodeVideo } = await import("../_libs/mediabunny.mjs").then((n) => n.t);
	if (!await canEncodeVideo("avc")) throw new Error("이 브라우저에서는 MP4를 만들 수 없습니다");
	if (!await canEncodeAudio("aac")) throw new Error("이 브라우저에서는 MP4 소리를 만들 수 없습니다");
	const input = new Input({
		source: new BlobSource(blob),
		formats: ALL_FORMATS
	});
	const target = new BufferTarget();
	const output = new Output({
		format: new Mp4OutputFormat({ fastStart: "in-memory" }),
		target
	});
	const conversion = await Conversion.init({
		input,
		output,
		video: {
			codec: "avc",
			quality: new Quality("high")
		},
		audio: {
			codec: "aac",
			quality: new Quality("high")
		},
		showWarnings: false
	});
	if (!conversion.isValid) throw new Error("MP4로 바꿀 수 없습니다");
	conversion.onProgress = (p) => onProgress?.(p);
	await conversion.execute();
	const buf = target.buffer;
	if (!buf) throw new Error("MP4 결과가 비었습니다");
	return new Blob([buf], { type: "video/mp4" });
}
async function mixAndExport(opts) {
	const mixed = await mixRealtime({
		...opts,
		onProgress: (p) => opts.onProgress?.(p * .72)
	});
	if (looksLikeMp4(mixed)) {
		opts.onProgress?.(1);
		return {
			blob: mixed,
			ext: "mp4"
		};
	}
	try {
		return {
			blob: await transcodeToMp4(mixed, (p) => opts.onProgress?.(.72 + p * .28)),
			ext: "mp4"
		};
	} catch {
		opts.onProgress?.(1);
		return {
			blob: mixed,
			ext: "webm"
		};
	}
}
async function mixRealtime(opts) {
	const trimStart = Math.max(0, opts.trimStartMs) / 1e3;
	const trimEnd = Math.max(trimStart + .4, opts.trimEndMs / 1e3);
	const span = trimEnd - trimStart;
	const video = document.createElement("video");
	video.playsInline = true;
	video.preload = "auto";
	const vUrl = URL.createObjectURL(opts.videoBlob);
	video.src = vUrl;
	await waitLoaded(video);
	const narration = opts.narrationBlob ? await loadAudio(opts.narrationBlob) : null;
	await document.fonts.ready.catch(() => void 0);
	const useCanvas = opts.burnSubtitles && opts.cues.length > 0;
	const canvas = document.createElement("canvas");
	const srcW = video.videoWidth || 1280;
	const srcH = video.videoHeight || 720;
	const scale = Math.min(1, 1280 / srcW);
	canvas.width = Math.round(srcW * scale) || 1280;
	canvas.height = Math.round(srcH * scale) || 720;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("캔버스를 만들 수 없습니다");
	const audioCtx = new AudioContext();
	if (audioCtx.state === "suspended") await audioCtx.resume();
	const dest = audioCtx.createMediaStreamDestination();
	const vSource = audioCtx.createMediaElementSource(video);
	const vGain = audioCtx.createGain();
	vGain.gain.value = opts.muteOriginal ? 0 : opts.videoVolume;
	vSource.connect(vGain);
	vGain.connect(dest);
	let nEl = null;
	if (narration) {
		nEl = narration;
		const nSource = audioCtx.createMediaElementSource(nEl);
		const nGain = audioCtx.createGain();
		nGain.gain.value = opts.narrationVolume;
		nSource.connect(nGain);
		nGain.connect(dest);
	}
	video.muted = false;
	video.volume = 1;
	video.currentTime = trimStart;
	if (nEl) {
		nEl.currentTime = trimStart;
		nEl.volume = 1;
	}
	await waitSeek(video, trimStart);
	let videoStream;
	let drawing = false;
	if (useCanvas) {
		drawing = true;
		const windows = cueWindows(opts.cues, opts.durationMs);
		const loop = () => {
			if (!drawing) return;
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const tMs = video.currentTime * 1e3;
			const cue = windows.find((c) => tMs >= c.startMs && tMs < c.endMs);
			if (cue?.text) drawSubtitle(ctx, canvas.width, canvas.height, cue.text);
			requestAnimationFrame(loop);
		};
		loop();
		videoStream = canvas.captureStream(30);
	} else if (typeof video.captureStream === "function") videoStream = video.captureStream(30);
	else {
		drawing = true;
		const loop = () => {
			if (!drawing) return;
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			requestAnimationFrame(loop);
		};
		loop();
		videoStream = canvas.captureStream(30);
	}
	const mixed = new MediaStream([...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
	const mime = pickRecorderMime("video");
	const recorder = new MediaRecorder(mixed, mime ? { mimeType: mime } : void 0);
	const chunks = [];
	recorder.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	const blob = await new Promise((resolve, reject) => {
		recorder.onerror = () => reject(/* @__PURE__ */ new Error("내보내기에 실패했습니다"));
		recorder.onstop = () => {
			drawing = false;
			resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
		};
		const onTime = () => {
			const t = video.currentTime;
			opts.onProgress?.((t - trimStart) / span);
			if (t >= trimEnd - .04) {
				video.pause();
				nEl?.pause();
				video.removeEventListener("timeupdate", onTime);
				if (recorder.state === "recording") recorder.stop();
			}
		};
		video.addEventListener("timeupdate", onTime);
		video.onended = () => {
			video.removeEventListener("timeupdate", onTime);
			if (recorder.state === "recording") recorder.stop();
		};
		recorder.start(200);
		const play = async () => {
			try {
				await video.play();
				await nEl?.play();
			} catch (err) {
				recorder.stop();
				reject(err instanceof Error ? err : /* @__PURE__ */ new Error("재생을 시작하지 못했습니다"));
			}
		};
		play();
	});
	drawing = false;
	video.pause();
	nEl?.pause();
	await audioCtx.close().catch(() => void 0);
	URL.revokeObjectURL(vUrl);
	mixed.getTracks().forEach((t) => t.stop());
	return blob;
}
function drawSubtitle(ctx, w, h, text) {
	const maxW = w * .82;
	ctx.font = `600 ${Math.max(22, Math.round(w / 28))}px "Noto Sans KR", sans-serif`;
	const lines = wrapText(ctx, text, maxW);
	const lineH = Math.round(w / 22);
	const padY = 14;
	const boxH = lines.length * lineH + 28;
	const boxW = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width))) + 44;
	const x = (w - boxW) / 2;
	const y = h - boxH - Math.round(h * .08);
	ctx.fillStyle = "rgba(9,9,11,0.72)";
	roundFill(ctx, x, y, boxW, boxH, 10);
	ctx.fillStyle = CANVAS.fg;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	lines.forEach((line, i) => {
		ctx.fillText(line, w / 2, y + padY + i * lineH);
	});
	ctx.textAlign = "start";
}
function wrapText(ctx, text, maxWidth) {
	const tokens = text.match(/[A-Za-z0-9]+|[가-힣]+|[.,!?。！？、，;:…]+|\s+|./gu) ?? [text];
	const lines = [];
	let line = "";
	for (const tok of tokens) {
		const test = line + tok;
		const punct = /^[.,!?。！？、，;:…]+$/.test(tok);
		if (line && ctx.measureText(test).width > maxWidth && !punct) {
			lines.push(line.trim());
			line = tok.replace(/^\s+/, "");
		} else line = test;
	}
	if (line.trim()) lines.push(line.trim());
	return lines.slice(0, 3);
}
function roundFill(ctx, x, y, w, h, r) {
	const radius = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + w, y, x + w, y + h, radius);
	ctx.arcTo(x + w, y + h, x, y + h, radius);
	ctx.arcTo(x, y + h, x, y, radius);
	ctx.arcTo(x, y, x, y, radius);
	ctx.closePath();
	ctx.fill();
}
function waitLoaded(video) {
	return new Promise((resolve, reject) => {
		if (video.readyState >= 2) {
			resolve();
			return;
		}
		video.onloadeddata = () => resolve();
		video.onerror = () => reject(/* @__PURE__ */ new Error("영상을 불러오지 못했습니다"));
	});
}
function waitSeek(video, t) {
	return new Promise((resolve) => {
		if (Math.abs(video.currentTime - t) < .08) {
			resolve();
			return;
		}
		const done = () => {
			video.removeEventListener("seeked", done);
			resolve();
		};
		video.addEventListener("seeked", done);
		setTimeout(done, 800);
	});
}
function loadAudio(blob) {
	return new Promise((resolve, reject) => {
		const el = document.createElement("audio");
		el.preload = "auto";
		el.src = URL.createObjectURL(blob);
		el.onloadeddata = () => resolve(el);
		el.onerror = () => reject(/* @__PURE__ */ new Error("나레이션을 불러오지 못했습니다"));
	});
}
function ExportStage({ nowMs }) {
	const title = useStudio((s) => s.title);
	const cues = useStudio((s) => s.cues);
	const captions = useStudio((s) => s.captions);
	const durationMs = useStudio((s) => s.durationMs);
	const trimStartMs = useStudio((s) => s.trimStartMs);
	const trimEndMs = useStudio((s) => s.trimEndMs);
	const setTrim = useStudio((s) => s.setTrim);
	const mixer = useStudio((s) => s.mixer);
	const setMixer = useStudio((s) => s.setMixer);
	const hasNarration = useStudio((s) => s.hasNarration);
	const narrationKind = useStudio((s) => s.narrationKind);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const span = Math.max(0, trimEndMs - trimStartMs);
	const track = burnTrack(captions, cues);
	const exportVideo = async () => {
		const video = getVideoBlob();
		if (!video) {
			toast.error("영상이 없습니다");
			return;
		}
		setBusy(true);
		setProgress(0);
		try {
			const { blob, ext } = await mixAndExport({
				videoBlob: video,
				narrationBlob: hasNarration ? getNarrationBlob() : null,
				cues: mixer.burnSubtitles ? track : [],
				durationMs,
				trimStartMs,
				trimEndMs,
				videoVolume: mixer.videoVolume,
				narrationVolume: mixer.narrationVolume,
				muteOriginal: mixer.muteOriginal,
				burnSubtitles: mixer.burnSubtitles,
				onProgress: (p) => setProgress(Math.round(p * 100))
			});
			downloadBlob(blob, `${slugify(title)}.${ext}`);
			toast.success(ext === "mp4" ? "MP4로 저장했습니다" : "WebM으로 저장했습니다");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "내보내기에 실패했습니다");
		} finally {
			setBusy(false);
			setProgress(0);
		}
	};
	const exportSrt = () => {
		const srt = cuesToSrt(track, durationMs);
		downloadBlob(new Blob([srt], { type: "text/plain;charset=utf-8" }), `${slugify(title)}.srt`);
		toast.success("자막 파일을 저장했습니다");
	};
	const exportScript = () => {
		const body = cues.map((c) => `[${formatTimecode(c.startMs)}] ${c.text}`).join("\n\n");
		downloadBlob(new Blob([`${title}\n\n${body}\n`], { type: "text/plain;charset=utf-8" }), `${slugify(title)}-script.txt`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground",
						children: "04 · 내보내기"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-tight",
						children: "섞어서 저장합니다"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: hasNarration ? narrationKind === "ai" ? "AI 목소리가 영상 위에 얹힙니다." : "녹음한 목소리가 영상 위에 얹힙니다." : "나레이션 없이 영상만 잘라 저장할 수 있습니다."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-lg bg-card p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "mute",
							children: "원본 소리 끄기"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							id: "mute",
							checked: mixer.muteOriginal,
							onCheckedChange: (v) => setMixer({ muteOriginal: v })
						})]
					}),
					!mixer.muteOriginal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "원본 볼륨" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums",
								children: [Math.round(mixer.videoVolume * 100), "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1,
							step: .05,
							value: [mixer.videoVolume],
							onValueChange: ([v]) => setMixer({ videoVolume: v ?? 0 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "나레이션 볼륨" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums",
								children: [Math.round(mixer.narrationVolume * 100), "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1,
							step: .05,
							value: [mixer.narrationVolume],
							onValueChange: ([v]) => setMixer({ narrationVolume: v ?? 1 }),
							disabled: !hasNarration
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionApplyToggle, { hint: true }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AutoCaptionButton, {
						preferNarration: true,
						className: "w-full"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionList, {
						nowMs,
						showApply: false
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 rounded-lg bg-card p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "자르기" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums",
						children: [
							formatTimecode(trimStartMs),
							" – ",
							formatTimecode(trimEndMs),
							" ·",
							" ",
							formatTimecode(span)
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: durationMs,
					step: 100,
					value: [trimStartMs, trimEndMs],
					onValueChange: ([a, b]) => setTrim(Math.min(a ?? 0, b ?? 0), Math.max(a ?? 0, b ?? 0))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					disabled: busy,
					onClick: () => void exportVideo(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), busy ? "섞는 중…" : "MP4로 저장"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: exportSrt,
						disabled: !track.length,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Captions, {}), "자막 SRT"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: exportScript,
						disabled: !cues.length,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {}), "대본 TXT"]
					})]
				})]
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "기본 저장은 MP4입니다. 이 브라우저가 못 만들면 WebM으로 내려갑니다."
			})
		]
	});
}
function StudioApp() {
	const hydrated = useStudio((s) => s.hydrated);
	const hydrate = useStudio((s) => s.hydrate);
	const step = useStudio((s) => s.step);
	const setStep = useStudio((s) => s.setStep);
	const hasVideo = useStudio((s) => s.hasVideo);
	const durationMs = useStudio((s) => s.durationMs);
	const cues = useStudio((s) => s.cues);
	const captions = useStudio((s) => s.captions);
	const mixer = useStudio((s) => s.mixer);
	const hasNarration = useStudio((s) => s.hasNarration);
	const mediaRev = useStudio((s) => s.mediaRev);
	const title = useStudio((s) => s.title);
	const setTitle = useStudio((s) => s.setTitle);
	const [nowMs, setNowMs] = (0, import_react.useState)(0);
	const [aiOn, setAiOn] = (0, import_react.useState)(false);
	const player = (0, import_react.useRef)(null);
	const liveHost = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		getAiStatus().then((s) => setAiOn(s.available)).catch(() => setAiOn(false));
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated && !hasVideo && step !== "record") setStep("record");
	}, [
		hydrated,
		hasVideo,
		step,
		setStep
	]);
	const src = hasVideo ? videoSrc() : null;
	const nSrc = hasNarration ? narrationSrc() : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl tracking-tight",
						children: "TAKE FIVE"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs text-muted-foreground sm:inline",
						children: "해커톤 시연 스튜디오"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 items-center gap-1 overflow-x-auto sm:justify-center",
					children: STEPS.map((s, i) => {
						const locked = s.id !== "record" && !hasVideo;
						const active = s.id === step;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: locked,
							onClick: () => setStep(s.id),
							className: cn("flex h-10 items-center gap-2 rounded-md px-3 text-sm transition-[background-color,color] duration-150 ease-out", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground", locked && "opacity-40"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs tabular-nums",
									children: s.n
								}),
								s.label,
								i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 hidden text-border sm:inline",
									children: "/"
								})
							]
						}, s.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					className: "h-9 max-w-48 bg-transparent text-sm",
					"aria-label": "작품 제목"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPane, {
						ref: player,
						src,
						durationMs,
						cues,
						captions,
						showCaptions: Boolean(mixer.burnSubtitles),
						narrationUrl: step === "export" || step === "voice" ? nSrc : null,
						muteOriginal: mixer.muteOriginal,
						videoVolume: mixer.videoVolume,
						narrationVolume: mixer.narrationVolume,
						onTime: setNowMs,
						empty: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyReel, {})
					}, mediaRev), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: liveHost,
						className: "absolute inset-0 overflow-hidden rounded-lg [&:empty]:hidden [&:empty]:pointer-events-none [&:not(:empty)]:bg-inset"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "min-h-0 rounded-xl bg-card/50 p-4 shadow-[var(--shadow-border)] sm:p-5 lg:overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {
					step,
					nowMs,
					player,
					liveHost,
					aiOn
				})
			})]
		})]
	});
}
function Stage({ step, nowMs, player, liveHost, aiOn }) {
	if (step === "record") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordStage, { liveHost });
	if (step === "script") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptStage, {
		nowMs,
		player,
		aiOn
	});
	if (step === "voice") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceStage, {
		player,
		nowMs,
		aiOn
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportStage, { nowMs });
}
function EmptyReel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative size-full min-h-40 bg-inset",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 top-0 h-full w-1.5 bg-rec" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-5 top-5 h-2 w-16 rounded-full bg-secondary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-5 top-10 h-2 w-28 rounded-full bg-elevated" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-5 top-16 h-2 w-20 rounded-full bg-secondary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-4 right-4 size-16 rounded-full bg-steel/35 shadow-[var(--shadow-border)] sm:size-20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl leading-tight text-foreground sm:text-3xl",
					children: "5분이면 끝납니다"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground sm:text-sm",
					children: "화면을 찍거나, 영상을 올리거나, 샘플로 시작하세요."
				})]
			})
		]
	});
}
var SplitComponent = StudioApp;
//#endregion
export { SplitComponent as component };
