# BACKEND SETUP — INTEGRITY POST API

Panduan setup backend pusat agar semua pengunjung di seluruh perangkat melihat berita yang sama secara realtime.

---

## 🎯 ARSITEKTUR

```
                    ┌──────────────────────┐
                    │   JSONBin.io API     │
                    │   (Cloud Database)   │
                    │                      │
                    │   GET    /api/news   │
                    │   POST   /api/news   │
                    │   PUT    /api/news   │
                    │   DELETE /api/news   │
                    └──────────┬───────────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
            ┌─────▼─────┐ ┌────▼─────┐ ┌────▼─────┐
            │ Admin     │ │ Public   │ │ Public   │
            │ Dashboard │ │ Website  │ │ Website  │
            │ (Chrome)  │ │ (HP)     │ │ (Laptop) │
            └───────────┘ └──────────┘ └──────────┘
            
            Polling setiap 5 detik untuk sync realtime
```

---

## ⏱️ WAKTU SETUP: 5 MENIT

---

## STEP 1: Daftar JSONBin.io (GRATIS)

1. Buka **https://jsonbin.io/**
2. Klik **"Sign Up"** (gratis selamanya)
3. Daftar dengan email atau Google
4. Konfirmasi email

**Quota gratis:**
- ✅ 10,000 request/bulan (lebih dari cukup)
- ✅ Unlimited bins
- ✅ Realtime API

---

## STEP 2: Ambil Master Key

1. Setelah login, klik **profile** di kanan atas
2. Klik **"API Keys"** atau **"Account Settings"**
3. Cari **"X-Master-Key"** atau **"Master Key"**
4. Klik **"Show"** lalu **COPY** key tersebut

Contoh master key:
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOP
```

⚠️ **JANGAN SHARE KEY INI KE SIAPAPUN!**

---

## STEP 3: Buat Bin Baru

1. Di dashboard JSONBin, klik **"Create"** atau **"New Bin"**
2. Bin name: `integritypost-news`
3. Bin content: copy-paste ini:

```json
[]
```

4. Klik **"Create"**
5. Setelah dibuat, **COPY Bin ID** dari URL atau detail page

Contoh Bin ID:
```
65f1234567890abcdef12345
```

---

## STEP 4: Edit api-config.json

Buka file `public/api-config.json` di project Anda (atau langsung di GitHub):

```json
{
  "endpoint": "https://api.jsonbin.io/v3",
  "apiKey": "PASTE_MASTER_KEY_DI_SINI",
  "binId": "PASTE_BIN_ID_DI_SINI"
}
```

**GANTI:**
- `PASTE_MASTER_KEY_DI_SINI` dengan master key dari STEP 2
- `PASTE_BIN_ID_DI_SINI` dengan bin ID dari STEP 3

**Contoh hasil akhir:**
```json
{
  "endpoint": "https://api.jsonbin.io/v3",
  "apiKey": "$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOP",
  "binId": "65f1234567890abcdef12345"
}
```

---

## STEP 5: Deploy

### Jika pakai Vercel/Netlify:

1. Edit `public/api-config.json` di GitHub
2. Commit changes
3. Vercel/Netlify auto-redeploy (2 menit)

### Jika pakai server biasa (cPanel/VPS):

1. Upload file `dist/index.html` dan `dist/api-config.json` ke root domain
2. Selesai — refresh website

---

## ✅ VERIFIKASI

Buka `https://integritypost.id` → tekan **F12** → tab **Console**

Harus muncul:
```
[INTEGRITY POST] API: ☁️ TERHUBUNG (Realtime sync aktif)
```

Jika muncul orange:
```
[INTEGRITY POST] API: ⚠️ TIDAK TERHUBUNG (Mode lokal)
```

Berarti `api-config.json` belum benar — cek master key dan bin ID.

---

## 🧪 TEST REALTIME

### Test 1: Buka di 2 Browser

1. Chrome: buka `https://integritypost.id`
2. HP/Firefox: buka `https://integritypost.id`

### Test 2: Publish Berita

1. Di Chrome: login admin → publish berita baru
2. Tunggu 5 detik (polling interval)
3. Di HP/Firefox: berita baru muncul otomatis! ✅

### Test 3: Edit & Hapus

1. Edit judul berita di Chrome
2. Tunggu 5 detik
3. HP muncul judul baru ✅

1. Hapus berita di Chrome
2. Tunggu 5 detik
3. HP muncul berita hilang ✅

---

## 📊 ENDPOINT API

### GET /api/news
Ambil semua berita dari database.

**Internal call:**
```javascript
import { getAllNews } from './api/newsApi';
const articles = await getAllNews();
```

### POST /api/news
Tambah berita baru.

```javascript
import { createNews } from './api/newsApi';
await createNews({
  id: 'unique-id',
  title: 'Judul Berita',
  content: '...',
  // ... fields lainnya
});
```

### PUT /api/news/:id
Update berita yang ada.

```javascript
import { updateNews } from './api/newsApi';
await updateNews('id-berita', {
  ...articleData,
  title: 'Judul Baru',
});
```

### DELETE /api/news/:id
Hapus berita.

```javascript
import { deleteNews } from './api/newsApi';
await deleteNews('id-berita');
```

---

## 🔄 CARA KERJA REALTIME

### Polling Mechanism:
- Setiap 5 detik, semua browser yang buka website otomatis check API
- Jika ada perubahan data → langsung update UI tanpa refresh
- Bekerja di semua browser dan device

### Broadcast Channel:
- Untuk tabs di browser yang sama → instant update via BroadcastChannel API
- Tidak perlu polling untuk tabs di browser yang sama

### Local Cache:
- localStorage HANYA dipakai sebagai cache offline
- Saat online, **selalu** ambil data dari API
- Saat offline, tampilkan cache terakhir

---

## 💰 BIAYA

**JSONBin.io Free Tier:**
- ✅ 10,000 requests/bulan
- ✅ Unlimited bins
- ✅ Unlimited storage (per bin max 1 MB)

**Estimasi pemakaian:**
- 1 pengunjung = ~12 request/menit (polling) = 720/jam
- 100 pengunjung simultan = ~72,000/jam

**Jika trafik tinggi**, upgrade ke paid plan ($5/bulan untuk 100K requests).

**Alternatif gratis tanpa limit:**
- Firebase Firestore (gratis 50K reads/hari)
- Supabase (gratis 500MB DB + unlimited reads)
- MongoDB Atlas (gratis 512MB)

Lihat `ALTERNATIVE_BACKENDS.md` untuk migrasi.

---

## 🔒 KEAMANAN

### Saat ini (Default):
- Master key tersimpan di `api-config.json` (terlihat di browser)
- Cocok untuk testing dan website kecil
- Siapa saja bisa baca data (publik), tapi butuh master key untuk tulis

### Untuk Production (Recommended):

1. **Gunakan Access Key terpisah:**
   - JSONBin support access keys dengan permissions berbeda
   - Buat "Read-only Key" untuk public website
   - Master key hanya untuk admin

2. **Buat proxy backend:**
   - Setup Cloudflare Worker atau Vercel Function
   - Hide master key di server-side
   - Frontend hanya akses via proxy

3. **Migrasi ke Firebase:**
   - Pakai Firestore Security Rules
   - Authentication required untuk write
   - Lihat panduan di `DEPLOY.md`

---

## 🐛 TROUBLESHOOTING

### ❌ "API: TIDAK TERHUBUNG"

**Penyebab:** Config belum benar.

**Solusi:**
1. Buka `https://integritypost.id/api-config.json` di browser
2. Cek isi file — pastikan `apiKey` dan `binId` terisi
3. Jika kosong, edit ulang di GitHub dan redeploy

### ❌ Error 401 di console

**Penyebab:** Master key salah.

**Solusi:**
- Cek master key di JSONBin dashboard
- Pastikan tidak ada spasi atau karakter ekstra
- Copy ulang dan paste

### ❌ Error 404

**Penyebab:** Bin ID salah atau bin dihapus.

**Solusi:**
- Cek bin masih ada di JSONBin dashboard
- Copy ulang bin ID
- Pastikan tidak ada typo

### ❌ Berita tidak update di browser lain

**Penyebab:** Polling belum jalan atau lambat.

**Solusi:**
- Tunggu 5-10 detik (polling interval)
- Refresh manual untuk memastikan
- Cek browser console untuk error

---

## 🔄 MIGRASI DATA

Jika sudah punya berita di localStorage dan mau pindah ke API:

```javascript
// Run di browser console
const cache = JSON.parse(localStorage.getItem('integrity_news_cache') || '{}');
const articles = cache.data || [];

// Copy hasil console.log dan paste manual ke JSONBin
console.log(JSON.stringify(articles, null, 2));
```

Lalu di JSONBin dashboard:
1. Buka bin Anda
2. Edit content
3. Paste data
4. Save

---

## 📞 SUPPORT

Jika ada masalah:
1. Cek browser console (F12) untuk error
2. Cek JSONBin dashboard untuk monitoring
3. Email: integrity.post@yahoo.com

---

**SELAMAT!** Backend pusat sudah aktif. 🎉

Semua pengunjung di seluruh perangkat sekarang melihat berita yang sama secara realtime. Setiap update admin langsung tersebar tanpa perlu refresh.
