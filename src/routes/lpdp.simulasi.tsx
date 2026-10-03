import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LETTER, QuestionCard } from "@/components/lpdp-question";
import { Shell } from "@/components/shell";
import { buildSimulation, SUBTES, type LpdpQuestion } from "@/lib/lpdp";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/lpdp/simulasi")({ component: Simulation });

const LIMIT_SECONDS = 30 * 60;

type Phase = "intro" | "run" | "done";

function clock(seconds: number) {
  const s = Math.max(0, seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Simulation() {
  const { save, addLpdpSim, markLpdp } = useSave();
  const [phase, setPhase] = useState<Phase>("intro");
  const [seed, setSeed] = useState(1);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [endsAt, setEndsAt] = useState(0);
  const [now, setNow] = useState(0);
  const [used, setUsed] = useState(0);

  const started = phase !== "intro";
  const questions = useMemo<LpdpQuestion[]>(() => (started ? buildSimulation(seed) : []), [seed, started]);
  const left = Math.ceil((endsAt - now) / 1000);

  const finish = (final: (number | null)[] = answers) => {
    const seconds = Math.min(LIMIT_SECONDS, Math.round((Date.now() - (endsAt - LIMIT_SECONDS * 1000)) / 1000));
    const per: Record<string, [number, number]> = {};
    let correct = 0;
    questions.forEach((q, i) => {
      const ok = final[i] === q.answer;
      if (ok) correct++;
      const [r, t] = per[q.sub] ?? [0, 0];
      per[q.sub] = [r + (ok ? 1 : 0), t + 1];
      if (final[i] !== null && final[i] !== undefined) markLpdp(`${q.sub}:${q.id}`, ok);
    });
    addLpdpSim({ at: new Date().toISOString(), total: questions.length, correct, per, seconds });
    setUsed(seconds);
    setPhase("done");
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (phase !== "run") return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "run" && now > 0 && now >= endsAt) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, phase, endsAt]);

  const start = () => {
    const s = Math.floor(Math.random() * 1_000_000);
    setSeed(s);
    setAnswers(Array(30).fill(null));
    setCurrent(0);
    const t = Date.now();
    setNow(t);
    setEndsAt(t + LIMIT_SECONDS * 1000);
    setPhase("run");
  };

  if (phase === "intro") {
    const history = save.lpdp.sims.slice(-5).reverse();
    return (
      <Shell>
        <Link to="/lpdp" className="text-sm font-semibold text-copper">
          LPDP
        </Link>
        <h1 className="mt-1 text-4xl">Simulasi tes bakat skolastik</h1>
        <article className="card mt-5 p-5">
          <h2 className="text-2xl">Aturan</h2>
          <ul className="mt-3 grid gap-2">
            <li>30 soal: 10 verbal, 10 kuantitatif, 10 penalaran, diacak setiap kali.</li>
            <li>Waktu 30 menit. Simulasi berakhir otomatis saat waktu habis.</li>
            <li>Tidak ada pembahasan sampai selesai. Kamu boleh berpindah soal dan mengubah jawaban.</li>
            <li>Siapkan kertas coretan. Hindari kalkulator agar terbiasa seperti tes sebenarnya.</li>
          </ul>
          <p className="mt-3 text-sm text-muted">Jumlah soal dan waktu di tes LPDP sebenarnya bisa berbeda; simulasi ini melatih kecepatan dan ketelitian.</p>
          <button type="button" className="btn mt-4" onClick={start}>
            Mulai sekarang
          </button>
        </article>
        {history.length ? (
          <section className="mt-6">
            <h2 className="text-2xl">Riwayat</h2>
            <ul className="card mt-3 divide-y divide-line">
              {history.map((h) => (
                <li key={h.at} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span>{new Date(h.at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                  <span className="font-mono">
                    {h.correct}/{h.total} · {clock(h.seconds)}
                  </span>
                  <span className="w-full text-muted">
                    {SUBTES.map((s) => `${s.title} ${h.per[s.id]?.[0] ?? 0}/${h.per[s.id]?.[1] ?? 0}`).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Shell>
    );
  }

  if (phase === "done") {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length;
    return (
      <Shell>
        <Link to="/lpdp" className="text-sm font-semibold text-copper">
          LPDP
        </Link>
        <h1 className="mt-1 text-4xl">Hasil simulasi</h1>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="card p-4 sm:col-span-1">
            <p className="font-display text-4xl tabular-nums">
              {correct}
              <span className="text-muted">/{questions.length}</span>
            </p>
            <p className="text-sm text-muted">benar · {clock(used)}</p>
          </div>
          {SUBTES.map((s) => {
            const rows = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.sub === s.id);
            const r = rows.filter(({ q, i }) => answers[i] === q.answer).length;
            return (
              <div key={s.id} className="card p-4">
                <p className="font-display text-3xl tabular-nums">
                  {r}
                  <span className="text-muted">/{rows.length}</span>
                </p>
                <Link to="/lpdp/$sub" params={{ sub: s.id }} className="text-sm font-semibold text-copper">
                  {s.title}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted">Fokuskan latihan berikutnya pada subtes dengan skor terendah. Pembahasan setiap soal ada di bawah.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={start}>
            Simulasi baru
          </button>
          <Link to="/lpdp" className="btn-ghost">
            Kembali ke LPDP
          </Link>
        </div>
        <section className="mt-8 grid gap-3">
          <h2 className="text-2xl">Pembahasan</h2>
          {questions.map((q, i) => (
            <div key={`${q.id}-${i}`}>
              <p className="mb-1 text-sm text-muted">
                {SUBTES.find((s) => s.id === q.sub)?.title} ·{" "}
                {answers[i] === null ? "tidak dijawab" : answers[i] === q.answer ? "benar" : `jawabanmu ${LETTER[answers[i]!]}`}
              </p>
              <QuestionCard q={q} number={i + 1} pick={answers[i] ?? -1} onPick={() => {}} reveal />
            </div>
          ))}
        </section>
      </Shell>
    );
  }

  const q = questions[current];
  const answeredCount = answers.filter((a) => a !== null).length;
  return (
    <Shell>
      <div className="sticky top-14 z-10 -mx-4 flex items-center justify-between gap-3 border-b border-line bg-paper/90 px-4 py-2 backdrop-blur">
        <span className="text-sm">
          Soal {current + 1}/{questions.length} · {SUBTES.find((s) => s.id === q.sub)?.title}
        </span>
        <span className={`font-mono text-xl tabular-nums ${left < 120 ? "text-signal" : ""}`} aria-live="off">
          {clock(left)}
        </span>
      </div>
      <div className="mt-4">
        <QuestionCard
          key={`${q.id}-${current}`}
          q={q}
          number={current + 1}
          pick={answers[current]}
          onPick={(i) => setAnswers((prev) => prev.map((a, k) => (k === current ? i : a)))}
          reveal={false}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button type="button" className="btn-ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Sebelumnya
        </button>
        {current < questions.length - 1 ? (
          <button type="button" className="btn" onClick={() => setCurrent((c) => c + 1)}>
            Berikutnya
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (answeredCount < questions.length && !window.confirm(`Masih ada ${questions.length - answeredCount} soal kosong. Selesaikan sekarang?`)) return;
              finish();
            }}
          >
            Selesai
          </button>
        )}
      </div>
      <nav className="mt-6" aria-label="Lompat ke soal">
        <p className="mb-2 text-sm text-muted">
          {answeredCount}/{questions.length} terjawab
        </p>
        <div className="grid grid-cols-10 gap-1.5">
          {questions.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              type="button"
              aria-label={`Soal ${i + 1}${answers[i] !== null ? ", terjawab" : ""}`}
              aria-current={i === current}
              className={`h-9 rounded-sm border text-xs tabular-nums ${i === current ? "border-copper text-copper" : "border-line"} ${answers[i] !== null ? "bg-soft" : ""}`}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-quiet mt-4 px-0"
          onClick={() => {
            if (window.confirm("Akhiri simulasi sekarang?")) finish();
          }}
        >
          Akhiri simulasi
        </button>
      </nav>
    </Shell>
  );
}
