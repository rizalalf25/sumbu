import { ChevronDown, Pause, Play, RotateCcw, SkipForward, Timer } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  formatClock,
  phaseLabel,
  resetPomo,
  setStudyVolume,
  setWorkMinutes,
  skipPomo,
  studySnapshot,
  subscribeStudy,
  toggleMusic,
  togglePomo,
  WORK_CHOICES,
  type StudySnap,
} from "@/lib/study-kit";

const OPEN_KEY = "sumbu-dock-open";

function readOpen(): boolean {
  try {
    return localStorage.getItem(OPEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeOpen(value: boolean) {
  try {
    localStorage.setItem(OPEN_KEY, value ? "1" : "0");
  } catch {
    // Penyimpanan diblokir: pilihan berlaku sampai halaman dimuat ulang.
  }
}

// Status buka/ciut dipakai bersama oleh pil di header (HP) dan panel/pil mengambang.
const openListeners = new Set<() => void>();
let openState: boolean | null = null;

function getOpen(): boolean {
  if (openState === null) openState = readOpen();
  return openState;
}

function setOpen(value: boolean) {
  openState = value;
  writeOpen(value);
  openListeners.forEach((listener) => listener());
}

function subscribeOpen(listener: () => void) {
  openListeners.add(listener);
  return () => {
    openListeners.delete(listener);
  };
}

function useDock() {
  const [snap, setSnap] = useState<StudySnap | null>(null);
  const open = useSyncExternalStore(subscribeOpen, getOpen, () => false);
  useEffect(() => {
    setSnap(studySnapshot());
    return subscribeStudy(setSnap);
  }, []);
  return { snap, open };
}

function Pill({ snap, className }: { snap: StudySnap; className: string }) {
  return (
    <div className={className} role="group" aria-label="Timer belajar">
      <button type="button" className="study-pill-btn" onClick={togglePomo} aria-label={snap.running ? "Jeda timer" : "Mulai timer"}>
        {snap.running ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
      </button>
      <button type="button" className="study-pill-main" onClick={() => setOpen(true)} aria-expanded={false} aria-label="Buka pengaturan timer dan lofi">
        <Timer size={14} aria-hidden="true" className="hidden sm:block" />
        <span className="font-mono tabular-nums">{formatClock(snap.remaining)}</span>
        <span className="hidden text-xs text-muted sm:inline">{phaseLabel(snap.phase)}</span>
      </button>
    </div>
  );
}

/**
 * Pil timer di dalam header untuk layar di bawah 1024 px. Di sana ia duduk di samping tombol akun,
 * jadi tidak pernah menutupi slider, tombol, atau teks di halaman.
 */
export function StudyPillHeader() {
  const { snap, open } = useDock();
  if (!snap || open) return null;
  return <Pill snap={snap} className="study-pill study-pill-inline lg:hidden" />;
}

/**
 * Timer belajar dan lofi. Bawaannya diciutkan menjadi pil kecil; dibuka hanya saat ingin mengatur.
 * Pil mengambang hanya dipakai di desktop dan di mode fokus. Di HP tanpa mode fokus, pilnya ada
 * di header (StudyPillHeader), dan komponen ini hanya menampilkan panel saat dibuka.
 */
export function StudyDock({ focus = false }: { focus?: boolean }) {
  const { snap, open } = useDock();
  if (!snap) return null;

  const round = snap.phase === "kerja" ? (snap.round % 4) + 1 : snap.round % 4 || 4;

  if (!open) {
    return <Pill snap={snap} className={`study-pill ${focus ? "study-dock-focus" : "max-lg:hidden"}`} />;
  }

  return (
    <section className={`study-dock card ${focus ? "study-dock-focus" : ""}`} aria-label="Lofi dan Pomodoro">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-2xl leading-none tabular-nums">{formatClock(snap.remaining)}</p>
          <p className="mt-1 text-xs text-muted">
            {phaseLabel(snap.phase)} · putaran {round}/4
          </p>
        </div>
        <button type="button" className="btn-quiet study-btn" onClick={() => setOpen(false)} aria-expanded={true}>
          <ChevronDown size={16} aria-hidden="true" />
          Ciutkan
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn study-btn" onClick={togglePomo}>
          {snap.running ? "Jeda" : "Mulai"}
        </button>
        <button type="button" className="btn-ghost study-btn" onClick={skipPomo}>
          <SkipForward size={15} aria-hidden="true" />
          Lewati
        </button>
        <button type="button" className="btn-quiet study-btn" onClick={resetPomo}>
          <RotateCcw size={15} aria-hidden="true" />
          Ulang
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="text-muted">Blok kerja</span>
        {WORK_CHOICES.map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={snap.workMinutes === minutes ? "btn study-btn" : "btn-ghost study-btn"}
            aria-pressed={snap.workMinutes === minutes}
            onClick={() => setWorkMinutes(minutes)}
          >
            {minutes} menit
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button type="button" className="btn-ghost study-btn" onClick={toggleMusic} aria-pressed={snap.music}>
          {snap.music ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          Lofi
        </button>
        <input
          className="study-volume min-w-0 flex-1"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={snap.volume}
          aria-label="Volume lofi"
          onChange={(event) => setStudyVolume(Number(event.target.value))}
        />
      </div>
    </section>
  );
}
