import { Link, useRouterState } from "@tanstack/react-router";
import {
  Code2,
  Compass,
  FolderKanban,
  GraduationCap,
  House,
  Route,
  Sigma,
  Timer,
} from "lucide-react";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { StudyDock } from "@/components/study-dock";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getSaveSnapshot, getServerSaveSnapshot, subscribeSave } from "@/lib/progress-store";

const NAV = [
  { to: "/", label: "Beranda", icon: House, mobile: true },
  { to: "/peta", label: "Peta", icon: Route, mobile: true },
  { to: "/lpdp", label: "LPDP", icon: GraduationCap, mobile: true },
  { to: "/proyek", label: "Proyek", icon: FolderKanban, mobile: true },
  { to: "/kode", label: "Kode", icon: Code2, mobile: true },
  { to: "/rumus", label: "Rumus", icon: Sigma, mobile: false },
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
  const { user, isPending } = useCurrentUserState();
  const progress = useSyncExternalStore(subscribeSave, getSaveSnapshot, getServerSaveSnapshot);

  return (
    <FocusContext.Provider value={{ focus, setFocus }}>
      <div className="min-h-screen text-ink" data-auth-pending={isPending ? "true" : "false"}>
        <header className="hud-bar sticky top-0 z-20 border-b border-line bg-paper/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/" className="flex items-center gap-3" onClick={() => setFocus(false)}>
              <Mark />
              <span className="font-display text-xl leading-none tracking-[0.14em]">SUMBU</span>
            </Link>
            {focus ? (
              <button type="button" className="btn-ghost" onClick={() => setFocus(false)}>
                Keluar fokus
              </button>
            ) : (
              <nav className="hidden items-center gap-1 lg:flex">
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
            {!focus && (
              <Link
                to={user ? "/dashboard" : "/login"}
                className="btn-ghost shrink-0 px-3 text-sm"
                aria-label={user ? "Buka dashboard akun" : "Masuk atau daftar"}
              >
                {isPending ? "Akun" : user ? "Dashboard" : "Masuk"}
              </Link>
            )}
          </div>
        </header>
        <main
          aria-busy={!progress.ready}
          className={`mx-auto px-4 py-6 ${focus ? "pb-24" : "pb-36 lg:pb-24"} ${width}`}
        >
          {!focus && (
            <div className="mb-5 flex flex-wrap gap-4 text-xs text-muted">
              <Link to="/dashboard" className="hover:text-copper">
                Perjalanan saya
              </Link>
              <Link to="/ruang" className="hover:text-copper">
                Ruang belajar
              </Link>
              <Link to="/rumus" className="lg:hidden">
                Rumus
              </Link>
              <Link to="/studio" className="lg:hidden">
                Studio
              </Link>
              <Link to="/metode" className="lg:hidden">
                Metode
              </Link>
            </div>
          )}
          {!progress.ready && (
            <p role="status" className="mb-4 text-xs text-muted">
              Memuat progres belajar…
            </p>
          )}
          {(progress.status === "offline" || progress.status === "conflict") && (
            <p role="status" className="mb-4 border border-line p-3 text-xs text-muted">
              Progres tersimpan di perangkat; sinkronisasi perlu perhatian.{" "}
              <Link to="/dashboard" className="text-copper">
                Periksa dashboard
              </Link>
            </p>
          )}
          <div inert={!progress.ready}>{children}</div>
        </main>
        <StudyDock focus={focus} />
        {!focus && (
          <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/75 backdrop-blur-md lg:hidden">
            <ul className="grid grid-cols-5">
              {NAV.filter((item) => item.mobile).map((item) => {
                const Icon = item.icon;
                const on =
                  item.to === "/"
                    ? path === "/"
                    : path === item.to || path.startsWith(`${item.to}/`);
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
      <rect
        x="1.5"
        y="1.5"
        width="25"
        height="25"
        className="fill-card stroke-copper"
        strokeWidth="1.4"
      />
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
