import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FocusToggle, Shell } from "@/components/shell";
import { checkAnswer, type Level } from "@/lib/mathx";
import { makeProblem } from "@/lib/problems";
import { useSave } from "@/lib/progress";
import { bankOf, getTopic } from "@/lib/topics";

export const Route = createFileRoute("/latihan/$topicId")({ component: Practice });

const GOAL = 5;

function Practice() {
  const { topicId } = Route.useParams();
  const topic = getTopic(topicId);
  const { markAttempt, addSession } = useSave();
  const [level, setLevel] = useState<Level>(1);
  const [seed, setSeed] = useState(1);
  const [raw, setRaw] = useState("");
  const [hint, setHint] = useState(false);
  const [solved, setSolved] = useState<"idle" | "ok" | "no">("idle");
  const [misses, setMisses] = useState(0);
  const [session, setSession] = useState(0);
  const [showBreak, setShowBreak] = useState(false);
  const [seconds, setSeconds] = useState(12 * 60);
  const [timerOn, setTimerOn] = useState(true);
  const [need, setNeed] = useState(false);
  const [graded, setGraded] = useState<string | null>(null);

  const problem = useMemo(() => makeProblem(topicId, seed + level * 1009, level), [topicId, seed, level]);

  useEffect(() => {
    if (!timerOn || showBreak) return;
    const id = window.setInterval(() => {
      setSeconds((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerOn, showBreak]);

  useEffect(() => {
    if (seconds !== 0 || !timerOn) return;
    setTimerOn(false);
    setShowBreak(true);
    addSession();
  }, [seconds, timerOn, addSession]);

  if (!topic) {
    return (
      <Shell>
        <h1 className="text-4xl">Latihan tidak ketemu</h1>
        <Link to="/" className="btn mt-6">
          Kembali
        </Link>
      </Shell>
    );
  }

  const next = () => {
    setSeed((value) => value + 1);
    setRaw("");
    setHint(false);
    setSolved("idle");
    setMisses(0);
    setNeed(false);
    setGraded(null);
  };

  const check = () => {
    const text = raw.trim();
    if (!text) {
      setNeed(true);
      setSolved("idle");
      setHint(false);
      return;
    }
    setNeed(false);
    const ok = checkAnswer(problem, raw);
    setSolved(ok ? "ok" : "no");
    if (!ok) {
      setHint(true);
      setMisses((count) => (graded === text ? count : count + 1));
    }
    if (graded !== text) {
      markAttempt(topic.id, ok);
      setGraded(text);
      if (ok) setSession((value) => value + 1);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/belajar/$topicId" params={{ topicId: topic.id }} className="text-sm font-semibold text-copper">
            {topic.title}
          </Link>
          <h1 className="mt-1 text-4xl">Latihan</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-2 text-sm text-muted">
        Target sesi: {Math.min(session, GOAL)}/{GOAL} benar · bank {bankOf(topic.id).toLocaleString("id-ID")}+ variasi · pakai titik desimal
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {([1, 2, 3] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={level === item ? "btn" : "btn-ghost"}
            onClick={() => {
              setLevel(item);
              setSolved("idle");
              setHint(false);
              setRaw("");
              setMisses(0);
              setNeed(false);
              setGraded(null);
            }}
          >
            {item === 1 ? "Mudah" : item === 2 ? "Sedang" : "Tantangan"}
          </button>
        ))}
        <button type="button" className="btn-quiet ml-auto tabular-nums" onClick={() => setTimerOn((value) => !value)}>
          {timerOn ? `${mm}:${ss}` : "Timer mati"}
        </button>
      </div>

      {showBreak && (
        <article className="card mt-4 p-4">
          <h2 className="text-2xl">Waktunya berdiri</h2>
          <p className="mt-2 text-muted">Dua belas menit sudah cukup untuk satu blok. Minum air. Berhenti juga benar.</p>
          <button
            type="button"
            className="btn mt-3"
            onClick={() => {
              setSeconds(12 * 60);
              setShowBreak(false);
              setTimerOn(true);
            }}
          >
            Blok 12 menit lagi
          </button>
        </article>
      )}

      {session >= GOAL && solved !== "idle" && (
        <article className="card mt-4 p-4">
          <h2 className="text-2xl">Lima soal selesai</h2>
          <p className="mt-2 text-muted">Tulis dua kalimat di catatan materi ini, atau lanjut lima lagi. Jangan buka topik baru dulu.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/belajar/$topicId" params={{ topicId: topic.id }} className="btn">
              Catat dulu
            </Link>
            <button type="button" className="btn-ghost" onClick={() => setSession(0)}>
              Lanjut lima
            </button>
          </div>
        </article>
      )}

      <article className="card mt-4 p-5">
        <p className="text-lg">{problem.prompt}</p>
        <p className="mt-2 text-sm text-muted">{problem.given}</p>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (solved === "ok") next();
            else check();
          }}
        >
          <label className="grid gap-1">
            <span className="text-sm">Jawaban</span>
            <input className="field" inputMode="decimal" value={raw} onChange={(event) => { setRaw(event.target.value); setNeed(false); }} />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn">
              {solved === "ok" ? "Soal berikutnya" : "Cek"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setHint(true)}
            >
              Petunjuk
            </button>
            <button type="button" className="btn-quiet" onClick={next}>
              Lewati
            </button>
          </div>
        </form>
        {need ? <p className="mt-4 text-sm">Isi angkanya dulu, baru cek. Koma atau titik sama-sama diterima.</p> : null}
        {hint && solved !== "ok" ? <p className="mt-4 text-sm">{problem.hint}</p> : null}
        {solved === "ok" && (
          <div className="mt-4">
            <p className="font-semibold">Pas. Jawaban {problem.answer}.</p>
            <ol className="mt-2 grid gap-1 text-sm text-muted">
              {problem.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {solved === "no" && (
          <div className="mt-4">
            <p>Belum pas. Petunjuknya sudah di atas. Kalau masih macet, buka satu langkah.</p>
            {misses >= 2 ? (
              <ol className="mt-2 grid gap-1 text-sm text-muted">
                {problem.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            ) : (
              <button type="button" className="btn-ghost mt-3" onClick={() => setMisses(2)}>
                Lihat langkah
              </button>
            )}
            <button type="button" className="btn-quiet mt-3" onClick={next}>
              Soal serupa
            </button>
          </div>
        )}
      </article>
    </Shell>
  );
}
