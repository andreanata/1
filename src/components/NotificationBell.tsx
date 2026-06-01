import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Newspaper, TrendingUp, AlertTriangle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'breaking',
    title: 'Breaking News',
    message: 'Presiden Lantik 12 Menteri Baru dalam Reshuffle Kabinet',
    time: '2 menit lalu',
    read: false,
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: 'trending',
    title: 'Trending',
    message: 'Timnas Indonesia U-23 Melaju ke Final Piala Asia',
    time: '15 menit lalu',
    read: false,
    icon: TrendingUp,
  },
  {
    id: 3,
    type: 'news',
    title: 'Berita Terbaru',
    message: 'KPK Tetapkan Tersangka Baru Kasus Korupsi Alkes',
    time: '1 jam lalu',
    read: true,
    icon: Newspaper,
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors relative"
      >
        <Bell size={20} />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-4 h-4 bg-[#c40000] text-white text-[9px] font-black rounded-full flex items-center justify-center"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-[#c40000]" />
                  <span className="font-black text-gray-900 dark:text-white text-sm">Notifikasi</span>
                  {unread > 0 && (
                    <span className="bg-[#c40000] text-white text-xs font-black px-1.5 py-0.5 rounded-full">
                      {unread}
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#c40000] hover:text-red-700 font-semibold"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    Tidak ada notifikasi
                  </div>
                ) : (
                  notifs.map(notif => {
                    const Icon = notif.icon;
                    return (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 p-4 transition-colors ${!notif.read ? 'bg-red-50 dark:bg-red-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!notif.read ? 'bg-[#c40000]' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          <Icon size={14} className={!notif.read ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#c40000] mb-0.5">{notif.title}</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                        <button
                          onClick={() => dismiss(notif.id)}
                          className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                <button className="w-full text-center text-xs text-[#c40000] hover:text-red-700 font-semibold py-1.5">
                  Lihat semua notifikasi
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
