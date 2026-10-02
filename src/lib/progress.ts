import { useCallback, useEffect, useState } from "react";

export type Save = {
  correct: Record<string, number>;
  /** Jawaban benar di level Sedang atau Tantangan. */
  hard: Record<string, number>;
  attempts: Record<string, number>;
  notes: Record<string, string>;
  steps: Record<string, number>;
  lastTopic: string | null;
  road: string | null;
  dayStreak: number;
  lastDay: string | null;
  sessions: number;
};

const KEY = "sumbu-v1";

export const emptySave: Save = {
  correct: {},
  hard: {},
  attempts: {},
  notes: {},
  steps: {},
  lastTopic: null,
  road: null,
  dayStreak: 0,
  lastDay: null,
  sessions: 0,
};

function dayStamp(deltaDays = 0): string {
  const target = new Date(Date.now() + deltaDays * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(target);
}

export function loadSave(): Save {
  if (typeof window === "undefined") return emptySave;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySave;
    const parsed = JSON.parse(raw) as Partial<Save>;
    const save = { ...emptySave, ...parsed };
    if (!parsed.hard) {
      // Simpanan lama belum mencatat level. Jangan cabut status "cukup" yang sudah diraih.
      save.hard = Object.fromEntries(Object.entries(save.correct).filter(([, n]) => n >= 3).map(([id]) => [id, 1]));
    }
    return save;
  } catch {
    return emptySave;
  }
}

function writeSave(save: Save) {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // Penyimpanan penuh atau diblokir: progres tetap jalan di memori sesi ini.
  }
}

export function useSave() {
  const [save, setSave] = useState<Save>(emptySave);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSave(loadSave());
    setReady(true);
  }, []);

  const update = useCallback((fn: (s: Save) => Save) => {
    setSave((prev) => {
      const next = fn(prev);
      writeSave(next);
      return next;
    });
  }, []);

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
    (topicId: string, text: string) => {
      update((s) => ({ ...s, notes: { ...s.notes, [topicId]: text.slice(0, 4000) }, lastTopic: topicId }));
    },
    [update],
  );

  const setStep = useCallback(
    (topicId: string, step: number) => {
      update((s) => ({
        ...s,
        steps: { ...s.steps, [topicId]: step },
        lastTopic: topicId,
      }));
    },
    [update],
  );

  const addSession = useCallback(() => {
    update((s) => ({ ...s, sessions: s.sessions + 1 }));
  }, [update]);

  const setRoad = useCallback(
    (road: string) => {
      update((s) => ({ ...s, road }));
    },
    [update],
  );

  return { save, ready, markAttempt, setNote, setStep, addSession, setRoad };
}

export const NOTE_FRAME = `IDE (satu kalimat):
KAPAN RUMUS INI DIPAKAI:
AKU SALAH KALAU:
DENGAN KATAKU SENDIRI:
`;
