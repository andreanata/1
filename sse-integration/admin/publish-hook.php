<?php
/**
 * INTEGRITY POST — SSE Publish Hook
 * ===================================
 * File ini berisi helper functions yang dipanggil dari script admin
 * saat publish, update, atau delete berita.
 * 
 * Cara Pakai:
 * 
 * 1. Include file ini di script admin Anda:
 *    require_once __DIR__ . '/publish-hook.php';
 * 
 * 2. Panggil fungsi yang sesuai setelah operasi database berhasil:
 * 
 *    // Saat publish berita baru
 *    notify_sse_new_post([
 *        'post_id'    => $id_berita,
 *        'title'      => $judul_berita,
 *        'slug'       => $slug_berita,
 *        'category'   => $nama_kategori,
 *        'image'      => $url_thumbnail,
 *        'excerpt'    => $ringkasan,
 *        'author'     => $nama_penulis,
 *    ]);
 * 
 *    // Saat update berita
 *    notify_sse_update_post([...]);
 * 
 *    // Saat breaking news
 *    notify_sse_breaking_news([...]);
 * 
 *    // Saat delete berita
 *    notify_sse_delete_post($id_berita, $judul_berita);
 */

// =============================================================
// CONFIGURATION
// =============================================================

/**
 * URL endpoint notify.php (sesuaikan dengan domain Anda)
 */
define('SSE_NOTIFY_URL', 'https://integritypost.id/sse/notify.php');

/**
 * Bearer Token (HARUS SAMA dengan yang di sse-config.php)
 */
define('SSE_BEARER_TOKEN', 'GANTI_DENGAN_TOKEN_ACAN_PANJANG_MINIMAL_64_KARAKTER');

// =============================================================
// HELPER: SEND NOTIFICATION VIA cURL
// =============================================================

/**
 * Kirim notifikasi SSE via cURL (fire-and-forget).
 * Fungsi ini non-blocking agar tidak memperlambat script admin.
 * 
 * @param array $data Data event
 * @return bool True jika berhasil, False jika gagal
 */
function sse_notify(array $data): bool {
    // Validasi data
    if (empty($data['post_id']) || empty($data['title']) || empty($data['event_type'])) {
        error_log('SSE Notify: Missing required fields');
        return false;
    }

    // Siapkan payload JSON
    $payload = json_encode($data, JSON_UNESCAPED_UNICODE);

    // Inisialisasi cURL
    $ch = curl_init(SSE_NOTIFY_URL);

    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . SSE_BEARER_TOKEN,
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    // Eksekusi
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);

    curl_close($ch);

    // Log jika ada error
    if ($error) {
        error_log("SSE Notify cURL Error: {$error}");
        return false;
    }

    if ($httpCode !== 200) {
        error_log("SSE Notify HTTP Error: {$httpCode} - {$response}");
        return false;
    }

    return true;
}

// =============================================================
// PUBLIC FUNCTIONS
// =============================================================

/**
 * Notifikasi: Berita Baru Dipublish
 * 
 * Panggil fungsi ini SETELAH INSERT INTO tabel berita berhasil.
 * 
 * @param array $data [
 *   'post_id'    => int,
 *   'title'      => string,
 *   'slug'       => string,
 *   'category'   => string,
 *   'image'      => string,
 *   'excerpt'    => string,
 *   'author'     => string,
 * ]
 * @return bool
 */
function notify_sse_new_post(array $data): bool {
    $data['event_type'] = 'new_post';
    return sse_notify($data);
}

/**
 * Notifikasi: Berita Diupdate
 * 
 * Panggil fungsi ini SETELAH UPDATE tabel berita berhasil.
 * 
 * @param array $data (sama seperti notify_sse_new_post)
 * @return bool
 */
function notify_sse_update_post(array $data): bool {
    $data['event_type'] = 'update_post';
    return sse_notify($data);
}

/**
 * Notifikasi: Breaking News
 * 
 * Panggil fungsi ini saat ada berita urgent yang harus segera diketahui pembaca.
 * Toast di browser akan berwarna MERAH untuk breaking news.
 * 
 * @param array $data (sama seperti notify_sse_new_post)
 * @return bool
 */
function notify_sse_breaking_news(array $data): bool {
    $data['event_type'] = 'breaking_news';
    return sse_notify($data);
}

/**
 * Notifikasi: Berita Dihapus
 * 
 * Panggil fungsi ini SETELAH DELETE dari tabel berita berhasil.
 * Browser yang sedang membuka berita tersebut akan otomatis redirect ke homepage.
 * 
 * @param int    $postId ID berita yang dihapus
 * @param string $title  Judul berita (opsional, untuk logging)
 * @return bool
 */
function notify_sse_delete_post(int $postId, string $title = ''): bool {
    return sse_notify([
        'post_id'    => $postId,
        'title'      => $title,
        'event_type' => 'delete_post',
    ]);
}

// =============================================================
// EXAMPLE USAGE (Comment out atau hapus di production)
// =============================================================

/*
// Contoh integrasi di script admin publish:

require_once __DIR__ . '/publish-hook.php';

// ... kode simpan berita ke database ...
$stmt = $pdo->prepare("INSERT INTO posts (title, slug, category, ...) VALUES (...)");
$stmt->execute([...]);
$postId = $pdo->lastInsertId();

// Kirim notifikasi SSE
notify_sse_new_post([
    'post_id'    => (int)$postId,
    'title'      => $_POST['title'],
    'slug'       => $slug,
    'category'   => $_POST['category'],
    'image'      => $imageUrl,
    'excerpt'    => substr($_POST['content'], 0, 150),
    'author'     => $_SESSION['admin_name'],
]);
*/
