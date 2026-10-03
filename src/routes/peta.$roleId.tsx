import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { useSave } from "@/lib/progress";
import {
  DONE_AT,
  doneCount,
  flatSteps,
  formatSpan,
  getRoadmap,
  isEnough,
  minutesOf,
  nextStep,
  omittedTopics,
} from "@/lib/roadmaps";
import { getTopic, type TrackId } from "@/lib/topics";
import { getLang, getLesson, roadLangs } from "@/lib/code";
import { projectsOf } from "@/lib/projects";
import { readinessOf } from "@/lib/readiness";
import { ProjectCard } from "@/components/project-card";

export const Route = createFileRoute("/peta/$roleId")({ component: RoadPage });

const TRACK: Record<TrackId, string> = {
  math: "Matematika",
  physics: "Fisika",
  advanced: "Lanjutan",
};

function RoadPage() {
  const { roleId } = Route.useParams();
  const road = getRoadmap(roleId);
  const { save, setRoad } = useSave();

  if (!road) {
    return (
      <Shell>
        <h1 className="text-4xl">Peta ini tidak ada.</h1>
        <Link to="/peta" className="btn mt-6">
          Semua peta
        </Link>
      </Shell>
    );
  }

  const required = flatSteps(road, false);
  const optional = flatSteps(road, true);
  const done = doneCount(road, save, false);
  const upcoming = nextStep(road, save);
  const upcomingTopic = upcoming ? getTopic(upcoming.topicId) : undefined;
  const leftOut = omittedTopics(road);
  const ready = readinessOf(road, save);
  const langs = roadLangs(road.id);
  const projects = projectsOf(road.id);
  let cursor = 0;

  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">{road.kicker}</p>
      <h1 className="mt-1 text-4xl md:text-5xl">{road.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{road.summary}</p>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Bagian peta">
        {road.phases.map((phase, index) => (
          <a key={phase.title} href={`#fase-${index}`} className="chip shrink-0">
            {phase.title}
          </a>
        ))}
        <a href="#bahasa" className="chip shrink-0">
          Bahasa pemrograman
        </a>
        <a href="#proyek" className="chip shrink-0">
          Proyek
        </a>
      </nav>

      <section className="card mt-6 p-5" aria-label="Kesiapan kerja">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-copper">Kesiapan kerja</p>
            <p className="mt-1 font-display text-5xl tabular-nums leading-none">
              {ready.score}
              <span className="text-2xl text-muted">%</span>
            </p>
          </div>
          <p className="max-w-sm text-sm text-muted">Teori 40%, bahasa pemrograman 30%, proyek 30%. Perkiraan kasar untuk mengarahkan belajar, bukan sertifikat.</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Materi inti cukup", ready.theory],
            ["Pelajaran kode wajib", ready.code],
            ["Tahap proyek", ready.project],
          ].map(([label, part]) => {
            const p = part as { done: number; total: number };
            return (
              <div key={label as string}>
                <div className="flex justify-between text-sm">
                  <span>{label as string}</span>
                  <span className="tabular-nums text-muted">
                    {p.done}/{p.total}
                  </span>
                </div>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line">
                  <span className="block h-full bg-copper" style={{ width: `${p.total ? Math.round((p.done / p.total) * 100) : 0}%` }} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-3 md:grid-cols-12">
        <div className="card p-5 md:col-span-7">
          <p className="font-display text-5xl tabular-nums leading-none">
            {done}
            <span className="text-muted">/{required.length}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            pelajaran inti cukup · {formatSpan(minutesOf(required))}
            {optional.length ? ` · ${optional.length} cabang boleh belakangan` : ""}
          </p>
          <span className="mt-4 block h-1.5 overflow-hidden rounded-full bg-line">
            <span
              className="block h-full bg-copper"
              style={{ width: `${required.length ? Math.round((done / required.length) * 100) : 0}%` }}
            />
          </span>
          <p className="mt-4">{road.outcome}</p>
          <p className="mt-3 text-sm text-muted">
            Cukup = {DONE_AT} jawaban benar, minimal satu di level Sedang atau Tantangan. Itu tanda cukup untuk peta ini, bukan mahir.
          </p>
          {save.road === road.id ? (
            <p className="mt-3 text-sm font-semibold text-copper">Peta ini yang dipakai tombol lanjut di beranda.</p>
          ) : (
            <button type="button" className="btn mt-4" onClick={() => setRoad(road.id)}>
              Pakai peta ini di beranda
            </button>
          )}
        </div>
        <div className="card flex flex-col justify-between gap-4 p-5 md:col-span-5">
          {upcomingTopic ? (
            <>
              <div>
                <p className="text-sm font-semibold text-copper">Berikutnya</p>
                <p className="mt-2 text-3xl">{upcomingTopic.title}</p>
                <p className="mt-2 text-sm text-muted">{upcoming?.why}</p>
              </div>
              <Link to="/belajar/$topicId" params={{ topicId: upcomingTopic.id }} className="btn">
                Buka pelajaran
              </Link>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold text-copper">Inti selesai</p>
                <p className="mt-2">Pelajaran wajib peta ini sudah cukup. Cabang di bawah boleh, katalog juga.</p>
              </div>
              <Link to="/" className="btn-ghost">
                Ke katalog
              </Link>
            </>
          )}
        </div>
      </div>

      {road.phases.map((phase, index) => (
        <section key={phase.title} id={`fase-${index}`} className="fase mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-mono text-sm text-copper">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-1 text-3xl">{phase.title}</h2>
            </div>
            {phase.steps.every((step) => step.optional) ? <span className="chip">Boleh dilewati dulu</span> : null}
          </div>
          <p className="mb-4 max-w-2xl text-sm text-muted">{phase.note}</p>
          <ol className="card rail overflow-hidden">
            {phase.steps.map((step) => {
              if (!step.optional) cursor += 1;
              const topic = getTopic(step.topicId);
              if (!topic) return null;
              const score = save.correct[topic.id] ?? 0;
              const enough = isEnough(save, topic.id);
              const here = upcoming?.topicId === topic.id;
              const label = enough ? "Cukup" : score > 0 ? "Mulai" : "Belum";
              return (
                <li key={topic.id}>
                  <Link
                    to="/belajar/$topicId"
                    params={{ topicId: topic.id }}
                    className="step-link flex items-start gap-4 px-4 py-4"
                  >
                    <span className={`dot ${enough ? "on" : ""} ${here ? "next" : ""}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-mono text-sm text-muted">
                          {step.optional ? "cabang" : String(cursor).padStart(2, "0")}
                        </span>
                        <span className="font-medium">{topic.title}</span>
                        {here ? <span className="text-sm font-semibold text-copper">Berikutnya</span> : null}
                      </span>
                      <span className="mt-1 block text-sm text-muted">{step.why}</span>
                      <span className="mt-2 block text-sm text-muted">{TRACK[topic.track]}</span>
                    </span>
                    <span className="shrink-0 text-right text-sm">
                      <span className={enough ? "font-semibold text-copper" : "text-muted"}>{label}</span>
                      <span className="mt-1 block text-muted">{topic.minutes} mnt</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <section id="bahasa" className="fase mt-10">
        <p className="font-mono text-sm text-copper">Kode</p>
        <h2 className="mt-1 text-3xl">Bahasa pemrograman</h2>
        <p className="mt-2 mb-4 max-w-2xl text-sm text-muted">Urut dari yang paling dipakai profesi ini. Kerjakan pelajaran wajib sambil menempuh materi di atas; contohnya memakai rumus yang sama.</p>
        <div className="grid gap-3">
          {langs.map((item) => {
            const lang = getLang(item.lang);
            const done = item.lessons.filter((id) => save.code[id]).length;
            return (
              <article key={item.lang} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl">
                      {lang.name}
                      {item.optional ? <span className="ml-2 text-sm font-normal text-muted">pilihan</span> : null}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{item.why}</p>
                  </div>
                  <p className="font-display text-xl tabular-nums">
                    {done}
                    <span className="text-muted">/{item.lessons.length}</span>
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.lessons.map((id) => {
                    const lesson = getLesson(id)!;
                    return (
                      <Link key={id} to="/kode/$lessonId" params={{ lessonId: id }} className={`chip ${save.code[id] ? "border-copper text-copper" : ""}`}>
                        {save.code[id] ? "✓ " : ""}
                        {lesson.title}
                      </Link>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="proyek" className="fase mt-10">
        <p className="font-mono text-sm text-copper">Praktik</p>
        <h2 className="mt-1 text-3xl">Proyek studi kasus</h2>
        <p className="mt-2 mb-4 max-w-2xl text-sm text-muted">Mulai proyek pemula setelah fase pertama terasa ringan. Proyek portofolio menggabungkan hampir seluruh peta.</p>
        <div className="grid items-stretch gap-3 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} done={save.proj[project.id]?.length ?? 0} />
          ))}
        </div>
      </section>

      <section className="card mt-10 p-5">
        <h2 className="text-3xl">Di luar bidang ini</h2>
        <p className="mt-3 max-w-2xl text-muted">{road.skip}</p>
        <p className="mt-3 text-sm text-muted">
          {leftOut.length} materi katalog tidak masuk peta {road.title}. Bukan terlupa — bukan alat harian profesi ini. Tetap bisa dibuka.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {leftOut.map((topic) => (
            <Link key={topic.id} to="/belajar/$topicId" params={{ topicId: topic.id }} className="chip">
              {topic.title}
            </Link>
          ))}
        </div>
        <Link to="/peta" className="btn-ghost mt-5">
          Peta lain
        </Link>
      </section>
    </Shell>
  );
}
