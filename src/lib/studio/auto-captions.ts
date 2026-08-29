import { transcribeAudio } from "@/lib/ai/studio-ai";
import {
  captionsFromCues,
  textToCaptions,
  wordsToCaptions,
  type SttWord,
} from "./captions";
import {
  blobToBase64,
  extractAudioForStt,
  getNarrationBlob,
  getVideoBlob,
} from "./media";
import type { CaptionSource, Cue } from "./types";

export async function generateAutoCaptions(opts: {
  cues: Cue[];
  durationMs: number;
  preferNarration: boolean;
}): Promise<
  | { ok: true; captions: Cue[]; source: CaptionSource }
  | { ok: false; error: string }
> {
  const media = opts.preferNarration
    ? getNarrationBlob() ?? getVideoBlob()
    : getVideoBlob() ?? getNarrationBlob();

  if (media) {
    try {
      const extracted = await extractAudioForStt(media);
      const b64 = await blobToBase64(extracted.blob);
      if (b64.length > 17_000_000) {
        return { ok: false, error: "소리가 너무 깁니다. 5분 안으로 잘라 주세요." };
      }
      const res = await transcribeAudio({
        data: { base64: b64, mime: extracted.mime },
      });
      if (res.ok) {
        const fromWords = wordsToCaptions(res.words as SttWord[]);
        const captions = fromWords.length
          ? fromWords
          : textToCaptions(res.text, opts.durationMs);
        if (captions.length) {
          return { ok: true, captions, source: "audio" };
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg !== "silent") {
        // fall through to script
      }
    }
  }

  const fromScript = captionsFromCues(opts.cues, opts.durationMs);
  if (fromScript.length) {
    return { ok: true, captions: fromScript, source: "script" };
  }
  return {
    ok: false,
    error: "자막을 만들 소리도, 나눌 대본도 없습니다.",
  };
}
