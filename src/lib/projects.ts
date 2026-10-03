import { getLesson } from "./code.ts";
import { getRoadmap } from "./roadmaps.ts";
import { getTopic } from "./topics.ts";

export type Milestone = {
  t: string;
  d: string;
  /** Materi yang dipakai di tahap ini. */
  topic?: string;
  /** Pelajaran kode yang dipakai di tahap ini. */
  lesson?: string;
};

export type Project = {
  id: string;
  road: string;
  title: string;
  level: "pemula" | "menengah" | "portofolio";
  hours: number;
  brief: string;
  goal: string;
  stack: string[];
  milestones: Milestone[];
  deliver: string[];
  extend: string[];
  safety?: string;
};

export const PROJECTS: Project[] = [
  // ---------------------------------------------------------------- Analis
  {
    id: "dasbor-kpi",
    road: "analis",
    title: "Dasbor KPI toko daring",
    level: "pemula",
    hours: 10,
    brief:
      "Sebuah toko daring kecil mengirim ekspor transaksi setahun. Pemiliknya hanya ingin tahu: apakah bisnis tumbuh, produk mana yang menopang, dan bulan mana yang aneh.",
    goal: "Dasbor satu halaman berisi 4–6 KPI dengan tren mingguan dan catatan satu paragraf untuk pemilik toko.",
    stack: ["SQL (SQLite atau PostgreSQL)", "Python + pandas", "Looker Studio atau Metabase", "Dataset publik “Online Retail” (UCI)"],
    milestones: [
      { t: "Bersihkan data", d: "Buang transaksi batal, harga nol, dan duplikat. Catat berapa baris yang dibuang dan kenapa.", lesson: "sql-select" },
      { t: "Hitung KPI", d: "Omzet, jumlah pesanan, nilai rata-rata pesanan (AOV), dan pelanggan unik per bulan.", topic: "bilangan", lesson: "sql-having" },
      { t: "Tren dan musiman", d: "Rata-rata bergerak 4 minggu; bandingkan pertumbuhan bulan-ke-bulan dengan tahun-ke-tahun.", topic: "barisan", lesson: "sql-window" },
      { t: "Ringkas dengan jujur", d: "Laporkan median selain rata-rata untuk nilai pesanan; tandai pencilan dengan skor z.", topic: "sampel", lesson: "py-pandas" },
      { t: "Susun dasbor", d: "Satu grafik, satu pesan. Sumbu berlabel, satuan jelas, sumbu y mulai dari nol bila wajar.", lesson: "py-plot" },
    ],
    deliver: ["Tautan dasbor", "Query SQL dan notebook di GitHub", "Catatan satu paragraf: apa yang berubah dan apa yang belum boleh dipercaya"],
    extend: ["Segmentasi RFM pelanggan", "Peringatan otomatis saat KPI turun di bawah ambang"],
  },
  {
    id: "uji-ab",
    road: "analis",
    title: "Analisis uji A/B halaman checkout",
    level: "portofolio",
    hours: 12,
    brief:
      "Tim produk menguji dua desain tombol bayar selama dua minggu dan ingin langsung mengumumkan pemenang. Tugasmu memutuskan apakah datanya cukup untuk itu.",
    goal: "Laporan keputusan: konversi tiap varian, selisih dengan interval 95%, dan rekomendasi (luncurkan, tunda, atau ulang).",
    stack: ["SQL", "Python (pandas, SciPy) atau R", "Dataset publik uji A/B (Kaggle)"],
    milestones: [
      { t: "Periksa kesehatan eksperimen", d: "Apakah pembagian A/B mendekati 50:50? Apakah ada pengguna yang masuk dua varian?", topic: "peluang" },
      { t: "Hitung konversi dengan benar", d: "Hindari pembagian bulat; hitung per pengguna, bukan per kunjungan.", lesson: "sql-ab" },
      { t: "Galat baku dan interval", d: "SE tiap proporsi, SE selisih, interval 95%, dan nilai p.", topic: "inferensi", lesson: "r-uji" },
      { t: "Ukuran sampel", d: "Berapa pengguna yang dibutuhkan untuk mendeteksi selisih 1 poin persen? Bandingkan dengan yang dimiliki.", topic: "inferensi" },
      { t: "Segmen dan jebakan", d: "Bandingkan per perangkat. Waspadai Simpson's paradox dan mengintip hasil berkali-kali.", topic: "bayes" },
    ],
    deliver: ["Laporan 2 halaman untuk orang non-statistik", "Notebook yang bisa dijalankan ulang"],
    extend: ["Analisis Bayesian (peluang B lebih baik dari A)", "Simulasi: seberapa sering mengintip hasil membuat pemenang palsu"],
  },

  // ------------------------------------------------------------- Ilmuwan data
  {
    id: "harga-rumah",
    road: "ilmuwan",
    title: "Prediksi harga rumah",
    level: "menengah",
    hours: 15,
    brief:
      "Sebuah agen properti ingin taksiran harga yang masuk akal untuk listing baru, lengkap dengan seberapa yakin taksiran itu.",
    goal: "Model regresi yang mengalahkan baseline, dievaluasi dengan validasi silang, dan dijelaskan koefisiennya.",
    stack: ["Python", "pandas", "scikit-learn", "Dataset harga rumah publik (Kaggle)"],
    milestones: [
      { t: "Eksplorasi", d: "Histogram harga (miring ke kanan?), hubungan luas–harga, data hilang.", topic: "sampel", lesson: "py-pandas" },
      { t: "Transformasi log", d: "Modelkan log(harga): galat menjadi persen dan sebaran lebih simetris.", topic: "eksponen" },
      { t: "Baseline dan regresi", d: "Bandingkan dengan tebakan median. Fit regresi linear; baca kemiringan tiap fitur.", topic: "regresi", lesson: "py-sklearn" },
      { t: "Optimasi dan regularisasi", d: "Ridge/Lasso: penalti mencegah koefisien liar. Pahami gradien yang menurunkan galat.", topic: "rantai", lesson: "py-gd" },
      { t: "Evaluasi jujur", d: "Validasi silang 5 lipatan; laporkan rata-rata dan sebaran galat, bukan satu angka terbaik.", topic: "inferensi" },
    ],
    deliver: ["Notebook rapi di GitHub", "README: masalah, data, metrik, keterbatasan"],
    extend: ["Gradient boosting dan perbandingannya", "Aplikasi kecil Streamlit untuk mencoba taksiran"],
  },
  {
    id: "segmentasi",
    road: "ilmuwan",
    title: "Segmentasi pelanggan dengan PCA dan k-means",
    level: "portofolio",
    hours: 14,
    brief: "Tim pemasaran ingin tahu kelompok pelanggan alami tanpa label apa pun, supaya promosi tidak dikirim rata ke semua orang.",
    goal: "3–6 segmen yang bisa diberi nama dan dijelaskan, plus visual dua dimensi hasil PCA.",
    stack: ["Python", "NumPy", "scikit-learn", "Dataset perilaku belanja publik"],
    milestones: [
      { t: "Fitur dan skala", d: "Standarisasi tiap kolom (skor z) agar kolom bernilai besar tidak mendominasi.", topic: "sampel" },
      { t: "PCA", d: "Hitung matriks kovarians dan nilai eigennya; berapa persen variasi dijelaskan dua komponen pertama?", topic: "linalg", lesson: "py-numpy" },
      { t: "k-means", d: "Jarak antarpelanggan adalah panjang vektor. Pilih k dengan metode siku dan skor silhouette.", topic: "vektor" },
      { t: "Beri nama segmen", d: "Profil tiap segmen dengan median fitur aslinya, bukan angka PCA.", topic: "sampel" },
    ],
    deliver: ["Visual segmen 2D", "Tabel profil segmen", "Rekomendasi satu kalimat per segmen"],
    extend: ["Bandingkan dengan klaster hierarkis", "Uji stabilitas segmen di data bulan berikutnya"],
  },

  // ---------------------------------------------------------------- AI
  {
    id: "rag-dokumen",
    road: "ai",
    title: "Asisten tanya-jawab dokumen (RAG)",
    level: "portofolio",
    hours: 18,
    brief:
      "Sebuah kampus punya ratusan halaman peraturan akademik. Mahasiswa ingin bertanya dalam bahasa sehari-hari dan mendapat jawaban yang menyebut sumber pasalnya.",
    goal: "Aplikasi tanya-jawab yang mengambil potongan dokumen relevan lalu menjawab dengan kutipan sumber, plus set evaluasi 30 pertanyaan.",
    stack: ["Python", "Model embedding (misalnya sentence-transformers)", "FAISS atau pgvector", "API model bahasa", "Streamlit atau FastAPI"],
    milestones: [
      { t: "Potong dokumen", d: "Bagi menjadi potongan 300–500 kata dengan tumpang tindih; simpan nomor halaman.", lesson: "py-fungsi" },
      { t: "Embedding", d: "Ubah tiap potongan menjadi vektor; normalisasi panjangnya.", topic: "vektor", lesson: "py-numpy" },
      { t: "Pencarian", d: "Ambil k potongan dengan cosine similarity tertinggi terhadap pertanyaan.", topic: "linalg" },
      { t: "Jawab dengan sumber", d: "Susun prompt berisi potongan; minta jawaban yang menyebut halaman dan menolak jika tidak ada di dokumen.", topic: "entropi" },
      { t: "Evaluasi", d: "30 pertanyaan berkunci jawaban: ukur ketepatan pengambilan (recall@k) dan ketepatan jawaban, dengan interval.", topic: "inferensi" },
    ],
    deliver: ["Demo aplikasi", "Tabel evaluasi dan contoh kegagalan", "README arsitektur"],
    extend: ["Pencarian hibrida (kata kunci + vektor)", "Re-ranking", "Biaya dan latensi per pertanyaan"],
  },
  {
    id: "mlp-nol",
    road: "ai",
    title: "Jaringan saraf dari nol, lalu PyTorch",
    level: "menengah",
    hours: 14,
    brief: "Sebelum memakai kerangka kerja, buktikan kamu paham isinya: latih jaringan kecil untuk mengenali angka tulisan tangan dengan NumPy saja.",
    goal: "MLP dua lapis dengan akurasi uji > 90% di MNIST, lalu versi PyTorch yang hasilnya cocok.",
    stack: ["Python", "NumPy", "PyTorch", "MNIST"],
    milestones: [
      { t: "Lapisan sebagai matriks", d: "Satu batch gambar adalah matriks; keluaran lapisan = XW + b.", topic: "matriks", lesson: "py-numpy" },
      { t: "Softmax dan cross-entropy", d: "Ubah skor jadi peluang; hitung loss sebagai −log peluang kelas benar.", topic: "entropi" },
      { t: "Backpropagation", d: "Turunkan loss ke setiap bobot dengan aturan rantai; cek dengan turunan numerik.", topic: "rantai", lesson: "py-fungsi" },
      { t: "Pelatihan", d: "Gradient descent mini-batch; plot loss latih dan uji. Coba laju belajar terlalu besar.", topic: "numerik", lesson: "py-gd" },
      { t: "Versi PyTorch", d: "Tulis ulang dengan autograd; bandingkan gradien dengan versi NumPy.", lesson: "py-torch" },
    ],
    deliver: ["Notebook dengan grafik loss", "Penjelasan backprop dengan kata sendiri"],
    extend: ["Jaringan konvolusi kecil", "Visualisasi bobot lapisan pertama"],
  },

  // ---------------------------------------------------------------- Aktuaris
  {
    id: "premi-jiwa",
    road: "aktuaris",
    title: "Kalkulator premi asuransi jiwa berjangka",
    level: "menengah",
    hours: 12,
    brief: "Sebuah asuransi mikro ingin produk jiwa berjangka 10 tahun untuk usia 25–45. Mereka butuh premi tahunan yang adil dari tabel mortalita.",
    goal: "Lembar kerja atau notebook yang menghitung premi bersih untuk usia dan uang pertanggungan apa pun, lengkap dengan uji sensitivitas.",
    stack: ["Python atau spreadsheet", "Tabel mortalita contoh (publik)"],
    milestones: [
      { t: "Peluang bertahan hidup", d: "Dari qₓ ke peluang hidup k tahun dan peluang meninggal di tahun ke-k.", topic: "peluang" },
      { t: "Nilai sekarang manfaat", d: "Jumlahkan peluang meninggal × uang pertanggungan × faktor diskonto.", topic: "bunga" },
      { t: "Anuitas premi", d: "Premi dibayar di awal tahun selama hidup dan polis berjalan.", topic: "barisan", lesson: "py-alur" },
      { t: "Premi bersih", d: "Premi = nilai sekarang manfaat / nilai sekarang anuitas premi.", topic: "aljabar" },
      { t: "Sensitivitas", d: "Ubah bunga ±1% dan mortalita ±10%; mana yang lebih menggeser premi?", topic: "turunan" },
    ],
    deliver: ["Kalkulator yang bisa dicoba", "Tabel premi per usia", "Catatan asumsi"],
    extend: ["Premi kotor dengan biaya dan margin", "Cadangan premi per tahun polis"],
  },
  {
    id: "cadangan-mc",
    road: "aktuaris",
    title: "Simulasi Monte Carlo cadangan klaim",
    level: "portofolio",
    hours: 14,
    brief: "Perusahaan asuransi kendaraan perlu tahu berapa dana yang harus disisihkan agar 99,5% tahun tetap aman.",
    goal: "Simulasi 100.000 tahun klaim dengan frekuensi Poisson dan besaran acak, menghasilkan sebaran kerugian tahunan dan nilai VaR 99,5%.",
    stack: ["Python", "NumPy", "pandas"],
    milestones: [
      { t: "Frekuensi", d: "Jumlah klaim per tahun mengikuti Poisson; perkirakan λ dari data historis.", topic: "statistik" },
      { t: "Besaran", d: "Ukuran klaim miring ke kanan; pilih distribusi lognormal dan cocokkan parameternya.", topic: "sampel" },
      { t: "Simulasi", d: "Untuk tiap tahun simulasi: tarik jumlah klaim, lalu tarik besarannya, jumlahkan.", topic: "stokastik", lesson: "py-sim" },
      { t: "Ekor sebaran", d: "Hitung persentil 99,5% dan rata-rata di atasnya (TVaR).", topic: "integral" },
      { t: "Ketidakpastian", d: "Ulangi simulasi dengan seed berbeda; seberapa stabil angka VaR?", topic: "inferensi" },
    ],
    deliver: ["Histogram kerugian tahunan", "Tabel VaR dan TVaR", "Notebook yang bisa dijalankan ulang"],
    extend: ["Reasuransi excess-of-loss", "Korelasi antarlini bisnis"],
  },

  // ---------------------------------------------------------------- Elektro
  {
    id: "spektrum-audio",
    road: "elektro",
    title: "Penganalisis spektrum audio",
    level: "menengah",
    hours: 12,
    brief: "Bengkel musik ingin alat sederhana yang menunjukkan nada dasar dan harmonik suara gitar, sekaligus mendeteksi dengung 50 Hz dari listrik PLN.",
    goal: "Program yang merekam mikrofon, menampilkan spektrum langsung, dan menandai frekuensi puncak.",
    stack: ["Python", "NumPy (FFT)", "sounddevice", "matplotlib"],
    milestones: [
      { t: "Rekam dan cuplik", d: "Pilih laju sampling; buktikan dengan Nyquist bahwa 44,1 kHz cukup.", topic: "sinyal" },
      { t: "FFT", d: "Ubah blok 4096 cuplikan menjadi spektrum; hitung resolusi frekuensi fs/N.", topic: "fourier", lesson: "py-numpy" },
      { t: "Jendela", d: "Bandingkan tanpa jendela dan dengan jendela Hann; jelaskan kebocoran spektrum.", topic: "trig" },
      { t: "Puncak dan nada", d: "Temukan puncak; ubah frekuensi ke nama nada (A4 = 440 Hz, setiap semitone ×2^(1/12)).", topic: "eksponen" },
      { t: "Tampilan", d: "Grafik dB terhadap frekuensi dengan sumbu log.", lesson: "py-plot" },
    ],
    deliver: ["Video demo", "Kode di GitHub", "Penjelasan pilihan fs, N, dan jendela"],
    extend: ["Tuner gitar otomatis", "Port ke ESP32 dengan mikrofon I2S"],
  },
  {
    id: "buck-converter",
    road: "elektro",
    title: "Konverter buck dengan kendali tegangan",
    level: "portofolio",
    hours: 20,
    brief: "Panel surya 18 V harus mengisi perangkat 5 V. Rancang dan simulasikan konverter buck yang menjaga 5 V walau beban berubah.",
    goal: "Simulasi rangkaian LC dengan pengendali PI digital, grafik respons saat beban melonjak, dan pilihan nilai komponen yang dibenarkan.",
    stack: ["Python (SciPy) atau LTspice", "Opsional: prototipe dengan mikrokontroler"],
    milestones: [
      { t: "Prinsip kerja", d: "Tegangan keluaran ≈ duty cycle × tegangan masuk; hitung duty untuk 18 V → 5 V.", topic: "listrik" },
      { t: "Pilih L dan C", d: "Riak arus dan riak tegangan menentukan nilai induktor dan kapasitor.", topic: "magnet" },
      { t: "Model dinamis", d: "Tulis persamaan diferensial arus induktor dan tegangan kapasitor; simulasikan.", topic: "ode", lesson: "py-sim" },
      { t: "Fungsi alih", d: "Bawa ke ranah s; temukan frekuensi resonansi LC.", topic: "laplace" },
      { t: "Kendali", d: "Pengendali PI digital; uji lonjakan beban dan atur penguatan agar tidak berosilasi.", topic: "kendali", lesson: "cpp-pid" },
    ],
    deliver: ["Skematik", "Grafik respons tangga", "Laporan pemilihan komponen"],
    extend: ["MPPT untuk panel surya", "Efisiensi dan rugi switching"],
    safety: "Bekerja dengan tegangan rendah (< 24 V DC) saat membuat prototipe. Jangan menyentuh sisi listrik PLN.",
  },

  // ---------------------------------------------------------------- Mesin
  {
    id: "braket-rak",
    road: "mesin",
    title: "Desain braket rak dinding",
    level: "pemula",
    hours: 10,
    brief: "Rak dinding harus menahan 40 kg buku. Rancang braket L dari pelat baja atau aluminium dan buktikan aman.",
    goal: "Gambar teknik braket, perhitungan gaya dan tegangan, faktor keamanan ≥ 3, dan perbandingan dengan simulasi FEM.",
    stack: ["FreeCAD atau Fusion 360", "Python atau spreadsheet untuk hitungan"],
    milestones: [
      { t: "Diagram benda bebas", d: "Berat buku, gaya baut, dan reaksi dinding.", topic: "newton" },
      { t: "Kesetimbangan", d: "ΣF = 0 dan Στ = 0 untuk menemukan gaya tarik baut atas.", topic: "bahan" },
      { t: "Tegangan lentur", d: "Hitung tegangan maksimum di sudut braket; bandingkan dengan tegangan luluh.", topic: "bahan" },
      { t: "Simulasi FEM", d: "Jalankan analisis statik; bandingkan hasil dengan hitungan tangan.", topic: "numerik" },
      { t: "Iterasi desain", d: "Tambah rusuk atau ubah tebal; catat massa vs faktor keamanan.", topic: "rantai" },
    ],
    deliver: ["Gambar teknik", "Lembar hitungan", "Gambar hasil FEM"],
    extend: ["Uji beban nyata dengan timbangan", "Optimasi topologi"],
  },
  {
    id: "suspensi",
    road: "mesin",
    title: "Simulasi suspensi motor",
    level: "portofolio",
    hours: 16,
    brief: "Motor melewati polisi tidur. Pengendara ingin nyaman, ban ingin tetap menempel. Pilih kekakuan pegas dan redaman yang paling seimbang.",
    goal: "Model massa–pegas–peredam, simulasi melewati gundukan, dan rekomendasi nilai k dan c.",
    stack: ["Python", "NumPy", "SciPy"],
    milestones: [
      { t: "Model", d: "m x'' + c x' + k x = gaya dari jalan. Tentukan massa terayun.", topic: "ode" },
      { t: "Frekuensi alami", d: "ω = √(k/m); kenyamanan biasanya 1–1,5 Hz.", topic: "gelombang" },
      { t: "Simulasi gundukan", d: "Langkahkan persamaan; plot posisi dan percepatan pengendara.", topic: "numerik", lesson: "py-sim" },
      { t: "Redaman", d: "Bandingkan kurang, kritis, dan lebih teredam; cari rasio redaman 0,3–0,5.", topic: "laplace" },
      { t: "Kompromi", d: "Plot kenyamanan vs cengkeraman ban untuk banyak (k, c); pilih titik seimbang.", topic: "parsial" },
    ],
    deliver: ["Grafik respons", "Tabel rekomendasi", "Penjelasan kompromi"],
    extend: ["Model seperempat kendaraan dua massa", "Suspensi semi-aktif dengan kendali"],
  },

  // ---------------------------------------------------------------- Fisikawan
  {
    id: "ukur-g",
    road: "fisikawan",
    title: "Mengukur g dengan bandul dan analisis galat",
    level: "pemula",
    hours: 8,
    brief: "Dengan tali, beban, dan stopwatch ponsel, ukur percepatan gravitasi di tempatmu dan laporkan dengan ketidakpastiannya.",
    goal: "Nilai g ± ketidakpastian, dari regresi T² terhadap L untuk minimal 6 panjang tali.",
    stack: ["Bandul sederhana", "Stopwatch atau aplikasi phyphox", "Python atau spreadsheet"],
    milestones: [
      { t: "Rancang eksperimen", d: "Ukur 10 ayunan sekaligus untuk mengecilkan galat reaksi; simpangan kecil.", topic: "gelombang" },
      { t: "Data", d: "6 panjang tali, 5 ulangan tiap panjang; catat rata-rata dan simpangan baku.", topic: "sampel" },
      { t: "Linearisasi", d: "T² = (4π²/g) L: plot T² terhadap L harus lurus.", topic: "aljabar" },
      { t: "Regresi dan galat", d: "Kemiringan dan galat bakunya memberi g dan ketidakpastiannya.", topic: "regresi", lesson: "py-sklearn" },
      { t: "Bandingkan", d: "Apakah 9,78 m/s² ada di dalam intervalmu? Jika tidak, cari sumber galat sistematis.", topic: "inferensi" },
    ],
    deliver: ["Laporan praktikum 3 halaman", "Grafik T² vs L dengan garis regresi"],
    extend: ["Koreksi simpangan besar", "Ukur dengan sensor akselerometer ponsel"],
  },
  {
    id: "orbit",
    road: "fisikawan",
    title: "Simulasi orbit planet",
    level: "portofolio",
    hours: 14,
    brief: "Simulasikan orbit Bumi mengelilingi Matahari dan buktikan bahwa metode numerik yang salah membuat planet lepas dari orbit.",
    goal: "Simulasi 2D dengan dua integrator (Euler dan Verlet), grafik energi total, dan hukum Kepler yang diverifikasi dari data simulasi.",
    stack: ["Python", "NumPy", "matplotlib"],
    milestones: [
      { t: "Hukum gravitasi", d: "Gaya sebagai vektor dengan besar GMm/r².", topic: "vektor" },
      { t: "Euler", d: "Langkahkan posisi dan kecepatan; amati energi yang terus naik.", topic: "numerik", lesson: "py-sim" },
      { t: "Verlet", d: "Integrator simplektik: energi berosilasi kecil tetapi tidak menyimpang.", topic: "ode" },
      { t: "Kekekalan", d: "Plot energi dan momentum sudut terhadap waktu.", topic: "energi" },
      { t: "Kepler", d: "Ukur periode untuk beberapa jari-jari; tunjukkan T² ∝ r³ dengan regresi log-log.", topic: "eksponen" },
    ],
    deliver: ["Animasi atau gambar orbit", "Grafik energi kedua metode", "Penjelasan kenapa Verlet lebih jujur"],
    extend: ["Tiga benda", "Bulan mengelilingi Bumi mengelilingi Matahari"],
  },

  // ---------------------------------------------------------------- Robotika
  {
    id: "line-follower",
    road: "robotika",
    title: "Robot pengikut garis dengan PID",
    level: "pemula",
    hours: 12,
    brief: "Robot dua roda harus mengikuti garis hitam di lantai putih secepat mungkin tanpa keluar jalur.",
    goal: "Robot yang menyelesaikan lintasan berkelok, dengan laporan penalaan Kp, Ki, Kd dan waktu putaran.",
    stack: ["Arduino atau ESP32", "Sensor IR 3–5 kanal", "Driver motor L298N/TB6612", "Simulator Wokwi untuk awal"],
    milestones: [
      { t: "Baca sensor", d: "Ubah pembacaan IR menjadi posisi garis (−1 sampai 1) dengan rata-rata berbobot.", topic: "sampel", lesson: "cpp-adc" },
      { t: "Galat", d: "Galat = 0 − posisi; tentukan tanda agar robot berbelok ke arah yang benar.", topic: "aljabar" },
      { t: "Kendali P", d: "Selisih kecepatan roda = Kp × galat. Amati goyangan saat Kp terlalu besar.", topic: "kendali", lesson: "cpp-pid" },
      { t: "Tambah D lalu I", d: "D meredam goyangan; I hanya bila robot selalu miring sebelah.", topic: "kendali" },
      { t: "Kecepatan", d: "Naikkan kecepatan dasar sampai batas; catat waktu putaran per konfigurasi.", topic: "rotasi" },
    ],
    deliver: ["Video lintasan", "Kode firmware", "Tabel penalaan PID"],
    extend: ["Pendeteksi persimpangan", "Kecepatan adaptif di tikungan"],
  },
  {
    id: "drone",
    road: "robotika",
    title: "Drone quadcopter: kendali ketinggian dan sikap",
    level: "portofolio",
    hours: 40,
    brief:
      "Rancang dan terbangkan quadcopter kecil yang bisa melayang stabil di ketinggian 1 meter dan kembali datar setelah didorong. Mulai di simulasi, baru perangkat keras.",
    goal: "Drone (simulasi dan, bila memungkinkan, fisik) yang mempertahankan ketinggian ±10 cm dan sudut roll/pitch ±5°, dengan log data penerbangan dan laporan penalaan.",
    stack: [
      "Python untuk model dan simulasi",
      "C++ untuk firmware (ESP32 atau flight controller)",
      "PX4 atau ArduPilot SITL + Gazebo",
      "ROS 2 (opsional)",
      "Rangka 250 mm, motor brushless, ESC, IMU MPU-6050, barometer, baterai LiPo 3S",
    ],
    milestones: [
      { t: "Fisika melayang", d: "Gaya angkat total empat rotor = berat. Hitung gaya dorong per motor dan rasio dorong/berat minimal 2:1.", topic: "newton" },
      { t: "Torsi dan arah putar", d: "Dua rotor searah jarum jam, dua berlawanan; selisih gaya kiri–kanan menghasilkan torsi roll.", topic: "rotasi" },
      { t: "Kerangka koordinat", d: "Matriks rotasi dari badan drone ke bumi; ubah sudut roll/pitch/yaw menjadi arah dorong.", topic: "linalg", lesson: "py-numpy" },
      { t: "Model dan simulasi", d: "Persamaan gerak vertikal dan rotasi; simulasikan dengan langkah waktu kecil di Python.", topic: "ode", lesson: "py-sim" },
      { t: "Sensor dan filter", d: "IMU dicuplik 500 Hz–1 kHz; gabungkan giroskop dan akselerometer dengan filter komplementer.", topic: "sinyal", lesson: "cpp-adc" },
      { t: "PID ketinggian", d: "Masukan barometer, keluaran gas total. Mulai dengan P, tambah D untuk meredam.", topic: "kendali", lesson: "cpp-pid" },
      { t: "PID sikap", d: "Loop dalam roll/pitch yang lebih cepat dari loop ketinggian. Hindari derivative kick.", topic: "kendali" },
      { t: "Uji di SITL", d: "Jalankan firmware di PX4/ArduPilot SITL + Gazebo; dorong drone virtual dan rekam respons.", lesson: "cpp-ros" },
      { t: "Uji fisik bertahap", d: "Tanpa baling-baling dulu, lalu ditambat tali, baru melayang bebas di area terbuka.", topic: "satuan" },
      { t: "Analisis log", d: "Plot target vs aktual; hitung overshoot, waktu naik, dan galat tunak.", topic: "sampel", lesson: "py-plot" },
    ],
    deliver: ["Video simulasi dan (bila ada) penerbangan nyata", "Firmware dan skrip simulasi di GitHub", "Laporan penalaan PID dengan grafik log", "Daftar komponen dan anggaran daya baterai"],
    extend: ["Tahan posisi dengan GPS atau optical flow", "Misi titik-ke-titik otomatis", "Deteksi objek dengan kamera"],
    safety:
      "Selalu lepas baling-baling saat memprogram dan menguji motor. Baterai LiPo diisi dengan pengisi khusus dan disimpan di kantong tahan api. Terbangkan jauh dari orang dan bandara, dan patuhi aturan penerbangan drone Kementerian Perhubungan yang berlaku.",
  },

  // ---------------------------------------------------------------- Energi
  {
    id: "plts-atap",
    road: "energi",
    title: "Desain PLTS atap rumah",
    level: "pemula",
    hours: 10,
    brief: "Sebuah rumah memakai 300 kWh per bulan dan ingin memasang panel surya. Berapa panel yang dibutuhkan dan berapa lama balik modal?",
    goal: "Laporan desain: kapasitas kWp, jumlah panel, produksi bulanan, penghematan, dan NPV 20 tahun.",
    stack: ["Python atau spreadsheet", "Data radiasi matahari (PVGIS, NASA POWER)"],
    milestones: [
      { t: "Kebutuhan energi", d: "Ubah kWh/bulan ke kWh/hari; pisahkan siang dan malam.", topic: "satuan" },
      { t: "Sumber energi", d: "Jam puncak matahari dari data radiasi; produksi = kWp × jam puncak × rasio kinerja.", topic: "integral" },
      { t: "Sudut panel", d: "Kemiringan dan arah panel untuk lintang lokasimu.", topic: "trig" },
      { t: "Ekonomi", d: "Biaya investasi, penghematan tahunan, degradasi 0,5%/tahun, NPV dan payback.", topic: "bunga" },
      { t: "Ketidakpastian", d: "Variasi produksi musim hujan vs kemarau; laporkan rentang, bukan satu angka.", topic: "sampel", lesson: "py-pandas" },
    ],
    deliver: ["Laporan desain 3 halaman", "Lembar hitungan yang bisa dipakai ulang"],
    extend: ["Tambah baterai dan bandingkan NPV", "Optimasi kapasitas terhadap tarif"],
  },
  {
    id: "bms-ev",
    road: "energi",
    title: "Model baterai EV dan BMS sederhana",
    level: "portofolio",
    hours: 18,
    brief: "Tim motor listrik kampus butuh estimasi sisa daya (SoC) yang bisa dipercaya dan peringatan saat sel terlalu panas.",
    goal: "Model sel baterai (rangkaian ekuivalen), estimator SoC dengan coulomb counting dan koreksi tegangan, serta simulasi suhu.",
    stack: ["Python", "NumPy", "Opsional: ESP32 + sensor arus INA219"],
    milestones: [
      { t: "Kapasitas dan energi", d: "Ah, Wh, C-rate; hitung jarak tempuh dari energi per km.", topic: "satuan" },
      { t: "Model sel", d: "Sumber tegangan + resistansi + RC; tegangan turun saat arus besar.", topic: "ode", lesson: "py-sim" },
      { t: "Coulomb counting", d: "SoC = SoC awal − ∫ arus dt / kapasitas; galat menumpuk seiring waktu.", topic: "integral" },
      { t: "Koreksi", d: "Gunakan tegangan saat istirahat untuk mengoreksi SoC; bandingkan dengan dan tanpa koreksi.", topic: "bayes" },
      { t: "Panas", d: "Panas = I²R; simulasikan kenaikan suhu dan batas pengaman.", topic: "termo" },
    ],
    deliver: ["Grafik SoC estimasi vs sebenarnya", "Kode model", "Batas pengaman yang disarankan"],
    extend: ["Filter Kalman untuk SoC", "Penyeimbangan sel"],
    safety: "Baterai lithium bisa terbakar bila hubung singkat atau diisi berlebihan. Gunakan sel kecil dan pengaman, jangan membongkar paket baterai kendaraan.",
  },

  // ---------------------------------------------------------------- Siber
  {
    id: "deteksi-brute",
    road: "siber",
    title: "Pendeteksi serangan brute-force SSH",
    level: "pemula",
    hours: 10,
    brief: "Server kampus menerima ribuan percobaan login gagal setiap hari. Buat alat yang menandai alamat IP mencurigakan tanpa membanjiri admin dengan alarm palsu.",
    goal: "Skrip yang membaca log, menghitung kegagalan per IP per jam, dan memberi peringatan berdasarkan garis dasar statistik.",
    stack: ["Bash", "Python + pandas", "Log contoh (dataset publik atau server lab sendiri)"],
    milestones: [
      { t: "Saring log", d: "Ambil baris login gagal dan alamat IP-nya dengan grep dan awk.", lesson: "sh-pipa" },
      { t: "Tabel per jam", d: "Hitung kegagalan per IP per jam.", topic: "diskrit", lesson: "py-pandas" },
      { t: "Garis dasar", d: "Rata-rata dan simpangan baku kegagalan normal; tandai skor z > 3.", topic: "sampel" },
      { t: "Alarm palsu", d: "Dari 1.000 alarm, berapa yang benar? Atur ambang dengan memperhitungkan angka dasar.", topic: "bayes" },
      { t: "Laporan", d: "Ringkasan harian: IP teratas, pola waktu, dan rekomendasi (fail2ban, kunci SSH).", lesson: "sh-izin" },
    ],
    deliver: ["Skrip di GitHub", "Contoh laporan harian"],
    extend: ["Integrasi dengan fail2ban", "Dasbor serangan per negara"],
    safety: "Hanya analisis log milik sendiri atau dataset publik. Jangan memindai atau menyerang sistem orang lain.",
  },
  {
    id: "rsa-sandi",
    road: "siber",
    title: "RSA mainan dan pengukur kekuatan kata sandi",
    level: "menengah",
    hours: 12,
    brief: "Untuk materi pelatihan keamanan karyawan, buat dua demo: bagaimana RSA bekerja dengan angka kecil, dan kenapa “P@ssw0rd” lemah.",
    goal: "Program edukasi yang mengenkripsi dan mendekripsi pesan dengan RSA kecil, dan menghitung entropi kata sandi dalam bit beserta perkiraan waktu brute force.",
    stack: ["Python"],
    milestones: [
      { t: "Pangkat modular", d: "Implementasi kuadrat-berulang tanpa angka meledak.", topic: "modular", lesson: "cpp-overflow" },
      { t: "Kunci RSA", d: "Pilih p dan q prima, hitung n dan φ, cari d dengan algoritma Euclid diperluas.", topic: "modular", lesson: "py-fungsi" },
      { t: "Enkripsi dan dekripsi", d: "Ubah teks ke angka, enkripsi, dekripsi; tunjukkan kenapa n kecil mudah difaktorkan.", topic: "diskrit" },
      { t: "Entropi kata sandi", d: "Bit = panjang × log₂(ukuran himpunan karakter); kurangi untuk pola kamus.", topic: "entropi" },
      { t: "Waktu brute force", d: "2^bit tebakan dibagi kecepatan GPU; tampilkan dalam satuan manusia.", topic: "eksponen", lesson: "sh-hash" },
    ],
    deliver: ["Aplikasi demo", "Penjelasan untuk orang awam"],
    extend: ["Tanda tangan digital", "Mengapa komputer kuantum mengancam RSA"],
    safety: "RSA mainan hanya untuk belajar. Untuk sistem nyata, selalu gunakan pustaka kriptografi yang sudah diaudit.",
  },

  // ---------------------------------------------------------------- Quant
  {
    id: "backtest",
    road: "quant",
    title: "Backtest strategi rata-rata bergerak",
    level: "menengah",
    hours: 14,
    brief: "Uji apakah aturan sederhana “beli saat rata-rata 50 hari memotong ke atas rata-rata 200 hari” benar-benar lebih baik daripada beli dan tahan.",
    goal: "Backtest dengan biaya transaksi, metrik risiko (Sharpe, drawdown), dan uji apakah hasilnya bukan kebetulan.",
    stack: ["Python", "pandas", "Data harga historis indeks (publik)"],
    milestones: [
      { t: "Return", d: "Hitung return harian dan log-return; kenapa log-return bisa dijumlah.", topic: "eksponen" },
      { t: "Sinyal", d: "Rata-rata bergerak 50 dan 200 hari; posisi masuk/keluar.", topic: "barisan", lesson: "sql-window" },
      { t: "Kinerja", d: "Return tahunan, volatilitas √252, rasio Sharpe, drawdown maksimum.", topic: "stokastik", lesson: "py-pandas" },
      { t: "Biaya dan realisme", d: "Biaya transaksi dan slippage; sinyal hari ini hanya bisa dieksekusi besok.", topic: "bilangan" },
      { t: "Kebetulan atau bukan", d: "Bandingkan dengan 1.000 strategi acak; waspadai overfitting parameter.", topic: "inferensi" },
    ],
    deliver: ["Notebook backtest", "Grafik ekuitas vs beli-dan-tahan", "Kesimpulan jujur, termasuk bila strategi kalah"],
    extend: ["Walk-forward testing", "Portofolio multi-aset"],
    safety: "Proyek ini latihan analisis data, bukan saran investasi. Hasil masa lalu tidak menjamin hasil masa depan.",
  },
  {
    id: "var-portofolio",
    road: "quant",
    title: "Value at Risk portofolio dengan Monte Carlo",
    level: "portofolio",
    hours: 16,
    brief: "Manajer risiko ingin tahu kerugian satu hari yang hanya terlampaui 1 dari 100 hari untuk portofolio lima saham.",
    goal: "VaR 99% dengan tiga metode (historis, parametrik, Monte Carlo) dan analisis faktor risiko utama.",
    stack: ["Python", "NumPy", "pandas"],
    milestones: [
      { t: "Matriks kovarians", d: "Return lima saham; hitung kovarians dan korelasi.", topic: "matriks", lesson: "py-numpy" },
      { t: "Faktor utama", d: "Nilai eigen kovarians: berapa persen risiko dari satu faktor pasar?", topic: "linalg" },
      { t: "VaR historis dan parametrik", d: "Persentil 1% data historis; versi normal dengan μ dan σ portofolio.", topic: "sampel" },
      { t: "Monte Carlo", d: "Tarik return berkorelasi (dekomposisi Cholesky); 100.000 skenario.", topic: "stokastik", lesson: "py-sim" },
      { t: "Uji balik", d: "Hitung berapa hari kerugian nyata melampaui VaR; apakah mendekati 1%?", topic: "inferensi" },
    ],
    deliver: ["Laporan risiko satu halaman", "Notebook tiga metode"],
    extend: ["Expected shortfall", "Uji stres skenario krisis"],
    safety: "Proyek ini latihan pemodelan risiko, bukan saran investasi.",
  },

  // ---------------------------------------------------------------- Iklim
  {
    id: "tren-suhu",
    road: "iklim",
    title: "Tren suhu kotamu",
    level: "pemula",
    hours: 10,
    brief: "Apakah kotamu benar-benar makin panas, atau hanya terasa begitu? Jawab dengan data suhu harian puluhan tahun.",
    goal: "Grafik anomali suhu tahunan, tren per dekade dengan interval kepercayaan, dan perbandingan dengan tren global.",
    stack: ["Python", "pandas", "Data suhu harian (NASA POWER, Berkeley Earth, atau stasiun BMKG)"],
    milestones: [
      { t: "Ambil data", d: "Unduh suhu harian 30–40 tahun; periksa data hilang.", lesson: "py-pandas" },
      { t: "Anomali", d: "Kurangi rata-rata jangka panjang tiap bulan agar musim tidak menipu.", topic: "sampel" },
      { t: "Musiman", d: "Lihat siklus tahunan; bandingkan dengan suku sinus-kosinus.", topic: "fourier" },
      { t: "Tren", d: "Regresi anomali tahunan terhadap tahun; kemiringan × 10 = °C per dekade.", topic: "regresi", lesson: "py-sklearn" },
      { t: "Seberapa yakin", d: "Interval kepercayaan kemiringan; apakah 0 ada di dalamnya?", topic: "inferensi" },
    ],
    deliver: ["Grafik “garis warna” anomali suhu", "Notebook dan ringkasan satu paragraf"],
    extend: ["Hari ekstrem (> persentil 95) per tahun", "Bandingkan beberapa kota"],
  },
  {
    id: "risiko-banjir",
    road: "iklim",
    title: "Peta risiko genangan dari elevasi dan curah hujan",
    level: "portofolio",
    hours: 18,
    brief: "Pemerintah kecamatan ingin tahu wilayah mana yang paling rawan tergenang saat hujan ekstrem.",
    goal: "Peta risiko genangan dari model elevasi digital (DEM), kemiringan lahan, akumulasi aliran, dan periode ulang hujan.",
    stack: ["QGIS", "Python (rasterio, NumPy)", "DEM publik (DEMNAS/SRTM)", "Data hujan harian"],
    milestones: [
      { t: "Data spasial", d: "DEM adalah matriks ketinggian; pahami proyeksi dan resolusi piksel.", topic: "linalg" },
      { t: "Kemiringan", d: "Gradien ketinggian di setiap piksel; arah aliran ke tetangga terendah.", topic: "parsial", lesson: "py-numpy" },
      { t: "Akumulasi aliran", d: "Hitung berapa piksel mengalir ke tiap titik: lembah dan cekungan muncul.", topic: "diskrit" },
      { t: "Hujan ekstrem", d: "Peluang hujan harian > 100 mm per tahun dan periode ulangnya.", topic: "peluang" },
      { t: "Indeks risiko", d: "Gabungkan elevasi rendah, akumulasi tinggi, dan hujan; validasi dengan laporan banjir historis.", topic: "sampel" },
    ],
    deliver: ["Peta risiko", "Metodologi singkat", "Daftar keterbatasan model"],
    extend: ["Simulasi genangan sederhana", "Tumpang-susun dengan data penduduk"],
  },

  // ---------------------------------------------------------------- IoT
  {
    id: "stasiun-cuaca",
    road: "iot",
    title: "Stasiun cuaca mini ESP32",
    level: "pemula",
    hours: 12,
    brief: "Pasang stasiun cuaca kecil di sekolah atau rumah yang mengirim suhu, kelembapan, dan tekanan ke dasbor daring setiap menit.",
    goal: "Perangkat ESP32 dengan sensor yang mengirim data lewat MQTT, dasbor grafik, dan analisis data satu minggu.",
    stack: ["ESP32", "Sensor BME280", "Arduino IDE atau PlatformIO", "MQTT (broker publik/lokal)", "Node-RED atau Grafana"],
    milestones: [
      { t: "Rangkaian", d: "Hubungkan sensor lewat I2C; cek tegangan dan konsumsi arus.", topic: "listrik", lesson: "cpp-arduino" },
      { t: "Baca dan skala", d: "Baca sensor, konversi satuan, tampilkan di Serial.", topic: "satuan", lesson: "cpp-adc" },
      { t: "Laju sampling", d: "Satu cuplikan per menit cukup untuk cuaca; hitung umur baterai dengan deep sleep.", topic: "sinyal" },
      { t: "Kirim data", d: "Publikasikan JSON lewat MQTT; tangani Wi-Fi yang putus.", lesson: "cpp-overflow" },
      { t: "Analisis", d: "Siklus harian suhu dan penurunan tekanan sebelum hujan.", topic: "sampel", lesson: "py-pandas" },
    ],
    deliver: ["Foto perangkat", "Firmware", "Tautan dasbor"],
    extend: ["Prediksi hujan sederhana dari tekanan", "Panel surya untuk daya"],
  },
  {
    id: "inkubator",
    road: "iot",
    title: "Kendali suhu inkubator dengan PID",
    level: "portofolio",
    hours: 16,
    brief: "Peternak kecil butuh inkubator telur yang menjaga 37,5 °C ±0,3 °C. Pemanas lampu dikendalikan relai atau MOSFET.",
    goal: "Inkubator yang stabil dengan kendali PID, log suhu 24 jam, dan analisis kestabilan.",
    stack: ["ESP32 atau Arduino", "Sensor suhu DS18B20/SHT31", "MOSFET atau SSR", "Kotak styrofoam"],
    milestones: [
      { t: "Model termal", d: "Kotak memanas dan mendingin seperti sistem orde satu; ukur konstanta waktunya.", topic: "termo" },
      { t: "Respons tangga", d: "Nyalakan pemanas penuh, rekam suhu, cocokkan dengan 1 − e^(−t/τ).", topic: "ode" },
      { t: "PID", d: "Keluaran PWM dari PID; mulai dari P lalu tambah I untuk menghapus galat tunak.", topic: "kendali", lesson: "cpp-pid" },
      { t: "Pengaman", d: "Batas suhu maksimum dan alarm bila sensor gagal.", lesson: "cpp-dasar" },
      { t: "Evaluasi", d: "Log 24 jam; hitung rata-rata, simpangan baku, dan waktu di luar ±0,3 °C.", topic: "sampel" },
    ],
    deliver: ["Grafik suhu 24 jam", "Firmware", "Laporan penalaan"],
    extend: ["Kendali kelembapan", "Notifikasi ke ponsel"],
    safety: "Lampu pemanas dan relai yang terhubung listrik 220 V berbahaya. Gunakan pemanas tegangan rendah, atau minta pendamping yang berpengalaman untuk bagian listrik PLN.",
  },

  // ---------------------------------------------------------------- Kuantum
  {
    id: "qrng",
    road: "kuantum",
    title: "Generator bilangan acak kuantum",
    level: "pemula",
    hours: 8,
    brief: "Hasilkan bit acak dari pengukuran qubit dan uji apakah benar-benar acak.",
    goal: "10.000 bit acak dari simulator (atau komputer kuantum cloud), uji frekuensi, uji runs, dan entropi per bit.",
    stack: ["Python", "Qiskit", "IBM Quantum (opsional)"],
    milestones: [
      { t: "Sirkuit", d: "Gerbang H lalu ukur; ulangi untuk banyak qubit sekaligus.", topic: "kuantum", lesson: "py-qiskit" },
      { t: "Kumpulkan bit", d: "Jalankan banyak shots; susun menjadi bilangan.", topic: "diskrit" },
      { t: "Uji frekuensi", d: "Proporsi 1 harus dekat 0,5; hitung galat baku dan skor z.", topic: "inferensi" },
      { t: "Entropi", d: "Hitung entropi per bit; idealnya 1.", topic: "entropi" },
      { t: "Perangkat nyata", d: "Bandingkan simulator dengan hasil perangkat kuantum nyata yang punya noise.", topic: "sampel" },
    ],
    deliver: ["Notebook", "Tabel uji keacakan"],
    extend: ["Koreksi bias von Neumann", "Uji NIST lainnya"],
  },
  {
    id: "grover",
    road: "kuantum",
    title: "Algoritma Grover dua qubit",
    level: "portofolio",
    hours: 14,
    brief: "Temukan satu item yang ditandai di antara empat kemungkinan dengan satu kali pertanyaan, sesuatu yang mustahil secara klasik.",
    goal: "Implementasi Grover 2 qubit, penjelasan amplitudo tiap langkah, dan perbandingan simulator dengan perangkat nyata.",
    stack: ["Python", "Qiskit", "NumPy"],
    milestones: [
      { t: "Superposisi", d: "H pada dua qubit: empat amplitudo masing-masing 1/2.", topic: "kuantum" },
      { t: "Oracle", d: "Balik tanda amplitudo item yang ditandai.", topic: "kompleks" },
      { t: "Difusi", d: "Pantulkan amplitudo terhadap rata-ratanya; item yang ditandai menguat.", topic: "linalg", lesson: "py-numpy" },
      { t: "Ukur", d: "Peluang item benar mendekati 1; cek dengan simulasi.", topic: "peluang", lesson: "py-qiskit" },
      { t: "Matriks gerbang", d: "Tulis seluruh sirkuit sebagai perkalian matriks 4×4 dan verifikasi.", topic: "matriks" },
    ],
    deliver: ["Notebook dengan diagram amplitudo", "Penjelasan untuk pembaca awam"],
    extend: ["Grover 3 qubit dan jumlah iterasi optimal", "Pengaruh noise perangkat"],
  },

  // ---------------------------------------------------------------- Bioinformatika
  {
    id: "dna-motif",
    road: "bioinfo",
    title: "Analisis urutan DNA: GC, k-mer, dan motif",
    level: "pemula",
    hours: 10,
    brief: "Dari genom bakteri publik, temukan wilayah kaya GC dan motif berulang yang mungkin menandai awal replikasi.",
    goal: "Program yang membaca file FASTA, menghitung kadar GC berjendela, frekuensi k-mer, dan logo motif.",
    stack: ["Python", "Biopython", "Genom bakteri dari NCBI"],
    milestones: [
      { t: "Baca FASTA", d: "Urutan DNA adalah teks; hitung panjang dan komposisi basa.", lesson: "py-alur" },
      { t: "Kadar GC berjendela", d: "Rata-rata bergerak kadar GC per 1.000 basa.", topic: "barisan", lesson: "py-fungsi" },
      { t: "k-mer", d: "Hitung semua 9-mer; bandingkan dengan harapan acak.", topic: "peluang" },
      { t: "Motif", d: "Matriks frekuensi posisi dan entropi tiap posisi.", topic: "entropi" },
      { t: "Visual", d: "Grafik GC skew dan logo motif.", lesson: "py-plot" },
    ],
    deliver: ["Notebook", "Grafik GC skew", "Daftar motif teratas"],
    extend: ["Rantai Markov untuk mendeteksi pulau CpG", "Perbandingan antargenom"],
  },
  {
    id: "ekspresi-gen",
    road: "bioinfo",
    title: "Ekspresi gen diferensial dan PCA",
    level: "portofolio",
    hours: 16,
    brief: "Data RNA-seq dari jaringan sehat dan sakit. Gen mana yang benar-benar berbeda, dan apakah sampel mengelompok sesuai kondisinya?",
    goal: "Daftar gen diferensial dengan koreksi uji berganda, plot volcano, dan PCA sampel.",
    stack: ["R + Bioconductor (DESeq2) atau Python", "Dataset publik GEO"],
    milestones: [
      { t: "Normalisasi", d: "Hitungan baca dinormalisasi kedalaman; log2 untuk menstabilkan sebaran.", topic: "eksponen", lesson: "r-vektor" },
      { t: "PCA sampel", d: "Apakah sampel sehat dan sakit terpisah di dua komponen pertama?", topic: "linalg" },
      { t: "Uji per gen", d: "Uji perbedaan rata-rata untuk ribuan gen.", topic: "inferensi", lesson: "r-uji" },
      { t: "Uji berganda", d: "Dari 20.000 uji, 1.000 akan “signifikan” secara kebetulan pada p < 0,05; pakai FDR.", topic: "bayes" },
      { t: "Plot volcano", d: "log2 fold change vs −log10 p; tandai gen penting.", topic: "regresi", lesson: "r-dplyr" },
    ],
    deliver: ["Laporan analisis", "Plot volcano dan PCA", "Kode yang bisa direproduksi"],
    extend: ["Analisis jalur (pathway enrichment)", "Model klasifikasi dari ekspresi gen"],
  },
];

const byId = new Map(PROJECTS.map((project) => [project.id, project]));

for (const project of PROJECTS) {
  if (!getRoadmap(project.road)) throw new Error(`Proyek ${project.id} menyebut peta yang tidak ada: ${project.road}`);
  for (const m of project.milestones) {
    if (m.topic && !getTopic(m.topic)) throw new Error(`Proyek ${project.id} menyebut materi yang tidak ada: ${m.topic}`);
    if (m.lesson && !getLesson(m.lesson)) throw new Error(`Proyek ${project.id} menyebut pelajaran kode yang tidak ada: ${m.lesson}`);
  }
}

export function getProject(id: string): Project | undefined {
  return byId.get(id);
}

export function projectsOf(roadId: string): Project[] {
  return PROJECTS.filter((project) => project.road === roadId);
}

export const LEVEL_LABEL: Record<Project["level"], string> = {
  pemula: "Pemula",
  menengah: "Menengah",
  portofolio: "Portofolio",
};
