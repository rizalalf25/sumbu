import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FocusToggle, Shell } from "@/components/shell";
import { ESSAY_GUIDE, ESSAY_PROMPTS } from "@/lib/lpdp";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/lpdp/esai")({ component: EssayPage });

const DURATIONS = [30, 45, 60];

function words(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function EssayPage() {
  const { save, setLpdpText } = useSave();
  const [promptId, setPromptId] = useState(ESSAY_PROMPTS[0].id);
  const [minutes, setMinutes] = useState(45);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [checks, setChecks] = useState<Set<number>>(new Set());
  const prompt = ESSAY_PROMPTS.find((p) => p.id === promptId)!;
  const text = save.lpdp.essays[promptId] ?? "";
  const left = endsAt ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : minutes * 60;

  useEffect(() => {
    if (!endsAt) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [endsAt]);

  useEffect(() => {
    if (endsAt && now >= endsAt) setEndsAt(null);
  }, [now, endsAt]);

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/lpdp" className="text-sm font-semibold text-copper">
            LPDP
          </Link>
          <h1 className="mt-1 text-4xl">Esai</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-3 text-muted">Esai menunjukkan cara berpikir dan kedewasaanmu. Panel membaca banyak esai; yang diingat adalah yang spesifik, jujur, dan runtut.</p>

      <section className="mt-6">
        <h2 className="text-2xl">Struktur yang aman</h2>
        <ol className="mt-3 grid gap-3">
          {ESSAY_GUIDE.structure.map((s) => (
            <li key={s.t} className="card p-4">
              <p className="font-semibold">{s.t}</p>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {ESSAY_GUIDE.admin.map((a) => (
          <article key={a.t} className="card p-5">
            <h3 className="text-xl">{a.t}</h3>
            <p className="mt-1 text-sm text-muted">Jawab pertanyaan ini dulu di catatan, baru susun menjadi esai.</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {a.qs.map((q) => (
                <li key={q} className="flex gap-2">
                  <span className="text-copper" aria-hidden="true">
                    ?
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <article className="card mt-6 p-5">
        <h2 className="text-2xl">Esai on the spot</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {ESSAY_GUIDE.onTheSpot.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </article>

      <section className="mt-8">
        <h2 className="text-2xl">Latihan menulis</h2>
        <label className="mt-3 grid gap-1 text-sm">
          <span>Tema</span>
          <select className="field" value={promptId} onChange={(event) => setPromptId(event.target.value)}>
            {ESSAY_PROMPTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <p className="card mt-3 p-4">{prompt.prompt}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={minutes === d}
              disabled={endsAt !== null}
              className={minutes === d ? "btn" : "btn-ghost"}
              onClick={() => setMinutes(d)}
            >
              {d} menit
            </button>
          ))}
          {endsAt ? (
            <button type="button" className="btn-ghost" onClick={() => setEndsAt(null)}>
              Hentikan
            </button>
          ) : (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                const t = Date.now();
                setNow(t);
                setEndsAt(t + minutes * 60 * 1000);
              }}
            >
              Mulai timer
            </button>
          )}
          <span className={`ml-auto font-mono text-xl tabular-nums ${endsAt && left < 300 ? "text-signal" : ""}`}>
            {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
          </span>
        </div>

        <label className="mt-3 grid gap-1">
          <span className="sr-only">Esaimu</span>
          <textarea
            className="field min-h-80 py-3 font-sans text-base leading-relaxed"
            value={text}
            onChange={(event) => setLpdpText("essays", promptId, event.target.value)}
            placeholder="Tulis kerangka dulu: tesis, dua-tiga argumen, penutup. Lalu kembangkan."
          />
        </label>
        <p className="mt-2 text-sm text-muted">
          {words(text)} kata · tersimpan otomatis di peramban ini. Batas kata di tes sebenarnya mengikuti instruksi saat itu.
        </p>

        <article className="card mt-4 p-5">
          <h3 className="text-xl">Periksa sebelum selesai</h3>
          <ul className="mt-3 grid gap-2">
            {ESSAY_GUIDE.checklist.map((item, i) => (
              <li key={item}>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 accent-[var(--color-copper)]"
                    checked={checks.has(i)}
                    onChange={() =>
                      setChecks((prev) => {
                        const next = new Set(prev);
                        if (next.has(i)) next.delete(i);
                        else next.add(i);
                        return next;
                      })
                    }
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </Shell>
  );
}
