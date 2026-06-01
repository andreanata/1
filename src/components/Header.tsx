import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CalendarDays, Menu, Monitor, Moon, Search, Sun, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const navItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Nasional', to: '/?category=Nasional' },
  { label: 'Hukum', to: '/?category=Hukum' },
  { label: 'Politik', to: '/?category=Politik' },
  { label: 'Kriminal', to: '/?category=Kriminal' },
  { label: 'Ekonomi', to: '/?category=Ekonomi' },
  { label: 'Teknologi', to: '/?category=Teknologi' },
  { label: 'Opini', to: '/?category=Opini' },
  { label: 'Daerah', to: '/?category=Daerah' },
  { label: 'Internasional', to: '/?category=Internasional' },
  { label: '|', to: '#', separator: true },
  { label: 'Tentang', to: '/tentang' },
  { label: 'Redaksi', to: '/tentang#redaksi' },
  { label: 'Kontak', to: '/kontak' },
];

const Logo = () => (
  <Link to="/" className="flex items-center select-none">
    <div className="flex flex-col">
      <span className="flex items-baseline leading-none">
        <span className="font-black text-2xl tracking-tighter text-[#071022] dark:text-white sm:text-3xl md:text-4xl" style={{ fontFamily: 'Georgia, serif' }}>
          INTEGRITY
        </span>
        <span className="ml-1 font-black text-2xl tracking-tighter text-[#c40000] sm:text-3xl md:text-4xl" style={{ fontFamily: 'Georgia, serif' }}>
          POST
        </span>
      </span>
      <div className="mt-0.5 flex justify-between">
        {'TAJAM, INVESTIGATIF, & TERPERCAYA'.split('').map((char, i) => (
          <span key={i} className="text-[7px] font-black uppercase text-slate-500 dark:text-slate-400 sm:text-[8px] md:text-[10px]">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

const ThemeToggle = () => {
  const { mode, setMode } = useThemeStore();

  const options = [
    { value: 'light', icon: Sun },
    { value: 'dark', icon: Moon },
    { value: 'auto', icon: Monitor },
  ] as const;

  const current = options.find(o => o.value === mode) || options[2];
  const Icon = current.icon;
  const nextMode = options[(options.findIndex(o => o.value === mode) + 1) % options.length].value;

  return (
    <button
      onClick={() => setMode(nextMode)}
      aria-label="Ganti tema"
      title="Ganti tema"
      className="flex h-6 w-6 items-center justify-center rounded-full text-gray-300 transition-all hover:bg-white/10 hover:text-white sm:h-7 sm:w-7"
    >
      <Icon size={12} className="sm:hidden" />
      <Icon size={14} className="hidden sm:block" />
    </button>
  );
};

const breakingItems = [
  {
    category: 'NASIONAL',
    title: 'Anggaran 2026: Efisiensi Birokrasi Melalui AI dan Integrasi Data Nasional',
    id: '1',
  },
  {
    category: 'HUKUM',
    title: 'Pemberantasan Mafia Peradilan: Mahkamah Agung Terapkan Pengawasan Digital',
    id: '2',
  },
  {
    category: 'EKONOMI',
    title: 'Rupiah Menguat di Tengah Sentimen Pasar Global',
    id: '8',
  },
  {
    category: 'TEKNOLOGI',
    title: 'Indonesia Luncurkan AI Nasional untuk Pelayanan Publik',
    id: '4',
  },
  {
    category: 'POLITIK',
    title: 'Peta Koalisi Partai Menjelang Pilkada Serentak 2026',
    id: '2',
  },
];



export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('notificationsEnabled') === 'true');
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active nav based on current URL
  const activeNavIndex = (() => {
    if (location.pathname === '/tentang') {
      if (location.hash === '#redaksi') return navItems.findIndex(i => i.label === 'Redaksi');
      return navItems.findIndex(i => i.label === 'Tentang');
    }
    if (location.pathname === '/kontak') return navItems.findIndex(i => i.label === 'Kontak');
    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      const cat = params.get('category');
      if (cat) return navItems.findIndex(i => i.label === cat);
      return 0;
    }
    return -1;
  })();

  const todayShort = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
  const todayLong = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      if (!('Notification' in window)) {
        alert('Browser Anda belum mendukung notifikasi.');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        localStorage.setItem('notificationsEnabled', 'true');
        setNotificationsEnabled(true);
        new Notification('INTEGRITY POST', {
          body: 'Notifikasi berita terbaru berhasil diaktifkan.',
        });
      }
      return;
    }
    localStorage.setItem('notificationsEnabled', 'false');
    setNotificationsEnabled(false);
  };

  return (
    <>
      <div className="bg-[#0f0f0f] px-4 text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap sm:gap-4">
            <Link
              to="/admin/login"
              aria-label=""
              title=""
              className="group flex h-5 w-1.5 items-center justify-center rounded-sm bg-[#0f0f0f] opacity-0 transition-opacity hover:opacity-100"
            >
              <span className="h-3 w-0.5 rounded-full bg-gray-700 group-hover:bg-[#c40000]"></span>
            </Link>
            <span className="flex items-center gap-1.5 font-semibold text-gray-200 sm:gap-2">
              <CalendarDays size={12} className="shrink-0 text-[#c40000] sm:size-[13]" />
              <span className="hidden sm:inline">{todayLong}</span>
              <span className="sm:hidden">{todayShort}</span>
            </span>
            <span className="hidden h-4 w-px bg-gray-700 sm:block"></span>
            <span className="hidden text-gray-300 md:inline">CDN: Optimal & Cepat</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleNotifications}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors sm:h-7 sm:w-7 ${
                notificationsEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-[#c40000] text-white hover:bg-red-700'
              }`}
              aria-label={notificationsEnabled ? 'Matikan notifikasi' : 'Aktifkan notifikasi'}
              title={notificationsEnabled ? 'Matikan notifikasi' : 'Aktifkan notifikasi'}
            >
              <Bell size={11} className="sm:hidden" />
              <Bell size={12} className="hidden sm:block" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b border-gray-200 bg-white transition-shadow dark:border-gray-800 dark:bg-[#0f0f0f] ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:py-5">
          <Logo />

          <div className="hidden max-w-xl flex-1 items-center gap-3 md:flex">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari berita atau topik terkini..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#c40000] focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-red-950"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#c40000]">
                  <X size={16} />
                </button>
              )}
            </form>
            <button
              type="submit"
              onClick={handleSearch}
              className="rounded-xl bg-[#071022] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#c40000]"
            >
              Cari
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <nav className="overflow-x-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0f0f0f]">
          <div className="mx-auto flex max-w-7xl min-w-max items-center px-4">
            {navItems.map((item, index) =>
              item.separator ? (
                <span key={`sep-${index}`} className="px-3 font-black text-gray-300 dark:text-gray-700">|</span>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`relative px-3 py-3 text-[11px] font-black uppercase tracking-wide transition-colors md:px-4 md:py-4 md:text-xs ${
                    index === activeNavIndex
                      ? 'text-white'
                      : 'text-gray-700 hover:text-[#c40000] dark:text-gray-300 dark:hover:text-[#c40000]'
                  }`}
                >
                  {index === activeNavIndex && (
                    <motion.span
                      layoutId="active-nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 z-0 bg-[#c40000]"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              )
            )}
          </div>
        </nav>

        <motion.div
          initial={false}
          animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
          className="overflow-hidden border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-[#0f0f0f] md:hidden"
        >
          <div className="mx-auto space-y-3 px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari berita atau topik terkini..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-900 outline-none focus:border-[#c40000] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#c40000]">
                  <X size={16} />
                </button>
              )}
            </form>
            <div className="grid grid-cols-2 gap-1">
              {navItems.filter(item => !item.separator).map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-red-50 hover:text-[#c40000] dark:text-gray-300 dark:hover:bg-red-950/30"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      <div
        className="overflow-hidden border-b border-black bg-[#181818] text-white"
        onMouseEnter={() => setTickerPaused(true)}
        onMouseLeave={() => setTickerPaused(false)}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-4 px-3 sm:px-4">
          <span className="my-2 whitespace-nowrap rounded bg-[#c40000] px-2 py-1 text-[9px] font-black uppercase tracking-wide sm:px-3 sm:py-1.5 sm:text-[10px]">
            Breaking News
          </span>
          <div className="flex-1 overflow-hidden">
            <div
              className="flex items-center whitespace-nowrap py-2"
              style={{
                width: `${breakingItems.length * 2}00%`,
                animation: `ticker 40s linear infinite${tickerPaused ? ' paused' : ''}`,
              }}
            >
              {breakingItems.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => navigate(`/berita/${item.id}`)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#c40000] transition-colors mr-12"
                  title="Lihat berita lengkap"
                >
                  <span className="rounded bg-[#c40000]/20 px-1.5 py-0.5 text-[10px] font-black text-[#c40000]">
                    [{item.category}]
                  </span>
                  <span>{item.title}</span>
                </button>
              ))}
              {breakingItems.map((item, i) => (
                <button
                  key={`dup-${i}`}
                  type="button"
                  onClick={() => navigate(`/berita/${item.id}`)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-[#c40000] transition-colors mr-12"
                  title="Lihat berita lengkap"
                >
                  <span className="rounded bg-[#c40000]/20 px-1.5 py-0.5 text-[10px] font-black text-[#c40000]">
                    [{item.category}]
                  </span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
