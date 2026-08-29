import type { Cue } from "./types";

export function formatTimecode(ms: number, withMs = false): string {
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (!withMs) return `${m}:${s.toString().padStart(2, "0")}`;
  const frac = Math.floor((clamped % 1000) / 100);
  return `${m}:${s.toString().padStart(2, "0")}.${frac}`;
}

export function formatSrtTime(ms: number): string {
  const clamped = Math.max(0, Math.floor(ms));
  const h = Math.floor(clamped / 3_600_000);
  const m = Math.floor((clamped % 3_600_000) / 60_000);
  const s = Math.floor((clamped % 60_000) / 1000);
  const milli = clamped % 1000;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")},${milli.toString().padStart(3, "0")}`;
}

/** Korean narration ≈ 370 characters / minute. */
export function estimateSpeechMs(text: string): number {
  const chars = text.replace(/\s+/g, "").length;
  if (!chars) return 0;
  return (chars / 6.2) * 1000;
}

export function isPauseCue(cue: Cue) {
  return cue.kind === "pause";
}

export function cueSpanMs(cue: Cue): number {
  if (isPauseCue(cue)) {
    if (cue.endMs && cue.endMs > cue.startMs) return cue.endMs - cue.startMs;
    return 1000;
  }
  return Math.max(400, estimateSpeechMs(cue.text));
}

export function cueWindows(cues: Cue[], durationMs: number) {
  const sorted = [...cues].sort((a, b) => a.startMs - b.startMs);
  return sorted.map((cue, i) => {
    if (cue.endMs && cue.endMs > cue.startMs) {
      return { ...cue, endMs: cue.endMs };
    }
    const endMs = sorted[i + 1]?.startMs ?? durationMs;
    return { ...cue, endMs: Math.max(endMs, cue.startMs + 400) };
  });
}

export function packCues(
  cues: Cue[],
  durationMs: number,
  gapMs = 160,
  leadMs = 0,
): Cue[] {
  const sorted = [...cues]
    .filter((c) => c.text.trim() || isPauseCue(c))
    .sort((a, b) => a.startMs - b.startMs);
  const lead = Math.max(0, leadMs);
  let t = lead;
  return sorted.map((c) => {
    const pause = isPauseCue(c);
    const spoken = cueSpanMs(c);
    const floor = pause ? 0 : lead;
    const startMs = Math.max(floor, Math.max(c.startMs, t));
    const endMs = startMs + spoken;
    t = endMs + (pause ? 0 : gapMs);
    return { ...c, startMs, endMs, text: pause ? "" : c.text, kind: pause ? "pause" : c.kind };
  });
}

export function overlappingCueIds(cues: Cue[]): Set<string> {
  const sorted = [...cues]
    .filter((c) => c.text.trim())
    .sort((a, b) => a.startMs - b.startMs);
  const ids = new Set<string>();
  for (let i = 0; i < sorted.length - 1; i++) {
    const c = sorted[i]!;
    const spoken = estimateSpeechMs(c.text);
    const next = sorted[i + 1]!;
    if (spoken > 0 && c.startMs + spoken > next.startMs + 40) {
      ids.add(c.id);
      ids.add(next.id);
    }
  }
  return ids;
}

export function downloadBlob(blob: Blob, filename: string) {
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

export function cuesToSrt(cues: Cue[], durationMs: number): string {
  return cueWindows(cues, durationMs)
    .filter((c) => c.text.trim())
    .map((c, i) => {
      return `${i + 1}\n${formatSrtTime(c.startMs)} --> ${formatSrtTime(c.endMs)}\n${c.text.trim()}\n`;
    })
    .join("\n");
}

export function slugify(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w가-힣-]+/g, "")
    .slice(0, 40);
  return s || "take-five";
}
