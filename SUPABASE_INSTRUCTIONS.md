# 🚀 INTEGRITY POST — Setup Supabase untuk Realtime Sync

## 🎯 Masalah yang Diperbaiki

Sebelumnya:
- ❌ Berita hanya tersimpan di localStorage browser admin
- ❌ User/device lain tidak melihat perubahan
- ❌ JSONBin terbatas 100KB
- ❌ Tidak ada realtime sync

Sekarang:
- ✅ Semua berita/sidebar tersimpan di **Supabase PostgreSQL** (cloud)
- ✅ **Realtime sync** via WebSocket — semua device lihat perubahan LANGSUNG
- ✅ Kapasitas unlimited (25GB free)
- ✅ Gambar tetap di Cloudinary (cepat, HD)

---

## 📋 LANGKAH 1: Jalankan SQL di Supabase

1. Buka https://supabase.com → login → pilih project Anda
2. Klik menu **"SQL Editor"** di sidebar kiri
3. Klik **"New query"**
4. **Copy seluruh isi** file `SUPABASE_SETUP.sql` di project ini
5. **Paste** di SQL Editor
6. Klik **"Run"** (Ctrl+Enter)
7. Tunggu selesai (~5 detik)

**Yang akan dibuat:**
- ✅ Tabel `articles` (untuk berita)
- ✅ Tabel `sidebars` (untuk sidebar)
- ✅ Realtime subscription (WebSocket)
- ✅ RLS policies (public read/write)
- ✅ 14 berita seed + 8 sidebar seed

**Cara cek berhasil:**
- Klik menu **"Table Editor"** di sidebar kiri
- Harus ada tabel `articles` dan `sidebars`
- Klik `articles` → harus ada 14 row

---

## 📋 LANGKAH 2: Pastikan Environment Variables di Vercel

Berdasarkan screenshot Anda, **sudah benar!** Yang perlu ada di Vercel Settings → Environments:

| Variable | Nilai | Status Anda |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | URL Supabase (https://xxxxx.supabase.co) | ✅ Ada |
| `VITE_SUPABASE_ANON_KEY` | Anon key dari Supabase | ✅ Ada |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Ada |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary preset (unsigned) | ✅ Ada |

**Cara dapat Supabase credentials (jika belum):**
1. Buka Supabase → Settings → API
2. Copy **Project URL** → paste ke `VITE_SUPABASE_URL`
3. Copy **anon public key** → paste ke `VITE_SUPABASE_ANON_KEY`

---

## 📋 LANGKAH 3: Redeploy di Vercel

Setelah SQL dijalankan dan env vars diset:

1. Buka https://vercel.com → pilih project Anda
2. Klik **"Deployments"** di sidebar kiri
3. Klik **"Redeploy"** di deployment terakhir
4. Tunggu build selesai (~2-3 menit)

Atau push ke GitHub (jika pakai Git):
```bash
git add .
git commit -m "Migrate to Supabase for realtime sync"
git push
```

---

## 🧪 LANGKAH 4: Test Realtime Sync

### Test 1: Buka di 2 browser berbeda
1. Buka `https://integritypost.id` di **Chrome**
2. Buka `https://integritypost.id` di **HP** atau browser lain
3. Buka Developer Console (F12) di keduanya
4. Harus muncul:
   ```
   [Supabase] ✅ Client initialized
   [Realtime] ✅ WebSocket connected
   ```

### Test 2: Admin upload berita
1. Login admin di Chrome
2. Buat berita baru → klik Publish
3. **Dalam 1-2 detik**, berita muncul di HP **TANPA refresh**!

### Test 3: Admin edit sidebar
1. Di Chrome admin, ubah gambar sidebar
2. **Dalam 1-2 detik**, sidebar berubah di HP **TANPA refresh**!

### Test 4: Admin hapus berita
1. Di Chrome admin, hapus berita
2. **Dalam 1-2 detik**, berita hilang di HP **TANPA refresh**!

---

## 🔧 Troubleshooting

### Error: "Supabase belum dikonfigurasi"
**Penyebab:** Environment variables belum terbaca di build.

**Solusi:**
1. Pastikan nama variabel **TANPA spasi** di Vercel
2. Redeploy setelah tambah variabel
3. Cek build logs untuk konfirmasi

### Error: "Failed to fetch from Supabase"
**Penyebab:** URL salah atau project belum aktif.

**Solusi:**
1. Cek `VITE_SUPABASE_URL` di Vercel — harus format: `https://xxxxx.supabase.co`
2. Cek project di Supabase masih aktif (tidak paused)

### Error: "permission denied for table articles"
**Penyebab:** RLS policies belum dibuat.

**Solusi:**
1. Buka SQL Editor di Supabase
2. Jalankan ulang file `SUPABASE_SETUP.sql`

### Realtime tidak jalan
**Penyebab:** Realtime belum diaktifkan untuk tabel.

**Solusi:**
1. Buka SQL Editor
2. Jalankan:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
   ALTER PUBLICATION supabase_realtime ADD TABLE public.sidebars;
   ```
3. Buka Supabase → Database → Replication → pastikan `articles` dan `sidebars` di-checked

### Data lama JSONBin masih muncul
**Penyebab:** Browser masih pakai cache JSONBin.

**Solusi:**
1. Clear cache browser (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+Shift+R)
3. Atau buka di incognito mode

---

## 💰 Biaya

**Supabase Free Tier:**
- ✅ 500MB database
- ✅ 5GB file storage
- ✅ 2GB bandwidth/bulan
- ✅ **Rp 0/bulan** untuk portal berita standar

**Cloudinary Free Tier:**
- ✅ 25GB storage
- ✅ 25GB bandwidth/bulan
- ✅ **Rp 0/bulan**

**Vercel Free Tier:**
- ✅ 100GB bandwidth/bulan
- ✅ Unlimited deployments
- ✅ **Rp 0/bulan**

**TOTAL: Rp 0/bulan** untuk website berita dengan traffic normal.

---

## 🎉 Selesai!

Setelah setup ini:
- ✅ Semua berita/sidebar tersimpan di Supabase (bukan localStorage)
- ✅ **Realtime sync** ke semua device via WebSocket
- ✅ Tidak perlu refresh untuk lihat update
- ✅ Kapasitas unlimited
- ✅ Gambar HD di Cloudinary

**Website Anda sekarang benar-benar fullstack dengan database cloud!** 🚀
