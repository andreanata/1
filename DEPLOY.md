# CARA DEPLOY KE SERVER INTEGRITYPOST.ID

## MASALAH YANG DIPERBAIKI

Sebelumnya, setiap browser menyimpan berita di localStorage sendiri-sendiri.
Makanya update admin hanya muncul di browser admin, tidak ke pengunjung lain.

**SEKARANG:** Website menggunakan Firebase Firestore sebagai database cloud pusat.
Semua pengunjung membaca dari database yang sama, update realtime tanpa refresh.

---

## LANGKAH 1: BUILD PROJECT

Di komputer development:

```bash
npm run build
```

Hasilnya di folder `dist/`:
- `index.html` (983 KB) — file utama website
- `config.json` — file konfigurasi Firebase (PENTING!)

---

## LANGKAH 2: UPLOAD KE SERVER

Upload 2 file ini ke root domain `integritypost.id`:

```
/var/www/integritypost.id/index.html
/var/www/integritypost.id/config.json
```

Atau via FTP/cPanel, upload ke folder `public_html/` atau `www/`.

---

## LANGKAH 3: SETUP FIREBASE

### 3.1 Buat Project Firebase

1. Buka https://console.firebase.google.com/
2. Klik "Add project"
3. Masukkan nama: `integritypost`
4. Ikuti wizard sampai selesai

### 3.2 Aktifkan Firestore Database

1. Di menu kiri, klik "Firestore Database"
2. Klik "Create database"
3. Pilih "Start in test mode" (untuk development)
4. Pilih lokasi: `asia-southeast1` (Jakarta/Singapore)
5. Klik "Enable"

### 3.3 Dapatkan Konfigurasi

1. Klik ikon ⚙️ (Settings) di menu kiri
2. Pilih "Project settings"
3. Scroll ke "Your apps"
4. Klik ikon `</>` (Web)
5. Masukkan nama app: `Integrity Post Web`
6. **COPY konfigurasi yang muncul** (seperti ini):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "integritypost.firebaseapp.com",
  projectId: "integritypost",
  storageBucket: "integritypost.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## LANGKAH 4: EDIT CONFIG.JSON DI SERVER

Di server, buka file `config.json`:

```bash
nano /var/www/integritypost.id/config.json
```

Ganti isi dengan (SESUAIKAN dengan config dari Firebase):

```json
{
  "firebase": {
    "enabled": true,
    "apiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "authDomain": "integritypost.firebaseapp.com",
    "projectId": "integritypost",
    "storageBucket": "integritypost.appspot.com",
    "messagingSenderId": "123456789012",
    "appId": "1:123456789012:web:abcdef1234567890"
  }
}
```

**PENTING:**
- `"enabled": true` — WAJIB, kalau false akan pakai localStorage (mode lama)
- Copy persis dari Firebase Console, jangan ada yang salah ketik

Simpan file (Ctrl+O, Enter, Ctrl+X di nano).

---

## LANGKAH 5: SETUP FIRESTORE RULES

Di Firebase Console → Firestore Database → Rules, paste ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Articles - semua orang bisa baca, hanya authenticated bisa tulis
    match /articles/{articleId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

Klik "Publish".

**UNTUK PRODUCTION:** Anda perlu setup Firebase Authentication agar hanya admin yang bisa login dan tulis data. Untuk sekarang, test mode sudah cukup.

---

## LANGKAH 6: TEST

### 6.1 Buka Browser

Buka `https://integritypost.id` di browser.

Tekan F12 (Developer Tools) → tab Console.

Anda harus lihat:

```
[INTEGRITY POST] Data mode: ☁️ CLOUD (Firebase Realtime)
Firebase Firestore aktif — realtime sync ON
```

Jika muncul `💾 LOCAL (per-device)`, berarti config.json belum benar.

### 6.2 Test Realtime Sync

**Tab 1 (Admin):** Buka `https://integritypost.id/admin/login`
- Login dengan email: `integrity.post@yahoo.com`
- Password: `IntegPosT#2507*`
- Buat berita baru, publish

**Tab 2 (Pengunjung):** Buka `https://integritypost.id/` di browser lain atau HP

**HASIL:** Berita baru langsung muncul di Tab 2 tanpa refresh! ✅

### 6.3 Test Update & Delete

- Edit berita di admin → langsung update di semua browser
- Hapus berita di admin → langsung hilang di semua browser

---

## TROUBLESHOOTING

### Masalah: Masih muncul "LOCAL (per-device)"

**Penyebab:** config.json belum benar atau Firebase belum aktif.

**Solusi:**
1. Cek `config.json` sudah `"enabled": true`
2. Cek semua field terisi dengan benar
3. Buka browser console (F12), lihat error message
4. Pastikan project Firebase sudah dibuat dan Firestore aktif

### Masalah: Berita tidak muncul di database

**Penyebab:** Firestore Rules terlalu ketat.

**Solusi:**
1. Buka Firebase Console → Firestore → Rules
2. Pastikan ada `allow create: if true;` untuk testing
3. Atau setup Authentication untuk production

### Masalah: CORS error

**Penyebab:** Domain belum diwhitelist di Firebase.

**Solusi:**
1. Firebase Console → Authentication → Settings → Authorized domains
2. Tambahkan `integritypost.id`
3. Firebase Console → Firestore → Settings → Allowed origins
4. Tambahkan `https://integritypost.id`

### Masalah: Slow loading

**Penyebab:** Firebase server di luar Indonesia.

**Solusi:** Tidak banyak yang bisa dilakukan, tapi biasanya < 1 detik untuk first load.

---

## CARA UPDATE TANPA REBUILD

Jika Anda ingin update konfigurasi Firebase (misal ganti project, atau update API key):

**TIDAK PERLU rebuild!** Cukup:

1. SSH ke server atau via FTP
2. Edit file `/var/www/integritypost.id/config.json`
3. Ganti nilai yang perlu
4. Save
5. Refresh browser — config baru akan diload otomatis

---

## BACKUP & ROLLBACK

### Backup

File penting:
- `index.html` — backup ke tempat aman
- `config.json` — backup credentials Firebase

### Rollback ke mode lokal

Jika Firebase ada masalah dan Anda ingin kembali ke mode lama (per-device):

Edit `config.json`, ubah:
```json
"enabled": false
```

Website akan kembali pakai localStorage seperti sebelumnya.

---

## MONITORING

### Cek apakah Firebase aktif:

Buka browser console, harus muncul:
```
Firebase Firestore aktif — realtime sync ON
```

### Cek data di database:

Firebase Console → Firestore Database → Data

Anda akan lihat collection `articles` dengan semua berita.

### Cek realtime updates:

Firebase Console → Firestore Database → Usage

Grafik akan menunjukkan read/write operations saat ada yang buka website atau admin update berita.

---

## BIAYA FIREBASE

Firebase Firestore punya free tier yang cukup besar:
- 50,000 reads/hari
- 20,000 writes/hari
- 1 GB storage

Untuk portal berita dengan < 10,000 pengunjung/hari, **GRATIS**.

Jika traffic tinggi, biaya sekitar $0.06 per 100,000 reads.

---

## PERTANYAAN UMUM

### Q: Apakah harus rebuild setiap kali ada berita baru?
**A:** TIDAK. Hanya rebuild jika ada perubahan kode/komponen. Berita baru langsung ke database, tidak perlu rebuild.

### Q: Apakah pengunjung perlu reload halaman?
**A:** TIDAK. Realtime subscription otomatis update UI saat ada perubahan di database.

### Q: Apakah aman?
**A:** Ya, dengan Firestore Rules yang benar, hanya admin yang bisa tulis data. Pengunjung hanya bisa baca.

### Q: Berapa lama setup?
**A:** 15-30 menit jika sudah familiar dengan Firebase. Pertama kali mungkin 1 jam.

---

## SUPPORT

Jika ada masalah:
1. Cek browser console (F12) untuk error message
2. Cek Firebase Console untuk logs
3. Pastikan config.json sudah benar
4. Pastikan Firestore Rules sudah benar

**Email:** integrity.post@yahoo.com

---

**Terakhir diupdate:** Mei 2026
**Versi:** 1.0.0
