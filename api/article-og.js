// ============================================
// INTEGRITY POST — Open Graph Handler (Supabase)
// ============================================
// Saat link berita dibagikan ke WhatsApp/FB/Telegram,
// file ini memberikan gambar + judul + deskripsi berita.
//
// MODE DEBUG: buka di browser
//   https://integritypost.id/api/article-og?id=ID_BERITA&debug=1
// akan menampilkan JSON (untuk cek apakah gambar terbaca).
// ============================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function absoluteImageUrl(image) {
  if (!image || typeof image !== 'string') return 'https://integritypost.id/logo.png';
  if (image.startsWith('data:')) return 'https://integritypost.id/logo.png';
  if (image.startsWith('//')) return `https:${image}`;
  if (image.startsWith('http://')) return image.replace('http://', 'https://');
  if (image.startsWith('https://')) return image;
  if (image.startsWith('/')) return `https://integritypost.id${image}`;
  return `https://integritypost.id/${image}`;
}

async function getArticle(id) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { error: 'ENV_MISSING', detail: 'VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY tidak terbaca di serverless function' };
  }
  try {
    const url = `${SUPABASE_URL}/rest/v1/articles?id=eq.${encodeURIComponent(id)}&select=*`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      return { error: 'SUPABASE_ERROR', status: response.status, detail: text };
    }

    const rows = await response.json();
    if (Array.isArray(rows) && rows.length > 0) {
      return { article: rows[0] };
    }
    return { error: 'NOT_FOUND', detail: `Berita dengan id "${id}" tidak ditemukan di Supabase` };
  } catch (error) {
    return { error: 'FETCH_ERROR', detail: String(error) };
  }
}

export default async function handler(req, res) {
  const id = req.query.id;
  const isDebug = req.query.debug === '1';
  const version = req.query.v ? String(req.query.v) : '';

  const canonicalUrl = `https://integritypost.id/berita/${encodeURIComponent(id || '')}${version ? `?v=${encodeURIComponent(version)}` : ''}`;
  const appUrl = `/berita/${encodeURIComponent(id || '')}?app=1${version ? `&v=${encodeURIComponent(version)}` : ''}`;

  const result = await getArticle(id);
  const article = result.article || null;

  // ===== MODE DEBUG: tampilkan JSON =====
  if (isDebug) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(JSON.stringify({
      requestedId: id,
      envReadable: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
      supabaseUrlSet: Boolean(SUPABASE_URL),
      supabaseKeySet: Boolean(SUPABASE_ANON_KEY),
      result,
      computedImage: article ? absoluteImageUrl(article.image) : null,
    }, null, 2));
    return;
  }

  const title = article?.title
    ? `${article.title} - Integrity Post`
    : 'INTEGRITY POST - Portal Berita Siber Nasional Terpercaya';
  const description = article?.excerpt || 'Portal berita digital terdepan dengan standar jurnalisme berintegritas di Indonesia.';
  const image = absoluteImageUrl(article?.image);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');

  res.status(200).send(`<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="INTEGRITY POST" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(article?.title || 'Integrity Post')}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta http-equiv="refresh" content="0; url=${appUrl}" />
  </head>
  <body>
    <p>Membuka berita...</p>
    <script>window.location.replace('${appUrl}');</script>
    <noscript><a href="${appUrl}">Buka berita</a></noscript>
  </body>
</html>`);
}
