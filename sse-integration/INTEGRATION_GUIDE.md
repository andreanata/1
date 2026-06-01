# INTEGRITY POST — Panduan Integrasi SSE (Step-by-Step)

Panduan lengkap cara memasang Server-Sent Events ke website PHP Anda **TANPA** mengubah tampilan atau kode yang sudah ada.

---

## 📋 Checklist Sebelum Mulai

- [ ] Akses SSH ke server `integritypost.id`
- [ ] Akses database MySQL/MariaDB
- [ ] Akses file Nginx config (`/etc/nginx/sites-available/`)
- [ ] Backup website (opsional tapi direkomendasikan)

---

## 🔧 Langkah 1 — Upload File SSE

Salin folder `sse-integration` ke root website Anda:

```bash
# Dari komputer lokal
scp -r sse-integration/ user@integritypost.id:/var/www/integritypost.id/

# Atau via FTP/cPanel, upload isi folder sse-integration/ ke public_html/
```

Struktur final di server:
```
/var/www/integritypost.id/
├── includes/
│   └── sse-config.php          ← Edit file ini
├── sse/
│   ├── news-stream.php
│   └── notify.php
├── admin/
│   └── publish-hook.php        ← Edit file ini
├── assets/
│   └── js/
│       └── live-news.js
├── schema.sql                  ← Untuk dijalankan manual
└── nginx-config.conf           ← Untuk Nginx
```

---

## 🔧 Langkah 2 — Edit Konfigurasi Database

Buka file `includes/sse-config.php`:

```php
// Baris 14-17: Ganti dengan credentials database Anda
$dbHost = 'localhost';
$dbUser = 'integrity_user';      // ← Ganti ini
$dbPass = 'YOUR_DATABASE_PASS';  // ← Ganti ini
$dbName = 'integritypost';       // ← Ganti ini
```

**Cara dapat credentials:**
- Lihat file `wp-config.php` (jika pakai WordPress)
- Atau tanya admin server Anda
- Atau cek `.env` file jika ada

---

## 🔧 Langkah 3 — Generate & Set Bearer Token

Token ini untuk mengamankan endpoint `/sse/notify.php`.

**Generate token acak di terminal server:**
```bash
openssl rand -hex 32
```

Copy hasil output, lalu paste ke **2 file**:

**File 1: `includes/sse-config.php` (baris 23)**
```php
$SSE_BEARER_TOKEN = 'paste_token_disini';
```

**File 2: `admin/publish-hook.php` (baris 33)**
```php
define('SSE_BEARER_TOKEN', 'paste_token_disini');
```

⚠️ **PENTING:** Token di kedua file **HARUS SAMA PERSIS**.

---

## 🔧 Langkah 4 — Jalankan SQL untuk Buat Tabel

Connect ke database dan jalankan `schema.sql`:

```bash
mysql -u integrity_user -p integritypost < /var/www/integritypost.id/schema.sql
```

Atau via phpMyAdmin:
1. Login phpMyAdmin
2. Pilih database `integritypost`
3. Klik tab "SQL"
4. Copy-paste isi file `schema.sql`
5. Klik "Go"

Verifikasi tabel sudah ada:
```sql
SHOW TABLES LIKE 'sse_events';
```

---

## 🔧 Langkah 5 — Konfigurasi Nginx

Edit file Nginx config domain Anda:

```bash
sudo nano /etc/nginx/sites-available/integritypost.id
```

**TAMBAHKAN** blok location berikut **SEBELUM** kurung tutup `}` terakhir dari blok `server { }`:

```nginx
# =============================================================
# SSE — Server-Sent Events
# =============================================================
location ~ /sse/news-stream\.php$ {
    fastcgi_pass unix:/run/php/php8.1-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_read_timeout 360s;
    fastcgi_buffering off;
    add_header X-Accel-Buffering no;
    add_header Cache-Control "no-cache";
}

location ~ /sse/notify\.php$ {
    limit_except POST { deny all; }
    fastcgi_pass unix:/run/php/php8.1-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}

location ~ ^/assets/js/live-news\.js$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

⚠️ **JANGAN** hapus atau ubah blok `location` yang sudah ada.

Reload Nginx:
```bash
sudo nginx -t              # Test config
sudo systemctl reload nginx
```

---

## 🔧 Langkah 6 — Tambahkan JavaScript ke Halaman Publik

Temukan file template utama website Anda yang digunakan di **semua halaman**. Biasanya:
- `header.php` / `footer.php`
- `index.php` (template utama)
- `theme/header.php` (jika pakai theme custom)

**TAMBAHKAN** 1 baris ini **TEPAT SEBELUM** tag `</body>` penutup:

```html
<script src="/assets/js/live-news.js" defer></script>
```

**Contoh posisi yang benar:**

```html
<!-- File: footer.php atau template utama -->

        <!-- ... kode HTML lainnya ... -->

        <script src="/js/jquery.min.js"></script>
        <script src="/js/custom.js"></script>
        
        <!-- TAMBAHKAN BARIS INI (paling bawah, sebelum </body>) -->
        <script src="/assets/js/live-news.js" defer></script>
    </body>
</html>
```

⚠️ **JANGAN** pindahkan atau ubah `<script>` lain yang sudah ada. **HANYA TAMBAHKAN** baris baru.

---

## 🔧 Langkah 7 — Integrasi ke Script Admin Publish

Temukan file PHP yang menangani **publish berita baru**. Biasanya:
- `admin/publish.php`
- `admin/save_post.php`
- `admin/posts/add.php`

### A. Tambahkan require di bagian atas file:

**CARI** baris yang sudah ada di bagian atas (setelah `<?php`):
```php
require_once __DIR__ . '/../includes/db.php';
// atau
include_once 'config.php';
```

**TAMBAHKAN** tepat setelahnya:
```php
require_once __DIR__ . '/publish-hook.php';
```

### B. Panggil fungsi setelah INSERT berhasil:

**CARI** blok kode yang menjalankan INSERT:
```php
$stmt = $pdo->prepare("INSERT INTO posts (title, slug, category, ...) VALUES (...)");
$stmt->execute([...]);
$postId = $pdo->lastInsertId();
```

**TAMBAHKAN** tepat setelah `$postId` didapat:
```php
// Kirim notifikasi SSE ke semua pengunjung
notify_sse_new_post([
    'post_id'    => (int)$postId,
    'title'      => $_POST['title'] ?? $judul_berita,
    'slug'       => $slug_berita,
    'category'   => $_POST['category'] ?? $nama_kategori,
    'image'      => $url_thumbnail ?? '',
    'excerpt'    => $_POST['excerpt'] ?? '',
    'author'     => $_SESSION['admin_name'] ?? $nama_penulis,
]);
```

### Contoh lengkap sebelum & sesudah:

**SEBELUM:**
```php
// admin/publish.php

<?php
require_once '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO posts (title, slug, content) VALUES (?, ?, ?)");
    $stmt->execute([$_POST['title'], $_POST['slug'], $_POST['content']]);
    $postId = $pdo->lastInsertId();
    
    header("Location: success.php?id={$postId}");
    exit;
}
```

**SESUDAH:**
```php
// admin/publish.php

<?php
require_once '../includes/db.php';
require_once 'publish-hook.php';  // ← TAMBAHKAN INI

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $pdo->prepare("INSERT INTO posts (title, slug, content) VALUES (?, ?, ?)");
    $stmt->execute([$_POST['title'], $_POST['slug'], $_POST['content']]);
    $postId = $pdo->lastInsertId();
    
    // TAMBAHKAN INI
    notify_sse_new_post([
        'post_id'    => (int)$postId,
        'title'      => $_POST['title'],
        'slug'       => $_POST['slug'],
        'category'   => $_POST['category'] ?? 'Umum',
        'image'      => $_POST['image_url'] ?? '',
        'excerpt'    => $_POST['excerpt'] ?? '',
        'author'     => $_SESSION['admin_name'] ?? 'Redaksi',
    ]);
    
    header("Location: success.php?id={$postId}");
    exit;
}
```

---

## 🧪 Langkah 8 — Testing

### Test 1: Cek SSE Endpoint

Buka browser, akses:
```
https://integritypost.id/sse/news-stream.php
```

**Yang harus muncul:**
```
event: connected
data: {"message":"Stream started"}
```

Jika muncul error atau blank, cek:
- File permissions (harus readable: `644`)
- Nginx config sudah di-reload
- PHP-FPM running

### Test 2: Kirim Test Event via cURL

Di terminal server:
```bash
curl -X POST https://integritypost.id/sse/notify.php \
  -H "Authorization: Bearer TOKEN_ANDA" \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": 999,
    "title": "Test Berita SSE",
    "slug": "test-berita-sse",
    "category": "Test",
    "image": "",
    "excerpt": "Ini adalah test notifikasi SSE",
    "author": "Admin"
  }'
```

**Response yang diharapkan:**
```json
{"success": true, "message": "Event queued successfully", "event_id": 1}
```

### Test 3: Verifikasi di Browser

1. Buka `integritypost.id` di **3 browser berbeda** (Chrome, Firefox, HP)
2. Jalankan perintah cURL di atas
3. Dalam **3-5 detik**, semua browser harus menampilkan toast notification

---

## 🎨 Kustomisasi (Opsional)

### Ubah Warna Toast

Edit `assets/js/live-news.js`, cari bagian `showToast()` (sekitar baris 80):

```javascript
// Baris 83: Warna default (biru)
let bgColor = '#007bff';

// Baris 86: Warna breaking news (merah)
bgColor = '#dc3545';
```

Ganti dengan warna brand Anda.

### Ubah Posisi Toast

Edit baris 108 di `live-news.js`:

```javascript
// Default: kanan bawah
bottom: 20px;
right: 20px;

// Atau kiri bawah:
bottom: 20px;
left: 20px;
```

### Ubah Durasi Toast

Edit baris 18 di `live-news.js`:

```javascript
toastDuration: 8000, // 8 detik
```

---

## 🐛 Troubleshooting

### Toast tidak muncul

**Cek browser console (F12):**
```
[Live News] Connecting to SSE stream...
[Live News] Connected: ...
```

Jika error:
- Cek URL stream di `live-news.js` baris 12
- Pastikan file `news-stream.php` accessible
- Cek Nginx error log: `tail -f /var/log/nginx/error.log`

### Koneksi putus terus-menerus

**Cek Nginx config:**
```bash
sudo grep -A 10 "news-stream.php" /etc/nginx/sites-available/integritypost.id
```

Pastikan ada:
```nginx
fastcgi_read_timeout 360s;
fastcgi_buffering off;
```

### Token invalid

**Cek log PHP:**
```bash
tail -f /var/log/php8.1-fpm.log | grep SSE
```

Pastikan token di `sse-config.php` dan `publish-hook.php` **SAMA PERSIS**.

---

## 📊 Monitoring

### Cek berapa banyak koneksi aktif:
```sql
SELECT COUNT(*) as active_connections FROM sse_connections 
WHERE last_seen > NOW() - INTERVAL 5 MINUTE;
```

### Cek event yang belum terkirim:
```sql
SELECT COUNT(*) as pending_events FROM sse_events WHERE is_sent = 0;
```

### Cleanup event lama (jalankan via cron):
```bash
# Edit crontab
crontab -e

# Tambahkan baris ini (hapus event > 24 jam setiap jam)
0 * * * * mysql -u integrity_user -p'integrity_pass' integritypost -e "DELETE FROM sse_events WHERE is_sent = 1 AND created_at < NOW() - INTERVAL 24 HOUR;"
```

---

## 🔒 Keamanan

### 1. Ganti Token Segera
Jika token bocor, segera ganti di kedua file dan reload Nginx.

### 2. Batasi IP (Opsional)
Tambahkan di Nginx untuk restrict akses `/sse/notify.php` hanya dari IP server:

```nginx
location ~ /sse/notify\.php$ {
    allow 127.0.0.1;
    allow 192.168.1.100;  # IP server admin
    deny all;
    
    # ... fastcgi config ...
}
```

### 3. HTTPS Wajib
SSE hanya bekerja dengan aman di HTTPS. Pastikan SSL sudah aktif.

---

## ✅ Checklist Setelah Pasang

- [ ] Toast muncul saat test cURL
- [ ] Toast muncul di multiple browser
- [ ] Toast muncul di HP (mobile)
- [ ] Breaking news warna merah
- [ ] Klik toast → redirect ke artikel
- [ ] Tidak ada error di browser console
- [ ] Tidak ada error di Nginx log
- [ ] Database tabel `sse_events` ada
- [ ] Token Bearer sudah diganti yang aman

---

## 🆘 Butuh Bantuan?

Jika ada masalah, kirim:
1. Output browser console (F12)
2. Nginx error log: `tail -50 /var/log/nginx/error.log`
3. PHP error log: `tail -50 /var/log/php8.1-fpm.log`

---

**Terakhir diupdate:** Mei 2026  
**Versi:** 1.0.0  
**Domain:** integritypost.id
