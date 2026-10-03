import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CodeBlock, CodeEditor, OutputView, SqlTables, type RunState } from "@/components/code-view";
import { FocusToggle, Shell } from "@/components/shell";
import { CHALLENGES, getChallenge, pythonHarness, SQL_TABLES } from "@/lib/challenges";
import { useSave } from "@/lib/progress";
import { runPython, runSql, sameRows, type SqlTable } from "@/lib/runner";
import { getTopic } from "@/lib/topics";

export const Route = createFileRoute("/kode/tantangan/$challengeId")({ component: ChallengeRoute });

function ChallengeRoute() {
  const { challengeId } = Route.useParams();
  return <ChallengePage key={challengeId} id={challengeId} />;
}

type Verdict =
  | { kind: "none" }
  | { kind: "busy" }
  | { kind: "py"; pass: boolean; lines: string[]; error?: string }
  | { kind: "sql"; pass: boolean; mine?: SqlTable; expected?: SqlTable; error?: string };

function ChallengePage({ id }: { id: string }) {
  const challenge = getChallenge(id);
  const { save, ready, passChallenge, setDraft } = useSave();
  const [code, setCode] = useState(challenge?.starter ?? "");
  const [loaded, setLoaded] = useState(false);
  const [run, setRun] = useState<RunState>({ kind: "idle" });
  const [verdict, setVerdict] = useState<Verdict>({ kind: "none" });
  const [hint, setHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [fails, setFails] = useState(0);

  useEffect(() => {
    if (!ready || loaded || !challenge) return;
    setLoaded(true);
    const draft = save.drafts[challenge.id];
    if (draft) setCode(draft);
  }, [ready, loaded, challenge, save.drafts]);

  if (!challenge) {
    return (
      <Shell>
        <h1 className="text-4xl">Tantangan tidak ketemu</h1>
        <Link to="/kode/tantangan" className="btn mt-6">
          Semua tantangan
        </Link>
      </Shell>
    );
  }

  const index = CHALLENGES.findIndex((c) => c.id === challenge.id);
  const next = CHALLENGES[index + 1];
  const topic = challenge.topic ? getTopic(challenge.topic) : undefined;
  const busy = run.kind === "busy" || verdict.kind === "busy";
  const passed = Boolean(save.challenge[challenge.id]);

  const edit = (text: string) => {
    setCode(text);
    setDraft(challenge.id, text);
  };

  const tryRun = async () => {
    setVerdict({ kind: "none" });
    if (challenge.lang === "python") {
      setRun({ kind: "busy", status: "loading" });
      const result = await runPython(code, (status) => setRun({ kind: "busy", status }));
      setRun({ kind: "py", ...result });
    } else {
      setRun({ kind: "busy", status: "sql" });
      const result = await runSql(code);
      setRun(result.ok ? { kind: "sql", tables: result.tables } : { kind: "error", error: result.error });
    }
  };

  const grade = async () => {
    setRun({ kind: "idle" });
    setVerdict({ kind: "busy" });
    let pass = false;
    if (challenge.lang === "python") {
      const result = await runPython(pythonHarness(code, challenge.tests));
      const lines = result.out.split("\n").filter((line) => line && !line.startsWith("__"));
      pass = result.ok && result.out.includes("__LULUS__");
      setVerdict({ kind: "py", pass, lines, error: result.error });
    } else {
      const [mine, expected] = await Promise.all([runSql(code), runSql(challenge.tests)]);
      if (!mine.ok) {
        setVerdict({ kind: "sql", pass: false, error: mine.error });
      } else {
        const a = mine.tables.at(-1);
        const b = expected.ok ? expected.tables.at(-1) : undefined;
        pass = sameRows(a, b, Boolean(challenge.ordered));
        setVerdict({ kind: "sql", pass, mine: a, expected: b });
      }
    }
    if (pass) passChallenge(challenge.id);
    else setFails((n) => n + 1);
  };

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/kode/tantangan" className="text-sm font-semibold text-copper">
            Tantangan {challenge.lang === "python" ? "Python" : "SQL"} · {challenge.level}
          </Link>
          <h1 className="mt-1 text-4xl">{challenge.title}</h1>
        </div>
        <FocusToggle />
      </div>
      <p className="mt-3 text-sm text-muted">
        {passed ? "Sudah lulus · " : ""}
        {topic ? (
          <>
            {"memakai materi "}
            <Link to="/belajar/$topicId" params={{ topicId: topic.id }} className="font-semibold text-copper">
              {topic.title}
            </Link>
          </>
        ) : (
          "latihan pemrograman umum"
        )}
      </p>

      <article className="card mt-5 p-5">
        <p className="text-sm font-semibold text-copper">Tugas</p>
        <p className="mt-2 text-lg">{challenge.task}</p>
        {challenge.lang === "sql" ? (
          <div className="mt-4">
            <p className="text-sm font-semibold">Tabel yang tersedia</p>
            <ul className="mt-1 grid gap-1 font-mono text-xs text-muted">
              {SQL_TABLES.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>

      <div className="card mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
          <span className="font-mono text-xs text-muted">{challenge.lang === "python" ? "Python" : "SQL"} · draf tersimpan otomatis</span>
          <button type="button" className="btn-quiet px-2 py-1 text-xs" onClick={() => edit(challenge.starter)}>
            Mulai ulang
          </button>
        </div>
        <CodeEditor value={code} onChange={edit} lang={challenge.lang} label="Jawabanmu" minRows={10} />
        <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
          <button type="button" className="btn" onClick={grade} disabled={busy}>
            {verdict.kind === "busy" ? "Menguji…" : "✓ Uji jawaban"}
          </button>
          <button type="button" className="btn-ghost" onClick={tryRun} disabled={busy}>
            ▶ Jalankan saja
          </button>
          <button type="button" className="btn-quiet" onClick={() => setHint(true)}>
            Petunjuk
          </button>
        </div>
      </div>

      {hint ? (
        <p className="card mt-3 p-4 text-sm">
          <span className="font-semibold text-copper">Petunjuk: </span>
          {challenge.hint}
        </p>
      ) : null}

      <div className="mt-4" aria-live="polite">
        {run.kind !== "idle" ? (
          <div className="card p-4">
            <p className="mb-2 text-sm font-semibold">Keluaran</p>
            <OutputView state={run} />
          </div>
        ) : null}
        {verdict.kind === "busy" ? (
          <p className="text-sm text-muted" role="status">
            Menjalankan tes… (pertama kali memuat Python, beberapa detik)
          </p>
        ) : null}
        {verdict.kind === "py" ? (
          <div className="card p-4">
            <p className={`text-lg font-semibold ${verdict.pass ? "text-copper" : "text-signal"}`}>{verdict.pass ? "Lulus semua tes." : "Belum lulus."}</p>
            <ul className="mt-2 grid gap-1 font-mono text-sm">
              {verdict.lines.map((line, i) => (
                <li key={i} className={line.startsWith("✓") ? "text-copper" : line.startsWith("✗") ? "text-signal" : ""}>
                  {line}
                </li>
              ))}
            </ul>
            {verdict.error ? <pre className="code-out mt-2 text-signal">{verdict.error}</pre> : null}
          </div>
        ) : null}
        {verdict.kind === "sql" ? (
          <div className="card grid gap-3 p-4">
            <p className={`text-lg font-semibold ${verdict.pass ? "text-copper" : "text-signal"}`}>
              {verdict.pass ? "Lulus: hasilnya sama dengan yang diharapkan." : "Belum lulus: hasilnya berbeda."}
            </p>
            {verdict.error ? <pre className="code-out text-signal">{verdict.error}</pre> : null}
            {!verdict.pass && verdict.mine ? (
              <div>
                <p className="mb-1 text-sm font-semibold">Hasilmu</p>
                <SqlTables tables={[verdict.mine]} />
              </div>
            ) : null}
            {!verdict.pass && verdict.expected ? (
              <div>
                <p className="mb-1 text-sm font-semibold">Yang diharapkan</p>
                <SqlTables tables={[verdict.expected]} />
                {challenge.ordered ? <p className="mt-1 text-xs text-muted">Urutan baris ikut dinilai.</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {fails >= 2 || passed ? (
        <div className="mt-4">
          {showSolution ? (
            <CodeBlock code={challenge.solution} lang={challenge.lang} label="Contoh solusi" />
          ) : (
            <button type="button" className="btn-quiet px-0" onClick={() => setShowSolution(true)}>
              {passed ? "Bandingkan dengan contoh solusi" : "Lihat contoh solusi"}
            </button>
          )}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/kode/tantangan" className="btn-ghost">
          Semua tantangan
        </Link>
        {next ? (
          <Link to="/kode/tantangan/$challengeId" params={{ challengeId: next.id }} className="btn">
            Berikutnya: {next.title}
          </Link>
        ) : null}
      </div>
    </Shell>
  );
}
