import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
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

export const Route = createFileRoute("/peta/$roleId")({ component: RoadPage });

const TRACK: Record<TrackId, string> = {
  math: "Matematika",
  physics: "Fisika",
  advanced: "Lanjutan",
};

function RoadPage() {
  const { roleId } = Route.useParams();
  const road = getRoadmap(roleId);
  const { save, ready, setRoad } = useSave();

  useEffect(() => {
    if (!ready || !road) return;
    if (save.road !== road.id) setRoad(road.id);
  }, [ready, road, save.road, setRoad]);

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
  const done = doneCount(road, save.correct, false);
  const upcoming = nextStep(road, save.correct);
  const upcomingTopic = upcoming ? getTopic(upcoming.topicId) : undefined;
  const leftOut = omittedTopics(road);
  let cursor = 0;

  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">{road.kicker}</p>
      <h1 className="mt-1 text-4xl md:text-5xl">{road.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{road.summary}</p>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Fase peta">
        {road.phases.map((phase, index) => (
          <a key={phase.title} href={`#fase-${index}`} className="chip shrink-0">
            {phase.title}
          </a>
        ))}
      </nav>

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
            {DONE_AT} jawaban benar = cukup untuk peta ini, bukan mahir. Peta ini aktif di beranda.
          </p>
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
              const enough = isEnough(score);
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
