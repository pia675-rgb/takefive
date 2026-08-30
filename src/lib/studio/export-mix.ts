import { CANVAS, type Cue } from "./types";
import { cueWindows } from "./time";
import { pickRecorderMime } from "./media";
import { looksLikeMp4, transcodeToMp4 } from "./to-mp4";

export interface MixOptions {
  videoBlob: Blob;
  narrationBlob: Blob | null;
  cues: Cue[];
  durationMs: number;
  trimStartMs: number;
  trimEndMs: number;
  videoVolume: number;
  narrationVolume: number;
  muteOriginal: boolean;
  burnSubtitles: boolean;
  onProgress?: (p: number) => void;
}

export interface MixResult {
  blob: Blob;
  ext: "mp4" | "webm";
}

type CapturableVideo = HTMLVideoElement & {
  captureStream: (fps?: number) => MediaStream;
};

export async function mixAndExport(opts: MixOptions): Promise<MixResult> {
  const mixed = await mixRealtime({
    ...opts,
    onProgress: (p) => opts.onProgress?.(p * 0.72),
  });
  if (looksLikeMp4(mixed)) {
    opts.onProgress?.(1);
    return { blob: mixed, ext: "mp4" };
  }
  try {
    const blob = await transcodeToMp4(mixed, (p) =>
      opts.onProgress?.(0.72 + p * 0.28),
    );
    return { blob, ext: "mp4" };
  } catch {
    opts.onProgress?.(1);
    return { blob: mixed, ext: "webm" };
  }
}

async function mixRealtime(opts: MixOptions): Promise<Blob> {
  const trimStart = Math.max(0, opts.trimStartMs) / 1000;
  const trimEnd = Math.max(trimStart + 0.4, opts.trimEndMs / 1000);
  const span = trimEnd - trimStart;

  const video = document.createElement("video") as CapturableVideo;
  video.playsInline = true;
  video.preload = "auto";
  const vUrl = URL.createObjectURL(opts.videoBlob);
  video.src = vUrl;
  await waitLoaded(video);

  const narration = opts.narrationBlob
    ? await loadAudio(opts.narrationBlob)
    : null;

  await document.fonts.ready.catch(() => undefined);

  const useCanvas = opts.burnSubtitles && opts.cues.length > 0;
  const canvas = document.createElement("canvas");
  const srcW = video.videoWidth || 1280;
  const srcH = video.videoHeight || 720;
  const scale = Math.min(1, 1280 / srcW);
  canvas.width = even(Math.round(srcW * scale) || 1280);
  canvas.height = even(Math.round(srcH * scale) || 720);
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

  let nEl: HTMLAudioElement | null = null;
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

  let videoStream: MediaStream;
  let drawing = false;
  if (useCanvas) {
    drawing = true;
    const windows = cueWindows(opts.cues, opts.durationMs);
    const loop = () => {
      if (!drawing) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const tMs = video.currentTime * 1000;
      const cue = windows.find((c) => tMs >= c.startMs && tMs < c.endMs);
      if (cue?.text) drawSubtitle(ctx, canvas.width, canvas.height, cue.text);
      const rvfc = (
        video as HTMLVideoElement & {
          requestVideoFrameCallback?: (cb: () => void) => number;
        }
      ).requestVideoFrameCallback;
      if (typeof rvfc === "function") rvfc.call(video, loop);
      else requestAnimationFrame(loop);
    };
    loop();
    videoStream = canvas.captureStream(30);
  } else if (typeof video.captureStream === "function") {
    videoStream = video.captureStream(30);
  } else {
    drawing = true;
    const loop = () => {
      if (!drawing) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(loop);
    };
    loop();
    videoStream = canvas.captureStream(30);
  }

  const mixed = new MediaStream([
    ...(videoStream.getVideoTracks() as MediaStreamTrack[]),
    ...(dest.stream.getAudioTracks() as MediaStreamTrack[]),
  ]);

  const mime = pickRecorderMime("video");
  const recorder = new MediaRecorder(mixed, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  const blob = await new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => reject(new Error("내보내기에 실패했습니다"));
    recorder.onstop = () => {
      drawing = false;
      resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
    };

    const onTime = () => {
      const t = video.currentTime;
      opts.onProgress?.((t - trimStart) / span);
      if (t >= trimEnd - 0.04) {
        video.pause();
        nEl?.pause();
        video.removeEventListener("timeupdate", onTime);
        if (recorder.state === "recording") recorder.stop();
      }
    };

    const play = async () => {
      try {
        await video.play();
        await nEl?.play();
        if (recorder.state === "inactive") recorder.start(250);
        video.addEventListener("timeupdate", onTime);
        video.onended = () => {
          video.removeEventListener("timeupdate", onTime);
          if (recorder.state === "recording") recorder.stop();
        };
      } catch (err) {
        if (recorder.state === "recording") recorder.stop();
        reject(err instanceof Error ? err : new Error("재생을 시작하지 못했습니다"));
      }
    };
    void play();
  });

  drawing = false;
  video.pause();
  nEl?.pause();
  await audioCtx.close().catch(() => undefined);
  URL.revokeObjectURL(vUrl);
  if (nEl?.src) URL.revokeObjectURL(nEl.src);
  mixed.getTracks().forEach((t) => t.stop());
  return blob;
}

function drawSubtitle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
) {
  const maxW = w * 0.82;
  ctx.font = `600 ${Math.max(22, Math.round(w / 28))}px "Noto Sans KR", sans-serif`;
  const lines = wrapText(ctx, text, maxW);
  const lineH = Math.round(w / 22);
  const padX = 22;
  const padY = 14;
  const boxH = lines.length * lineH + padY * 2;
  const boxW =
    Math.min(
      maxW,
      Math.max(...lines.map((l) => ctx.measureText(l).width)),
    ) +
    padX * 2;
  const x = (w - boxW) / 2;
  const y = h - boxH - Math.round(h * 0.08);
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

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const tokens = text.match(/[A-Za-z0-9]+|[가-힣]+|[.,!?。！？、，;:…]+|\s+|./gu) ?? [
    text,
  ];
  const lines: string[] = [];
  let line = "";
  for (const tok of tokens) {
    const test = line + tok;
    const punct = /^[.,!?。！？、，;:…]+$/.test(tok);
    if (line && ctx.measureText(test).width > maxWidth && !punct) {
      lines.push(line.trim());
      line = tok.replace(/^\s+/, "");
    } else {
      line = test;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

function roundFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
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

function even(n: number) {
  return n - (n % 2);
}

function waitLoaded(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 2) {
      resolve();
      return;
    }
    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error("영상을 불러오지 못했습니다"));
  });
}

function waitSeek(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve) => {
    if (Math.abs(video.currentTime - t) < 0.08) {
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

function loadAudio(blob: Blob): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("audio");
    el.preload = "auto";
    const url = URL.createObjectURL(blob);
    el.src = url;
    el.onloadeddata = () => resolve(el);
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("나레이션을 불러오지 못했습니다"));
    };
  });
}
