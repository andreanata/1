export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  scheduledAt?: string; // ISO timestamp kapan berita tayang
  image: string;
  tags: string[];
  views: number;
  featured: boolean;
  breaking: boolean;
  trending: boolean;
}

export const categories = [
  'Nasional', 'Hukum', 'Politik', 'Kriminal', 'Ekonomi', 'Teknologi', 'Opini', 'Daerah', 'Internasional'
];

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Pemerintah Luncurkan Program Ekonomi Digital Nasional Senilai Rp 500 Triliun untuk Mendorong Pertumbuhan Inklusif',
    excerpt: 'Presiden mengumumkan program transformasi digital berskala besar yang akan menjangkau seluruh pelosok Indonesia, menciptakan jutaan lapangan kerja baru di sektor teknologi.',
    content: 'Program ekonomi digital nasional senilai Rp 500 triliun resmi diluncurkan oleh Presiden...',
    category: 'Ekonomi',
    author: 'Ade Muksin',
    date: '2025-01-15T08:00:00Z',
    image: 'https://images.pexels.com/photos/20313664/pexels-photo-20313664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['ekonomi', 'digital', 'teknologi', 'investasi'],
    views: 15420,
    featured: true,
    breaking: true,
    trending: true
  },
  {
    id: '2',
    title: 'DPR Sahkan Revisi Undang-Undang Pers: Jaminan Kebebasan Berekspresi dan Perlindungan Jurnalis Diperkuat',
    excerpt: 'Dewan Perwakilan Rakyat secara aklamasi mengesahkan revisi UU Pers yang memberikan perlindungan lebih kuat kepada jurnalis dan menjamin kebebasan pers di Indonesia.',
    content: 'Dalam sidang paripurna yang berlangsung khidmat, DPR RI resmi mengesahkan revisi...',
    category: 'Hukum',
    author: 'Adunk',
    date: '2025-01-14T10:30:00Z',
    image: 'https://images.pexels.com/photos/9470041/pexels-photo-9470041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['politik', 'pers', 'hukum', 'DPR'],
    views: 12350,
    featured: true,
    breaking: false,
    trending: true
  },
  {
    id: '3',
    title: 'Timnas Indonesia U-23 Melaju ke Final Piala Asia Setelah Kalahkan Korea Selatan 3-1',
    excerpt: 'Garuda Muda menunjukkan permainan luar biasa dan berhasil mengalahkan Korea Selatan dengan skor telak 3-1 untuk melaju ke babak final Piala Asia U-23.',
    content: 'Stadion Abdullah bin Khalifa, Doha, bergemuruh saat Timnas Indonesia U-23...',
    category: 'Video',
    author: 'Saryo',
    date: '2025-01-14T20:00:00Z',
    image: 'https://images.pexels.com/photos/20254633/pexels-photo-20254633.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['olahraga', 'sepakbola', 'timnas', 'piala-asia'],
    views: 28900,
    featured: true,
    breaking: true,
    trending: true
  },
  {
    id: '4',
    title: 'AI Generatif Revolusikan Industri Konten: Dampak dan Peluang bagi Kreator Indonesia',
    excerpt: 'Kehadiran teknologi kecerdasan buatan generatif membuka babak baru dalam industri kreatif digital, menghadirkan peluang sekaligus tantangan bagi para kreator konten lokal.',
    content: 'Revolusi kecerdasan buatan telah mengubah lanskap industri konten secara fundamental...',
    category: 'Teknologi',
    author: 'Azi Ripangga',
    date: '2025-01-13T09:15:00Z',
    image: 'https://images.pexels.com/photos/8358139/pexels-photo-8358139.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['teknologi', 'AI', 'digital', 'kreativitas'],
    views: 9870,
    featured: false,
    breaking: false,
    trending: true
  },
  {
    id: '5',
    title: 'KPK Tetapkan Tersangka Baru Kasus Korupsi Pengadaan Alat Kesehatan Senilai Rp 200 Miliar',
    excerpt: 'Komisi Pemberantasan Korupsi kembali menetapkan tersangka baru dalam kasus korupsi pengadaan alat kesehatan yang merugikan negara hingga Rp 200 miliar.',
    content: 'KPK mengumumkan penetapan tersangka baru dalam kasus korupsi pengadaan alat kesehatan...',
    category: 'Kriminal',
    author: 'OK Rizal',
    date: '2025-01-13T14:00:00Z',
    image: 'https://images.pexels.com/photos/6326493/pexels-photo-6326493.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['nasional', 'korupsi', 'KPK', 'hukum'],
    views: 18600,
    featured: false,
    breaking: true,
    trending: true
  },
  {
    id: '6',
    title: 'PBB Gelar Sidang Darurat Bahas Krisis Kemanusiaan di Gaza: Indonesia Dorong Gencatan Senjata Permanen',
    excerpt: 'Indonesia tampil sebagai suara terdepan dalam sidang darurat PBB, mendesak gencatan senjata permanen dan bantuan kemanusiaan segera untuk rakyat Palestina.',
    content: 'Dalam sidang darurat Dewan Keamanan PBB yang digelar secara mendadak...',
    category: 'Internasional',
    author: 'M Kasiem Ibnue',
    date: '2025-01-12T16:00:00Z',
    image: 'https://images.pexels.com/photos/15652229/pexels-photo-15652229.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['internasional', 'PBB', 'Gaza', 'diplomasi'],
    views: 22100,
    featured: false,
    breaking: false,
    trending: true
  },
  {
    id: '7',
    title: 'Film "Nusantara" Raih 5 Penghargaan di Festival Film Internasional Berlin 2025',
    excerpt: 'Karya sineas muda Indonesia berhasil mencuri perhatian dunia dengan meraih lima penghargaan bergengsi di Festival Film Internasional Berlin, termasuk Golden Bear.',
    content: 'Sebuah pencapaian bersejarah diraih perfilman Indonesia di panggung internasional...',
    category: 'Opini',
    author: 'Erika Damayanti',
    date: '2025-01-12T11:00:00Z',
    image: 'https://images.pexels.com/photos/7267609/pexels-photo-7267609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['hiburan', 'film', 'internasional', 'seni'],
    views: 8750,
    featured: false,
    breaking: false,
    trending: false
  },
  {
    id: '8',
    title: 'Bank Indonesia Naikkan Suku Bunga 25 Basis Poin untuk Jaga Stabilitas Rupiah di Tengah Tekanan Global',
    excerpt: 'Bank Indonesia memutuskan menaikkan suku bunga acuan sebesar 25 basis poin menjadi 6,25% guna menjaga stabilitas nilai tukar rupiah yang menghadapi tekanan global.',
    content: 'Rapat Dewan Gubernur Bank Indonesia memutuskan untuk menaikkan suku bunga...',
    category: 'Ekonomi',
    author: 'Azniel FEF',
    date: '2025-01-11T09:00:00Z',
    image: 'https://images.pexels.com/photos/7887847/pexels-photo-7887847.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['ekonomi', 'bank-indonesia', 'rupiah', 'moneter'],
    views: 11200,
    featured: false,
    breaking: false,
    trending: false
  },
  {
    id: '9',
    title: 'Bencana Banjir Bandang Terjang Tiga Kabupaten di Sulawesi Selatan, Ratusan Keluarga Mengungsi',
    excerpt: 'Banjir bandang yang dipicu hujan lebat menerjang tiga kabupaten di Sulawesi Selatan, memaksa ratusan keluarga mengungsi dan mengakibatkan kerusakan infrastruktur.',
    content: 'Hujan lebat yang mengguyur wilayah Sulawesi Selatan selama tiga hari berturut-turut...',
    category: 'Daerah',
    author: 'Hendra RS',
    date: '2025-01-10T07:30:00Z',
    image: 'https://images.pexels.com/photos/15351396/pexels-photo-15351396.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['nasional', 'bencana', 'banjir', 'sulawesi'],
    views: 16800,
    featured: false,
    breaking: true,
    trending: false
  },
  {
    id: '10',
    title: 'Startup Unicorn Indonesia Raih Pendanaan Seri D Senilai USD 500 Juta dari Investor Global',
    excerpt: 'Perusahaan teknologi berbasis di Jakarta berhasil mengamankan pendanaan Seri D senilai USD 500 juta, memperkuat posisinya sebagai salah satu startup terkemuka di Asia Tenggara.',
    content: 'Ekosistem startup Indonesia kembali mencatatkan tonggak pencapaian bersejarah...',
    category: 'Teknologi',
    author: 'Azi Ripangga',
    date: '2025-01-10T13:00:00Z',
    image: 'https://images.pexels.com/photos/8370345/pexels-photo-8370345.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['teknologi', 'startup', 'investasi', 'unicorn'],
    views: 13500,
    featured: false,
    breaking: false,
    trending: true
  },
  {
    id: '11',
    title: 'Mahkamah Konstitusi Tolak Uji Materi UU Pemilu: Sistem Proporsional Terbuka Tetap Berlaku',
    excerpt: 'Mahkamah Konstitusi menolak permohonan uji materi terhadap sistem pemilu proporsional terbuka, memastikan pemilih tetap bisa memilih langsung calon legislatif.',
    content: 'Sidang pleno Mahkamah Konstitusi memutuskan menolak seluruh permohonan uji materi...',
    category: 'Hukum',
    author: 'OK Rizal',
    date: '2025-01-09T15:00:00Z',
    image: 'https://images.pexels.com/photos/15458140/pexels-photo-15458140.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['politik', 'MK', 'pemilu', 'hukum'],
    views: 14300,
    featured: false,
    breaking: false,
    trending: false
  },
  {
    id: '12',
    title: 'Liga Champions Asia: Persija Jakarta Bekuk Al-Ahli 2-0, Melaju ke Babak 16 Besar',
    excerpt: 'Persija Jakarta tampil impresif dengan mengalahkan Al-Ahli dari Arab Saudi 2-0 di Stadion Utama Gelora Bung Karno untuk memastikan tiket babak 16 besar.',
    content: 'Persija Jakarta menorehkan sejarah baru dengan melaju ke babak 16 besar Liga Champions Asia...',
    category: 'Daerah',
    author: 'Saryo',
    date: '2025-01-08T22:00:00Z',
    image: 'https://images.pexels.com/photos/12616084/pexels-photo-12616084.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['olahraga', 'sepakbola', 'persija', 'liga-asia'],
    views: 19700,
    featured: false,
    breaking: false,
    trending: false
  },
  {
    id: '13',
    title: 'G20 New Delhi: Indonesia Pimpin Agenda Perubahan Iklim dan Transisi Energi Hijau',
    excerpt: 'Indonesia memimpin diskusi krusial di G20 New Delhi tentang percepatan transisi energi hijau dan komitmen pengurangan emisi karbon global untuk 2030.',
    content: 'Pada pertemuan G20 di New Delhi, delegasi Indonesia tampil sebagai motor penggerak...',
    category: 'Internasional',
    author: 'M Kasiem Ibnue',
    date: '2025-01-07T08:00:00Z',
    image: 'https://images.pexels.com/photos/15458117/pexels-photo-15458117.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['internasional', 'G20', 'lingkungan', 'energi'],
    views: 10900,
    featured: false,
    breaking: false,
    trending: false
  },
  {
    id: '14',
    title: 'Musisi Legendaris Indonesia Rilis Album ke-20 dengan Kolaborasi Artis Internasional',
    excerpt: 'Sang legenda musik Indonesia merilis album ke-20 yang memuat kolaborasi eksklusif dengan beberapa musisi papan atas dunia, menjanjikan fusi budaya yang memukau.',
    content: 'Perayaan 35 tahun berkarier di industri musik, sang maestro merilis mahakarya terbarunya...',
    category: 'Opini',
    author: 'Erika Damayanti',
    date: '2025-01-06T10:00:00Z',
    image: 'https://images.pexels.com/photos/35781789/pexels-photo-35781789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    tags: ['hiburan', 'musik', 'album', 'kolaborasi'],
    views: 7600,
    featured: false,
    breaking: false,
    trending: false
  },
];

export const breakingNews = [
  'BREAKING: Presiden Lantik 12 Menteri Baru dalam Reshuffle Kabinet Indonesia Maju',
  'BREAKING: Rupiah Menguat ke Level Rp15.200 per Dolar AS Pagi Ini',
  'BREAKING: KPK Tangkap Tangan Pejabat Kementerian PUPR di Jakarta',
  'BREAKING: Gempa 6,1 SR Guncang Maluku Utara, BMKG Keluarkan Peringatan Tsunami',
  'BREAKING: Timnas Indonesia Raih Emas SEA Games Setelah 32 Tahun Penantian',
];
