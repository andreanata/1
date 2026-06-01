import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const pedomanSections = [
  {
    number: '1',
    title: 'Ruang Lingkup',
    content: `Media Siber adalah segala bentuk media yang menggunakan wahana internet dan melaksanakan kegiatan jurnalistik, serta memenuhi persyaratan Undang-Undang Pers dan Standar Perusahaan Pers yang ditetapkan Dewan Pers.

Isi Buatan Pengguna (User Generated Content) adalah segala isi yang dibuat dan atau dipublikasikan oleh pengguna media siber, antara lain artikel, gambar, komentar, suara, video, blog, forum, komentar pembaca, dan bentuk unggahan lain.`,
  },
  {
    number: '2',
    title: 'Verifikasi dan Keberimbangan Berita',
    content: `Pada prinsipnya setiap berita harus melalui verifikasi.

Berita yang dapat merugikan pihak lain memerlukan verifikasi pada berita yang sama untuk memenuhi prinsip akurasi dan keberimbangan.

Ketentuan tersebut dapat dikecualikan bila berita benar-benar mengandung kepentingan publik yang mendesak, sumber pertama jelas identitasnya, kredibel, kompeten, dan subyek berita tidak diketahui keberadaannya atau tidak dapat diwawancarai.

Media wajib memberikan penjelasan kepada pembaca bahwa berita tersebut masih memerlukan verifikasi lebih lanjut dan wajib meneruskan upaya verifikasi. Hasil verifikasi dicantumkan pada berita pemutakhiran dengan tautan pada berita sebelumnya.`,
  },
  {
    number: '3',
    title: 'Isi Buatan Pengguna',
    content: `Media siber wajib mencantumkan syarat dan ketentuan mengenai Isi Buatan Pengguna yang tidak bertentangan dengan Undang-Undang No. 40 Tahun 1999 tentang Pers dan Kode Etik Jurnalistik.

Pengguna wajib melakukan registrasi dan menyetujui bahwa konten yang dipublikasikan tidak memuat kebohongan, fitnah, sadisme, pornografi, SARA, ajakan kekerasan, atau diskriminasi.

Media siber berwenang mengedit atau menghapus Isi Buatan Pengguna yang melanggar, menyediakan mekanisme pengaduan, dan melakukan koreksi selambat-lambatnya 2 x 24 jam setelah pengaduan diterima.`,
  },
  {
    number: '4',
    title: 'Ralat, Koreksi, dan Hak Jawab',
    content: `Ralat, koreksi, dan hak jawab mengacu pada Undang-Undang Pers, Kode Etik Jurnalistik, dan Pedoman Hak Jawab yang ditetapkan Dewan Pers.

Setiap ralat, koreksi, atau hak jawab wajib ditautkan pada berita terkait dan mencantumkan waktu pemuatannya.

Media lain yang mengutip berita wajib melakukan koreksi yang sama. Media yang tidak melakukan koreksi bertanggung jawab atas akibat hukum dari berita yang tidak dikoreksi tersebut.

Media siber yang tidak melayani hak jawab dapat dijatuhi sanksi pidana denda paling banyak Rp500.000.000.`,
  },
  {
    number: '5',
    title: 'Pencabutan Berita',
    content: `Berita yang sudah dipublikasikan tidak dapat dicabut karena alasan penyensoran dari pihak luar redaksi, kecuali terkait SARA, kesusilaan, masa depan anak, pengalaman traumatik korban, atau pertimbangan khusus lain yang ditetapkan Dewan Pers.

Media siber lain wajib mengikuti pencabutan kutipan berita dari media asal yang telah dicabut. Pencabutan berita wajib disertai alasan dan diumumkan kepada publik.`,
  },
  {
    number: '6',
    title: 'Iklan',
    content: `Media siber wajib membedakan dengan tegas antara produk berita dan iklan.

Setiap artikel atau isi berbayar wajib mencantumkan keterangan advertorial, iklan, ads, sponsored, atau kata lain yang menjelaskan bahwa konten tersebut adalah iklan.`,
  },
  {
    number: '7',
    title: 'Hak Cipta',
    content: `Media siber wajib menghormati hak cipta sebagaimana diatur dalam peraturan perundang-undangan yang berlaku.`,
  },
  {
    number: '8',
    title: 'Pencantuman Pedoman',
    content: `Media siber wajib mencantumkan Pedoman Pemberitaan Media Siber ini di medianya secara terang dan jelas.`,
  },
  {
    number: '9',
    title: 'Sengketa',
    content: `Penilaian akhir atas sengketa mengenai pelaksanaan Pedoman Pemberitaan Media Siber ini diselesaikan oleh Dewan Pers.`,
  },
];

export default function PedomanPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f0f0f] via-gray-900 to-[#0f0f0f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-[#c40000] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Pedoman Pemberitaan Media Siber
            </h1>
            <p className="text-gray-400">Jakarta, 3 Februari 2012 — Ditetapkan oleh Dewan Pers Indonesia</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Pembuka */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 mb-8">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dilindungi Pancasila, Undang-Undang Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB. Keberadaan media siber di Indonesia juga merupakan bagian dari kemerdekaan pers.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Media siber memiliki karakter khusus sehingga memerlukan pedoman agar pengelolaannya dilaksanakan secara profesional, memenuhi fungsi, hak, dan kewajibannya sesuai Undang-Undang Nomor 40 Tahun 1999 tentang Pers dan Kode Etik Jurnalistik.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4">
          {pedomanSections.map((section, i) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#c40000] rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                  {section.number}
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3">{section.title}</h2>
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gradient-to-r from-[#c40000] to-red-800 text-white rounded-2xl p-6 text-center"
        >
          <p className="font-bold mb-1">Jakarta, 3 Februari 2012</p>
          <p className="text-red-100 text-sm">
            Pedoman ini ditandatangani oleh Dewan Pers dan komunitas pers di Jakarta, Indonesia.
          </p>
        </motion.div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-[#c40000] hover:text-red-700 font-bold text-sm transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
