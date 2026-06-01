// ============================================
// INTEGRITY POST — Article Store
// ============================================

import { create } from 'zustand';
import { NewsArticle } from '../data/newsData';
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  subscribeToNews
} from '../api/newsApi';

interface ArticleState {
  articles: NewsArticle[];
  loading: boolean;
  addArticle: (article: NewsArticle) => Promise<void>;
  updateArticle: (id: string, article: NewsArticle) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  subscribeRealtime: () => () => void;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  loading: true,

  addArticle: async (article) => {
    await createNews(article);
    const fresh = await getAllNews();
    set({ articles: fresh, loading: false });
  },

  updateArticle: async (id, article) => {
    await updateNews(id, article);
    const fresh = await getAllNews();
    set({ articles: fresh, loading: false });
  },

  deleteArticle: async (id) => {
    await deleteNews(id);
    const fresh = await getAllNews();
    set({ articles: fresh, loading: false });
  },

  subscribeRealtime: () => {
    return subscribeToNews((data) => {
      set({ articles: data, loading: false });
    });
  },
}));
