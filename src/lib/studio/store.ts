import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Brief, CaptionSource, Cue, Mixer, StepId, VoiceKind } from "./types";
import { DEFAULT_VOICE_ID, LIMIT_MS } from "./types";
import { idbClear, idbDel, idbGet, idbSet } from "./idb";
import {
  getNarrationUrl,
  getVideoUrl,
  setNarrationBlob,
  setVideoBlob,
  videoDurationMs,
} from "./media";
import { sampleCues } from "./templates";
import { packCues } from "./time";

export interface StudioState {
  hydrated: boolean;
  step: StepId;
  title: string;
  hasVideo: boolean;
  durationMs: number;
  trimStartMs: number;
  trimEndMs: number;
  limitMs: number;
  cues: Cue[];
  captions: Cue[];
  captionSource: CaptionSource | null;
  brief: Brief;
  voiceId: string;
  voiceSpeed: number;
  hasNarration: boolean;
  narrationKind: VoiceKind | null;
  narrationDurationMs: number;
  mixer: Mixer;
  mediaRev: number;
  hydrate: () => Promise<void>;
  setStep: (step: StepId) => void;
  setTitle: (title: string) => void;
  setBrief: (patch: Partial<Brief>) => void;
  setCues: (cues: Cue[]) => void;
  retimeCues: (cues: Cue[]) => void;
  packSpeech: () => void;
  addCue: (atMs: number, text?: string) => void;
  updateCue: (id: string, patch: Partial<Cue>) => void;
  removeCue: (id: string) => void;
  setCaptions: (captions: Cue[], source: CaptionSource | null) => void;
  updateCaption: (id: string, patch: Partial<Cue>) => void;
  removeCaption: (id: string) => void;
  setVoice: (voiceId: string, speed?: number) => void;
  setMixer: (patch: Partial<Mixer>) => void;
  setTrim: (startMs: number, endMs: number) => void;
  applyVideo: (blob: Blob, name?: string, durationHintMs?: number) => Promise<void>;
  applyNarration: (blob: Blob, kind: VoiceKind, durationMs: number) => Promise<void>;
  clearNarration: () => Promise<void>;
  resetAll: () => Promise<void>;
}

const defaultBrief: Brief = {
  name: "",
  problem: "",
  solution: "",
  demo: "",
  tone: "plain",
};

const defaultMixer: Mixer = {
  videoVolume: 0.25,
  narrationVolume: 1,
  muteOriginal: true,
  burnSubtitles: false,
};

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      step: "record",
      title: "해커톤 시연",
      hasVideo: false,
      durationMs: 0,
      trimStartMs: 0,
      trimEndMs: 0,
      limitMs: LIMIT_MS,
      cues: [],
      captions: [],
      captionSource: null,
      brief: defaultBrief,
      voiceId: DEFAULT_VOICE_ID,
      voiceSpeed: 1,
      hasNarration: false,
      narrationKind: null,
      narrationDurationMs: 0,
      mixer: defaultMixer,
      mediaRev: 0,

      hydrate: async () => {
        try {
          const video = await idbGet("video");
          if (video) {
            setVideoBlob(video);
            let duration = get().durationMs;
            if (!duration) {
              duration = await videoDurationMs(video);
            }
            set({
              hasVideo: true,
              durationMs: duration,
              trimEndMs: get().trimEndMs || duration,
            });
          }
          const narration = await idbGet("narration");
          if (narration) {
            setNarrationBlob(narration);
            set({ hasNarration: true });
          }
        } finally {
          set((s) => ({ hydrated: true, mediaRev: s.mediaRev + 1 }));
        }
      },

      setStep: (step) => set({ step }),
      setTitle: (title) => set({ title }),
      setBrief: (patch) => set({ brief: { ...get().brief, ...patch } }),
      setCues: (cues) => set({ cues, captions: [], captionSource: null }),
      retimeCues: (cues) => set({ cues }),
      packSpeech: () => {
        const { cues, durationMs } = get();
        set({ cues: packCues(cues, durationMs) });
      },
      addCue: (atMs, text) => {
        const cue: Cue = {
          id: crypto.randomUUID(),
          startMs: Math.max(0, Math.round(atMs)),
          text: text ?? "",
        };
        set({ cues: [...get().cues, cue].sort((a, b) => a.startMs - b.startMs) });
      },
      updateCue: (id, patch) => {
        set({
          cues: get()
            .cues.map((c) => (c.id === id ? { ...c, ...patch } : c))
            .sort((a, b) => a.startMs - b.startMs),
        });
      },
      removeCue: (id) => set({ cues: get().cues.filter((c) => c.id !== id) }),
      setCaptions: (captions, source) =>
        set({ captions, captionSource: source }),
      updateCaption: (id, patch) => {
        set({
          captions: get()
            .captions.map((c) => (c.id === id ? { ...c, ...patch } : c))
            .sort((a, b) => a.startMs - b.startMs),
        });
      },
      removeCaption: (id) =>
        set({ captions: get().captions.filter((c) => c.id !== id) }),
      setVoice: (voiceId, speed) =>
        set({
          voiceId,
          voiceSpeed: speed ?? get().voiceSpeed,
        }),
      setMixer: (patch) => set({ mixer: { ...get().mixer, ...patch } }),
      setTrim: (startMs, endMs) =>
        set({
          trimStartMs: Math.max(0, startMs),
          trimEndMs: Math.max(startMs + 400, endMs),
        }),

      applyVideo: async (blob, name, durationHintMs) => {
        let duration = 0;
        try {
          duration = await videoDurationMs(blob);
        } catch {
          duration = 0;
        }
        if (durationHintMs && duration < Math.max(1000, durationHintMs * 0.8)) {
          duration = durationHintMs;
        }
        const limit = get().limitMs;
        setVideoBlob(blob);
        await idbSet("video", blob);
        setNarrationBlob(null);
        await idbDel("narration");
        const nextTitle = name
          ? name.replace(/\.[^.]+$/, "")
          : get().title;
        const prevDur = get().durationMs;
        const sample = Boolean(name && /샘플/.test(name));
        const cues =
          sample || !get().cues.length || prevDur === 0
            ? sampleCues(Math.min(duration, limit))
            : packCues(get().cues, Math.min(duration, limit));
        set({
          hasVideo: true,
          durationMs: duration,
          trimStartMs: 0,
          trimEndMs: Math.min(duration, limit),
          title: nextTitle,
          cues,
          captions: [],
          captionSource: null,
          hasNarration: false,
          narrationKind: null,
          narrationDurationMs: 0,
          step: "script",
          mediaRev: get().mediaRev + 1,
        });
      },

      applyNarration: async (blob, kind, durationMs) => {
        setNarrationBlob(blob);
        await idbSet("narration", blob);
        set({
          hasNarration: true,
          narrationKind: kind,
          narrationDurationMs: durationMs,
          mediaRev: get().mediaRev + 1,
          step: "export",
        });
      },

      clearNarration: async () => {
        setNarrationBlob(null);
        await idbDel("narration");
        set({
          hasNarration: false,
          narrationKind: null,
          narrationDurationMs: 0,
          mediaRev: get().mediaRev + 1,
        });
      },

      resetAll: async () => {
        setVideoBlob(null);
        setNarrationBlob(null);
        await idbClear();
        set({
          step: "record",
          title: "해커톤 시연",
          hasVideo: false,
          durationMs: 0,
          trimStartMs: 0,
          trimEndMs: 0,
          cues: [],
          captions: [],
          captionSource: null,
          brief: defaultBrief,
          hasNarration: false,
          narrationKind: null,
          narrationDurationMs: 0,
          mixer: defaultMixer,
          mediaRev: get().mediaRev + 1,
        });
      },
    }),
    {
      name: "take-five-studio",
      partialize: (s) => ({
        step: s.step,
        title: s.title,
        durationMs: s.durationMs,
        trimStartMs: s.trimStartMs,
        trimEndMs: s.trimEndMs,
        cues: s.cues,
        captions: s.captions,
        captionSource: s.captionSource,
        brief: s.brief,
        voiceId: s.voiceId,
        voiceSpeed: s.voiceSpeed,
        narrationKind: s.narrationKind,
        mixer: s.mixer,
      }),
    },
  ),
);

export function videoSrc() {
  return getVideoUrl();
}

export function narrationSrc() {
  return getNarrationUrl();
}
