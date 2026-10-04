import type { LpdpQuestion } from "./lpdp.ts";

/** Cara menalar sebelum mencocokkan jawaban. Soal hitungan memasok langkah angka sendiri. */
export function solutionSteps(q: LpdpQuestion): string[] {
  const correct = q.options[q.answer];
  if (q.steps?.length) return [...q.steps, `Cocokkan hasil dengan pilihan: ${correct}.`];
  switch (q.kind) {
    case "sinonim":
      return [
        "Tandai bahwa soal meminta sinonim: cari makna yang sama, bukan lawannya.",
        `Temukan makna kata yang ditanyakan. ${q.why}`,
        `Gunakan “${correct}” untuk menggantikan kata asal dalam kalimat. Pilihan yang hanya mirip bunyinya tidak cukup.`,
        `Pilih “${correct}” karena mempertahankan makna tersebut.`,
      ];
    case "antonim":
      return [
        "Tandai bahwa soal meminta antonim. Tentukan makna kata asal dahulu.",
        q.why,
        `Cari arah makna yang berlawanan secara langsung: “${correct}”. Kata yang searti dengan kata asal merupakan pengecoh.`,
        `Periksa kembali bahwa “${correct}” adalah lawan, bukan sekadar kata yang berbeda.`,
      ];
    case "analogi":
      return [
        "Baca pasangan pertama sesuai urutannya. Nyatakan hubungan, misalnya alat–fungsi, bagian–keseluruhan, atau profesi–tempat kerja.",
        `Hubungan pada soal ini: ${q.why}`,
        `Terapkan hubungan itu pada “${correct}” dalam urutan yang sama. Jangan menerima pasangan yang relasinya terbalik.`,
        `Pasangan yang memenuhi hubungan tersebut adalah “${correct}”.`,
      ];
    case "bacaan":
      return [
        `Baca yang diminta: ${q.q}`,
        "Cari kalimat pendukung di bacaan. Untuk gagasan utama, lihat seluruh paragraf; untuk makna kata, gunakan konteks kalimatnya.",
        `Bukti dan penalaran dari teks: ${q.why}`,
        `Pilih “${correct}”. Hindari pilihan yang menambah klaim di luar teks atau mengubah cakupan pernyataan.`,
      ];
    case "kalimat":
      return [
        "Tentukan apakah yang diminta kata baku, ejaan, atau kalimat efektif. Periksa bentuk kata, subjek–predikat, lalu kata yang berlebihan.",
        `Aturan yang berlaku di soal ini: ${q.why}`,
        `Bentuk yang mengikuti aturan tersebut: “${correct}”. Bandingkan bagian itu dengan pilihan lainnya.`,
        "Baca ulang bentuk terpilih untuk memastikan makna tetap jelas dan tidak ada pengulangan yang tidak diperlukan.",
      ];
    case "silogisme":
      return [
        "Tulis premis sebagai hubungan himpunan atau implikasi. Bedakan semua, sebagian, dan tidak ada.",
        q.why === "Modus tollens."
          ? "Gunakan modus tollens: jika p mengakibatkan q, tetapi q tidak terjadi, maka p tidak terjadi."
          : q.why,
        `Uji simpulan “${correct}” hanya terhadap premis. Jika ada susunan yang memenuhi premis tetapi membantah simpulan, simpulan itu tidak pasti.`,
        "Jangan membalik arah implikasi atau mengganti sebagian menjadi semua. Pilih simpulan yang dijamin premis, termasuk tidak dapat dipastikan bila informasi kurang.",
      ];
    case "logika":
      return [
        "Kenali operasi yang ditanyakan: ingkaran, kontraposisi, kesetaraan, atau penarikan simpulan. Misalkan pernyataan pertama p dan kedua q bila ada dua bagian.",
        q.why === "Modus ponens."
          ? "Modus ponens: jika p ⇒ q benar dan p benar, q harus benar."
          : `Aturan: ${q.why}`,
        `Terapkan aturan pada kalimat asal. Hasilnya: “${correct}”. Simbol ¬ berarti tidak, ∧ berarti dan, ∨ berarti atau, dan ⇒ berarti jika–maka.`,
        "Untuk mengecek ingkaran, cari keadaan yang membuat pernyataan asal salah. Untuk kesetaraan, pastikan keduanya punya nilai kebenaran yang sama.",
      ];
    case "analitis":
      return [
        "Salin syarat dari bacaan ke tabel posisi atau pasangan. Isi posisi pasti terlebih dahulu; satu orang tidak boleh memakai dua posisi yang saling bertentangan.",
        `Terapkan semua batasan: ${q.why}`,
        `Periksa “${correct}” terhadap syarat. Untuk mungkin benar, satu susunan sah cukup; untuk pasti benar, periksa seluruh susunan yang memenuhi syarat.`,
        "Cek lagi posisi tetap, urutan sebelum/sesudah, dan larangan. Jangan mengabaikan satu syarat hanya agar pilihan terlihat cocok.",
      ];
    default:
      throw new Error(`Pembahasan belum tersedia untuk jenis ${q.kind}.`);
  }
}
