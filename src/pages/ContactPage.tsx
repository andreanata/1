import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';

const ADMIN_EMAIL = 'integrity.post@yahoo.com';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sanitize = (val: string) => val.replace(/[<>'"&;]/g, '');

  const spamKeywords = ['spam', 'scam', 'hack', 'virus', 'phishing', 'bitcoin', 'crypto', 'investasi cepat', 'uang gratis', 'hadiah', 'lotre', 'klik di sini', 'klik disini', 'http://', 'https://', 'www.', '.com', '.net', '.org', 'admin', 'root', 'test', 'testing', 'asdasd', 'qwerty', '123456'];

  const isSpam = (text: string) => {
    const lower = text.toLowerCase();
    return spamKeywords.some(k => lower.includes(k));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const safeName = sanitize(form.name.trim());
    const safeEmail = sanitize(form.email.trim());
    const safePhone = sanitize(form.phone.trim());
    const safeSubject = sanitize(form.subject.trim());
    const safeMessage = sanitize(form.message.trim());

    if (!safeName || !safeEmail || !safeSubject || !safeMessage) {
      setError('Semua field wajib diisi.');
      return;
    }

    if (isSpam(safeName) || isSpam(safeEmail) || isSpam(safeSubject) || isSpam(safeMessage)) {
      setError('Pesan Anda terdeteksi mencurigakan dan tidak dapat dikirim.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeEmail)) {
      setError('Format email tidak valid.');
      return;
    }

    setLoading(true);

    const mailBody = `Nama: ${safeName}%0ATelepon: ${safePhone || '-'}%0AEmail: ${safeEmail}%0ASubjek: ${safeSubject}%0A%0APesan:%0A${safeMessage}`;
    const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(safeSubject)}&body=${mailBody}`;

    window.open(mailtoUrl, '_blank');

    setLoading(false);
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0f0f0f] via-gray-900 to-[#0f0f0f] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-[#c40000] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={28} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Hubungi Kami
            </h1>
            <p className="text-gray-400">Kami siap membantu Anda 24/7</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              {
                icon: MapPin,
                title: 'Alamat Redaksi',
                content: 'Komp. Perkantoran Win Grand Blok A-G No. 9\nJl. K.H. Noer Ali Kalimalang\nJati Mulya, Tambun Selatan\nKab. Bekasi, Jawa Barat',
              },
              {
                icon: Phone,
                title: 'Telepon/WhatsApp',
                content: '081398229284',
                href: 'tel:081398229284',
              },
              {
                icon: Mail,
                title: 'Email Redaksi',
                content: 'integrity.post@yahoo.com',
                href: 'mailto:integrity.post@yahoo.com',
              },
            ].map(({ icon: Icon, title, content, href }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#c40000] rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1">{title}</h3>
                    {href ? (
                      <a href={href} className="text-gray-600 dark:text-gray-400 text-sm hover:text-[#c40000] transition-colors whitespace-pre-line">
                        {content}
                      </a>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">{content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="font-black text-gray-900 dark:text-white text-sm mb-3">Media Sosial</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map(platform => (
                  <a
                    key={platform}
                    href="#"
                    className="text-center py-2 px-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-[#c40000] hover:text-white transition-all text-xs font-bold"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Kirim Pesan</h2>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Pesan Terkirim!</h3>
                <p className="text-gray-500 mb-6">Terima kasih. Tim kami akan merespons dalam 1x24 jam.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#c40000] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 font-semibold">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: sanitize(e.target.value) }))}
                      required
                      placeholder="Nama Anda"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c40000] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                      placeholder="email@example.com"
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c40000] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: sanitize(e.target.value) }))}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c40000] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subjek *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: sanitize(e.target.value) }))}
                    required
                    placeholder="Topik pesan Anda"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c40000] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Pesan *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: sanitize(e.target.value) }))}
                    required
                    rows={6}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c40000] focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c40000] text-white font-black py-3.5 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Send size={16} />
                    </motion.div>
                  ) : (
                    <Send size={16} />
                  )}
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>
            )}
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
