# INTEGRITY POST - Production Deployment Guide
## Sistem Realtime Cloud Database untuk integritypost.id

### 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRITY POST                            │
│                 integritypost.id                             │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   ADMIN      │         │  FRONTEND    │         │   PUBLIC     │
│  DASHBOARD   │         │   (React)    │         │   WEBSITE    │
│              │◄───────►│              │◄───────►│              │
│ /admin       │         │ /            │         │ /berita/:id  │
└──────────────┘         └──────────────┘         └──────────────┘
         │                        │                         │
         └────────────────────────┼─────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   DATABASE CLOUD (Realtime)│
                    │                           │
                    │  ┌─────────┐  ┌────────┐  │
                    │  │Firebase │  │Supabase│  │
                    │  │Firestore│  │Postgres│  │
                    │  └─────────┘  └────────┘  │
                    └───────────────────────────┘
```

### 📋 Persyaratan Produksi

#### 1. Domain & Hosting
- Domain: `integritypost.id`
- Hosting: Vercel, Netlify, atau VPS
- SSL Certificate: Wajib (HTTPS)
- CDN: Cloudflare (direkomendasikan)

#### 2. Cloud Database (Pilih salah satu)

**Opsi A: Firebase Firestore**
```bash
# 1. Buat project di https://console.firebase.google.com/
# 2. Aktifkan Firestore Database
# 3. Copy konfigurasi dari Project Settings

# Environment Variables:
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Opsi B: Supabase PostgreSQL**
```bash
# 1. Buat project di https://supabase.com/
# 2. Install Supabase CLI: npm install -g supabase
# 3. Initialize: supabase init

# Environment Variables:
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### 3. Setup Database Schema

**Firebase Firestore Collections:**
```
articles/
  - id: string
  - title: string
  - excerpt: string
  - content: string
  - category: string
  - author: string
  - date: string
  - image: string
  - tags: string[]
  - views: number
  - featured: boolean
  - breaking: boolean
  - trending: boolean
  - status: 'draft' | 'published' | 'scheduled' | 'archived'
  - scheduledAt: string
  - publishedAt: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - createdBy: string
  - updatedBy: string

users/
  - id: string
  - email: string
  - role: 'super_admin' | 'editor' | 'reporter' | 'visitor'
  - displayName: string
  - createdAt: timestamp
  - lastLoginAt: timestamp

audit_logs/
  - id: string
  - action: 'create' | 'update' | 'delete' | 'publish' | 'schedule'
  - entityType: 'article' | 'user' | 'category'
  - entityId: string
  - userId: string
  - timestamp: timestamp
  - details: object
```

**Supabase Tables:**
```sql
-- Run this in Supabase SQL Editor

CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category VARCHAR(50),
  author VARCHAR(100),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  breaking BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'visitor',
  display_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(20) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  user_id UUID REFERENCES auth.users(id),
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE articles;

-- Indexes for performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_date ON articles(date DESC);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

CREATE POLICY "Articles can be created by authenticated users"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Articles can be updated by authenticated users"
  ON articles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Articles can be deleted by authenticated users"
  ON articles FOR DELETE
  TO authenticated
  USING (true);
```

### 🚀 Deployment Steps

#### Step 1: Setup Environment
```bash
# Clone repository
git clone https://github.com/your-org/integrity-post.git
cd integrity-post

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.production
```

#### Step 2: Configure Environment
```bash
# Edit .env.production dengan credentials database Anda

# Untuk Firebase:
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=xxxxx

# Untuk Supabase (alternatif):
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

#### Step 3: Build Production
```bash
# Build untuk production
npm run build

# Test build locally
npm run preview
```

#### Step 4: Deploy ke Hosting

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**VPS (Nginx):**
```bash
# Copy build files
scp -r dist/* user@your-server:/var/www/integritypost/

# Nginx configuration
server {
    listen 80;
    server_name integritypost.id www.integritypost.id;
    root /var/www/integritypost;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # No cache for HTML
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}

# SSL with Let's Encrypt
certbot --nginx -d integritypost.id -d www.integritypost.id
```

### 🔐 Security Best Practices

#### 1. Environment Variables
- **JANGAN** commit `.env.production` ke git
- Tambahkan ke `.gitignore`
- Gunakan secrets manager di hosting platform

#### 2. Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Articles - public read, authenticated write
    match /articles/{articleId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }

    // Users - only authenticated users can read
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   request.auth.uid == userId;
    }

    // Audit logs - read-only for authenticated users
    match /audit_logs/{logId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

#### 3. Supabase RLS Policies
- Sudah termasuk di schema SQL di atas
- Sesuaikan dengan kebutuhan role-based access

### 📊 Monitoring & Analytics

#### 1. Google Analytics
```bash
# Tambahkan ke .env.production
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

#### 2. Error Monitoring
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure di src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

#### 3. Performance Monitoring
- Google PageSpeed Insights
- Web Vitals tracking
- Real User Monitoring (RUM)

### 🔄 Maintenance

#### Backup Database
```bash
# Firebase
firebase firestore:export gs://your-bucket/backup-$(date +%Y%m%d)

# Supabase
supabase db dump -f backup.sql
```

#### Update Application
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build
npm run build

# Deploy
vercel --prod
```

### 🆘 Troubleshooting

#### Issue: Data tidak sync realtime
**Solution:**
1. Cek Firebase/Supabase credentials di environment variables
2. Pastikan realtime subscription aktif di console
3. Cek browser console untuk error messages
4. Verify database rules/RLS policies

#### Issue: Login gagal terus
**Solution:**
1. Clear browser cache dan cookies
2. Cek credentials di database
3. Verify JWT token expiration
4. Check browser console untuk CORS errors

#### Issue: Build gagal
**Solution:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run build -- --no-cache
```

### 📞 Support

Untuk bantuan teknis:
- Email: integrity.post@yahoo.com
- Documentation: https://docs.integritypost.id
- GitHub Issues: https://github.com/your-org/integrity-post/issues

---

**Last Updated:** May 2026
**Version:** 1.0.0
**Domain:** integritypost.id
