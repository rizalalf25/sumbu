import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import cpp from "highlight.js/lib/languages/cpp";
import python from "highlight.js/lib/languages/python";
import r from "highlight.js/lib/languages/r";
import sql from "highlight.js/lib/languages/sql";
import type { LangId } from "./code";

// highlight.js memakai modul ES tanpa variabel global, jadi aman untuk render server dan bundel produksi.
hljs.registerLanguage("python", python);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("r", r);
hljs.registerLanguage("bash", bash);

function escapeHtml(code: string): string {
  return code.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
}

/** HTML berwarna untuk kode; hasilnya sudah di-escape oleh highlight.js. */
export function highlight(code: string, lang: LangId): string {
  try {
    return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(code);
  }
}
