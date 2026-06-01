import { ExternalLink, TrendingUp } from 'lucide-react';
import NewsCard from './NewsCard';
import { useSidebarStore, SidebarSlot } from '../store/sidebarStore';
import { useArticleStore } from '../store/articleStore';

function SidebarImage({ item }: { item: SidebarSlot }) {
  if (!item.image) return null;

  // Sidebar panjang: tinggi 700px (portrait, seperti contoh majalah), gambar utuh tidak terpotong
  // Sidebar normal: tinggi mengikuti rasio gambar
  const isLong = item.type === 'long';

  const body = (
    <div className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${isLong ? 'h-[700px] flex items-center justify-center' : ''}`}>
      <img
        src={item.image}
        alt={item.title}
        className={`block w-full transition-transform duration-500 group-hover:scale-[1.02] ${isLong ? 'max-h-full object-contain' : 'h-auto'}`}
        loading="lazy"
      />
      {item.url && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink size={14} className="text-white drop-shadow" />
          </div>
        </>
      )}
    </div>
  );

  if (!item.url) return body;
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.title}>
      {body}
    </a>
  );
}

export default function Sidebar() {
  const slots = useSidebarStore(state => state.slots);
  const articles = useArticleStore(state => state.articles);
  
  // Filter: hanya tampilkan berita yang sudah waktunya tayang
  const now = new Date();
  const publishedArticles = articles.filter(a => !a.scheduledAt || new Date(a.scheduledAt) <= now);
  const popularArticles = [...publishedArticles].sort((a, b) => b.views - a.views).slice(0, 6);
  const normalSlots = slots.filter(slot => slot.type === 'normal' && slot.enabled && slot.image);
  const longSlots = slots.filter(slot => slot.type === 'long' && slot.enabled && slot.image);

  return (
    <aside className="space-y-5">
      {normalSlots.length > 0 && (
        <div className="space-y-4">
          {normalSlots.map(item => <SidebarImage key={item.id} item={item} />)}
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-800">
          <TrendingUp size={18} className="text-[#c40000]" />
          <h3 className="text-base font-black text-gray-900 dark:text-white">Berita Terpopuler</h3>
        </div>
        <div>
          {popularArticles.map((article, i) => (
            <NewsCard key={article.id} article={article} variant="sidebar" index={i} />
          ))}
        </div>
      </div>

      {longSlots.length > 0 && (
        <div className="space-y-4">
          {longSlots.map(item => <SidebarImage key={item.id} item={item} />)}
        </div>
      )}
    </aside>
  );
}
