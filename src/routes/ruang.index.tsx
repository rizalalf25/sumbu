import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Plus, Users } from "lucide-react";
import { Shell } from "@/components/shell";
import { AccountRequired } from "@/components/account-required";
import { createRoom, joinRoom, listRooms } from "@/lib/learning";
import { allTopics, getTopic } from "@/lib/topics";

export const Route = createFileRoute("/ruang/")({ component: Rooms });
function Rooms() {
  return (
    <Shell wide>
      <AccountRequired>
        <RoomList />
      </AccountRequired>
    </Shell>
  );
}
function RoomList() {
  const [rooms, setRooms] = useState<Awaited<ReturnType<typeof listRooms>>>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  async function load() {
    try {
      setRooms(await listRooms());
      setError("");
    } catch {
      setError("Ruang belum bisa dimuat. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await createRoom({
        data: { name: String(form.get("name")), topicId: String(form.get("topic")) },
      });
      setCreating(false);
      await load();
    } catch {
      setError("Ruang belum berhasil dibuat. Maksimal 10 ruang per akun; coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  async function join(roomId: string) {
    setBusy(true);
    setError("");
    try {
      await joinRoom({ data: { roomId } });
      await load();
    } catch {
      setError("Belum berhasil bergabung. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">KOMUNITAS SUMBU</p>
          <h1 className="mt-3 text-4xl">Ruang belajar terbuka.</h1>
          <p className="mt-3 max-w-xl text-muted">
            Satu topik, banyak sudut pandang. Pilih ruang dan langsung bergabung bersama teman.
          </p>
        </div>
        <button type="button" className="btn" onClick={() => setCreating(!creating)}>
          <Plus size={18} />
          {creating ? "Tutup formulir" : "Buat ruang"}
        </button>
      </div>
      <p className="mt-4 text-xs text-muted">
        Diskusi terlihat oleh anggota ruang. Hindari membagikan data pribadi; pemilik ruang dapat
        menghapus pesan.
      </p>
      {error && (
        <div className="form-error mt-5" role="alert">
          {error}
          <button className="ml-3 underline" onClick={() => void load()}>
            Muat ulang
          </button>
        </div>
      )}
      {creating && (
        <form className="card mt-6 grid gap-4 p-6 sm:grid-cols-2" onSubmit={create}>
          <label className="form-label">
            Nama ruang
            <input
              className="field"
              name="name"
              required
              minLength={3}
              maxLength={80}
              placeholder="Contoh: Ngulik aljabar bersama"
            />
          </label>
          <label className="form-label">
            Materi
            <select name="topic" aria-label="Materi" className="field">
              {allTopics().map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <button className="btn sm:col-span-2" disabled={busy}>
            {busy ? "Membuat…" : "Buat ruang terbuka"}
          </button>
        </form>
      )}
      {loading ? (
        <p className="py-12 text-muted" role="status">
          Memuat ruang…
        </p>
      ) : !rooms.length ? (
        <section className="card mt-8 p-8 text-center">
          <Users size={32} className="mx-auto text-copper" />
          <h2 className="mt-4 text-2xl">Jadi yang memulai.</h2>
          <p className="mt-3 text-muted">
            Belum ada ruang belajar. Buat ruang pertama untuk satu materi yang ingin Anda kuasai.
          </p>
        </section>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {rooms.map((room) => (
            <article className="card flex flex-col p-6" key={room.id}>
              <p className="eyebrow">{getTopic(room.topic_id)?.title ?? "Materi"}</p>
              <h2 className="mt-3 break-words text-2xl">{room.name}</h2>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Users size={16} />
                {room.member_count} anggota · Terbuka
              </p>
              {room.joined ? (
                <Link to="/ruang/$roomId" params={{ roomId: room.id }} className="btn-ghost mt-6">
                  Buka diskusi <ArrowRight size={16} />
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn mt-6"
                  disabled={busy}
                  onClick={() => void join(room.id)}
                >
                  Gabung ruang <ArrowRight size={16} />
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
