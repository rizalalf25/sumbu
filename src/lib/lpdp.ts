import { hash, take } from "./mathx.ts";

export type SubId = "verbal" | "kuantitatif" | "penalaran";

export type LpdpQuestion = {
  id: string;
  sub: SubId;
  kind: string;
  q: string;
  options: string[];
  answer: number;
  why: string;
  steps?: string[];
  passage?: string;
};

export type Subtes = {
  id: SubId;
  title: string;
  kicker: string;
  summary: string;
  kinds: { id: string; title: string; how: string[] }[];
  strategy: string[];
  traps: string[];
};

// ------------------------------------------------------------------ Tahapan

export const OFFICIAL_URL = "https://lpdp.kemenkeu.go.id";

export const STAGES: { title: string; body: string; items: string[] }[] = [
  {
    title: "Seleksi administrasi",
    body: "Berkas diperiksa kelengkapan dan kesesuaiannya dengan syarat program yang dipilih.",
    items: [
      "Identitas, ijazah, dan transkrip sesuai jenjang",
      "Sertifikat kemampuan bahasa yang masih berlaku dengan skor minimal sesuai program dan tujuan studi",
      "Surat rekomendasi",
      "Esai yang diminta di formulir pendaftaran (misalnya komitmen kembali dan kontribusi untuk Indonesia) serta rencana studi",
      "Letter of Acceptance bila sudah punya, sesuai ketentuan program",
    ],
  },
  {
    title: "Seleksi bakat skolastik",
    body: "Tes daring yang mengukur kemampuan berpikir, bukan hafalan materi kuliah. Pada beberapa periode terakhir tes ini mencakup kemampuan verbal, kuantitatif, dan penalaran, dan pernah disertai penulisan esai on the spot.",
    items: [
      "Verbal: sinonim, antonim, analogi, bacaan, kalimat efektif",
      "Kuantitatif: aritmetika, perbandingan, aljabar, statistik dasar, soal cerita",
      "Penalaran: silogisme, logika proposisi, penalaran analitis, pola",
    ],
  },
  {
    title: "Seleksi substansi (wawancara)",
    body: "Panel menggali motivasi, kesesuaian rencana studi, rekam jejak, kepemimpinan, integritas, dan rencana kontribusi setelah lulus.",
    items: [
      "Konsistensi antara esai, rencana studi, dan jawaban lisan",
      "Contoh nyata dari pengalaman, bukan janji umum",
      "Pemahaman isu di bidangmu dan peran Indonesia",
    ],
  },
];

export const DISCLAIMER =
  "Tahapan, komposisi tes, jumlah soal, waktu, dan nilai ambang bisa berubah setiap periode. Selalu pastikan dengan buku panduan resmi periode yang kamu ikuti di situs LPDP. Soal di sini adalah latihan buatan SUMBU dengan gaya serupa, bukan soal asli LPDP.";

// ------------------------------------------------------------------ Subtes

export const SUBTES: Subtes[] = [
  {
    id: "verbal",
    title: "Verbal",
    kicker: "Bahasa sebagai alat berpikir",
    summary:
      "Mengukur penguasaan kosakata, kemampuan melihat hubungan makna, dan memahami bacaan secara cermat dan cepat.",
    kinds: [
      {
        id: "sinonim",
        title: "Sinonim",
        how: [
          "Tebak arti dari akar kata atau kata serapan yang mirip (misalnya akselerasi ↔ accelerate).",
          "Coba jawabanmu di dalam kalimat; sinonim yang benar tidak mengubah makna kalimat.",
        ],
      },
      {
        id: "antonim",
        title: "Antonim",
        how: [
          "Cari lawan yang paling langsung, bukan sekadar kata yang berbeda.",
          "Waspadai pilihan yang merupakan sinonim; soal antonim sering memasangnya sebagai jebakan.",
        ],
      },
      {
        id: "analogi",
        title: "Analogi",
        how: [
          "Rumuskan hubungan pasangan pertama dalam satu kalimat: “A adalah alat untuk B”.",
          "Pasang kalimat yang sama ke setiap pilihan; hanya satu yang tetap benar dengan urutan yang sama.",
        ],
      },
      {
        id: "bacaan",
        title: "Pemahaman bacaan",
        how: [
          "Baca pertanyaan dulu, baru bacaan, supaya tahu yang dicari.",
          "Gagasan utama mencakup seluruh bacaan, bukan satu detail menarik.",
          "Simpulan harus didukung teks, bukan pendapatmu sendiri.",
        ],
      },
      {
        id: "kalimat",
        title: "Kalimat efektif dan kata baku",
        how: [
          "Buang kata berlebih (pleonasme): para hadirin, naik ke atas, saling bantu-membantu.",
          "Pastikan kalimat punya subjek yang jelas; awalan “menurut … mengatakan” menghilangkan subjek.",
        ],
      },
    ],
    strategy: [
      "Kerjakan sinonim, antonim, dan analogi lebih dulu: cepat dan pasti.",
      "Bacaan memakan waktu; jangan terpaku pada satu soal sulit.",
      "Tambah kosakata setiap hari dari berita ekonomi, sains, dan kebijakan, bukan dari daftar hafalan saja.",
    ],
    traps: [
      "Memilih kata yang “terdengar mirip” padahal maknanya beda (efektif vs efisien).",
      "Menjawab soal bacaan dengan pengetahuan umum, bukan isi bacaan.",
      "Analogi dengan urutan terbalik: hubungannya benar, arahnya salah.",
    ],
  },
  {
    id: "kuantitatif",
    title: "Kuantitatif",
    kicker: "Hitung cepat, hitung benar",
    summary:
      "Mengukur penalaran dengan angka: persen, perbandingan, aljabar sederhana, statistik dasar, dan soal cerita. Tingkat matematikanya kebanyakan setara SMP–SMA; tantangannya adalah waktu dan ketelitian.",
    kinds: [
      {
        id: "persen",
        title: "Persen dan untung rugi",
        how: [
          "Ubah persen beruntun menjadi faktor dan kalikan: naik 20% lalu turun 20% = 1,2 × 0,8 = 0,96.",
          "Untung atau rugi dihitung dari harga beli.",
        ],
      },
      {
        id: "perbandingan",
        title: "Perbandingan dan skala",
        how: [
          "Ubah perbandingan menjadi “bagian”: 2 : 3 berarti 5 bagian.",
          "Skala 1 : 250.000 berarti 1 cm = 2,5 km.",
        ],
      },
      {
        id: "kecepatan",
        title: "Jarak, kecepatan, waktu",
        how: [
          "Berpapasan dari arah berlawanan: kecepatan dijumlah.",
          "Menyusul searah: kecepatan dikurang.",
        ],
      },
      {
        id: "pekerjaan",
        title: "Pekerjaan bersama",
        how: [
          "Ubah ke laju per hari: A selesai 6 hari = 1/6 pekerjaan per hari.",
          "Laju dijumlah, lalu waktu = 1 / jumlah laju.",
        ],
      },
      {
        id: "statistik",
        title: "Rata-rata dan statistik dasar",
        how: [
          "Rata-rata gabungan memakai total, bukan rata-rata dari rata-rata.",
          "Data baru = total baru − total lama.",
        ],
      },
      {
        id: "aljabar",
        title: "Aljabar dan sistem persamaan",
        how: [
          "Tulis soal cerita menjadi dua persamaan, lalu eliminasi.",
          "Cek jawaban dengan memasukkan kembali ke soal.",
        ],
      },
      {
        id: "deret",
        title: "Deret angka",
        how: [
          "Cek selisih, lalu selisih dari selisih, lalu rasio.",
          "Pola selang-seling: pisahkan suku ganjil dan genap.",
        ],
      },
      {
        id: "peluang",
        title: "Peluang dan bunga",
        how: [
          "Tanpa pengembalian: penyebut berkurang satu di pengambilan kedua.",
          "Bunga tunggal dihitung dari modal awal saja.",
        ],
      },
    ],
    strategy: [
      "Perkirakan dulu besar jawabannya; buang pilihan yang jelas terlalu besar atau kecil.",
      "Hafalkan pecahan umum: 1/8 = 12,5%, 1/6 ≈ 16,7%, 3/8 = 37,5%.",
      "Lewati soal yang butuh hitungan panjang, kembali bila waktu tersisa.",
    ],
    traps: [
      "Menjumlahkan persen beruntun.",
      "Rata-rata gabungan dihitung sebagai rata-rata dua rata-rata.",
      "Satuan berbeda (menit vs jam, cm vs km) tidak diseragamkan dulu.",
    ],
  },
  {
    id: "penalaran",
    title: "Penalaran",
    kicker: "Logika tanpa perasaan",
    summary:
      "Mengukur kemampuan menarik kesimpulan yang sah dari pernyataan, menemukan pola, dan menyusun informasi dengan banyak syarat.",
    kinds: [
      {
        id: "silogisme",
        title: "Silogisme",
        how: [
          "Gambar diagram Venn untuk “semua”, “sebagian”, dan “tidak ada”.",
          "Simpulan harus selalu benar, bukan hanya mungkin benar.",
        ],
      },
      {
        id: "logika",
        title: "Logika proposisi",
        how: [
          "Ingkaran “semua” adalah “ada yang tidak”.",
          "p ⇒ q setara dengan ¬q ⇒ ¬p (kontraposisi) dan ¬p ∨ q.",
          "Dari p ⇒ q dan q, tidak bisa disimpulkan p.",
        ],
      },
      {
        id: "analitis",
        title: "Penalaran analitis",
        how: [
          "Buat tabel atau garis posisi, isi syarat yang pasti dulu.",
          "Untuk “mungkin benar”, cukup satu susunan yang memenuhi semua syarat.",
          "Untuk “pasti benar”, harus benar di semua susunan yang mungkin.",
        ],
      },
      {
        id: "pola",
        title: "Pola huruf",
        how: [
          "Ubah huruf menjadi angka: A = 1, B = 2, …, Z = 26.",
          "Cari selisih seperti deret angka.",
        ],
      },
    ],
    strategy: [
      "Jangan memakai pengetahuan dunia nyata; anggap semua premis benar walau terdengar aneh.",
      "Soal analitis: kerjakan semua pertanyaan dari satu teka-teki sekaligus, karena tabelnya sama.",
      "Tulis A=1 sampai Z=26 di kertas coretan sebelum tes dimulai.",
    ],
    traps: [
      "Membalik implikasi: dari “jika hujan maka basah” dan “basah” menyimpulkan “hujan”.",
      "Mengira “sebagian A adalah B” berarti “sebagian A bukan B”.",
      "Ingkaran “semua” ditulis “semua tidak”.",
    ],
  },
];

// ------------------------------------------------------------------ Bank verbal

type Row = [string, string, string, string, string, string];

const SINONIM: Row[] = [
  [
    "KONKLUSI",
    "simpulan",
    "pendahuluan",
    "pertanyaan",
    "hipotesis",
    "Konklusi adalah kesimpulan atau keputusan akhir.",
  ],
  [
    "AKSELERASI",
    "percepatan",
    "perlambatan",
    "perluasan",
    "pengurangan",
    "Akselerasi berarti percepatan (bandingkan: accelerate).",
  ],
  [
    "AMBIGU",
    "bermakna ganda",
    "sangat jelas",
    "bertentangan",
    "berlebihan",
    "Ambigu: dapat ditafsirkan lebih dari satu cara.",
  ],
  [
    "APATIS",
    "acuh tak acuh",
    "bersemangat",
    "pemarah",
    "pendiam",
    "Apatis: tidak peduli, tidak berminat.",
  ],
  [
    "DEFISIT",
    "kekurangan",
    "kelebihan",
    "keseimbangan",
    "keuntungan",
    "Defisit: kekurangan, terutama pengeluaran melebihi penerimaan.",
  ],
  [
    "EKSPLISIT",
    "tersurat",
    "tersirat",
    "tersembunyi",
    "rahasia",
    "Eksplisit: dinyatakan dengan jelas dan terang.",
  ],
  [
    "IMPLISIT",
    "tersirat",
    "tersurat",
    "terbuka",
    "tertulis",
    "Implisit: terkandung di dalamnya meski tidak dinyatakan jelas.",
  ],
  [
    "INHEREN",
    "melekat",
    "terpisah",
    "sementara",
    "asing",
    "Inheren: berhubungan erat, tidak terpisahkan.",
  ],
  ["KREDIBEL", "dapat dipercaya", "meragukan", "terkenal", "mahal", "Kredibel: dapat dipercaya."],
  [
    "KOMPATIBEL",
    "cocok",
    "bertentangan",
    "rusak",
    "terpisah",
    "Kompatibel: dapat bekerja sama dengan baik, sesuai.",
  ],
  [
    "MITIGASI",
    "pengurangan risiko",
    "penambahan beban",
    "penyelidikan",
    "pemulihan total",
    "Mitigasi: upaya mengurangi risiko atau dampak.",
  ],
  [
    "OTONOM",
    "mandiri",
    "bergantung",
    "terpusat",
    "terikat",
    "Otonom: berdiri sendiri, berpemerintahan sendiri.",
  ],
  [
    "PARADIGMA",
    "kerangka berpikir",
    "contoh soal",
    "perdebatan",
    "kebiasaan",
    "Paradigma: model atau kerangka berpikir.",
  ],
  [
    "PRAGMATIS",
    "berorientasi hasil praktis",
    "idealis",
    "teoretis",
    "emosional",
    "Pragmatis: bersifat praktis dan berguna, mengutamakan hasil.",
  ],
  [
    "REDUNDAN",
    "berlebihan",
    "kurang",
    "penting",
    "unik",
    "Redundan: berlebih, tidak diperlukan karena sudah ada.",
  ],
  [
    "RELEVAN",
    "berkaitan",
    "terpisah",
    "terlambat",
    "berlawanan",
    "Relevan: bersangkut paut, berguna secara langsung.",
  ],
  [
    "SINERGI",
    "kerja sama yang saling menguatkan",
    "persaingan",
    "pemisahan",
    "pengulangan",
    "Sinergi: kegiatan gabungan yang hasilnya lebih besar daripada jumlah bagiannya.",
  ],
  [
    "SPORADIS",
    "kadang-kadang",
    "terus-menerus",
    "serentak",
    "teratur",
    "Sporadis: muncul sesekali, tidak tentu.",
  ],
  ["VALID", "sahih", "keliru", "lemah", "kuno", "Valid: menurut cara yang semestinya, sahih."],
  [
    "FLUKTUASI",
    "naik turun",
    "kestabilan",
    "kenaikan terus",
    "penurunan terus",
    "Fluktuasi: gejala turun naik.",
  ],
  [
    "RESILIEN",
    "tangguh",
    "rapuh",
    "lamban",
    "pasif",
    "Resilien: mampu bertahan dan pulih dari kesulitan.",
  ],
  [
    "KOHESI",
    "keterpaduan",
    "perpecahan",
    "perbedaan",
    "pertentangan",
    "Kohesi: hubungan yang erat, keterpaduan.",
  ],
  [
    "ELABORASI",
    "penjelasan terperinci",
    "ringkasan",
    "penolakan",
    "penundaan",
    "Elaborasi: penggarapan atau penjelasan secara tekun dan rinci.",
  ],
  [
    "DIKOTOMI",
    "pembagian atas dua yang bertentangan",
    "persatuan",
    "kerja sama",
    "penggandaan",
    "Dikotomi: pembagian atas dua kelompok yang saling bertentangan.",
  ],
  [
    "ANTIPATI",
    "rasa tidak suka",
    "rasa simpati",
    "rasa ingin tahu",
    "rasa takut",
    "Antipati: penolakan atau rasa tidak suka yang kuat.",
  ],
  [
    "NIRLABA",
    "tidak mencari keuntungan",
    "mencari laba",
    "milik negara",
    "berbayar",
    "Nir- berarti tanpa; nirlaba: tidak bertujuan mencari laba.",
  ],
  [
    "PROGRESIF",
    "ke arah kemajuan",
    "mundur",
    "tetap",
    "kuno",
    "Progresif: ke arah kemajuan, bertingkat naik.",
  ],
  [
    "KONTRIBUSI",
    "sumbangan",
    "hambatan",
    "tuntutan",
    "pinjaman",
    "Kontribusi: sumbangan atau peran serta.",
  ],
  [
    "INTEGRITAS",
    "kejujuran dan keutuhan sikap",
    "kecerdasan",
    "kekayaan",
    "popularitas",
    "Integritas: mutu yang menunjukkan kesatuan utuh, kejujuran.",
  ],
  [
    "KOMPREHENSIF",
    "menyeluruh",
    "sebagian",
    "dangkal",
    "singkat",
    "Komprehensif: bersifat mampu menangkap dengan baik, luas dan lengkap.",
  ],
];

const ANTONIM: Row[] = [
  ["KONKRET", "abstrak", "nyata", "padat", "jelas", "Konkret berarti nyata; lawannya abstrak."],
  [
    "OPTIMIS",
    "pesimis",
    "yakin",
    "realistis",
    "gembira",
    "Lawan dari optimis (berpengharapan baik) adalah pesimis.",
  ],
  [
    "STATIS",
    "dinamis",
    "tetap",
    "diam",
    "stabil",
    "Statis: diam, tidak berubah; lawannya dinamis.",
  ],
  [
    "HETEROGEN",
    "homogen",
    "beragam",
    "campuran",
    "majemuk",
    "Heterogen: beragam; lawannya homogen (sejenis).",
  ],
  ["SURPLUS", "defisit", "kelebihan", "laba", "untung", "Surplus: kelebihan; lawannya defisit."],
  ["MAKRO", "mikro", "besar", "luas", "global", "Makro: besar, menyeluruh; lawannya mikro."],
  [
    "SENTRALISASI",
    "desentralisasi",
    "pemusatan",
    "penyatuan",
    "konsentrasi",
    "Sentralisasi: pemusatan; lawannya desentralisasi.",
  ],
  [
    "INKLUSIF",
    "eksklusif",
    "terbuka",
    "merangkul",
    "menyeluruh",
    "Inklusif: mengikutsertakan semua; lawannya eksklusif.",
  ],
  [
    "OBJEKTIF",
    "subjektif",
    "netral",
    "faktual",
    "adil",
    "Objektif: sesuai keadaan sebenarnya; lawannya subjektif.",
  ],
  ["AMATIR", "profesional", "pemula", "awam", "sukarela", "Amatir: bukan profesional."],
  [
    "INFLASI",
    "deflasi",
    "kenaikan harga",
    "resesi",
    "devaluasi",
    "Inflasi: harga umum naik; deflasi: harga umum turun.",
  ],
  [
    "PERMANEN",
    "sementara",
    "tetap",
    "abadi",
    "kekal",
    "Permanen: tetap; lawannya sementara (temporer).",
  ],
  ["RIGID", "luwes", "kaku", "keras", "tegas", "Rigid: kaku; lawannya luwes (fleksibel)."],
  [
    "AKUT",
    "kronis",
    "parah",
    "mendadak",
    "tajam",
    "Dalam kedokteran, akut (mendadak, singkat) berlawanan dengan kronis (menahun).",
  ],
  [
    "SKEPTIS",
    "percaya",
    "ragu",
    "curiga",
    "kritis",
    "Skeptis: kurang percaya, ragu; lawannya percaya.",
  ],
  [
    "IMIGRASI",
    "emigrasi",
    "transmigrasi",
    "urbanisasi",
    "migrasi",
    "Imigrasi: masuk ke suatu negara; emigrasi: keluar dari negara sendiri.",
  ],
  [
    "EKSPANSI",
    "kontraksi",
    "perluasan",
    "pertumbuhan",
    "penambahan",
    "Ekspansi: perluasan; lawannya kontraksi (penyusutan).",
  ],
  [
    "KOOPERATIF",
    "konfrontatif",
    "bekerja sama",
    "ramah",
    "membantu",
    "Kooperatif: bersifat bekerja sama; lawannya konfrontatif.",
  ],
  [
    "MAYORITAS",
    "minoritas",
    "terbanyak",
    "umum",
    "dominan",
    "Mayoritas: jumlah terbanyak; lawannya minoritas.",
  ],
  [
    "APRESIASI",
    "depresiasi",
    "penghargaan",
    "kenaikan",
    "pujian",
    "Dalam ekonomi, apresiasi (nilai naik) berlawanan dengan depresiasi (nilai turun).",
  ],
];

const ANALOGI: Row[] = [
  [
    "TERMOMETER : SUHU",
    "barometer : tekanan udara",
    "jam : dinding",
    "timbangan : kilogram",
    "meteran : penjahit",
    "Alat ukur : besaran yang diukurnya. “Kilogram” adalah satuan, bukan besaran; “dinding” dan “penjahit” bukan yang diukur.",
  ],
  [
    "PILOT : PESAWAT",
    "nakhoda : kapal",
    "penumpang : bus",
    "montir : bengkel",
    "petani : sawah",
    "Orang yang mengemudikan : kendaraannya.",
  ],
  [
    "PENA : PENULIS",
    "kuas : pelukis",
    "buku : pembaca",
    "kertas : pena",
    "meja : guru",
    "Alat utama : orang yang memakainya untuk berkarya.",
  ],
  [
    "MATA : MELIHAT",
    "telinga : mendengar",
    "kaki : sepatu",
    "tangan : jari",
    "hidung : wajah",
    "Organ : fungsinya.",
  ],
  [
    "LAUT : ASIN",
    "gula : manis",
    "air : basah",
    "api : merah",
    "garam : putih",
    "Benda : rasa khasnya.",
  ],
  [
    "HUJAN : BANJIR",
    "kemarau : kekeringan",
    "awan : langit",
    "petir : guntur",
    "angin : daun",
    "Penyebab : akibat (bila berlebihan).",
  ],
  [
    "ULAT : KUPU-KUPU",
    "berudu : katak",
    "anak : ayah",
    "telur : sarang",
    "bibit : sawah",
    "Tahap awal : bentuk dewasanya dalam metamorfosis.",
  ],
  [
    "DIAGNOSIS : DOKTER",
    "vonis : hakim",
    "obat : apoteker",
    "pasien : perawat",
    "rumah sakit : dokter",
    "Keputusan profesional : yang berwenang membuatnya.",
  ],
  [
    "RUPIAH : INDONESIA",
    "yen : Jepang",
    "dolar : uang",
    "euro : Inggris",
    "ringgit : Singapura",
    "Mata uang : negaranya. Inggris memakai pound sterling, Singapura memakai dolar Singapura.",
  ],
  [
    "KAYU : MEJA",
    "benang : kain",
    "pohon : hutan",
    "gergaji : tukang",
    "kursi : sofa",
    "Bahan baku : barang jadi.",
  ],
  [
    "SEMEN : BETON",
    "tepung : roti",
    "batu : jalan",
    "air : sungai",
    "cat : dinding",
    "Bahan : hasil olahan yang memerlukan bahan itu.",
  ],
  [
    "GURU : SEKOLAH",
    "dokter : rumah sakit",
    "murid : kelas",
    "buku : perpustakaan",
    "kepala : kantor",
    "Profesi : tempat bekerjanya.",
  ],
  [
    "LAMBAT : SIPUT",
    "cepat : cheetah",
    "tinggi : gunung",
    "besar : semut",
    "lemah : gajah",
    "Sifat menonjol : hewan yang identik dengan sifat itu.",
  ],
  [
    "PADI : BERAS",
    "kopi : bubuk kopi",
    "sawah : petani",
    "beras : nasi goreng",
    "jagung : ladang",
    "Hasil panen : bentuk olahan pertamanya.",
  ],
  [
    "ARSIP : DOKUMEN",
    "museum : benda bersejarah",
    "rak : buku",
    "galeri : pelukis",
    "kamus : bahasa",
    "Tempat penyimpanan khusus : yang disimpan dan dirawat di sana.",
  ],
];

const PASSAGES: {
  id: string;
  title: string;
  text: string;
  qs: [string, string, string, string, string, string][];
}[] = [
  {
    id: "demografi",
    title: "Bonus demografi",
    text: "Indonesia diperkirakan berada pada puncak bonus demografi dalam beberapa dekade ini, ketika proporsi penduduk usia produktif jauh lebih besar daripada anak-anak dan lansia. Kondisi ini sering disebut peluang emas, tetapi peluang itu tidak otomatis menjadi kemakmuran. Penduduk usia produktif baru menjadi tenaga pendorong ekonomi bila mereka sehat, terdidik, dan terserap di pekerjaan yang layak. Tanpa itu, jumlah yang besar justru dapat berubah menjadi beban berupa pengangguran terbuka dan pekerjaan informal berupah rendah. Karena itu, sejumlah ekonom menilai investasi pada pendidikan vokasi, kesehatan ibu dan anak, serta penciptaan lapangan kerja formal lebih menentukan daripada sekadar besarnya jumlah penduduk usia kerja.",
    qs: [
      [
        "Gagasan utama bacaan tersebut adalah…",
        "Bonus demografi hanya menguntungkan bila kualitas penduduk usia produktif dan lapangan kerjanya disiapkan",
        "Indonesia memiliki penduduk usia produktif terbanyak di dunia",
        "Pendidikan vokasi adalah satu-satunya solusi pengangguran",
        "Jumlah lansia di Indonesia terus menurun",
        "Seluruh paragraf membahas syarat agar bonus demografi menjadi keuntungan, bukan beban.",
      ],
      [
        "Menurut bacaan, bonus demografi dapat menjadi beban apabila…",
        "banyak penduduk usia produktif menganggur atau bekerja informal berupah rendah",
        "jumlah anak-anak lebih sedikit daripada lansia",
        "pemerintah berinvestasi pada kesehatan ibu dan anak",
        "lapangan kerja formal bertambah",
        "Kalimat keempat menyebutnya secara langsung.",
      ],
      [
        "Pernyataan yang paling didukung oleh bacaan adalah…",
        "Menambah jumlah penduduk usia kerja tanpa meningkatkan keterampilan belum tentu meningkatkan kemakmuran",
        "Bonus demografi pasti membuat Indonesia menjadi negara maju",
        "Ekonom sepakat bahwa jumlah penduduk tidak penting",
        "Pekerjaan informal selalu lebih baik daripada menganggur",
        "Bacaan menekankan kualitas di atas jumlah; pilihan lain melampaui isi teks.",
      ],
    ],
  },
  {
    id: "energi",
    title: "Bauran energi",
    text: "Pembangkit listrik tenaga surya kini semakin murah, tetapi sifatnya yang hanya menghasilkan listrik pada siang hari menuntut cara menyimpan energi atau sumber cadangan. Baterai skala besar dapat menggeser kelebihan produksi siang ke malam, namun biayanya masih menjadi pertimbangan utama di banyak negara berkembang. Sebagian perencana sistem kelistrikan memilih kombinasi: surya untuk memenuhi beban siang, pembangkit air atau panas bumi untuk beban dasar, dan baterai untuk meredam lonjakan singkat. Pendekatan campuran ini dinilai lebih realistis daripada mengandalkan satu jenis sumber energi, karena setiap sumber memiliki keterbatasan waktu, lokasi, dan biaya.",
    qs: [
      [
        "Keterbatasan pembangkit surya yang dibahas bacaan adalah…",
        "listrik hanya dihasilkan pada siang hari",
        "biaya panel surya terus naik",
        "panel surya tidak cocok untuk negara tropis",
        "pembangkit surya mencemari udara",
        "Kalimat pertama: surya hanya menghasilkan listrik pada siang hari.",
      ],
      [
        "Menurut bacaan, peran baterai dalam sistem campuran adalah…",
        "menggeser kelebihan listrik siang ke malam dan meredam lonjakan singkat",
        "menggantikan seluruh pembangkit air dan panas bumi",
        "menurunkan harga panel surya",
        "menyediakan beban dasar sepanjang hari",
        "Kalimat kedua dan ketiga menyebut kedua fungsi itu.",
      ],
      [
        "Sikap penulis terhadap pendekatan campuran adalah…",
        "mendukung, karena tiap sumber punya keterbatasan",
        "menolak, karena terlalu mahal",
        "netral tanpa memberi penilaian",
        "ragu, karena baterai belum ada",
        "Penulis menyebutnya “lebih realistis” dan memberi alasannya.",
      ],
    ],
  },
  {
    id: "ai",
    title: "AI di ruang kelas",
    text: "Alat kecerdasan artifisial generatif dapat membantu siswa memperoleh penjelasan instan untuk materi yang sulit. Namun, sebuah kekhawatiran muncul: siswa yang langsung meminta jawaban akhir berisiko melewatkan proses berpikir yang justru membentuk pemahaman. Beberapa guru mengubah tugas mereka. Alih-alih meminta jawaban, mereka meminta siswa menjelaskan langkah, membandingkan jawaban AI dengan sumber lain, dan menemukan kesalahan di dalamnya. Dengan cara ini, AI diperlakukan sebagai lawan diskusi, bukan pengganti berpikir. Keberhasilan pendekatan ini sangat bergantung pada kemampuan guru merancang tugas yang menuntut penalaran, bukan sekadar hafalan.",
    qs: [
      [
        "Ide pokok bacaan tersebut adalah…",
        "AI dapat bermanfaat bagi belajar bila tugas dirancang untuk melatih penalaran",
        "AI harus dilarang di sekolah",
        "Guru tidak lagi diperlukan karena ada AI",
        "Jawaban AI selalu benar",
        "Bacaan menimbang manfaat dan risiko, lalu menawarkan cara merancang tugas.",
      ],
      [
        "Kata “alih-alih” dalam bacaan bermakna…",
        "sebagai ganti",
        "selain itu",
        "oleh karena",
        "meskipun",
        "“Alih-alih meminta jawaban” berarti sebagai ganti meminta jawaban.",
      ],
      [
        "Simpulan yang paling tepat dari bacaan adalah…",
        "Tugas yang hanya menuntut jawaban akhir rentan dikerjakan sepenuhnya oleh AI",
        "Siswa yang memakai AI pasti nilainya turun",
        "Semua guru sudah mengubah cara memberi tugas",
        "Hafalan lebih penting daripada penalaran",
        "Kekhawatiran di bacaan muncul justru karena jawaban akhir bisa langsung diminta dari AI.",
      ],
    ],
  },
];

const KALIMAT: Row[] = [
  [
    "Kata baku yang tepat adalah…",
    "analisis",
    "analisa",
    "analise",
    "analisys",
    "Bentuk baku menurut KBBI: analisis.",
  ],
  [
    "Kata baku yang tepat adalah…",
    "praktik",
    "praktek",
    "praktik-praktek",
    "prakteks",
    "Bentuk baku: praktik.",
  ],
  ["Kata baku yang tepat adalah…", "risiko", "resiko", "resico", "risico", "Bentuk baku: risiko."],
  [
    "Kata baku yang tepat adalah…",
    "apotek",
    "apotik",
    "apoteek",
    "apothek",
    "Bentuk baku: apotek.",
  ],
  ["Kata baku yang tepat adalah…", "jadwal", "jadual", "jadwall", "jadwel", "Bentuk baku: jadwal."],
  [
    "Kalimat yang efektif adalah…",
    "Hadirin dimohon berdiri.",
    "Para hadirin dimohon berdiri.",
    "Para hadirin-hadirin dimohon berdiri.",
    "Kepada para hadirin dimohon berdiri.",
    "“Hadirin” sudah jamak; menambah “para” adalah pleonasme.",
  ],
  [
    "Kalimat yang efektif adalah…",
    "Kita harus saling membantu.",
    "Kita harus saling bantu-membantu.",
    "Kita harus saling tolong-menolong satu sama lain.",
    "Kita harus bantu-membantu saling.",
    "“Saling” dan bentuk ulang “bantu-membantu” sama-sama bermakna timbal balik; cukup salah satu.",
  ],
  [
    "Kalimat yang efektif adalah…",
    "Peneliti itu mengatakan bahwa sampelnya terlalu kecil.",
    "Menurut peneliti itu mengatakan bahwa sampelnya terlalu kecil.",
    "Menurut peneliti itu, ia mengatakan bahwa sampelnya terlalu kecil.",
    "Bahwa sampelnya terlalu kecil menurut peneliti itu mengatakan.",
    "“Menurut … mengatakan” membuat kalimat kehilangan subjek dan berlebih.",
  ],
  [
    "Kalimat yang efektif adalah…",
    "Peserta yang terlambat harap melapor ke panitia.",
    "Kepada peserta yang terlambat harap melapor ke panitia.",
    "Bagi peserta yang terlambat harap melapor ke panitia.",
    "Kepada para peserta-peserta yang terlambat harap melapor.",
    "Kata depan “kepada/bagi” di awal membuat subjek hilang.",
  ],
  [
    "Penulisan yang benar adalah…",
    "Dokumen itu dikirim ke kantor di Jakarta.",
    "Dokumen itu di kirim ke kantor di Jakarta.",
    "Dokumen itu dikirim kekantor di Jakarta.",
    "Dokumen itu dikirim ke kantor diJakarta.",
    "Awalan di- ditulis serangkai (dikirim); kata depan di/ke ditulis terpisah (ke kantor, di Jakarta).",
  ],
];

// ------------------------------------------------------------------ Bank penalaran

const SILOGISME: Row[] = [
  [
    "Semua penerima beasiswa wajib menyerahkan laporan studi. Rina adalah penerima beasiswa. Simpulan yang tepat:",
    "Rina wajib menyerahkan laporan studi.",
    "Rina mungkin menyerahkan laporan studi.",
    "Semua yang menyerahkan laporan studi adalah penerima beasiswa.",
    "Rina tidak wajib menyerahkan laporan studi.",
    "Modus ponens: semua A adalah B, x adalah A, maka x adalah B.",
  ],
  [
    "Semua peneliti bersikap teliti. Sebagian dosen adalah peneliti. Simpulan yang tepat:",
    "Sebagian dosen bersikap teliti.",
    "Semua dosen bersikap teliti.",
    "Sebagian dosen tidak teliti.",
    "Semua yang teliti adalah dosen.",
    "Dosen yang termasuk peneliti pasti teliti; tentang dosen lainnya tidak diketahui.",
  ],
  [
    "Tidak ada ikan yang bernapas dengan paru-paru. Paus bernapas dengan paru-paru. Simpulan yang tepat:",
    "Paus bukan ikan.",
    "Paus adalah ikan yang istimewa.",
    "Sebagian ikan bernapas dengan paru-paru.",
    "Tidak dapat disimpulkan.",
    "Yang bernapas dengan paru-paru berada di luar himpunan ikan.",
  ],
  [
    "Semua pelari adalah atlet. Sebagian atlet adalah perenang. Simpulan yang tepat:",
    "Tidak dapat dipastikan ada pelari yang perenang.",
    "Sebagian pelari adalah perenang.",
    "Semua pelari adalah perenang.",
    "Tidak ada pelari yang perenang.",
    "Perenang bisa saja atlet yang bukan pelari; diagram Venn menunjukkan keduanya mungkin tidak beririsan.",
  ],
  [
    "Jika hujan turun, jalan basah. Jalan tidak basah. Simpulan yang tepat:",
    "Hujan tidak turun.",
    "Hujan turun.",
    "Jalan mungkin basah.",
    "Tidak dapat disimpulkan.",
    "Modus tollens: p ⇒ q dan ¬q, maka ¬p.",
  ],
  [
    "Jika hujan turun, jalan basah. Jalan basah. Simpulan yang tepat:",
    "Tidak dapat dipastikan hujan turun.",
    "Hujan turun.",
    "Hujan tidak turun.",
    "Jalan tidak basah.",
    "Membenarkan akibat (q) tidak membuktikan sebab (p); jalan bisa basah karena disiram.",
  ],
  [
    "Jika lulus seleksi, Dodi berangkat studi. Jika berangkat studi, Dodi mengurus visa. Simpulan yang tepat:",
    "Jika lulus seleksi, Dodi mengurus visa.",
    "Jika mengurus visa, Dodi lulus seleksi.",
    "Dodi lulus seleksi.",
    "Jika tidak lulus seleksi, Dodi tidak mengurus visa.",
    "Silogisme hipotetis: p ⇒ q dan q ⇒ r, maka p ⇒ r.",
  ],
  [
    "Semua sarjana teknik sipil bisa membaca gambar struktur. Budi tidak bisa membaca gambar struktur. Simpulan yang tepat:",
    "Budi bukan sarjana teknik sipil.",
    "Budi adalah sarjana teknik sipil.",
    "Budi mungkin sarjana teknik sipil.",
    "Semua yang bisa membaca gambar struktur adalah sarjana teknik sipil.",
    "Kontraposisi: bila tidak bisa membaca gambar struktur, ia tidak termasuk sarjana teknik sipil.",
  ],
  [
    "Sebagian buku di rak ini berbahasa Inggris. Semua buku berbahasa Inggris di rak ini bersampul biru. Simpulan yang tepat:",
    "Sebagian buku di rak ini bersampul biru.",
    "Semua buku di rak ini bersampul biru.",
    "Semua buku bersampul biru berbahasa Inggris.",
    "Tidak ada buku bersampul biru di rak ini.",
    "Buku berbahasa Inggris pasti bersampul biru, dan buku itu ada di rak.",
  ],
  [
    "Tidak ada karyawan yang terlambat mendapat bonus. Sebagian karyawan bagian A terlambat. Simpulan yang tepat:",
    "Sebagian karyawan bagian A tidak mendapat bonus.",
    "Semua karyawan bagian A tidak mendapat bonus.",
    "Sebagian karyawan bagian A mendapat bonus.",
    "Tidak ada karyawan bagian A yang mendapat bonus.",
    "Karyawan A yang terlambat pasti tidak mendapat bonus; tentang yang lain tidak diketahui.",
  ],
  [
    "Hanya peserta yang lolos administrasi yang boleh mengikuti tes. Sari mengikuti tes. Simpulan yang tepat:",
    "Sari lolos administrasi.",
    "Sari belum tentu lolos administrasi.",
    "Semua yang lolos administrasi mengikuti tes.",
    "Sari tidak lolos administrasi.",
    "“Hanya A yang B” berarti semua B adalah A.",
  ],
  [
    "Pernyataan “Jika harga naik, permintaan turun” benar. Diketahui permintaan tidak turun. Simpulan yang tepat:",
    "Harga tidak naik.",
    "Harga naik.",
    "Permintaan naik.",
    "Tidak dapat disimpulkan.",
    "Modus tollens.",
  ],
];

const LOGIKA: Row[] = [
  [
    "Ingkaran dari “Semua peserta membawa laptop” adalah…",
    "Ada peserta yang tidak membawa laptop.",
    "Semua peserta tidak membawa laptop.",
    "Tidak ada peserta yang membawa laptop.",
    "Sebagian peserta membawa laptop.",
    "Ingkaran “semua” adalah “ada/beberapa yang tidak”.",
  ],
  [
    "Ingkaran dari “Jika Ani lulus, maka ia berangkat studi” adalah…",
    "Ani lulus dan ia tidak berangkat studi.",
    "Jika Ani tidak lulus, ia tidak berangkat studi.",
    "Ani tidak lulus dan ia berangkat studi.",
    "Jika Ani berangkat studi, ia lulus.",
    "¬(p ⇒ q) ≡ p ∧ ¬q.",
  ],
  [
    "Kontraposisi dari “Jika belajar teratur, maka nilainya baik” adalah…",
    "Jika nilainya tidak baik, maka ia tidak belajar teratur.",
    "Jika nilainya baik, maka ia belajar teratur.",
    "Jika tidak belajar teratur, maka nilainya tidak baik.",
    "Ia belajar teratur dan nilainya tidak baik.",
    "Kontraposisi p ⇒ q adalah ¬q ⇒ ¬p, dan nilainya setara.",
  ],
  [
    "Pernyataan yang setara dengan “Jika mesin rusak, produksi berhenti” adalah…",
    "Mesin tidak rusak atau produksi berhenti.",
    "Mesin rusak dan produksi berhenti.",
    "Jika produksi berhenti, mesin rusak.",
    "Mesin tidak rusak dan produksi tidak berhenti.",
    "p ⇒ q ≡ ¬p ∨ q.",
  ],
  [
    "Ingkaran dari “Ani rajin dan Budi pintar” adalah…",
    "Ani tidak rajin atau Budi tidak pintar.",
    "Ani tidak rajin dan Budi tidak pintar.",
    "Ani rajin atau Budi pintar.",
    "Jika Ani rajin, Budi tidak pintar.",
    "Hukum De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q.",
  ],
  [
    "Ingkaran dari “Beberapa kota rawan banjir” adalah…",
    "Semua kota tidak rawan banjir.",
    "Beberapa kota tidak rawan banjir.",
    "Semua kota rawan banjir.",
    "Ada kota yang tidak rawan banjir.",
    "Ingkaran “beberapa/ada” adalah “semua … tidak”.",
  ],
  [
    "Diketahui: p ⇒ q benar dan p benar. Maka…",
    "q benar",
    "q salah",
    "q bisa benar atau salah",
    "p ⇒ q menjadi salah",
    "Modus ponens.",
  ],
  [
    "Pernyataan “p atau q” bernilai salah hanya jika…",
    "p salah dan q salah",
    "p benar dan q benar",
    "p benar dan q salah",
    "p salah dan q benar",
    "Disjungsi salah hanya bila kedua komponennya salah.",
  ],
];

const ANALITIS: {
  id: string;
  setup: string;
  qs: [string, string, string, string, string, string][];
}[] = [
  {
    id: "presentasi",
    setup:
      "Lima peserta—A, B, C, D, dan E—presentasi bergiliran pada urutan ke-1 sampai ke-5. Syaratnya: C presentasi tepat setelah A; B tidak presentasi pertama; E presentasi sebelum D; D presentasi pada urutan ke-4.",
    qs: [
      [
        "Siapa yang pasti presentasi terakhir?",
        "B",
        "C",
        "E",
        "A",
        "Susunan yang mungkin hanya A-C-E-D-B dan E-A-C-D-B; pada keduanya B di urutan ke-5.",
      ],
      [
        "Jika E presentasi pertama, siapa yang presentasi ketiga?",
        "C",
        "A",
        "B",
        "D",
        "Dengan E pertama dan D keempat, pasangan A-C menempati 2-3, lalu B kelima.",
      ],
      [
        "Manakah yang mungkin benar?",
        "C presentasi kedua",
        "A presentasi ketiga",
        "E presentasi kedua",
        "B presentasi keempat",
        "Pada susunan A-C-E-D-B, C kedua. Pilihan lain tidak memenuhi syarat di susunan mana pun.",
      ],
    ],
  },
  {
    id: "kota",
    setup:
      "Empat penerima beasiswa—Fajar, Gita, Hana, dan Irfan—masing-masing studi di kota berbeda: Tokyo, London, Sydney, dan Delft. Syaratnya: Gita tidak studi di Tokyo; Hana studi di Eropa (London atau Delft); Irfan studi di Sydney atau Tokyo; Fajar tidak studi di Eropa.",
    qs: [
      [
        "Pasangan yang pasti studi di Eropa adalah…",
        "Gita dan Hana",
        "Fajar dan Hana",
        "Hana dan Irfan",
        "Gita dan Irfan",
        "Fajar dan Irfan sama-sama di luar Eropa, sehingga mengambil Tokyo dan Sydney; Gita dan Hana mengambil London dan Delft.",
      ],
      [
        "Jika Irfan studi di Tokyo, Fajar studi di…",
        "Sydney",
        "London",
        "Delft",
        "Tokyo",
        "Kota non-Eropa yang tersisa untuk Fajar hanya Sydney.",
      ],
      [
        "Jika Gita studi di Delft, Hana studi di…",
        "London",
        "Delft",
        "Sydney",
        "Tokyo",
        "Hana harus di Eropa, dan Delft sudah ditempati Gita.",
      ],
    ],
  },
];

// ------------------------------------------------------------------ Susun soal kurasi

function shuffled<T>(items: T[], seed: number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = hash(seed, i + 101) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Acak urutan pilihan secara deterministik dan catat posisi jawaban benar. */
function mc(
  id: string,
  sub: SubId,
  kind: string,
  q: string,
  correct: string,
  wrong: string[],
  why: string,
  passage?: string,
): LpdpQuestion {
  const seed = [...id].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const options = shuffled([correct, ...wrong], seed);
  return { id, sub, kind, q, options, answer: options.indexOf(correct), why, passage };
}

function fromRows(
  prefix: string,
  sub: SubId,
  kind: string,
  rows: Row[],
  ask?: (word: string) => string,
): LpdpQuestion[] {
  return rows.map(([word, correct, a, b, c, why], i) =>
    mc(`${prefix}-${i + 1}`, sub, kind, ask ? ask(word) : word, correct, [a, b, c], why),
  );
}

export const CURATED: LpdpQuestion[] = [
  ...fromRows("sin", "verbal", "sinonim", SINONIM, (w) => `Sinonim ${w} adalah…`),
  ...fromRows("ant", "verbal", "antonim", ANTONIM, (w) => `Antonim ${w} adalah…`),
  ...fromRows("ana", "verbal", "analogi", ANALOGI, (w) => `${w} = …`),
  ...PASSAGES.flatMap((p) =>
    p.qs.map(([q, correct, a, b, c, why], i) =>
      mc(
        `bac-${p.id}-${i + 1}`,
        "verbal",
        "bacaan",
        q,
        correct,
        [a, b, c],
        why,
        `${p.title}\n\n${p.text}`,
      ),
    ),
  ),
  ...fromRows("kal", "verbal", "kalimat", KALIMAT),
  ...fromRows("sil", "penalaran", "silogisme", SILOGISME),
  ...fromRows("log", "penalaran", "logika", LOGIKA),
  ...ANALITIS.flatMap((p) =>
    p.qs.map(([q, correct, a, b, c, why], i) =>
      mc(`anl-${p.id}-${i + 1}`, "penalaran", "analitis", q, correct, [a, b, c], why, p.setup),
    ),
  ),
];

// ------------------------------------------------------------------ Generator kuantitatif dan pola

function num(n: number): string {
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

function rp(n: number): string {
  return `Rp${num(n)}`;
}

/** Ambil tiga pengecoh unik yang berbeda dari jawaban. */
function distinct(correct: string, candidates: string[]): string[] {
  const out: string[] = [];
  for (const c of candidates) if (c !== correct && !out.includes(c)) out.push(c);
  return out.slice(0, 3);
}

type Gen = (
  seed: number,
) => Omit<LpdpQuestion, "id" | "sub" | "options" | "answer"> & { correct: string; wrong: string[] };

const QUANT: Record<string, Gen> = {
  persen: (s) => {
    const h = take(s, 1, [80000, 120000, 150000, 200000, 250000, 400000]);
    const a = take(s, 2, [10, 20, 25, 30]);
    const b = take(s, 3, [10, 20, 25]);
    const v = h * (1 + a / 100) * (1 - b / 100);
    return {
      kind: "persen",
      q: `Harga sebuah barang ${rp(h)} dinaikkan ${a}%, kemudian diturunkan ${b}% dari harga yang baru. Harga akhirnya adalah…`,
      correct: rp(v),
      wrong: distinct(rp(v), [
        rp(h * (1 + (a - b) / 100)),
        rp(h),
        rp(h * (1 + a / 100) * (1 + b / 100)),
        rp(h * (1 - b / 100)),
      ]),
      why: `Kalikan faktor: ${num(h)} × ${num(1 + a / 100)} × ${num(1 - b / 100)} = ${num(v)}. Persen beruntun tidak dijumlahkan.`,
      steps: [
        `Diketahui harga awal ${rp(h)}, naik ${a}%, kemudian turun ${b}%. Yang ditanya adalah harga akhirnya.`,
        `Ubah kenaikan menjadi faktor 1 + ${a}/100 = ${num(1 + a / 100)}. Harga setelah naik: ${rp(h * (1 + a / 100))}.`,
        `Penurunan memakai harga yang baru: faktor 1 − ${b}/100 = ${num(1 - b / 100)}. Kalikan ${num(h * (1 + a / 100))} × ${num(1 - b / 100)} = ${num(v)}.`,
        "Jangan menjumlahkan persen karena dasar perhitungan kedua sudah berubah.",
      ],
    };
  },
  untung: (s) => {
    const beli = take(s, 1, [40000, 60000, 75000, 120000, 250000]);
    const p = take(s, 2, [10, 15, 20, 25, 40]);
    const jual = beli * (1 + p / 100);
    return {
      kind: "persen",
      q: `Pedagang membeli barang seharga ${rp(beli)} dan ingin untung ${p}%. Harga jualnya adalah…`,
      correct: rp(jual),
      wrong: distinct(rp(jual), [
        rp((beli * p) / 100),
        rp(beli + p * 1000),
        rp(beli * (1 - p / 100)),
        rp(beli / (1 - p / 100)),
      ]),
      why: `Untung dihitung dari harga beli: ${num(beli)} × ${num(1 + p / 100)} = ${num(jual)}.`,
      steps: [
        `Diketahui harga beli ${rp(beli)} dan untung ${p}% dari harga beli.`,
        `Hitung untung: ${num(beli)} × ${p}/100 = ${rp(jual - beli)}.`,
        `Harga jual = harga beli + untung = ${num(beli)} + ${num(jual - beli)} = ${rp(jual)}.`,
        "Cek bahwa harga jual lebih besar daripada harga beli dan persentase memakai harga beli sebagai dasar.",
      ],
    };
  },
  perbandingan: (s) => {
    const [a, b] = take(s, 1, [
      [2, 3],
      [3, 5],
      [4, 7],
      [5, 8],
      [3, 7],
    ] as const);
    const unit = take(s, 2, [20000, 25000, 50000, 100000]);
    const selisih = (b - a) * unit;
    const total = (a + b) * unit;
    return {
      kind: "perbandingan",
      q: `Uang Ani dan Budi berbanding ${a} : ${b}. Selisih uang mereka ${rp(selisih)}. Jumlah uang mereka berdua adalah…`,
      correct: rp(total),
      wrong: distinct(rp(total), [
        rp(b * unit),
        rp(selisih * (a + b)),
        rp(total - unit),
        rp(a * unit),
      ]),
      why: `Selisih ${b - a} bagian = ${num(selisih)}, jadi 1 bagian = ${num(unit)}. Jumlah ${a + b} bagian = ${num(total)}.`,
      steps: [
        `Perbandingan ${a} : ${b} berarti nilai pertama ${a} bagian dan kedua ${b} bagian. Selisihnya ${num(selisih)}.`,
        `Selisih bagian = ${b} − ${a} = ${b - a}. Satu bagian = ${num(selisih)} / ${b - a} = ${num(unit)}.`,
        `Jumlah bagian = ${a} + ${b} = ${a + b}. Jumlah nilai = ${a + b} × ${num(unit)} = ${num(total)}.`,
        `Cek nilai masing-masing: ${num(a * unit)} dan ${num(b * unit)}; selisihnya kembali ${num(selisih)}.`,
      ],
    };
  },
  skala: (s) => {
    const cm = take(s, 1, [2, 3.5, 4, 6, 7.5, 12]);
    const skala = take(s, 2, [100000, 250000, 500000, 2000000]);
    const km = (cm * skala) / 100000;
    return {
      kind: "perbandingan",
      q: `Jarak dua kota pada peta berskala 1 : ${skala.toLocaleString("id-ID")} adalah ${num(cm)} cm. Jarak sebenarnya adalah…`,
      correct: `${num(km)} km`,
      wrong: distinct(`${num(km)} km`, [
        `${num(km * 10)} km`,
        `${num(km / 10)} km`,
        `${num(cm * skala)} km`,
        `${num(km * 100)} km`,
      ]),
      why: `${num(cm)} × ${skala.toLocaleString("id-ID")} = ${num(cm * skala)} cm = ${num(km)} km (1 km = 100.000 cm).`,
      steps: [
        `Skala 1 : ${num(skala)} berarti 1 cm pada peta mewakili ${num(skala)} cm sebenarnya.`,
        `Jarak sebenarnya = ${num(cm)} × ${num(skala)} = ${num(cm * skala)} cm.`,
        `Ubah cm menjadi km dengan membagi 100.000: ${num(cm * skala)} / 100.000 = ${num(km)} km.`,
        "Pastikan hasil memakai satuan yang diminta, bukan angka jarak dalam cm.",
      ],
    };
  },
  papasan: (s) => {
    const [v1, v2] = take(s, 1, [
      [40, 50],
      [45, 55],
      [60, 40],
      [30, 50],
      [70, 50],
    ] as const);
    const jam = take(s, 2, [1.5, 2, 2.5, 3]);
    const jarak = (v1 + v2) * jam;
    const menit = jam * 60;
    return {
      kind: "kecepatan",
      q: `Dua kendaraan berangkat bersamaan dari dua kota yang berjarak ${num(jarak)} km dan saling mendekat dengan kecepatan ${v1} km/jam dan ${v2} km/jam. Mereka berpapasan setelah…`,
      correct: `${num(menit)} menit`,
      wrong: distinct(`${num(menit)} menit`, [
        `${num((jarak / Math.abs(v1 - v2 || 10)) * 60)} menit`,
        `${num((jarak / v1) * 60)} menit`,
        `${num(menit + 30)} menit`,
        `${num(menit / 2)} menit`,
      ]),
      why: `Saling mendekat: kecepatan dijumlah ${v1 + v2} km/jam. Waktu = ${num(jarak)} / ${v1 + v2} = ${num(jam)} jam = ${num(menit)} menit.`,
      steps: [
        `Jarak awal ${num(jarak)} km, kecepatan ${v1} dan ${v2} km/jam. Keduanya bergerak saling mendekat.`,
        `Laju penutupan jarak = ${v1} + ${v2} = ${v1 + v2} km/jam.`,
        `Waktu = jarak / laju = ${num(jarak)} / ${v1 + v2} = ${num(jam)} jam.`,
        `Ubah ke menit: ${num(jam)} × 60 = ${num(menit)} menit. Pengurangan kecepatan dipakai untuk menyusul searah, bukan soal ini.`,
      ],
    };
  },
  pekerjaan: (s) => {
    const [x, y] = take(s, 1, [
      [6, 3],
      [12, 6],
      [10, 15],
      [20, 30],
      [4, 12],
      [9, 18],
      [8, 24],
    ] as const);
    const t = (x * y) / (x + y);
    return {
      kind: "pekerjaan",
      q: `Andi dapat menyelesaikan sebuah pekerjaan dalam ${x} hari, sedangkan Banu dalam ${y} hari. Jika bekerja bersama, pekerjaan itu selesai dalam…`,
      correct: `${num(t)} hari`,
      wrong: distinct(`${num(t)} hari`, [
        `${num((x + y) / 2)} hari`,
        `${num(x + y)} hari`,
        `${num(Math.abs(x - y))} hari`,
        `${num(t + 1)} hari`,
      ]),
      why: `Laju gabungan = 1/${x} + 1/${y} = ${x + y}/${x * y} = 1/${num(t)} pekerjaan per hari, jadi waktunya ${num(t)} hari. Rumus cepat: (${x} × ${y}) / (${x} + ${y}).`,
      steps: [
        `Andi menyelesaikan 1/${x} pekerjaan per hari; Banu 1/${y} pekerjaan per hari.`,
        `Jumlahkan laju: 1/${x} + 1/${y} = (${y} + ${x}) / (${x} × ${y}) = ${x + y}/${x * y} pekerjaan per hari.`,
        `Untuk satu pekerjaan utuh, waktu = 1 / laju gabungan = ${x * y}/${x + y} = ${num(t)} hari.`,
        `Cek bahwa ${num(t)} hari lebih singkat daripada ${Math.min(x, y)} hari, waktu orang yang paling cepat bekerja sendiri.`,
      ],
    };
  },
  gabungan: (s) => {
    const [n1, a1, n2, a2] = take(s, 1, [
      [20, 70, 30, 80],
      [10, 60, 30, 72],
      [15, 80, 25, 64],
      [40, 75, 10, 90],
      [12, 65, 18, 75],
    ] as const);
    const v = (n1 * a1 + n2 * a2) / (n1 + n2);
    return {
      kind: "statistik",
      q: `Rata-rata nilai ${n1} siswa kelas A adalah ${a1}, dan rata-rata ${n2} siswa kelas B adalah ${a2}. Rata-rata nilai gabungan kedua kelas adalah…`,
      correct: num(v),
      wrong: distinct(num(v), [num((a1 + a2) / 2), num(v + 2), num(v - 2), num(Math.max(a1, a2))]),
      why: `Total = ${n1}×${a1} + ${n2}×${a2} = ${n1 * a1 + n2 * a2}. Dibagi ${n1 + n2} siswa = ${num(v)}. Bukan rata-rata dari dua rata-rata.`,
      steps: [
        `Ubah rata-rata ke total nilai: kelas A = ${n1} × ${a1} = ${num(n1 * a1)}, kelas B = ${n2} × ${a2} = ${num(n2 * a2)}.`,
        `Total gabungan = ${num(n1 * a1)} + ${num(n2 * a2)} = ${num(n1 * a1 + n2 * a2)}. Jumlah siswa = ${n1} + ${n2} = ${n1 + n2}.`,
        `Rata-rata gabungan = ${num(n1 * a1 + n2 * a2)} / ${n1 + n2} = ${num(v)}.`,
        `Hasil harus berada di antara ${Math.min(a1, a2)} dan ${Math.max(a1, a2)}. Kelompok yang lebih besar memiliki bobot lebih besar.`,
      ],
    };
  },
  tambahan: (s) => {
    const n = take(s, 1, [9, 11, 14, 19, 24]);
    const r = take(s, 2, [60, 68, 70, 75]);
    const naik = take(s, 3, [1, 2, 3]);
    const x = (n + 1) * (r + naik) - n * r;
    return {
      kind: "statistik",
      q: `Rata-rata nilai ${n} peserta adalah ${r}. Setelah satu peserta baru bergabung, rata-ratanya menjadi ${r + naik}. Nilai peserta baru itu adalah…`,
      correct: num(x),
      wrong: distinct(num(x), [num(r + naik), num(r + naik * n), num(x - naik * 2), num(x + 10)]),
      why: `Total baru ${n + 1} × ${r + naik} = ${(n + 1) * (r + naik)}; total lama ${n} × ${r} = ${n * r}. Selisihnya ${x}.`,
      steps: [
        `Total nilai awal = ${n} peserta × ${r} = ${num(n * r)}.`,
        `Setelah satu peserta masuk ada ${n + 1} peserta, rata-rata ${r + naik}. Total baru = ${n + 1} × ${r + naik} = ${num((n + 1) * (r + naik))}.`,
        `Nilai peserta baru = total baru − total awal = ${num((n + 1) * (r + naik))} − ${num(n * r)} = ${num(x)}.`,
        `Cek: (${num(n * r)} + ${num(x)}) / ${n + 1} = ${r + naik}.`,
      ],
    };
  },
  sistem: (s) => {
    const p = take(s, 1, [1500, 2000, 2500, 3000]);
    const b = take(s, 2, [4000, 5000, 6000, 7500]);
    const q1 = 2 * p + 3 * b;
    const q2 = 3 * p + b;
    return {
      kind: "aljabar",
      q: `Harga 2 pensil dan 3 buku adalah ${rp(q1)}. Harga 3 pensil dan 1 buku adalah ${rp(q2)}. Harga satu buku adalah…`,
      correct: rp(b),
      wrong: distinct(rp(b), [rp(p), rp(b + 500), rp(b - 500), rp(q1 / 5)]),
      why: `Kalikan persamaan kedua dengan 3: 9 pensil + 3 buku = ${num(3 * q2)}. Kurangi persamaan pertama: 7 pensil = ${num(3 * q2 - q1)}, pensil = ${num(p)}. Maka buku = ${num(b)}.`,
      steps: [
        `Misalkan p = harga satu pensil dan b = harga satu buku. Tulis 2p + 3b = ${num(q1)} dan 3p + b = ${num(q2)}.`,
        `Kalikan persamaan kedua dengan 3: 9p + 3b = ${num(3 * q2)}. Kurangi persamaan pertama: 7p = ${num(3 * q2 - q1)}, sehingga p = ${num(p)}.`,
        `Masukkan ke 3p + b = ${num(q2)}: b = ${num(q2)} − 3 × ${num(p)} = ${rp(b)}.`,
        `Cek kembali: 2 × ${num(p)} + 3 × ${num(b)} = ${num(q1)}. Yang ditanya buku, bukan pensil.`,
      ],
    };
  },
  deret: (s) => {
    const mode = take(s, 1, [0, 1, 2, 3]);
    let seq: number[];
    let next: number;
    let why: string;
    if (mode === 0) {
      const a = take(s, 2, [3, 5, 7, 12]);
      const d = take(s, 3, [4, 6, 7, 9]);
      seq = [0, 1, 2, 3, 4].map((i) => a + i * d);
      next = a + 5 * d;
      why = `Selisih tetap ${d}.`;
    } else if (mode === 1) {
      const a = take(s, 2, [2, 3, 5]);
      const r = take(s, 3, [2, 3]);
      seq = [0, 1, 2, 3].map((i) => a * r ** i);
      next = a * r ** 4;
      why = `Dikali ${r} setiap langkah.`;
    } else if (mode === 2) {
      const a = take(s, 2, [2, 4, 5]);
      const d = take(s, 3, [1, 2, 3]);
      seq = [a];
      for (let i = 1; i <= 4; i++) seq.push(seq[i - 1] + d * i);
      next = seq[4] + d * 5;
      why = `Selisihnya ${d}, ${2 * d}, ${3 * d}, ${4 * d}, jadi berikutnya bertambah ${5 * d}.`;
    } else {
      const a = take(s, 2, [10, 20, 30]);
      const b = take(s, 3, [3, 5, 8]);
      seq = [a, b, a + 2, b + 2, a + 4, b + 4];
      next = a + 6;
      why = `Dua deret selang-seling: ${a}, ${a + 2}, ${a + 4}, … dan ${b}, ${b + 2}, ${b + 4}, …`;
    }
    return {
      kind: "deret",
      q: `Bilangan berikutnya dari deret ${seq.join(", ")}, … adalah…`,
      correct: num(next),
      wrong: distinct(num(next), [
        num(next + 1),
        num(next - 2),
        num(next + 3),
        num(next * 2),
        num(next - 1),
      ]),
      why,
      steps: [
        `Tuliskan deret: ${seq.join(", ")}. Hitung selisih bertetangga: ${seq
          .slice(1)
          .map((v, i) => v - seq[i])
          .join(", ")}.`,
        `Kenali aturan yang konsisten pada semua suku: ${why}`,
        `Lanjutkan pola satu langkah; suku berikutnya adalah ${num(next)}.`,
        "Uji aturan pada seluruh deret. Jika pola bergantian, pisahkan posisi ganjil dan genap sebelum melanjutkan.",
      ],
    };
  },
  bunga: (s) => {
    const m = take(s, 1, [2000000, 5000000, 10000000, 12000000]);
    const r = take(s, 2, [6, 8, 9, 12]);
    const bulan = take(s, 3, [6, 9, 18, 24]);
    const total = m * (1 + ((r / 100) * bulan) / 12);
    return {
      kind: "peluang",
      q: `Tabungan ${rp(m)} mendapat bunga tunggal ${r}% per tahun. Jumlah tabungan setelah ${bulan} bulan adalah…`,
      correct: rp(total),
      wrong: distinct(rp(total), [
        rp(m * (1 + (r / 100) * bulan)),
        rp(m * (1 + r / 100)),
        rp(m * (1 + r / 100) ** (bulan / 12)),
        rp((m * r * bulan) / 1200),
      ]),
      why: `Bunga = ${num(m)} × ${r}% × ${bulan}/12 = ${num(total - m)}. Jumlah = ${num(total)}.`,
      steps: [
        `Modal ${rp(m)}; bunga tunggal ${r}% per tahun. Lama menabung ${bulan} bulan = ${bulan}/12 tahun.`,
        `Bunga = modal × suku bunga × waktu = ${num(m)} × ${r}/100 × ${bulan}/12 = ${rp(total - m)}.`,
        `Jumlah tabungan = modal + bunga = ${num(m)} + ${num(total - m)} = ${rp(total)}.`,
        "Jangan mengalikan suku bunga tahunan langsung dengan jumlah bulan. Bunga tunggal memakai modal awal, tanpa bunga berbunga.",
      ],
    };
  },
  peluang: (s) => {
    const [m, n] = take(s, 1, [
      [3, 2],
      [4, 2],
      [5, 3],
      [4, 4],
      [6, 4],
    ] as const);
    const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
    const frac = (a: number, b: number) => {
      const k = g(a, b);
      return `${a / k}/${b / k}`;
    };
    const atas = m * (m - 1);
    const bawah = (m + n) * (m + n - 1);
    return {
      kind: "peluang",
      q: `Sebuah kotak berisi ${m} bola merah dan ${n} bola biru. Dua bola diambil satu per satu tanpa pengembalian. Peluang keduanya merah adalah…`,
      correct: frac(atas, bawah),
      wrong: distinct(frac(atas, bawah), [
        frac(m * m, (m + n) ** 2),
        frac(m, m + n),
        frac(m - 1, m + n),
        frac(2 * m, bawah),
        frac(atas, (m + n) ** 2),
      ]),
      why: `${m}/${m + n} × ${m - 1}/${m + n - 1} = ${atas}/${bawah} = ${frac(atas, bawah)}. Pengambilan kedua tinggal ${m + n - 1} bola.`,
      steps: [
        `Awalnya ${m} bola merah dari ${m + n} bola. Peluang merah pertama = ${m}/${m + n}.`,
        `Setelah satu merah diambil tanpa dikembalikan, tersisa ${m - 1} merah dari ${m + n - 1} bola. Peluang merah kedua = ${m - 1}/${m + n - 1}.`,
        `Kalikan peluang berurutan: ${m}/${m + n} × ${m - 1}/${m + n - 1} = ${atas}/${bawah} = ${frac(atas, bawah)}.`,
        "Penyebut dan jumlah merah berkurang pada pengambilan kedua. Jika bola dikembalikan, perhitungannya berbeda.",
      ],
    };
  },
};

const QUANT_KINDS = Object.keys(QUANT);

function alphabetGen(
  seed: number,
): Omit<LpdpQuestion, "id" | "sub" | "options" | "answer"> & { correct: string; wrong: string[] } {
  const L = (i: number) => String.fromCharCode(64 + i);
  const mode = take(seed, 1, [0, 1, 2]);
  let idx: number[];
  let why: string;
  if (mode === 0) {
    const start = take(seed, 2, [1, 2, 3, 4]);
    const step = take(seed, 3, [2, 3, 4]);
    idx = [0, 1, 2, 3, 4, 5].map((i) => start + i * step);
    why = `Lompat ${step} huruf setiap langkah.`;
  } else if (mode === 1) {
    const start = take(seed, 2, [1, 2, 3]);
    idx = [start];
    for (let i = 1; i < 6; i++) idx.push(idx[i - 1] + i);
    why = "Selisihnya bertambah: +1, +2, +3, +4, +5.";
  } else {
    const start = take(seed, 2, [24, 25, 26]);
    const step = take(seed, 3, [2, 3]);
    idx = [0, 1, 2, 3, 4, 5].map((i) => start - i * step);
    why = `Mundur ${step} huruf setiap langkah.`;
  }
  const shown = idx.slice(0, 5).map(L).join(", ");
  const correct = L(idx[5]);
  const wrongIdx = [idx[5] + 1, idx[5] - 1, idx[5] + 2, idx[5] - 2].filter(
    (i) => i >= 1 && i <= 26,
  );
  return {
    kind: "pola",
    q: `Huruf berikutnya dari pola ${shown}, … adalah…`,
    correct,
    wrong: distinct(correct, wrongIdx.map(L)),
    why: `${why} (A = 1, …, Z = 26)`,
    steps: [
      `Ubah ${shown} ke nomor alfabet: ${idx.slice(0, 5).join(", ")} (A = 1 sampai Z = 26).`,
      `Hitung selisih nomor: ${idx
        .slice(1, 5)
        .map((v, i) => v - idx[i])
        .join(", ")}. ${why}`,
      `Lanjutkan pola; nomor berikutnya ${idx[5]}. Ubah kembali ke huruf: ${correct}.`,
      "Periksa apakah pola bergerak maju atau mundur, dan apakah selisihnya tetap atau bertambah.",
    ],
  };
}

function finish(id: string, sub: SubId, raw: ReturnType<Gen>): LpdpQuestion {
  const q = mc(id, sub, raw.kind, raw.q, raw.correct, raw.wrong, raw.why, raw.passage);
  return { ...q, steps: raw.steps };
}

/** Soal kuantitatif ke-n (tak terbatas, dibuat dari parameter). */
export function quantQuestion(seed: number, kind?: string): LpdpQuestion {
  const k = kind && QUANT[kind] ? kind : QUANT_KINDS[hash(seed, 7) % QUANT_KINDS.length];
  return finish(`kq-${k}-${seed}`, "kuantitatif", QUANT[k](seed));
}

export function patternQuestion(seed: number): LpdpQuestion {
  return finish(`pl-${seed}`, "penalaran", alphabetGen(seed));
}

/** Satu soal latihan untuk subtes dan (opsional) jenis tertentu. */
export function drawQuestion(sub: SubId, seed: number, kind?: string): LpdpQuestion {
  if (sub === "kuantitatif") {
    const kindsOfSub: Record<string, string[]> = {
      persen: ["persen", "untung"],
      perbandingan: ["perbandingan", "skala"],
      kecepatan: ["papasan"],
      pekerjaan: ["pekerjaan"],
      statistik: ["gabungan", "tambahan"],
      aljabar: ["sistem"],
      deret: ["deret"],
      peluang: ["peluang", "bunga"],
    };
    const pool = kind ? kindsOfSub[kind] : undefined;
    return quantQuestion(seed, pool ? pool[hash(seed, 3) % pool.length] : undefined);
  }
  if (sub === "penalaran" && (kind === "pola" || (!kind && hash(seed, 11) % 4 === 0)))
    return patternQuestion(seed);
  const pool = CURATED.filter((q) => q.sub === sub && (!kind || q.kind === kind));
  return pool[hash(seed, 13) % pool.length];
}

export function bankSize(sub: SubId): { curated: number; generated: boolean } {
  return { curated: CURATED.filter((q) => q.sub === sub).length, generated: sub !== "verbal" };
}

/** Paket simulasi: 10 verbal, 10 kuantitatif, 10 penalaran, tanpa soal kembar. */
export function buildSimulation(seed: number, perSub = 10): LpdpQuestion[] {
  const out: LpdpQuestion[] = [];
  for (const sub of ["verbal", "kuantitatif", "penalaran"] as SubId[]) {
    const seen = new Set<string>();
    let i = 0;
    while (seen.size < perSub && i < 500) {
      const q = drawQuestion(sub, seed * 1000 + i);
      i++;
      const key = q.passage ? `${q.id}` : q.q;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(q);
    }
  }
  return out;
}

export function getSubtes(id: string): Subtes | undefined {
  return SUBTES.find((s) => s.id === id);
}

// ------------------------------------------------------------------ Esai

export const ESSAY_GUIDE = {
  structure: [
    {
      t: "Pembuka (±15%)",
      d: "Satu kalimat konteks yang konkret (angka, peristiwa, atau pengalaman), lalu tesis: posisimu dalam satu kalimat.",
    },
    {
      t: "Isi (±70%)",
      d: "Dua atau tiga argumen. Tiap paragraf: klaim, bukti atau contoh, penjelasan, dan kaitan ke tesis (pola PEEL).",
    },
    {
      t: "Penutup (±15%)",
      d: "Tegaskan kembali tesis dengan kata lain, lalu tawarkan langkah yang bisa dilakukan, termasuk peranmu.",
    },
  ],
  onTheSpot: [
    "Lima menit pertama untuk membaca tema dan menulis kerangka. Jangan langsung menulis.",
    "Pilih satu sudut pandang yang jelas; esai yang ingin membahas semuanya biasanya dangkal.",
    "Pakai contoh Indonesia yang spesifik: daerah, kebijakan, atau data yang kamu yakini kebenarannya. Jangan mengarang angka.",
    "Sisakan lima menit terakhir untuk membaca ulang: ejaan, kalimat terlalu panjang, dan kesesuaian dengan tema.",
  ],
  admin: [
    {
      t: "Esai kontribusi untuk Indonesia",
      qs: [
        "Masalah apa di Indonesia yang ingin kamu selesaikan, dan kenapa kamu?",
        "Apa yang sudah kamu lakukan untuk masalah itu sebelum mendaftar?",
        "Bagaimana studi ini (jurusan, kampus, mata kuliah, riset) langsung terkait dengan masalah itu?",
        "Apa rencana konkret 1, 5, dan 10 tahun setelah lulus? Di institusi mana, dengan siapa?",
      ],
    },
    {
      t: "Rencana studi",
      qs: [
        "Kenapa jurusan dan kampus ini, dibanding pilihan lain?",
        "Mata kuliah, laboratorium, atau profesor mana yang relevan, dan untuk apa?",
        "Rencana riset atau tesis: pertanyaan, metode, dan data apa?",
        "Bagaimana kamu menyelesaikan studi tepat waktu (bahasa, adaptasi, keuangan)?",
      ],
    },
  ],
  checklist: [
    "Tesis bisa ditunjuk dalam satu kalimat",
    "Setiap paragraf isi punya satu gagasan pokok",
    "Ada minimal satu contoh atau data spesifik",
    "Peran pribadimu jelas, bukan hanya “pemerintah harus…”",
    "Tidak ada klaim berlebihan atau angka tanpa sumber",
    "Ejaan dan kata baku diperiksa",
  ],
};

export const ESSAY_PROMPTS: { id: string; title: string; prompt: string }[] = [
  {
    id: "energi",
    title: "Transisi energi",
    prompt:
      "Bagaimana Indonesia dapat mempercepat transisi energi tanpa mengorbankan keterjangkauan listrik bagi masyarakat berpenghasilan rendah? Apa peranmu?",
  },
  {
    id: "ai-pendidikan",
    title: "AI dan pendidikan",
    prompt:
      "Kecerdasan artifisial dapat memperlebar atau mempersempit kesenjangan pendidikan di Indonesia. Bagaimana pendapatmu, dan langkah apa yang perlu diambil?",
  },
  {
    id: "pangan",
    title: "Ketahanan pangan",
    prompt:
      "Indonesia adalah negara agraris, tetapi masih mengimpor sejumlah bahan pangan. Bagaimana memperkuat ketahanan pangan dalam sepuluh tahun ke depan?",
  },
  {
    id: "demografi",
    title: "Bonus demografi",
    prompt:
      "Apa yang harus disiapkan agar bonus demografi menjadi keuntungan, bukan beban? Kaitkan dengan bidang studimu.",
  },
  {
    id: "kesehatan",
    title: "Layanan kesehatan daerah",
    prompt:
      "Ketimpangan tenaga dan fasilitas kesehatan antarwilayah masih besar. Solusi apa yang realistis, dan apa kontribusimu?",
  },
  {
    id: "umkm",
    title: "UMKM dan ekonomi digital",
    prompt:
      "Bagaimana UMKM dapat naik kelas di era ekonomi digital tanpa tersingkir oleh platform besar?",
  },
  {
    id: "sampah",
    title: "Sampah plastik",
    prompt:
      "Indonesia menghadapi masalah sampah plastik di darat dan laut. Kebijakan dan perubahan perilaku apa yang paling berdampak?",
  },
  {
    id: "riset",
    title: "Riset dan inovasi",
    prompt:
      "Mengapa hasil riset di Indonesia sering berhenti di jurnal dan tidak sampai ke industri? Bagaimana menjembataninya?",
  },
  {
    id: "integritas",
    title: "Integritas",
    prompt:
      "Ceritakan bagaimana kamu akan menjaga integritas dalam pekerjaan setelah lulus, termasuk saat menghadapi tekanan.",
  },
  {
    id: "kepemimpinan",
    title: "Kepemimpinan",
    prompt:
      "Kepemimpinan seperti apa yang dibutuhkan Indonesia untuk menghadapi perubahan teknologi dan iklim? Beri contoh dari pengalamanmu.",
  },
];

// ------------------------------------------------------------------ Wawancara

export const STAR = [
  {
    k: "S",
    t: "Situasi",
    d: "Konteks singkat: di mana, kapan, apa masalahnya. Satu atau dua kalimat.",
  },
  { k: "T", t: "Tugas", d: "Tanggung jawabmu sendiri dalam situasi itu." },
  {
    k: "A",
    t: "Aksi",
    d: "Apa yang kamu lakukan, dengan kata kerja orang pertama. Ini bagian terpanjang.",
  },
  { k: "R", t: "Hasil", d: "Dampak yang terukur bila bisa, dan apa yang kamu pelajari." },
];

export const INTERVIEW: { group: string; note: string; qs: string[] }[] = [
  {
    group: "Perkenalan dan motivasi",
    note: "Panel ingin melihat benang merah antara masa lalu, studi, dan rencana.",
    qs: [
      "Ceritakan tentang diri Anda.",
      "Mengapa Anda membutuhkan beasiswa ini?",
      "Mengapa memilih jurusan ini, dan mengapa sekarang?",
      "Mengapa kampus dan negara itu, bukan di dalam negeri?",
    ],
  },
  {
    group: "Rencana studi",
    note: "Jawaban harus konsisten dengan rencana studi tertulis.",
    qs: [
      "Apa topik tesis atau riset Anda, dan apa kebaruannya?",
      "Mata kuliah apa yang paling Anda butuhkan, dan untuk apa?",
      "Apa rencana Anda bila studi lebih berat dari perkiraan?",
      "Bagaimana Anda menjamin lulus tepat waktu?",
    ],
  },
  {
    group: "Kontribusi dan rencana setelah lulus",
    note: "Konkret: institusi, peran, dan langkah bertahap. Hindari janji yang terlalu besar.",
    qs: [
      "Apa yang akan Anda lakukan dalam satu tahun pertama setelah kembali?",
      "Kontribusi apa yang sudah Anda lakukan sebelum mendaftar?",
      "Bagaimana jika rencana kontribusi Anda tidak berjalan?",
      "Siapa yang paling merasakan manfaat dari studi Anda?",
    ],
  },
  {
    group: "Kepemimpinan dan pengalaman",
    note: "Gunakan pola STAR; ceritakan peranmu sendiri, bukan tim secara umum.",
    qs: [
      "Ceritakan pengalaman memimpin yang paling berkesan.",
      "Ceritakan kegagalan terbesar Anda dan apa yang Anda pelajari.",
      "Pernahkah Anda berbeda pendapat dengan atasan atau tim? Apa yang Anda lakukan?",
      "Ceritakan saat Anda harus menyelesaikan sesuatu dengan sumber daya terbatas.",
    ],
  },
  {
    group: "Integritas dan nilai kebangsaan",
    note: "Jawaban jujur dan sederhana lebih meyakinkan daripada kata-kata besar.",
    qs: [
      "Apa yang Anda lakukan jika melihat rekan melakukan kecurangan?",
      "Bagaimana Anda memaknai komitmen kembali ke Indonesia?",
      "Apa arti integritas bagi Anda, dengan contoh nyata?",
      "Bagaimana Anda menghadapi pengaruh budaya yang berbeda saat studi di luar negeri?",
    ],
  },
  {
    group: "Wawasan isu",
    note: "Kenali isu utama bidangmu: data dasar, kebijakan terkini, dan pandanganmu yang beralasan.",
    qs: [
      "Apa masalah terbesar di bidang Anda di Indonesia saat ini?",
      "Kebijakan pemerintah apa yang relevan dengan bidang Anda, dan bagaimana penilaian Anda?",
      "Bagaimana teknologi akan mengubah bidang Anda dalam lima tahun?",
      "Jika Anda menjadi pengambil keputusan, apa satu kebijakan yang akan Anda ambil?",
    ],
  },
];

export const INTERVIEW_TIPS = [
  "Latih jawaban lisan 1–2 menit; jawaban yang terlalu panjang menghabiskan waktu panel.",
  "Bawa angka atau contoh spesifik untuk setiap klaim penting.",
  "Jika tidak tahu, katakan jujur lalu jelaskan bagaimana kamu akan mencari tahu.",
  "Baca ulang esai dan rencana studimu sehari sebelumnya; panel akan menanyakannya.",
  "Untuk wawancara daring: cek kamera, cahaya dari depan, dan koneksi internet cadangan.",
];

// ------------------------------------------------------------------ Rencana belajar

export const PLAN: { week: string; focus: string; tasks: string[] }[] = [
  {
    week: "Minggu 1–2",
    focus: "Peta kekuatan",
    tasks: [
      "Kerjakan satu simulasi tanpa persiapan untuk tahu posisi awal",
      "Kuantitatif: persen, perbandingan, pecahan",
      "Verbal: 10 kata baru per hari dari berita",
    ],
  },
  {
    week: "Minggu 3–4",
    focus: "Menutup kelemahan",
    tasks: [
      "Latihan per jenis soal yang skornya paling rendah",
      "Penalaran: silogisme dan logika proposisi sampai lancar",
      "Draf pertama esai kontribusi dan rencana studi",
    ],
  },
  {
    week: "Minggu 5–6",
    focus: "Kecepatan",
    tasks: [
      "Simulasi bertimer dua kali seminggu",
      "Esai on the spot: satu tema per minggu, 45–60 menit",
      "Minta orang lain membaca esai administrasimu",
    ],
  },
  {
    week: "Minggu 7–8",
    focus: "Wawancara dan pemantapan",
    tasks: [
      "Latihan wawancara: rekam diri sendiri menjawab 3 pertanyaan per hari",
      "Ulang soal yang pernah salah",
      "Tidur cukup menjelang tes; jangan belajar materi baru di hari terakhir",
    ],
  },
];
