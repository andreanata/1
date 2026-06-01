# QUICK START — Deploy ke integritypost.id

## MASALAH & SOLUSI

**MASALAH:** Update berita admin hanya muncul di browser admin, tidak ke pengunjung lain.

**SOLUSI:** Website sekarang pakai Firebase Firestore (database cloud). Semua pengunjung baca dari database yang sama, update realtime.

---

## 3 LANGKAH DEPLOY

### LANGKAH 1: Build

```bash
npm run build
```

Hasilnya di folder `dist/`:
- `index.html` (983 KB)
- `config.json`

### LANGKAH 2: Setup Firebase (15 menit)

1. Buka https://console.firebase.google.com/
2. Buat project baru: `integritypost`
3. Aktifkan Firestore Database (pilih `asia-southeast1`)
4. Copy konfigurasi dari Project Settings → Your apps → Web

Contoh config:
```json
{
  "apiKey": "AIzaSy...",
  "authDomain": "integritypost.firebaseapp.com",
  "projectId": "integritypost",
  "storageBucket": "integritypost.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:..."
}
```

### LANGKAH 3: Upload & Edit config.json

Upload `dist/index.html` dan `dist/config.json` ke root domain.

Edit `config.json` di server:

```json
{
  "firebase": {
    "enabled": true,
    "apiKey": "AIzaSy...",
    "authDomain": "integritypost.firebaseapp.com",
    "projectId": "integritypost",
    "storageBucket": "integritypost.appspot.com",
    "messagingSenderId": "123456789012",
    "appId": "1:123456789012:web:..."
  }
}
```

**Selesai!** Buka `https://integritypost.id`, cek console (F12), harus muncul:
```
☁️ CLOUD (Firebase Realtime)
```

---

## TEST

1. Buka `integritypost.id` di 2 browser berbeda
2. Login admin di browser 1, buat berita baru
3. Browser 2 langsung muncul berita baru tanpa refresh ✅

---

## DETAIL LENGKAP

Baca file `DEPLOY.md` untuk panduan lengkap termasuk troubleshooting.

---

## BIAYA

Firebase Firestore **GRATIS** untuk < 50,000 reads/hari (cukup untuk portal berita standar).
