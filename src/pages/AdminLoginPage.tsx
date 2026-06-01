import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b} = ?`, answer: (a + b).toString() };
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoggedIn, getBlockedMinutesLeft } = useAdminStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [blockedMins, setBlockedMins] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const mins = getBlockedMinutesLeft();
    setBlockedMins(mins);
    if (mins > 0) {
      const interval = setInterval(() => {
        const m = getBlockedMinutesLeft();
        setBlockedMins(m);
        if (m <= 0) clearInterval(interval);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [getBlockedMinutesLeft]);

  // Sanitize input against XSS
  const sanitize = (val: string) => val.replace(/[<>'"&;]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const safeEmail = sanitize(email.trim());
    const safePassword = sanitize(password);

    if (!safeEmail || !safePassword) {
      setMessage({ type: 'error', text: 'Email dan password wajib diisi.' });
      return;
    }

    if (captchaInput.trim() !== captcha.answer) {
      setMessage({ type: 'error', text: 'Jawaban CAPTCHA salah. Coba lagi.' });
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    setLoading(true);
    // Simulate network delay for security
    await new Promise(r => setTimeout(r, 1200));

    const result = await login(safeEmail, safePassword);
    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } else {
      setMessage({ type: 'error', text: result.message });
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      setBlockedMins(getBlockedMinutesLeft());
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-gray-900 to-[#0f0f0f]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c40000] via-red-500 to-[#c40000]" />
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(196,0,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(196,0,0,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="mb-2">
              <span className="font-black text-3xl text-[#c40000]" style={{ fontFamily: 'Georgia, serif' }}>INTEGRITY</span>
              <span className="font-black text-3xl text-white ml-2" style={{ fontFamily: 'Georgia, serif' }}>POST</span>
            </div>
            <p className="text-gray-500 text-sm">Tajam, Investigatif, & Terpercaya</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#c40000] to-red-800 p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg">LOGIN REDAKSI</h1>
              <p className="text-red-200 text-xs">Silakan masuk untuk melanjutkan</p>
            </div>
          </div>

          {/* Blocked Warning */}
          <AnimatePresence>
            {blockedMins > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-orange-900/30 border-b border-orange-700/30 px-6 py-3 flex items-center gap-2"
              >
                <AlertTriangle size={16} className="text-orange-400 shrink-0" />
                <p className="text-orange-300 text-xs">
                  IP Anda diblokir sementara. Sisa waktu blokir: <strong>{blockedMins} menit</strong>. Email notifikasi telah dikirim ke administrator.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                    message.type === 'error'
                      ? 'bg-red-900/30 border border-red-700/30 text-red-300'
                      : 'bg-green-900/30 border border-green-700/30 text-green-300'
                  }`}
                >
                  {message.type === 'error' ? <AlertTriangle size={16} className="shrink-0 mt-0.5" /> : <CheckCircle size={16} className="shrink-0 mt-0.5" />}
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Masukkan email"
                required
                disabled={blockedMins > 0 || loading}
                autoComplete="username"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c40000] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  disabled={blockedMins > 0 || loading}
                  autoComplete="current-password"
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 pr-12 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c40000] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CAPTCHA */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">
                Verifikasi CAPTCHA
              </label>
              <div className="flex gap-3 items-center">
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-white font-bold text-lg tracking-widest" style={{ fontFamily: 'monospace', letterSpacing: '0.2em' }}>
                    {captcha.question}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setCaptcha(generateCaptcha()); setCaptchaInput(''); }}
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
                <input
                  type="text"
                  value={captchaInput}
                  onChange={e => setCaptchaInput(e.target.value)}
                  placeholder="Jawab"
                  maxLength={3}
                  disabled={blockedMins > 0 || loading}
                  className="w-24 bg-gray-800 border border-gray-700 rounded-xl px-3 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c40000] text-center disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={blockedMins > 0 || loading}
              className="w-full bg-[#c40000] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw size={16} />
                  </motion.div>
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  MASUK KE DASHBOARD
                </>
              )}
            </button>


          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 text-xs hover:text-gray-300 transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
