# INTEGRITY POST — Server-Sent Events (SSE) Integration Package

Paket ini berisi 5 file yang perlu di-copy ke server PHP `integritypost.id` untuk mengaktifkan realtime update tanpa mengubah tampilan website.

## Struktur File

```
sse-integration/
├── README.md                 ← (file ini)
├── schema.sql                ← Script pembuatan tabel sse_events
├── nginx-config.conf         ← Blok location untuk Nginx
├── includes/
│   └── sse-config.php        ← Konfigurasi database & token
├── sse/
│   ├── news-stream.php       ← SSE endpoint (dibaca browser)
│   └── notify.php            ← API endpoint (dipanggil admin)
├── admin/
│   └── publish-hook.php      ← Fungsi helper untuk dipanggil saat publish
└── assets/
    └── js/
        └── live-news.js      ← JavaScript untuk halaman publik
```

## Cara Pasang di Server PHP

### Langkah 1 — Upload File

Salin isi folder ke root website (`/var/www/integritypost.id/` atau `public_html/`):

```
/var/www/integritypost.id/
├── includes/
│   └── sse-config.php        (sudah ada di project Anda)
├── sse/
│   ├── news-stream.php       (Buat folder baru jika belum ada)
│   └── notify.php
├── admin/
│   └── publish-hook.php
├── assets/
│   └── js/
│       └── live-news.js
└── schema.sql                (opsional, untuk dijalankan manual)
```

### Langkah 2 — Jalankan SQL

Jalankan file `schema.sql` di database Anda untuk membuat tabel `sse_events`.

### Langkah 3 — Edit Konfigurasi

Buka `includes/sse-config.php`, sesuaikan:
- `$dbHost`, `$dbUser`, `$dbPass`, `$dbName` → sesuai database Anda
- `$SSE_BEARER_TOKEN` → ganti dengan token acak panjang
- `$SSE_CHECK_INTERVAL` → 3 detik (default)
- `$SSE_HEARTBEAT_INTERVAL` → 15 detik (default)

### Langkah 4 — Edit Nginx

Tambahkan blok location dari `nginx-config.conf` ke config Nginx domain Anda, reload Nginx.

### Langkah 5 — Integrasi ke Halaman Publik

Tambahkan 1 baris ini tepat sebelum `</body>` di template utama website Anda:

```html
<script src="/assets/js/live-news.js" defer></script>
```

### Langkah 6 — Integrasi ke Script Admin

Di file PHP admin yang menangani simpan berita, tambahkan setelah INSERT berhasil:

```php
require_once dirname(__DIR__) . '/admin/publish-hook.php';
notify_sse_new_post([
    'post_id'    => $id_berita,
    'title'      => $judul_berita,
    'slug'       => $slug_berita,
    'category'   => $nama_kategori,
    'image'      => $url_thumbnail,
    'excerpt'    => $ringkasan,
    'author'     => $nama_penulis,
    'event_type' => 'new_post',
]);
```

### Langkah 7 — Test

Buka 3 browser berbeda, jalankan curl dari terminal server untuk kirim event. Lihat panduan test di bawah.

## Test

```bash
curl -X POST https://integritypost.id/sse/notify.php \
  -H "Authorization: Bearer GANTI_DENGAN_TOKEN_ANDA" \
  -H "Content-Type: application/json" \
  -d '{"post_id":1,"title":"Test Berita","slug":"test",
       "category":"Test","image":"","excerpt":"Test","author":"Admin"}'
```

Semua browser yang terbuka di `integritypost.id` harus menampilkan toast notifikasi dalam 3-5 detik.
