# QC SUMBU — 5 Oktober 2026

SUMBU sudah memiliki akun sungguhan, penyimpanan progres per pengguna, dashboard, serta ruang belajar tanpa kode undangan. Materi tetap terbuka bagi tamu. Akun Vercel sudah terhubung; penerbitan menunggu persetujuan integrasi Neon dan konfigurasi environment produksi.

## Perbaikan yang dilakukan

- Login dan pendaftaran email/password menggantikan akses akun pengembangan bersama. Backend mengambil identitas dari sesi; klien tidak boleh menentukan pemilik data.
- Catatan, latihan, draf kode, proyek, dan persiapan LPDP memakai satu penyimpanan progres bersama. Data tamu terpisah dari setiap akun, dengan pilihan impor dan cadangan.
- Sinkronisasi memeriksa revisi dan mempertahankan salinan lokal saat terjadi konflik. Respons dari sesi lama tidak dapat berpindah ke akun lain. Status penguasaan dari simpanan lokal versi lama dipertahankan.
- Ruang terbuka dapat dibuat dan diikuti pengguna terdaftar. Pembacaan/pengiriman pesan memerlukan keanggotaan. Penghapusan dibatasi ke penulis atau pemilik ruang.
- Validasi data progres, ukuran cadangan, panjang pesan, batas pesan, dan pembatasan login diterapkan di backend.
- Timer yang selesai mencatat sesi fokus. Navigasi akun, tampilan ponsel, indikator sinkronisasi, serta pemuatan awal server/browser diperbaiki.
- Seluruh tes skrip kini benar-benar ditemukan pada Windows maupun Linux. Fixture terisolasi dari aset situs asli. Aset PGLite lokal dapat dimuat pada build Node.
- Migrasi produksi memakai transaksi dan advisory lock transaksi agar deployment bersamaan aman melalui koneksi PostgreSQL pooled.
- Semua 44 pelajaran Kode mengikuti tujuh langkah belajar, dengan percobaan dan jebakan khusus, draf/catatan tersimpan, serta navigasi pelajaran berikutnya. Penyimpanan langkah Kode tidak merusak tautan lanjut materi matematika/fisika.
- Semua 17 jenis soal LPDP memiliki contoh dikerjakan dan pembahasan bertahap. Soal buatan menampilkan perhitungan dengan nilai yang sesuai parameter, bukan hanya jawaban akhir. Pembahasan simulasi tetap tersembunyi selama timer berjalan.
- Format kunci progres LPDP yang memakai titik dua kini diterima server. Label editor catatan dan pemilih contoh tetap terbaca dengan benar setelah data tersimpan dimuat ulang.

## Hasil pemeriksaan

| Pemeriksaan                            | Hasil                                                                 |
| -------------------------------------- | --------------------------------------------------------------------- |
| TypeScript                             | Lulus                                                                 |
| ESLint                                 | 0 error; 3 peringatan Fast Refresh yang sudah ada                     |
| Unit/regression                        | 278 lulus, 0 gagal, 4 dilewati                                        |
| Audit dependency saat pengerjaan       | 0 kerentanan dilaporkan npm                                           |
| Build Vercel                           | Lulus                                                                 |
| Build Node produksi                    | Lulus                                                                 |
| Browser desktop dan ponsel             | Tidak ada error JavaScript atau luapan horizontal; isi dev/build sama |
| Alur full stack pada build produksi    | 15 pemeriksaan lulus                                                  |
| Alur Kode dan LPDP pada build produksi | 8 pemeriksaan lulus                                                   |

Empat tes yang dilewati memeriksa dokumen skill platform Grok lama yang tidak disertakan dalam repository. Tes aplikasi dan alur akun tidak dilewati. Tes browser menggunakan Edge/Playwright, akun fixture yang dibuat khusus untuk QC, serta database PGLite lokal yang menjalankan SQL PostgreSQL. Akun fixture dan database lokal tidak ikut Git.

Alur browser mencakup materi tanpa akun, perlindungan dashboard, daftar/login/keluar, penolakan password salah, sesi fokus, catatan setelah reload, pemisahan data dua akun, pembuatan ruang, pembatasan nonanggota, bergabung tanpa undangan, moderasi, ponsel, pengambilan progres dari browser baru, dan konflik perubahan dari dua perangkat.

Tes pendidikan mencakup awal/akhir jalur lima bahasa, tujuh langkah, jawaban salah dan pengulangan kuis, kelulusan, pemulihan langkah terakhir/catatan/draf, eksekusi SQL sungguhan, contoh dan latihan semua jenis LPDP, 30 pembahasan setelah simulasi, serta catatan Kode dan hasil LPDP lintas perangkat. Tampilan Kode/LPDP dibandingkan pada dev dan build, desktop dan ponsel.

Smoke Kode/LPDP mengonfirmasi HTTP 200, tidak ada luapan horizontal, tidak ada error JavaScript, dan tidak ada perbedaan bermakna terhadap dev; skrip tetap memberi exit 2 karena lingkungan QC memblokir request font Google dan bridge Grok lama. Kedua request lama itu tetap dipertahankan; tampilan memakai font cadangan dan alur belajar tetap lulus tes browser.

## Hal yang masih memerlukan hosting

Belum ada URL publik atau pengujian terhadap PostgreSQL cloud/Vercel yang benar-benar diterbitkan. Ikuti [DEPLOYMENT.md](DEPLOYMENT.md) untuk membuat hosting/database, mengisi tiga environment produksi, dan menjalankan verifikasi setelah deploy. Jangan masukkan secret ke Git atau chat.

Verifikasi email, reset password melalui email, panel admin seluruh situs, pelaporan penyalahgunaan, dan penghapusan akun mandiri belum tersedia. Ruang memakai polling 15 detik dan menampilkan 100 pesan terakhir. Batas fitur lainnya dijelaskan dalam panduan deployment.

## Mengulang QC

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run build:node
```

Tes browser: jalankan pratinjau sesuai panduan deployment, kemudian `npm run test:e2e` dan `npm run test:education`. Workflow `.github/workflows/qc.yml` menyiapkan proses ini untuk pull request.
