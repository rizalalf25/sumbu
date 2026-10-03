import { createFileRoute, Link } from "@tanstack/react-router";
import { FocusToggle, Shell } from "@/components/shell";
import { getLesson } from "@/lib/code";
import { BuildGuide, ShoppingList } from "@/components/kit-panel";
import { kitOf } from "@/lib/kits";
import { useSave } from "@/lib/progress";
import { getProject, LEVEL_LABEL, projectsOf } from "@/lib/projects";
import { getRoadmap } from "@/lib/roadmaps";
import { getTopic } from "@/lib/topics";

export const Route = createFileRoute("/proyek/$projectId")({ component: ProjectPage });

function ProjectPage() {
  const { projectId } = Route.useParams();
  const project = getProject(projectId);
  const { save, toggleMilestone, toggleOwned, toggleBuild } = useSave();

  if (!project) {
    return (
      <Shell>
        <h1 className="text-4xl">Proyek tidak ketemu</h1>
        <Link to="/proyek" className="btn mt-6">
          Semua proyek
        </Link>
      </Shell>
    );
  }

  const road = getRoadmap(project.road);
  const done = new Set(save.proj[project.id] ?? []);
  const total = project.milestones.length;
  const other = projectsOf(project.road).find((item) => item.id !== project.id);
  const kit = kitOf(project.id);
  const owned = new Set(save.kit[project.id] ?? []);
  const built = new Set(save.build[project.id] ?? []);

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/peta/$roleId" params={{ roleId: project.road }} className="text-sm font-semibold text-copper">
            Proyek {road?.title}
          </Link>
          <h1 className="mt-1 text-4xl">{project.title}</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-3 text-sm text-muted">
        {LEVEL_LABEL[project.level]} · sekitar {project.hours} jam · {done.size}/{total} tahap selesai
      </p>
      <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-line">
        <span className="block h-full bg-copper" style={{ width: `${Math.round((done.size / total) * 100)}%` }} />
      </span>

      <article className="card mt-5 p-5">
        <p className="text-sm font-semibold text-copper">Studi kasus</p>
        <p className="mt-2 text-lg">{project.brief}</p>
        <p className="mt-4 border-l-2 border-copper pl-3">
          <span className="font-semibold">Hasil akhir: </span>
          {project.goal}
        </p>
      </article>

      <nav className="chip-row mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Bagian proyek">
        {kit ? (
          <>
            <a href="#belanja" className="chip shrink-0">
              Daftar belanja
            </a>
            <a href="#rakit" className="chip shrink-0">
              Panduan rakit
            </a>
          </>
        ) : null}
        <a href="#tahapan" className="chip shrink-0">
          Tahapan
        </a>
        <a href="#portofolio" className="chip shrink-0">
          Portofolio
        </a>
      </nav>

      {project.safety ? (
        <article className="card mt-4 border-signal p-5">
          <p className="text-sm font-semibold text-signal">Keselamatan</p>
          <p className="mt-2">{project.safety}</p>
        </article>
      ) : null}

      {kit ? (
        <>
          <ShoppingList title={project.title} kit={kit} owned={owned} onToggle={(i) => toggleOwned(project.id, i)} />
          <BuildGuide kit={kit} done={built} onToggle={(i) => toggleBuild(project.id, i)} />
        </>
      ) : (
        <article id="belanja" className="card mt-4 p-5">
          <p className="text-sm font-semibold text-copper">Tidak perlu membeli perangkat</p>
          <p className="mt-2">
            Proyek ini cukup dengan laptop (RAM ≥ 8 GB) dan akun gratis. Pustaka, data, dan layanan yang dipakai ada di bagian “Alat dan bahan” di bawah.
          </p>
        </article>
      )}

      <section id="tahapan" className="fase mt-10">
        <h2 className="text-3xl">Tahapan {kit ? "belajar dan analisis" : "proyek"}</h2>
        <p className="mt-2 text-sm text-muted">Centang tahap yang selesai. Tersimpan di peramban ini.</p>
        <ol className="card rail mt-4 overflow-hidden">
          {project.milestones.map((m, i) => {
            const topic = m.topic ? getTopic(m.topic) : undefined;
            const lesson = m.lesson ? getLesson(m.lesson) : undefined;
            const checked = done.has(i);
            return (
              <li key={m.t} className="flex items-start gap-4 px-4 py-4">
                <input
                  type="checkbox"
                  className="mt-1.5 h-5 w-5 shrink-0 accent-[var(--color-copper)]"
                  checked={checked}
                  onChange={() => toggleMilestone(project.id, i)}
                  aria-label={`Tahap ${i + 1}: ${m.t}`}
                />
                <div className="min-w-0 flex-1">
                  <p className={`font-medium ${checked ? "text-muted line-through" : ""}`}>
                    <span className="mr-2 font-mono text-sm text-copper">{String(i + 1).padStart(2, "0")}</span>
                    {m.t}
                  </p>
                  <p className="mt-1 text-sm text-muted">{m.d}</p>
                  {topic || lesson ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {topic ? (
                        <Link to="/belajar/$topicId" params={{ topicId: topic.id }} className="chip">
                          Materi: {topic.title}
                        </Link>
                      ) : null}
                      {lesson ? (
                        <Link to="/kode/$lessonId" params={{ lessonId: lesson.id }} className="chip">
                          Kode: {lesson.title}
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="portofolio" className="fase mt-8 grid gap-3 md:grid-cols-2">
        <article className="card p-5">
          <h2 className="text-2xl">Alat dan bahan</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card p-5">
          <h2 className="text-2xl">Untuk portofolio</h2>
          <ul className="mt-3 grid gap-2 text-sm">
            {project.deliver.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <article className="card mt-3 p-5">
        <h2 className="text-2xl">Kalau sudah selesai</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {project.extend.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/proyek" className="btn-ghost">
          Semua proyek
        </Link>
        {other ? (
          <Link to="/proyek/$projectId" params={{ projectId: other.id }} className="btn">
            Proyek lain: {other.title}
          </Link>
        ) : null}
      </div>
    </Shell>
  );
}
