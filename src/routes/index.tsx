import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/shell";
import { useSave } from "@/lib/progress";
import { doneCount, flatSteps, getRoadmap, nextStep, ROADMAPS } from "@/lib/roadmaps";
import { TRACKS, allTopics, bankTotal, getTopic } from "@/lib/topics";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { save } = useSave();
  const [query, setQuery] = useState("");
  const topics = allTopics();
  const total = bankTotal();
  const solved = Object.values(save.correct).reduce((sum, n) => sum + n, 0);
  const road = save.road ? getRoadmap(save.road) : undefined;
  const roadNext = road ? nextStep(road, save.correct) : undefined;
  const next = useMemo(() => {
    if (roadNext) {
      const topic = getTopic(roadNext.topicId);
      if (topic) return topic;
    }
    if (save.lastTopic && getTopic(save.lastTopic)) return getTopic(save.lastTopic)!;
    return topics.find((topic) => (save.correct[topic.id] ?? 0) < 5) ?? topics[0];
  }, [roadNext, save.lastTopic, save.correct, topics]);

  const filtered = topics.filter((topic) => {
    const blob = `${topic.title} ${topic.blurb} ${topic.chapter ?? ""}`.toLowerCase();
    return blob.includes(query.trim().toLowerCase());
  });

  return (
    <Shell wide>
      <section className="orbit-hero">
        <img className="orbit-photo" src="/hero-space.jpg" alt="" />
        <div className="orbit-copy">
          <p className="font-mono text-xs font-semibold tracking-[0.22em] text-copper">ORBIT BELAJAR</p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">Satu napas. Satu konsep.</h1>
          <p className="mt-3 text-base text-ink md:text-lg">
            Matematika dan fisika untuk perhatian yang mudah loncat. Rumus cepat, gambar yang bisa digerakkan, kasus nyata, lalu soal — tidak semuanya sekaligus.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/belajar/$topicId" params={{ topicId: next.id }} className="btn">
              Lanjut: {next.title}
            </Link>
            <Link to="/metode" className="btn-ghost">
              Cara belajar 12 menit
            </Link>
            <Link to="/peta" className="btn-ghost">
              Peta profesi
            </Link>
          </div>
          {road ? (
            <p className="mt-3 text-sm text-muted">
              {roadNext
                ? `Peta aktif: ${road.title}. Tombol lanjut mengikuti pelajaran berikutnya di peta itu.`
                : `Inti peta ${road.title} sudah cukup. Tombol lanjut kembali ke katalog.`}
            </p>
          ) : null}
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <Stat label="Benar" value={String(solved)} />
            <Stat label="Hari" value={String(save.dayStreak)} />
            <Stat label="Variasi" value={compact(total)} />
          </div>
          <p className="mt-3 text-sm text-muted">
            Bank soal dihitung ulang dari parameter, jadi latihannya tidak habis. Catatan tersimpan di peramban ini.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-3 md:grid-cols-3">
        {[
          ["1", "Baca satu ide", "Jangan scroll mencari rumus sebelum ide intinya bisa diucapkan."],
          ["2", "Gerakkan satu slider", "Sebut apa yang berubah. Kalau tidak berubah, itu juga jawaban."],
          ["3", "Lima soal, dua kalimat", "Salah itu data. Catat dengan kata sendiri, bukan salinan rumus."],
        ].map(([n, title, body]) => (
          <article key={n} className="card p-4">
            <p className="font-mono text-sm text-copper">{n}</p>
            <h2 className="mt-2 text-2xl">{title}</h2>
            <p className="mt-2 text-sm text-muted">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-copper">Peta profesi</p>
            <h2 className="text-3xl">Ambil yang penting saja</h2>
          </div>
          <Link to="/peta" className="text-sm font-semibold text-copper">
            Semua peta
          </Link>
        </div>
        <p className="mb-4 max-w-2xl text-sm text-muted">
          Bukan seluruh katalog untuk setiap orang. Inti di depan, cabang di bawah, dan materi di luar bidang tertulis di halaman petanya.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROADMAPS.map((item) => {
            const required = flatSteps(item, false);
            const done = doneCount(item, save.correct, false);
            const ratio = required.length ? done / required.length : 0;
            return (
              <Link
                key={item.id}
                to="/peta/$roleId"
                params={{ roleId: item.id }}
                className={`card card-link block p-5 ${save.road === item.id ? "border-copper" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-copper">{item.kicker}</p>
                  <p className="font-display text-3xl tabular-nums leading-none">
                    {done}
                    <span className="text-muted">/{required.length}</span>
                  </p>
                </div>
                <h3 className="mt-2 text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.line}</p>
                <span className="mt-4 block h-1.5 overflow-hidden rounded-full bg-line">
                  <span className="block h-full bg-copper" style={{ width: `${Math.round(ratio * 100)}%` }} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <label className="mt-10 block">
        <span className="sr-only">Cari materi</span>
        <input
          className="field"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari materi, misalnya Fourier atau parabola"
        />
      </label>

      {TRACKS.map((track) => {
        const rows = filtered.filter((topic) => topic.track === track.id);
        if (!rows.length) return null;
        return (
          <section key={track.id} className="mt-10">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-copper">{track.kicker}</p>
                <h2 className="text-3xl">{track.title}</h2>
              </div>
            </div>
            <p className="mb-4 max-w-2xl text-sm text-muted">{track.note}</p>
            <ol className="card divide-y divide-line">
              {rows.map((topic, index) => {
                const done = save.correct[topic.id] ?? 0;
                return (
                  <li key={topic.id}>
                    <Link
                      to="/belajar/$topicId"
                      params={{ topicId: topic.id }}
                      className="flex items-center gap-4 px-4 py-4"
                    >
                      <span className="w-8 font-mono text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{topic.title}</span>
                        <span className="block truncate text-sm text-muted">{topic.blurb}</span>
                      </span>
                      <span className="hidden text-right text-sm text-muted sm:block">
                        {topic.minutes} mnt
                        <span className="mt-1 block h-1 w-16 overflow-hidden rounded-full bg-line">
                          <span className="block h-full bg-copper" style={{ width: `${Math.min(100, done * 20)}%` }} />
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
      {!filtered.length ? <p className="mt-8 text-muted">Tidak ada materi dengan kata itu. Coba “limit”, “gaya”, atau “Laplace”.</p> : null}
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-3xl tabular-nums">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function compact(n: number) {
  if (n >= 1000) return `${Math.round(n / 100) / 10}rb`.replace(".", ",");
  return String(n);
}
