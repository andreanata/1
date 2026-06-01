# PERUBAHAN TEKNIS — Realtime Database Integration

## RINGKASAN PERUBAHAN

Website IntegrityPost.id sekarang menggunakan **Firebase Firestore** sebagai database pusat untuk menyimpan berita. Ini memungkinkan semua pengunjung melihat data yang sama secara realtime tanpa perlu refresh halaman.

---

## FILE YANG DIBUAT/DIUBAH

### File Baru:
1. `src/firebase.ts` — Inisialisasi Firebase dengan konfigurasi runtime dari `/config.json`
2. `public/config.json` — File konfigurasi Firebase yang bisa diedit tanpa rebuild
3. `DEPLOY.md` — Panduan deploy lengkap
4. `QUICKSTART.md` — Panduan cepat 3 langkah

### File yang Diubah:
1. `src/services/databaseClient.ts` — Integrasi dengan Firebase Firestore
2. `src/store/articleStore.ts` — Cloud-first architecture dengan fallback ke localStorage
3. `src/App.tsx` — Inisialisasi Firebase saat aplikasi dimuat

---

## CARA KERJA

### SEBELUM:
```
Admin Browser → localStorage → Hanya admin yang lihat update
Pengunjung Browser → localStorage → Data lama/tidak sinkron
```

### SESUDAH:
```
Admin Browser → Firebase Firestore (Cloud) → Realtime sync
                                      ↓
Pengunjung Browser ← Firebase Firestore (Cloud) ← Realtime sync
```

### ALUR DATA:

1. **Admin publish berita:**
   - Admin buat berita di dashboard admin
   - Berita disimpan ke Firebase Firestore
   - Semua browser yang subscribe mendapat notifikasi realtime
   - UI semua pengunjung otomatis update

2. **Pengunjung buka website:**
   - Website load `config.json` untuk dapat credentials Firebase
   - Initialize Firebase Firestore
   - Subscribe ke collection `articles`
   - Terima data realtime, tampilkan di UI

3. **Jika Firebase tidak dikonfigurasi:**
   - Website otomatis fallback ke localStorage (mode lama)
   - Tetap berfungsi, tapi tidak realtime antar device

---

## KEUNGGULAN

✅ **Realtime sync** — Update langsung ke semua pengunjung tanpa refresh
✅ **Cloud database** — Data tersimpan di cloud, tidak hilang jika browser di-clear
✅ **Scalable** — Mendukung ribuan concurrent users
✅ **Reliable** — Firebase uptime 99.95%
✅ **Cost-effective** — Free tier cukup untuk portal berita standar
✅ **Easy deploy** — Hanya perlu edit `config.json`, tidak perlu rebuild
✅ **Fallback mode** — Tetap berfungsi dengan localStorage jika Firebase down

---

## KONFIGURASI

### File: `public/config.json`

File ini diload saat runtime (bukan build-time), jadi Anda bisa edit di server tanpa rebuild.

```json
{
  "firebase": {
    "enabled": false,  // Set true untuk aktifkan realtime
    "apiKey": "...",
    "authDomain": "...",
    "projectId": "...",
    "storageBucket": "...",
    "messagingSenderId": "...",
    "appId": "..."
  }
}
```

### Cara edit tanpa rebuild:

1. SSH ke server atau via FTP
2. Edit `/var/www/integritypost.id/config.json`
3. Ubah `"enabled": true` dan isi credentials Firebase
4. Save file
5. Refresh browser — config baru langsung diload

---

## DEPENDENCIES YANG DITAMBAH

```json
{
  "firebase": "^11.0.0"
}
```

Ukuran bundle bertambah ~100 KB (gzip) karena Firebase SDK.

---

## SECURITY

### Firestore Rules (Production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{articleId} {
      // Semua orang bisa baca
      allow read: if true;
      
      // Hanya authenticated users bisa tulis
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

### Best Practices:
- JANGAN commit `config.json` dengan credentials ke Git
- Tambahkan ke `.gitignore`
- Gunakan Firebase Authentication untuk admin login
- Monitor usage di Firebase Console

---

## PERFORMANCE

### Load Time:
- First load: ~2 detik (tergantung koneksi ke Firebase)
- Subsequent loads: < 1 detik (cache browser)

### Realtime Latency:
- Admin publish → Pengunjung lihat: < 500ms (typical)

### Bandwidth:
- Firebase SDK: ~100 KB (gzip)
- Data per article: ~2-5 KB
- Realtime subscription: minimal overhead

---

## MONITORING

### Browser Console:

Saat website load, akan muncul log:

```
[INTEGRITY POST] Data mode: ☁️ CLOUD (Firebase Realtime)
Firebase Firestore aktif — realtime sync ON
```

Atau jika Firebase tidak aktif:

```
[INTEGRITY POST] Data mode: 💾 LOCAL (per-device)
Firebase tidak aktif — menggunakan localStorage (mode lokal)
```

### Firebase Console:

- **Firestore → Data:** Lihat semua artikel
- **Firestore → Usage:** Monitor read/write operations
- **Authentication → Users:** Lihat admin yang login (jika pakai auth)

---

## ROLLBACK

Jika ingin kembali ke mode lama (localStorage only):

Edit `config.json`:
```json
{
  "firebase": {
    "enabled": false
  }
}
```

Website akan kembali pakai localStorage seperti sebelumnya.

---

## TROUBLESHOOTING

### Masalah: "LOCAL (per-device)" muncul di console

**Penyebab:** Firebase belum dikonfigurasi atau config.json salah.

**Solusi:**
1. Cek `config.json` sudah `"enabled": true`
2. Cek semua field terisi dengan benar
3. Cek browser console untuk error detail

### Masalah: Berita tidak muncul realtime

**Penyebab:** Firestore Rules terlalu ketat atau koneksi ke Firebase gagal.

**Solusi:**
1. Cek Firestore Rules di Firebase Console
2. Pastikan ada `allow read: if true;`
3. Cek network tab di browser console

### Masalah: Slow loading

**Penyebab:** Firebase server di luar Indonesia atau koneksi lambat.

**Solusi:**
- Tidak banyak yang bisa dilakukan, tapi biasanya < 2 detik
- Pertimbangkan CDN untuk static assets

---

## MIGRASI DARI LOCALSTORAGE

Jika Anda sudah punya data di localStorage dan ingin migrate ke Firebase:

1. Buka browser console di website yang sudah ada
2. Jalankan script ini untuk export data:

```javascript
const data = localStorage.getItem('integrity_articles_local_cache');
const articles = JSON.parse(data);
console.log(JSON.stringify(articles, null, 2));
```

3. Copy output JSON
4. Import ke Firebase Firestore via console atau script

Atau lebih mudah: **Mulai dari kosong**, biarkan admin input ulang berita (jika tidak banyak).

---

## SUPPORT

Untuk bantuan teknis:
- Email: integrity.post@yahoo.com
- Dokumentasi lengkap: `DEPLOY.md`
- Quick start: `QUICKSTART.md`

---

**Terakhir diupdate:** Mei 2026
**Versi:** 1.0.0
**Firebase Version:** 11.x
