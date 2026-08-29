import { toast } from "sonner";
import { generateAutoCaptions } from "./auto-captions";
import { useStudio } from "./store";

export async function runAutoCaptions(preferNarration: boolean) {
  const { cues, durationMs, setCaptions, setMixer } = useStudio.getState();
  const toastId = toast.loading("자막을 만드는 중…");
  const result = await generateAutoCaptions({
    cues,
    durationMs,
    preferNarration,
  });
  if (!result.ok) {
    toast.error(result.error, { id: toastId });
    return false;
  }
  setCaptions(result.captions, result.source);
  setMixer({ burnSubtitles: true });
  toast.success(
    result.source === "audio"
      ? `소리에서 자막 ${result.captions.length}줄을 만들었습니다`
      : `대본을 자막 ${result.captions.length}줄로 나눴습니다`,
    { id: toastId },
  );
  return true;
}
