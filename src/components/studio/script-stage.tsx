import { useMemo, useState, type ReactNode, type RefObject } from "react";
import { Plus, Sparkles, Trash2, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { generateScript } from "@/lib/ai/studio-ai";
import { parseScriptFile } from "@/lib/studio/script-file";
import { useStudio } from "@/lib/studio/store";
import { hackathonBeats } from "@/lib/studio/templates";
import { estimateSpeechMs, formatTimecode, overlappingCueIds, packCues } from "@/lib/studio/time";
import { AutoCaptionButton, CaptionList } from "./caption-tools";
import type { VideoPaneHandle } from "./video-pane";

interface ScriptStageProps {
  nowMs: number;
  player: RefObject<VideoPaneHandle | null>;
  aiOn: boolean;
}

const SCRIPT_ACCEPT = ".txt,.srt,.vtt,.md,text/plain";

export function ScriptStage({ nowMs, player, aiOn }: ScriptStageProps) {
  const cues = useStudio((s) => s.cues);
  const durationMs = useStudio((s) => s.durationMs);
  const brief = useStudio((s) => s.brief);
  const setBrief = useStudio((s) => s.setBrief);
  const setCues = useStudio((s) => s.setCues);
  const packSpeech = useStudio((s) => s.packSpeech);
  const addCue = useStudio((s) => s.addCue);
  const updateCue = useStudio((s) => s.updateCue);
  const removeCue = useStudio((s) => s.removeCue);
  const setStep = useStudio((s) => s.setStep);
  const title = useStudio((s) => s.title);

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const spoken = useMemo(
    () => cues.reduce((n, c) => n + estimateSpeechMs(c.text), 0),
    [cues],
  );
  const over = spoken > durationMs + 800;
  const clashes = useMemo(() => overlappingCueIds(cues), [cues]);

  const fillTemplate = () => {
    setCues(packCues(hackathonBeats(durationMs), durationMs));
    toast("5분 피치 뼈대를 넣었습니다. 문장만 바꾸면 됩니다.");
  };

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.(txt|srt|vtt|md)$/i.test(file.name) && file.type && !file.type.startsWith("text/")) {
      toast.error("txt, srt, vtt 파일만 올릴 수 있습니다");
      return;
    }
    try {
      const raw = await file.text();
      const next = parseScriptFile(file.name, raw, durationMs);
      setCues(next);
      toast.success(`대본 ${next.length}줄을 올렸습니다`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "대본을 읽지 못했습니다");
    }
  };

  const generate = async () => {
    setBusy(true);
    try {
      const res = await generateScript({
        data: {
          ...brief,
          name: brief.name || title,
          durationSec: Math.max(3, durationMs / 1000),
        },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setCues(
        packCues(
          res.cues.map((c) => ({
            id: crypto.randomUUID(),
            startMs: Math.round(c.startSec * 1000),
            text: c.text,
          })),
          durationMs,
        ),
      );
      setOpen(false);
      toast.success("대본을 썼습니다. 타임코드를 만져 화면과 맞추세요.");
    } catch {
      toast.error("대본 생성에 실패했습니다");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <header className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground">
          02 · 대본
        </p>
        <h2 className="font-display text-2xl leading-tight">
          화면에 맞춰 말을 적습니다
        </h2>
        <p className="text-sm text-muted-foreground">
          줄을 누르면 그 시각으로 이동합니다. txt·srt·vtt 대본을 올릴 수 있습니다.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => addCue(nowMs)}
        >
          <Plus />
          {formatTimecode(nowMs)}에 큐
        </Button>
        <Button size="sm" variant="outline" onClick={fillTemplate}>
          <Wand2 />
          5분 뼈대
        </Button>
        <Button size="sm" variant="outline" asChild>
          <label className="cursor-pointer">
            <input
              type="file"
              accept={SCRIPT_ACCEPT}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                void onUpload(file);
              }}
            />
            <Upload />
            대본 올리기
          </label>
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!aiOn}
          onClick={() => setOpen(true)}
        >
          <Sparkles />
          AI로 쓰기
        </Button>
        <AutoCaptionButton preferNarration={false} />
      </div>

      <CaptionList nowMs={nowMs} />

      <p
        className={cn(
          "font-mono text-xs tabular-nums",
          over ? "text-rec" : "text-muted-foreground",
        )}
      >
        예상 발화 {formatTimecode(spoken)} / 영상 {formatTimecode(durationMs)}
        {over ? " · 조금 줄여 주세요" : ""}
        {clashes.size ? " · 말이 겹칩니다" : ""}
      </p>
      {clashes.size > 0 && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            packSpeech();
            toast("겹치지 않게 간격을 맞췄습니다");
          }}
        >
          겹침 풀기
        </Button>
      )}

      <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pr-1">
        {cues.length === 0 && (
          <li className="rounded-lg bg-card px-4 py-8 text-center text-sm text-muted-foreground shadow-[var(--shadow-border)]">
            아직 줄이 없습니다. 뼈대를 넣거나, 영상을 보다가 큐를 꽂으세요.
          </li>
        )}
        {cues.map((cue, i) => {
          const active =
            nowMs >= cue.startMs &&
            nowMs < (cues[i + 1]?.startMs ?? durationMs);
          return (
            <li
              key={cue.id}
              className={cn(
                "rounded-lg bg-card p-3 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150",
                active && "shadow-[var(--shadow-border-hover)]",
                clashes.has(cue.id) && "outline outline-1 outline-rec/50",
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <button
                  type="button"
                  className="font-mono text-xs tabular-nums text-steel"
                  onClick={() => player.current?.seek(cue.startMs)}
                >
                  {formatTimecode(cue.startMs)}
                </button>
                <span className="text-xs text-muted-foreground">
                  {formatTimecode(estimateSpeechMs(cue.text))}
                </span>
                <button
                  type="button"
                  className="ml-auto rounded-sm p-1.5 text-muted-foreground transition-[background-color,color] duration-150 hover:bg-secondary hover:text-foreground"
                  onClick={() => removeCue(cue.id)}
                  aria-label="줄 삭제"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              {clashes.has(cue.id) && (
                <p className="mb-2 text-xs text-rec">다음 줄과 말이 겹칩니다</p>
              )}
              <Textarea
                value={cue.text}
                rows={3}
                placeholder="이 장면에서 할 말"
                onChange={(e) => updateCue(cue.id, { text: e.target.value })}
                onFocus={() => player.current?.seek(cue.startMs)}
              />
            </li>
          );
        })}
      </ul>

      <Button
        disabled={!cues.some((c) => c.text.trim())}
        onClick={() => setStep("voice")}
      >
        목소리로
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>작품만 알려 주세요</DialogTitle>
            <DialogDescription>
              영상 길이에 맞춰 한국어 나레이션 큐를 씁니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Field label="작품 이름">
              <Input
                value={brief.name}
                onChange={(e) => setBrief({ name: e.target.value })}
                placeholder={title}
              />
            </Field>
            <Field label="문제">
              <Textarea
                rows={2}
                value={brief.problem}
                onChange={(e) => setBrief({ problem: e.target.value })}
                placeholder="누가, 무엇이 불편한지"
              />
            </Field>
            <Field label="솔루션">
              <Textarea
                rows={2}
                value={brief.solution}
                onChange={(e) => setBrief({ solution: e.target.value })}
                placeholder="우리가 만든 것"
              />
            </Field>
            <Field label="데모에서 보여줄 것">
              <Textarea
                rows={2}
                value={brief.demo}
                onChange={(e) => setBrief({ demo: e.target.value })}
                placeholder="클릭 동선, 핵심 화면"
              />
            </Field>
            <Field label="말투">
              <div className="flex gap-1">
                {(
                  [
                    ["plain", "담백"],
                    ["serious", "진지"],
                    ["light", "경쾌"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setBrief({ tone: id })}
                    className={cn(
                      "h-9 flex-1 rounded-sm text-xs font-medium transition-[background-color] duration-150",
                      brief.tone === id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              닫기
            </Button>
            <Button disabled={busy} onClick={() => void generate()}>
              {busy ? "쓰는 중…" : "대본 받기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
