# 📖 Hafalan Nama-nama Surat Al-Qur'an

Aplikasi kuis interaktif berbasis web untuk membantu menghafal nama-nama surat di Al-Qur'an beserta nomornya — lengkap dengan nama Arab, arti, dan jumlah ayat.

---

## ✨ Fitur

- **Pilih rentang surat** — bisa latihan dari surat tertentu saja (misal: Juz 30, atau surat 1–10)
- **Dua tipe soal acak:**
  - 🔢 **Tebak Nomor** — Diberi nama surat, tebak nomornya
  - 📜 **Tebak Nama** — Diberi nomor surat, tebak namanya
- **Statistik real-time** — Benar, Salah, dan Streak ditampilkan langsung
- **Feedback jawaban** — Animasi benar/salah + info lengkap surat setelah menjawab
- **Konfeti** 🎉 — Muncul saat jawaban benar
- **Desain responsif** — Nyaman di HP maupun desktop

---

## 🚀 Cara Menjalankan

Tidak perlu instalasi apapun. Cukup:

1. Download atau clone folder ini
2. Double-click **`index.html`**
3. Browser langsung membuka aplikasi ✅

---

## 📁 Struktur File

```
HafalanSurat/
├── index.html    # Struktur halaman (HTML)
├── style.css     # Tampilan & animasi (CSS)
├── surahs.js     # Data 114 surat Al-Qur'an
└── app.js        # Logika kuis (JavaScript)
```

### Penjelasan tiap file

| File | Isi |
|---|---|
| `index.html` | Markup HTML: halaman home, halaman kuis, dan result sheet |
| `style.css` | Semua styling: dark theme, animasi, layout responsif |
| `surahs.js` | Array data 114 surat — nomor, nama latin, nama Arab, jumlah ayat, arti |
| `app.js` | Logika: build select, generate soal, handle jawaban, statistik, konfeti |

---

## 🗂️ Format Data Surat

Data surat tersimpan di `surahs.js` sebagai array of object:

```js
const SURAHS = [
  { number: 1, latin: "Al-Fatihah", arabic: "الفاتحة", verses: 7, meaning: "Pembuka" },
  { number: 2, latin: "Al-Baqarah", arabic: "البقرة",  verses: 286, meaning: "Sapi Betina" },
  // ... 114 surat
];
```

---

## 🛠️ Teknologi

- **HTML5** — Struktur halaman
- **CSS3** — Styling, animasi, custom properties (variabel CSS)
- **Vanilla JavaScript** — Tanpa framework, tanpa dependensi eksternal
- **Google Fonts** — Amiri (Arab) + Plus Jakarta Sans (Latin)

---

## 🤲 Niat

> بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ

Semoga aplikasi ini bermanfaat untuk membantu menghafal urutan nama-nama surat Al-Qur'an. Barakallahu fiikum 🤍
