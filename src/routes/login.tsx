import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, Cloud, Users, Eye, EyeOff } from "lucide-react";
import { Shell } from "@/components/shell";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });
function Login() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim().toLowerCase();
    const password = String(form.get("password"));
    try {
      const result = register
        ? await authClient.signUp.email({ name: String(form.get("name")).trim(), email, password })
        : await authClient.signIn.email({ email, password });
      if (result.error) {
        const code = result.error.code;
        setError(
          result.error.status === 429
            ? "Terlalu banyak percobaan. Tunggu satu menit lalu coba lagi."
            : code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
              ? "Email sudah terdaftar. Silakan masuk."
              : code === "INVALID_EMAIL_OR_PASSWORD"
                ? "Email atau kata sandi salah."
                : "Akun belum bisa diproses. Periksa isian lalu coba lagi.",
        );
        return;
      }
      await authClient.getSession({ fetchOptions: { cache: "no-store" } });
      await navigate({ to: "/dashboard" });
    } catch {
      setError("Koneksi bermasalah. Coba lagi sebentar.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell wide>
      <div className="account-layout">
        <section className="account-intro">
          <p className="eyebrow">RUANG UNTUK BERTUMBUH</p>
          <h1 className="mt-4 text-4xl md:text-5xl">
            Belajar hari ini.
            <br />
            <span className="text-copper">Lanjut di mana saja.</span>
          </h1>
          <p className="mt-5 max-w-md text-muted">
            Satu akun untuk perjalanan belajar Anda. Mulai dari satu konsep, temukan ritme, dan
            bertukar ide dengan teman.
          </p>
          <div className="mt-8 space-y-5">
            {[
              [Cloud, "Progres mengikuti Anda", "Catatan, latihan, dan proyek tersimpan di akun."],
              [
                Users,
                "Teman belajar, ide baru",
                "Gabung ruang belajar terbuka tanpa kode undangan.",
              ],
              [
                BookOpen,
                "Materi tetap terbuka",
                "Semua orang bisa belajar, dengan atau tanpa akun.",
              ],
            ].map(([Icon, title, description]) => {
              const I = Icon as typeof Cloud;
              return (
                <div className="flex gap-4" key={String(title)}>
                  <I className="mt-1 shrink-0 text-copper" size={22} />
                  <div>
                    <h2 className="text-base">{String(title)}</h2>
                    <p className="mt-1 text-sm text-muted">{String(description)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="card p-6 md:p-8" aria-label="Akun SUMBU">
          {isPending ? (
            <p role="status">Memeriksa akun…</p>
          ) : user ? (
            <div>
              <h2 className="text-2xl">Anda sudah masuk.</h2>
              <p className="mt-3 text-muted">Halo, {user.displayName}.</p>
              <Link to="/dashboard" className="btn mt-6">
                Buka dashboard <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              <div className="account-tabs" role="group" aria-label="Pilih masuk atau daftar">
                <button
                  type="button"
                  className={!register ? "active" : ""}
                  onClick={() => {
                    setRegister(false);
                    setError("");
                  }}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  className={register ? "active" : ""}
                  onClick={() => {
                    setRegister(true);
                    setError("");
                  }}
                >
                  Daftar
                </button>
              </div>
              <h2 className="mt-6 text-3xl">
                {register ? "Mulai perjalanan Anda" : "Selamat datang kembali"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {register
                  ? "Gratis. Buat akun untuk menyimpan progres belajar."
                  : "Masuk dan lanjutkan konsep terakhir Anda."}
              </p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                {register && (
                  <label className="form-label">
                    Nama
                    <input
                      className="field"
                      name="name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={80}
                      placeholder="Nama Anda"
                    />
                  </label>
                )}
                <label className="form-label">
                  Email
                  <input
                    className="field"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="anda@email.com"
                  />
                </label>
                <label className="form-label">
                  Kata sandi
                  <div className="relative">
                    <input
                      className="field pr-14"
                      name="password"
                      type={show ? "text" : "password"}
                      autoComplete={register ? "new-password" : "current-password"}
                      required
                      minLength={register ? 10 : 1}
                      maxLength={128}
                      placeholder={register ? "Minimal 10 karakter" : "Kata sandi Anda"}
                    />
                    <button
                      type="button"
                      className="absolute right-1 top-1 grid h-11 w-11 place-items-center text-muted"
                      aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="btn w-full" disabled={busy}>
                  {busy ? "Memproses…" : register ? "Buat akun" : "Masuk"}
                  <ArrowRight size={18} />
                </button>
              </form>
              <p className="mt-5 text-xs leading-relaxed text-muted">
                {register
                  ? "Nama Anda terlihat di ruang belajar. Catatan pribadi dan esai hanya dapat diakses melalui akun Anda."
                  : "Gunakan email dan kata sandi saat Anda mendaftar."}
              </p>
              <Link to="/" className="mt-6 block text-center text-sm text-copper">
                Belajar tanpa akun →
              </Link>
            </>
          )}
        </section>
      </div>
    </Shell>
  );
}
