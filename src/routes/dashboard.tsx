import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  Download,
  Flame,
  LogOut,
  Users,
} from "lucide-react";
import { Shell } from "@/components/shell";
import { AccountRequired } from "@/components/account-required";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import { emptySave, useSave } from "@/lib/progress";
import {
  flushProgress,
  readStoredSave,
  reloadCloudProgress,
  retryProgress,
  updateSave,
} from "@/lib/progress-store";
import { allTopics, getTopic } from "@/lib/topics";
import { getRoadmap, nextStep, isEnough } from "@/lib/roadmaps";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });
function Dashboard() {
  return (
    <Shell wide>
      <AccountRequired>
        <DashboardContent />
      </AccountRequired>
    </Shell>
  );
}
function DashboardContent() {
  const user = useCurrentUser();
  const { save, ready, status } = useSave();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const topics = allTopics();
  const mastered = topics.filter((t) => isEnough(save, t.id));
  const answered = Object.values(save.correct).reduce((a, b) => a + b, 0);
  const attempts = Object.values(save.attempts).reduce((a, b) => a + b, 0);
  const road = save.road ? getRoadmap(save.road) : undefined;
  const step = road ? nextStep(road, save) : undefined;
  const next = getTopic(step?.topicId ?? save.lastTopic ?? "") ?? topics[0];
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(save, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `sumbu-progres-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await flushProgress();
      await signOut();
    } catch {
      setError("Belum berhasil keluar. Coba lagi.");
      setBusy(false);
    }
  }
  const emptyAccount = JSON.stringify(save) === JSON.stringify(emptySave);
  if (!ready)
    return (
      <p role="status" className="py-12 text-muted">
        Memuat perjalanan belajar…
      </p>
    );
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">DASHBOARD BELAJAR</p>
          <h1 className="mt-3 text-3xl md:text-4xl">
            Halo, {user?.displayName?.split(" ")[0] ?? "teman belajar"}.
          </h1>
          <p className="mt-3 text-muted">Satu langkah kecil hari ini juga kemajuan.</p>
        </div>
        <button type="button" className="btn-ghost" disabled={busy} onClick={() => void logout()}>
          <LogOut size={16} />
          {busy ? "Keluar…" : "Keluar"}
        </button>
      </div>
      {error && (
        <p className="form-error mt-4" role="alert">
          {error}
        </p>
      )}
      <div className="sync-banner mt-6" role="status">
        <Cloud size={19} />
        <div>
          <p className="font-semibold">
            {status === "saved"
              ? "Progres tersimpan di akun"
              : status === "saving"
                ? "Menyimpan progres…"
                : status === "conflict"
                  ? "Ada perubahan dari perangkat lain"
                  : "Progres aman di perangkat ini; sinkronisasi belum selesai"}
          </p>
          <p className="mt-1 text-xs text-muted">
            {status === "conflict"
              ? "Unduh cadangan lokal sebelum memuat progres terbaru akun. Salinan pemulihan juga disimpan di perangkat ini."
              : "Catatan pribadi, esai, dan jawaban Anda tidak ditampilkan di ruang belajar."}
          </p>
        </div>
        {status === "offline" && (
          <button className="btn-ghost ml-auto" onClick={() => void retryProgress()}>
            Coba lagi
          </button>
        )}
        {status === "conflict" && (
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={download}>
              Unduh lokal
            </button>
            <button className="btn-ghost" onClick={() => void reloadCloudProgress()}>
              Muat progres akun
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [BookOpen, mastered.length, "Materi dikuasai"],
          [CheckCircle2, answered, "Jawaban benar"],
          [Flame, save.dayStreak, "Hari beruntun"],
          [Cloud, save.sessions, "Sesi fokus"],
        ].map(([Icon, value, label]) => {
          const I = Icon as typeof Cloud;
          return (
            <article className="card p-5" key={String(label)}>
              <I size={20} className="text-copper" />
              <p className="mt-4 font-display text-3xl">{String(value)}</p>
              <p className="mt-1 text-xs text-muted">{String(label)}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <section className="card p-6">
          <p className="eyebrow">LANGKAH SELANJUTNYA</p>
          <h2 className="mt-3 text-3xl">{next.title}</h2>
          <p className="mt-3 text-sm text-muted">{next.blurb}</p>
          <Link to="/belajar/$topicId" params={{ topicId: next.id }} className="btn mt-6">
            Lanjut belajar <ArrowRight size={17} />
          </Link>
          {road && <p className="mt-4 text-xs text-muted">Peta aktif: {road.title}</p>}
        </section>
        <section className="card p-6">
          <Users className="text-copper" />
          <h2 className="mt-4 text-2xl">Lebih seru bersama.</h2>
          <p className="mt-3 text-sm text-muted">
            Temukan ruang belajar, tanyakan konsep yang sulit, atau buat ruang untuk teman. Tanpa
            kode undangan.
          </p>
          <Link to="/ruang" className="btn-ghost mt-6">
            Temukan ruang <ArrowRight size={17} />
          </Link>
        </section>
      </div>
      <section className="card mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">Perjalanan konsep</h2>
          <span className="text-sm text-copper">
            {mastered.length} / {topics.length} materi
          </span>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden bg-soft"
          role="progressbar"
          aria-label="Materi dikuasai"
          aria-valuemin={0}
          aria-valuemax={topics.length}
          aria-valuenow={mastered.length}
        >
          <div
            className="h-full bg-copper"
            style={{ width: `${(mastered.length / topics.length) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-muted">
          Materi dikuasai setelah 3 jawaban benar, termasuk 1 soal Sedang atau Tantangan. Akurasi
          latihan: {attempts ? Math.round((answered / attempts) * 100) : 0}%.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {topics
            .filter((t) => (save.attempts[t.id] ?? 0) > 0)
            .slice(0, 8)
            .map((t) => (
              <Link
                className="flex items-center justify-between gap-3 border-b border-line py-3 text-sm"
                key={t.id}
                to="/latihan/$topicId"
                params={{ topicId: t.id }}
              >
                <span>{t.title}</span>
                <span className="shrink-0 text-copper">
                  {isEnough(save, t.id) ? "Dikuasai ✓" : `${save.correct[t.id] ?? 0} benar`}
                </span>
              </Link>
            ))}
        </div>
        {!attempts && (
          <p className="mt-5 text-sm text-muted">
            Belum ada latihan. Mulai satu konsep dan jawab soal pertama Anda.
          </p>
        )}
      </section>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="btn-ghost" onClick={download}>
          <Download size={16} />
          Unduh cadangan progres
        </button>
        <Link to="/metode" className="btn-quiet">
          Pulihkan dari cadangan
        </Link>
        {emptyAccount && (
          <button
            className="btn-quiet"
            onClick={() => {
              const guest = readStoredSave("sumbu-v1");
              if (JSON.stringify(guest) === JSON.stringify(emptySave))
                setError("Belum ada progres tamu untuk diimpor.");
              else updateSave(() => guest);
            }}
          >
            Impor progres tamu perangkat ini
          </button>
        )}
      </div>
    </>
  );
}
