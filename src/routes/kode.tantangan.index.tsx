import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { CHALLENGES, type ChallengeLevel } from "@/lib/challenges";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/kode/tantangan/")({ component: ChallengeHome });

const LEVELS: { id: ChallengeLevel; title: string; note: string }[] = [
  { id: "dasar", title: "Dasar", note: "Satu fungsi, satu ide. Cocok setelah pelajaran dasar." },
  { id: "menengah", title: "Menengah", note: "Algoritma dan statistik yang benar-benar dipakai kerja." },
  { id: "lanjut", title: "Lanjut", note: "Simulasi, kendali, dan proses acak." },
];

function ChallengeHome() {
  const { save } = useSave();
  const done = CHALLENGES.filter((c) => save.challenge[c.id]).length;
  return (
    <Shell wide>
      <Link to="/kode" className="text-sm font-semibold text-copper">
        Bahasa pemrograman
      </Link>
      <h1 className="mt-1 text-4xl md:text-5xl">Tantangan kode</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Tulis kodenya sendiri, lalu tekan Uji. Kodemu dijalankan di peramban dan diperiksa dengan tes otomatis, seperti di wawancara teknis dan pekerjaan sungguhan.
      </p>
      <p className="mt-3 font-display text-3xl tabular-nums">
        {done}
        <span className="text-muted">/{CHALLENGES.length}</span>
        <span className="ml-2 text-base font-normal text-muted">lulus</span>
      </p>

      {LEVELS.map((level) => {
        const rows = CHALLENGES.filter((c) => c.level === level.id);
        return (
          <section key={level.id} className="mt-10">
            <h2 className="text-3xl">{level.title}</h2>
            <p className="mt-1 mb-4 text-sm text-muted">{level.note}</p>
            <ol className="card divide-y divide-line">
              {rows.map((c) => (
                <li key={c.id}>
                  <Link to="/kode/tantangan/$challengeId" params={{ challengeId: c.id }} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="w-16 shrink-0 font-mono text-xs uppercase text-muted">{c.lang === "python" ? "Python" : "SQL"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{c.title}</span>
                      <span className="block truncate text-sm text-muted">{c.task}</span>
                    </span>
                    <span className={`shrink-0 text-sm ${save.challenge[c.id] ? "font-semibold text-copper" : "text-muted"}`}>
                      {save.challenge[c.id] ? "Lulus" : "Belum"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </Shell>
  );
}
