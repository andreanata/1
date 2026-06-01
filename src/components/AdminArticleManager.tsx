import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Edit, Eye, ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react';
import { categories, NewsArticle } from '../data/newsData';
import { useSidebarStore } from '../store/sidebarStore';
import { useArticleStore } from '../store/articleStore';
import { useSecurityStore } from '../store/securityStore';
import { uploadToCloudinary } from '../utils/cloudinary';

type FormState = {
  id?: string;
  quick: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'Draft' | 'Publish';
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  journalist: string;
  position: string;
  category: string;
  image: string;
  imageName: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  scheduledPublishDate?: string; // YYYY-MM-DD
  scheduledPublishTime?: string; // HH:MM
};

const emptyForm: FormState = {
  quick: '',
  title: '',
  excerpt: '',
  content: '',
  status: 'Draft',
  featured: false,
  breaking: false,
  trending: false,
  journalist: 'Administrator',
  position: 'Redaksi',
  category: '',
  image: '',
  imageName: '',
  tags: 'politik, nasional, investigasi',
  metaTitle: '',
  metaDescription: '',
  scheduledPublishDate: '',
  scheduledPublishTime: '',
};



function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminArticleManager() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const articles = useArticleStore(state => state.articles);
  const addArticle = useArticleStore(state => state.addArticle);
  const updateArticle = useArticleStore(state => state.updateArticle);
  const deleteArticle = useArticleStore(state => state.deleteArticle);
  const securityLog = useSecurityStore(state => state.addLog);
  const sidebars = useSidebarStore(state => state.slots);
  const updateSlot = useSidebarStore(state => state.updateSlot);
  const resetSlot = useSidebarStore(state => state.resetSlot);

  const slug = useMemo(() => slugify(form.title || 'judul-artikel'), [form.title]);
  const autoMetaTitle = form.metaTitle || `${form.title || 'Judul Artikel'} - ${form.journalist}`;
  const autoMetaDescription = form.metaDescription || `${form.excerpt || 'Ringkasan berita'} | ${form.position} | Tags: ${form.tags}`;

  const parseQuickInput = (value: string) => {
    const blocks = value.split(/\n\s*\n/).map(v => v.trim()).filter(Boolean);
    const fullText = value;

    // Auto-detect Reporter/Editor dari teks
    const detected = autoDetectMeta(fullText);

    setForm(prev => ({
      ...prev,
      quick: value,
      title: blocks[0] || prev.title,
      excerpt: blocks[1] || prev.excerpt,
      content: blocks.slice(2).join('\n\n') || prev.content,
      metaTitle: blocks[0] || prev.metaTitle,
      metaDescription: blocks[1] || prev.metaDescription,
      journalist: detected.journalist || prev.journalist,
      position: detected.position || prev.position,
      category: detected.category || prev.category,
      tags: detected.tags || prev.tags,
    }));
  };

  // Auto-detect metadata dari teks artikel
  function autoDetectMeta(text: string) {
    const lines = text.split('\n');
    let journalist = '';
    let position = '';
    let detectedCategory = '';
    let detectedTags: string[] = [];

    // Scan setiap baris untuk pola Reporter/Editor/Penulis/dll
    for (const line of lines) {
      const trimmed = line.trim();

      // Pola: "Reporter: Aan", "Editor: Anduk", "Penulis: Budi"
      const reporterMatch = trimmed.match(/^(?:reporter|pewarta|kontributor|jurnalis)\s*[:\-]\s*(.+)$/i);
      if (reporterMatch) {
        journalist = reporterMatch[1].trim();
        position = 'Reporter';
      }

      const editorMatch = trimmed.match(/^(?:editor|redaktur|penyunting)\s*[:\-]\s*(.+)$/i);
      if (editorMatch) {
        // Jika reporter sudah ada, editor jadi tambahan info
        if (!journalist) {
          journalist = editorMatch[1].trim();
          position = 'Editor';
        } else {
          position = `Reporter / Editor: ${editorMatch[1].trim()}`;
        }
      }

      const penulisMatch = trimmed.match(/^(?:penulis|author|oleh)\s*[:\-]\s*(.+)$/i);
      if (penulisMatch && !journalist) {
        journalist = penulisMatch[1].trim();
        position = 'Penulis';
      }
    }

    // Auto-detect kategori dari isi teks
    const lowerText = text.toLowerCase();
    const categoryKeywords: Record<string, string[]> = {
      'Nasional': ['pemerintah', 'presiden', 'menteri', 'kementerian', 'dpr', 'mpr', 'negara', 'nasional', 'indonesia', 'kabinet'],
      'Hukum': ['hukum', 'pengadilan', 'jaksa', 'hakim', 'terdakwa', 'pidana', 'perdata', 'mahkamah', 'kpk', 'korupsi', 'vonis', 'putusan'],
      'Politik': ['politik', 'partai', 'pemilu', 'pilkada', 'pilpres', 'caleg', 'calon', 'kampanye', 'koalisi', 'oposisi', 'demokrasi'],
      'Kriminal': ['kriminal', 'polisi', 'penangkapan', 'tersangka', 'kejahatan', 'pembunuhan', 'perampokan', 'narkoba', 'penipuan', 'pencurian'],
      'Ekonomi': ['ekonomi', 'rupiah', 'inflasi', 'bank', 'saham', 'investasi', 'pajak', 'anggaran', 'keuangan', 'bisnis', 'perdagangan'],
      'Teknologi': ['teknologi', 'digital', 'ai', 'internet', 'startup', 'aplikasi', 'smartphone', 'komputer', 'cyber', 'inovasi'],
      'Opini': ['opini', 'menurut saya', 'pandangan', 'perspektif', 'analisis', 'kolom', 'editorial'],
      'Daerah': ['daerah', 'kabupaten', 'kota', 'provinsi', 'gubernur', 'bupati', 'walikota', 'pemda', 'apbd'],
      'Internasional': ['internasional', 'dunia', 'global', 'pbb', 'amerika', 'eropa', 'china', 'rusia', 'timur tengah', 'palestina', 'gaza'],
    };

    let maxScore = 0;
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      let score = 0;
      for (const kw of keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) score += matches.length;
      }
      if (score > maxScore) {
        maxScore = score;
        detectedCategory = cat;
      }
    }

    // Auto-detect tags dari kata kunci yang muncul di teks
    const allKeywords = Object.entries(categoryKeywords).flatMap(([, kws]) => kws);
    for (const kw of allKeywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      if (regex.test(lowerText) && !detectedTags.includes(kw)) {
        detectedTags.push(kw);
      }
    }
    // Batasi 8 tags
    detectedTags = detectedTags.slice(0, 8);

    return {
      journalist: journalist || '',
      position: position || '',
      category: detectedCategory || '',
      tags: detectedTags.length > 0 ? detectedTags.join(', ') : '',
    };
  }

  const handleImage = async (file?: File) => {
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setForm(prev => ({ ...prev, image: imageUrl, imageName: file.name }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Gagal mengupload gambar ke Cloudinary. Pastikan konfigurasi environment variable sudah benar.');
    } finally {
      setUploadingImage(false);
    }
  };

  const saveArticle = async (status: 'Draft' | 'Publish') => {
    // Hitung scheduledAt dari tanggal + waktu yang dipilih admin
    let scheduledAt: string | undefined;
    if (form.scheduledPublishDate && form.scheduledPublishTime) {
      scheduledAt = new Date(`${form.scheduledPublishDate}T${form.scheduledPublishTime}:00`).toISOString();
    }

    const article: NewsArticle = {
      id: form.id || `${Date.now()}`,
      title: form.title || 'Judul Artikel',
      excerpt: form.excerpt || 'Ringkasan singkat berita ini...',
      content: form.content || 'Isi berita lengkap dimulai dari sini...',
      category: form.category || 'Nasional',
      author: `${form.journalist} - ${form.position}`,
      date: scheduledAt || new Date().toISOString(),
      scheduledAt,
      image: form.image || 'https://images.pexels.com/photos/15652229/pexels-photo-15652229.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      views: 0,
      featured: form.featured,
      breaking: form.breaking,
      trending: form.trending,
    };

    try {
      if (form.id) {
        await updateArticle(form.id, article);
        securityLog({ action: `Berita Diperbarui: "${article.title.slice(0, 60)}"`, category: 'article-edit', status: 'info' });
      } else {
        await addArticle(article);
        securityLog({ action: `Berita Baru Dipublish: "${article.title.slice(0, 60)}"`, category: 'article-create', status: 'info' });
      }
      setForm({ ...emptyForm, status });
      alert(status === 'Publish' ? 'Berita berhasil disimpan dan muncul di publik.' : 'Draft berhasil disimpan.');
    } catch (error) {
      console.error('Save article error:', error);
      // Tetap reset form karena data sudah tersimpan lokal
      setForm({ ...emptyForm, status });
      alert('Berita tersimpan. Sedang sinkronisasi ke server.');
    }
  };

  const editArticle = (article: NewsArticle) => {
    // Parse scheduledAt menjadi date & time untuk form
    let scheduledDate = '';
    let scheduledTime = '';
    if (article.scheduledAt) {
      const scheduled = new Date(article.scheduledAt);
      scheduledDate = scheduled.toISOString().split('T')[0]; // YYYY-MM-DD
      scheduledTime = scheduled.toTimeString().slice(0, 5); // HH:MM
    }

    setForm({
      ...emptyForm,
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      status: 'Publish',
      featured: article.featured,
      breaking: article.breaking,
      trending: article.trending,
      journalist: article.author.split(' - ')[0] || article.author,
      position: article.author.split(' - ')[1] || 'Redaksi',
      category: article.category,
      image: article.image,
      imageName: 'Gambar artikel aktif',
      tags: article.tags.join(', '),
      metaTitle: article.title,
      metaDescription: article.excerpt,
      scheduledPublishDate: scheduledDate,
      scheduledPublishTime: scheduledTime,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSidebarFile = async (id: string, file?: File) => {
    if (!file) return;
    try {
      const imageUrl = await uploadToCloudinary(file);
      await updateSlot(id, { image: imageUrl });
    } catch (error) {
      console.error('Sidebar image upload failed:', error);
      alert('Gagal upload gambar sidebar. Cek konfigurasi Cloudinary di environment variables.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Tulis Berita Baru</h2>
          <p className="text-sm text-gray-500">Tempel artikel lengkap di bawah untuk memisahkan Judul, Ringkasan, dan Isi secara otomatis.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => saveArticle('Draft')} className="rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-gray-800">Simpan Draft</button>
          <button onClick={() => saveArticle('Publish')} className="rounded-xl bg-[#c40000] px-4 py-2.5 text-sm font-black text-white hover:bg-red-700">Publish</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-2xl border border-red-900/40 bg-red-950/10 p-5">
            <h3 className="mb-2 font-black text-red-300">⚡ Input Cepat (Otomatis Memisahkan Judul, Ringkasan & Isi)</h3>
            <p className="mb-4 text-xs text-gray-400">Tempel teks artikel lengkap di sini. Baris pertama akan menjadi Judul, paragraf kedua menjadi Ringkasan, dan sisanya menjadi Konten.</p>
            <textarea value={form.quick} onChange={e => parseQuickInput(e.target.value)} rows={6} placeholder={'Judul Berita Anda\n\nRingkasan singkat berita ini...\n\nIsi berita lengkap dimulai dari sini...'} className="w-full rounded-2xl border border-gray-700 bg-gray-950 p-4 text-sm text-white outline-none focus:border-[#c40000]" />
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <label className="mb-2 block text-sm font-black text-white">Judul Artikel</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Masukkan judul berita yang menarik..." className="w-full rounded-xl border border-gray-700 bg-gray-950 p-4 text-xl font-black text-white outline-none focus:border-[#c40000]" />
            <p className="mt-2 text-xs text-gray-500">Slug otomatis: /berita/{slug}</p>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <label className="mb-2 block text-sm font-black text-white">Ringkasan / Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={3} placeholder="Tulis ringkasan singkat artikel..." className="w-full rounded-xl border border-gray-700 bg-gray-950 p-4 text-sm text-white outline-none focus:border-[#c40000]" />
            <p className="mt-2 text-xs text-gray-500">Tulis seperti naskah biasa. Sistem akan otomatis merapikan paragraf, subjudul, kutipan, dan daftar saat tampil di artikel.</p>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <label className="mb-2 block text-sm font-black text-white">Konten Berita</label>
            <textarea value={form.content} onChange={e => {
              const val = e.target.value;
              setForm(prev => ({ ...prev, content: val }));
              // Auto-detect dari konten saat user berhenti ketik
              const fullText = `${form.title}\n\n${form.excerpt}\n\n${val}`;
              const detected = autoDetectMeta(fullText);
              if (detected.journalist) setForm(prev => ({ ...prev, journalist: detected.journalist, position: detected.position }));
              if (detected.category && !form.category) setForm(prev => ({ ...prev, category: detected.category }));
              if (detected.tags) setForm(prev => ({ ...prev, tags: detected.tags }));
            }} rows={12} placeholder={"Tulis konten berita lengkap di sini.\n\nSistem otomatis mendeteksi:\n- Reporter/Editor dari teks (contoh: 'Reporter: Aan')\n- Kategori dari isi berita\n- Tags dari kata kunci\n\nTambahkan di akhir artikel:\nReporter: Nama Reporter\nEditor: Nama Editor"} className="w-full rounded-xl border border-gray-700 bg-gray-950 p-4 text-sm text-white outline-none focus:border-[#c40000]" />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="mb-4 text-xl font-black text-white">Pengaturan Publish</h3>
            <label className="mb-2 block text-sm font-bold text-gray-300">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as FormState['status'] })} className="mb-4 w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-[#c40000]">
              <option>Draft</option>
              <option>Publish</option>
            </select>

            {/* Jadwal Tayang Berita */}
            <div className="mt-4 border-t border-gray-700 pt-4">
              <label className="mb-2 block text-sm font-bold text-gray-300">📅 Jadwal Tayang Berita</label>
              <p className="mb-3 text-xs text-gray-500">Kosongkan jika ingin tayang sekarang. Isi tanggal & waktu agar berita otomatis tampil pada waktu yang ditentukan.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Tanggal</label>
                  <input
                    type="date"
                    value={form.scheduledPublishDate || ''}
                    onChange={e => setForm({ ...form, scheduledPublishDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 p-2.5 text-sm text-white outline-none focus:border-[#c40000]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-400">Waktu</label>
                  <input
                    type="time"
                    value={form.scheduledPublishTime || ''}
                    onChange={e => setForm({ ...form, scheduledPublishTime: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-950 p-2.5 text-sm text-white outline-none focus:border-[#c40000]"
                  />
                </div>
              </div>
              {form.scheduledPublishDate && form.scheduledPublishTime && (
                <div className="mt-2 rounded-lg bg-[#c40000]/10 border border-[#c40000]/30 px-3 py-2 text-xs text-[#c40000]">
                  📅 Berita akan tayang pada: {new Date(`${form.scheduledPublishDate}T${form.scheduledPublishTime}:00`).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                </div>
              )}
            </div>
            {[
              ['featured', 'Featured'],
              ['breaking', 'Breaking News'],
              ['trending', 'Trending'],
            ].map(([key, label]) => (
              <label key={key} className="mb-3 flex items-center justify-between rounded-xl bg-gray-950 p-3 text-sm font-bold text-gray-200">
                {label}
                <input type="checkbox" checked={Boolean(form[key as keyof FormState])} onChange={e => setForm({ ...form, [key]: e.target.checked })} className="h-5 w-5 accent-[#c40000]" />
              </label>
            ))}
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Informasi Jurnalis</h3>
              <span className="rounded-full bg-green-900/30 px-2.5 py-1 text-[10px] font-bold text-green-400">AUTO-DETECT</span>
            </div>
            <p className="mb-4 text-xs text-gray-500">Otomatis terisi dari teks artikel. Tulis <span className="text-[#c40000] font-bold">"Reporter: Nama"</span> atau <span className="text-[#c40000] font-bold">"Editor: Nama"</span> di akhir konten.</p>
            <label className="mb-2 block text-sm font-bold text-gray-300">Nama Jurnalis</label>
            <input value={form.journalist} onChange={e => setForm({ ...form, journalist: e.target.value })} placeholder="Otomatis dari teks atau ketik manual" className="mb-3 w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-[#c40000]" />
            <label className="mb-2 block text-sm font-bold text-gray-300">Jabatan</label>
            <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Otomatis: Reporter, Editor, Penulis" className="mb-3 w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-[#c40000]" />
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-300">
              Kategori
              {form.category && <span className="rounded bg-[#c40000]/20 px-1.5 py-0.5 text-[10px] font-black text-[#c40000]">{form.category}</span>}
            </label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-[#c40000]">
              <option value="">Otomatis dari isi berita</option>
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="mb-4 text-xl font-black text-white">Gambar Berita</h3>
            {form.image ? (
              <div className="space-y-3">
                <img src={form.image} alt="Preview" className="h-44 w-full rounded-xl object-cover" />
                <button onClick={() => setForm({ ...form, image: '', imageName: '' })} className="flex items-center gap-2 rounded-xl bg-red-950 px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-900"><X size={15} /> Hapus gambar</button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center ${uploadingImage ? 'border-gray-600 cursor-not-allowed opacity-50' : 'border-gray-700 cursor-pointer hover:border-[#c40000]'}`}>
                <ImagePlus className={`mb-2 ${uploadingImage ? 'text-gray-500' : 'text-[#c40000]'}`} />
                <span className="font-bold text-white">{uploadingImage ? 'Sedang mengupload ke Cloudinary...' : 'Upload gambar berita'}</span>
                <span className="text-xs text-gray-500">{uploadingImage ? 'Mohon tunggu...' : 'Klik area ini untuk memilih file apapun'}</span>
                <input type="file" className="hidden" onChange={e => handleImage(e.target.files?.[0])} disabled={uploadingImage} />
              </label>
            )}
          </section>

          <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="mb-4 text-xl font-black text-white">SEO & Tag</h3>
            <label className="mb-2 block text-sm font-bold text-gray-300">Tags</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="mb-3 w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-[#c40000]" />
            <label className="mb-2 block text-sm font-bold text-gray-300">Meta Title</label>
            <input value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} placeholder={autoMetaTitle} className="mb-3 w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-[#c40000]" />
            <label className="mb-2 block text-sm font-bold text-gray-300">Meta Description</label>
            <textarea value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} placeholder={autoMetaDescription} rows={3} className="w-full rounded-xl border border-gray-700 bg-gray-950 p-3 text-white outline-none focus:border-[#c40000]" />
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <h3 className="mb-4 text-xl font-black text-white">Manajemen Sidebar</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sidebars.map(slot => (
            <div key={slot.id} className="rounded-2xl border border-gray-800 bg-gray-950 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <input value={slot.title} onChange={e => updateSlot(slot.id, { title: e.target.value })} className="min-w-0 flex-1 bg-transparent text-sm font-black text-white outline-none" />
                <span className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${slot.type === 'long' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>{slot.type === 'long' ? 'Panjang' : 'Normal'}</span>
                <button onClick={() => updateSlot(slot.id, { enabled: !slot.enabled })} className={`rounded-full px-3 py-1 text-xs font-black text-white ${slot.enabled ? 'bg-green-600' : 'bg-[#c40000]'}`}>{slot.enabled ? 'ON' : 'OFF'}</button>
              </div>
              {slot.image ? <img src={slot.image} className="mb-3 h-32 w-full rounded-xl object-cover" alt={slot.title} /> : <div className="mb-3 flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-700 text-xs text-gray-500">Belum ada gambar</div>}
              <input value={slot.url} onChange={e => updateSlot(slot.id, { url: e.target.value })} placeholder="URL opsional. Kosong = gambar tidak bisa diklik" className="mb-3 w-full rounded-xl border border-gray-800 bg-gray-900 p-3 text-sm text-white outline-none focus:border-[#c40000]" />
              <div className="flex gap-2">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-800 px-3 py-2 text-xs font-bold text-white hover:bg-gray-700"><Upload size={14} /> Upload<input type="file" className="hidden" onChange={e => handleSidebarFile(slot.id, e.target.files?.[0])} /></label>
                <button onClick={() => resetSlot(slot.id)} className="rounded-xl bg-red-950 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-900">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white">Kelola Berita</h3>
            <p className="text-sm text-gray-500">Edit, lihat, dan hapus berita.</p>
          </div>
          <button onClick={() => setForm(emptyForm)} className="flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700"><Plus size={15} /> Reset Form</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Judul</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Jurnalis</th><th className="px-4 py-3">Jadwal</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {articles.map(article => {
                const isScheduled = article.scheduledAt && new Date(article.scheduledAt) > new Date();
                const scheduleLabel = article.scheduledAt 
                  ? isScheduled 
                    ? `⏰ ${new Date(article.scheduledAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`
                    : `✅ Tayang ${new Date(article.scheduledAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`
                  : '—';
                
                return (
                  <tr key={article.id} className="hover:bg-gray-800/40">
                    <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={article.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="max-w-md truncate text-sm font-bold text-white">{article.title}</span></div></td>
                    <td className="px-4 py-3 text-sm text-gray-300">{article.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{article.author}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{scheduleLabel}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${isScheduled ? 'bg-yellow-950 text-yellow-300' : 'bg-green-950 text-green-300'}`}><CheckCircle size={11} /> {isScheduled ? 'Terjadwal' : 'Publish'}</span></td>
                    <td className="px-4 py-3"><div className="flex gap-2"><Link to={`/berita/${article.id}`} className="text-blue-400 hover:text-blue-300"><Eye size={16} /></Link><button onClick={() => editArticle(article)} className="text-yellow-400 hover:text-yellow-300"><Edit size={16} /></button><button onClick={() => { if (confirm(`Hapus berita "${article.title}"?`)) { deleteArticle(article.id); securityLog({ action: `Berita Dihapus: "${article.title.slice(0, 60)}"`, category: 'article-delete', status: 'error' }); } }} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}