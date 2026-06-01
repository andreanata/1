// ============================================
// INTEGRITY POST — Open Graph Handler (Supabase)
// ============================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

function escapeHtml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function absoluteImageUrl(image) {
  if (!image || typeof image !== 'string') return 'https://integritypost.id/logo.png';
  if (image.startsWith('http')) return image;
  return `https://integritypost.id/${image}`;
}

async function getArticle(id) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  try {
    const url = `${SUPABASE_URL}/rest/v1/articles?id=eq.${encodeURIComponent(id)}&select=*`;
    const response = await fetch(url, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const rows = await response.json();
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  } catch (error) { return null; }
}

export default async function handler(req, res) {
  const id = req.query.id;
  const version = req.query.v ? String(req.query.v) : '';
  const canonicalUrl = `https://integritypost.id/berita/${encodeURIComponent(id || '')}${version ? `?v=${encodeURIComponent(version)}` : ''}`;
  const appUrl = `/berita/${encodeURIComponent(id || '')}?app=1${version ? `&v=${encodeURIComponent(version)}` : ''}`;
  
  const article = await getArticle(id);
  const title = article?.title ? `${article.title} - Integrity Post` : 'INTEGRITY POST - Portal Berita Siber Nasional';
  const description = article?.excerpt || 'Portal berita digital terdepan dengan standar jurnalisme berintegritas.';
  const image = absoluteImageUrl(article?.image);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60'); // Cache 1 menit agar WhatsApp cepat load

  res.status(200).send(`<!doctype html><html lang="id"><head>
    <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" /><meta property="og:site_name" content="INTEGRITY POST" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <link rel="icon" href="/favicon.svg" />
    <meta http-equiv="refresh" content="0; url=${appUrl}" />
  </head><body><script>window.location.replace('${appUrl}');</script></body></html>`);
}
