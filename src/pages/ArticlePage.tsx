import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Eye, Tag, ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { useArticleStore } from '../store/articleStore';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

function timeAgo(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: id });
  } catch {
    return dateStr;
  }
}

const categoryColors: Record<string, string> = {
  Nasional: 'bg-blue-600',
  Internasional: 'bg-purple-600',
  Politik: 'bg-orange-600',
  Hukum: 'bg-red-700',
  Kriminal: 'bg-zinc-800',
  Ekonomi: 'bg-green-600',
  Teknologi: 'bg-cyan-600',
  Opini: 'bg-pink-600',
  Daerah: 'bg-indigo-600',
};

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const articles = useArticleStore(state => state.articles);
  
  // Filter: hanya tampilkan berita yang sudah waktunya tayang
  const now = new Date();
  const publishedArticles = articles.filter(a => !a.scheduledAt || new Date(a.scheduledAt) <= now);
  const article = publishedArticles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Berita yang Anda cari mungkin sudah dipindahkan atau dihapus.</p>
          <Link to="/" className="bg-[#c40000] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const related = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const catColor = categoryColors[article.category] || 'bg-gray-600';
  const shareVersion = encodeURIComponent(String(article.image || article.date || article.id).slice(-32));
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/berita/${article.id}?v=${shareVersion}`
    : `https://integritypost.id/berita/${article.id}?v=${shareVersion}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#c40000] transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Beranda
          </Link>
          <span>/</span>
          <Link to={`/?category=${article.category}`} className="hover:text-[#c40000] transition-colors">
            {article.category}
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">{article.title.slice(0, 40)}...</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <article className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              {/* Cover Image */}
              <div className="relative h-64 md:h-96">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {article.breaking && (
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="bg-[#c40000] text-white text-xs font-black px-3 py-1 rounded-full"
                    >
                      ● BREAKING
                    </motion.span>
                  )}
                  <span className={`${catColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  {article.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#c40000] rounded-full flex items-center justify-center text-white text-xs font-black">
                      {article.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{article.author}</p>
                      <p className="text-xs text-gray-500">Jurnalis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(article.date)}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {article.views.toLocaleString()} dilihat</span>
                  </div>
                </div>

                {/* Lead */}
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-semibold mb-6 border-l-4 border-[#c40000] pl-4 bg-red-50 dark:bg-red-950/20 py-3 rounded-r-xl">
                  {article.excerpt}
                </p>

                {/* Article Body - Auto-formatted paragraphs */}
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {article.content.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                    <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Tag size={12} /> Tags:
                  </span>
                  {article.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/?search=${tag}`}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full hover:bg-[#c40000] hover:text-white transition-colors font-medium"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                {/* Share Buttons - Icon Only */}
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Share2 size={14} /> Bagikan:
                    </span>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#1877F2] hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                      title="Bagikan ke Facebook"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
                      title="Bagikan ke X (Twitter)"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#25D366] hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
                      title="Bagikan ke WhatsApp"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#0088cc] hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                      title="Bagikan ke Telegram"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(shareUrl);
                        alert('Link berita disalin. Anda bisa membagikannya ke Instagram.');
                      }}
                      className="w-9 h-9 bg-[#E4405F] hover:bg-pink-700 rounded-full flex items-center justify-center transition-colors"
                      title="Salin link untuk Instagram"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5ZM17.2 6.1a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z"/></svg>
                    </button>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-[#0A66C2] hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors"
                      title="Bagikan ke LinkedIn"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.943v5.663H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.114 20.452H3.558V9h3.556v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Articles */}
            {related.length > 0 && (
              <section className="mt-8">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-black text-xl text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                    Berita Terkait
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#c40000] to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((a, i) => (
                    <NewsCard key={a.id} article={a} variant="featured" index={i} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
