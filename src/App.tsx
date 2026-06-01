import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import PedomanPage from './pages/PedomanPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { useArticleStore } from './store/articleStore';
import { useSidebarStore } from './store/sidebarStore';
import { loadApiConfig, isApiConfigured } from './api/newsApi';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const { initTheme } = useThemeStore();
  const subscribeRealtime = useArticleStore(state => state.subscribeRealtime);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    (async () => {
      await loadApiConfig();
      const connected = isApiConfigured();
      console.info(
        `%c[INTEGRITY POST]%c Database: ${connected ? '☁️ SUPABASE — Realtime WebSocket ON' : '⚠️ OFFLINE — Set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di Vercel'}`,
        'font-weight:bold;color:#c40000;font-size:13px',
        connected ? 'color:#22c55e;font-weight:bold' : 'color:#f97316;font-weight:bold'
      );
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const unsubArticles = subscribeRealtime();
    const unsubSidebars = useSidebarStore.getState().subscribeRealtime();
    return () => {
      unsubArticles();
      unsubSidebars();
    };
  }, [ready, subscribeRealtime]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <span className="font-black text-4xl text-[#c40000]" style={{ fontFamily: 'Georgia, serif' }}>INTEGRITY</span>
            <span className="font-black text-4xl text-white ml-2" style={{ fontFamily: 'Georgia, serif' }}>POST</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-[#c40000] rounded-full animate-pulse"></div>
            Menghubungkan ke server...
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #374151',
          },
        }}
      />
      <Routes>
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/berita/:id" element={<PublicLayout><ArticlePage /></PublicLayout>} />
        <Route path="/tentang" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/privasi" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
        <Route path="/pedoman" element={<PublicLayout><PedomanPage /></PublicLayout>} />
        <Route path="/kontak" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/syarat" element={<PublicLayout><TermsPage /></PublicLayout>} />
        <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
