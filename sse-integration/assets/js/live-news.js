/**
 * INTEGRITY POST — Live News Client (Server-Sent Events)
 * ========================================================
 * File ini dijalankan di SEMUA halaman pengunjung.
 * 
 * Fitur:
 * - Auto-connect ke SSE stream
 * - Toast notification saat ada berita baru
 * - Breaking news dengan highlight merah
 * - Auto-reconnect dengan exponential backoff
 * - Silent reconnect tanpa spam notifikasi
 * - Mobile responsive
 * - Tidak mengganggu UX yang sudah ada
 */

(function() {
    'use strict';

    // =============================================================
    // KONFIGURASI
    // =============================================================

    const CONFIG = {
        // URL SSE endpoint (sesuaikan domain)
        streamUrl: '/sse/news-stream.php',
        
        // Waktu tunggu sebelum reconnect (ms)
        reconnectBaseDelay: 1000,
        reconnectMaxDelay: 30000, // Maksimal 30 detik
        
        // Toast auto-hide setelah (ms)
        toastDuration: 8000,
        
        // Simpan lastEventId di localStorage
        storageKey: 'integritypost_sse_last_event_id',
        
        // CSS class untuk styling
        toastClass: 'ip-live-toast',
    };

    // =============================================================
    // STATE
    // =============================================================

    let eventSource = null;
    let reconnectAttempts = 0;
    let reconnectTimer = null;
    let isVisible = true; // Track apakah tab aktif

    // =============================================================
    // TOAST NOTIFICATION
    // =============================================================

    /**
     * Tampilkan toast notification
     */
    function showToast(data, type = 'new_post') {
        // Jangan tampilkan jika tab tidak aktif (akan ditampilkan saat kembali)
        if (!isVisible && type !== 'breaking_news') {
            return;
        }

        // Hapus toast lama jika ada
        removeExistingToasts();

        // Buat container toast
        const toast = document.createElement('div');
        toast.className = `${CONFIG.toastClass} ${type}`;

        // Tentukan warna berdasarkan tipe
        let bgColor = '#007bff';
        let icon = '📰';
        
        if (type === 'breaking_news') {
            bgColor = '#dc3545';
            icon = '🔴 BREAKING';
        } else if (type === 'update_post') {
            bgColor = '#28a745';
            icon = '✏️';
        }

        // HTML content
        const content = `
            <div class="ip-toast-header" style="background: ${bgColor};">
                <span class="ip-toast-icon">${icon}</span>
                <span class="ip-toast-category">${escapeHtml(data.category || 'Umum')}</span>
            </div>
            <div class="ip-toast-body">
                <h4 class="ip-toast-title">${escapeHtml(data.title || 'Berita Baru')}</h4>
                ${data.excerpt ? `<p class="ip-toast-excerpt">${escapeHtml(truncate(data.excerpt, 80))}</p>` : ''}
                <span class="ip-toast-author">Oleh ${escapeHtml(data.author || 'Redaksi')}</span>
            </div>
            <div class="ip-toast-footer">
                ${data.slug ? `<a href="/berita/${data.slug}" class="ip-toast-btn">Baca Selengkapnya →</a>` : ''}
                <button class="ip-toast-close" aria-label="Tutup">✕</button>
            </div>
        `;

        toast.innerHTML = content;

        // Styling inline (agar tidak bergantung pada CSS external)
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 360px;
            max-width: 90vw;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            animation: ipSlideIn 0.3s ease-out;
            border: 1px solid #e0e0e0;
        `;

        // Inject styles
        injectStyles();

        // Tambahkan ke body
        document.body.appendChild(toast);

        // Event: close button
        const closeBtn = toast.querySelector('.ip-toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.remove();
            });
        }

        // Auto-hide setelah durasi
        if (type !== 'breaking_news') {
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'ipSlideOut 0.3s ease-in';
                    setTimeout(() => toast.remove(), 300);
                }
            }, CONFIG.toastDuration);
        }
    }

    /**
     * Hapus semua toast yang ada
     */
    function removeExistingToasts() {
        const existing = document.querySelectorAll(`.${CONFIG.toastClass}`);
        existing.forEach(toast => toast.remove());
    }

    /**
     * Inject CSS animations dan styles
     */
    function injectStyles() {
        if (document.getElementById('ip-live-toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'ip-live-toast-styles';
        style.textContent = `
            @keyframes ipSlideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes ipSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            .ip-toast-header {
                padding: 12px 16px;
                color: white;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .ip-toast-icon {
                font-size: 18px;
            }

            .ip-toast-category {
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .ip-toast-body {
                padding: 16px;
            }

            .ip-toast-title {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 700;
                color: #1a1a1a;
                line-height: 1.4;
            }

            .ip-toast-excerpt {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: #666;
                line-height: 1.5;
            }

            .ip-toast-author {
                font-size: 12px;
                color: #999;
            }

            .ip-toast-footer {
                padding: 12px 16px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
            }

            .ip-toast-btn {
                color: white;
                background: #007bff;
                padding: 8px 16px;
                border-radius: 4px;
                text-decoration: none;
                font-size: 13px;
                font-weight: 600;
                transition: background 0.2s;
            }

            .ip-toast-btn:hover {
                background: #0056b3;
            }

            .ip-toast-close {
                background: none;
                border: none;
                font-size: 20px;
                color: #999;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .ip-toast-close:hover {
                background: #e0e0e0;
                color: #333;
            }

            /* Mobile responsive */
            @media (max-width: 480px) {
                .ip-live-toast {
                    width: 100vw !important;
                    max-width: 100vw !important;
                    bottom: 0 !important;
                    right: 0 !important;
                    border-radius: 0 !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-bottom: none !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // =============================================================
    // EVENT HANDLERS
    // =============================================================

    function handleNewPost(data) {
        console.log('[Live News] New post:', data.title);
        showToast(data, 'new_post');
    }

    function handleBreakingNews(data) {
        console.log('[Live News] Breaking news:', data.title);
        showToast(data, 'breaking_news');
    }

    function handleUpdatePost(data) {
        console.log('[Live News] Post updated:', data.title);
        // Opsional: refresh halaman jika user sedang di artikel tersebut
        const currentSlug = window.location.pathname.split('/').pop();
        if (currentSlug === data.slug) {
            setTimeout(() => window.location.reload(), 3000);
        }
    }

    function handleDeletePost(data) {
        console.log('[Live News] Post deleted:', data.title);
        // Jika user sedang di artikel yang dihapus, redirect ke homepage
        const currentSlug = window.location.pathname.split('/').pop();
        if (currentSlug === data.slug) {
            alert('Berita ini telah dihapus oleh redaksi.');
            window.location.href = '/';
        }
    }

    // =============================================================
    // SSE CONNECTION
    // =============================================================

    function connect() {
        // Hapus koneksi lama jika ada
        if (eventSource) {
            eventSource.close();
            eventSource = null;
        }

        console.log('[Live News] Connecting to SSE stream...');

        // Buat EventSource dengan Last-Event-ID
        const lastEventId = localStorage.getItem(CONFIG.storageKey);
        eventSource = new EventSource(CONFIG.streamUrl);

        if (lastEventId) {
            eventSource.lastEventId = lastEventId;
        }

        // Event: connected
        eventSource.addEventListener('connected', function(e) {
            console.log('[Live News] Connected:', e.data);
            reconnectAttempts = 0; // Reset reconnect counter
        });

        // Event: new_post
        eventSource.addEventListener('new_post', function(e) {
            const data = JSON.parse(e.data);
            handleNewPost(data);
        });

        // Event: breaking_news
        eventSource.addEventListener('breaking_news', function(e) {
            const data = JSON.parse(e.data);
            handleBreakingNews(data);
        });

        // Event: update_post
        eventSource.addEventListener('update_post', function(e) {
            const data = JSON.parse(e.data);
            handleUpdatePost(data);
        });

        // Event: delete_post
        eventSource.addEventListener('delete_post', function(e) {
            const data = JSON.parse(e.data);
            handleDeletePost(data);
        });

        // Event: timeout
        eventSource.addEventListener('timeout', function(e) {
            console.log('[Live News] Server timeout, reconnecting...');
            reconnect();
        });

        // Error handler
        eventSource.onerror = function(e) {
            console.error('[Live News] Connection error:', e);
            eventSource.close();
            eventSource = null;
            reconnect();
        };
    }

    /**
     * Reconnect dengan exponential backoff
     */
    function reconnect() {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
        }

        // Hitung delay dengan exponential backoff
        const delay = Math.min(
            CONFIG.reconnectBaseDelay * Math.pow(2, reconnectAttempts),
            CONFIG.reconnectMaxDelay
        );

        console.log(`[Live News] Reconnecting in ${delay/1000}s (attempt ${reconnectAttempts + 1})...`);

        reconnectTimer = setTimeout(() => {
            reconnectAttempts++;
            connect();
        }, delay);
    }

    // =============================================================
    // UTILITY FUNCTIONS
    // =============================================================

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncate(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    // =============================================================
    // VISIBILITY API
    // =============================================================

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            isVisible = true;
            console.log('[Live News] Tab visible, resuming notifications');
        } else {
            isVisible = false;
            console.log('[Live News] Tab hidden, pausing notifications');
        }
    });

    // =============================================================
    // INITIALIZATION
    // =============================================================

    // Tunggu DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', connect);
    } else {
        connect();
    }

    // Cleanup saat halaman unload
    window.addEventListener('beforeunload', function() {
        if (eventSource) {
            eventSource.close();
        }
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
        }
    });

})();
