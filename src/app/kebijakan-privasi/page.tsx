'use client';

import { motion, Variants } from 'framer-motion';
import { Shield, Lock, Eye, FileText, UserCheck, Database, Bell, Globe, AlertTriangle } from 'lucide-react';

export default function KebijakanPrivasiPage() {
  // Variabel Animasi
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-24">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 pt-16 pb-22 lg:pb-24 rounded-b-[40px] lg:rounded-b-[60px] shadow-lg overflow-hidden mb-16">
         {/* Pattern Overlay */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         
         {/* Decorative Blobs */}
         <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-48 h-48 bg-gray-400/20 rounded-full blur-3xl"></div>

         <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-inner border border-white/20 text-white">
                <Shield size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Kebijakan <span className="text-orange-500">Privasi</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium">
                Komitmen kami untuk melindungi data pribadi dan menjamin kerahasiaan identitas Anda selama menggunakan layanan Lapor Aman.
              </p>
            </motion.div>
         </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
            {/* Header Info Update */}
            <motion.div variants={fadeInUp} className="text-center mb-12">
                <span className="text-sm font-bold text-orange-500 bg-orange-50 border border-orange-100 py-2 px-5 rounded-full shadow-sm inline-flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    Terakhir diperbarui: 30 November 2025
                </span>
            </motion.div>

            {/* Section 1: Pendahuluan */}
            <motion.div variants={fadeInUp} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-300"></div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="p-4 bg-blue-50 text-blue-400 rounded-2xl flex-shrink-0 w-fit h-fit">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Pendahuluan</h2>
                        <p className="text-gray-600 leading-relaxed text-md text-justify">
                            LAPOR AMAN ("Kami") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan secara transparan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi data pribadi Anda saat menggunakan layanan pelaporan perundungan di lingkungan SMP Gelora Depok.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Section 2: Informasi yang Dikumpulkan */}
            <motion.div variants={fadeInUp} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl flex-shrink-0 w-fit h-fit">
                        <Database size={32} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">2. Informasi yang Kami Kumpulkan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <UserCheck size={20} className="text-orange-500" />
                                    <h3 className="font-semibold text-gray-800">Identitas Siswa</h3>
                                </div>
                                <p className="text-sm text-gray-600">Nama lengkap, Nomor Induk Siswa (NIS), Kelas, dan Email yang diambil saat Anda mendaftar/login.</p>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <FileText size={20} className="text-orange-500" />
                                    <h3 className="font-semibold text-gray-800">Isi Laporan</h3>
                                </div>
                                <p className="text-sm text-gray-600">Deskripsi kronologi, lokasi kejadian, waktu, jenis kasus, serta bukti foto yang Anda unggah secara sukarela.</p>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 md:col-span-2">
                                <div className="flex items-center gap-3 mb-3">
                                    <Globe size={20} className="text-orange-500" />
                                    <h3 className="font-semibold text-gray-800">Data Teknis</h3>
                                </div>
                                <p className="text-sm text-gray-600">Informasi dasar perangkat (Browser, IP Address) yang dikumpulkan secara otomatis untuk keperluan keamanan sistem dan pencegahan spam.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Section 3: Keamanan & Kerahasiaan */}
            <motion.div variants={fadeInUp} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="p-4 bg-green-50 text-green-500 rounded-2xl flex-shrink-0 w-fit h-fit">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Keamanan & Kerahasiaan</h2>
                        <p className="text-gray-600 leading-relaxed mb-6 text-md">
                            Kami menerapkan standar keamanan tinggi untuk melindungi data Anda. Identitas pelapor dijamin <strong>100% RAHASIA</strong>.
                        </p>
                        
                        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-start gap-4">
                            <Eye size={24} className="text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-green-800 text-lg mb-1">Siapa yang bisa melihat data saya?</h4>
                                <p className="text-green-700 text-sm leading-relaxed">
                                    Data laporan hanya dapat diakses oleh <strong>Guru BK (Bimbingan Konseling)</strong> dan <strong>Kesiswaan</strong> yang berwenang. Data tidak akan dibagikan kepada siswa lain, guru yang tidak berkepentingan, atau pihak luar tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Section 4: Penggunaan Informasi */}
            <motion.div variants={fadeInUp} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-gray-600"></div>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="p-4 bg-purple-50 text-gray-600 rounded-2xl flex-shrink-0 w-fit h-fit">
                        <Bell size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Penggunaan Informasi</h2>
                        <p className="text-gray-600 mb-4 text-md">Informasi yang kami kumpulkan digunakan semata-mata untuk:</p>
                        <ul className="space-y-3">
                            {['Memverifikasi dan menindaklanjuti laporan perundungan.', 'Menghubungi pelapor untuk konseling atau klarifikasi lebih lanjut.', 'Memantau statistik keamanan sekolah untuk perbaikan kebijakan.', 'Melindungi keselamatan fisik dan mental siswa di lingkungan sekolah.'].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-600">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Footer Disclaimer */}
            <motion.div variants={fadeInUp} className="mt-12 text-center p-8 bg-gray-100 rounded-3xl border border-gray-200">
                <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400 text-sm max-w-3xl mx-auto">
                    Dengan menggunakan aplikasi ini, Anda dianggap telah membaca dan menyetujui Kebijakan Privasi ini. Jika ada perubahan kebijakan, kami akan memberitahukan melalui pengumuman di aplikasi.
                </p>
            </motion.div>

        </motion.div>
      </main>
    </div>
  );
}

// Ikon Tambahan
const ClockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);