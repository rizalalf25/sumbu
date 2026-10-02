import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { Tex } from "@/components/tex";
import { allTopics } from "@/lib/topics";

export const Route = createFileRoute("/rumus")({ component: Formulas });

function Formulas() {
  const [query, setQuery] = useState("");
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allTopics().flatMap((topic) =>
      topic.formulas
        .filter((formula) => `${topic.title} ${formula.name} ${formula.when}`.toLowerCase().includes(q))
        .map((formula) => ({ topic, formula, key: `${topic.id}-${formula.name}` })),
    );
  }, [query]);

  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">Lembar cepat</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Rumus, satu tarikan napas.</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Bukan untuk dihafal berjejer. Cari yang sedang kamu pakai, sembunyikan rumusnya, coba sebut, baru buka.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <input className="field max-w-md" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari, misalnya momentum" />
        <button type="button" className="btn-ghost" onClick={() => setHide((value) => !value)}>
          {hide ? "Tampilkan semua" : "Sembunyikan untuk diingat"}
        </button>
      </div>
      <ul className="mt-6 grid gap-3">
        {rows.map((row) => {
          const shown = !hide || open === row.key;
          return (
            <li key={row.key} className="card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl">{row.formula.name}</h2>
                <Link to="/belajar/$topicId" params={{ topicId: row.topic.id }} className="text-sm font-semibold text-copper">
                  {row.topic.title}
                </Link>
              </div>
              <div className="my-2 min-h-10">
                {shown ? <Tex tex={row.formula.tex} display /> : <p className="text-sm text-muted">Tersembunyi.</p>}
              </div>
              <p className="text-sm text-muted">{row.formula.when}</p>
              {hide ? (
                <button type="button" className="btn-quiet mt-2 px-0" onClick={() => setOpen(open === row.key ? null : row.key)}>
                  {shown ? "Tutup" : "Ingat, lalu buka"}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
      {!rows.length ? <p className="mt-6 text-muted">Tidak ada rumus dengan kata itu.</p> : null}
    </Shell>
  );
}
