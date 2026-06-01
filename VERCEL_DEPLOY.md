# DEPLOY INTEGRITY POST KE VERCEL — SIAP PAKAI

Website Anda sudah online di **integritypost.id** via Vercel. Saat ini masih pakai localStorage (per-device). Panduan ini akan mengubahnya jadi **realtime cloud database** agar semua pengunjung lihat data yang sama.

---

## 🎯 HASIL AKHIR

Setelah selesai:
✅ Admin publish berita → **LANGSUNG** muncul di semua HP/komputer pengunjung
✅ Admin edit berita → **LANGSUNG** update di semua perangkat
✅ Admin hapus berita → **LANGSUNG** hilang dari semua perangkat
✅ **TIDAK PERLU** reload/refresh halaman

---

## ️ WAKTU SETUP: 20 MENIT

---

## LANGKAH 1: SETUP FIREBASE (10 MENIT)

### 1.1 Buka Firebase Console
```
https://console.firebase.google.com/
```

Login dengan Google account Anda.

### 1.2 Buat Project Baru
- Klik **"Add project"** (warna biru)
- Nama project: `integritypost`
- **NONAKTIFKAN** Google Analytics (opsional, biar cepat)
- Klik **"Create project"** → tunggu 30 detik

### 1.3 Buat Database Firestore
- Menu kiri → klik **"Build"** → **"Firestore Database"**
- Klik tombol **"Create database"** (biru)
- Pilih **"Start in test mode"** → Next
- Location: pilih **`asia-southeast1`** (Singapore — terdekat ke Indonesia)
- Klik **"Enable"** → tunggu 1 menit

### 1.4 Tambah Web App
- Klik icon **⚙️ Settings** (roda gigi) di menu kiri → **"Project settings"**
- Scroll ke bawah ketemu **"Your apps"**
- Klik icon **`</>`** (Web) — yang lingkaran dengan tanda kurung siku
- App nickname: `Integrity Post Web`
- **JANGAN** centang "Also set up Firebase Hosting"
- Klik **"Register app"**

### 1.5 COPY Konfigurasi
Anda akan lihat kode seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",
  authDomain: "integritypost.firebaseapp.com",
  projectId: "integritypost",
  storageBucket: "integritypost.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**COPY SEMUA** nilai di dalam kurung kurawal. Nanti dipakai di Langkah 3.

---

## LANGKAH 2: PUSH KE GITHUB (5 MENIT)

Karena Anda pakai Vercel, cara paling mudah adalah push project ke GitHub lalu Vercel auto-deploy.

### 2.1 Buat Repository di GitHub
```
https://github.com/new
```
- Nama: `integritypost`
- **Public** atau **Private** (bebas)
- Klik **"Create repository"**

### 2.2 Push Project dari Komputer
Buka terminal di folder project:

```bash
git init
git add .
git commit -m "Initial commit - Integrity Post with Firebase realtime"
git branch -M main
git remote add origin https://github.com/USERNAME/integritypost.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.

---

## LANGKAH 3: DEPLOY DI VERCEL (3 MENIT)

### 3.1 Import Project di Vercel
```
https://vercel.com/new
```

- Klik **"Add New..."** → **"Project"**
- Pilih **"Import Git Repository"**
- Pilih repository `integritypost`
- Klik **"Import"**

### 3.2 Konfigurasi Build
Vercel akan auto-detect, tapi pastikan:
- **Framework Preset:** Vite ✅ (otomatis)
- **Build Command:** `npm run build` ✅ (otomatis)
- **Output Directory:** `dist` ✅ (otomatis)

Klik **"Deploy"** → tunggu 2-3 menit.

### 3.3 Setup Domain
Setelah deploy selesai:
- Klik **"Settings"** → **"Domains"**
- Masukkan: `integritypost.id`
- Klik **"Add"**
- Tunggu verifikasi DNS (biasanya < 5 menit)

**DNS Anda sudah benar** (saya lihat di screenshot), jadi Vercel akan otomatis verify.

---

## LANGKAH 4: KONFIGURASI FIREBASE DI SERVER (2 MENIT)

Setelah deploy Vercel selesai, website sudah online. Sekarang tinggal aktifkan Firebase.

### 4.1 Edit config.json di Vercel

Karena Anda pakai Vercel, **TIDAK BISA** edit file langsung di server seperti VPS. Tapi ada 2 cara:

**CARA A — Via GitHub (Recommended):**

1. Buka repository GitHub Anda
2. Buka file `public/config.json`
3. Klik icon **pensil** (Edit)
4. Ganti isinya dengan:

```json
{
  "firebase": {
    "enabled": true,
    "apiKey": "AIzaSyABC123...",
    "authDomain": "integritypost.firebaseapp.com",
    "projectId": "integritypost",
    "storageBucket": "integritypost.firebasestorage.app",
    "messagingSenderId": "123456789",
    "appId": "1:123456789:web:abc123"
  }
}
```

**PASTE credentials dari Langkah 1.5** (ganti semua nilai contoh dengan nilai asli Anda).

5. Scroll ke bawah → klik **"Commit changes"**
6. Vercel akan **otomatis redeploy** (tunggu 2 menit)

**CARA B — Via Vercel Dashboard (tanpa GitHub):**

Jika tidak mau pakai GitHub, Anda bisa:
1. Buka Vercel Dashboard → Project → **"Storage"** → **"Add"**
2. Atau gunakan Vercel Environment Variables (tapi ini untuk build-time, bukan runtime)

**Cara A paling mudah dan recommended.**

### 4.2 Verifikasi

Buka `https://integritypost.id` → tekan **F12** → tab **Console**.

Harus muncul teks hijau:
```
[INTEGRITY POST] Data mode: ☁️ CLOUD (Firebase Realtime)
Firebase Firestore aktif — realtime sync ON
```

Jika muncul kuning `💾 LOCAL`, berarti config.json belum benar.

---

## LANGKAH 5: SETUP FIRESTORE RULES (PENTING!)

Agar website bisa baca/tulis ke database, setup rules di Firebase:

1. Buka Firebase Console → Firestore Database
2. Klik tab **"Rules"** di atas
3. **HAPUS** semua isi yang ada, **PASTE** ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} {
      // SEMUA ORANG bisa baca (pengunjung)
      allow read: if true;
      
      // Untuk testing: semua orang bisa tulis juga
      // Nanti bisa dibatasi ke admin saja
      allow create, update, delete: if true;
    }
  }
}
```

4. Klik **"Publish"** (biru, kanan atas)

⚠️ **INI TEST MODE** — semua orang bisa tulis. Untuk production, nanti tambahkan Firebase Authentication.

---

## ✅ TEST REALTIME

### Test 1 — Buka 2 Browser
1. Buka `https://integritypost.id` di **Chrome**
2. Buka `https://integritypost.id` di **Firefox** atau HP
3. Kedua browser harus tampil halaman yang sama

### Test 2 — Publish Berita dari Admin
1. Di Chrome: buka `https://integritypost.id/admin/login`
2. Login: `integrity.post@yahoo.com` / `IntegPosT#2507*`
3. Buat berita baru → klik **"Publish"**

### Test 3 — Lihat di Browser Lain
- Lihat Firefox/HP → **BERITA BARU LANGSUNG MUNCUL** tanpa refresh! ✅

### Test 4 — Edit/Hapus
- Edit judul berita di Chrome → Firefox langsung update ✅
- Hapus berita di Chrome → Firefox langsung hilang ✅

---

##  LIHAT DATA DI FIREBASE

1. Firebase Console → Firestore Database → tab **"Data"**
2. Anda akan lihat collection **"articles"** dengan semua berita
3. Setiap kali admin publish, data masuk ke sini secara realtime

---

## 🔧 TROUBLESHOOTING

### ❌ Console muncul "💾 LOCAL (per-device)"

**Penyebab:** config.json belum benar atau Firebase belum aktif.

**Solusi:**
1. Buka `https://integritypost.id/config.json` di browser
2. Harus tampil JSON dengan `"enabled": true`
3. Jika `"enabled": false` atau error, berarti file belum ter-update
4. Cek GitHub → pastikan sudah di-commit dan Vercel sudah redeploy

### ❌ Console error "permission-denied"

**Penyebab:** Firestore Rules belum di-setup.

**Solusi:**
- Ikuti Langkah 5 di atas
- Pastikan Rules sudah di-publish

### ❌ Vercel deploy gagal

**Penyebab:** Biasanya karena dependency atau build error.

**Solusi:**
- Buka Vercel Dashboard → Deployments → klik deployment gagal
- Lihat logs di bagian "Build Logs"
- Biasanya karena TypeScript error atau dependency hilang

### ❌ Website blank setelah deploy

**Penyebab:** Mungkin ada error di code.

**Solusi:**
- Buka browser console (F12)
- Lihat error message
- Biasanya karena Firebase config salah format

---

## 💡 CARA UPDATE CONFIG DI MASA DEPAN

Jika nanti mau ganti Firebase project atau update API key:

1. Edit file `public/config.json` di GitHub
2. Commit changes
3. Vercel auto-redeploy (2 menit)
4. Refresh browser → config baru aktif

**TIDAK PERLU** build ulang dari komputer.

---

## 💰 BIAYA

**Firebase Firestore Free Tier:**
- ✅ 50,000 reads/hari (~5,000 pengunjung)
- ✅ 20,000 writes/hari
- ✅ 1 GB storage
- ✅ **Rp 0 / bulan** untuk website standar

**Vercel Free Tier:**
- ✅ 100 GB bandwidth/bulan
- ✅ Unlimited deployments
- ✅ **Rp 0 / bulan**

**TOTAL: Rp 0/bulan** untuk website berita dengan trafik normal.

---

## 📞 BUTUH BANTUAN?

Jika stuck di langkah manapun:
1. Screenshot error di browser console (F12)
2. Screenshot Vercel deployment logs
3. Kirim ke email: integrity.post@yahoo.com

Atau baca dokumentasi lengkap di file `DEPLOY.md`.

---

**SELAMAT!** Website Anda sekarang punya database cloud realtime. 🎉

Setiap kali admin update berita, **SELURUH PENGUNJUNG** di seluruh Indonesia yang buka integritypost.id akan langsung lihat update tersebut — tanpa perlu refresh halaman.
