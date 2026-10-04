import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Send, Trash2, RefreshCw } from "lucide-react";
import { Shell } from "@/components/shell";
import { AccountRequired } from "@/components/account-required";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { getRoom, sendMessage, removeMessage } from "@/lib/learning";
import { getTopic } from "@/lib/topics";

export const Route = createFileRoute("/ruang/$roomId")({ component: Room });
function Room() {
  const { roomId } = Route.useParams();
  return (
    <Shell wide>
      <AccountRequired>
        <Discussion key={roomId} roomId={roomId} />
      </AccountRequired>
    </Shell>
  );
}
function Discussion({ roomId }: { roomId: string }) {
  const user = useCurrentUser();
  const [data, setData] = useState<Awaited<ReturnType<typeof getRoom>> | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    async function load() {
      if (document.visibilityState === "hidden") return;
      try {
        const value = await getRoom({ data: { roomId } });
        if (alive) {
          setData(value);
          setError("");
        }
      } catch {
        if (alive)
          setError(
            "Diskusi belum bisa dimuat. Pastikan Anda sudah bergabung melalui daftar ruang.",
          );
      }
    }
    void load();
    const timer = setInterval(() => void load(), 15_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [roomId]);
  async function refresh() {
    try {
      setData(await getRoom({ data: { roomId } }));
      setError("");
    } catch {
      setError("Belum berhasil memuat diskusi. Coba lagi.");
    }
  }
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    try {
      await sendMessage({ data: { roomId, body: text.trim() } });
      setText("");
      await refresh();
    } catch {
      setError(
        "Pesan belum terkirim. Periksa koneksi atau tunggu satu menit jika mengirim terlalu cepat.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove(messageId: string) {
    setBusy(true);
    try {
      await removeMessage({ data: { roomId, messageId } });
      await refresh();
    } catch {
      setError("Pesan belum berhasil dihapus.");
    } finally {
      setBusy(false);
    }
  }
  const topic = data ? getTopic(data.room.topic_id) : undefined;
  return (
    <>
      <Link className="text-sm text-copper" to="/ruang">
        ← Semua ruang
      </Link>
      {error && (
        <p className="form-error mt-5" role="alert">
          {error}
        </p>
      )}
      {!data ? (
        <p className="py-12 text-muted" role="status">
          {error
            ? "Kembali ke daftar ruang untuk bergabung atau coba muat ulang."
            : "Memuat diskusi…"}
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{topic?.title}</p>
              <h1 className="mt-3 break-words text-3xl">{data.room.name}</h1>
              <p className="mt-3 text-sm text-muted">
                {data.members.length} anggota · Diskusi diperbarui setiap 15 detik
              </p>
            </div>
            <button className="btn-ghost" onClick={() => void refresh()}>
              <RefreshCw size={16} />
              Muat ulang
            </button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-[1fr_250px]">
            <section className="card overflow-hidden">
              <div className="discussion-list p-5" aria-label="Pesan diskusi">
                {!data.messages.length && (
                  <div className="py-10 text-center">
                    <h2 className="text-xl">Mulai dengan satu pertanyaan.</h2>
                    <p className="mt-3 text-sm text-muted">
                      Bagian mana dari materi ini yang ingin Anda pahami?
                    </p>
                  </div>
                )}
                {data.messages.map((m) => (
                  <article
                    key={m.id}
                    className={`message ${m.user_id === user?.id ? "message-own" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-copper">{m.name}</p>
                      <time className="text-[10px] text-muted">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Jakarta",
                        }).format(new Date(m.created_at))}
                      </time>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm">{m.body}</p>
                    {(m.user_id === user?.id || data.room.owner_id === user?.id) && (
                      <button
                        className="mt-2 inline-flex min-h-8 items-center gap-1 text-xs text-muted"
                        aria-label={`Hapus pesan ${m.name}`}
                        disabled={busy}
                        onClick={() => void remove(m.id)}
                      >
                        <Trash2 size={12} />
                        Hapus
                      </button>
                    )}
                  </article>
                ))}
              </div>
              <form onSubmit={send} className="border-t border-line p-4">
                <label className="form-label">
                  Pesan Anda
                  <textarea
                    className="field min-h-24 py-3"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    maxLength={2000}
                    placeholder="Tulis pertanyaan atau bagikan cara Anda memahami konsep…"
                  />
                </label>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-muted">
                    {text.length}/2000 · Terlihat oleh anggota
                  </span>
                  <button className="btn" disabled={busy || !text.trim()}>
                    <Send size={16} />
                    {busy ? "Memproses…" : "Kirim"}
                  </button>
                </div>
              </form>
            </section>
            <aside className="space-y-4">
              {topic && (
                <section className="card p-5">
                  <h2 className="text-xl">Belajar dulu, diskusi lagi.</h2>
                  <p className="mt-3 text-sm text-muted">{topic.blurb}</p>
                  <Link
                    to="/belajar/$topicId"
                    params={{ topicId: topic.id }}
                    className="btn-ghost mt-5 w-full"
                  >
                    Buka materi
                  </Link>
                </section>
              )}
              <section className="card p-5">
                <h2 className="text-xl">Teman di ruang ini</h2>
                <ul className="mt-4 space-y-3">
                  {data.members.map((m) => (
                    <li className="break-words text-sm text-muted" key={m.id}>
                      {m.name}
                      {m.id === data.room.owner_id ? " · Pemilik" : ""}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </>
      )}
    </>
  );
}
