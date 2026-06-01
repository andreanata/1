<?php
/**
 * INTEGRITY POST — SSE Configuration
 * =====================================
 * File konfigurasi untuk Server-Sent Events (SSE).
 * Disimpan di: /includes/sse-config.php
 * 
 * PENTING: Ganti nilai-nilai di bawah sesuai server Anda.
 * JANGAN commit file ini ke Git jika berisi password.
 */

// =============================================================
// DATABASE CONFIGURATION
// =============================================================
// Sesuaikan dengan database Integrity Post Anda yang sudah ada.

$dbHost = 'localhost';
$dbUser = 'integrity_user';      // Ganti dengan user database Anda
$dbPass = 'YOUR_DATABASE_PASS';  // Ganti dengan password database Anda
$dbName = 'integritypost';       // Ganti dengan nama database Anda

// =============================================================
// SSE CONFIGURATION
// =============================================================

// Token Bearer untuk mengamankan endpoint /sse/notify.php
// Generate dengan: openssl rand -hex 32
$SSE_BEARER_TOKEN = 'GANTI_DENGAN_TOKEN_ACAN_PANJANG_MINIMAL_64_KARAKTER';

// Interval pengecekan event baru (detik)
$SSE_CHECK_INTERVAL = 3;

// Interval heartbeat agar koneksi tidak putus (detik)
$SSE_HEARTBEAT_INTERVAL = 15;

// Maximum execution time untuk SSE stream (detik)
$SSE_MAX_EXECUTION_TIME = 360; // 6 menit

// =============================================================
// PDO CONNECTION (Singleton Pattern)
// =============================================================

/**
 * Dapatkan koneksi PDO ke database.
 * Menggunakan singleton pattern agar tidak membuat koneksi berulang.
 * 
 * @return PDO
 * @throws PDOException
 */
function sse_get_db(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        global $dbHost, $dbUser, $dbPass, $dbName;

        $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_PERSISTENT         => true,
        ];

        try {
            $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
        } catch (PDOException $e) {
            error_log('SSE Database Connection Failed: ' . $e->getMessage());
            throw $e;
        }
    }

    return $pdo;
}

// =============================================================
// AUTO-CREATE TABLE
// =============================================================

/**
 * Pastikan tabel sse_events sudah ada.
 * Jika belum ada, otomatis dibuat.
 * 
 * @return void
 */
function sse_ensure_table(): void {
    $pdo = sse_get_db();

    $sql = "CREATE TABLE IF NOT EXISTS `sse_events` (
        `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `event_type` VARCHAR(50)  NOT NULL DEFAULT 'new_post',
        `post_id`    INT UNSIGNED NULL,
        `title`      VARCHAR(255) NULL,
        `slug`       VARCHAR(255) NULL,
        `category`   VARCHAR(100) NULL,
        `image`      VARCHAR(500) NULL,
        `excerpt`    TEXT         NULL,
        `author`     VARCHAR(100) NULL,
        `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `is_sent`    TINYINT(1)   NOT NULL DEFAULT 0,

        INDEX `idx_event_type`  (`event_type`),
        INDEX `idx_created_at`  (`created_at`),
        INDEX `idx_is_sent`     (`is_sent`, `created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    $pdo->exec($sql);
}

// =============================================================
// HELPER FUNCTIONS
// =============================================================

/**
 * Validasi token Bearer dari header Authorization.
 * 
 * @return bool
 */
function sse_validate_token(): bool {
    global $SSE_BEARER_TOKEN;

    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (strpos($auth, 'Bearer ') !== 0) {
        return false;
    }

    $token = substr($auth, 7);

    return hash_equals($SSE_BEARER_TOKEN, $token);
}

/**
 * Kirim event SSE ke client.
 * 
 * @param string $event  Nama event (new_post, breaking_news, update_post)
 * @param array  $data   Data event (akan di-json encode)
 * @param int    $id     Event ID untuk Last-Event-ID
 * @return void
 */
function sse_send_event(string $event, array $data, int $id): void {
    echo "id: {$id}\n";
    echo "event: {$event}\n";
    echo "data: " . json_encode($data, JSON_UNESCAPED_UNICODE) . "\n\n";
    
    if (ob_get_level() > 0) {
        ob_flush();
    }
    flush();
}

/**
 * Kirim heartbeat untuk menjaga koneksi tetap hidup.
 * 
 * @return void
 */
function sse_send_heartbeat(): void {
    echo ": heartbeat " . time() . "\n\n";
    
    if (ob_get_level() > 0) {
        ob_flush();
    }
    flush();
}

// =============================================================
// INITIALIZE
// =============================================================

// Pastikan tabel ada saat file ini di-include
sse_ensure_table();
