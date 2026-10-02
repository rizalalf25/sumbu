import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { NOTE_FRAME } from "@/lib/progress";

export const Route = createFileRoute("/metode")({ component: Method });

function Method() {
  return (
    <Shell>
      <p className="text-sm font-semibold text-copper">Metode</p>
      <h1 className="mt-1 text-4xl md:text-5xl">Belajar 12 menit, tanpa menumpuk.</h1>
      <p className="mt-4 text-lg text-muted">
        Layar ini disusun untuk perhatian yang mudah pecah: satu ide, satu gerakan, lima soal, lalu berhenti. Bukan karena kamu kurang mampu, karena memori kerja memang sempit.
      </p>

      <ol className="mt-8 grid gap-3">
        {[
          ["Pilih satu materi", "Tutup tab lain. Kalau ingin materi kedua, tulis di kertas 'nanti', jangan dibuka."],
          ["Ucapkan ide inti", "Satu kalimat, keras atau berbisik. Kalau tidak bisa, kamu belum selesai di langkah Janji."],
          ["Salin satu rumus dengan tangan", "Menulis mengunci lebih kuat daripada memotret. Ketik di catatan hanya jika tidak ada kertas."],
          ["Gerakkan satu slider", "Sebut apa yang berubah dan apa yang diam. Itu eksperimen mini."],
          ["Kerjakan lima soal", "Salah: baca satu langkah, kerjakan soal serupa. Jangan mengulang soal yang sama lima kali."],
          ["Dua kalimat sendiri", "Kerangka: ide, kapan dipakai, di mana aku salah. Kalau lebih dari dua kalimat, kamu sedang menyalin."],
          ["Berdiri saat timer habis", "Air, bahu, jendela. Lanjut hanya satu blok lagi, atau berhenti. Keduanya sah."],
        ].map(([title, body], index) => (
          <li key={title} className="card flex gap-4 p-4">
            <span className="font-mono text-sm text-copper">{index + 1}</span>
            <span>
              <span className="block font-medium">{title}</span>
              <span className="mt-1 block text-sm text-muted">{body}</span>
            </span>
          </li>
        ))}
      </ol>

      <section className="mt-8">
        <h2 className="text-3xl">Cara Pomodoro</h2>
        <p className="mt-3 text-muted">
          Satu putaran adalah 25 menit kerja, lalu 5 menit berdiri. Setelah empat putaran, istirahat 15 menit. Timer dan musik lofi ada di tombol kecil pojok kanan bawah, di semua halaman. Ketuk jamnya untuk membuka pengaturan dan memilih blok 12 atau 25 menit.
        </p>
        <ol className="mt-4 grid gap-3">
          {[
            ["Tulis satu tugas", "Satu kalimat: materi apa, selesai kalau apa. Kalau tugasnya dua, tulis yang kedua di kertas 'nanti'."],
            ["Mulai 25 menit", "Tekan Mulai. Lofi boleh dihidupkan. Tab lain ditutup. Kalau pikiran lari, catat satu kata lalu kembali."],
            ["Berhenti saat bel", "Lima menit: air, bahu, jendela. Jangan membuka pesan. Bel bukan saran."],
            ["Putaran keempat", "Istirahat 15 menit. Baru boleh ganti materi. Kalau 25 menit terasa terlalu panjang, pilih blok 12 menit di pengaturan timer. Itu juga sah."],
          ].map(([title, body], index) => (
            <li key={title} className="card flex gap-4 p-4">
              <span className="font-mono text-sm text-copper">{index + 1}</span>
              <span>
                <span className="block font-medium">{title}</span>
                <span className="mt-1 block text-sm text-muted">{body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card mt-8 p-5">
        <h2 className="text-3xl">Kerangka catatan</h2>
        <pre className="mt-3 overflow-x-auto font-mono text-sm leading-6 whitespace-pre-wrap">{NOTE_FRAME}</pre>
        <p className="mt-3 text-sm text-muted">
          Ini versi pendek Cornell. Kolom kiri kata kunci, kanan penjelasan, bawah satu kalimat yang bisa kamu jelaskan ke teman tanpa buku.
        </p>
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-2">
        <article className="card p-4">
          <h2 className="text-2xl">Yang terasa belajar, tetapi bukan</h2>
          <p className="mt-2 text-sm text-muted">Menyorot semua kalimat. Menonton ulang tanpa menutup layar. Mengumpulkan rumus tanpa mengerjakan soal. Membuka tiga bab karena cemas ketinggalan.</p>
        </article>
        <article className="card p-4">
          <h2 className="text-2xl">Yang kecil dan manjur</h2>
          <p className="mt-2 text-sm text-muted">Mengambil soal, menutup catatan, mencoba, baru membuka. Mencampur dua materi yang sudah pernah disentuh, besok, bukan sekarang. Tidur. Istirahat adalah bagian dari konsolidasi, bukan hadiah setelah selesai selamanya.</p>
        </article>
      </section>

      <Link to="/" className="btn mt-8">
        Pilih satu materi
      </Link>
    </Shell>
  );
}
