import { cn } from "@/lib/utils";

export const INTRO_PRESETS = [0, 500, 1000, 1500, 2000, 3000] as const;

function label(ms: number) {
  if (ms === 0) return "없음";
  const s = ms / 1000;
  return `${s}초`;
}

export function IntroSilence({
  value,
  onChange,
  hint = true,
}: {
  value: number;
  onChange: (ms: number) => void;
  hint?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-xs text-muted-foreground">오프닝 무음</p>
      <div className="flex flex-wrap gap-1">
        {INTRO_PRESETS.map((ms) => (
          <button
            key={ms}
            type="button"
            onClick={() => onChange(ms)}
            className={cn(
              "h-9 min-w-11 flex-1 rounded-sm px-2 text-xs font-medium transition-[background-color] duration-150",
              value === ms
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {label(ms)}
          </button>
        ))}
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground">
          영상이 시작된 뒤 이만큼 쉬고 나레이션이 시작됩니다.
        </p>
      )}
    </div>
  );
}
