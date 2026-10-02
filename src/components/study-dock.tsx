import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatClock,
  phaseLabel,
  resetPomo,
  setStudyVolume,
  skipPomo,
  studySnapshot,
  subscribeStudy,
  toggleMusic,
  togglePomo,
  type StudySnap,
} from "@/lib/study-kit";

export function StudyDock({ focus = false }: { focus?: boolean }) {
  const [snap, setSnap] = useState<StudySnap | null>(null);

  useEffect(() => {
    setSnap(studySnapshot());
    return subscribeStudy(setSnap);
  }, []);

  if (!snap) return null;

  return (
    <section className={`study-dock card ${focus ? "study-dock-focus" : ""}`} aria-label="Lofi dan Pomodoro">
      <div className="flex items-center gap-2">
        <button type="button" className="btn-ghost study-btn" onClick={toggleMusic} aria-pressed={snap.music}>
          {snap.music ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          Lofi
        </button>
        <input
          className="study-volume"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={snap.volume}
          aria-label="Volume lofi"
          onChange={(event) => setStudyVolume(Number(event.target.value))}
        />
        <div className="min-w-0 flex-1 text-right">
          <p className="font-mono text-2xl leading-none tabular-nums">{formatClock(snap.remaining)}</p>
          <p className="mt-1 text-xs text-muted">
            {phaseLabel(snap.phase)} · putaran {snap.phase === "kerja" ? (snap.round % 4) + 1 : snap.round % 4 || 4}/4
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button type="button" className="btn study-btn" onClick={togglePomo}>
          {snap.running ? "Jeda" : "Mulai"}
        </button>
        <button type="button" className="btn-ghost study-btn" onClick={skipPomo}>
          <SkipForward size={15} aria-hidden="true" />
          Lewati
        </button>
        <button type="button" className="btn-quiet study-btn ml-auto" onClick={resetPomo}>
          <RotateCcw size={15} aria-hidden="true" />
          Ulang
        </button>
      </div>
    </section>
  );
}
