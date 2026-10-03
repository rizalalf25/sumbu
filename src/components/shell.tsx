import { Link, useRouterState } from "@tanstack/react-router";
import { Code2, Compass, FolderKanban, House, Route, Sigma, Timer } from "lucide-react";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { StudyDock } from "@/components/study-dock";

const NAV = [
  { to: "/", label: "Beranda", icon: House, mobile: true },
  { to: "/peta", label: "Peta", icon: Route, mobile: true },
  { to: "/proyek", label: "Proyek", icon: FolderKanban, mobile: true },
  { to: "/kode", label: "Kode", icon: Code2, mobile: true },
  { to: "/rumus", label: "Rumus", icon: Sigma, mobile: true },
  { to: "/studio", label: "Studio", icon: Compass, mobile: false },
  { to: "/metode", label: "Metode", icon: Timer, mobile: false },
] as const;

type FocusApi = { focus: boolean; setFocus: (v: boolean) => void };

// Mode fokus bertahan saat pindah halaman (dan sampai tab ditutup), bukan hanya di satu layar.
const FOCUS_KEY = "sumbu-focus";
const focusListeners = new Set<() => void>();
let focusValue: boolean | null = null;

function readFocus(): boolean {
  if (focusValue === null) {
    try {
      focusValue = sessionStorage.getItem(FOCUS_KEY) === "1";
    } catch {
      focusValue = false;
    }
  }
  return focusValue;
}

function writeFocus(value: boolean) {
  focusValue = value;
  try {
    sessionStorage.setItem(FOCUS_KEY, value ? "1" : "0");
  } catch {
    // Penyimpanan diblokir: tetap berlaku di memori.
  }
  focusListeners.forEach((listener) => listener());
}

function subscribeFocus(listener: () => void) {
  focusListeners.add(listener);
  return () => {
    focusListeners.delete(listener);
  };
}

const FocusContext = createContext<FocusApi>({ focus: false, setFocus: () => {} });

export function useFocusMode() {
  return useContext(FocusContext);
}

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const focus = useSyncExternalStore(subscribeFocus, readFocus, () => false);
  const setFocus = writeFocus;
  const width = wide ? "max-w-5xl" : "max-w-3xl";

  return (
    <FocusContext.Provider value={{ focus, setFocus }}>
      <div className="min-h-screen text-ink">
        <header className="hud-bar sticky top-0 z-20 border-b border-line bg-paper/80 backdrop-blur-md">
          <div className={`mx-auto flex items-center justify-between gap-3 px-4 py-3 ${width}`}>
            <Link to="/" className="flex items-center gap-3" onClick={() => setFocus(false)}>
              <Mark />
              <span className="font-display text-xl leading-none tracking-[0.14em]">SUMBU</span>
            </Link>
            {focus ? (
              <button type="button" className="btn-ghost" onClick={() => setFocus(false)}>
                Keluar fokus
              </button>
            ) : (
              <nav className="hidden items-center gap-1 md:flex">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`btn-quiet ${path === item.to || (item.to !== "/" && path.startsWith(`${item.to}/`)) ? "nav-on" : "text-ink"}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </header>
        <main className={`mx-auto px-4 py-6 ${focus ? "pb-24" : "pb-36 md:pb-24"} ${width}`}>{children}</main>
        <StudyDock focus={focus} />
        {!focus && (
          <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/75 backdrop-blur-md md:hidden">
            <ul className="grid grid-cols-5">
              {NAV.filter((item) => item.mobile).map((item) => {
                const Icon = item.icon;
                const on = item.to === "/" ? path === "/" : path === item.to || path.startsWith(`${item.to}/`);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold ${on ? "text-copper" : "text-muted"}`}
                    >
                      <Icon size={18} aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </FocusContext.Provider>
  );
}

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="mark-glow">
      <rect x="1.5" y="1.5" width="25" height="25" className="fill-card stroke-copper" strokeWidth="1.4" />
      <path
        d="M6 15h4.2L12 9l3.2 11 2.2-5H22"
        className="stroke-ink"
        fill="none"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="22.5" cy="6" r="1.7" className="fill-signal" />
    </svg>
  );
}

export function FocusToggle() {
  const { focus, setFocus } = useFocusMode();
  if (focus) return null;
  return (
    <button type="button" className="btn-ghost" onClick={() => setFocus(true)}>
      Mode fokus
    </button>
  );
}
