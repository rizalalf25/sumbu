import { Link } from "@tanstack/react-router";
import { ACCOUNTS_ENABLED } from "@/lib/accounts";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { ReactNode } from "react";

/** Penjelasan untuk fitur berakun saat situs di-deploy tanpa akun (lihat src/lib/accounts.ts). */
export function AccountsOff({ title = "Fitur ini butuh akun." }: { title?: string }) {
  return (
    <section className="card mx-auto max-w-xl p-8">
      <p className="eyebrow">BELAJAR TANPA AKUN</p>
      <h1 className="mt-3 text-3xl">{title}</h1>
      <p className="mt-4 text-muted">
        Akun belum diaktifkan di situs ini. Untuk sementara semua materi, latihan, kode, dan LPDP
        bisa dipakai tanpa akun, dan progresmu tersimpan di peramban ini.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/" className="btn">
          Jelajahi materi
        </Link>
        <Link to="/dashboard" className="btn-ghost">
          Lihat progresku
        </Link>
      </div>
    </section>
  );
}

export function AccountRequired({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (!ACCOUNTS_ENABLED) return <AccountsOff />;
  if (isPending)
    return (
      <p role="status" className="py-10 text-muted">
        Memeriksa akun…
      </p>
    );
  if (!user)
    return (
      <section className="card mx-auto max-w-xl p-8">
        <p className="eyebrow">BELAJAR BERSAMA</p>
        <h1 className="mt-3 text-3xl">Simpan perjalanan Anda.</h1>
        <p className="mt-4 text-muted">
          Masuk untuk menyimpan progres lintas perangkat dan ikut diskusi. Semua materi tetap bisa
          dipelajari tanpa akun.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/login" className="btn">
            Masuk atau daftar
          </Link>
          <Link to="/" className="btn-ghost">
            Jelajahi materi
          </Link>
        </div>
      </section>
    );
  return <>{children}</>;
}
