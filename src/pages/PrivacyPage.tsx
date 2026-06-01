import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const sections = [
  {
    title: 'Informasi yang Kami Kumpulkan',
    content: `Integrity Post mengikuti prosedur standar menggunakan file log. File-file ini mencatat pengunjung ketika mereka mengunjungi situs web. Semua perusahaan hosting melakukan ini dan merupakan bagian dari analisis layanan hosting.

Informasi yang dikumpulkan oleh file log termasuk alamat protokol internet (IP), jenis browser, Penyedia Layanan Internet (ISP), tanggal dan waktu, halaman rujukan/keluar, dan mungkin jumlah klik.

Ini tidak terkait dengan informasi apa pun yang dapat diidentifikasi secara pribadi. Tujuan informasi adalah untuk menganalisis tren, mengelola situs, melacak pergerakan pengguna di situs web dan mengumpulkan informasi demografis.`,
  },
  {
    title: 'Cookies',
    content: `Seperti situs web lainnya, Integrity Post menggunakan 'cookie'. Cookie digunakan untuk menyimpan informasi seperti preferensi pengunjung dan halaman yang diakses atau dikunjungi pengunjung pada situs web ini. Informasi tersebut kami gunakan untuk mengoptimalkan pengalaman pengguna dengan menyesuaikan konten halaman web kami berdasarkan jenis browser pengunjung dan/atau informasi lainnya.`,
  },
  {
    title: 'Kebijakan Privasi Pihak Ketiga',
    content: `Kebijakan INTEGRITY POST tidak berlaku untuk pengiklan atau situs web lain. Karena itu, kami menyarankan Anda untuk membaca seksama masing-masing Kebijakan Privasi dari pihak ketiga untuk informasi yang lebih rinci. Ini mungkin termasuk praktik dan instruksi mereka tentang cara memilih keluar dari opsi tertentu.

Anda berhak untuk menonaktifkan cookies melalui opsi browser individual Anda. Untuk mengetahui informasi lebih rinci tentang manajemen cookie dengan browser web tertentu, dapat ditemukan di situs web browser masing-masing.`,
  },
  {
    title: 'Informasi Anak',
    content: `Salah satu prioritas kami adalah membantu perlindungan untuk anak-anak saat menggunakan internet. Kami mendorong orang tua dan wali untuk mengamati, berpartisipasi, memantau, dan membimbing aktivitas online mereka.

INTEGRITY POST Indonesia tidak dengan sengaja mengumpulkan informasi identifikasi pribadi apa pun dari anak-anak di bawah umur 13 tahun. Jika menurut Anda anak Anda memberikan informasi semacam ini di situs web kami, kami sangat menganjurkan segera menghubungi kami dan kami akan melakukan upaya terbaik kami untuk segera menghapus informasi tersebut dari catatan kami.`,
  },
  {
    title: 'Persetujuan',
    content: `Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui syarat serta ketentuannya.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f0f0f] via-gray-900 to-[#0f0f0f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-[#c40000] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Kebijakan Privasi
            </h1>
            <p className="text-gray-400">INTEGRITY POST — integritypost.id</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-6">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Integrity Post, dapat diakses dari <strong className="text-[#c40000]">https://integritypost.id</strong>, salah satu prioritas utama kami adalah privasi pengunjung. Dokumen Kebijakan Privasi ini berisi jenis informasi yang dikumpulkan dan dicatat oleh integritypost.id dan bagaimana kami menggunakannya.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
            Jika Anda memiliki pertanyaan tambahan atau memerlukan informasi lebih lanjut tentang Kebijakan Privasi kami, jangan ragu untuk menghubungi kami melalui email di <strong>integrity.post@yahoo.com</strong>.
          </p>
        </motion.div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
            >
              <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#c40000] rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0">
                  {i + 1}
                </span>
                {section.title}
              </h2>
              <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}

          {/* Disclaimer */}
          <motion.div
            id="disclaimer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-2xl p-6"
          >
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3">Penyangkalan / Disclaimer</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Isi berita di <strong>INTEGRITY POST</strong> disajikan "sebagaimana adanya" untuk tujuan informasi umum. Meskipun kami berusaha menjaga informasi tetap akurat dan terkini, kami tidak membuat pernyataan atau jaminan dalam bentuk apa pun, tersurat maupun tersirat, tentang kelengkapan, keakuratan, keandalan, kesesuaian, atau ketersediaan berkaitan dengan situs web atau informasi, produk, layanan, atau grafik terkait yang terdapat di situs web untuk tujuan apa pun.
            </p>
          </motion.div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-[#c40000] hover:text-red-700 font-bold text-sm transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
