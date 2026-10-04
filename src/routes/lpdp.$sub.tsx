import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QuestionCard } from "@/components/lpdp-question";
import { LpdpSolution } from "@/components/lpdp-solution";
import { FocusToggle, Shell } from "@/components/shell";
import { bankSize, drawQuestion, getSubtes, type SubId } from "@/lib/lpdp";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/lpdp/$sub")({ component: SubRoute });

function SubRoute() {
  const { sub } = Route.useParams();
  return <SubPage key={sub} subId={sub} />;
}

function SubPage({ subId }: { subId: string }) {
  const sub = getSubtes(subId);
  const { markLpdp } = useSave();
  const [kind, setKind] = useState<string | undefined>(undefined);
  const [seed, setSeed] = useState<number | null>(null);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [exampleKind, setExampleKind] = useState("");
  const [exampleSeed, setExampleSeed] = useState(42);
  const [hint, setHint] = useState(false);
  const selectedExample = exampleKind || sub?.kinds[0]?.id;
  const example = useMemo(
    () => (sub ? drawQuestion(sub.id, exampleSeed, selectedExample) : null),
    [sub, exampleSeed, selectedExample],
  );

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1_000_000));
  }, []);

  const q = useMemo(
    () => (sub && seed !== null ? drawQuestion(sub.id as SubId, seed, kind) : null),
    [sub, seed, kind],
  );

  if (!sub) {
    return (
      <Shell>
        <h1 className="text-4xl">Subtes tidak ketemu</h1>
        <Link to="/lpdp" className="btn mt-6">
          Kembali ke LPDP
        </Link>
      </Shell>
    );
  }

  const size = bankSize(sub.id);
  const next = () => {
    setSeed((s) => (s ?? 0) + 1);
    setPick(null);
    setHint(false);
  };
  const answer = (i: number) => {
    if (!q || pick !== null) return;
    setPick(i);
    const ok = i === q.answer;
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    markLpdp(`${sub.id}:${q.id}`, ok);
  };

  return (
    <Shell wide>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/lpdp" className="text-sm font-semibold text-copper">
            LPDP · tes bakat skolastik
          </Link>
          <h1 className="mt-1 text-4xl md:text-5xl">{sub.title}</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-4 max-w-2xl text-lg text-muted">{sub.summary}</p>
      <p className="card mt-4 p-4 text-sm">
        Alur belajar: pilih jenis soal → pelajari cara pengerjaan contoh → coba latihan sendiri →
        bandingkan langkah Anda dengan pembahasan.
      </p>
      <nav className="chip-row mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Bagian">
        <a href="#materi" className="chip shrink-0">
          Materi
        </a>
        <a href="#contoh" className="chip shrink-0">
          Contoh dikerjakan
        </a>
        <a href="#latihan" className="chip shrink-0">
          Latihan
        </a>
      </nav>

      <section id="materi" className="fase mt-8">
        <h2 className="text-3xl">Materi per jenis soal</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sub.kinds.map((k) => (
            <article key={k.id} className="card p-5">
              <h3 className="text-xl">{k.title}</h3>
              <ul className="mt-3 grid gap-2 text-sm">
                {k.how.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="text-copper" aria-hidden="true">
                      ›
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-ghost mt-4"
                onClick={() => {
                  setExampleKind(k.id);
                  document.getElementById("contoh")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contoh {k.title.toLowerCase()} →
              </button>
              <button
                type="button"
                className="btn-quiet mt-3 px-0"
                onClick={() => {
                  setKind(k.id);
                  next();
                  document.getElementById("latihan")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Latihan {k.title.toLowerCase()} →
              </button>
            </article>
          ))}
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <article className="card p-5">
            <h3 className="text-xl">Strategi</h3>
            <ul className="mt-3 grid gap-2 text-sm">
              {sub.strategy.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </article>
          <article className="card p-5">
            <h3 className="text-xl">Jebakan umum</h3>
            <ul className="mt-3 grid gap-2 text-sm">
              {sub.traps.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="contoh" className="fase mt-10" aria-label="Contoh dikerjakan">
        <p className="text-sm font-semibold text-copper">Belajar sebelum latihan</p>
        <h2 className="mt-1 text-3xl">Contoh dikerjakan langkah demi langkah</h2>
        <p className="mt-2 text-sm text-muted">
          Baca soal, ikuti penalarannya, lalu tutup contoh dan kerjakan latihan dengan cara yang
          sama.
        </p>
        <div className="mt-4 grid max-w-lg gap-2">
          <label htmlFor="lpdp-example-kind" className="text-sm font-medium">
            Jenis contoh
          </label>
          <select
            id="lpdp-example-kind"
            className="field py-3"
            value={selectedExample}
            onChange={(e) => {
              setExampleKind(e.target.value);
              setExampleSeed(42);
            }}
          >
            {sub.kinds.map((k) => (
              <option key={k.id} value={k.id}>
                {k.title}
              </option>
            ))}
          </select>
        </div>
        {example && (
          <article className="card mt-4 p-5">
            {example.passage && (
              <p className="mb-4 border-l-2 border-copper pl-4 text-sm whitespace-pre-line">
                {example.passage}
              </p>
            )}
            <h3 className="text-xl">{example.q}</h3>
            <LpdpSolution q={example} />
          </article>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => setExampleSeed((s) => s + 1)}>
            Contoh lain
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setKind(selectedExample);
              next();
              document.getElementById("latihan")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Latihan jenis ini
          </button>
        </div>
      </section>

      <section id="latihan" className="fase mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl">Latihan</h2>
            <p className="mt-1 text-sm text-muted">
              {size.curated} soal kurasi{size.generated ? " ditambah soal buatan tanpa batas" : ""}.
              Pembahasan muncul setelah menjawab.
            </p>
          </div>
          <p className="font-display text-2xl tabular-nums">
            {score.right}
            <span className="text-muted">/{score.total}</span>
            <span className="ml-2 text-sm font-normal text-muted">sesi ini</span>
          </p>
        </div>
        <div
          className="chip-row mt-4 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Jenis soal"
        >
          {[{ id: undefined, title: "Semua" }, ...sub.kinds].map((k) => (
            <button
              key={k.title}
              type="button"
              aria-pressed={kind === k.id}
              className={`chip shrink-0 ${kind === k.id ? "border-copper text-copper" : ""}`}
              onClick={() => {
                setKind(k.id);
                next();
              }}
            >
              {k.title}
            </button>
          ))}
        </div>
        {q && pick === null && (
          <div className="mt-4">
            <button
              type="button"
              className="btn-quiet px-0"
              aria-expanded={hint}
              onClick={() => setHint((v) => !v)}
            >
              {hint ? "Tutup petunjuk" : "Lihat petunjuk cara memulai"}
            </button>
            {hint && (
              <ol className="card mt-2 list-decimal space-y-2 py-4 pr-4 pl-10 text-sm">
                {sub.kinds
                  .find((k) => k.id === q.kind)
                  ?.how.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
              </ol>
            )}
          </div>
        )}
        <div className="mt-4">
          {q ? (
            <QuestionCard key={`${q.id}-${seed}`} q={q} pick={pick} onPick={answer} reveal />
          ) : (
            <p className="text-muted">Menyiapkan soal…</p>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn" onClick={next}>
            {pick === null ? "Lewati" : "Soal berikutnya"}
          </button>
          <Link to="/lpdp/simulasi" className="btn-ghost">
            Coba simulasi bertimer
          </Link>
        </div>
      </section>
    </Shell>
  );
}
