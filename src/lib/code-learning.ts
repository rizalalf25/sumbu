import type { CodeLesson } from "./code.ts";

export const CODE_STEPS = ["Janji", "Ide", "Baca", "Tebak", "Coba", "Jebakan", "Catat"] as const;
export const CODE_COACH = [
  "Satu tujuan dulu. Anda tidak perlu menghafal semua sintaks.",
  "Jelaskan idenya dengan kata sendiri sebelum membaca kode.",
  "Telusuri input, proses, lalu keluaran. Jangan jalankan dulu.",
  "Hitung atau telusuri di kertas, baru pilih jawaban.",
  "Ubah satu hal. Tebak dampaknya, jalankan, lalu bandingkan.",
  "Kenali satu kesalahan agar bisa memperbaikinya sendiri.",
  "Tulis apa yang Anda pahami dan hasil percobaan Anda.",
];

// Tugas kecil untuk setiap contoh, bukan instruksi umum yang sama di semua layar.
export const CODE_PRACTICE: Record<string, { task: string; trap: string }> = Object.fromEntries(
  [
    [
      "py-dasar",
      "Ubah harga awal menjadi 100_000. Prediksi harga setelah dua diskon, lalu bandingkan keluaran dengan hitungan tangan.",
      "Diskon kedua memakai harga yang sudah didiskon, bukan harga awal. Jangan menjumlahkan persen diskon.",
    ],
    [
      "py-alur",
      "Ubah populasi awal dari 100 menjadi 200. Catat nilai populasi tiap putaran dan prediksi kapan while berhenti.",
      "Syarat while diperiksa sebelum setiap putaran. Nilai terakhir boleh melewati batas 3000.",
    ],
    [
      "py-fungsi",
      "Hitung turunan numerik pada x = 4. Bandingkan dengan turunan x², yaitu 2x.",
      "Selisih pembilang harus dibagi langkah kecil h. h terlalu kecil juga dapat memperbesar galat pembulatan.",
    ],
    [
      "py-kelas",
      "Ubah jumlah penarikan kedua agar lebih kecil daripada saldo tersisa. Periksa apakah saldo berkurang dan galat masih muncul.",
      "Pemeriksaan saldo harus dilakukan sebelum menguranginya. Penarikan yang gagal tidak boleh mengubah saldo.",
    ],
    [
      "py-numpy",
      "Ubah satu elemen matriks. Hitung satu elemen hasil perkalian dengan aturan baris kali kolom sebelum menjalankan.",
      "Perkalian elemen dengan * berbeda dari perkalian matriks dengan @. Periksa juga ukuran matriks.",
    ],
    [
      "py-pandas",
      "Ubah nilai 50 menjadi 80 pada data contoh. Bandingkan perubahan mean dan median kelompok tersebut.",
      "Rata-rata peka terhadap pencilan; median ditentukan setelah data diurutkan.",
    ],
    [
      "py-plot",
      "Bandingkan grafik dengan sumbu y mulai dari nol dan sumbu y yang dipotong. Jelaskan mengapa kesan besar kenaikannya berubah.",
      "Sumbu yang dipotong bisa membesar-besarkan perubahan kecil. Selalu baca skala, label, dan satuannya.",
    ],
    [
      "py-gd",
      "Kecilkan laju belajar pada contoh. Prediksi apakah tiga langkah pertama bergerak lebih dekat atau lebih jauh ke minimum.",
      "Tanda pembaruan harus mengurangi gradien. Laju belajar terlalu besar dapat membuat nilai melompat melewati minimum.",
    ],
    [
      "py-sklearn",
      "Ubah satu nilai target pada data latihan, latih ulang, lalu bandingkan koefisien dan prediksi.",
      "Model belajar dari data yang diberikan. Kecocokan pada data latihan belum membuktikan model baik pada data baru.",
    ],
    [
      "py-torch",
      "Ubah nilai bobot awal. Turunkan galat terhadap bobot dengan aturan rantai, lalu cocokkan dengan gradien autograd.",
      "backward menghitung gradien dan gradien dapat terakumulasi. Bersihkan gradien sebelum iterasi latihan berikutnya.",
    ],
    [
      "py-sim",
      "Perkecil langkah waktu, sambil mempertahankan durasi simulasi. Bandingkan posisi akhir dengan hasil analitis jatuh bebas.",
      "Jumlah langkah harus menyesuaikan durasi. Langkah waktu kecil biasanya mengurangi galat diskretisasi, bukan menghilangkannya.",
    ],
    [
      "py-qiskit",
      "Naikkan jumlah pengukuran. Bandingkan proporsi 0 dan 1 pada beberapa percobaan, bukan hanya satu.",
      "Probabilitas 50% tidak menjamin tepat separuh hasil pada setiap percobaan. Ada variasi acak.",
    ],
    [
      "py-struktur",
      "Tambahkan nilai 85 lagi. Prediksi perubahan panjang list dan jumlah nilai unik pada set.",
      "List menyimpan duplikat; set menghilangkannya. Jangan mengandalkan urutan set.",
    ],
    [
      "py-komprehensi",
      "Ubah batas filter suhu Fahrenheit. Hitung dulu anggota mana yang lolos, lalu bandingkan daftar hasil.",
      "Urutan konversi dan filter penting. Pastikan batas yang dibandingkan menggunakan satuan yang sama.",
    ],
    [
      "py-file",
      "Tambahkan satu baris CSV untuk kota yang sudah ada. Prediksi pertambahan total kelompok kota tersebut.",
      "Nilai CSV dibaca sebagai teks. Konversikan menjadi bilangan sebelum menjumlahkannya.",
    ],
    [
      "py-uji",
      "Tambahkan assert untuk list berisi satu nilai dan dua nilai. Jelaskan nilai median yang diharapkan sebelum menjalankan tes.",
      "List berukuran genap memiliki dua nilai tengah. Tes harus memeriksa hasil yang benar, bukan sekadar apakah kode berjalan.",
    ],
    [
      "py-algoritma",
      "Cari nilai yang tidak ada pada daftar terurut. Periksa hasil dan jumlah langkah pencarian.",
      "Pencarian biner memerlukan data terurut dan pembaruan batas yang tepat agar tidak berulang tanpa akhir.",
    ],
    [
      "py-rekursi",
      "Ubah n menjadi 20. Bandingkan jumlah pemanggilan dan hasilnya dengan versi tanpa cache pada n kecil.",
      "Rekursi harus punya kasus dasar. Cache menghindari menghitung submasalah yang sama berulang kali.",
    ],
    [
      "sql-select",
      "Naikkan ambang WHERE. Prediksi baris yang tersisa dan baris pertama setelah ORDER BY.",
      "WHERE menyaring sebelum hasil diurutkan. Urutan baris tidak dijamin tanpa ORDER BY.",
    ],
    [
      "sql-agregat",
      "Tambahkan satu transaksi pada kota yang sudah ada. Hitung ulang jumlah dan rata-rata kelompok itu.",
      "GROUP BY mengubah unit analisis dari satu transaksi menjadi satu kelompok. Jangan mencampur keduanya.",
    ],
    [
      "sql-join",
      "Bandingkan LEFT JOIN dengan INNER JOIN. Prediksi apakah pelanggan tanpa transaksi tetap muncul.",
      "Satu pelanggan dengan banyak transaksi dapat menghasilkan banyak baris. NULL bukan angka nol.",
    ],
    [
      "sql-having",
      "Ubah batas pada HAVING. Prediksi kelompok yang lolos setelah agregasi.",
      "WHERE menyaring baris sebelum GROUP BY; HAVING menyaring kelompok sesudahnya. COUNT DISTINCT menghitung nilai unik.",
    ],
    [
      "sql-window",
      "Ubah lebar jendela rata-rata bergerak. Hitung manual hasil pada satu baris di tengah data.",
      "Fungsi jendela mempertahankan baris asal. ORDER BY di dalam OVER menentukan urutan perhitungan.",
    ],
    [
      "sql-ab",
      "Bandingkan pembagian bilangan bulat dengan pembagian setelah satu operand diubah menjadi desimal.",
      "Pembagian bilangan bulat dapat menghilangkan bagian pecahan. Tipe data memengaruhi hasil rasio.",
    ],
    [
      "sql-cte",
      "Tampilkan hasil CTE terlebih dahulu, lalu jalankan query akhir. Bandingkan total kota dengan rata-rata total kota.",
      "Rata-rata transaksi dan rata-rata total per kota adalah dua perhitungan yang berbeda.",
    ],
    [
      "sql-indeks",
      "Lihat EXPLAIN sebelum dan sesudah indeks dibuat. Periksa perubahan rencana pencarian.",
      "Indeks tidak otomatis dipakai untuk semua query. Rencana juga bergantung pada ukuran data dan kondisi pencarian.",
    ],
    [
      "cpp-dasar",
      "Bandingkan 9/2 dan 9.0/2. Prediksi tipe dan hasil kedua pembagian.",
      "Menyimpan hasil pembagian int ke double tidak mengembalikan pecahan yang sudah hilang.",
    ],
    [
      "cpp-overflow",
      "Uji nilai dekat batas uint8_t. Hitung sisa pembagian terhadap 256 sebelum membandingkan hasilnya.",
      "Perputaran ini berlaku untuk bilangan tak bertanda. Overflow signed tidak boleh dianggap mempunyai aturan yang sama.",
    ],
    [
      "cpp-arduino",
      "Gandakan waktu tunggu nyala dan mati LED pada simulator. Hitung ulang periode dan frekuensinya.",
      "Periode adalah waktu nyala ditambah waktu mati; frekuensi adalah 1/periode, dengan periode dalam detik.",
    ],
    [
      "cpp-adc",
      "Ganti pembacaan ADC menjadi nol dan nilai maksimum. Prediksi tegangan untuk kedua batas tersebut.",
      "Rumus konversi bergantung pada resolusi ADC dan tegangan referensi. Hindari pembagian bulat sebelum konversi desimal.",
    ],
    [
      "cpp-pid",
      "Pada simulasi, ubah hanya Kp. Bandingkan kontribusi P, I, dan D untuk galat yang sama.",
      "Integral dan turunan memakai langkah waktu. Uji di simulasi; jangan langsung memakai setelan baru pada perangkat nyata.",
    ],
    [
      "cpp-ros",
      "Ubah interval timer dari 100 ms menjadi 200 ms. Prediksi laju pesan per detik.",
      "Milidetik perlu diubah menjadi detik. Laju teoritis juga bisa berbeda dari laju aktual saat sistem sibuk.",
    ],
    [
      "cpp-pointer",
      "Bandingkan perubahan nilai lewat salinan, referensi, dan pointer. Catat nilai variabel pemanggil setelah tiap fungsi.",
      "Parameter salinan tidak mengubah variabel asal. Pointer juga harus menunjuk objek yang masih valid.",
    ],
    [
      "cpp-kelas",
      "Ubah ukuran buffer dari tiga menjadi dua bacaan terakhir. Telusuri nilai yang dibuang, lalu hitung rata-rata isi buffer.",
      "Penyebut rata-rata adalah ukuran buffer saat ini, bukan jumlah seluruh bacaan yang pernah masuk. Tangani buffer kosong agar tidak membagi dengan nol.",
    ],
    [
      "r-vektor",
      "Tambahkan satu pencilan besar ke vektor. Bandingkan mean dan median sebelum dan sesudahnya.",
      "Mean dan median menjawab pertanyaan yang berbeda. Nilai hilang juga perlu ditangani secara eksplisit.",
    ],
    [
      "r-uji",
      "Baca batas interval kepercayaan pada keluaran uji. Periksa apakah nol termasuk di dalam interval itu.",
      "Hasil uji bergantung pada asumsi dan rancangan sampel. p-value bukan peluang hipotesis nol benar.",
    ],
    [
      "r-lm",
      "Ubah satu pengamatan, latih lm lagi, lalu bandingkan intersep, kemiringan, dan prediksi.",
      "Urutan koefisien adalah intersep lalu prediktor. Hubungan dalam regresi tidak otomatis membuktikan sebab-akibat.",
    ],
    [
      "r-dplyr",
      "Naikkan ambang filter sebelum group_by. Prediksi kota dan jumlah transaksi yang tersisa.",
      "Filter sebelum pengelompokan mengubah data yang diringkas. Jangan menafsirkan total terfilter sebagai total semua data.",
    ],
    [
      "r-ggplot",
      "Bandingkan grafik dengan pita ketidakpastian aktif dan nonaktif. Jelaskan informasi yang hilang saat pitanya disembunyikan.",
      "Pita standard error bukan rentang seluruh pengamatan. Lapisan grafik harus dibaca sesuai pemetaannya.",
    ],
    [
      "sh-dasar",
      "Pada berkas contoh yang aman, tambahkan satu baris data. Prediksi hasil wc -l dan jumlah data setelah header dikurangi.",
      "wc -l menghitung karakter baris baru. Header bukan baris data, dan baris terakhir tanpa newline dapat memengaruhi hitungan.",
    ],
    [
      "sh-pipa",
      "Tambahkan satu baris log contoh yang cocok dengan pola grep. Prediksi perubahan hasil setelah sort dan uniq.",
      "uniq menggabungkan baris identik yang bersebelahan; gunakan sort dahulu jika baris yang sama tersebar.",
    ],
    [
      "sh-izin",
      "Hitung arti 640 pada kertas: pemilik, grup, dan pengguna lain. Bandingkan dengan 755 tanpa mengubah file sistem.",
      "Tiga digit izin punya kelompok pemakai yang berbeda. Jangan memakai 777 sebagai jalan pintas.",
    ],
    [
      "sh-hash",
      "Pada berkas contoh, ubah satu karakter lalu hitung hash lagi. Bandingkan panjang dan isi digest.",
      "Hash yang sama bukan bukti asal file tepercaya bila nilai pembanding berasal dari sumber yang tidak tepercaya.",
    ],
    [
      "sh-skrip",
      "Telusuri satu putaran loop dengan nilai variabel yang berbeda. Uji hanya pada folder dan berkas latihan milik Anda.",
      "Beri tanda kutip pada variabel path. set -euo pipefail membantu mendeteksi galat, tetapi tidak menggantikan validasi input.",
    ],
  ].map(([id, task, trap]) => [id, { task, trap }]),
);

export function codeProgressKey(id: string) {
  return `kode-${id}`;
}
export function codeGuide(lesson: CodeLesson) {
  return CODE_PRACTICE[lesson.id];
}
