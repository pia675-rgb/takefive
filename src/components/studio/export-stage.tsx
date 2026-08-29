import { useState } from "react";
import { Download, FileText, Subtitles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { mixAndExport } from "@/lib/studio/export-mix";
import { burnTrack } from "@/lib/studio/captions";
import { getNarrationBlob, getVideoBlob } from "@/lib/studio/media";
import { useStudio } from "@/lib/studio/store";
import { cuesToSrt, downloadBlob, formatTimecode, slugify } from "@/lib/studio/time";
import { AutoCaptionButton, CaptionApplyToggle, CaptionList } from "./caption-tools";

export function ExportStage({ nowMs }: { nowMs: number }) {
  const title = useStudio((s) => s.title);
  const cues = useStudio((s) => s.cues);
  const captions = useStudio((s) => s.captions);
  const durationMs = useStudio((s) => s.durationMs);
  const trimStartMs = useStudio((s) => s.trimStartMs);
  const trimEndMs = useStudio((s) => s.trimEndMs);
  const setTrim = useStudio((s) => s.setTrim);
  const mixer = useStudio((s) => s.mixer);
  const setMixer = useStudio((s) => s.setMixer);
  const hasNarration = useStudio((s) => s.hasNarration);
  const narrationKind = useStudio((s) => s.narrationKind);

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const span = Math.max(0, trimEndMs - trimStartMs);
  const track = burnTrack(captions, cues);

  const exportVideo = async () => {
    const video = getVideoBlob();
    if (!video) {
      toast.error("영상이 없습니다");
      return;
    }
    setBusy(true);
    setProgress(0);
    try {
      const { blob, ext } = await mixAndExport({
        videoBlob: video,
        narrationBlob: hasNarration ? getNarrationBlob() : null,
        cues: mixer.burnSubtitles ? track : [],
        durationMs,
        trimStartMs,
        trimEndMs,
        videoVolume: mixer.videoVolume,
        narrationVolume: mixer.narrationVolume,
        muteOriginal: mixer.muteOriginal,
        burnSubtitles: mixer.burnSubtitles,
        onProgress: (p) => setProgress(Math.round(p * 100)),
      });
      downloadBlob(blob, `${slugify(title)}.${ext}`);
      toast.success(
        ext === "mp4" ? "MP4로 저장했습니다" : "WebM으로 저장했습니다",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "내보내기에 실패했습니다");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const exportSrt = () => {
    const srt = cuesToSrt(track, durationMs);
    downloadBlob(new Blob([srt], { type: "text/plain;charset=utf-8" }), `${slugify(title)}.srt`);
    toast.success("자막 파일을 저장했습니다");
  };

  const exportScript = () => {
    const body = cues
      .map((c) => `[${formatTimecode(c.startMs)}] ${c.text}`)
      .join("\n\n");
    downloadBlob(
      new Blob([`${title}\n\n${body}\n`], { type: "text/plain;charset=utf-8" }),
      `${slugify(title)}-script.txt`,
    );
  };

  return (
    <div className="flex min-h-0 flex-col gap-5">
      <header className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          04 · 내보내기
        </p>
        <h2 className="font-display text-2xl leading-tight">
          섞어서 저장합니다
        </h2>
        <p className="text-sm text-muted-foreground">
          {hasNarration
            ? narrationKind === "ai"
              ? "AI 목소리가 영상 위에 얹힙니다."
              : "녹음한 목소리가 영상 위에 얹힙니다."
            : "나레이션 없이 영상만 잘라 저장할 수 있습니다."}
        </p>
      </header>

      <div className="space-y-4 rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="mute">원본 소리 끄기</Label>
          <Switch
            id="mute"
            checked={mixer.muteOriginal}
            onCheckedChange={(v) => setMixer({ muteOriginal: v })}
          />
        </div>
        {!mixer.muteOriginal && (
          <div className="grid gap-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>원본 볼륨</span>
              <span className="font-mono tabular-nums">
                {Math.round(mixer.videoVolume * 100)}%
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={[mixer.videoVolume]}
              onValueChange={([v]) => setMixer({ videoVolume: v ?? 0 })}
            />
          </div>
        )}
        <div className="grid gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>나레이션 볼륨</span>
            <span className="font-mono tabular-nums">
              {Math.round(mixer.narrationVolume * 100)}%
            </span>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={[mixer.narrationVolume]}
            onValueChange={([v]) => setMixer({ narrationVolume: v ?? 1 })}
            disabled={!hasNarration}
          />
        </div>
        <CaptionApplyToggle hint />
        <AutoCaptionButton preferNarration className="w-full" />
        <CaptionList nowMs={nowMs} showApply={false} />
      </div>

      <div className="space-y-3 rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
        <div className="flex justify-between text-xs text-muted-foreground">
          <Label>자르기</Label>
          <span className="font-mono tabular-nums">
            {formatTimecode(trimStartMs)} – {formatTimecode(trimEndMs)} ·{" "}
            {formatTimecode(span)}
          </span>
        </div>
        <Slider
          min={0}
          max={durationMs}
          step={100}
          value={[trimStartMs, trimEndMs]}
          onValueChange={([a, b]) =>
            setTrim(Math.min(a ?? 0, b ?? 0), Math.max(a ?? 0, b ?? 0))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button disabled={busy} onClick={() => void exportVideo()}>
          <Download />
          {busy ? "섞는 중…" : "MP4로 저장"}
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={exportSrt} disabled={!track.length}>
            <Subtitles />
            자막 SRT
          </Button>
          <Button variant="outline" onClick={exportScript} disabled={!cues.length}>
            <FileText />
            대본 TXT
          </Button>
        </div>
      </div>
      {busy && <Progress value={progress} />}
      <p className="text-xs text-muted-foreground">
        기본 저장은 MP4입니다. 이 브라우저가 못 만들면 WebM으로 내려갑니다.
      </p>
    </div>
  );
}
