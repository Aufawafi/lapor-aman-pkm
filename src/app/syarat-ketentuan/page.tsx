'use client';

import { motion, Variants } from 'framer-motion';
import { Scale, AlertTriangle, CheckCircle, Gavel, ShieldAlert, FileCheck } from 'lucide-react';

export default function SyaratKetentuanPage() {
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
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans pb-24">
      
      {/* --- HERO SECTION (Curved & Gray Theme) --- */}
      <div className="relative w-full bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 pt-16 pb-22 lg:pb-24 rounded-b-[40px] lg:rounded-b-[60px] shadow-lg overflow-hidden mb-16">
         {/* Pattern Overlay */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         
         {/* Decorative Blobs */}
         <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-48 h-48 bg-gray-500/20 rounded-full blur-3xl"></div>

         <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-inner border border-white/20 text-white">
                <Scale size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Syarat & <span className="text-gray-300">Ketentuan</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed font-medium">
                Aturan penggunaan aplikasi LAPOR AMAN demi kenyamanan dan keamanan bersama seluruh warga sekolah.
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
            {/* Intro Text */}
            <motion.div variants={fadeInUp} className="text-center mb-10">
                <p className="text-gray-600 text-md max-w-3xl mx-auto">
                    Selamat datang di LAPOR AMAN. Dengan mengakses atau menggunakan aplikasi ini, Anda dianggap telah membaca, memahami, dan menyetujui untuk mematuhi poin-poin berikut:
                </p>
            </motion.div>

            {/* Point 1 */}
            <motion.div variants={fadeInUp} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-200 relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                <div className="flex flex-col md:flex-row items-start gap-5">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl flex-shrink-0 mt-1">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">1. Kejujuran Laporan</h3>
                        <p className="text-gray-600 leading-relaxed text-justify md:text-left text-sm md:text-base">
                            Setiap laporan yang dikirimkan harus berdasarkan <strong>fakta yang sebenarnya</strong>. Dilarang keras membuat laporan palsu, fitnah, atau laporan iseng (<i>prank</i>) yang dapat merugikan nama baik pihak lain atau mengganggu proses penanganan kasus serius.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Point 2 */}
            <motion.div variants={fadeInUp} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-200 relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                <div className="flex flex-col md:flex-row items-start gap-5">
                    <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl flex-shrink-0 mt-1">
                        <AlertTriangle size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">2. Etika Bahasa</h3>
                        <p className="text-gray-600 leading-relaxed text-justify md:text-left text-sm md:text-base">
                            Meskipun Anda melaporkan kejadian buruk, harap tetap menggunakan bahasa yang sopan dan objektif. Hindari penggunaan kata-kata kasar, makian, ujaran kebencian, atau isu SARA dalam deskripsi laporan. Fokuslah pada kronologi kejadian.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Point 3 */}
            <motion.div variants={fadeInUp} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-200 relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
                <div className="flex flex-col md:flex-row items-start gap-5">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl flex-shrink-0 mt-1">
                        <Gavel size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">3. Hak & Sanksi Sekolah</h3>
                        <div className="text-gray-600 leading-relaxed text-justify md:text-left text-sm md:text-base space-y-2">
                            <p>Pihak SMP Gelora Depok berhak untuk:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Menghapus bukti foto/laporan yang melanggar hukum (seperti konten pornografi atau pelanggaran UU ITE).</li>
                                <li>Memberikan sanksi akademis kepada siswa yang terbukti menyalahgunakan aplikasi ini untuk menyebar fitnah atau berita bohong.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Point 4 */}
            <motion.div variants={fadeInUp} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-200 relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 w-2 h-full bg-gray-500"></div>
                <div className="flex flex-col md:flex-row items-start gap-5">
                    <div className="p-3 bg-gray-100 text-gray-500 rounded-2xl flex-shrink-0 mt-1">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">4. Batasan Tanggung Jawab</h3>
                        <p className="text-gray-600 leading-relaxed text-justify md:text-left text-sm md:text-base">
                            Aplikasi ini adalah sarana pelaporan dan dokumentasi awal. Tindak lanjut fisik, mediasi, konseling, dan penyelesaian masalah tetap dilakukan secara tatap muka oleh pihak sekolah sesuai prosedur Bimbingan Konseling (BK) yang berlaku.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Footer Text */}
            <motion.div variants={fadeInUp} className="mt-12 text-center p-6 bg-gray-100 rounded-3xl border border-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-400 text-sm font-medium">
                    <FileCheck size={18} className="hidden md:block" />
                    <p>Dengan melanjutkan penggunaan aplikasi, Anda menyetujui seluruh ketentuan di atas.</p>
                </div>
            </motion.div>

        </motion.div>
      </main>
    </div>
  );
}