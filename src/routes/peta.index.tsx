import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { useSave } from "@/lib/progress";
import { doneCount, flatSteps, formatSpan, getRoadmap, minutesOf, type Roadmap } from "@/lib/roadmaps";

export const Route = createFileRoute("/peta/")({ component: Roads });

const GROUPS: { title: string; note: string; ids: string[] }[] = [
  {
    title: "Data dan model",
    note: "Tiga pekerjaan yang sering tertukar. Pelajarannya tidak sama.",
    ids: ["analis", "ilmuwan", "ai"],
  },
  {
    title: "STEM lain",
    note: "Hanya bab yang dipakai profesi itu, bukan seluruh katalog.",
    ids: ["aktuaris", "elektro", "mesin", "fisikawan"],
  },
];

function Roads() {
  const { save } = useSave();
  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">Peta profesi</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Ambil yang penting saja.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Setiap peta memegang pelajaran katalog yang bidang itu pakai. Inti dihitung dulu. Cabang ada di peta yang sama, di bawah. Yang bukan bidangnya tertulis di tiap halaman, bukan disembunyikan.
      </p>

      {GROUPS.map((group) => (
        <section key={group.title} className="mt-10">
          <h2 className="text-3xl">{group.title}</h2>
          <p className="mt-2 mb-4 max-w-2xl text-sm text-muted">{group.note}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.ids.map((id) => {
              const road = getRoadmap(id);
              if (!road) return null;
              return <RoadCard key={id} road={road} correct={save.correct} active={save.road === id} />;
            })}
          </div>
        </section>
      ))}
    </Shell>
  );
}

function RoadCard({
  road,
  correct,
  active,
}: {
  road: Roadmap;
  correct: Record<string, number>;
  active?: boolean;
}) {
  const required = flatSteps(road, false);
  const done = doneCount(road, correct, false);
  const ratio = required.length ? done / required.length : 0;
  return (
    <Link to="/peta/$roleId" params={{ roleId: road.id }} className={`card card-link block p-5 ${active ? "border-copper" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-copper">{road.kicker}</p>
        <p className="font-display text-3xl tabular-nums leading-none">
          {done}
          <span className="text-muted">/{required.length}</span>
        </p>
      </div>
      <h2 className="mt-2 text-2xl">{road.title}</h2>
      <p className="mt-2 text-sm text-muted">{road.line}</p>
      <p className="mt-3 text-sm text-muted">{formatSpan(minutesOf(required))} inti</p>
      <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-line">
        <span className="block h-full bg-copper" style={{ width: `${Math.round(ratio * 100)}%` }} />
      </span>
      {active ? <p className="mt-3 text-sm font-semibold text-copper">Peta aktif</p> : null}
    </Link>
  );
}
