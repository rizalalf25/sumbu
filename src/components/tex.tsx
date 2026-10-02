import katex from "katex";

export function Tex({ tex, display = false }: { tex: string; display?: boolean }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
    strict: "ignore",
    output: "html",
  });
  if (display) {
    return <div className="overflow-x-auto text-ink" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span className="text-ink" dangerouslySetInnerHTML={{ __html: html }} />;
}
