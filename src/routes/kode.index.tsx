import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { LANGS, lessonsOf } from "@/lib/code";
import { useSave } from "@/lib/progress";

export const Route = createFileRoute("/kode/")({ component: CodeHome });

function CodeHome() {
  const { save } = useSave();
  return (
    <Shell wide>
      <p className="text-sm font-semibold text-copper">Bahasa pemrograman</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Matematika yang dijalankan mesin.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Setiap pelajaran memakai materi yang sudah kamu kenal: diskon, regresi, PID, entropi. Baca kodenya, tebak keluarannya, lalu jalankan sendiri di alat yang disarankan.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Bahasa mana yang perlu dipelajari dulu tergantung peta profesimu; daftarnya ada di halaman tiap peta.
      </p>

      {LANGS.map((lang) => {
        const lessons = lessonsOf(lang.id);
        const done = lessons.filter((lesson) => save.code[lesson.id]).length;
        return (
          <section key={lang.id} className="mt-10">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-copper">{lang.kicker}</p>
                <h2 className="text-3xl">{lang.name}</h2>
              </div>
              <p className="font-display text-2xl tabular-nums">
                {done}
                <span className="text-muted">/{lessons.length}</span>
              </p>
            </div>
            <p className="mb-3 max-w-2xl text-sm text-muted">{lang.summary}</p>
            <p className="mb-4 text-sm">
              Coba tanpa repot:{" "}
              <a href={lang.tryUrl} target="_blank" rel="noreferrer" className="font-semibold text-copper underline-offset-4 hover:underline">
                {lang.tryLabel}
              </a>
            </p>
            <ol className="card divide-y divide-line">
              {lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <Link to="/kode/$lessonId" params={{ lessonId: lesson.id }} className="flex items-center gap-3 px-4 py-3.5">
                    <span className="w-8 shrink-0 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{lesson.title}</span>
                      <span className="block truncate text-sm text-muted">{lesson.idea}</span>
                    </span>
                    <span className={`shrink-0 text-sm ${save.code[lesson.id] ? "font-semibold text-copper" : "text-muted"}`}>
                      {save.code[lesson.id] ? "Lulus" : `${lesson.minutes} mnt`}
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
