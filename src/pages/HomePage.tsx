import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Newspaper, Flame } from 'lucide-react';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import { useArticleStore } from '../store/articleStore';

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const articles = useArticleStore(state => state.articles);

  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const effectiveCategory = categoryParam;

  // Filter: hanya tampilkan berita yang sudah waktunya tayang (scheduledAt <= sekarang atau tidak ada scheduledAt)
  const now = new Date();
  const publishedArticles = articles.filter(a => !a.scheduledAt || new Date(a.scheduledAt) <= now);

  const heroArticles = publishedArticles.filter(a => a.featured).slice(0, 3);
  const trendingArticles = publishedArticles.filter(a => a.trending).slice(0, 6);

  const filteredArticles = useMemo(() => {
    let list = [...publishedArticles];
    if (effectiveCategory) {
      list = list.filter(a => a.category === effectiveCategory);
    }
    if (searchParam) {
      const q = searchParam.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [publishedArticles, effectiveCategory, searchParam]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const isFiltered = !!effectiveCategory || !!searchParam;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        {!isFiltered && (
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2">
                {heroArticles[0] && <NewsCard article={heroArticles[0]} variant="hero" index={0} />}
              </div>
              <div className="space-y-4">
                {heroArticles.slice(1, 3).map((article, i) => (
                  <NewsCard key={article.id} article={article} variant="featured" index={i + 1} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trending Section */}
        {!isFiltered && trendingArticles.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-[#c40000]" />
                <h2 className="font-black text-xl text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                  Trending Sekarang
                </h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-[#c40000] to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {trendingArticles.map((article, i) => (
                <NewsCard key={article.id} article={article} variant="featured" index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Main Content + Sidebar (fuller layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Newspaper size={20} className="text-[#c40000]" />
                <h2 className="font-black text-xl text-gray-900 dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                  {searchParam
                    ? `Hasil Pencarian: "${searchParam}"`
                    : effectiveCategory
                    ? `Berita ${effectiveCategory}`
                    : 'Berita Terbaru'}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#c40000] to-transparent hidden sm:block"></div>
              </div>
            </div>

            {paginatedArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedArticles.map((article, i) => (
                  <NewsCard key={article.id} article={article} variant="featured" index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-semibold">Tidak ada berita ditemukan.</p>
                <p className="text-sm mt-1">Coba kata kunci atau kategori lain.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      p === page
                        ? 'bg-[#c40000] text-white shadow-lg shadow-red-900/30'
                        : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
