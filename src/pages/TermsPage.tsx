import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const terms = [
  {
    title: 'Penerimaan Syarat',
    content: 'Dengan mengakses dan menggunakan situs web INTEGRITY POST (integritypost.co), Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui syarat ini, harap jangan menggunakan layanan kami.',
  },
  {
    title: 'Penggunaan Konten',
    content: 'Seluruh konten yang tersedia di INTEGRITY POST, termasuk teks, gambar, grafik, logo, dan data, dilindungi oleh hak cipta milik PT. KOMUNIKA FAKTA GROUP atau pemberi lisensi kami. Anda diizinkan untuk membaca dan berbagi konten kami dengan menyebutkan sumber secara jelas. Reproduksi, distribusi, atau modifikasi konten tanpa izin tertulis dilarang.',
  },
  {
    title: 'Larangan Penggunaan',
    content: `Anda dilarang menggunakan situs ini untuk:
• Menyebarkan informasi palsu, menyesatkan, atau berbahaya
• Melakukan tindakan yang melanggar hukum yang berlaku di Indonesia
• Menyebarkan konten SARA, pornografi, atau kekerasan
• Melakukan aktivitas yang merusak, mengganggu, atau membebani infrastruktur situs
• Mengumpulkan data pengguna lain tanpa izin`,
  },
  {
    title: 'Komentar dan Kontribusi Pengguna',
    content: 'Pengguna yang berkomentar atau berkontribusi di situs ini bertanggung jawab penuh atas konten yang mereka kirimkan. INTEGRITY POST berhak menghapus konten yang melanggar kebijakan editorial atau ketentuan ini tanpa pemberitahuan sebelumnya.',
  },
  {
    title: 'Tautan Pihak Ketiga',
    content: 'Situs kami mungkin berisi tautan ke situs web pihak ketiga. Tautan ini disediakan untuk kenyamanan Anda. INTEGRITY POST tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik situs pihak ketiga mana pun.',
  },
  {
    title: 'Batasan Tanggung Jawab',
    content: 'INTEGRITY POST tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami. Kami tidak menjamin bahwa situs akan selalu tersedia tanpa gangguan atau bebas dari kesalahan.',
  },
  {
    title: 'Hak Cipta dan DMCA',
    content: 'Jika Anda yakin bahwa karya berhak cipta Anda telah digunakan tanpa izin di situs kami, silakan kirimkan pemberitahuan ke integrity.post@yahoo.com dengan informasi lengkap tentang karya yang dilanggar dan lokasi materi yang melanggar di situs kami.',
  },
  {
    title: 'Perubahan Syarat',
    content: 'INTEGRITY POST berhak mengubah Syarat dan Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di situs. Penggunaan berkelanjutan atas layanan kami setelah perubahan berarti Anda menyetujui syarat yang diperbarui.',
  },
  {
    title: 'Hukum yang Berlaku',
    content: 'Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan melalui pengadilan yang berwenang di Indonesia.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-[#0f0f0f] via-gray-900 to-[#0f0f0f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-[#c40000] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Syarat & Ketentuan
            </h1>
            <p className="text-gray-400">Terakhir diperbarui: 15 Januari 2025</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
        {terms.map((term, i) => (
          <motion.div
            key={term.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-7 h-7 bg-[#c40000] rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0">
                {i + 1}
              </span>
              {term.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">{term.content}</p>
          </motion.div>
        ))}

        <div className="bg-gradient-to-r from-[#c40000] to-red-800 text-white rounded-2xl p-6">
          <p className="text-sm leading-relaxed">
            Untuk pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami di{' '}
            <a href="mailto:integrity.post@yahoo.com" className="underline font-bold">integrity.post@yahoo.com</a>
            {' '}atau telepon <a href="tel:081398229284" className="underline font-bold">081398229284</a>.
          </p>
        </div>

        <div className="text-center">
          <Link to="/" className="text-[#c40000] hover:text-red-700 font-bold text-sm transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
