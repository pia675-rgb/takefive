import { pickRecorderMime } from "./media";
import { CANVAS } from "./types";

export type PipCorner = "br" | "bl" | "tr" | "tl" | "off";
export type PipShape = "circle" | "rect";
export type PipSize = "sm" | "md";

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}

export interface RecordHandle {
  preview: HTMLCanvasElement | HTMLVideoElement;
  stop: () => Promise<Blob>;
}

const TARGET_FPS = 30;
const MAX_EDGE = 1280;

export async function startScreenRecord(opts: {
  withMic: boolean;
  pip: PipCorner;
  pipShape?: PipShape;
  pipSize?: PipSize;
  onShareEnded?: () => void;
  beforeStart?: () => Promise<void>;
}): Promise<RecordHandle> {
  const display = await getDisplayStream();
  hintTrack(display.getVideoTracks()[0], "motion");

  const wantCam = opts.pip !== "off";
  let cam: MediaStream | null = null;
  if (opts.withMic || wantCam) {
    try {
      cam = await navigator.mediaDevices.getUserMedia({
        audio: opts.withMic,
        video: wantCam
          ? {
              facingMode: "user",
              width: { ideal: 320, max: 480 },
              height: { ideal: 320, max: 480 },
              frameRate: { ideal: 24, max: 30 },
            }
          : false,
      });
    } catch {
      if (opts.withMic) {
        try {
          cam = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
        } catch {
          stopStream(display);
          throw new Error("마이크 또는 카메라 권한이 필요합니다");
        }
      }
    }
  }
  if (cam) hintTrack(cam.getVideoTracks()[0], "motion");

  const camHasVideo = Boolean(cam?.getVideoTracks().length);
  const usePip = wantCam && camHasVideo;
  const videoTrack = display.getVideoTracks()[0];
  let started = false;
  videoTrack?.addEventListener("ended", () => {
    if (started) opts.onShareEnded?.();
  });

  const abortIfShareEnded = async () => {
    if (videoTrack && videoTrack.readyState === "ended") {
      stopStream(display);
      stopStream(cam);
      throw new Error("화면 공유가 종료되었습니다");
    }
    if (opts.beforeStart) await opts.beforeStart();
    if (videoTrack && videoTrack.readyState === "ended") {
      stopStream(display);
      stopStream(cam);
      throw new Error("화면 공유가 종료되었습니다");
    }
  };

  if (!usePip) {
    await abortIfShareEnded();
    const handle = await recordStream({
      stream: mixAudio(display, display, cam),
      previewFrom: display,
      extra: [display, cam],
      preferWebm: false,
    });
    started = true;
    return handle;
  }

  const screenVideo = attachVideo(display);
  const camVideo = attachVideo(cam!);
  await Promise.all([waitMeta(screenVideo), waitMeta(camVideo)]);

  const srcW = screenVideo.videoWidth || 1280;
  const srcH = screenVideo.videoHeight || 720;
  const scale = Math.min(1, MAX_EDGE / Math.max(srcW, srcH));
  const w = even(Math.round(srcW * scale) || 1280);
  const h = even(Math.round(srcH * scale) || 720);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  if (!ctx) {
    stopStream(display);
    stopStream(cam);
    throw new Error("캔버스를 만들 수 없습니다");
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "low";

  const shape = opts.pipShape ?? "circle";
  const size = opts.pipSize ?? "md";
  const corner = opts.pip === "off" ? "br" : opts.pip;

  let running = true;
  let lastPaint = 0;
  let vfcHandle = 0;
  let watchdog = 0;

  const paint = () => {
    if (!running) return;
    lastPaint = performance.now();
    ctx.fillStyle = CANVAS.bg;
    ctx.fillRect(0, 0, w, h);
    if (screenVideo.readyState >= 2) {
      ctx.drawImage(screenVideo, 0, 0, w, h);
    }
    if (camVideo.readyState >= 2) {
      drawHostPipLive(ctx, w, h, camVideo, corner, shape, size);
    }
  };

  const onVideoFrame = () => {
    paint();
    if (!running) return;
    const rvfc = (
      screenVideo as HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
      }
    ).requestVideoFrameCallback;
    if (typeof rvfc === "function") {
      vfcHandle = rvfc.call(screenVideo, onVideoFrame);
    }
  };
  onVideoFrame();
  watchdog = window.setInterval(() => {
    if (running && performance.now() - lastPaint > 40) paint();
  }, 1000 / TARGET_FPS);

  keepPlaying(screenVideo, () => running);
  keepPlaying(camVideo, () => running);

  await abortIfShareEnded();

  const canvasStream = canvas.captureStream(TARGET_FPS);
  hintTrack(canvasStream.getVideoTracks()[0], "motion");
  const mixed = mixAudio(canvasStream, display, cam);

  const handle = await recordStream({
    stream: mixed,
    preview: canvas,
    preferWebm: true,
    extra: [display, cam, canvasStream],
    audioCtx: mixed.audioCtx,
    onStop: () => {
      running = false;
      window.clearInterval(watchdog);
      const cancel = (
        screenVideo as HTMLVideoElement & {
          cancelVideoFrameCallback?: (h: number) => void;
        }
      ).cancelVideoFrameCallback;
      if (typeof cancel === "function" && vfcHandle) cancel.call(screenVideo, vfcHandle);
      screenVideo.srcObject = null;
      camVideo.srcObject = null;
    },
  });
  started = true;
  return handle;
}

export async function startCameraRecord(withMic: boolean): Promise<RecordHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: withMic,
  });
  hintTrack(stream.getVideoTracks()[0], "motion");
  const video = attachVideo(stream);
  await waitMeta(video);
  let camAlive = true;
  keepPlaying(video, () => camAlive);
  return recordStream({
    stream,
    preview: video,
    extra: [stream],
    preferWebm: false,
    onStop: () => {
      camAlive = false;
      video.srcObject = null;
    },
  });
}

interface MixedStream extends MediaStream {
  audioCtx?: AudioContext;
}

function recordStream(opts: {
  stream: MixedStream;
  preview?: HTMLCanvasElement | HTMLVideoElement;
  previewFrom?: MediaStream;
  extra: (MediaStream | null)[];
  preferWebm: boolean;
  audioCtx?: AudioContext;
  onStop?: () => void;
}): Promise<RecordHandle> {
  return (async () => {
    const preview =
      opts.preview ??
      attachVideo(opts.previewFrom ?? opts.stream);
    const mime = pickRecorderMime("video", opts.preferWebm ? "webm" : "mp4");
    const audioCtx = opts.audioCtx ?? opts.stream.audioCtx;
    if (audioCtx?.state === "suspended") await audioCtx.resume();
    const recOpts: MediaRecorderOptions = {
      videoBitsPerSecond: 2_800_000,
    };
    if (mime) recOpts.mimeType = mime;
    if (opts.stream.getAudioTracks().length) recOpts.audioBitsPerSecond = 128_000;
    const recorder = new MediaRecorder(opts.stream, recOpts);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.start(1000);

    return {
      preview,
      stop: () =>
        new Promise((resolve, reject) => {
          recorder.onerror = () => reject(new Error("녹화를 저장하지 못했습니다"));
          recorder.onstop = () => {
            opts.onStop?.();
            for (const s of opts.extra) stopStream(s);
            opts.stream.getTracks().forEach((t) => t.stop());
            void audioCtx?.close();
            resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
          };
          if (recorder.state === "recording") recorder.stop();
          else {
            opts.onStop?.();
            resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
          }
        }),
    };
  })();
}

async function getDisplayStream(): Promise<MediaStream> {
  const video: MediaTrackConstraints = {
    frameRate: { ideal: TARGET_FPS, max: TARGET_FPS },
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
  };
  try {
    return await navigator.mediaDevices.getDisplayMedia({
      video,
      audio: true,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (/audio/i.test(msg) || (err instanceof DOMException && err.name === "NotSupportedError")) {
      return navigator.mediaDevices.getDisplayMedia({ video, audio: false });
    }
    throw err;
  }
}

export function pipPlacement(
  frameW: number,
  frameH: number,
  corner: Exclude<PipCorner, "off">,
  size: PipSize,
) {
  const s = Math.round(Math.min(frameW, frameH) * (size === "sm" ? 0.2 : 0.28));
  const pad = Math.round(Math.min(frameW, frameH) * 0.032);
  const x = corner === "bl" || corner === "tl" ? pad : frameW - s - pad;
  const y = corner === "tr" || corner === "tl" ? pad : frameH - s - pad;
  return { x, y, s };
}

export function drawHostPip(
  ctx: CanvasRenderingContext2D,
  frameW: number,
  frameH: number,
  cam: HTMLVideoElement,
  corner: Exclude<PipCorner, "off">,
  shape: PipShape,
  size: PipSize,
) {
  drawHostPipLive(ctx, frameW, frameH, cam, corner, shape, size);
}

function drawHostPipLive(
  ctx: CanvasRenderingContext2D,
  frameW: number,
  frameH: number,
  cam: HTMLVideoElement,
  corner: Exclude<PipCorner, "off">,
  shape: PipShape,
  size: PipSize,
) {
  const { x, y, s } = pipPlacement(frameW, frameH, corner, size);
  ctx.save();
  pipPath(ctx, x, y, s, shape);
  ctx.clip();
  coverMirror(ctx, cam, x, y, s);
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = "rgba(244,241,234,0.7)";
  ctx.lineWidth = Math.max(2, Math.round(s * 0.03));
  pipPath(ctx, x, y, s, shape);
  ctx.stroke();
  ctx.restore();
}

export function drawHostSilhouette(
  ctx: CanvasRenderingContext2D,
  frameW: number,
  frameH: number,
  corner: Exclude<PipCorner, "off">,
  shape: PipShape,
  size: PipSize,
) {
  const { x, y, s } = pipPlacement(frameW, frameH, corner, size);
  ctx.save();
  pipPath(ctx, x, y, s, shape);
  ctx.clip();
  ctx.fillStyle = CANVAS.card;
  ctx.fillRect(x, y, s, s);
  const cx = x + s / 2;
  const cy = y + s * 0.42;
  ctx.fillStyle = CANVAS.steel;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, y + s * 0.92, s * 0.32, s * 0.28, 0, Math.PI, 0, true);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = "rgba(244,241,234,0.55)";
  ctx.lineWidth = Math.max(2, Math.round(s * 0.03));
  pipPath(ctx, x, y, s, shape);
  ctx.stroke();
  ctx.restore();
}

function pipPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  shape: PipShape,
) {
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
  } else {
    const r = Math.round(s * 0.14);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + s, y, x + s, y + s, r);
    ctx.arcTo(x + s, y + s, x, y + s, r);
    ctx.arcTo(x, y + s, x, y, r);
    ctx.arcTo(x, y, x + s, y, r);
    ctx.closePath();
  }
}

function coverMirror(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  x: number,
  y: number,
  s: number,
) {
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

function mixAudio(
  videoFrom: MediaStream,
  display: MediaStream,
  cam: MediaStream | null,
): MixedStream {
  const tracks: MediaStreamTrack[] = [...videoFrom.getVideoTracks()];
  const hasDisplayAudio = display.getAudioTracks().length > 0;
  const hasCamAudio = Boolean(cam?.getAudioTracks().length);
  if (!hasDisplayAudio && !hasCamAudio) {
    return new MediaStream(tracks);
  }
  if (hasDisplayAudio && !hasCamAudio) {
    tracks.push(...display.getAudioTracks());
    return new MediaStream(tracks);
  }
  if (!hasDisplayAudio && hasCamAudio && cam) {
    tracks.push(...cam.getAudioTracks());
    return new MediaStream(tracks);
  }

  const audioCtx = new AudioContext();
  const dest = audioCtx.createMediaStreamDestination();
  const connect = (stream: MediaStream) => {
    if (!stream.getAudioTracks().length) return;
    const src = audioCtx.createMediaStreamSource(stream);
    src.connect(dest);
  };
  connect(display);
  if (cam) connect(cam);
  tracks.push(...dest.stream.getAudioTracks());
  const mixed = new MediaStream(tracks) as MixedStream;
  mixed.audioCtx = audioCtx;
  return mixed;
}

function attachVideo(stream: MediaStream): HTMLVideoElement {
  const el = document.createElement("video");
  el.muted = true;
  el.defaultMuted = true;
  el.playsInline = true;
  el.autoplay = true;
  el.setAttribute("playsinline", "true");
  el.setAttribute("muted", "true");
  el.srcObject = stream;
  void el.play().catch(() => undefined);
  return el;
}

function keepPlaying(el: HTMLVideoElement, alive: () => boolean) {
  el.addEventListener("pause", () => {
    if (alive()) void el.play().catch(() => undefined);
  });
}

function waitMeta(el: HTMLVideoElement): Promise<void> {
  if (el.readyState >= 1) return Promise.resolve();
  return new Promise((resolve) => {
    el.onloadedmetadata = () => resolve();
    setTimeout(() => resolve(), 1500);
  });
}

function even(n: number) {
  return n - (n % 2);
}

function hintTrack(track: MediaStreamTrack | undefined, hint: string) {
  if (track && "contentHint" in track) {
    try {
      (track as MediaStreamTrack & { contentHint: string }).contentHint = hint;
    } catch {
      /* ignore */
    }
  }
}
