import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import SocialIcons from './SocialIcons';
import { useFooterStore } from '../store/footerStore';

const footerCategories = [
  'Nasional', 'Hukum', 'Teknologi', 'Kriminal', 'Ekonomi', 'Politik', 'Daerah', 'Internasional', 'Opini'
];

export default function Footer() {
  const links = useFooterStore(s => s.links);
  const contact = useFooterStore(s => s.contact);

  return (
    <footer className="mt-12 bg-[#030817] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-5 flex items-center">
              <div className="flex flex-col">
                <span className="flex items-baseline leading-none">
                  <span className="font-black text-2xl text-white" style={{ fontFamily: 'Georgia, serif' }}>INTEGRITY</span>
                  <span className="ml-1 font-black text-2xl text-[#c40000]" style={{ fontFamily: 'Georgia, serif' }}>POST</span>
                </span>
                <div className="mt-1 flex justify-between">
                  {'TAJAM, INVESTIGATIF, & TERPERCAYA'.split('').map((char, i) => (
                    <span key={i} className="text-[7px] font-black uppercase text-slate-500 sm:text-[8px]">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
            <p className="max-w-xs text-sm leading-8 text-slate-300">
              Media berita digital independen yang menghadirkan informasi akurat, cepat, dan terpercaya untuk masyarakat Indonesia.
            </p>
            <SocialIcons
              className="mt-6 flex items-center gap-3"
              itemClassName="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0d1a2e] text-slate-300 transition-all duration-200"
              iconClassName="h-4 w-4"
            />
          </div>

          <div>
            <h4 className="mb-5 text-lg font-black text-white">Kategori Berita</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {footerCategories.map(cat => (
                <Link key={cat} to={`/?category=${cat}`} className="text-sm text-slate-300 transition-colors hover:text-[#c40000]">
                  - {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-black text-white">Tautan Redaksi</h4>
            <ul className="space-y-4">
              {links.map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-slate-300 transition-colors hover:text-[#c40000]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-black text-white">Kontak Redaksi</h4>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#c40000]/10 text-[#c40000]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-bold text-white">Alamat</p>
                  <p className="mt-1 leading-7">{contact.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#c40000]/10 text-[#c40000]">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-bold text-white">Telepon</p>
                  <a href={`tel:${contact.phone}`} className="mt-0.5 block transition-colors hover:text-white">{contact.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#c40000]/10 text-[#c40000]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-bold text-white">Email</p>
                  <a href={`mailto:${contact.email}`} className="mt-0.5 block transition-colors hover:text-white">{contact.email}</a>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#0d1a2e] p-5">
              <p className="mb-3 text-sm font-black text-white">Iklan & Kerjasama</p>
              <p className="text-sm text-slate-300">{contact.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-5">
        <div className="mx-auto max-w-7xl text-xs text-slate-400">
          © 2026 Integrity Post. Semua hak cipta dilindungi. PT. KOMUNIKA FAKTA GROUP
        </div>
      </div>
    </footer>
  );
}
