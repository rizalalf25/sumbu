import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { useSave } from "@/lib/progress";
import { projectsOf } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import { ROADMAPS } from "@/lib/roadmaps";

export const Route = createFileRoute("/proyek/")({ component: ProjectsHome });

function ProjectsHome() {
  const { save } = useSave();
  const roads = save.road ? [...ROADMAPS].sort((a, b) => Number(b.id === save.road) - Number(a.id === save.road)) : ROADMAPS;
  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">Proyek studi kasus</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Buktikan dengan sesuatu yang jalan.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Dua proyek untuk setiap peta: satu untuk memulai, satu yang layak masuk portofolio. Setiap tahap menyebut materi dan pelajaran kode yang dipakai, jadi kamu tahu harus kembali ke mana saat macet.
      </p>

      {roads.map((road) => (
        <section key={road.id} className="mt-10">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-copper">{road.kicker}</p>
              <h2 className="text-3xl">{road.title}</h2>
            </div>
            <Link to="/peta/$roleId" params={{ roleId: road.id }} className="text-sm font-semibold text-copper">
              Lihat peta
            </Link>
          </div>
          <div className="grid items-stretch gap-3 md:grid-cols-2">
            {projectsOf(road.id).map((project) => (
              <ProjectCard key={project.id} project={project} done={save.proj[project.id]?.length ?? 0} />
            ))}
          </div>
        </section>
      ))}
    </Shell>
  );
}
