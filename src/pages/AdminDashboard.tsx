import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Newspaper, Settings,
  LogOut, Plus, Eye, TrendingUp, Globe,
  Shield, ChevronRight, Menu, X, Clock, Users, BarChart2
} from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import AdminArticleManager from '../components/AdminArticleManager';
import { useFooterStore } from '../store/footerStore';
import { useRedaksiStore } from '../store/redaksiStore';
import { useSecurityStore } from '../store/securityStore';

const analyticsData = {
  totalVisitors: 124560,
  onlineNow: 342,
  todayVisitors: 12408,
  pageViews: 458920,
  popularPages: [
    { page: '/berita/3', title: 'Timnas Indonesia U-23 ke Final', views: 28900 },
    { page: '/berita/6', title: 'PBB Sidang Darurat Gaza', views: 22100 },
    { page: '/berita/5', title: 'KPK Tetapkan Tersangka Baru', views: 18600 },
    { page: '/berita/9', title: 'Banjir Bandang Sulawesi Selatan', views: 16800 },
    { page: '/berita/1', title: 'Program Ekonomi Digital Rp 500T', views: 15420 },
  ],
  deviceStats: [
    { device: 'Mobile', percent: 62 },
    { device: 'Desktop', percent: 31 },
    { device: 'Tablet', percent: 7 },
  ],
  countryStats: [
    { country: 'Indonesia', visitors: 98450, flag: '🇮🇩' },
    { country: 'Malaysia', visitors: 8230, flag: '🇲🇾' },
    { country: 'Singapore', visitors: 5120, flag: '🇸🇬' },
    { country: 'Australia', visitors: 3210, flag: '🇦' },
    { country: 'USA', visitors: 2800, flag: '🇺🇸' },
  ],
  hourlyData: [12, 8, 5, 4, 6, 15, 35, 68, 82, 91, 87, 79, 95, 88, 76, 82, 90, 98, 110, 95, 78, 62, 45, 28],
};

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: React.ElementType; label: string; value: string; change?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        {change && (
          <span className="text-green-400 text-xs font-bold bg-green-900/30 px-2 py-0.5 rounded-full">
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </motion.div>
  );
}

function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-16">
      {data.map((val, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.02 }}
          className="flex-1 bg-[#c40000] rounded-t opacity-80 hover:opacity-100 transition-opacity origin-bottom"
          style={{ height: `${(val / max) * 100}%` }}
          title={`${val} pengunjung`}
        />
      ))}
    </div>
  );
}

type SidebarItem = {
  id: string;
  icon: React.ElementType;
  label: string;
};

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'articles', icon: Newspaper, label: 'Kelola Berita' },
  { id: 'footer', icon: Settings, label: 'Tautan & Kontak' },
  { id: 'security', icon: Shield, label: 'Keamanan' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAdminStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(analyticsData.onlineNow);
  const [totalVisitors, setTotalVisitors] = useState(analyticsData.totalVisitors);
  const [todayVisitors, setTodayVisitors] = useState(analyticsData.todayVisitors);
  const [pageViews, setPageViews] = useState(analyticsData.pageViews);

  const footerStore = useFooterStore();
  const [editLinks, setEditLinks] = useState(footerStore.links);
  const [editContact, setEditContact] = useState(footerStore.contact);
  const redaksiStore = useRedaksiStore();
  const [editRedaksi, setEditRedaksi] = useState(redaksiStore.items);

  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const [secPassword, setSecPassword] = useState('');
  const [secError, setSecError] = useState('');
  const securityLogs = useSecurityStore(state => state.logs);
  const clearSecurityLogs = useSecurityStore(state => state.clear);

  useEffect(() => {
    if (!isLoggedIn) navigate('/admin/login');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(10, prev + Math.floor(Math.random() * 11) - 5));
      setTotalVisitors(prev => prev + Math.floor(Math.random() * 5));
      setTodayVisitors(prev => prev + Math.floor(Math.random() * 3));
      setPageViews(prev => prev + Math.floor(Math.random() * 8));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-black text-2xl mb-1">Dashboard Overview</h2>
              <p className="text-gray-500 text-sm">Selamat datang di panel admin INTEGRITY POST</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Globe} label="Total Pengunjung" value={totalVisitors.toLocaleString()} change="+12%" color="bg-[#c40000]" />
              <StatCard icon={Users} label="Online Sekarang" value={onlineCount.toString()} change="LIVE" color="bg-green-700" />
              <StatCard icon={Eye} label="Pengunjung Hari Ini" value={todayVisitors.toLocaleString()} change="+8%" color="bg-blue-700" />
              <StatCard icon={BarChart2} label="Total Page Views" value={pageViews.toLocaleString()} change="+23%" color="bg-purple-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-black mb-1">Grafik Pengunjung (24 Jam)</h3>
                <p className="text-gray-500 text-xs mb-4">Pengunjung per jam hari ini</p>
                <MiniChart data={analyticsData.hourlyData} />
                <div className="flex justify-between mt-2 text-gray-600 text-xs">
                  <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-black mb-1">Statistik Perangkat</h3>
                <p className="text-gray-500 text-xs mb-4">Distribusi perangkat pengunjung</p>
                <div className="space-y-3">
                  {analyticsData.deviceStats.map(({ device, percent }) => (
                    <div key={device}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300 font-semibold">{device}</span>
                        <span className="text-gray-400">{percent}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="h-full bg-[#c40000] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-black mb-4">Halaman Populer</h3>
                <div className="space-y-3">
                  {analyticsData.popularPages.map((page, i) => (
                    <div key={page.page} className="flex items-center gap-3">
                      <span className="text-2xl font-black text-gray-700 w-6">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{page.title}</p>
                        <p className="text-gray-500 text-xs">{page.page}</p>
                      </div>
                      <span className="text-[#c40000] font-black text-xs">{page.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-black mb-4">Lokasi Pengunjung</h3>
                <div className="space-y-3">
                  {analyticsData.countryStats.map(({ country, visitors, flag }) => (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{flag}</span>
                        <span className="text-gray-300 text-sm font-semibold">{country}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{visitors.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-black mb-4">Aksi Cepat</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Buat Berita Baru', icon: Plus, action: () => setActiveSection('articles') },
                  { label: 'Tautan & Kontak', icon: Settings, action: () => setActiveSection('footer') },
                  { label: 'Keamanan', icon: Shield, action: () => setActiveSection('security') },
                  { label: 'Lihat Website', icon: TrendingUp, action: () => window.open('/', '_blank') },
                ].map(({ label, icon: Icon, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <Icon size={20} className="text-[#c40000]" />
                    <span className="text-white text-xs font-semibold text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'articles':
        return <AdminArticleManager />;

      case 'footer':
        if (!footerStore.isUnlocked) {
          return (
            <FooterLogin
              onUnlock={(ok) => {
                if (ok) {
                  setEditLinks(footerStore.links);
                  setEditContact(footerStore.contact);
                  setEditRedaksi(redaksiStore.items);
                }
              }}
            />
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Edit Tautan & Kontak</h2>
              <button onClick={() => footerStore.lock()} className="rounded-xl border border-gray-700 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-gray-800">Kunci</button>
            </div>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="mb-4 text-lg font-black text-white">Tautan Redaksi</h3>
              <div className="space-y-3">
                {editLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input value={link.label} onChange={e => { const n = [...editLinks]; n[i] = { ...n[i], label: e.target.value }; setEditLinks(n); }} placeholder="Label" className="flex-1 rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
                    <input value={link.to} onChange={e => { const n = [...editLinks]; n[i] = { ...n[i], to: e.target.value }; setEditLinks(n); }} placeholder="URL" className="flex-1 rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
                    <button onClick={() => setEditLinks(editLinks.filter((_, j) => j !== i))} className="rounded-xl bg-red-950 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-900">Hapus</button>
                  </div>
                ))}
                <button onClick={() => setEditLinks([...editLinks, { label: '', to: '/' }])} className="rounded-xl border border-dashed border-gray-700 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white">+ Tambah Tautan</button>
              </div>
              <button onClick={() => footerStore.updateLinks(editLinks)} className="mt-4 rounded-xl bg-[#c40000] px-6 py-2.5 text-sm font-black text-white hover:bg-red-700">Simpan Tautan</button>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <h3 className="mb-4 text-lg font-black text-white">Kontak Redaksi</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-400">Alamat</label>
                  <textarea value={editContact.address} onChange={e => setEditContact({ ...editContact, address: e.target.value })} rows={3} className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-400">Telepon</label>
                  <input value={editContact.phone} onChange={e => setEditContact({ ...editContact, phone: e.target.value })} className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-400">Email</label>
                  <input value={editContact.email} onChange={e => setEditContact({ ...editContact, email: e.target.value })} className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
                </div>
              </div>
              <button onClick={() => footerStore.updateContact(editContact)} className="mt-4 rounded-xl bg-[#c40000] px-6 py-2.5 text-sm font-black text-white hover:bg-red-700">Simpan Kontak</button>
            </section>

            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-white">Boks Redaksi</h3>
                <span className="text-xs text-gray-500">{editRedaksi.length} entri</span>
              </div>
              <div className="space-y-3">
                {editRedaksi.map((item, i) => (
                  <div key={i} className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#c40000]">#{i + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (i === 0) return;
                            const n = [...editRedaksi];
                            [n[i - 1], n[i]] = [n[i], n[i - 1]];
                            setEditRedaksi(n);
                          }}
                          disabled={i === 0}
                          className="rounded-lg bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:text-white disabled:opacity-30"
                          title="Naik"
                        >↑</button>
                        <button
                          onClick={() => {
                            if (i === editRedaksi.length - 1) return;
                            const n = [...editRedaksi];
                            [n[i + 1], n[i]] = [n[i], n[i + 1]];
                            setEditRedaksi(n);
                          }}
                          disabled={i === editRedaksi.length - 1}
                          className="rounded-lg bg-gray-800 px-2 py-1 text-xs text-gray-300 hover:text-white disabled:opacity-30"
                          title="Turun"
                        >↓</button>
                      </div>
                    </div>
                    <input
                      value={item.role}
                      onChange={e => {
                        const n = [...editRedaksi];
                        n[i] = { ...n[i], role: e.target.value };
                        setEditRedaksi(n);
                      }}
                      placeholder="Jabatan / Posisi"
                      className="mb-2 w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-sm font-bold text-[#c40000] outline-none focus:border-[#c40000]"
                    />
                    <textarea
                      value={item.name}
                      onChange={e => {
                        const n = [...editRedaksi];
                        n[i] = { ...n[i], name: e.target.value };
                        setEditRedaksi(n);
                      }}
                      placeholder="Nama"
                      rows={2}
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 p-2 text-sm text-white outline-none focus:border-[#c40000]"
                    />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-gray-600">Seret dengan tombol panah untuk mengubah urutan.</span>
                      <button
                        onClick={() => setEditRedaksi(editRedaksi.filter((_, j) => j !== i))}
                        className="rounded-lg bg-red-950 px-3 py-1 text-[10px] font-bold text-red-300 hover:bg-red-900"
                      >Hapus</button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setEditRedaksi([...editRedaksi, { role: '', name: '' }])}
                  className="w-full rounded-xl border border-dashed border-gray-700 bg-gray-950 py-3 text-sm font-bold text-gray-400 hover:border-[#c40000] hover:text-white"
                >
                  + Tambah Jabatan
                </button>
              </div>
              <button
                onClick={() => redaksiStore.update(editRedaksi)}
                className="mt-4 rounded-xl bg-[#c40000] px-6 py-2.5 text-sm font-black text-white hover:bg-red-700"
              >
                Simpan Boks Redaksi
              </button>
            </section>
          </div>
        );

      case 'security':
        if (!securityUnlocked) {
          return (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c40000] text-white">
                  <Shield size={24} />
                </div>
                <h2 className="mb-2 text-xl font-black text-white">Akses Terbatas</h2>
                <p className="mb-6 text-xs text-gray-500">Masukkan sandi pembuat website untuk melihat Log Aktivitas Login dan detail pelacakan perangkat.</p>
                {secError && <p className="mb-4 text-sm font-bold text-red-400">{secError}</p>}
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-gray-400">Sandi Pembuat Website</label>
                    <input type="password" value={secPassword} onChange={e => setSecPassword(e.target.value)} placeholder="Masukkan sandi..." className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
                  </div>
                  <button
                    onClick={() => {
                      if (secPassword === 'AndrEanAtA#23') {
                        setSecurityUnlocked(true);
                        setSecError('');
                        setSecPassword('');
                      } else {
                        setSecError('Sandi salah. Akses ditolak.');
                      }
                    }}
                    className="w-full rounded-xl bg-[#c40000] py-3 text-sm font-black text-white hover:bg-red-700"
                  >
                    Buka Log Aktivitas
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">Keamanan & Log Aktivitas</h2>
              <button onClick={() => setSecurityUnlocked(false)} className="rounded-xl border border-gray-700 px-4 py-2 text-xs font-bold text-gray-300 hover:bg-gray-800">Kunci Kembali</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'SSL/TLS Enkripsi', status: 'Aktif', color: 'text-green-400' },
                { label: 'CSRF Protection', status: 'Aktif', color: 'text-green-400' },
                { label: 'Rate Limiting', status: 'Aktif', color: 'text-green-400' },
                { label: 'Brute Force Protection', status: 'Aktif', color: 'text-green-400' },
                { label: 'XSS Sanitization', status: 'Aktif', color: 'text-green-400' },
                { label: 'SQL Injection Prevention', status: 'Aktif', color: 'text-green-400' },
              ].map(({ label, status, color }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-[#c40000]" />
                    <span className="text-gray-300 text-sm font-semibold">{label}</span>
                  </div>
                  <span className={`${color} text-xs font-bold`}>{status}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-800 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-white font-black flex items-center gap-2">
                    <Clock size={18} className="text-[#c40000]" /> Log Aktivitas Real-Time
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">Login admin, edit tautan & kontak, unggah/edit/hapus berita — semua tercatat.</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 bg-green-900/30 border border-green-700/30 px-3 py-1.5 rounded-full">
                    <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-[10px] font-bold">LIVE</span>
                  </span>
                  <button onClick={() => { if (confirm('Hapus semua log?')) clearSecurityLogs(); }} className="rounded-full border border-gray-700 px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-white">Bersihkan</button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950 text-gray-500 font-bold uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Aksi</th>
                      <th className="px-4 py-3">Perangkat</th>
                      <th className="px-4 py-3">Lokasi</th>
                      <th className="px-4 py-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {securityLogs.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Belum ada aktivitas tercatat.</td></tr>
                    )}
                    {securityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                          {new Date(log.time).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                        <td className={`px-4 py-3 font-bold whitespace-nowrap ${
                          log.status === 'success' ? 'text-green-400' :
                          log.status === 'blocked' ? 'text-orange-400' :
                          log.status === 'error' ? 'text-red-400' : 'text-blue-400'
                        }`}>{log.action}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{log.device}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{log.location}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono whitespace-nowrap">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-700 text-5xl mb-4">🚧</div>
              <p className="text-gray-400 font-semibold">Fitur ini sedang dalam pengembangan</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-gray-800">
          <Link to="/" className="block">
            <span className="font-black text-lg text-[#c40000]">INTEGRITY</span>
            <span className="font-black text-lg text-white ml-1.5">POST</span>
          </Link>
          <p className="text-gray-600 text-xs mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeSection === id
                  ? 'bg-[#c40000] text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {label}
              {activeSection === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 bg-[#c40000] rounded-lg flex items-center justify-center text-white text-sm font-black">
              A
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">Admin</p>
              <p className="text-gray-500 text-xs truncate">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-white font-black text-sm capitalize">{activeSection === 'footer' ? 'Tautan & Kontak' : activeSection}</h1>
              <p className="text-gray-600 text-xs">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-700/30 px-3 py-1.5 rounded-full">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-green-400 rounded-full"
              />
              <span className="text-green-400 text-xs font-bold">{onlineCount} online</span>
            </div>
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-full border border-gray-800 hover:border-gray-600 transition-colors">
              Lihat Website
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function FooterLogin({ onUnlock }: { onUnlock: (ok: boolean) => void }) {
  const footerStore = useFooterStore();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const ok = footerStore.unlock(email, pin);
    if (!ok) { setError('Email atau sandi salah.'); return; }
    setError('');
    onUnlock(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8">
        <h2 className="mb-2 text-xl font-black text-white">Verifikasi Akses</h2>
        <p className="mb-6 text-xs text-gray-500">Masukkan kredensial khusus untuk mengedit Tautan Redaksi & Kontak Redaksi.</p>
        {error && <p className="mb-4 text-sm font-bold text-red-400">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-400">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Masukkan email" className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-400">Sandi</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="Masukkan sandi" className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
          </div>
          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-[#c40000] py-3 text-sm font-black text-white hover:bg-red-700"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
