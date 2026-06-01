// ============================================
// INTEGRITY POST — Supabase News API Client
// ============================================
// Database pusat: Supabase PostgreSQL
// Gambar: Cloudinary (URL saja disimpan di DB)
// Realtime: Supabase WebSocket subscription
// Fallback: localStorage untuk loading cepat + offline
// ============================================

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { NewsArticle } from '../data/newsData';
import { newsArticles as seedData } from '../data/newsData';
import type { SidebarSlot } from '../store/sidebarStore';
import { DEFAULT_SIDEBARS } from '../data/sidebarDefaults';

// ============================================
// MAPPING antara DB (snake_case) ↔ frontend (camelCase)
// ============================================

function mapDbToArticle(row: any): NewsArticle {
  return {
    id: row.id,
    title: row.title || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    category: row.category || 'Nasional',
    author: row.author || '',
    date: row.date || new Date().toISOString(),
    scheduledAt: row.scheduled_at || undefined,
    image: row.image || '',
    tags: Array.isArray(row.tags) ? row.tags : [],
    views: row.views || 0,
    featured: Boolean(row.featured),
    breaking: Boolean(row.breaking),
    trending: Boolean(row.trending),
  };
}

function articleToDb(article: NewsArticle) {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    author: article.author,
    date: article.date,
    scheduled_at: article.scheduledAt || null,
    image: article.image,
    tags: article.tags,
    views: article.views,
    featured: article.featured,
    breaking: article.breaking,
    trending: article.trending,
  };
}

function mapDbToSidebar(row: any): SidebarSlot {
  return {
    id: row.id,
    title: row.title || '',
    enabled: Boolean(row.enabled),
    url: row.url || '',
    image: row.image || '',
    type: (row.type === 'long' ? 'long' : 'normal'),
  };
}

function sidebarToDb(slot: SidebarSlot) {
  return {
    id: slot.id,
    title: slot.title,
    enabled: slot.enabled,
    url: slot.url,
    image: slot.image,
    type: slot.type,
  };
}

// ============================================
// LOCALSTORAGE CACHE (untuk loading cepat)
// ============================================

const CACHE_KEY = 'ip_cache_v2';

function saveCache(data: { articles: NewsArticle[]; sidebars: SidebarSlot[] }) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ articles: data.articles, sidebars: data.sidebars, t: Date.now() }));
  } catch {}
}

function loadCache(): { articles: NewsArticle[]; sidebars: SidebarSlot[] } {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { articles: seedData, sidebars: DEFAULT_SIDEBARS };
}

// ============================================
// READ OPERATIONS (silakan gagal silent, pakai cache)
// ============================================

export async function getAllNews(): Promise<NewsArticle[]> {
  const sb = getSupabaseClient();
  if (!sb) {
    console.warn('[API] Supabase belum dikonfigurasi, pakai cache lokal');
    return loadCache().articles;
  }

  try {
    const { data, error } = await sb
      .from('articles')
      .select('*')
      .order('date', { ascending: false })
      .limit(500);

    if (error) {
      console.warn('[API] Gagal fetch articles:', error.message);
      return loadCache().articles;
    }

    const articles = (data || []).map(mapDbToArticle);
    // Jika DB kosong, tampilkan seed data agar website tidak kosong
    if (articles.length === 0) {
      return loadCache().articles;
    }
    // Simpan cache untuk loading cepat berikutnya
    saveCache({ articles, sidebars: loadCache().sidebars });
    return articles;
  } catch (error) {
    console.warn('[API] Error fetch articles, pakai cache:', error);
    return loadCache().articles;
  }
}

export async function getAllSidebars(): Promise<SidebarSlot[]> {
  const sb = getSupabaseClient();
  if (!sb) return loadCache().sidebars;

  try {
    const { data, error } = await sb
      .from('sidebars')
      .select('*')
      .order('id');

    if (error) {
      console.warn('[API] Gagal fetch sidebars:', error.message);
      return loadCache().sidebars;
    }

    const sidebars = (data || []).map(mapDbToSidebar);
    // Jika kosong, kembalikan default (tampilan) tapi JANGAN auto-insert
    return sidebars.length > 0 ? sidebars : DEFAULT_SIDEBARS;
  } catch (error) {
    console.warn('[API] Error fetch sidebars, pakai cache:', error);
    return loadCache().sidebars;
  }
}

// ============================================
// WRITE OPERATIONS (silent, tidak ada alert)
// ============================================

export async function createNews(article: NewsArticle): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) {
    console.warn('[API] Supabase tidak aktif, berita tetap tampil lokal');
    return true; // dianggap sukses agar UI tidak blokir user
  }

  const { error } = await sb.from('articles').upsert(articleToDb(article));
  if (error) {
    console.error('[API] Gagal create article:', error.message);
    return false;
  }
  return true;
}

export async function updateNews(id: string, article: NewsArticle): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return true;

  const { error } = await sb.from('articles').update(articleToDb(article)).eq('id', id);
  if (error) {
    console.error('[API] Gagal update article:', error.message);
    return false;
  }
  return true;
}

export async function deleteNews(id: string): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return true;

  const { error } = await sb.from('articles').delete().eq('id', id);
  if (error) {
    console.error('[API] Gagal delete article:', error.message);
    return false;
  }
  return true;
}

export async function saveAllSidebars(sidebars: SidebarSlot[]): Promise<boolean> {
  const sb = getSupabaseClient();
  if (!sb) return true;

  // Hapus semua + insert ulang (simple & atomic)
  const { error: deleteError } = await sb.from('sidebars').delete().neq('id', '');
  if (deleteError) {
    console.error('[API] Gagal reset sidebars:', deleteError.message);
    return false;
  }

  const { error: insertError } = await sb
    .from('sidebars')
    .insert(sidebars.map(sidebarToDb));

  if (insertError) {
    console.error('[API] Gagal insert sidebars:', insertError.message);
    return false;
  }
  return true;
}

// ============================================
// REALTIME SUBSCRIPTION (WebSocket Supabase)
// ============================================

type ArticleCb = (articles: NewsArticle[]) => void;
type SidebarCb = (sidebars: SidebarSlot[]) => void;

let realtimeChannel: any = null;
let articleCbs: ArticleCb[] = [];
let sidebarCbs: SidebarCb[] = [];
let subscribed = false;

async function fetchAllAndBroadcast() {
  const articles = await getAllNews();
  const sidebars = await getAllSidebars();
  articleCbs.forEach(cb => cb(articles));
  sidebarCbs.forEach(cb => cb(sidebars));
  saveCache({ articles, sidebars });
}

export function subscribeToNews(callback: ArticleCb): () => void {
  articleCbs.push(callback);
  ensureRealtime();
  return () => {
    articleCbs = articleCbs.filter(cb => cb !== callback);
    cleanupIfEmpty();
  };
}

export function subscribeToSidebars(callback: SidebarCb): () => void {
  sidebarCbs.push(callback);
  ensureRealtime();
  return () => {
    sidebarCbs = sidebarCbs.filter(cb => cb !== callback);
    cleanupIfEmpty();
  };
}

function ensureRealtime() {
  if (subscribed) return;
  const sb = getSupabaseClient();

  // Jika Supabase belum dikonfigurasi, tetap tampilkan seed/cache data
  // agar website TIDAK kosong (berita & sidebar tetap muncul)
  if (!sb) {
    const cache = loadCache();
    articleCbs.forEach(cb => cb(cache.articles));
    sidebarCbs.forEach(cb => cb(cache.sidebars));
    return;
  }

  subscribed = true;

  // Ambil data awal + cache
  fetchAllAndBroadcast();

  // Subscribe realtime via WebSocket
  realtimeChannel = sb
    .channel('integrity-post-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'articles' },
      () => {
        console.log('[Realtime] 📰 Articles berubah, refresh...');
        fetchAllAndBroadcast();
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sidebars' },
      () => {
        console.log('[Realtime] 🖼️ Sidebars berubah, refresh...');
        fetchAllAndBroadcast();
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Realtime] ✅ WebSocket connected');
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn('[Realtime] ⚠️ Subscription issue:', status);
      }
    });
}

function cleanupIfEmpty() {
  if (articleCbs.length === 0 && sidebarCbs.length === 0 && realtimeChannel) {
    const sb = getSupabaseClient();
    if (sb) sb.removeChannel(realtimeChannel);
    realtimeChannel = null;
    subscribed = false;
  }
}

// ============================================
// LEGACY EXPORTS (untuk compat)
// ============================================

export const isApiConfigured = () => isSupabaseConfigured();
export const loadApiConfig = async () => ({
  endpoint: import.meta.env.VITE_SUPABASE_URL || '',
  apiKey: '',
  binId: '',
});
