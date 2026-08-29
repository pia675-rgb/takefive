type MediaMem = {
  videoBlob: Blob | null;
  videoUrl: string | null;
  narrationBlob: Blob | null;
  narrationUrl: string | null;
};

const g = globalThis as typeof globalThis & { __takeFiveMedia?: MediaMem };
const mem: MediaMem = (g.__takeFiveMedia ??= {
  videoBlob: null,
  videoUrl: null,
  narrationBlob: null,
  narrationUrl: null,
});

function swapUrl(prev: string | null, blob: Blob | null): string | null {
  if (prev) URL.revokeObjectURL(prev);
  return blob ? URL.createObjectURL(blob) : null;
}

export function setVideoBlob(blob: Blob | null) {
  mem.videoBlob = blob;
  mem.videoUrl = swapUrl(mem.videoUrl, blob);
}

export function getVideoBlob() {
  return mem.videoBlob;
}

export function getVideoUrl() {
  return mem.videoUrl;
}

export function setNarrationBlob(blob: Blob | null) {
  mem.narrationBlob = blob;
  mem.narrationUrl = swapUrl(mem.narrationUrl, blob);
}

export function getNarrationBlob() {
  return mem.narrationBlob;
}

export function getNarrationUrl() {
  return mem.narrationUrl;
}


const VIDEO_EXT = /\.(mp4|m4v|mov|webm|mkv|avi|ogv|3gp)$/i;

/** iOS gallery files often arrive with an empty MIME type. */
export function isLikelyVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  return VIDEO_EXT.test(file.name);
}

export function pickRecorderMime(kind: "video" | "audio"): string | undefined {

  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates =
    kind === "video"
      ? [
          "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
          "video/mp4;codecs=avc1.4d001f,mp4a.40.2",
          "video/mp4",
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ]
      : ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/aac"];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c));
}

export function videoDurationMs(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("video");
    el.preload = "metadata";
    const url = URL.createObjectURL(blob);
    let settled = false;
    const done = (ms: number) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve(Math.max(0, ms));
    };
    const timer = window.setTimeout(() => done(0), 1500);
    el.onloadedmetadata = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        window.clearTimeout(timer);
        done(el.duration * 1000);
        return;
      }
      el.ontimeupdate = () => {
        if (Number.isFinite(el.duration) && el.duration > 0) {
          window.clearTimeout(timer);
          el.ontimeupdate = null;
          done(el.duration * 1000);
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
        reject(new Error("영상을 읽지 못했습니다"));
      }
    };
    el.src = url;
  });
}

export function audioDurationMs(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("audio");
    el.preload = "metadata";
    const url = URL.createObjectURL(blob);
    el.onloadedmetadata = () => {
      const d = Number.isFinite(el.duration) ? el.duration * 1000 : 0;
      URL.revokeObjectURL(url);
      resolve(d);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("오디오를 읽지 못했습니다"));
    };
    el.src = url;
  });
}

export function base64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numCh = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const samples = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numCh * bytesPerSample;
  const dataSize = samples * blockAlign;
  const header = 44;
  const out = new ArrayBuffer(header + dataSize);
  const view = new DataView(out);

  const writeStr = (offset: number, str: string) => {
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

  const channels: Float32Array[] = [];
  for (let c = 0; c < numCh; c++) channels.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < samples; i++) {
    for (let c = 0; c < numCh; c++) {
      const s = Math.max(-1, Math.min(1, channels[c]![i] ?? 0));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([out], { type: "audio/wav" });
}

export async function decodeAudioBlob(blob: Blob): Promise<AudioBuffer> {
  const ctx = new AudioContext();
  const buf = await blob.arrayBuffer();
  const audio = await ctx.decodeAudioData(buf.slice(0));
  await ctx.close();
  return audio;
}

export async function stitchCueAudio(
  items: { startMs: number; blob: Blob }[],
  minDurationMs: number,
): Promise<{ blob: Blob; startsMs: number[] }> {
  if (items.length === 0) throw new Error("붙일 오디오가 없습니다");
  const decoded = await Promise.all(
    items.map(async (it) => ({
      startMs: it.startMs,
      buffer: await decodeAudioBlob(it.blob),
    })),
  );
  decoded.sort((a, b) => a.startMs - b.startMs);
  const sampleRate = decoded[0]?.buffer.sampleRate ?? 44100;
  const GAP = 0.14;
  let cursor = 0;
  const placed = decoded.map((d) => {
    const start = Math.max(0, d.startMs / 1000, cursor);
    cursor = start + d.buffer.duration + GAP;
    return { buffer: d.buffer, at: start };
  });
  const endSec = Math.max(minDurationMs / 1000, cursor);
  const length = Math.max(1, Math.ceil(endSec * sampleRate));
  const offline = new OfflineAudioContext(2, length, sampleRate);
  for (const d of placed) {
    const src = offline.createBufferSource();
    src.buffer = d.buffer;
    src.connect(offline.destination);
    src.start(d.at);
  }
  const rendered = await offline.startRendering();
  return {
    blob: audioBufferToWav(rendered),
    startsMs: placed.map((p) => Math.round(p.at * 1000)),
  };
}

export async function extractAudioForStt(
  media: Blob,
): Promise<{ blob: Blob; mime: string }> {
  const raw = await media.arrayBuffer();
  const ctx = new AudioContext();
  let decoded: AudioBuffer;
  try {
    decoded = await ctx.decodeAudioData(raw.slice(0));
  } finally {
    await ctx.close().catch(() => undefined);
  }
  const targetRate = 16000;
  const length = Math.max(1, Math.ceil(decoded.duration * targetRate));
  const offline = new OfflineAudioContext(1, length, targetRate);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();
  const peak = peakAmplitude(rendered);
  if (peak < 0.008) {
    throw new Error("silent");
  }
  return { blob: audioBufferToWav(rendered), mime: "audio/wav" };
}

function peakAmplitude(buffer: AudioBuffer): number {
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
