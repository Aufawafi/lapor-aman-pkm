'use client'; 

import Image from 'next/image';
import { Users, School, HeartHandshake, Star, Code, Palette, Database } from 'lucide-react';
import { motion, Variants } from 'framer-motion'; 

// Data Tim Mahasiswa
const teamMahasiswa = [
  {
    id: 1,
    name: "Aufa Wafi Dhaifullah",
    nim: "231011401814",   
    role: "Ketua Tim",
    initial: "AW",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    name: "Ivandhika Satria",
    nim: "231011401818",
    role: "Backend Dev",
    initial: "WH",
    icon: Database,
    color: "text-indigo-500",
    bg: "bg-indigo-50"
  },
  {
    id: 3,
    name: "Wahyu Hidayat",
    nim: "231011401821",
    role: "Frontend Dev",
    initial: "AA",
    icon: Code,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    id: 4,
    name: "Arshanda Amudhia",
    nim: "231011401821",
    role: "UI/UX Design",
    initial: "AA",
    icon: Palette,
    color: "text-pink-500",
    bg: "bg-pink-50"
  },
];

// Data Tim Guru
const teamGuru = [
  {
    id: 1,
    name: "Bpk. Kepala Sekolah",
    nip: "198XXXXXXX",
    role: "Kepala Sekolah",
    initial: "KS"
  },
  {
    id: 2,
    name: "Ibu Guru BK",
    nip: "198XXXXXXX",
    role: "Koordinator BK",
    initial: "BK"
  },
  {
    id: 3,
    name: "Bpk. Kesiswaan",
    nip: "198XXXXXXX",
    role: "Kesiswaan",
    initial: "KW"
  }
];

export default function TentangKamiPage() {
  // Animasi
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
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      
      {/* --- HERO SECTION (Curved Style) --- */}
      <div className="relative w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 pt-16 pb-22 lg:pb-24 rounded-b-[40px] lg:rounded-b-[60px] shadow-lg overflow-hidden mb-16">
         {/* Pattern Overlay */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         
         {/* Decorative Blobs */}
         <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

         <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-gray-600 text-sm font-bold mb-6 backdrop-blur-md shadow-sm">
                 Program Kreativitas Mahasiswa
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
                Sinergi Untuk Sekolah <br/> <span className="text-orange-500">Bebas Perundungan</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-50 max-w-3xl mx-auto leading-relaxed font-medium">
                Kolaborasi inovatif antara Mahasiswa Teknik Informatika dan SMP Gelora Depok untuk menciptakan lingkungan belajar yang aman, inklusif, dan positif.
              </p>
            </motion.div>
         </div>
      </div>

      {/* --- KONTEN UTAMA --- */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION 1: LATAR BELAKANG & CERITA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          
          {/* Teks Cerita */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 text-orange-500 rounded-2xl shadow-sm">
                    <HeartHandshake size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Latar Belakang</h2>
            </div>
            
            <div className="prose prose-lg text-gray-600 leading-relaxed text-justify">
                <p className="mb-4">
                    <strong>LAPOR AMAN</strong> lahir dari kepedulian sekelompok mahasiswa Teknik Informatika Semester 5 Universitas Pamulang yang sedang melaksanakan kegiatan <strong>Pengabdian Kepada Masyarakat (PKM)</strong>.
                </p>
                <div className="p-6 bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm my-6">
                    <p className="italic text-gray-600 m-0">
                        "Tujuan kami sederhana: Memberikan suara kepada mereka yang takut berbicara, dan memberikan alat yang efektif bagi sekolah untuk melindungi siswanya."
                    </p>
                </div>
                <p>
                    Melihat tantangan yang dihadapi siswa dalam melaporkan kasus perundungan secara aman, kami berinisiatif merancang solusi berbasis teknologi. Bekerja sama erat dengan pihak <strong>SMP Gelora Depok</strong>, kami mengembangkan aplikasi ini sebagai sarana pencegahan dan penanganan dini.
                </p>
            </div>
          </motion.div>
          
          {/* Ilustrasi Gambar */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 relative h-80 lg:h-[500px] w-full bg-gray-200 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl group"
          >
             <Image 
               src="/Dok-Survei.jpg" 
               alt="Kegiatan Diskusi PKM Mahasiswa dan Guru"
               fill
               className="object-cover group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <div className="bg-orange-500 w-12 h-1.5 mb-4 rounded-full"></div>
                <h3 className="text-2xl font-bold text-white mb-1">Kegiatan PKM</h3>
                <p className="text-gray-200 font-medium">Diskusi Pengembangan Sistem dengan Mitra Sekolah</p>
             </div>
          </motion.div>
        </div>

        {/* SECTION 2: TIM MAHASISWA */}
        <div className="mb-24">
            <div className="text-center mb-12">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 uppercase tracking-wide">
                    Tim Pengembang
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Mahasiswa Kreatif</h2>
                <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Dibalik layar pengembangan sistem Lapor Aman.</p>
            </div>

            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {teamMahasiswa.map((member) => {
                  const Icon = member.icon;
                  return (
                    <motion.div 
                        key={member.id} 
                        variants={fadeInUp}
                        whileHover={{ y: -8 }}
                        className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 text-center relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-24 h-24 ${member.bg} rounded-bl-[3rem] -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
                          <div className="relative z-10">
                            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm ${member.bg} ${member.color}`}>
                              <Icon size={32} />
                            </div>
                                
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">{member.nim}</p>
                                
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600">
                            <Star size={12} className="text-orange-500 fill-orange-500" />
                            {member.role}
                          </div>
                        </div>
                    </motion.div>
                  )
              })}
            </motion.div>
        </div>

        {/* SECTION 3: MITRA SEKOLAH */}
        <div className="relative bg-white rounded-[3rem] p-8 md:p-16 border border-gray-200 shadow-xl overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-bl-full -mr-20 -mt-20 opacity-50"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full font-bold text-sm mb-4 border border-orange-100">
                            <School size={18} />
                            <span>Mitra Sekolah</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">Penanggung Jawab</h2>
                        <p className="text-gray-600 mt-2">SMP Gelora Depok</p>
                    </div>
                    <div className="hidden md:block w-32 h-1 bg-gray-200 rounded-full mb-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {teamGuru.map((guru) => (
                        <motion.div 
                            key={guru.id} 
                            whileHover={{ scale: 1.02 }} 
                            className="bg-gray-50 p-8 rounded-3xl border border-gray-200 text-center hover:bg-white hover:shadow-lg transition-all duration-300"
                        >
                            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center text-orange-500 text-xl font-bold shadow-sm border border-orange-100">
                                {guru.initial}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{guru.name}</h3>
                            <p className="text-sm text-gray-400 mb-4 font-medium">NIP: {guru.nip}</p>
                            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide rounded-lg">
                                {guru.role}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}