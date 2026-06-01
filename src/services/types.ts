// ============================================
// INTEGRITY POST — Database Types
// ============================================

export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  views: number;
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  status: ArticleStatus;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  updatedBy?: string;
}

export type NewArticle = Omit<Article, 'id'>;

export type UserRole = 'super_admin' | 'editor' | 'reporter' | 'visitor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'schedule';
  entityType: 'article' | 'user' | 'category';
  entityId: string;
  userId: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export type DatabaseProvider = 'firebase' | 'supabase';
