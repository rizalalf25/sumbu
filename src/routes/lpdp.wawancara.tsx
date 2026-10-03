import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FocusToggle, Shell } from "@/components/shell";
import { INTERVIEW, INTERVIEW_TIPS, STAR } from "@/lib/lpdp";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/lpdp/wawancara")({ component: InterviewPage });

const ALL = INTERVIEW.flatMap((g) => g.qs.map((q) => ({ group: g.group, q })));
const LIMIT = 120;

function InterviewPage() {
  const { save, setLpdpText } = useSave();
  const [index, setIndex] = useState<number | null>(null);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!endsAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const left = endsAt ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : LIMIT;
  const current = index !== null ? ALL[index] : null;

  const draw = (except?: number) => {
    let i = Math.floor(Math.random() * ALL.length);
    if (ALL.length > 1 && i === except) i = (i + 1) % ALL.length;
    setIndex(i);
    const t = Date.now();
    setNow(t);
    setEndsAt(t + LIMIT * 1000);
  };

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/lpdp" className="text-sm font-semibold text-copper">
            LPDP
          </Link>
          <h1 className="mt-1 text-4xl">Wawancara</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-3 text-muted">Panel menilai konsistensi, kejujuran, dan kedalaman: apakah ceritamu, rencanamu, dan jawabanmu saling menguatkan.</p>

      <section className="mt-6">
        <h2 className="text-2xl">Metode STAR untuk pertanyaan pengalaman</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {STAR.map((s) => (
            <article key={s.k} className="card p-4">
              <p className="font-display text-3xl text-copper">{s.k}</p>
              <p className="font-semibold">{s.t}</p>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card mt-6 p-5">
        <h2 className="text-2xl">Latihan acak, 2 menit</h2>
        <p className="mt-1 text-sm text-muted">Jawab dengan suara keras seolah di depan panel, lalu tulis poin pentingnya. Lebih baik lagi: rekam dirimu dengan ponsel dan tonton ulang.</p>
        {current ? (
          <div className="mt-4">
            <p className="text-sm text-copper">{current.group}</p>
            <p className="mt-1 text-2xl">{current.q}</p>
            <p className={`mt-3 font-mono text-3xl tabular-nums ${endsAt && left <= 15 ? "text-signal" : ""}`}>
              {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
            </p>
            <label className="mt-3 grid gap-1">
              <span className="text-sm">Catatan jawabanmu</span>
              <textarea
                className="field min-h-32 py-3 font-sans text-base"
                value={save.lpdp.interview[current.q] ?? ""}
                onChange={(event) => setLpdpText("interview", current.q, event.target.value)}
                placeholder="Poin utama, contoh nyata, angka yang ingin disebut."
              />
            </label>
          </div>
        ) : null}
        <button type="button" className="btn mt-4" onClick={() => draw(index ?? undefined)}>
          {current ? "Pertanyaan lain" : "Ambil pertanyaan"}
        </button>
      </section>

      <section className="mt-8 grid gap-3">
        <h2 className="text-2xl">Bank pertanyaan</h2>
        {INTERVIEW.map((g) => (
          <article key={g.group} className="card p-5">
            <h3 className="text-xl">{g.group}</h3>
            <p className="mt-1 text-sm text-muted">{g.note}</p>
            <ul className="mt-3 grid gap-2">
              {g.qs.map((q) => (
                <li key={q}>
                  <button type="button" className="text-left hover:text-copper" onClick={() => {
                    setIndex(ALL.findIndex((item) => item.q === q));
                    const t = Date.now();
                    setNow(t);
                    setEndsAt(t + LIMIT * 1000);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}>
                    {q}
                    {save.lpdp.interview[q] ? <span className="ml-2 text-xs text-copper">ada catatan</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <article className="card mt-6 p-5">
        <h2 className="text-2xl">Kiat</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {INTERVIEW_TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </article>
    </Shell>
  );
}
