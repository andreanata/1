# INTEGRITY POST — Portal Berita Siber Nasional

> Portal berita digital dengan **realtime sync** dan **central database**

---

## 🚀 QUICK START

```bash
# Install
npm install

# Development
npm run dev

# Build untuk production
npm run build
```

Build menghasilkan 2 file di folder `dist/`:
- `index.html` — Website lengkap
- `api-config.json` — Konfigurasi backend (edit di server)

---

## 🌐 DEPLOY KE INTEGRITYPOST.ID

### LANGKAH 1: Setup Backend API (5 menit)
Daftar di **https://jsonbin.io/** (gratis), buat bin, copy master key dan bin ID.

📚 **Detail:** Baca **[BACKEND_SETUP.md](./BACKEND_SETUP.md)**

### LANGKAH 2: Upload ke Server
Upload `dist/index.html` dan `dist/api-config.json` ke root domain `integritypost.id`.

### LANGKAH 3: Edit api-config.json
```json
{
  "endpoint": "https://api.jsonbin.io/v3",
  "apiKey": "MASTER_KEY_DARI_JSONBIN",
  "binId": "BIN_ID_DARI_JSONBIN"
}
```

**SELESAI!** Semua pengunjung di seluruh perangkat sekarang melihat data yang sama secara realtime.

---

## ⚡ ARSITEKTUR FULLSTACK

```
                    JSONBin.io API (Cloud Database)
                    ┌──────────────────────────┐
                    │  GET    /api/news        │
                    │  POST   /api/news        │
                    │  PUT    /api/news/:id    │
                    │  DELETE /api/news/:id    │
                    └────────┬─────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐
        │   Admin   │  │  Public   │  │  Public   │
        │ Dashboard │  │  Website  │  │  Website  │
        │           │  │   (HP)    │  │ (Laptop)  │
        └───────────┘  └───────────┘  └───────────┘
        
        ✅ Single source of truth
        ✅ Realtime polling (5 detik)
        ✅ Cross-device sync
        ✅ Offline cache fallback
```

---

## 📋 FITUR

### Public Website
- ✅ Realtime news feed dari API pusat
- ✅ Breaking news ticker
- ✅ Filter kategori (Nasional, Hukum, Politik, dll)
- ✅ Pencarian berita
- ✅ Detail artikel
- ✅ Trending news
- ✅ Sidebar populer & sidebar iklan
- ✅ Newsletter subscription
- ✅ Dark mode (light/dark/auto)
- ✅ Push notification browser
- ✅ Responsive (mobile/tablet/desktop)

### Admin Dashboard (`/admin`)
- ✅ Login dengan CAPTCHA & brute force protection
- ✅ Kelola berita (Create, Read, Update, Delete) → langsung sync ke publik
- ✅ Upload gambar
- ✅ Edit Tautan Redaksi
- ✅ Edit Kontak Redaksi
- ✅ Edit Boks Redaksi
- ✅ Log aktivitas realtime
- ✅ Manajemen sidebar (8 slot)
- ✅ Dashboard analytics (visitor, online users, dll)

### Security
- ✅ Triple-layer authentication (admin / footer editor / security log)
- ✅ Rate limiting (max 3x login attempts)
- ✅ IP blocking (30 menit)
- ✅ XSS protection
- ✅ HTTPS ready
- ✅ JWT-style token
- ✅ Audit logging

---

## 🛠️ TECH STACK

### Frontend
- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **React Router DOM** (SPA routing)
- **Zustand** (state management)
- **Lucide React** (icons)
- **date-fns** (date formatting)

### Backend / Database
- **JSONBin.io** — REST API gratis (default)
- **Firebase Firestore** — alternatif realtime
- **Supabase** — alternatif open-source
- **MongoDB Atlas** — alternatif scalable

### Build
- **vite-plugin-singlefile** → output 1 file HTML
- **Inline CSS + JS** dalam HTML
- Deploy ke static hosting (Vercel, Netlify, cPanel, VPS)

---

## 📁 STRUKTUR PROJECT

```
integrity-post/
├── public/
│   ├── api-config.json     ← Edit di server (runtime config)
│   ├── config.json         ← Firebase config (opsional)
│   ├── favicon.svg
│   ├── favicon.png
│   └── logo.png
├── src/
│   ├── api/
│   │   └── newsApi.ts      ← REST API client (GET/POST/PUT/DELETE)
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── NewsCard.tsx
│   │   ├── Sidebar.tsx
│   │   └── AdminArticleManager.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── ...
│   ├── store/
│   │   ├── articleStore.ts ← Central state, terhubung ke API
│   │   ├── authStore.ts
│   │   ├── adminStore.ts
│   │   ├── footerStore.ts
│   │   ├── redaksiStore.ts
│   │   ├── sidebarStore.ts
│   │   ├── securityStore.ts
│   │   └── themeStore.ts
│   ├── data/
│   │   └── newsData.ts     ← Seed data (initial)
│   ├── services/
│   │   ├── articleService.ts
│   │   ├── databaseClient.ts
│   │   └── types.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── firebase.ts         ← Opsional, untuk Firebase mode
│   └── index.css
├── BACKEND_SETUP.md        ← Panduan setup JSONBin
├── DEPLOY.md               ← Panduan deploy ke server
├── QUICKSTART.md           ← Quick start guide
├── package.json
├── vite.config.ts
└── README.md (file ini)
```

---

## 🔄 CARA KERJA REALTIME

### Scenario 1: Admin Publish Berita
```
1. Admin klik "Publish" di dashboard
2. Article store → POST /api/news → JSONBin
3. Polling di semua browser pengunjung (interval 5 detik)
4. Browser detect data baru → update UI tanpa refresh
```

### Scenario 2: Admin Hapus Berita
```
1. Admin klik "Hapus"
2. Article store → DELETE /api/news/:id → JSONBin
3. Semua browser detect perubahan → berita hilang
```

### Scenario 3: Pengunjung Buka Website
```
1. Website load → load /api-config.json
2. Initialize API client
3. GET /api/news → tampilkan berita
4. Setup polling untuk realtime updates
5. Setup BroadcastChannel untuk same-tab sync
```

---

## 🔐 KREDENSIAL ADMIN DEFAULT

```
Email: integrity.post@yahoo.com
Password: IntegPosT#2507*
```

**Triple-layer security:**
- Admin login: `integrity.post@yahoo.com` / `IntegPosT#2507*`
- Footer editor: `eeeandre660@gmail.com` / `KhuSuSBokSReDaksI#71*`
- Security logs: `AndrEanAtA#23`

⚠️ **GANTI semua password ini sebelum production!**

---

## 💰 BIAYA HOSTING

### Setup Gratis (Recommended untuk Start)
- **Frontend hosting:** Vercel/Netlify (gratis)
- **Domain:** integritypost.id (Anda sudah punya)
- **Backend API:** JSONBin.io free tier (10K request/bulan)
- **TOTAL: Rp 0/bulan** ✅

### Setup Production (untuk traffic tinggi)
- **Frontend hosting:** Vercel Pro ($20/bulan) atau VPS
- **Backend API:** JSONBin Pro ($5/bulan) atau Firebase Pay-as-you-go
- **CDN:** Cloudflare (gratis)
- **TOTAL: $5-25/bulan**

---

## 📞 SUPPORT

- **Email:** integrity.post@yahoo.com
- **Setup help:** Baca `BACKEND_SETUP.md`
- **Deploy help:** Baca `DEPLOY.md`
- **Troubleshooting:** Cek browser console (F12)

---

## 📄 LICENSE

© 2026 INTEGRITY POST. Seluruh hak cipta dilindungi oleh PT. Komunika Fakta Group.

Tunduk pada **Pedoman Pemberitaan Media Siber** yang ditetapkan Dewan Pers Indonesia (3 Februari 2012).

---

**Made with ❤️ for Indonesian journalism**
