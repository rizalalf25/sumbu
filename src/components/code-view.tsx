import { useRef, useState, type KeyboardEvent } from "react";
import type { LangId } from "@/lib/code";
import { highlight } from "@/lib/highlight";
import { runPython, runSql, type PyStatus, type SqlTable } from "@/lib/runner";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-quiet px-2 py-1 text-xs"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

/** Kode hanya-baca dengan pewarnaan sintaks. */
export function CodeBlock({ code, lang, label }: { code: string; lang: LangId; label: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2">
        <span className="font-mono text-xs text-muted">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="code-layer overflow-x-auto">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
      </pre>
    </div>
  );
}

/**
 * Editor ringan: textarea transparan di atas lapisan berwarna. Tab menyisipkan spasi;
 * Esc melepas fokus supaya pengguna keyboard bisa keluar dari editor.
 */
export function CodeEditor({
  value,
  onChange,
  lang,
  label,
  minRows = 8,
}: {
  value: string;
  onChange: (next: string) => void;
  lang: LangId;
  label: string;
  minRows?: number;
}) {
  const layer = useRef<HTMLPreElement>(null);
  const indent = lang === "python" ? "    " : "  ";
  const rows = Math.max(minRows, value.split("\n").length + 1);

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    if (event.key === "Escape") {
      el.blur();
      return;
    }
    if (event.key !== "Tab" || event.shiftKey) return;
    event.preventDefault();
    const { selectionStart: start, selectionEnd: end } = el;
    onChange(value.slice(0, start) + indent + value.slice(end));
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + indent.length;
    });
  };

  return (
    <div className="code-editor relative">
      <pre ref={layer} aria-hidden="true" className="code-layer pointer-events-none absolute inset-0 overflow-hidden">
        <code dangerouslySetInnerHTML={{ __html: `${highlight(value, lang)}\n` }} />
      </pre>
      <textarea
        aria-label={label}
        className="code-layer code-input relative block w-full resize-y"
        value={value}
        rows={rows}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onScroll={(event) => {
          if (!layer.current) return;
          layer.current.scrollTop = event.currentTarget.scrollTop;
          layer.current.scrollLeft = event.currentTarget.scrollLeft;
        }}
      />
    </div>
  );
}

export function SqlTables({ tables }: { tables: SqlTable[] }) {
  if (!tables.length) return <p className="text-sm text-muted">Query berjalan, tetapi tidak mengembalikan baris.</p>;
  return (
    <div className="grid gap-3">
      {tables.map((table, t) => (
        <div key={t} className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr>
                {table.columns.map((col) => (
                  <th key={col} className="border-b border-line px-3 py-1.5 text-left font-semibold text-copper">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r} className="border-b border-line/50">
                  {row.map((value, c) => (
                    <td key={c} className="px-3 py-1.5 tabular-nums">
                      {value === null ? <span className="text-muted">NULL</span> : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1 text-xs text-muted">{table.rows.length} baris</p>
        </div>
      ))}
    </div>
  );
}

type RunState =
  | { kind: "idle" }
  | { kind: "busy"; status: PyStatus | "sql" }
  | { kind: "py"; ok: boolean; out: string; error?: string }
  | { kind: "sql"; tables: SqlTable[] }
  | { kind: "error"; error: string };

export function OutputView({ state }: { state: RunState }) {
  if (state.kind === "idle") return null;
  if (state.kind === "busy") {
    return (
      <p className="text-sm text-muted" role="status">
        {state.status === "loading" ? "Memuat Python di peramban (sekali saja, beberapa MB)…" : "Menjalankan…"}
      </p>
    );
  }
  if (state.kind === "sql") return <SqlTables tables={state.tables} />;
  if (state.kind === "error") return <pre className="code-out text-signal">{state.error}</pre>;
  return (
    <pre className={`code-out ${state.ok ? "" : "text-signal"}`}>
      {state.out}
      {state.error ? `${state.out ? "\n" : ""}${state.error}` : ""}
      {!state.out && !state.error ? "(tidak ada keluaran; tambahkan print())" : ""}
    </pre>
  );
}

export type { RunState };

/** Editor + tombol Jalankan + keluaran, untuk pelajaran yang bisa dijalankan di peramban. */
export function RunPanel({ initial, lang, run, label }: { initial: string; lang: LangId; run: "python" | "sql"; label: string }) {
  const [code, setCode] = useState(initial);
  const [state, setState] = useState<RunState>({ kind: "idle" });
  const busy = state.kind === "busy";

  const execute = async () => {
    if (run === "python") {
      setState({ kind: "busy", status: "loading" });
      const result = await runPython(code, (status) => setState({ kind: "busy", status }));
      setState({ kind: "py", ...result });
    } else {
      setState({ kind: "busy", status: "sql" });
      const result = await runSql(code);
      setState(result.ok ? { kind: "sql", tables: result.tables } : { kind: "error", error: result.error });
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
        <span className="font-mono text-xs text-muted">{label} · bisa diubah dan dijalankan</span>
        <div className="flex items-center gap-1">
          <CopyButton text={code} />
          {code !== initial ? (
            <button type="button" className="btn-quiet px-2 py-1 text-xs" onClick={() => setCode(initial)}>
              Kembalikan
            </button>
          ) : null}
        </div>
      </div>
      <CodeEditor value={code} onChange={setCode} lang={lang} label={`Editor ${label}`} />
      <div className="border-t border-line px-4 py-3">
        <button type="button" className="btn" onClick={execute} disabled={busy}>
          {busy ? "Berjalan…" : "▶ Jalankan"}
        </button>
        <div className="mt-3" aria-live="polite">
          <OutputView state={state} />
        </div>
      </div>
    </div>
  );
}
