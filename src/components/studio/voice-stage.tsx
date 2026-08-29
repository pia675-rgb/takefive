import { useEffect, useRef, useState, type RefObject } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  DEFAULT_FEMALE_VOICE_ID,
  DEFAULT_VOICE_ID,
  VOICES,
  type VoiceGender,
  voiceGender,
  voicesByGender,
} from "@/lib/studio/types";
import { synthesizeSpeech } from "@/lib/ai/studio-ai";
import {
  audioDurationMs,
  base64ToBlob,
  pickRecorderMime,
  stitchCueAudio,
} from "@/lib/studio/media";
import { useStudio } from "@/lib/studio/store";
import { formatTimecode, packCues } from "@/lib/studio/time";
import type { VideoPaneHandle } from "./video-pane";
import { AutoCaptionButton, CaptionList } from "./caption-tools";

interface VoiceStageProps {
  player: RefObject<VideoPaneHandle | null>;
  nowMs: number;
  aiOn: boolean;
}

export function VoiceStage({ player, nowMs, aiOn }: VoiceStageProps) {
  const cues = useStudio((s) => s.cues);
  const voiceId = useStudio((s) => s.voiceId);
  const voiceSpeed = useStudio((s) => s.voiceSpeed);
  const setVoice = useStudio((s) => s.setVoice);
  const applyNarration = useStudio((s) => s.applyNarration);
  const retimeCues = useStudio((s) => s.retimeCues);
  const hasNarration = useStudio((s) => s.hasNarration);
  const narrationKind = useStudio((s) => s.narrationKind);
  const durationMs = useStudio((s) => s.durationMs);
  const setStep = useStudio((s) => s.setStep);

  const [tab, setTab] = useState<"ai" | "mic">(
    narrationKind === "mic" ? "mic" : "ai",
  );
  const [gender, setGender] = useState<VoiceGender>(() => voiceGender(voiceId));
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewRef = useRef<{ audio: HTMLAudioElement; url: string } | null>(
    null,
  );

  const stopPreview = () => {
    const prev = previewRef.current;
    if (!prev) return;
    prev.audio.pause();
    prev.audio.removeAttribute("src");
    prev.audio.load();
    URL.revokeObjectURL(prev.url);
    previewRef.current = null;
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) window.clearInterval(timerRef.current);
      const prev = previewRef.current;
      if (prev) {
        prev.audio.pause();
        URL.revokeObjectURL(prev.url);
        previewRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!VOICES.some((v) => v.id === voiceId)) {
      setVoice(DEFAULT_VOICE_ID);
      setGender("male");
    }
  }, [voiceId, setVoice]);

  const lines = cues.filter((c) => c.text.trim());
  const roster = voicesByGender(gender);

  const pickGender = (next: VoiceGender) => {
    setGender(next);
    const list = voicesByGender(next);
    if (!list.some((v) => v.id === voiceId)) {
      setVoice(next === "female" ? DEFAULT_FEMALE_VOICE_ID : DEFAULT_VOICE_ID);
    }
  };

  const generateAi = async () => {
    if (!aiOn) {
      toast.error("AI 목소리를 사용할 수 없습니다");
      return;
    }
    if (!lines.length) {
      toast.error("대본이 비어 있습니다");
      return;
    }
    stopPreview();
    setBusy("나레이션을 만드는 중");
    setProgress(0);
    try {
      const packed = packCues(lines, durationMs);
      retimeCues(packed);
      const parts: { startMs: number; blob: Blob }[] = [];
      for (let i = 0; i < packed.length; i++) {
        const cue = packed[i]!;
        const res = await synthesizeSpeech({
          data: {
            text: cue.text,
            voiceId,
            speed: voiceSpeed,
          },
        });
        if (!res.ok) throw new Error(res.error);
        parts.push({
          startMs: cue.startMs,
          blob: base64ToBlob(res.base64, res.mime),
        });
        setProgress(((i + 1) / packed.length) * 100);
      }
      const { blob: stitched, startsMs } = await stitchCueAudio(parts, durationMs);
      const dur = await audioDurationMs(stitched);
      retimeCues(
        packed.map((c, i) => ({
          ...c,
          startMs: startsMs[i] ?? c.startMs,
        })),
      );
      await applyNarration(stitched, "ai", dur);
      toast.success("AI 나레이션을 입혔습니다");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "음성 생성에 실패했습니다");
    } finally {
      setBusy(null);
      setProgress(0);
    }
  };

  const previewVoice = async () => {
    if (!aiOn) return;
    stopPreview();
    setBusy("샘플을 듣는 중");
    try {
      const res = await synthesizeSpeech({
        data: {
          text: "해커톤 시연, 오 분이면 충분합니다.",
          voiceId,
          speed: voiceSpeed,
        },
      });
      if (!res.ok) throw new Error(res.error);
      const blob = base64ToBlob(res.base64, res.mime);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      previewRef.current = { audio, url };
      audio.onended = () => {
        if (previewRef.current?.audio === audio) stopPreview();
      };
      await audio.play();
    } catch (err) {
      stopPreview();
      toast.error(err instanceof Error ? err.message : "미리듣기에 실패했습니다");
    } finally {
      setBusy(null);
    }
  };

  const startMic = async () => {
    try {
      stopPreview();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickRecorderMime("audio");
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recRef.current = rec;
      rec.start(100);
      setRecording(true);
      setElapsed(0);
      player.current?.seek(0);
      void player.current?.play();
      const t0 = performance.now();
      timerRef.current = window.setInterval(() => {
        setElapsed(performance.now() - t0);
      }, 80);
    } catch {
      toast.error(
        "마이크 권한이 필요합니다. 미리보기에서는 막힐 수 있습니다.",
      );
    }
  };

  const stopMic = async () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    const rec = recRef.current;
    recRef.current = null;
    setRecording(false);
    player.current?.pause();
    setBusy("녹음을 저장하는 중");
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        if (!rec) {
          reject(new Error("녹음이 없습니다"));
          return;
        }
        rec.onstop = () =>
          resolve(
            new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" }),
          );
        rec.onerror = () => reject(new Error("녹음에 실패했습니다"));
        if (rec.state === "recording") rec.stop();
        else resolve(new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" }));
      });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (blob.size < 200) throw new Error("녹음이 너무 짧습니다");
      const dur = await audioDurationMs(blob);
      await applyNarration(blob, "mic", dur);
      toast.success("내 목소리를 입혔습니다");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다");
    } finally {
      setBusy(null);
    }
  };

  const activeText =
    lines.find((c, i) => {
      const end = lines[i + 1]?.startMs ?? durationMs;
      return nowMs >= c.startMs && nowMs < end;
    })?.text ?? lines[0]?.text ?? "";

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <header className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          03 · 목소리
        </p>
        <h2 className="font-display text-2xl leading-tight">
          나레이션을 입힙니다
        </h2>
        <p className="text-sm text-muted-foreground">
          AI 목소리로 생성하거나, 영상을 보며 직접 읽습니다.
        </p>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "ai" | "mic")}>
        <TabsList className="w-full">
          <TabsTrigger value="ai">AI 목소리</TabsTrigger>
          <TabsTrigger value="mic">내가 읽기</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid gap-1.5">
            <Label>성별</Label>
            <div className="flex gap-1">
              {(
                [
                  ["female", "여자"],
                  ["male", "남자"],
                ] as const
              ).map(([id, name]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickGender(id)}
                  className={cn(
                    "h-9 flex-1 rounded-sm text-xs font-medium transition-[background-color] duration-150",
                    gender === id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>목소리</Label>
            <Select value={voiceId} onValueChange={(v) => setVoice(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roster.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name} · {v.hint}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <Label>속도</Label>
              <span className="font-mono tabular-nums">
                {voiceSpeed.toFixed(2)}×
              </span>
            </div>
            <Slider
              min={0.7}
              max={1.5}
              step={0.05}
              value={[voiceSpeed]}
              onValueChange={([v]) => setVoice(voiceId, v ?? 1)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!aiOn || Boolean(busy)}
              onClick={() => void previewVoice()}
            >
              <Volume2 />
              들어보기
            </Button>
            <Button
              className="flex-1"
              disabled={!aiOn || Boolean(busy) || !lines.length}
              onClick={() => void generateAi()}
            >
              {busy ? "생성 중…" : "전체에 입히기"}
            </Button>
          </div>
          {!aiOn && (
            <p className="text-xs text-muted-foreground">
              이 환경에서는 AI 목소리를 쓸 수 없습니다. 직접 읽기로 진행하세요.
            </p>
          )}
          {busy && <Progress value={progress} />}
        </TabsContent>

        <TabsContent value="mic" className="space-y-4">
          <div className="rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
            <p className="text-xs text-muted-foreground">지금 읽을 줄</p>
            <p className="mt-2 font-display text-xl leading-snug">
              {activeText || "대본이 없습니다. 이전 단계에서 줄을 적어 주세요."}
            </p>
          </div>
          {recording ? (
            <Button variant="rec" className="w-full" onClick={() => void stopMic()}>
              <Square className="size-3 fill-current" />
              녹음 끝내기 · {formatTimecode(elapsed)}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  player.current?.seek(0);
                  void player.current?.play();
                }}
              >
                리허설
              </Button>
              <Button className="flex-1" variant="rec" onClick={() => void startMic()}>
                <Mic />
                영상과 함께 녹음
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            텔레프롬프터가 현재 줄을 보여 줍니다. 리허설은 녹화하지 않습니다.
          </p>
        </TabsContent>
      </Tabs>

      {hasNarration && (
        <div className="flex flex-col gap-2">
          <AutoCaptionButton preferNarration />
          <CaptionList nowMs={nowMs} />
          <Button variant="secondary" onClick={() => setStep("export")}>
            입혀둔 목소리로 내보내기
          </Button>
        </div>
      )}
    </div>
  );
}
