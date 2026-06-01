-- ============================================================
-- INTEGRITY POST — Supabase Setup SQL (VERSI FRESH/RESET)
-- ============================================================
-- PENTING: SQL ini akan MENGHAPUS tabel lama & membuat ulang
-- agar struktur kolom 100% benar. Data lama akan hilang & 
-- diganti dengan seed data baru.
--
-- CARA PAKAI:
-- 1. Buka https://supabase.com → pilih project Anda
-- 2. Klik "SQL Editor" → "New query"
-- 3. Copy-PASTE SELURUH isi file ini
-- 4. Klik "Run" (Ctrl+Enter)
-- 5. Tunggu "Success. No rows returned"
-- ============================================================

-- ============================================================
-- STEP 1: HAPUS TABEL LAMA (biar fresh, struktur pasti benar)
-- ============================================================
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.sidebars CASCADE;

-- ============================================================
-- STEP 2: BUAT TABEL ARTICLES (dengan SEMUA kolom)
-- ============================================================
CREATE TABLE public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  category TEXT DEFAULT 'Nasional',
  author TEXT DEFAULT '',
  date TIMESTAMPTZ DEFAULT NOW(),
  scheduled_at TIMESTAMPTZ,
  image TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  breaking BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 3: BUAT TABEL SIDEBARS
-- ============================================================
CREATE TABLE public.sidebars (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN DEFAULT TRUE,
  url TEXT DEFAULT '',
  image TEXT DEFAULT '',
  type TEXT DEFAULT 'normal',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STEP 4: AKTIFKAN REALTIME (WebSocket)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sidebars;

-- ============================================================
-- STEP 5: ROW LEVEL SECURITY + POLICIES
-- ============================================================
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sidebars ENABLE ROW LEVEL SECURITY;

-- Policy: SEMUA bisa baca + tulis (anon key)
CREATE POLICY "articles_select" ON public.articles FOR SELECT USING (true);
CREATE POLICY "articles_insert" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "articles_update" ON public.articles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "articles_delete" ON public.articles FOR DELETE USING (true);

CREATE POLICY "sidebars_select" ON public.sidebars FOR SELECT USING (true);
CREATE POLICY "sidebars_insert" ON public.sidebars FOR INSERT WITH CHECK (true);
CREATE POLICY "sidebars_update" ON public.sidebars FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "sidebars_delete" ON public.sidebars FOR DELETE USING (true);

-- ============================================================
-- STEP 6: INDEXES
-- ============================================================
CREATE INDEX idx_articles_date ON public.articles (date DESC);
CREATE INDEX idx_articles_category ON public.articles (category);

-- ============================================================
-- STEP 7: SEED DATA AWAL (14 berita)
-- ============================================================
INSERT INTO public.articles (id, title, excerpt, content, category, author, date, image, tags, views, featured, breaking, trending) VALUES
('1', 'Pemerintah Luncurkan Program Ekonomi Digital Nasional Senilai Rp 500 Triliun', 'Presiden mengumumkan program transformasi digital berskala besar yang akan menjangkau seluruh pelosok Indonesia.', 'Program ekonomi digital nasional senilai Rp 500 triliun resmi diluncurkan oleh Presiden. Program ini bertujuan mendorong pertumbuhan ekonomi inklusif di seluruh Indonesia.', 'Ekonomi', 'Ade Muksin', '2025-01-15T08:00:00Z', 'https://images.pexels.com/photos/20313664/pexels-photo-20313664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['ekonomi','digital','teknologi'], 15420, TRUE, TRUE, TRUE),
('2', 'DPR Sahkan Revisi Undang-Undang Pers: Jaminan Kebebasan Berekspresi Diperkuat', 'DPR RI secara aklamasi mengesahkan revisi UU Pers yang memberikan perlindungan lebih kuat kepada jurnalis.', 'Dalam sidang paripurna yang berlangsung khidmat, DPR RI resmi mengesahkan revisi UU Pers. Revisi ini memberikan jaminan kebebasan pers yang lebih kuat.', 'Politik', 'Adunk', '2025-01-14T10:30:00Z', 'https://images.pexels.com/photos/9470041/pexels-photo-9470041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['politik','pers','hukum'], 12350, TRUE, FALSE, TRUE),
('3', 'Timnas Indonesia U-23 Melaju ke Final Piala Asia Setelah Kalahkan Korea Selatan 3-1', 'Garuda Muda menunjukkan permainan luar biasa dan berhasil mengalahkan Korea Selatan.', 'Stadion Abdullah bin Khalifa, Doha, bergemuruh saat Timnas Indonesia U-23 mengalahkan Korea Selatan 3-1 untuk melaju ke final.', 'Olahraga', 'Saryo', '2025-01-14T20:00:00Z', 'https://images.pexels.com/photos/20254633/pexels-photo-20254633.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['olahraga','sepakbola','timnas'], 28900, TRUE, TRUE, TRUE),
('4', 'AI Generatif Revolusikan Industri Konten: Dampak dan Peluang Kreator Indonesia', 'Kehadiran teknologi kecerdasan buatan generatif membuka babak baru dalam industri kreatif digital.', 'Revolusi kecerdasan buatan telah mengubah lanskap industri konten secara fundamental di Indonesia.', 'Teknologi', 'Azi Ripangga', '2025-01-13T09:15:00Z', 'https://images.pexels.com/photos/8358139/pexels-photo-8358139.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['teknologi','AI','digital'], 9870, FALSE, FALSE, TRUE),
('5', 'KPK Tetapkan Tersangka Baru Kasus Korupsi Pengadaan Alat Kesehatan Rp 200 Miliar', 'KPK kembali menetapkan tersangka baru dalam kasus korupsi pengadaan alat kesehatan.', 'KPK mengumumkan penetapan tersangka baru dalam kasus korupsi pengadaan alat kesehatan senilai Rp 200 miliar.', 'Hukum', 'OK Rizal', '2025-01-13T14:00:00Z', 'https://images.pexels.com/photos/6326493/pexels-photo-6326493.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['hukum','korupsi','kpk'], 18600, FALSE, TRUE, TRUE),
('6', 'PBB Gelar Sidang Darurat Bahas Krisis Kemanusiaan di Gaza', 'Indonesia tampil sebagai suara terdepan dalam sidang darurat PBB mendesak gencatan senjata.', 'Dalam sidang darurat Dewan Keamanan PBB, Indonesia mendesak gencatan senjata segera di Gaza.', 'Internasional', 'M Kasiem Ibnue', '2025-01-12T16:00:00Z', 'https://images.pexels.com/photos/15652229/pexels-photo-15652229.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['internasional','PBB','Gaza'], 22100, FALSE, FALSE, TRUE),
('7', 'Film Nusantara Raih 5 Penghargaan di Festival Film Internasional Berlin 2025', 'Karya sineas muda Indonesia berhasil meraih lima penghargaan bergengsi di Berlin.', 'Sebuah pencapaian bersejarah diraih perfilman Indonesia di panggung internasional Berlin.', 'Hiburan', 'Erika Damayanti', '2025-01-12T11:00:00Z', 'https://images.pexels.com/photos/7267609/pexels-photo-7267609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['hiburan','film','internasional'], 8750, FALSE, FALSE, FALSE),
('8', 'Bank Indonesia Naikkan Suku Bunga 25 Basis Poin untuk Jaga Stabilitas Rupiah', 'Bank Indonesia memutuskan menaikkan suku bunga acuan menjadi 6,25% untuk menjaga rupiah.', 'Rapat Dewan Gubernur Bank Indonesia memutuskan untuk menaikkan suku bunga demi stabilitas rupiah.', 'Ekonomi', 'Azniel FEF', '2025-01-11T09:00:00Z', 'https://images.pexels.com/photos/7887847/pexels-photo-7887847.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['ekonomi','rupiah','bank-indonesia'], 11200, FALSE, FALSE, FALSE),
('9', 'Bencana Banjir Bandang Terjang Tiga Kabupaten di Sulawesi Selatan', 'Banjir bandang memaksa ratusan keluarga mengungsi dan merusak infrastruktur.', 'Hujan lebat mengguyur Sulawesi Selatan selama tiga hari menyebabkan banjir bandang di tiga kabupaten.', 'Daerah', 'Hendra RS', '2025-01-10T07:30:00Z', 'https://images.pexels.com/photos/15351396/pexels-photo-15351396.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['daerah','bencana','banjir'], 16800, FALSE, TRUE, FALSE),
('10', 'Startup Unicorn Indonesia Raih Pendanaan Seri D Senilai USD 500 Juta', 'Startup Indonesia berhasil mengamankan pendanaan Seri D senilai USD 500 juta.', 'Ekosistem startup Indonesia kembali mencatatkan tonggak pencapaian bersejarah dengan pendanaan besar.', 'Teknologi', 'Azi Ripangga', '2025-01-10T13:00:00Z', 'https://images.pexels.com/photos/8370345/pexels-photo-8370345.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['teknologi','startup','investasi'], 13500, FALSE, FALSE, TRUE),
('11', 'Mahkamah Konstitusi Tolak Uji Materi UU Pemilu', 'MK menolak permohonan uji materi terhadap sistem pemilu proporsional terbuka.', 'Sidang pleno Mahkamah Konstitusi memutuskan menolak seluruh permohonan uji materi UU Pemilu.', 'Hukum', 'OK Rizal', '2025-01-09T15:00:00Z', 'https://images.pexels.com/photos/15458140/pexels-photo-15458140.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['hukum','MK','pemilu'], 14300, FALSE, FALSE, FALSE),
('12', 'Liga Champions Asia: Persija Jakarta Bekuk Al-Ahli 2-0', 'Persija tampil impresif dengan mengalahkan Al-Ahli dari Arab Saudi 2-0.', 'Persija Jakarta menorehkan sejarah baru dengan melaju ke babak 16 besar Liga Champions Asia.', 'Olahraga', 'Saryo', '2025-01-08T22:00:00Z', 'https://images.pexels.com/photos/12616084/pexels-photo-12616084.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['olahraga','persija','liga-asia'], 19700, FALSE, FALSE, FALSE),
('13', 'G20 New Delhi: Indonesia Pimpin Agenda Perubahan Iklim dan Transisi Energi Hijau', 'Indonesia memimpin diskusi G20 tentang percepatan transisi energi hijau.', 'Pada pertemuan G20 di New Delhi, delegasi Indonesia tampil sebagai motor penggerak transisi energi.', 'Internasional', 'M Kasiem Ibnue', '2025-01-07T08:00:00Z', 'https://images.pexels.com/photos/15458117/pexels-photo-15458117.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['internasional','G20','lingkungan'], 10900, FALSE, FALSE, FALSE),
('14', 'Musisi Legendaris Indonesia Rilis Album ke-20 dengan Kolaborasi Internasional', 'Sang legenda musik Indonesia merilis album ke-20 dengan kolaborasi musisi dunia.', 'Perayaan 35 tahun berkarier di industri musik, sang maestro merilis mahakarya terbarunya.', 'Hiburan', 'Erika Damayanti', '2025-01-06T10:00:00Z', 'https://images.pexels.com/photos/35781789/pexels-photo-35781789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200', ARRAY['hiburan','musik','kolaborasi'], 7600, FALSE, FALSE, FALSE);

-- ============================================================
-- STEP 8: SEED SIDEBAR (8 slot)
-- ============================================================
INSERT INTO public.sidebars (id, title, enabled, url, image, type) VALUES
('n1', 'Sidebar Normal 1', TRUE, '', 'https://images.pexels.com/photos/7873559/pexels-photo-7873559.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=260&w=720', 'normal'),
('n2', 'Sidebar Normal 2', TRUE, 'https://integritypost.id', 'https://images.pexels.com/photos/8370345/pexels-photo-8370345.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=260&w=720', 'normal'),
('n3', 'Sidebar Normal 3', FALSE, '', '', 'normal'),
('n4', 'Sidebar Normal 4', FALSE, '', '', 'normal'),
('l1', 'Sidebar Panjang 1', TRUE, 'https://integritypost.id/kontak', 'https://images.pexels.com/photos/15652229/pexels-photo-15652229.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', 'long'),
('l2', 'Sidebar Panjang 2', TRUE, '', 'https://images.pexels.com/photos/15351396/pexels-photo-15351396.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', 'long'),
('l3', 'Sidebar Panjang 3', TRUE, 'https://integritypost.id', 'https://images.pexels.com/photos/20313664/pexels-photo-20313664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', 'long'),
('l4', 'Sidebar Panjang 4', TRUE, '', 'https://images.pexels.com/photos/20254633/pexels-photo-20254633.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=600', 'long');

-- ============================================================
-- SELESAI! Cek di Table Editor → harus ada 14 articles + 8 sidebars
-- ============================================================
