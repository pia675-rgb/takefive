import { drawHostSilhouette } from "./record";
import { CANVAS } from "./types";
import { pickRecorderMime } from "./media";

const DURATION_MS = 12_000;

const CHAPTERS = [
  { at: 0, n: "01", title: "문제", sub: "현장의 불편을 한 줄로" },
  { at: 3000, n: "02", title: "솔루션", sub: "지금 만든 제품이 답이다" },
  { at: 6000, n: "03", title: "라이브 데모", sub: "클릭 세 번이면 이해된다" },
  { at: 9000, n: "04", title: "임팩트", sub: "다음 스텝을 분명히" },
];

export async function createSampleVideo(
  onProgress: (p: number) => void,
): Promise<{ blob: Blob; durationMs: number }> {
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
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  const start = performance.now();

  return new Promise((resolve, reject) => {
    recorder.onerror = () => reject(new Error("샘플 영상을 만들지 못했습니다"));
    recorder.onstop = () => {
      osc.stop();
      void audioCtx.close();
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
      resolve({ blob, durationMs: DURATION_MS });
    };

    recorder.start(80);
    drawSlide(ctx, w, h, CHAPTERS[0]!, 0, 0);

    const frame = () => {
      const elapsed = performance.now() - start;
      onProgress(Math.min(1, elapsed / DURATION_MS));
      const ch =
        [...CHAPTERS].reverse().find((c) => elapsed >= c.at) ?? CHAPTERS[0]!;
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

function drawSlide(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  ch: (typeof CHAPTERS)[number],
  p: number,
  elapsed: number,
) {
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

  const sec = Math.min(DURATION_MS, elapsed) / 1000;
  ctx.fillStyle = CANVAS.muted;
  ctx.font = "500 16px ui-monospace, monospace";
  ctx.fillText(
    `0:${Math.floor(sec).toString().padStart(2, "0")} / 0:12`,
    64,
    h - 36,
  );

  drawHostSilhouette(ctx, w, h, "br", "circle", "md");
}
