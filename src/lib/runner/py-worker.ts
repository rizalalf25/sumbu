/// <reference lib="webworker" />
// Menjalankan Python (Pyodide) di web worker supaya halaman tidak membeku,
// dan supaya perulangan tanpa akhir bisa dihentikan dengan mematikan worker.

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/";

type PyProxy = { destroy: () => void };
type Pyodide = {
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  loadPackagesFromImports: (code: string, opts?: { messageCallback?: (msg: string) => void }) => Promise<void>;
  runPythonAsync: (code: string, opts?: { globals?: PyProxy }) => Promise<unknown>;
  globals: { get: (name: string) => () => PyProxy };
};

let py: Pyodide | null = null;
let booting: Promise<Pyodide> | null = null;

function boot(): Promise<Pyodide> {
  if (py) return Promise.resolve(py);
  if (!booting) {
    booting = (async () => {
      const mod = (await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`)) as {
        loadPyodide: (opts: { indexURL: string }) => Promise<Pyodide>;
      };
      py = await mod.loadPyodide({ indexURL: PYODIDE_URL });
      return py;
    })();
  }
  return booting;
}

/** Ambil bagian traceback yang berguna: baris terakhir dan konteks kode pengguna. */
function tidyError(message: string): string {
  const lines = message.trim().split("\n");
  const start = lines.findIndex((line) => line.includes('File "<exec>"'));
  return (start >= 0 ? lines.slice(start) : lines.slice(-4)).join("\n");
}

self.onmessage = async (event: MessageEvent<{ id: number; code: string }>) => {
  const { id, code } = event.data;
  let out = "";
  try {
    const runtime = await boot();
    runtime.setStdout({ batched: (s) => (out += `${s}\n`) });
    runtime.setStderr({ batched: (s) => (out += `${s}\n`) });
    await runtime.loadPackagesFromImports(code, { messageCallback: () => {} });
    self.postMessage({ id, status: "running" });
    const ns = runtime.globals.get("dict")();
    try {
      await runtime.runPythonAsync(code, { globals: ns });
    } finally {
      ns.destroy();
    }
    self.postMessage({ id, ok: true, out });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const failedBoot = !py;
    self.postMessage({
      id,
      ok: false,
      out,
      error: failedBoot ? `Gagal memuat Python di peramban: ${message}` : tidyError(message),
    });
  }
};
