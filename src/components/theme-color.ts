/** Baca warna tema dari variabel CSS di :root, dengan cadangan saat render di server. */
export function color(name: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
