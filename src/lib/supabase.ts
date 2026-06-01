// ============================================
// INTEGRITY POST — Supabase Client
// ============================================
// Kredensial dari environment variable Vercel
// ============================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diset di environment variables.');
    return null;
  }

  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // tidak perlu session untuk anon public access
        autoRefreshToken: false,
      },
    });
    console.log('[Supabase] ✅ Client initialized');
    return client;
  } catch (error) {
    console.error('[Supabase] Gagal initialize client:', error);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export { getSupabaseClient as default };
