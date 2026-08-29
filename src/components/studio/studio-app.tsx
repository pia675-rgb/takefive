import { useEffect, useRef, useState, type RefObject } from "react";
import { getAiStatus } from "@/lib/ai/studio-ai";
import { STEPS, type StepId } from "@/lib/studio/types";
import { narrationSrc, useStudio, videoSrc } from "@/lib/studio/store";
import { cn } from "@/lib/utils";
import { VideoPane, type VideoPaneHandle } from "./video-pane";
import { RecordStage } from "./record-stage";
import { ScriptStage } from "./script-stage";
import { VoiceStage } from "./voice-stage";
import { ExportStage } from "./export-stage";
import { Input } from "@/components/ui/input";

export function StudioApp() {
  const hydrated = useStudio((s) => s.hydrated);
  const hydrate = useStudio((s) => s.hydrate);
  const step = useStudio((s) => s.step);
  const setStep = useStudio((s) => s.setStep);
  const hasVideo = useStudio((s) => s.hasVideo);
  const durationMs = useStudio((s) => s.durationMs);
  const cues = useStudio((s) => s.cues);
  const captions = useStudio((s) => s.captions);
  const mixer = useStudio((s) => s.mixer);
  const hasNarration = useStudio((s) => s.hasNarration);
  const mediaRev = useStudio((s) => s.mediaRev);
  const title = useStudio((s) => s.title);
  const setTitle = useStudio((s) => s.setTitle);

  const [nowMs, setNowMs] = useState(0);
  const [aiOn, setAiOn] = useState(false);
  const player = useRef<VideoPaneHandle>(null);
  const liveHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    void getAiStatus()
      .then((s) => setAiOn(s.available))
      .catch(() => setAiOn(false));
  }, []);

  useEffect(() => {
    if (hydrated && !hasVideo && step !== "record") setStep("record");
  }, [hydrated, hasVideo, step, setStep]);

  const src = hasVideo ? videoSrc() : null;
  const nSrc = hasNarration ? narrationSrc() : null;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-2xl tracking-tight">TAKE FIVE</h1>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            해커톤 시연 스튜디오
          </span>
        </div>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto sm:justify-center">
          {STEPS.map((s, i) => {
            const locked = s.id !== "record" && !hasVideo;
            const active = s.id === step;
            return (
              <button
                key={s.id}
                type="button"
                disabled={locked}
                onClick={() => setStep(s.id)}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-md px-3 text-sm transition-[background-color,color] duration-150 ease-out",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  locked && "opacity-40",
                )}
              >
                <span className="font-mono text-xs tabular-nums">{s.n}</span>
                {s.label}
                {i < STEPS.length - 1 && (
                  <span className="ml-1 hidden text-border sm:inline">/</span>
                )}
              </button>
            );
          })}
        </nav>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 max-w-48 bg-transparent text-sm"
          aria-label="작품 제목"
        />
        <a
          href="/docs/TAKE-FIVE-%EC%82%AC%EC%9A%A9%EC%84%A4%EB%AA%85%EC%84%9C.docx"
          download="TAKE-FIVE-사용설명서.docx"
          className="hidden h-9 shrink-0 items-center rounded-md px-3 text-xs text-muted-foreground hover:text-foreground sm:inline-flex"
        >
          설명서
        </a>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:p-6">
        <section className="min-w-0">
          <div className="relative">
            <VideoPane
              key={mediaRev}
              ref={player}
              src={src}
              durationMs={durationMs}
              cues={cues}
              captions={captions}
              showCaptions={Boolean(mixer.burnSubtitles)}
              narrationUrl={step === "export" || step === "voice" ? nSrc : null}
              muteOriginal={mixer.muteOriginal}
              videoVolume={mixer.videoVolume}
              narrationVolume={mixer.narrationVolume}
              onTime={setNowMs}
              empty={
                <EmptyReel />
              }
            />
            <div
              ref={liveHost}
              className="absolute inset-0 overflow-hidden rounded-lg [&:empty]:hidden [&:empty]:pointer-events-none [&:not(:empty)]:bg-inset"
            />
          </div>
        </section>

        <aside className="min-h-0 rounded-xl bg-card/50 p-4 shadow-[var(--shadow-border)] sm:p-5 lg:overflow-auto">
          <Stage
            step={step}
            nowMs={nowMs}
            player={player}
            liveHost={liveHost}
            aiOn={aiOn}
          />
        </aside>
      </main>
    </div>
  );
}

function Stage({
  step,
  nowMs,
  player,
  liveHost,
  aiOn,
}: {
  step: StepId;
  nowMs: number;
  player: RefObject<VideoPaneHandle | null>;
  liveHost: RefObject<HTMLDivElement | null>;
  aiOn: boolean;
}) {
  if (step === "record") return <RecordStage liveHost={liveHost} />;
  if (step === "script")
    return <ScriptStage nowMs={nowMs} player={player} aiOn={aiOn} />;
  if (step === "voice")
    return <VoiceStage player={player} nowMs={nowMs} aiOn={aiOn} />;
  return <ExportStage nowMs={nowMs} />;
}

function EmptyReel() {
  return (
    <div className="relative size-full min-h-40 bg-inset">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-rec" />
      <div className="absolute left-5 top-5 h-2 w-16 rounded-full bg-secondary" />
      <div className="absolute left-5 top-10 h-2 w-28 rounded-full bg-elevated" />
      <div className="absolute left-5 top-16 h-2 w-20 rounded-full bg-secondary" />
      <div className="absolute bottom-4 right-4 size-16 rounded-full bg-steel/35 shadow-[var(--shadow-border)] sm:size-20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
        <p className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
          5분이면 끝납니다
        </p>
        <p className="text-xs text-muted-foreground sm:text-sm">
          화면을 찍거나, 영상을 올리거나, 샘플로 시작하세요.
        </p>
      </div>
    </div>
  );
}
