-- =============================================================
-- INTEGRITY POST — SSE Events Table Schema
-- =============================================================
-- Tabel terpisah yang TIDAK mengganggu tabel berita yang sudah ada.
-- Digunakan untuk antrian event realtime (Server-Sent Events).
-- =============================================================

CREATE TABLE IF NOT EXISTS `sse_events` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Tabel untuk menyimpan koneksi aktif (opsional — monitoring)
-- =============================================================

CREATE TABLE IF NOT EXISTS `sse_connections` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `client_id`  VARCHAR(64)  NOT NULL,
  `ip_address` VARCHAR(45)  NULL,
  `user_agent` VARCHAR(500) NULL,
  `last_seen`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX `idx_last_seen` (`last_seen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Event cleanup otomatis (jalankan via cron jika diinginkan)
-- Contoh cron job:
--   0 * * * * mysql -u user -p password integritypost -e "DELETE FROM sse_events WHERE is_sent=1 AND created_at < NOW() - INTERVAL 1 DAY;"
-- =============================================================
