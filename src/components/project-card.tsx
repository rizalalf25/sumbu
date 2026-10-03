import { Link } from "@tanstack/react-router";
import { LEVEL_LABEL, type Project } from "@/lib/projects";

export function ProjectCard({ project, done }: { project: Project; done: number }) {
  const total = project.milestones.length;
  return (
    <Link to="/proyek/$projectId" params={{ projectId: project.id }} className="card card-link flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-copper">
          {LEVEL_LABEL[project.level]} · ±{project.hours} jam
        </p>
        <p className="font-display text-xl tabular-nums leading-none">
          {done}
          <span className="text-muted">/{total}</span>
        </p>
      </div>
      <h3 className="mt-3 text-xl">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.brief}</p>
      <span className="mt-4 block h-1.5 overflow-hidden rounded-full bg-line">
        <span className="block h-full bg-copper" style={{ width: `${Math.round((done / total) * 100)}%` }} />
      </span>
    </Link>
  );
}
