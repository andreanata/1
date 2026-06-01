import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Target, Eye, Users, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { useRedaksiStore } from '../store/redaksiStore';

export default function AboutPage() {
  const redaksiData = useRedaksiStore(state => state.items);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f0f0f] via-gray-900 to-[#0f0f0f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-4">
              <span className="font-black text-4xl md:text-5xl text-[#c40000]" style={{ fontFamily: 'Georgia, serif' }}>INTEGRITY</span>
              <span className="font-black text-4xl md:text-5xl text-white ml-3" style={{ fontFamily: 'Georgia, serif' }}>POST</span>
            </div>
            <p className="text-gray-400 text-lg">Portal Berita Siber Nasional Terpercaya</p>
            <div className="h-1 w-24 bg-[#c40000] mx-auto mt-4"></div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* About */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 size={22} className="text-[#c40000]" /> Tentang INTEGRITY POST
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            <strong>INTEGRITY POST</strong> adalah portal berita siber nasional yang menjunjung tinggi kode etik jurnalistik, akurasi fakta, dan integritas pemberitaan tanpa kompromi. Didirikan oleh <strong>PT. KOMUNIKA FAKTA GROUP</strong>, kami berkomitmen menyajikan berita yang tajam, investigatif, dan terpercaya.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Tim redaksi kami terdiri dari wartawan berpengalaman yang telah terverifikasi Dewan Pers. Kami percaya bahwa kebebasan pers adalah pilar demokrasi yang harus dijaga dengan penuh tanggung jawab.
          </p>
        </motion.section>

        {/* Visi Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye size={20} className="text-[#c40000]" /> Visi
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Menjadi portal berita digital terdepan dengan standar jurnalisme berintegritas di Indonesia.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-[#c40000]" /> Misi
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              {[
                'Menyajikan berita akurat dan berimbang',
                'Menjunjung tinggi kode etik jurnalistik',
                'Mendorong transparansi dan akuntabilitas publik',
                'Menjadi penjaga demokrasi melalui pemberitaan bebas dan bertanggung jawab',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#c40000] font-black mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Legal Info */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Award size={22} className="text-[#c40000]" /> Data Perusahaan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Nama Perusahaan', value: 'PT. KOMUNIKA FAKTA GROUP' },
              { label: 'Akta Pendirian', value: '01/Tanggal 03 Nop 2022' },
              { label: 'Pengesahan Badan Hukum', value: 'Keputusan Menteri Hukum dan HAM RI' },
              { label: 'Nomor SK', value: 'AHU-0076775.AH.01.01.Tahun 2022' },
              { label: 'NIB', value: '1511220130279' },
              { label: 'NPWP', value: '61.662.643.8-435.000' },
              { label: 'SKT', value: 'S-38698/KT/KPP.221.303/2022' },
              { label: 'Rekening Bank', value: 'Bank BJB: 0130838049001\na/n PT. Komunika Fakta Group' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-gray-900 dark:text-white font-bold text-sm whitespace-pre-line">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Boks Redaksi */}
        <motion.section id="redaksi" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users size={22} className="text-[#c40000]" /> Boks Redaksi
          </h2>
          <div className="space-y-3">
            {redaksiData.map(({ role, name }) => (
              <div key={role} className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-[#c40000] font-black text-xs uppercase tracking-wide sm:w-56 shrink-0">{role}:</span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400 text-xs italic">
              <strong>Catatan Redaksi:</strong> Nama yang tidak tercantum dalam Boks Redaksi bukan tanggung jawab Redaksi.
            </p>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#c40000] to-red-800 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-black mb-6">Kantor Redaksi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="shrink-0 mt-1" />
              <div>
                <p className="font-bold mb-1">Alamat</p>
                <p className="text-red-100 text-sm">Komp. Perkantoran Win Grand Blok A-G No. 9, Jl. K.H. Noer Ali Kalimalang, Jati Mulya, Tambun Selatan, Kab. Bekasi, Jawa Barat</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="shrink-0 mt-1" />
              <div>
                <p className="font-bold mb-1">Telepon/WhatsApp</p>
                <a href="tel:081398229284" className="text-red-100 text-sm hover:text-white">081398229284</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="shrink-0 mt-1" />
              <div>
                <p className="font-bold mb-1">Email</p>
                <a href="mailto:integrity.post@yahoo.com" className="text-red-100 text-sm hover:text-white">integrity.post@yahoo.com</a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="text-[#c40000] hover:text-red-700 font-bold text-sm transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
