import { useState } from "react";
import { Captions, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAutoCaptions } from "@/lib/studio/caption-run";
import { useStudio } from "@/lib/studio/store";
import { formatTimecode } from "@/lib/studio/time";
import { cn } from "@/lib/utils";

export function CaptionApplyToggle({ hint = false }: { hint?: boolean }) {
  const on = Boolean(useStudio((s) => s.mixer.burnSubtitles));
  const setMixer = useStudio((s) => s.setMixer);
  return (
    <div className="grid gap-2">
      <p className="text-xs text-muted-foreground">자막</p>
      <div className="flex gap-1">
        {(
          [
            [true, "적용"],
            [false, "미적용"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => setMixer({ burnSubtitles: value })}
            className={cn(
              "h-9 flex-1 rounded-sm text-xs font-medium transition-[background-color] duration-150",
              on === value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground">
          미리보기와 저장 영상에 같이 들어갑니다. 꺼도 자막 파일은 따로 받을 수
          있습니다.
        </p>
      )}
    </div>
  );
}

export function AutoCaptionButton({
  preferNarration,
  className,
}: {
  preferNarration: boolean;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      className={className}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void runAutoCaptions(preferNarration).finally(() => setBusy(false));
      }}
    >
      <Captions />
      {busy ? "자막 만드는 중…" : "자막 자동 생성"}
    </Button>
  );
}

export function CaptionList({
  nowMs,
  showApply = true,
}: {
  nowMs: number;
  showApply?: boolean;
}) {
  const captions = useStudio((s) => s.captions);
  const captionSource = useStudio((s) => s.captionSource);
  const durationMs = useStudio((s) => s.durationMs);
  const burnSubtitles = Boolean(useStudio((s) => s.mixer.burnSubtitles));
  const setMixer = useStudio((s) => s.setMixer);
  const updateCaption = useStudio((s) => s.updateCaption);
  const removeCaption = useStudio((s) => s.removeCaption);
  const setCaptions = useStudio((s) => s.setCaptions);

  if (!captions.length) return null;

  return (
    <div className="flex min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          자막 {captions.length}줄
          {captionSource === "audio"
            ? " · 소리에서"
            : captionSource === "script"
              ? " · 대본에서"
              : ""}
          {burnSubtitles ? " · 적용" : " · 미적용"}
        </p>
        <div className="flex items-center gap-2">
          {showApply && (
            <button
              type="button"
              className="text-xs text-muted-foreground transition-[color] duration-150 hover:text-foreground"
              onClick={() => setMixer({ burnSubtitles: !burnSubtitles })}
            >
              {burnSubtitles ? "끄기" : "적용"}
            </button>
          )}
          <button
            type="button"
            className="text-xs text-muted-foreground transition-[color] duration-150 hover:text-foreground"
            onClick={() => setCaptions([], null)}
          >
            지우기
          </button>
        </div>
      </div>
      <ul className="flex max-h-56 flex-col gap-2 overflow-auto pr-1">
        {captions.map((cap, i) => {
          const end = cap.endMs ?? captions[i + 1]?.startMs ?? durationMs;
          const active = nowMs >= cap.startMs && nowMs < end;
          return (
            <li
              key={cap.id}
              className={cn(
                "rounded-md bg-card p-2.5 shadow-[var(--shadow-border)]",
                active && "shadow-[var(--shadow-border-hover)]",
              )}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-mono text-xs tabular-nums text-steel">
                  {formatTimecode(cap.startMs)}–{formatTimecode(end)}
                </span>
                <button
                  type="button"
                  className="ml-auto rounded-sm p-1 text-muted-foreground transition-[background-color,color] duration-150 hover:bg-secondary hover:text-foreground"
                  onClick={() => removeCaption(cap.id)}
                  aria-label="자막 삭제"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <Textarea
                value={cap.text}
                rows={2}
                onChange={(e) => updateCaption(cap.id, { text: e.target.value })}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
