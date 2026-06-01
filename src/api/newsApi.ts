// ============================================
// INTEGRITY POST — Supabase News API Client
// ============================================

import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { NewsArticle } from '../data/newsData';
import { newsArticles as seedData } from '../data/newsData';
import type { SidebarSlot } from '../store/sidebarStore';
import { DEFAULT_SIDEBARS } from '../data/sidebarDefaults';

// Mapping DB ke Frontend
function mapDbToArticle(row: any): NewsArticle {
  return {
    id: row.id, title: row.title || '', excerpt: row.excerpt || '', content: row.content || '',
    category: row.category || 'Nasional', author: row.author || '', date: row.date || new Date().toISOString(),
    scheduledAt: row.scheduled_at || undefined, image: row.image || '', tags: Array.isArray(row.tags) ? row.tags : [],
    views: row.views || 0, featured: Boolean(row.featured), breaking: Boolean(row.breaking), trending: Boolean(row.trending),
  };
}

function articleToDb(article: NewsArticle) {
  return {
    id: article.id, title: article.title, excerpt: article.excerpt, content: article.content,
    category: article.category, author: article.author, date: article.date, scheduled_at: article.scheduledAt || null,
    image: article.image, tags: article.tags, views: article.views, featured: article.featured,
    breaking: article.breaking, trending: article.trending,
  };
}

function mapDbToSidebar(row: any): SidebarSlot {
  return { id: row.id, title: row.title || '', enabled: Boolean(row.enabled), url: row.url || '', image: row.image || '', type: (row.type === 'long' ? 'long' : 'normal') };
}

function sidebarToDb(slot: SidebarSlot) {
  return { id: slot.id, title: slot.title, enabled: slot.enabled, url: slot.url, image: slot.image, type: slot.type };
}

// Local Storage Cache (Untuk kecepatan & fallback jika internet putus)
const CACHE_KEY = 'ip_cache_v3';
function saveCache(data: { articles: NewsArticle[]; sidebars: SidebarSlot[] }) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, t: Date.now() })); } catch {}
}
function loadCache(): { articles: NewsArticle[]; sidebars: SidebarSlot[] } {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { articles: seedData, sidebars: DEFAULT_SIDEBARS };
}

// ============================================
// OPERASI CRUD (Upload, Edit, Hapus)
// ============================================

export async function createNews(article: NewsArticle): Promise<boolean> {
  // 1. Simpan ke Cache Lokal DULU (Agar Admin langsung lihat & tidak waiting)
  const cache = loadCache();
  const newArticles = [article, ...cache.articles.filter(a => a.id !== article.id)];
  saveCache({ articles: newArticles, sidebars: cache.sidebars });
  
  // 2. Kirim ke Supabase Cloud (Background Sync)
  const sb = getSupabaseClient();
  if (sb) {
    const { error } = await sb.from('articles').upsert(articleToDb(article));
    if (error) console.error('[Cloud Sync] Gagal upload berita:', error.message);
  }
  return true; // Selalu return true agar UI lancar
}

export async function updateNews(id: string, article: NewsArticle): Promise<boolean> {
  const cache = loadCache();
  const updated = cache.articles.map(a => a.id === id ? { ...article, id } : a);
  saveCache({ articles: updated, sidebars: cache.sidebars });

  const sb = getSupabaseClient();
  if (sb) {
    const { error } = await sb.from('articles').update(articleToDb(article)).eq('id', id);
    if (error) console.error('[Cloud Sync] Gagal edit berita:', error.message);
  }
  return true;
}

export async function deleteNews(id: string): Promise<boolean> {
  const cache = loadCache();
  const filtered = cache.articles.filter(a => a.id !== id);
  saveCache({ articles: filtered, sidebars: cache.sidebars });

  const sb = getSupabaseClient();
  if (sb) {
    const { error } = await sb.from('articles').delete().eq('id', id);
    if (error) console.error('[Cloud Sync] Gagal hapus berita:', error.message);
  }
  return true;
}

export async function saveAllSidebars(sidebars: SidebarSlot[]): Promise<boolean> {
  const cache = loadCache();
  saveCache({ articles: cache.articles, sidebars });

  const sb = getSupabaseClient();
  if (sb) {
    await sb.from('sidebars').delete().neq('id', '');
    const { error } = await sb.from('sidebars').insert(sidebars.map(sidebarToDb));
    if (error) console.error('[Cloud Sync] Gagal simpan sidebar:', error.message);
  }
  return true;
}

// ============================================
// PEMBACAAN DATA (Untuk User Publik)
// ============================================

export async function getAllNews(): Promise<NewsArticle[]> {
  const sb = getSupabaseClient();
  if (!sb) return loadCache().articles; // Fallback ke lokal jika Supabase mati

  try {
    const { data, error } = await sb.from('articles').select('*').order('date', { ascending: false }).limit(500);
    if (!error && data && data.length > 0) {
      const articles = data.map(mapDbToArticle);
      saveCache({ articles, sidebars: loadCache().sidebars }); // Update cache lokal user
      return articles;
    }
  } catch (e) { console.warn('[Read] Error fetch articles:', e); }
  
  return loadCache().articles;
}

export async function getAllSidebars(): Promise<SidebarSlot[]> {
  const sb = getSupabaseClient();
  if (!sb) return loadCache().sidebars;

  try {
    const { data, error } = await sb.from('sidebars').select('*').order('id');
    if (!error && data && data.length > 0) {
      const sidebars = data.map(mapDbToSidebar);
      saveCache({ articles: loadCache().articles, sidebars });
      return sidebars;
    }
  } catch (e) { console.warn('[Read] Error fetch sidebars:', e); }

  return loadCache().sidebars;
}

// ============================================
// REALTIME SYNC (Otomatis update tiap 3 detik)
// ============================================

type ArticleCb = (articles: NewsArticle[]) => void;
type SidebarCb = (sidebars: SidebarSlot[]) => void;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let articleCbs: ArticleCb[] = [];
let sidebarCbs: SidebarCb[] = [];

async function syncFromCloud() {
  const articles = await getAllNews();
  const sidebars = await getAllSidebars();
  articleCbs.forEach(cb => cb(articles));
  sidebarCbs.forEach(cb => cb(sidebars));
}

export function subscribeToNews(callback: ArticleCb): () => void {
  articleCbs.push(callback);
  if (!pollTimer) {
    syncFromCloud(); // Load data pertama kali
    pollTimer = setInterval(syncFromCloud, 3000); // Cek cloud tiap 3 detik
  }
  return () => {
    articleCbs = articleCbs.filter(cb => cb !== callback);
    if (articleCbs.length === 0 && sidebarCbs.length === 0 && pollTimer) {
      clearInterval(pollTimer); pollTimer = null;
    }
  };
}

export function subscribeToSidebars(callback: SidebarCb): () => void {
  sidebarCbs.push(callback);
  if (!pollTimer) {
    syncFromCloud();
    pollTimer = setInterval(syncFromCloud, 3000);
  }
  return () => {
    sidebarCbs = sidebarCbs.filter(cb => cb !== callback);
    if (articleCbs.length === 0 && sidebarCbs.length === 0 && pollTimer) {
      clearInterval(pollTimer); pollTimer = null;
    }
  };
}

export const isApiConfigured = () => isSupabaseConfigured();
export const loadApiConfig = async () => ({ endpoint: import.meta.env.VITE_SUPABASE_URL || '', apiKey: '', binId: '' });
