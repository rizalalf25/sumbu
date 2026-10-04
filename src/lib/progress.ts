import { useCallback, useSyncExternalStore } from "react";
import { progressSchema } from "./progress-schema.ts";
import {
  getSaveSnapshot,
  getServerSaveSnapshot,
  readStoredSave,
  subscribeSave,
  updateSave,
} from "./progress-store.ts";

export type Save = {
  correct: Record<string, number>;
  /** Jawaban benar di level Sedang atau Tantangan. */
  hard: Record<string, number>;
  /** Pelajaran kode yang kuisnya sudah dijawab benar. */
  code: Record<string, number>;
  /** Indeks tahapan proyek yang sudah dicentang. */
  proj: Record<string, number[]>;
  /** Indeks barang di daftar belanja yang sudah dimiliki, per proyek. */
  kit: Record<string, number[]>;
  /** Indeks langkah panduan rakit yang sudah selesai, per proyek. */
  build: Record<string, number[]>;
  /** Tantangan kode yang sudah lulus. */
  challenge: Record<string, number>;
  /** Draf jawaban tantangan kode yang belum selesai. */
  drafts: Record<string, string>;
  /** Latihan LPDP: soal yang pernah dijawab benar, riwayat simulasi, esai, dan catatan wawancara. */
  lpdp: LpdpSave;
  attempts: Record<string, number>;
  notes: Record<string, string>;
  steps: Record<string, number>;
  lastTopic: string | null;
  road: string | null;
  dayStreak: number;
  lastDay: string | null;
  sessions: number;
};

export type LpdpSim = {
  at: string;
  total: number;
  correct: number;
  per: Record<string, [number, number]>;
  seconds: number;
};
export type LpdpSave = {
  right: Record<string, number>;
  wrong: Record<string, number>;
  sims: LpdpSim[];
  essays: Record<string, string>;
  interview: Record<string, string>;
};
export const emptyLpdp: LpdpSave = { right: {}, wrong: {}, sims: [], essays: {}, interview: {} };

export const emptySave: Save = progressSchema.parse({});

function dayStamp(deltaDays = 0): string {
  const target = new Date(Date.now() + deltaDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(target);
}

/** Ubah teks JSON cadangan menjadi Save yang valid, atau null bila bukan cadangan SUMBU. */
export function parseSave(text: string): Save | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || !("correct" in parsed)) return null;
    const result = progressSchema.safeParse(parsed);
    return result.success ? (result.data as Save) : null;
  } catch {
    return null;
  }
}

/** Timpa progres di peramban ini dengan cadangan. Mengembalikan false bila gagal. */
export function restoreSave(text: string): boolean {
  const save = parseSave(text);
  if (!save) return false;
  try {
    if (!getSaveSnapshot().ready) return false;
    updateSave(() => save);
    return true;
  } catch {
    return false;
  }
}

export function loadSave(): Save {
  return readStoredSave();
}

export function useSave() {
  const { save, ready, status } = useSyncExternalStore(
    subscribeSave,
    getSaveSnapshot,
    getServerSaveSnapshot,
  );
  const update = updateSave;

  const markAttempt = useCallback(
    (topicId: string, ok: boolean, level = 1) => {
      update((s) => {
        const today = dayStamp(0);
        let dayStreak = s.dayStreak;
        let lastDay = s.lastDay;
        if (ok && lastDay !== today) {
          dayStreak = lastDay === dayStamp(-1) ? Math.max(1, s.dayStreak) + 1 : 1;
          if (s.dayStreak === 0) dayStreak = 1;
          lastDay = today;
        }
        return {
          ...s,
          attempts: { ...s.attempts, [topicId]: (s.attempts[topicId] ?? 0) + 1 },
          correct: { ...s.correct, [topicId]: (s.correct[topicId] ?? 0) + (ok ? 1 : 0) },
          hard: { ...s.hard, [topicId]: (s.hard[topicId] ?? 0) + (ok && level >= 2 ? 1 : 0) },
          lastTopic: topicId,
          dayStreak,
          lastDay,
        };
      });
    },
    [update],
  );

  const setNote = useCallback(
    (topicId: string, text: string, trackTopic = true) => {
      update((s) => ({
        ...s,
        notes: { ...s.notes, [topicId]: text.slice(0, 4000) },
        lastTopic: trackTopic ? topicId : s.lastTopic,
      }));
    },
    [update],
  );

  const setStep = useCallback(
    (topicId: string, step: number, trackTopic = true) => {
      update((s) => ({
        ...s,
        steps: { ...s.steps, [topicId]: step },
        lastTopic: trackTopic ? topicId : s.lastTopic,
      }));
    },
    [update],
  );

  const addSession = useCallback(() => {
    update((s) => ({ ...s, sessions: s.sessions + 1 }));
  }, [update]);

  const passLesson = useCallback(
    (lessonId: string) => {
      update((s) => ({ ...s, code: { ...s.code, [lessonId]: 1 } }));
    },
    [update],
  );

  const toggleIn = useCallback(
    (field: "proj" | "kit" | "build", projectId: string, index: number) => {
      update((s) => {
        const done = new Set(s[field][projectId] ?? []);
        if (done.has(index)) done.delete(index);
        else done.add(index);
        return { ...s, [field]: { ...s[field], [projectId]: [...done].sort((a, b) => a - b) } };
      });
    },
    [update],
  );

  const toggleMilestone = useCallback(
    (projectId: string, index: number) => toggleIn("proj", projectId, index),
    [toggleIn],
  );
  const toggleOwned = useCallback(
    (projectId: string, index: number) => toggleIn("kit", projectId, index),
    [toggleIn],
  );
  const toggleBuild = useCallback(
    (projectId: string, index: number) => toggleIn("build", projectId, index),
    [toggleIn],
  );

  const passChallenge = useCallback(
    (id: string) => {
      update((s) => ({ ...s, challenge: { ...s.challenge, [id]: 1 } }));
    },
    [update],
  );

  const setDraft = useCallback(
    (id: string, text: string) => {
      update((s) => ({ ...s, drafts: { ...s.drafts, [id]: text.slice(0, 20000) } }));
    },
    [update],
  );

  const markLpdp = useCallback(
    (questionId: string, ok: boolean) => {
      update((s) => {
        const field = ok ? "right" : "wrong";
        return {
          ...s,
          lpdp: {
            ...s.lpdp,
            [field]: { ...s.lpdp[field], [questionId]: (s.lpdp[field][questionId] ?? 0) + 1 },
          },
        };
      });
    },
    [update],
  );

  const addLpdpSim = useCallback(
    (sim: LpdpSim) => {
      update((s) => ({ ...s, lpdp: { ...s.lpdp, sims: [...s.lpdp.sims, sim].slice(-30) } }));
    },
    [update],
  );

  const setLpdpText = useCallback(
    (field: "essays" | "interview", key: string, text: string) => {
      update((s) => ({
        ...s,
        lpdp: { ...s.lpdp, [field]: { ...s.lpdp[field], [key]: text.slice(0, 20000) } },
      }));
    },
    [update],
  );

  const setRoad = useCallback(
    (road: string) => {
      update((s) => ({ ...s, road }));
    },
    [update],
  );

  return {
    save,
    ready,
    status,
    markAttempt,
    setNote,
    setStep,
    addSession,
    setRoad,
    passLesson,
    toggleMilestone,
    toggleOwned,
    toggleBuild,
    passChallenge,
    setDraft,
    markLpdp,
    addLpdpSim,
    setLpdpText,
  };
}

export const NOTE_FRAME = `IDE (satu kalimat):
KAPAN RUMUS INI DIPAKAI:
AKU SALAH KALAU:
DENGAN KATAKU SENDIRI:
`;
