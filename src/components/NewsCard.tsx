import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Clock, Tag } from 'lucide-react';
import { NewsArticle } from '../data/newsData';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'hero' | 'featured' | 'standard' | 'compact' | 'sidebar';
  index?: number;
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

function timeAgo(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: id });
  } catch {
    return dateStr;
  }
}

function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function NewsCard({ article, variant = 'standard', index = 0 }: NewsCardProps) {
  const catColor = categoryColors[article.category] || 'bg-gray-600';

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative group overflow-hidden rounded-2xl h-[480px] md:h-[560px] cursor-pointer"
      >
        <Link to={`/berita/${article.id}`}>
          <div className="absolute inset-0">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              {article.breaking && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-[#c40000] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
                >
                  ● BREAKING
                </motion.span>
              )}
              <span className={`${catColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                {article.category}
              </span>
            </div>
            <h2 className="text-white text-xl md:text-3xl font-black leading-tight mb-3 group-hover:text-red-300 transition-colors line-clamp-3" style={{ fontFamily: 'Georgia, serif' }}>
              {article.title}
            </h2>
            <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <span className="font-semibold text-gray-200">{article.author}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(article.date)}</span>
              <span className="flex items-center gap-1"><Eye size={12} /> {formatViews(article.views)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-[#c40000]/30 hover:shadow-xl hover:shadow-red-900/10 dark:hover:shadow-red-900/20 transition-all duration-300"
      >
        <Link to={`/berita/${article.id}`}>
          <div className="relative overflow-hidden h-48">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              {article.breaking && (
                <span className="bg-[#c40000] text-white text-xs font-black px-2 py-0.5 rounded uppercase">BREAKING</span>
              )}
              <span className={`${catColor} text-white text-xs font-bold px-2 py-0.5 rounded`}>
                {article.category}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-gray-900 dark:text-white font-bold text-base leading-snug mb-2 group-hover:text-[#c40000] transition-colors line-clamp-3" style={{ fontFamily: 'Georgia, serif' }}>
              {article.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-3">{article.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-semibold text-gray-600 dark:text-gray-300">{article.author}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(article.date)}</span>
                <span className="flex items-center gap-1"><Eye size={11} /> {formatViews(article.views)}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08 }}
        className="group flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
      >
        <Link to={`/berita/${article.id}`} className="flex gap-3 w-full">
          <div className="relative overflow-hidden rounded-xl w-20 h-16 shrink-0">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`${catColor} text-white text-xs font-bold px-1.5 py-0.5 rounded text-[10px]`}>
              {article.category}
            </span>
            <h4 className="text-gray-900 dark:text-white text-xs font-bold leading-snug mt-1 group-hover:text-[#c40000] transition-colors line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
              {article.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-gray-400 text-[10px]">
              <span className="flex items-center gap-0.5"><Clock size={9} /> {timeAgo(article.date)}</span>
              <span className="flex items-center gap-0.5"><Eye size={9} /> {formatViews(article.views)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08 }}
        className="group flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
      >
        <Link to={`/berita/${article.id}`} className="flex gap-3 w-full">
          <span className="text-2xl font-black text-gray-200 dark:text-gray-700 leading-none w-6 shrink-0 mt-1">
            {(index + 1).toString().padStart(2, '0')}
          </span>
          <div className="flex-1">
            <h4 className="text-gray-900 dark:text-white text-xs font-bold leading-snug group-hover:text-[#c40000] transition-colors line-clamp-3" style={{ fontFamily: 'Georgia, serif' }}>
              {article.title}
            </h4>
            <div className="flex items-center gap-2 mt-1.5 text-gray-400 text-[10px]">
              <span className={`${catColor} text-white px-1.5 py-0.5 rounded text-[9px] font-bold`}>{article.category}</span>
              <span className="flex items-center gap-0.5"><Eye size={9} /> {formatViews(article.views)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Standard
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-[#c40000]/30 hover:shadow-xl dark:hover:shadow-red-900/10 transition-all duration-300 flex gap-0 flex-col sm:flex-row"
    >
      <Link to={`/berita/${article.id}`} className="flex flex-col sm:flex-row w-full">
        <div className="relative overflow-hidden h-48 sm:h-auto sm:w-56 shrink-0">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {article.breaking && (
              <span className="bg-[#c40000] text-white text-[10px] font-black px-2 py-0.5 rounded">BREAKING</span>
            )}
            <span className={`${catColor} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
              {article.category}
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-base leading-snug mb-2 group-hover:text-[#c40000] transition-colors line-clamp-3" style={{ fontFamily: 'Georgia, serif' }}>
              {article.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{article.excerpt}</p>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span className="font-semibold text-gray-600 dark:text-gray-300">{article.author}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(article.date)}</span>
              <span className="flex items-center gap-1"><Eye size={11} /> {formatViews(article.views)}</span>
              <span className="flex items-center gap-1"><Tag size={11} /> {article.tags[0]}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
