'use client'; 

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';

// Komponen Icon WhatsApp (Custom SVG)
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Footer = () => {
  const pathname = usePathname();
  const shouldHide = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/siswa/login') ||
    pathname?.startsWith('/siswa/daftar') ||
    pathname === '/login';
    
  // Jika halaman termasuk dalam daftar hide, return null (footer tidak dirender)
  if (shouldHide) return null;

  return (
    <footer className="bg-gray-900 text-white py-16 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-12">
          
          {/* AREA 1: Brand & Deskripsi */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative w-16 h-18 sm:w-18 sm:h-18 p-2 flex-shrink-0">
                <Image 
                  src="/LOGO-sekolahGHAMA-white.png"
                  alt="Logo Sekolah Ghama" 
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Garis Pembatas */}
              <div className="h-10 w-0.5 bg-gray-700"></div>
              {/* Teks Brand */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
                  <span>LAPOR</span>
                  <span className="text-orange-500 block sm:inline sm:ml-1">AMAN</span>
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">SMP Gelora</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              Platform pelaporan perundungan yang aman, terpercaya, dan menjamin kerahasiaan siswa di lingkungan SMP Gelora Depok.
            </p>
          </div>

          {/* AREA 2: Navigasi & Dukungan */}
          <div className="grid grid-cols-2 gap-8 lg:gap-10">
            {/* Sub-Kolom: Jelajahi */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Jelajahi</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-orange-500 transition duration-300 flex items-center gap-2">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/tentang-kami" className="hover:text-orange-500 transition duration-300 flex items-center gap-2">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-orange-500 transition duration-300 flex items-center gap-2">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/siswa/daftar" className="hover:text-orange-500 transition duration-300 flex items-center gap-2">
                    Daftar Akun
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sub-Kolom: Dukungan */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Dukungan</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <Link href="/kebijakan-privasi" className="hover:text-orange-500 transition duration-300">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/syarat-ketentuan" className="hover:text-orange-500 transition duration-300">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="/pusat-bantuan" className="hover:text-orange-500 transition duration-300">
                    Pusat Bantuan
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* AREA 3: Kontak & Alamat (Kanan) */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm text-gray-400 mb-8">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>
                  Jl. Raya Grogol, Kec. Limo,<br/>
                  Kota Depok, Jawa Barat 16512
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>(021) 775-4635</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>info@sekolahghama.com</span>
              </li>
            </ul>

            {/* Sosmed Icons (IG, Web, WA) */}
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/smpgeloradepok/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition duration-300"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
              
              <a 
                href="https://sekolahghama.com/smp-gelora/#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition duration-300"
                title="Website Resmi"
              >
                <Globe size={20} />
              </a>

              {/* WhatsApp Admin */}
              <a 
                href="https://wa.me/6282155667735" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition duration-300"
                title="WhatsApp Admin"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LAPOR AMAN - SMP Gelora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;