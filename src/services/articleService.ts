// ============================================
// INTEGRITY POST — Article Service
// ============================================

import type { Article, NewArticle } from './types';
import { getDatabaseClient } from './databaseClient';

class ArticleService {
  private static instance: ArticleService;

  static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  async getAll(): Promise<Article[]> {
    const client = await getDatabaseClient();
    if (!client) {
      console.warn('Database client not available, using local fallback');
      return [];
    }
    return client.getArticles();
  }

  async getById(id: string): Promise<Article | null> {
    const client = await getDatabaseClient();
    if (!client) return null;
    return client.getArticle(id);
  }

  async create(article: NewArticle, userId?: string): Promise<Article> {
    const client = await getDatabaseClient();
    if (!client) throw new Error('Database client not available');

    const articleWithMeta = {
      ...article,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    } as any;

    const newArticle = await client.createArticle(articleWithMeta);

    // Audit log
    await this.logAction('create', 'article', newArticle.id, userId || 'system', {
      title: article.title,
    });

    return newArticle;
  }

  async update(id: string, updates: Partial<Article>, userId?: string): Promise<void> {
    const client = await getDatabaseClient();
    if (!client) throw new Error('Database client not available');

    await client.updateArticle(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });

    await this.logAction('update', 'article', id, userId || 'system', updates);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const client = await getDatabaseClient();
    if (!client) throw new Error('Database client not available');

    await client.deleteArticle(id);

    await this.logAction('delete', 'article', id, userId || 'system', { deleted: true });
  }

  async publish(id: string, userId?: string): Promise<void> {
    await this.update(id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    }, userId);
  }

  async schedule(id: string, scheduledAt: string, userId?: string): Promise<void> {
    await this.update(id, {
      status: 'scheduled',
      scheduledAt,
    }, userId);
  }

  subscribeRealtime(callback: (articles: Article[]) => void): () => void {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const client = await getDatabaseClient();
      if (!client) {
        console.warn('Realtime subscription unavailable without database client');
        return;
      }
      unsubscribe = client.subscribeArticles(callback);
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }

  private async logAction(
    action: 'create' | 'update' | 'delete' | 'publish' | 'schedule',
    entityType: 'article' | 'user' | 'category',
    entityId: string,
    userId: string,
    details: Record<string, unknown>
  ): Promise<void> {
    const client = await getDatabaseClient();
    if (!client) return;

    try {
      await client.addAuditLog({
        action,
        entityType,
        entityId,
        userId,
        details,
      });
    } catch (error) {
      console.warn('Failed to log audit action:', error);
    }
  }
}

export const articleService = ArticleService.getInstance();
