import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Cue } from "@/lib/studio/types";
import { cueWindows, formatTimecode } from "@/lib/studio/time";

export type VideoPaneHandle = {
  play: () => void;
  pause: () => void;
  seek: (ms: number) => void;
  toggle: () => void;
  getEl: () => HTMLVideoElement | null;
};

interface VideoPaneProps {
  src: string | null;
  durationMs: number;
  cues?: Cue[];
  captions?: Cue[];
  showCaptions?: boolean;
  narrationUrl?: string | null;
  muteOriginal?: boolean;
  videoVolume?: number;
  narrationVolume?: number;
  onTime?: (ms: number) => void;
  overlay?: ReactNode;
  empty?: ReactNode;
  className?: string;
}

export const VideoPane = forwardRef<VideoPaneHandle, VideoPaneProps>(
  function VideoPane(
    {
      src,
      durationMs,
      cues = [],
      captions,
      showCaptions = false,
      narrationUrl,
      muteOriginal = false,
      videoVolume = 1,
      narrationVolume = 1,
      onTime,
      overlay,
      empty,
      className,
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [t, setT] = useState(0);
    const barRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      play: () => void videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      seek: (ms) => {
        if (videoRef.current) videoRef.current.currentTime = ms / 1000;
        if (audioRef.current) audioRef.current.currentTime = ms / 1000;
        setT(ms);
        onTime?.(ms);
      },
      toggle: () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) void v.play();
        else v.pause();
      },
      getEl: () => videoRef.current,
    }));

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = muteOriginal;
      v.volume = muteOriginal ? 0 : videoVolume;
    }, [muteOriginal, videoVolume, src]);

    useEffect(() => {
      const a = audioRef.current;
      if (a) a.volume = narrationVolume;
    }, [narrationVolume, narrationUrl]);

    useEffect(() => {
      const v = videoRef.current;
      const a = audioRef.current;
      if (!v) return;
      const sync = () => {
        const ms = v.currentTime * 1000;
        setT(ms);
        onTime?.(ms);
      };
      const onPlay = () => {
        setPlaying(true);
        if (a && narrationUrl) {
          a.currentTime = v.currentTime;
          void a.play();
        }
      };
      const onPause = () => {
        setPlaying(false);
        a?.pause();
      };
      const onSeek = () => {
        if (a) a.currentTime = v.currentTime;
        sync();
      };
      v.addEventListener("timeupdate", sync);
      v.addEventListener("play", onPlay);
      v.addEventListener("pause", onPause);
      v.addEventListener("seeked", onSeek);
      v.addEventListener("ended", onPause);
      return () => {
        v.removeEventListener("timeupdate", sync);
        v.removeEventListener("play", onPlay);
        v.removeEventListener("pause", onPause);
        v.removeEventListener("seeked", onSeek);
        v.removeEventListener("ended", onPause);
      };
    }, [narrationUrl, onTime, src]);

    const windows = cueWindows(cues, durationMs);
    const capWindows = cueWindows(captions?.length ? captions : cues, durationMs);
    const activeCap = capWindows.find((c) => t >= c.startMs && t < c.endMs);
    const dur = durationMs || 1;

    const scrub = (clientX: number) => {
      const bar = barRef.current;
      const v = videoRef.current;
      if (!bar || !v) return;
      const r = bar.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const ms = p * durationMs;
      v.currentTime = ms / 1000;
      if (audioRef.current) audioRef.current.currentTime = ms / 1000;
      setT(ms);
      onTime?.(ms);
    };

    return (
      <div className={cn("flex min-h-0 flex-col gap-3", className)}>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-inset shadow-[var(--shadow-border)]">
          {src ? (
            <video
              ref={videoRef}
              src={src}
              className="size-full object-contain outline outline-1 -outline-offset-1 outline-foreground/10"
              playsInline
              preload="auto"
              onLoadedData={(e) => {
                const v = e.currentTarget;
                if (v.currentTime === 0) v.currentTime = 0.05;
              }}
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              {empty}
            </div>
          )}
          {overlay}
          {src && (
            <button
              type="button"
              className="absolute inset-0 z-[1] flex items-center justify-center bg-transparent"
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (v.paused) void v.play();
                else v.pause();
              }}
              aria-label={playing ? "일시정지" : "재생"}
            >
              {!playing && (
                <span className="flex size-14 items-center justify-center rounded-full bg-background/70 text-foreground shadow-[var(--shadow-border)]">
                  <Play className="ml-0.5 size-6" />
                </span>
              )}
            </button>
          )}
          {src && showCaptions && activeCap?.text && (
            <div className="pointer-events-none absolute inset-x-4 bottom-3 z-[2] flex justify-center">
              <span className="max-w-[90%] rounded-md bg-background/75 px-3 py-1.5 text-center text-sm font-medium leading-snug text-foreground shadow-[var(--shadow-border)]">
                {activeCap.text}
              </span>
            </div>
          )}
        </div>

        {src && (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="icon-sm"
              variant="secondary"
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (v.paused) void v.play();
                else v.pause();
              }}
              aria-label={playing ? "일시정지" : "재생"}
            >
              {playing ? <Pause /> : <Play className="ml-0.5" />}
            </Button>
            <div
              ref={barRef}
              className="relative h-8 flex-1 cursor-pointer"
              onPointerDown={(e) => {
                (e.target as HTMLElement).setPointerCapture(e.pointerId);
                scrub(e.clientX);
              }}
              onPointerMove={(e) => {
                if (e.buttons) scrub(e.clientX);
              }}
            >
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, (t / dur) * 100)}%` }}
                />
              </div>
              {windows.map((c) => (
                <span
                  key={c.id}
                  className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel"
                  style={{ left: `${(c.startMs / dur) * 100}%` }}
                />
              ))}
            </div>
            <span className="min-w-20 text-right font-mono text-xs tabular-nums text-muted-foreground">
              {formatTimecode(t)} / {formatTimecode(durationMs)}
            </span>
          </div>
        )}

        {narrationUrl && (
          <audio ref={audioRef} src={narrationUrl} preload="auto" />
        )}
      </div>
    );
  },
);
