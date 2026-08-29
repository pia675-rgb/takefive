import { useEffect, useRef, useState, type RefObject } from "react";
import {
  Camera,
  CircleUser,
  Monitor,
  Square,
  Upload,
  Clapperboard,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LIMIT_MS, WARN_MS, type RecordMode } from "@/lib/studio/types";
import { formatTimecode } from "@/lib/studio/time";
import { isLikelyVideoFile } from "@/lib/studio/media";
import {
  startCameraRecord,
  startScreenRecord,
  type PipCorner,
  type PipShape,
  type PipSize,
  type RecordHandle,
} from "@/lib/studio/record";
import { createSampleVideo } from "@/lib/studio/sample-video";
import { useStudio } from "@/lib/studio/store";

interface RecordStageProps {
  liveHost: RefObject<HTMLDivElement | null>;
}

const CORNERS: { id: Exclude<PipCorner, "off">; label: string }[] = [
  { id: "tl", label: "왼위" },
  { id: "tr", label: "오른위" },
  { id: "bl", label: "왼아래" },
  { id: "br", label: "오른아래" },
];

const VIDEO_ACCEPT = "video/*,.mp4,.mov,.m4v,.webm,.mkv";

export function RecordStage({ liveHost }: RecordStageProps) {
  const applyVideo = useStudio((s) => s.applyVideo);
  const hasVideo = useStudio((s) => s.hasVideo);
  const durationMs = useStudio((s) => s.durationMs);
  const limitMs = useStudio((s) => s.limitMs);
  const resetAll = useStudio((s) => s.resetAll);

  const [withMic, setWithMic] = useState(true);
  const [withFace, setWithFace] = useState(true);
  const [pip, setPip] = useState<Exclude<PipCorner, "off">>("br");
  const [pipShape, setPipShape] = useState<PipShape>("circle");
  const [pipSize, setPipSize] = useState<PipSize>("md");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const handleRef = useRef<RecordHandle | null>(null);
  const timerRef = useRef<number | null>(null);
  const finishingRef = useRef(false);
  const elapsedRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const mountPreview = (el: HTMLCanvasElement | HTMLVideoElement) => {
    const host = liveHost.current;
    if (!host) return;
    host.innerHTML = "";
    el.className = "size-full object-contain";
    host.appendChild(el);
  };

  const begin = async (mode: Exclude<RecordMode, "upload">) => {
    try {
      if (mode === "sample") {
        setBusy("샘플 클립을 만드는 중");
        const { blob, durationMs: sampleMs } = await createSampleVideo(
          () => undefined,
        );
        await applyVideo(blob, "TAKE FIVE 샘플", sampleMs);
        toast.success("샘플 클립을 넣었습니다. 대본부터 이어서 해 보세요.");
        setBusy(null);
        return;
      }

      for (let n = 3; n >= 1; n--) {
        setCountdown(n);
        await sleep(700);
      }
      setCountdown(null);

      const faceOn = mode === "pip" || (mode === "screen" && withFace);
      const handle =
        mode === "camera"
          ? await startCameraRecord(withMic)
          : await startScreenRecord({
              withMic,
              pip: faceOn ? pip : "off",
              pipShape,
              pipSize,
              onShareEnded: () => void finish(),
            });
      handleRef.current = handle;
      mountPreview(handle.preview);
      setRecording(true);
      setElapsed(0);
      elapsedRef.current = 0;
      const t0 = performance.now();
      timerRef.current = window.setInterval(() => {
        const ms = performance.now() - t0;
        elapsedRef.current = ms;
        setElapsed(ms);
        if (ms >= LIMIT_MS) void finish();
      }, 80);
    } catch (err) {
      setCountdown(null);
      setBusy(null);
      const msg = err instanceof Error ? err.message : "녹화를 시작하지 못했습니다";
      toast.error(
        msg.includes("Permission") || msg.includes("NotAllowed")
          ? "권한을 허용해 주세요. 미리보기 창에서는 화면 녹화가 막힐 수 있습니다. 영상을 올리거나 샘플로 먼저 체험해 보세요."
          : msg,
      );
    }
  };

  const finish = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    if (timerRef.current) window.clearInterval(timerRef.current);
    const handle = handleRef.current;
    handleRef.current = null;
    setRecording(false);
    setBusy("영상을 저장하는 중");
    try {
      if (!handle) return;
      const blob = await handle.stop();
      if (blob.size < 1000) throw new Error("녹화된 내용이 없습니다");
      await applyVideo(blob, "시연 녹화", Math.max(elapsedRef.current, 400));
      toast.success("녹화했습니다. 이제 대본을 입히세요.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다");
    } finally {
      finishingRef.current = false;
      setBusy(null);
      setElapsed(0);
      if (liveHost.current) liveHost.current.innerHTML = "";
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!isLikelyVideoFile(file)) {
      toast.error("영상 파일만 올릴 수 있습니다");
      return;
    }
    setBusy("영상을 불러오는 중");
    try {
      await applyVideo(file, file.name);
      toast.success("영상을 올렸습니다");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "영상을 읽지 못했습니다");
    } finally {
      setBusy(null);
    }
  };

  const warn = elapsed >= WARN_MS;
  const overLimit = durationMs > limitMs;

  return (
    <div className="flex flex-col gap-5">
      <header className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          01 · 찍기
        </p>
        <h2 className="font-display text-2xl leading-tight">
          화면을 먼저 찍습니다
        </h2>
        <p className="text-sm text-muted-foreground">
          5분 이내면 됩니다. 준비되면 바로 종료하세요. 말은 나중에 입힙니다.
        </p>
        <p className="text-xs text-muted-foreground">
          이 미리보기 창에서는 화면·카메라 녹화가 막히는 경우가 많습니다. 이미
          찍은 영상을 올리거나 샘플로 먼저 흐름을 타 보세요.
        </p>
      </header>

      {recording ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3">
            <span className="flex items-center gap-2 text-sm">
              <span className="rec-dot size-2.5 rounded-full bg-rec" />
              REC
            </span>
            <span
              className={cn(
                "font-mono text-lg tabular-nums",
                warn && "text-rec",
              )}
            >
              {formatTimecode(elapsed)} / {formatTimecode(LIMIT_MS)}
            </span>
          </div>
          <Progress value={(elapsed / LIMIT_MS) * 100} />
          <Button variant="rec" className="w-full" onClick={() => void finish()}>
            <Square className="size-3 fill-current" />
            녹화 종료
          </Button>
          <p className="text-xs text-muted-foreground">
            언제든 종료할 수 있습니다. 5분이 되면 자동으로 멈춥니다.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <ModeCard
              icon={Monitor}
              title="화면"
              hint={withFace ? "화면 + 얼굴" : "탭 또는 창"}
              onClick={() => void begin("screen")}
              disabled={Boolean(busy)}
            />
            <ModeCard
              icon={Camera}
              title="카메라만"
              hint="얼굴 풀샷"
              onClick={() => void begin("camera")}
              disabled={Boolean(busy)}
            />
            <ModeCard
              icon={Upload}
              title="영상 올리기"
              hint="이미 찍은 파일"
              disabled={Boolean(busy)}
              fileAccept={VIDEO_ACCEPT}
              onFile={(file) => void onFile(file)}
            />
            <ModeCard
              icon={Clapperboard}
              title="샘플"
              hint="얼굴 캠 미리보기"
              onClick={() => void begin("sample")}
              disabled={Boolean(busy)}
            />
          </div>

          <div className="space-y-4 rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="face" className="flex items-center gap-2">
                <CircleUser className="size-4 text-steel" />
                얼굴 같이 찍기
              </Label>
              <Switch
                id="face"
                checked={withFace}
                onCheckedChange={setWithFace}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              유튜브 라이브처럼 화면 한쪽에 촬영자 얼굴을 겹칩니다. 끌 수도
              있습니다.
            </p>
            {withFace && (
              <>
                <LayoutPreview
                  corner={pip}
                  shape={pipShape}
                  size={pipSize}
                />
                <div className="grid gap-2">
                  <p className="text-xs text-muted-foreground">위치</p>
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                    {CORNERS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setPip(c.id)}
                        className={cn(
                          "h-9 rounded-sm text-xs transition-[background-color] duration-150",
                          pip === c.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <ChipRow
                    label="모양"
                    value={pipShape}
                    options={[
                      ["circle", "둥글게"],
                      ["rect", "네모"],
                    ]}
                    onChange={setPipShape}
                  />
                  <ChipRow
                    label="크기"
                    value={pipSize}
                    options={[
                      ["sm", "작게"],
                      ["md", "보통"],
                    ]}
                    onChange={setPipSize}
                  />
                </div>
              </>
            )}
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="mic">마이크 같이 녹음</Label>
              <Switch
                id="mic"
                checked={withMic}
                onCheckedChange={setWithMic}
              />
            </div>
          </div>

          {hasVideo && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                현재 클립 {formatTimecode(durationMs)}
                {overLimit ? " · 5분 이후는 잘라서 내보냅니다" : ""}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  void resetAll();
                  toast("처음부터 다시 시작합니다");
                }}
              >
                클립 버리고 다시
              </Button>
            </div>
          )}
        </>
      )}

      {countdown !== null && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-background/60">
          <span className="font-display text-8xl text-foreground">{countdown}</span>
        </div>
      )}

      {busy && (
        <p className="text-sm text-muted-foreground">{busy}…</p>
      )}
    </div>
  );
}

function LayoutPreview({
  corner,
  shape,
  size,
}: {
  corner: Exclude<PipCorner, "off">;
  shape: PipShape;
  size: PipSize;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-inset shadow-[var(--shadow-border)]">
      <div className="absolute inset-3 rounded-sm bg-secondary" />
      <span className="absolute left-4 top-4 text-xs tracking-wide text-muted-foreground">
        화면
      </span>
      <span
        className={cn(
          "absolute bg-steel/70",
          shape === "circle" ? "rounded-full" : "rounded-md",
          size === "sm" ? "w-1/5" : "w-1/4",
          "aspect-square",
          corner === "br" && "bottom-2 right-2",
          corner === "bl" && "bottom-2 left-2",
          corner === "tr" && "top-2 right-2",
          corner === "tl" && "top-2 left-2",
        )}
      />
    </div>
  );
}

function ChipRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex gap-1">
        {options.map(([id, name]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "h-9 flex-1 rounded-sm text-xs transition-[background-color] duration-150",
              value === id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

function ModeCard({
  icon: Icon,
  title,
  hint,
  onClick,
  disabled,
  fileAccept,
  onFile,
}: {
  icon: typeof Monitor;
  title: string;
  hint: string;
  onClick?: () => void;
  disabled?: boolean;
  fileAccept?: string;
  onFile?: (file: File | undefined) => void;
}) {
  const body = (
    <>
      <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-steel">
        <Icon className="size-4" />
      </span>
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </>
  );
  const className =
    "flex min-h-24 flex-col items-start gap-2 rounded-lg bg-card p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color,scale] duration-150 ease-out hover:shadow-[var(--shadow-border-hover)] hover:bg-elevated active:scale-[0.98]";

  if (onFile && fileAccept) {
    return (
      <label
        className={cn(
          className,
          "cursor-pointer",
          disabled && "pointer-events-none opacity-40",
        )}
      >
        <input
          type="file"
          accept={fileAccept}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            onFile(file);
          }}
        />
        {body}
      </label>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(className, disabled && "opacity-40")}
    >
      {body}
    </button>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
