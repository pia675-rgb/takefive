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

export async function startScreenRecord(opts: {
  withMic: boolean;
  pip: PipCorner;
  pipShape?: PipShape;
  pipSize?: PipSize;
  onShareEnded?: () => void;
}): Promise<RecordHandle> {
  const display = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 30 },
    audio: true,
  });

  const wantCam = opts.pip !== "off";
  let cam: MediaStream | null = null;
  if (opts.withMic || wantCam) {
    try {
      cam = await navigator.mediaDevices.getUserMedia({
        audio: opts.withMic,
        video: wantCam,
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
    if (camVideo && corner !== "off") {
      drawHostPip(ctx, w, h, camVideo, corner, shape, size);
    }
    requestAnimationFrame(draw);
  };
  draw();

  const canvasStream = canvas.captureStream(30);
  const mixed = mixAudio(canvasStream, display, cam);
  const mime = pickRecorderMime("video");
  const recorder = new MediaRecorder(mixed, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  recorder.start(200);

  display.getVideoTracks()[0]?.addEventListener("ended", () => {
    opts.onShareEnded?.();
  });

  return {
    preview: canvas,
    stop: () =>
      new Promise((resolve, reject) => {
        running = false;
        recorder.onerror = () => reject(new Error("녹화를 저장하지 못했습니다"));
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
      }),
  };
}

export async function startCameraRecord(withMic: boolean): Promise<RecordHandle> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: withMic,
  });
  const video = attachVideo(stream);
  await waitMeta(video);
  const mime = pickRecorderMime("video");
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  recorder.start(200);
  return {
    preview: video,
    stop: () =>
      new Promise((resolve, reject) => {
        recorder.onerror = () => reject(new Error("녹화를 저장하지 못했습니다"));
        recorder.onstop = () => {
          stopStream(stream);
          video.srcObject = null;
          resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
        };
        if (recorder.state === "recording") recorder.stop();
        else resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
      }),
  };
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
  const { x, y, s } = pipPlacement(frameW, frameH, corner, size);
  clipPip(ctx, x, y, s, shape, () => {
    coverMirror(ctx, cam, x, y, s);
  });
  strokePip(ctx, x, y, s, shape);
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
  clipPip(ctx, x, y, s, shape, () => {
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
  });
  strokePip(ctx, x, y, s, shape);
}

function clipPip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  shape: PipShape,
  paint: () => void,
) {
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

function strokePip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  shape: PipShape,
) {
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
  canvasStream: MediaStream,
  display: MediaStream,
  cam: MediaStream | null,
): MediaStream {
  const audioCtx = new AudioContext();
  const dest = audioCtx.createMediaStreamDestination();
  let connected = 0;
  const connect = (stream: MediaStream) => {
    if (!stream.getAudioTracks().length) return;
    const src = audioCtx.createMediaStreamSource(stream);
    src.connect(dest);
    connected += 1;
  };
  connect(display);
  if (cam) connect(cam);
  const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
  if (connected > 0) tracks.push(...dest.stream.getAudioTracks());
  return new MediaStream(tracks);
}

function attachVideo(stream: MediaStream): HTMLVideoElement {
  const el = document.createElement("video");
  el.muted = true;
  el.playsInline = true;
  el.autoplay = true;
  el.srcObject = stream;
  void el.play();
  return el;
}

function waitMeta(el: HTMLVideoElement): Promise<void> {
  if (el.readyState >= 1) return Promise.resolve();
  return new Promise((resolve) => {
    el.onloadedmetadata = () => resolve();
    setTimeout(() => resolve(), 1500);
  });
}
