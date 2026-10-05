# 🎓 InformatikaLab - Media Pembelajaran Mandiri & AI Tutor Teknik Informatika

InformatikaLab adalah platform pembelajaran mandiri interaktif berbasis web yang dirancang khusus untuk mahasiswa Teknik Informatika. Aplikasi ini menyajikan modul materi kuliah terstruktur dengan dukungan syntax highlighting, kuis pemahaman, dan **AI Chatbot Tutor cerdas** yang ditenagai oleh **Google Gemini API** (`gemini-3.8-flash`).

---

## 🚀 Fitur Utama

1. **5 Pilar Modul Pembelajaran Terstruktur**:
   - **Pemrograman Web**: HTML5 Semantik, CSS Modern (Flexbox/Grid), JavaScript ES6+ & Event Loop, RESTful API, OWASP Web Security.
   - **Struktur Data & Algoritma**: Notasi Asimtotik (Big-O), Array, Linked List, Stack, Queue, Binary Search Tree, BFS/DFS, dan Algoritma Dijkstra.
   - **Basis Data**: Desain Relasional, Normalisasi (1NF, 2NF, 3NF, BCNF), Multi-Table JOINs, Window Functions, Transaksi ACID, dan Indexing B-Tree.
   - **Jaringan Komputer**: Model OSI 7 Layer vs TCP/IP, Pengalamatan IPv4, Subnetting CIDR, TCP 3-Way Handshake vs UDP, DNS, dan TLS/HTTPS.
   - **Kecerdasan Buatan (AI)**: Paradigma Machine Learning (Supervised, Unsupervised, RL), Jaringan Saraf Tiruan (ANN) & Backpropagation, Deep Learning, Arsitektur Transformer & LLM, serta Prompt Engineering.

2. **AI Chatbot Tutor (Google Gemini API)**:
   - **Persona**: Dosen / Tutor IT yang ramah, jelas, komunikatif, dan menyertakan contoh kode yang relevan (*clean code*).
   - **Streaming Response**: Jawaban AI mengalir secara real-time via Server-Sent Events (SSE).
   - **Penyisipan Kode & Debugging**: Mahasiswa dapat menyisipkan potongan kode untuk dianalisis error atau dioptimasi kompleksitas waktunya.
   - **Tombol Reset Obrolan & Saran Pertanyaan Cepat**.

3. **UI/UX Modern & Responsif**:
   - Tampilan adaptif nyaman diakses via ponsel pintar, tablet, maupun layar desktop.
   - **Mode Gelap / Terang (Dark/Light Mode)** dengan transisi halus dan persistensi preferensi di `localStorage`.
   - **Syntax Highlighting** lengkap dengan nomor baris dan tombol salin kode (*copy to clipboard*).
   - **Pencarian Real-Time & Filter Kategori/Tingkat Kesulitan**.
   - **Pelacakan Progres Belajar & Fitur Simpan Materi (Bookmark)**.
   - **Kuis Pemahaman Interaktif** dengan evaluasi jawaban instan dan penjelasan teoretis.

---

## 📁 Struktur Direktori

```
├── server.ts                 # Backend Express & proxy streaming Gemini API
├── index.html                # Entry point HTML & typography
├── package.json              # Daftar pustaka & dependensi
├── .env.example              # Template variabel lingkungan
├── .gitignore                # Pengecualian node_modules, .env, dist
├── README.md                 # Dokumentasi proyek
└── src/
    ├── main.tsx              # React DOM mounting
    ├── App.tsx               # Komponen utama & manajemen state global
    ├── index.css             # Tailwind CSS import & gaya global
    ├── types/
    │   └── index.ts          # Definisi tipe TypeScript
    ├── data/
    │   └── modulesData.ts    # Bank data modul kuliah 5 pilar & kuis
    ├── services/
    │   └── geminiService.ts  # Layanan komunikasi Gemini API & SSE stream
    └── components/
        ├── Navbar.tsx            # Header navigasi, search, theme switcher
        ├── ModuleList.tsx        # Katalog modul dengan filter & search
        ├── ModuleDetail.tsx      # Tampilan baca modul, kuis & breadcrumbs
        ├── CodeBlock.tsx         # Syntax highlighter & tombol salin kode
        ├── MarkdownRenderer.tsx  # Parser teks markdown & blok kode
        ├── ChatTutor.tsx         # Halaman obrolan interaktif AI Tutor
        ├── QuizView.tsx          # Evaluasi kuis lintas kategori
        ├── ProgressDashboard.tsx # Dasbor metrik belajar & bookmark
        └── Footer.tsx            # Footer aplikasi
```

---

## 💻 Panduan Instalasi Lokal

### 1. Prasyarat Sistem
- **Node.js** versi 18.0 atau yang lebih baru.
- **npm** (atau pnpm / yarn).

### 2. Kloning & Pemasangan Dependensi
```bash
# Kloning repositori (atau unduh zip)
git clone https://github.com/SyahdanDafiqa/Project-Aplikasi-Web-Kecerdasan-Buatan.git

# Masuk ke direktori proyek
cd Project-Aplikasi-Web-Kecerdasan-Buatan

# Pasang semua paket dependensi
npm install
```
> **Catatan**: File `.npmrc` dengan `legacy-peer-deps=true` dan `vercel.json` sudah disediakan untuk memastikan instalasi dan build di Vercel maupun lokal berjalan mulus tanpa konflik peer-dependency.

### 3. Konfigurasi File Lingkungan (`.env`)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan masukkan API Key Gemini Anda:
```env
# Dapatkan API Key gratis di Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY="AIzaSy..."

# (Opsional) Port backend lokal (default: 3000)
PORT=3000
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## ☁️ Langkah-Langkah Deploy ke Vercel

Aplikasi ini dapat di-deploy dengan mudah ke platform **Vercel**:

### Metode 1: Melalui Vercel Dashboard (Rekomendasi)
1. Push kode Anda ke repositori **GitHub** (pastikan file `.env` tidak ter-push berkat `.gitignore`).
2. Masuk ke [Vercel Dashboard](https://vercel.com/) dan klik **"Add New..." > "Project"**.
3. Pilih repositori GitHub Anda dan klik **Import**.
4. Pada bagian **Build and Output Settings**:
   - **Framework Preset**: Pilih `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Buka tab **Environment Variables**:
   - Tambahkan key `GEMINI_API_KEY` dengan value API Key Anda.
   - Tambahkan juga `VITE_GEMINI_API_KEY` jika Anda ingin mengizinkan fallback client-side.
6. Klik tombol **Deploy**. Vercel akan otomatis membangun dan merilis URL produksi aplikasi Anda!

### Metode 2: Menggunakan Vercel CLI
```bash
# Pasang Vercel CLI secara global jika belum ada
npm install -g vercel

# Login dan jalankan perintah deploy
vercel

# Ikuti instruksi di terminal, lalu tambahkan environment variable:
vercel env add GEMINI_API_KEY production
```

---

## 🛡️ Keamanan & Lisensi

- Berkas `.gitignore` sudah dikonfigurasi untuk mengecualikan `node_modules/` dan berkas `.env*` guna memastikan API Key dan kredensial sensitif tidak bocor ke publik.
- Seluruh panggilan API Gemini dijalankan secara aman melalui server backend proxy.
- Dirilis di bawah lisensi Apache 2.0 / MIT.
