import type { Cue } from "./types";
import { fitCuesToDuration } from "./script-fit";

const MAX_CUES = 40;
const MAX_LINE = 400;

export function parseScriptSource(filename: string, raw: string): Cue[] {
  const text = raw.replace(/^\uFEFF/, "").trim();
  if (!text) throw new Error("빈 파일입니다");
  const lower = filename.toLowerCase();
  let cues: Cue[];
  if (lower.endsWith(".srt") || looksSrt(text)) cues = parseSrt(text);
  else if (lower.endsWith(".vtt") || text.startsWith("WEBVTT"))
    cues = parseVtt(text);
  else {
    const timed = parseTimedTxt(text);
    cues = timed.length ? timed : parseParagraphs(text);
  }
  cues = cues
    .map((c) => ({
      ...c,
      text: c.text.replace(/\s+/g, " ").trim().slice(0, MAX_LINE),
    }))
    .filter((c) => c.text.length > 0)
    .slice(0, MAX_CUES);
  if (!cues.length) throw new Error("읽을 줄이 없습니다");
  return cues;
}

export function parseScriptFile(
  filename: string,
  raw: string,
  durationMs: number,
): Cue[] {
  return fitCuesToDuration(parseScriptSource(filename, raw), durationMs);
}

function looksSrt(text: string) {
  return /\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(
    text,
  );
}

function parseSrt(text: string): Cue[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((block) => {
      const lines = block.split(/\r?\n/).filter((l) => l.trim());
      const timeIdx = lines.findIndex((l) => l.includes("-->"));
      if (timeIdx < 0) return null;
      const startMs = parseClock(lines[timeIdx]!.split("-->")[0] ?? "");
      const body = lines.slice(timeIdx + 1).join(" ");
      if (!body.trim()) return null;
      return cue(startMs, body);
    })
    .filter((c): c is Cue => Boolean(c));
}

function parseVtt(text: string): Cue[] {
  const stripped = text.replace(/^WEBVTT[^\n]*\n+/, "");
  return parseSrt(stripped);
}

function parseTimedTxt(text: string): Cue[] {
  const cues: Cue[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(
      /^\s*\[?((?:\d{1,2}:)?\d{1,2}:\d{2}(?:[,.]\d{1,3})?)\]?\s+(.+?)\s*$/,
    );
    if (!m) continue;
    cues.push(cue(parseClock(m[1]!), m[2]!));
  }
  return cues;
}

function parseParagraphs(text: string): Cue[] {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) =>
      b
        .replace(/^\s*\d+[.)]\s+/gm, "")
        .replace(/^\s*[-*]\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
  const parts =
    blocks.length > 1
      ? blocks
      : text
          .split(/\r?\n/)
          .map((l) => l.replace(/^\s*(\d+[.)]|[-*])\s+/, "").trim())
          .filter(Boolean);
  return parts.map((p) => cue(0, p));
}

function cue(startMs: number, text: string): Cue {
  return {
    id: crypto.randomUUID(),
    startMs: Math.max(0, startMs),
    text: text.trim(),
  };
}

function parseClock(raw: string): number {
  const s = raw.trim().replace(",", ".");
  const parts = s.split(":");
  if (parts.length === 3) {
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const sec = Number(parts[2]);
    return Math.round(((h * 60 + m) * 60 + sec) * 1000);
  }
  if (parts.length === 2) {
    const m = Number(parts[0]);
    const sec = Number(parts[1]);
    return Math.round((m * 60 + sec) * 1000);
  }
  const sec = Number(s);
  return Number.isFinite(sec) ? Math.round(sec * 1000) : 0;
}
