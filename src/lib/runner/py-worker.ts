/// <reference lib="webworker" />
// Menjalankan Python (Pyodide) di web worker supaya halaman tidak membeku,
// dan supaya perulangan tanpa akhir bisa dihentikan dengan mematikan worker.

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/";

type PyProxy = { destroy: () => void };
type Pyodide = {
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  loadPackagesFromImports: (code: string, opts?: { messageCallback?: (msg: string) => void }) => Promise<void>;
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string, opts?: { globals?: PyProxy }) => Promise<unknown>;
  globals: { get: (name: string) => () => PyProxy };
};

let py: Pyodide | null = null;
let booting: Promise<Pyodide> | null = null;
let restoreBuiltins: (() => void) | null = null;

/**
 * Simpan salinan fungsi bawaan Python saat Pyodide baru dimuat. Sebelum setiap eksekusi, bawaan
 * dikembalikan ke salinan itu, supaya perubahan dari kode sebelumnya (misalnya builtins.print
 * ditimpa) tidak terbawa ke eksekusi berikutnya, termasuk ke penilaian tantangan.
 */
function snapshotBuiltins(runtime: Pyodide) {
  runtime.runPython(`
import builtins as __sumbu_b
__sumbu_bawaan = dict(vars(__sumbu_b))

def __sumbu_pulihkan():
    d = vars(__sumbu_b)
    for k in [k for k in d if k not in __sumbu_bawaan]:
        del d[k]
    d.update(__sumbu_bawaan)
`);
  restoreBuiltins = runtime.globals.get("__sumbu_pulihkan") as unknown as () => void;
}

function boot(): Promise<Pyodide> {
  if (py) return Promise.resolve(py);
  if (!booting) {
    booting = (async () => {
      const mod = (await import(/* @vite-ignore */ `${PYODIDE_URL}pyodide.mjs`)) as {
        loadPyodide: (opts: { indexURL: string }) => Promise<Pyodide>;
      };
      py = await mod.loadPyodide({ indexURL: PYODIDE_URL });
      snapshotBuiltins(py);
      return py;
    })();
  }
  return booting;
}

/** Ambil bagian traceback yang berguna: baris terakhir dan konteks kode pengguna. */
function tidyError(message: string): string {
  const lines = message.trim().split("\n");
  // Saat menilai tantangan, kode pengguna dikompilasi sebagai "<kode kamu>" sehingga nomor barisnya
  // sama dengan di editor. Mulai dari sana bila ada, supaya bingkai milik penguji tidak ikut tampil.
  const own = lines.findIndex((line) => line.includes('File "<kode kamu>"'));
  const start = own >= 0 ? own : lines.findIndex((line) => line.includes('File "<exec>"'));
  return (start >= 0 ? lines.slice(start) : lines.slice(-4)).join("\n");
}

self.onmessage = async (event: MessageEvent<{ id: number; code: string; scan?: string }>) => {
  const { id, code, scan } = event.data;
  let out = "";
  try {
    const runtime = await boot();
    restoreBuiltins?.();
    runtime.setStdout({ batched: (s) => (out += `${s}\n`) });
    runtime.setStderr({ batched: (s) => (out += `${s}\n`) });
    await runtime.loadPackagesFromImports(code, { messageCallback: () => {} });
    // Kode yang dibungkus penguji ada di dalam string, jadi impornya dipindai terpisah.
    if (scan) await runtime.loadPackagesFromImports(scan, { messageCallback: () => {} });
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
