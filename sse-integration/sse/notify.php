<?php
/**
 * INTEGRITY POST — SSE Notify API Endpoint
 * ==========================================
 * Endpoint ini dipanggil saat admin publish/update/hapus berita.
 * URL: /sse/notify.php
 * Method: POST
 * 
 * Request Headers:
 * - Authorization: Bearer <TOKEN_ANDA>
 * - Content-Type: application/json
 * 
 * Request Body (JSON):
 * {
 *   "post_id": 123,
 *   "title": "Judul Berita",
 *   "slug": "judul-berita",
 *   "category": "Nasional",
 *   "image": "https://example.com/image.jpg",
 *   "excerpt": "Ringkasan berita...",
 *   "author": "Nama Penulis",
 *   "event_type": "new_post" // atau: update_post, breaking_news, delete_post
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Event queued successfully",
 *   "event_id": 456
 * }
 */

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Hanya izinkan POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

// Include konfigurasi
require_once __DIR__ . '/../includes/sse-config.php';

// Validasi token
if (!sse_validate_token()) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized. Invalid or missing Bearer token.'
    ]);
    exit;
}

// =============================================================
// PARSE REQUEST BODY
// =============================================================

$input = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON body.'
    ]);
    exit;
}

// Validasi field wajib
$requiredFields = ['post_id', 'title', 'event_type'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || empty($input[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missingFields)
    ]);
    exit;
}

// Validasi event_type
$validEventTypes = ['new_post', 'update_post', 'breaking_news', 'delete_post'];
if (!in_array($input['event_type'], $validEventTypes)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid event_type. Must be one of: ' . implode(', ', $validEventTypes)
    ]);
    exit;
}

// =============================================================
// INSERT EVENT INTO DATABASE
// =============================================================

try {
    $pdo = sse_get_db();

    $stmt = $pdo->prepare("
        INSERT INTO `sse_events` 
        (event_type, post_id, title, slug, category, image, excerpt, author)
        VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $input['event_type'],
        (int)$input['post_id'],
        $input['title'] ?? null,
        $input['slug'] ?? null,
        $input['category'] ?? null,
        $input['image'] ?? null,
        $input['excerpt'] ?? null,
        $input['author'] ?? null
    ]);

    $eventId = (int)$pdo->lastInsertId();

    // Response sukses
    echo json_encode([
        'success' => true,
        'message' => 'Event queued successfully',
        'event_id' => $eventId
    ]);

} catch (Exception $e) {
    error_log('SSE Notify Error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to queue event: ' . $e->getMessage()
    ]);
}
