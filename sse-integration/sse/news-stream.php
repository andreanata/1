<?php
/**
 * INTEGRITY POST — SSE News Stream Endpoint
 * ===========================================
 * Endpoint ini dibuka oleh browser pengunjung untuk menerima update realtime.
 * URL: /sse/news-stream.php
 * 
 * Fitur:
 * - Long polling dengan interval 3 detik
 * - Heartbeat setiap 15 detik untuk keep-alive
 * - Support Last-Event-ID untuk reconnect
 * - Auto-cleanup koneksi lama
 * - Timeout 360 detik (6 menit), client akan auto-reconnect
 */

// Set headers SSE
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');
header('Access-Control-Allow-Origin: *');

// Disable output buffering untuk real-time streaming
while (ob_get_level() > 0) {
    ob_end_flush();
}
ob_implicit_flush(true);

// Include konfigurasi
require_once __DIR__ . '/../includes/sse-config.php';

// Set time limit (dihandle oleh Nginx fastcgi_read_timeout)
set_time_limit($SSE_MAX_EXECUTION_TIME);

// =============================================================
// CLIENT CONNECTION HANDLING
// =============================================================

// Dapatkan Last-Event-ID dari client (untuk reconnect)
$lastEventId = isset($_SERVER['HTTP_LAST_EVENT_ID']) 
    ? (int)$_SERVER['HTTP_LAST_EVENT_ID'] 
    : 0;

// Generate unique client ID
$clientId = bin2hex(random_bytes(16));

// Log koneksi baru (opsional, untuk monitoring)
try {
    $pdo = sse_get_db();
    $stmt = $pdo->prepare("INSERT INTO `sse_connections` (client_id, ip_address, user_agent) VALUES (?, ?, ?)");
    $stmt->execute([
        $clientId,
        $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 500)
    ]);
} catch (Exception $e) {
    // Silently ignore logging errors
}

// =============================================================
// MAIN STREAMING LOOP
// =============================================================

$lastHeartbeat = time();
$connectionStart = time();

while (true) {
    // Cek apakah client masih connected
    if (connection_aborted()) {
        break;
    }

    // Cek timeout (6 menit)
    if (time() - $connectionStart > $SSE_MAX_EXECUTION_TIME) {
        echo "event: timeout\n";
        echo "data: " . json_encode(['message' => 'Connection timeout, please reconnect']) . "\n\n";
        if (ob_get_level() > 0) ob_flush();
        flush();
        break;
    }

    try {
        $pdo = sse_get_db();

        // Query event baru yang belum terkirim
        $stmt = $pdo->prepare("
            SELECT id, event_type, post_id, title, slug, category, image, excerpt, author, created_at
            FROM `sse_events`
            WHERE id > ? AND is_sent = 0
            ORDER BY id ASC
            LIMIT 10
        ");
        $stmt->execute([$lastEventId]);
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Jika ada event baru, kirim ke client
        if (!empty($events)) {
            foreach ($events as $event) {
                $eventId = (int)$event['id'];
                $eventType = $event['event_type'];

                // Siapkan data payload
                $data = [
                    'post_id'    => $event['post_id'],
                    'title'      => $event['title'],
                    'slug'       => $event['slug'],
                    'category'   => $event['category'],
                    'image'      => $event['image'],
                    'excerpt'    => $event['excerpt'],
                    'author'     => $event['author'],
                    'timestamp'  => $event['created_at']
                ];

                // Kirim event
                sse_send_event($eventType, $data, $eventId);

                // Tandai event sebagai terkirim
                $updateStmt = $pdo->prepare("UPDATE `sse_events` SET is_sent = 1 WHERE id = ?");
                $updateStmt->execute([$eventId]);

                $lastEventId = $eventId;
            }
        }

        // Heartbeat jika sudah 15 detik sejak heartbeat terakhir
        if (time() - $lastHeartbeat >= $SSE_HEARTBEAT_INTERVAL) {
            sse_send_heartbeat();
            $lastHeartbeat = time();

            // Update last_seen di database
            $updateConn = $pdo->prepare("UPDATE `sse_connections` SET last_seen = NOW() WHERE client_id = ?");
            $updateConn->execute([$clientId]);
        }

        // Sleep sebelum polling berikutnya
        sleep($SSE_CHECK_INTERVAL);

    } catch (Exception $e) {
        error_log('SSE Stream Error: ' . $e->getMessage());
        
        // Kirim error event
        echo "event: error\n";
        echo "data: " . json_encode(['message' => 'Server error, reconnecting...']) . "\n\n";
        if (ob_get_level() > 0) ob_flush();
        flush();
        
        sleep(5); // Tunggu 5 detik sebelum retry
    }
}

// Cleanup: hapus koneksi dari database
try {
    $pdo = sse_get_db();
    $stmt = $pdo->prepare("DELETE FROM `sse_connections` WHERE client_id = ?");
    $stmt->execute([$clientId]);
} catch (Exception $e) {
    // Ignore cleanup errors
}
