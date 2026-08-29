import type { Cue } from "./types";
import { cueWindows } from "./time";

export type SttWord = { text: string; start: number; end: number };

const MAX_CHARS = 20;
const MIN_BREAK = 8;
const MAX_MS = 4200;
const PAUSE_MS = 380;
const MAX_LINES = 80;

const TOKEN_RE = /[A-Za-z0-9]+|[가-힣]+|[.,!?。！？、，;:…]+|\s+|./gu;
const PUNCT_ONLY = /^[.,!?。！？、，;:…]+$/;
const SOFT_END = /[,.!?。！？、，;:…]$/;

export function wordsToCaptions(words: SttWord[]): Cue[] {
  const cues: Cue[] = [];
  let buf: SttWord[] = [];

  const flush = () => {
    if (!buf.length) return;
    const text = joinWords(buf.map((w) => w.text));
    if (!text) {
      buf = [];
      return;
    }
    cues.push({
      id: crypto.randomUUID(),
      startMs: Math.round(buf[0]!.start * 1000),
      endMs: Math.round(buf[buf.length - 1]!.end * 1000),
      text,
    });
    buf = [];
  };

  for (const w of words) {
    if (!w.text.trim()) continue;
    if (buf.length) {
      const gap = (w.start - buf[buf.length - 1]!.end) * 1000;
      const chars = visibleLen(joinWords([...buf, w].map((x) => x.text)));
      const span = (w.end - buf[0]!.start) * 1000;
      if (gap >= PAUSE_MS || chars > MAX_CHARS || span > MAX_MS) flush();
    }
    buf.push(w);
  }
  flush();
  return expandCues(cues).slice(0, MAX_LINES);
}

export function captionsFromCues(cues: Cue[], durationMs: number): Cue[] {
  const windows = cueWindows(
    cues.filter((c) => c.text.trim()),
    durationMs,
  );
  const out: Cue[] = [];
  for (const w of windows) {
    out.push(...timedSplit(w.text, w.startMs, w.endMs));
  }
  return out.slice(0, MAX_LINES);
}

export function textToCaptions(text: string, durationMs: number): Cue[] {
  return timedSplit(text, 0, Math.max(1000, durationMs)).slice(0, MAX_LINES);
}

export function burnTrack(captions: Cue[], cues: Cue[]): Cue[] {
  const fromCaps = captions.filter((c) => c.text.trim());
  if (fromCaps.length) return fromCaps;
  return cues.filter((c) => c.text.trim());
}

export function splitCaption(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const chunks = cleaned
    .split(/(?<=[.!?。！？])\s+/)
    .flatMap((part) => wrapLine(part.trim(), MAX_CHARS))
    .filter((s) => s && !PUNCT_ONLY.test(s));
  return chunks.length ? chunks : [cleaned];
}

function timedSplit(text: string, startMs: number, endMs: number): Cue[] {
  const parts = splitCaption(text);
  if (!parts.length) return [];
  const weights = parts.map((p) => Math.max(1, visibleLen(p)));
  const total = weights.reduce((a, b) => a + b, 0);
  const span = Math.max(800, endMs - startMs);
  let t = startMs;
  return parts.map((line, i) => {
    const dur = (span * weights[i]!) / total;
    const cue: Cue = {
      id: crypto.randomUUID(),
      startMs: Math.round(t),
      endMs: Math.round(t + dur),
      text: line,
    };
    t += dur;
    return cue;
  });
}

function expandCues(cues: Cue[]): Cue[] {
  const out: Cue[] = [];
  for (const cue of cues) {
    const parts = splitCaption(cue.text);
    if (parts.length <= 1) {
      out.push({ ...cue, text: parts[0] ?? cue.text });
      continue;
    }
    out.push(
      ...timedSplit(cue.text, cue.startMs, cue.endMs ?? cue.startMs + 1000),
    );
  }
  return out;
}

function wrapLine(text: string, max: number): string[] {
  if (!text) return [];
  if (visibleLen(text) <= max) return [text];
  const tokens = text.match(TOKEN_RE) ?? [text];
  const lines: string[] = [];
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

function coalesce(lines: string[], max: number): string[] {
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.replace(/\s+/g, " ").trim();
    if (!line) continue;
    if (PUNCT_ONLY.test(line)) {
      if (out.length) out[out.length - 1] += line;
      continue;
    }
    const n = visibleLen(line);
    if (out.length && n <= 2) {
      const prev = out[out.length - 1]!;
      if (visibleLen(prev) + n <= max + 2) {
        out[out.length - 1] = `${prev}${line}`;
        continue;
      }
    }
    out.push(line);
  }
  return out;
}

function visibleLen(s: string): number {
  return [...s].filter((c) => c !== " ").length;
}

function joinWords(words: string[]): string {
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
