import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FocusToggle, Shell } from "@/components/shell";
import { Tex } from "@/components/tex";
import { TopicVisual } from "@/components/visual";
import { NOTE_FRAME, useSave } from "@/lib/progress";
import { bankOf, getTopic } from "@/lib/topics";

export const Route = createFileRoute("/belajar/$topicId")({ component: Lesson });

const STEPS = ["Janji", "Ide", "Rumus", "Lihat", "Kasus", "Jebakan", "Catat"] as const;

const COACH = [
  "Baca pelan. Jangan loncat ke rumus.",
  "Tiga kartu ini cukup untuk sekarang.",
  "Tutup rumusnya, ucapkan, baru buka lagi.",
  "Ubah satu slider. Sebut apa yang berubah.",
  "Bayangkan kamu sedang di tempat itu.",
  "Jebakan ini yang biasanya bikin salah.",
  "Dua kalimat dengan kata sendiri. Lalu lima soal.",
];

function Lesson() {
  const { topicId } = Route.useParams();
  const topic = getTopic(topicId);
  const { save, ready, setNote, setStep } = useSave();
  const [step, setLocal] = useState(0);
  const [hideTex, setHideTex] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [note, setLocalNote] = useState("");

  useEffect(() => {
    if (!ready || !topic) return;
    setLocalNote(save.notes[topic.id] ?? "");
    setStep(topic.id, 0);
  }, [ready, topic, setStep]);

  if (!topic) {
    return (
      <Shell>
        <h1 className="text-4xl">Materi tidak ketemu</h1>
        <Link to="/" className="btn mt-6">
          Kembali
        </Link>
      </Shell>
    );
  }

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, next));
    setLocal(clamped);
    setStep(topic.id, clamped);
  };

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-copper">
            {topic.chapter ?? (topic.track === "physics" ? "Fisika dasar" : "Matematika dasar")}
          </p>
          <h1 className="mt-1 text-4xl">{topic.title}</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-3 text-sm text-muted">
        Langkah {step + 1} dari {STEPS.length} · sekitar {topic.minutes} menit · {bankOf(topic.id).toLocaleString("id-ID")}+ variasi soal
      </p>
      <div className="mt-4 flex gap-1">
        {STEPS.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={() => go(index)}
            className={`h-2 flex-1 rounded-full ${index <= step ? "bg-copper" : "bg-line"}`}
          />
        ))}
      </div>
      <p className="mt-4 text-sm">{COACH[step]}</p>

      <div className="mt-5">
        {step === 0 && (
          <article className="card p-5">
            <p className="text-sm font-semibold text-copper">Janji layar ini</p>
            <h2 className="mt-2 text-3xl">{topic.promise}</h2>
            <p className="mt-4 text-xl">{topic.oneIdea}</p>
          </article>
        )}
        {step === 1 && (
          <div className="grid gap-3">
            {topic.ideas.map((idea) => (
              <article key={idea.t} className="card p-4">
                <h2 className="text-2xl">{idea.t}</h2>
                <p className="mt-2 text-muted">{idea.d}</p>
              </article>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-3">
            <div className="flex justify-end">
              <button type="button" className="btn-ghost" onClick={() => setHideTex((v) => !v)}>
                {hideTex ? "Tampilkan rumus" : "Uji ingat"}
              </button>
            </div>
            {topic.formulas.map((formula) => (
              <article key={formula.name} className="card p-4">
                <h2 className="text-2xl">{formula.name}</h2>
                <div className="my-3 min-h-12">
                  {hideTex ? <p className="text-muted">Coba sebut dulu, baru tampilkan.</p> : <Tex tex={formula.tex} display />}
                </div>
                <p className="text-sm text-muted">{formula.when}</p>
              </article>
            ))}
          </div>
        )}
        {step === 3 && <TopicVisual kind={topic.visual} />}
        {step === 4 && (
          <article className="card p-5">
            <p className="text-sm font-semibold text-copper">{topic.casePlace}</p>
            <h2 className="mt-1 text-3xl">{topic.caseTitle}</h2>
            <p className="mt-3">{topic.caseStory}</p>
            <ol className="mt-4 grid gap-2">
              {topic.caseMove.map((move, index) => (
                <li key={move} className="flex gap-3">
                  <span className="font-mono text-sm text-copper">{index + 1}</span>
                  <span>{move}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 border-l-2 border-copper pl-3">{topic.caseTake}</p>
          </article>
        )}
        {step === 5 && (
          <div className="grid gap-3">
            {topic.traps.map((trap) => (
              <article key={trap.bad} className="card p-4">
                <p className="text-sm font-semibold text-copper">Sering keliru</p>
                <p className="mt-1">{trap.bad}</p>
                <p className="mt-2 text-muted">{trap.fix}</p>
              </article>
            ))}
            <article className="card p-4">
              <h2 className="text-2xl">Cara belajar topik ini</h2>
              <ul className="mt-3 grid gap-2">
                {topic.howTo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        )}
        {step === 6 && (
          <div className="grid gap-4">
            <article className="card p-4">
              <h2 className="text-2xl">Cek satu napas</h2>
              <p className="mt-2">{topic.check.q}</p>
              {showCheck ? (
                <p className="mt-3">
                  <span className="font-semibold">{topic.check.a}</span> {topic.check.why}
                </p>
              ) : (
                <button type="button" className="btn mt-4" onClick={() => setShowCheck(true)}>
                  Lihat jawaban
                </button>
              )}
            </article>
            <label className="grid gap-2">
              <span className="font-medium">Catatan dua kalimat</span>
              <textarea
                className="field min-h-40 py-3 font-sans text-base"
                value={note}
                onChange={(event) => {
                  setLocalNote(event.target.value);
                  setNote(topic.id, event.target.value);
                }}
                placeholder={NOTE_FRAME}
              />
            </label>
            <button
              type="button"
              className="btn-ghost justify-self-start"
              onClick={() => {
                if (note.trim()) return;
                setLocalNote(NOTE_FRAME);
                setNote(topic.id, NOTE_FRAME);
              }}
            >
              Isi kerangka catatan
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={() => go(step - 1)} disabled={step === 0}>
          Kembali
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn" onClick={() => go(step + 1)}>
            Lanjut
          </button>
        ) : (
          <Link to="/latihan/$topicId" params={{ topicId: topic.id }} className="btn">
            Lima soal
          </Link>
        )}
      </div>
    </Shell>
  );
}
