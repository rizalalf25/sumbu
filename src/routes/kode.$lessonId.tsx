import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CodeBlock, CodeEditor, CopyButton, RunPanel } from "@/components/code-view";
import { FocusToggle, Shell } from "@/components/shell";
import { getLang, getLesson, LEVEL_LABEL, lessonsOf } from "@/lib/code";
import { CODE_COACH, CODE_STEPS, codeGuide, codeProgressKey } from "@/lib/code-learning";
import { useSave } from "@/lib/progress";
import { getTopic } from "@/lib/topics";

export const Route = createFileRoute("/kode/$lessonId")({ component: LessonRoute });
function LessonRoute() {
  const { lessonId } = Route.useParams();
  return <CodeLessonPage key={lessonId} lessonId={lessonId} />;
}
function CodeLessonPage({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);
  const { save, ready, passLesson, setStep, setNote, setDraft } = useSave();
  const [pick, setPick] = useState<number | null>(null);
  const [step, setLocalStep] = useState(0);
  const [resumed, setResumed] = useState(false);
  const key = codeProgressKey(lessonId);
  useEffect(() => {
    if (!ready || resumed) return;
    setLocalStep(Math.min(CODE_STEPS.length - 1, save.steps[key] ?? 0));
    setResumed(true);
  }, [ready, resumed, key, save.steps]);
  if (!lesson)
    return (
      <Shell>
        <h1 className="text-4xl">Pelajaran tidak ketemu</h1>
        <Link to="/kode" className="btn mt-6">
          Semua pelajaran kode
        </Link>
      </Shell>
    );
  const lang = getLang(lesson.lang);
  const siblings = lessonsOf(lesson.lang);
  const index = siblings.findIndex((item) => item.id === lesson.id);
  const next = siblings[index + 1];
  const topic = lesson.topic ? getTopic(lesson.topic) : undefined;
  const answered = pick !== null;
  const correct = pick === lesson.quiz.answer;
  const passed = Boolean(save.code[lesson.id]);
  const guide = codeGuide(lesson);
  const draft = save.drafts[key] ?? lesson.code;
  const go = (target: number) => {
    const n = Math.max(0, Math.min(CODE_STEPS.length - 1, target));
    setLocalStep(n);
    setStep(key, n, false);
  };
  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/kode" className="text-sm font-semibold text-copper">
            {lang.name} · pelajaran {index + 1} dari {siblings.length}
          </Link>
          <h1 className="mt-1 text-4xl">{lesson.title}</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-3 text-sm text-muted">
        {LEVEL_LABEL[lesson.level ?? "dasar"]} · sekitar {lesson.minutes} menit
        {passed ? " · sudah lulus kuis" : ""}
      </p>
      <p className="mt-3 text-sm" aria-live="polite">
        Langkah {step + 1} dari {CODE_STEPS.length}: {CODE_STEPS[step]}
      </p>
      <nav className="chip-row mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="Alur belajar kode">
        {CODE_STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            disabled={!ready}
            aria-current={step === i ? "step" : undefined}
            className={"chip shrink-0 " + (step === i ? "border-copper text-copper" : "")}
            onClick={() => go(i)}
          >
            {i + 1}. {label}
          </button>
        ))}
      </nav>
      <p className="mt-4 text-sm text-muted">{CODE_COACH[step]}</p>
      <section className="mt-5" aria-label={"Langkah " + CODE_STEPS[step]}>
        {step === 0 && (
          <article className="card p-5">
            <p className="text-sm font-semibold text-copper">Janji layar ini</p>
            <h2 className="mt-2 text-2xl">
              Pahami {lesson.title.toLowerCase()}, lalu buktikan lewat satu percobaan.
            </h2>
            <p className="mt-3">
              Anda akan membaca contoh, menebak hasil tanpa menjalankannya, lalu mengubah satu
              bagian untuk melihat dampaknya.
            </p>
            <p className="mt-3 text-sm text-muted">
              Kuis yang dijawab benar mencatat pelajaran lulus. Langkah, catatan, dan draf percobaan
              disimpan dalam progres Anda.
            </p>
            {topic && (
              <Link
                to="/belajar/$topicId"
                params={{ topicId: topic.id }}
                className="btn-quiet mt-3 px-0"
              >
                Bekal materi: {topic.title} →
              </Link>
            )}
          </article>
        )}
        {step === 1 && (
          <article className="card p-5">
            <h2 className="text-2xl">Satu ide</h2>
            <p className="mt-3 text-lg">{lesson.idea}</p>
            <p className="mt-4 border-l-2 border-copper pl-3 text-sm">
              Coba ucapkan: input apa yang masuk, proses apa yang terjadi, dan hasil apa yang ingin
              diperoleh?
            </p>
          </article>
        )}
        {step === 2 && (
          <div className="grid gap-4">
            <CodeBlock code={lesson.code} lang={lesson.lang} label={lang.name + " · contoh asli"} />
            <article className="card p-5">
              <h2 className="text-2xl">Cara membaca contoh</h2>
              <ol className="mt-3 grid gap-3">
                {lesson.explain.map((line, i) => (
                  <li key={line} className="flex gap-3">
                    <span className="font-mono text-copper">{i + 1}.</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm text-muted">
                Tuliskan nilai antara atau baris tabel yang berubah. Alur eksekusi lebih penting
                daripada menghafal setiap karakter.
              </p>
            </article>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-4">
            <CodeBlock code={lesson.code} lang={lesson.lang} label="Telusuri sebelum menjawab" />
            <article className="card p-5">
              <p className="text-sm font-semibold text-copper">Tebak sebelum menjalankan</p>
              <h2 className="mt-1 text-2xl">{lesson.quiz.q}</h2>
              <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Pilihan jawaban">
                {lesson.quiz.options.map((option, i) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={pick === i}
                    disabled={answered || !ready}
                    className={
                      (!answered
                        ? "btn-ghost"
                        : i === lesson.quiz.answer
                          ? "btn"
                          : pick === i
                            ? "btn-ghost border-signal"
                            : "btn-ghost opacity-60") + " justify-start text-left font-mono text-sm"
                    }
                    onClick={() => {
                      setPick(i);
                      if (i === lesson.quiz.answer) passLesson(lesson.id);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {answered && (
                <div className="mt-4" role="status">
                  <p className="font-semibold">
                    {correct
                      ? "Pas. Pelajaran lulus kuis."
                      : "Belum pas. Telusuri lagi sebelum mencoba."}
                  </p>
                  <p className="mt-2 text-muted">{lesson.quiz.why}</p>
                  {!correct && (
                    <button
                      type="button"
                      className="btn-quiet mt-2 px-0"
                      onClick={() => setPick(null)}
                    >
                      Coba lagi
                    </button>
                  )}
                </div>
              )}
            </article>
          </div>
        )}
        {step === 4 && (
          <div className="grid gap-4">
            <article className="card p-5">
              <h2 className="text-2xl">Percobaan kecil</h2>
              <p className="mt-3">{guide.task}</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
                <li>Catat prediksi Anda.</li>
                <li>Ubah hanya satu bagian contoh.</li>
                <li>Jalankan dan bandingkan hasil dengan prediksi.</li>
                <li>Jelaskan penyebab perbedaannya, bila ada.</li>
              </ol>
            </article>
            {lesson.run ? (
              <RunPanel
                initial={lesson.code}
                value={draft}
                onChange={(value) => setDraft(key, value)}
                lang={lesson.lang}
                run={lesson.run}
                label={lang.name}
              />
            ) : (
              <article className="card overflow-hidden">
                <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2">
                  <p className="text-sm">Draf percobaan {lang.name}</p>
                  <CopyButton text={draft} />
                </div>
                <CodeEditor
                  value={draft}
                  onChange={(value) => setDraft(key, value)}
                  lang={lesson.lang}
                  label={"Editor " + lang.name}
                />
                <div className="border-t border-line p-4">
                  <p className="text-sm text-muted">
                    Contoh ini memakai lingkungan atau pustaka yang tidak tersedia di runner halaman
                    ini. Salin draf untuk dicoba pada alat yang disarankan.
                  </p>
                  <a href={lang.tryUrl} target="_blank" rel="noreferrer" className="btn-ghost mt-3">
                    {lang.tryLabel} ↗
                  </a>
                </div>
              </article>
            )}
          </div>
        )}
        {step === 5 && (
          <article className="card p-5">
            <h2 className="text-2xl">Jebakan yang perlu dikenali</h2>
            <p className="mt-3 border-l-2 border-signal pl-3">{guide.trap}</p>
            <p className="mt-4 text-muted">
              Saat hasil berbeda dari dugaan, cek input dan tipe data, lalu nilai antara. Ulangi
              pada contoh kecil sebelum mengubah banyak baris sekaligus.
            </p>
            <button type="button" className="btn-quiet mt-3 px-0" onClick={() => go(4)}>
              Kembali ke percobaan →
            </button>
          </article>
        )}
        {step === 6 && (
          <div className="grid gap-4">
            <article className="card p-5">
              <h2 className="text-2xl">Dengan kata sendiri</h2>
              <p className="mt-2 text-muted">
                Tulis ide yang dipahami dan apa yang terjadi ketika Anda mengubah contoh.
              </p>
              <div className="mt-4 grid gap-2">
                <label htmlFor="code-notes" className="font-medium">
                  Catatan belajar kode
                </label>
                <textarea
                  id="code-notes"
                  className="field min-h-44 py-3 font-sans"
                  value={save.notes[key] ?? ""}
                  disabled={!ready}
                  onChange={(e) => setNote(key, e.target.value, false)}
                  placeholder={
                    "Ide yang saya pahami: …\nSaya mengubah … dan hasilnya …\nJebakan yang perlu saya ingat: …"
                  }
                />
              </div>
            </article>
            <p className="text-sm text-muted">
              {passed
                ? "Kuis sudah lulus. Anda bisa lanjut atau mengulang langkah yang belum mantap."
                : "Kuis belum lulus. Coba langkah Tebak untuk memeriksa pemahaman; Anda tetap boleh menjelajahi pelajaran lain."}
            </p>
            {!passed && (
              <button type="button" className="btn-ghost justify-self-start" onClick={() => go(3)}>
                Kembali ke kuis
              </button>
            )}
          </div>
        )}
      </section>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="btn-ghost"
          disabled={step === 0 || !ready}
          onClick={() => go(step - 1)}
        >
          Kembali
        </button>
        {step < CODE_STEPS.length - 1 ? (
          <button type="button" className="btn" disabled={!ready} onClick={() => go(step + 1)}>
            Lanjut
          </button>
        ) : next ? (
          <Link to="/kode/$lessonId" params={{ lessonId: next.id }} className="btn">
            Berikutnya: {next.title}
          </Link>
        ) : (
          <Link to="/kode/tantangan" className="btn">
            Coba tantangan kode
          </Link>
        )}
      </div>
      <Link to="/kode" className="btn-quiet mt-4 px-0">
        Semua pelajaran kode
      </Link>
    </Shell>
  );
}
