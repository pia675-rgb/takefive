import type { Cue } from "./types";
import { estimateSpeechMs, packCues } from "./time";

const CHARS_PER_SEC = 6.2;

export function charCount(text: string) {
  return text.replace(/\s+/g, "").length;
}

export function targetSpeechMs(durationMs: number, leadMs = 0) {
  const tail = Math.min(800, Math.max(280, durationMs * 0.06));
  return Math.max(1200, durationMs - tail - Math.max(0, leadMs));
}

export function cueBudget(durationMs: number) {
  const sec = durationMs / 1000;
  const min = sec < 20 ? 2 : sec < 45 ? 3 : 4;
  const max = sec < 15 ? 4 : sec < 40 ? 6 : sec < 90 ? 8 : sec < 180 ? 10 : 12;
  return { min, max };
}

export function formatSourceForAi(cues: Cue[]): string {
  return cues
    .map((c) => {
      const t = formatShort(c.startMs);
      return `[${t}] ${c.text.trim()}`;
    })
    .join("\n");
}

function formatShort(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/(?<=다\.|요\.|니다\.|까\?|까\.|죠\.|네\.|음\.|[.!?…])\s+/);
  const out = parts.map((p) => p.trim()).filter(Boolean);
  return out.length ? out : [cleaned];
}

export function compressToChars(text: string, maxChars: number): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (charCount(trimmed) <= maxChars) return trimmed;
  const sentences = splitSentences(trimmed);
  if (sentences.length <= 1) {
    if (trimmed.length <= maxChars) return trimmed;
    const cut = trimmed.slice(0, Math.max(8, maxChars));
    const at = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf(","));
    return (at > 8 ? cut.slice(0, at) : cut).trim();
  }
  const kept: string[] = [];
  let n = 0;
  for (const s of sentences) {
    const c = charCount(s);
    if (kept.length && n + c > maxChars) break;
    kept.push(s);
    n += c;
    if (n >= maxChars) break;
  }
  return (kept.join(" ") || sentences[0]!).trim();
}

function mergeToCount(texts: string[], max: number): string[] {
  const next = texts.map((t) => t.trim()).filter(Boolean);
  while (next.length > max) {
    let idx = 0;
    let best = Infinity;
    for (let i = 0; i < next.length - 1; i++) {
      const score = charCount(next[i]!) + charCount(next[i + 1]!);
      if (score < best) {
        best = score;
        idx = i;
      }
    }
    next.splice(idx, 2, `${next[idx]} ${next[idx + 1]}`.trim());
  }
  return next;
}

function splitToCount(texts: string[], min: number, maxCharsEach: number): string[] {
  const next = [...texts];
  let i = 0;
  while (next.length < min && i < 20) {
    i += 1;
    const longIdx = next.reduce(
      (best, t, idx) => (charCount(t) > charCount(next[best]!) ? idx : best),
      0,
    );
    const sentences = splitSentences(next[longIdx]!);
    if (sentences.length < 2) break;
    const mid = Math.ceil(sentences.length / 2);
    next.splice(longIdx, 1, sentences.slice(0, mid).join(" "), sentences.slice(mid).join(" "));
  }
  return next.map((t) => compressToChars(t, maxCharsEach));
}

export function fitCuesToDuration(
  cues: Cue[],
  durationMs: number,
  leadMs = 0,
): Cue[] {
  const dur = Math.max(1200, durationMs);
  const lead = Math.max(0, Math.min(leadMs, Math.max(0, dur - 800)));
  const budget = targetSpeechMs(dur, lead);
  const { min, max } = cueBudget(dur);
  let texts = cues.map((c) => c.text.replace(/\s+/g, " ").trim()).filter(Boolean);
  if (!texts.length) return [];

  texts = mergeToCount(texts, max);
  const maxCharsEach = Math.max(24, Math.floor((budget / 1000) * CHARS_PER_SEC / Math.max(1, texts.length)));
  texts = splitToCount(texts, Math.min(min, texts.length + 2), maxCharsEach * 2);

  let spoken = texts.reduce((n, t) => n + estimateSpeechMs(t), 0);
  for (let i = 0; i < 5 && spoken > budget; i++) {
    const ratio = budget / spoken;
    texts = texts
      .map((t) => compressToChars(t, Math.max(10, Math.floor(charCount(t) * ratio))))
      .filter(Boolean);
    texts = mergeToCount(texts, max);
    spoken = texts.reduce((n, t) => n + estimateSpeechMs(t), 0);
  }

  const usable = Math.max(800, dur - lead);
  spoken = texts.reduce((n, t) => n + estimateSpeechMs(t), 0);
  const slack = Math.max(0, usable - spoken);
  const gap = texts.length > 1 ? slack / texts.length : slack;

  let t = lead;
  const placed: Cue[] = texts.map((text) => {
    const startMs = Math.round(Math.min(t, Math.max(0, dur - 500)));
    const spokenMs = Math.max(400, estimateSpeechMs(text));
    t = startMs + spokenMs + gap;
    return {
      id: crypto.randomUUID(),
      startMs,
      endMs: startMs + spokenMs,
      text,
    };
  });

  return packCues(placed, dur, 160, lead).map((c) => ({
    ...c,
    startMs: Math.min(c.startMs, Math.max(0, dur - 400)),
  }));
}

export function aiCuesToStudio(
  cues: { startSec: number; text: string }[],
  durationMs: number,
  leadMs = 0,
): Cue[] {
  const mapped: Cue[] = cues.map((c) => ({
    id: crypto.randomUUID(),
    startMs: Math.round(Math.max(0, c.startSec) * 1000),
    text: c.text.trim(),
  }));
  return fitCuesToDuration(mapped, durationMs, leadMs);
}
