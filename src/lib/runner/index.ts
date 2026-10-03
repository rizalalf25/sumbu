import { SQL_FIXTURE } from "../challenges";

export type PyResult = { ok: boolean; out: string; error?: string };
export type PyStatus = "loading" | "running";

const TIMEOUT_MS = 12_000;

let worker: Worker | null = null;
let ready = false;
let seq = 0;

function getWorker(): Worker {
  if (!worker) worker = new Worker(new URL("./py-worker.ts", import.meta.url), { type: "module" });
  return worker;
}

/**
 * Jalankan Python di web worker. Panggilan pertama mengunduh Pyodide (beberapa MB, lalu tersimpan di cache peramban).
 * Waktu eksekusi dibatasi; worker dimatikan bila melewati batas, misalnya karena perulangan tanpa akhir.
 */
export function runPython(code: string, onStatus?: (status: PyStatus) => void): Promise<PyResult> {
  const w = getWorker();
  const id = ++seq;
  onStatus?.(ready ? "running" : "loading");
  return new Promise((resolve) => {
    let timer: number | undefined;
    const done = (result: PyResult) => {
      window.clearTimeout(timer);
      w.removeEventListener("message", onMessage);
      w.removeEventListener("error", onError);
      resolve(result);
    };
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { id: number; status?: string } & PyResult;
      if (data.id !== id) return;
      if (data.status === "running") {
        ready = true;
        onStatus?.("running");
        timer = window.setTimeout(() => {
          w.terminate();
          worker = null;
          ready = false;
          done({ ok: false, out: "", error: `Waktu habis (${TIMEOUT_MS / 1000} detik). Mungkin ada perulangan tanpa akhir.` });
        }, TIMEOUT_MS);
        return;
      }
      done({ ok: data.ok, out: data.out, error: data.error });
    };
    const onError = () => {
      worker?.terminate();
      worker = null;
      ready = false;
      done({ ok: false, out: "", error: "Gagal memuat Python. Periksa koneksi internet lalu coba lagi." });
    };
    w.addEventListener("message", onMessage);
    w.addEventListener("error", onError);
    w.postMessage({ id, code });
  });
}

export type SqlTable = { columns: string[]; rows: (string | number | null)[][] };
export type SqlResult = { ok: true; tables: SqlTable[] } | { ok: false; error: string };

type SqlDb = {
  run: (sql: string) => void;
  exec: (sql: string) => { columns: string[]; values: (string | number | null | Uint8Array)[][] }[];
  close: () => void;
};
let sqlModule: { Database: new () => SqlDb } | null = null;

async function loadSql() {
  if (!sqlModule) {
    const [{ default: initSqlJs }, { default: wasmUrl }] = await Promise.all([import("sql.js"), import("sql.js/dist/sql-wasm.wasm?url")]);
    sqlModule = (await initSqlJs({ locateFile: () => wasmUrl })) as unknown as { Database: new () => SqlDb };
  }
  return sqlModule;
}

/** Jalankan SQL di basis data SQLite baru (di memori) yang sudah diisi tabel contoh. */
export async function runSql(query: string, setup: string = SQL_FIXTURE): Promise<SqlResult> {
  try {
    const SQL = await loadSql();
    const db = new SQL.Database();
    try {
      db.run(setup);
      const tables = db.exec(query).map((t) => ({
        columns: t.columns,
        rows: t.values.map((row) => row.map((v) => (v instanceof Uint8Array ? "[biner]" : v))),
      }));
      return { ok: true, tables };
    } finally {
      db.close();
    }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Bandingkan dua hasil SQL berdasarkan nilai (bukan nama kolom). */
export function sameRows(a: SqlTable | undefined, b: SqlTable | undefined, ordered: boolean): boolean {
  if (!a || !b) return false;
  const norm = (row: (string | number | null)[]) => JSON.stringify(row.map((v) => (typeof v === "number" ? Math.round(v * 1e6) / 1e6 : v)));
  const ra = a.rows.map(norm);
  const rb = b.rows.map(norm);
  if (!ordered) {
    ra.sort();
    rb.sort();
  }
  return ra.length === rb.length && ra.every((row, i) => row === rb[i]);
}
