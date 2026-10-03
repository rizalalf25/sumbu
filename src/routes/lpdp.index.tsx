import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { bankSize, DISCLAIMER, OFFICIAL_URL, PLAN, STAGES, SUBTES } from "@/lib/lpdp";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/lpdp/")({ component: LpdpHome });

function LpdpHome() {
  const { save } = useSave();
  const { right, sims } = save.lpdp;
  const last = sims.at(-1);
  const best = sims.reduce((m, s) => Math.max(m, Math.round((s.correct / s.total) * 100)), 0);

  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">Beasiswa LPDP</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Persiapan seleksi, satu tahap demi satu.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Materi dan bank soal tes bakat skolastik (verbal, kuantitatif, penalaran), simulasi bertimer, latihan esai, dan latihan wawancara. Progres tersimpan di peramban ini.
      </p>
      <p className="card mt-4 max-w-3xl border-signal p-4 text-sm">
        <span className="font-semibold text-signal">Penting: </span>
        {DISCLAIMER}{" "}
        <a href={OFFICIAL_URL} target="_blank" rel="noreferrer" className="font-semibold text-copper underline-offset-4 hover:underline">
          lpdp.kemenkeu.go.id
        </a>
      </p>

      <section className="mt-10">
        <h2 className="text-3xl">Tahapan seleksi</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {STAGES.map((stage, i) => (
            <li key={stage.title} className="card flex flex-col p-5">
              <p className="font-mono text-sm text-copper">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-xl">{stage.title}</h3>
              <p className="mt-2 text-sm text-muted">{stage.body}</p>
              <ul className="mt-3 grid gap-1.5 text-sm">
                {stage.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-copper" aria-hidden="true">
                      ›
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl">Tes bakat skolastik</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">Setiap subtes: materi, strategi, jebakan umum, dan latihan dengan pembahasan langsung.</p>
        <div className="mt-4 grid items-stretch gap-3 md:grid-cols-3">
          {SUBTES.map((sub) => {
            const size = bankSize(sub.id);
            const done = Object.keys(right).filter((key) => key.startsWith(`${sub.id}:`)).length;
            return (
              <Link key={sub.id} to="/lpdp/$sub" params={{ sub: sub.id }} className="card card-link flex h-full flex-col p-5">
                <p className="text-sm font-semibold text-copper">{sub.kicker}</p>
                <h3 className="mt-2 text-2xl">{sub.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{sub.summary}</p>
                <p className="mt-3 text-sm">
                  {size.curated} soal kurasi{size.generated ? " + soal buatan tanpa batas" : ""}
                  <span className="text-muted"> · {done} pernah benar</span>
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <Link to="/lpdp/simulasi" className="card card-link mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <span>
          <span className="block text-sm font-semibold text-copper">Simulasi bertimer</span>
          <span className="mt-1 block text-2xl">30 soal campuran, 30 menit</span>
          <span className="mt-1 block text-sm text-muted">
            {last ? `Terakhir ${last.correct}/${last.total} · terbaik ${best}%` : "Belum pernah mencoba. Mulai untuk mengetahui posisi awalmu."}
          </span>
        </span>
        <span className="btn">Mulai simulasi</span>
      </Link>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        <Link to="/lpdp/esai" className="card card-link p-5">
          <p className="text-sm font-semibold text-copper">Esai</p>
          <h3 className="mt-2 text-2xl">Esai administrasi dan on the spot</h3>
          <p className="mt-2 text-sm text-muted">Struktur, pertanyaan pemandu esai kontribusi dan rencana studi, 10 tema latihan, editor bertimer dengan penghitung kata.</p>
        </Link>
        <Link to="/lpdp/wawancara" className="card card-link p-5">
          <p className="text-sm font-semibold text-copper">Wawancara</p>
          <h3 className="mt-2 text-2xl">Latihan wawancara substansi</h3>
          <p className="mt-2 text-sm text-muted">Metode STAR, 24 pertanyaan dalam 6 kelompok, latihan acak dengan timer 2 menit dan catatan jawaban.</p>
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-3xl">Rencana 8 minggu</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {PLAN.map((p) => (
            <article key={p.week} className="card p-5">
              <p className="text-sm font-semibold text-copper">{p.week}</p>
              <h3 className="mt-1 text-xl">{p.focus}</h3>
              <ul className="mt-3 grid gap-1.5 text-sm">
                {p.tasks.map((task) => (
                  <li key={task} className="flex gap-2">
                    <span className="text-copper" aria-hidden="true">
                      ›
                    </span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}

