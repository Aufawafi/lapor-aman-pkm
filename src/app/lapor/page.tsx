'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Hand, MessageCircle, Globe, Users, HeartCrack, UploadCloud, X, CheckCircle, ShieldCheck, Send, Loader2, AlertTriangle } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 

// Definisi Tipe
type BullyingType = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const bullyingTypes: BullyingType[] = [
  { id: 'Fisik', label: 'Fisik', icon: Hand },
  { id: 'Verbal', label: 'Verbal', icon: MessageCircle },
  { id: 'Siber', label: 'Siber', icon: Globe },
  { id: 'Sosial', label: 'Sosial', icon: Users },
  { id: 'Emosional', label: 'Emosional', icon: HeartCrack },
];

export default function LaporPage() {
  // State Management
  const [isMounted, setIsMounted] = useState(false); 
  const [jenisKasus, setJenisKasus] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [buktiGambar, setBuktiGambar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // UState untuk menyimpan info kuota
  const [dailyCount, setDailyCount] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pindahkan fungsi checkDailyLimit ke luar useEffect atau gunakan useCallback agar bisa dipanggil di useEffect
  // Kita biarkan fungsinya di sini tapi kita panggil saat komponen mount
  const checkDailyLimit = async (userId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const q = query(
        collection(db, 'laporan_perundungan'),
        where('userId', '==', userId),
        where('createdAt', '>=', today)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size; 
  };

  // Effect untuk mengambil kuota saat halaman dimuat
  useEffect(() => {
    if (!isMounted) return;

    // Gunakan onAuthStateChanged untuk memastikan kita mendapatkan user ID yang valid
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const count = await checkDailyLimit(user.uid);
                setDailyCount(count);
            } catch (error) {
                console.error("Gagal mengambil info kuota:", error);
            }
        }
    });

    return () => unsubscribe();
  }, [isMounted]);

  // Animasi Variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  // Handle Drop File
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Mohon gunakan gambar di bawah 2MB.");
        return;
      }

      setBuktiGambar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    multiple: false,
    maxSize: 2000000 
  });

  const removeImage = () => {
    setBuktiGambar(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""); 
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Gagal upload gambar");
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        alert("Anda harus login terlebih dahulu untuk mengirim laporan.");
        return;
    }

    if (!jenisKasus) {
      alert('Mohon pilih jenis perundungan terlebih dahulu.');
      return;
    }

    setLoading(true);

    try {
      // Cek ulang limit saat tombol ditekan 
      const currentCount = await checkDailyLimit(user.uid);
      
      if (currentCount >= 2) {
        setLoading(false);
        setDailyCount(currentCount); 
        alert("Batas Harian Tercapai. Anda hanya dapat mengirim maksimal 2 laporan per hari.");
        return;
      }

      let imageUrl = '';

      if (buktiGambar) {
        try {
          imageUrl = await uploadToCloudinary(buktiGambar);
        } catch (error) {
          console.error("Upload Error:", error);
          alert("Gagal mengupload gambar. Silakan coba lagi.");
          setLoading(false);
          return;
        }
      }

      await addDoc(collection(db, 'laporan_perundungan'), {
        userId: user.uid,
        userEmail: user.email,
        jenisKasus,
        lokasi,
        deskripsi,
        imageUrl: imageUrl, 
        status: 'Menunggu', 
        createdAt: serverTimestamp(),
      });

      setDailyCount(prev => prev + 1);

      setLoading(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Firestore Error: ", error);
      alert("Terjadi kesalahan saat mengirim laporan.");
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-b-[40px] lg:rounded-b-[60px] container mx-auto px-6 pt-14 pb-22 mb-6 shadow-inner overflow-hidden relative z-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="md:w-1/2 text-center md:text-left"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/40 border border-white/50 text-gray-600 text-sm font-bold mb-6 backdrop-blur-md shadow-sm">
               Layanan Pengaduan Siswa
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight mb-6">
              Suara Anda <br/> <span className="text-orange-500">Sangat Berarti</span>
            </h1>
            <p className="text-md text-gray-600 mb-4 leading-relaxed font-medium max-w-lg mx-auto md:mx-0">
              Setiap laporan adalah langkah berani menuju lingkungan sekolah yang lebih aman. 
              Identitas Anda hanya akan diketahui oleh Guru BK dan Admin Sekolah.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="md:w-1/2 w-full flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-100 to-orange-50 rounded-[3rem] transform rotate-6 scale-95 z-0"></div>
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="/Bullying.webp" 
                    alt="Stop Bullying" 
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
               </div>
             </div>
           </motion.div>
        </div>
      </div>

      {/* Formulir Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white p-6 md:p-10 lg:p-14 rounded-[2.5rem] shadow-2xl border border-white/50 backdrop-blur-sm max-w-8xl mx-auto"
        >
          
          {submitted ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-28 h-28 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle size={64} />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Laporan Terkirim!</h2>
              <h3 className="text-md font-bold text-gray-600 mb-4">Cek Status Laporan Anda di Halaman Profil (Pojok Kanan Atas)</h3>
              <p className="text-gray-600 text-md mb-10 max-w-lg mx-auto leading-relaxed">
                Terima kasih atas keberanian Anda. Laporan telah masuk ke sistem kami secara aman. Guru BK akan segera meninjau dan menindaklanjuti laporan ini.
              </p>
              
              {/* UPDATE: Logika tombol jika kuota habis */}
              {dailyCount >= 2 ? (
                 <div className="p-4 bg-red-50 text-red-600 rounded-xl max-w-md mx-auto mb-4">
                    <p className="font-bold">Kuota Harian Habis</p>
                    <p className="text-sm">Anda telah mencapai batas 2 laporan hari ini. Silakan kembali besok.</p>
                 </div>
              ) : (
                <button 
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 bg-blue-300 text-white font-bold text-lg rounded-2xl hover:bg-blue-400 transition shadow-xl hover:shadow-blue-200 transform hover:-translate-y-1 active:scale-95"
                >
                  Buat Laporan Baru
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Formulir <span className="text-orange-500"> Pelaporan</span></h2>
                
                {/* UPDATE: Notifikasi Info Batas Laporan menjadi Dinamis */}
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border w-fit mt-2 transition-colors duration-300 ${
                    dailyCount >= 2 
                    ? 'bg-red-50 text-red-700 border-red-100' // Merah jika habis
                    : 'bg-orange-50 text-orange-700 border-orange-100' // Orange jika aman
                }`}>
                    <AlertTriangle size={18} className="flex-shrink-0" />
                    <span>
                        Kuota Harian: <strong>{dailyCount} / 2</strong> laporan terpakai.
                        {dailyCount >= 2 && " (Kuota Habis)"}
                    </span>
                </div>

                <p className="text-gray-600 text-md mt-4">Silakan isi detail kejadian dengan sebenar-benarnya. Kami menjamin kerahasiaan data Anda.</p>
              </div>

              {/* Pilihan Jenis Kasus */}
              <div>
                <label className="block text-gray-800 font-bold mb-5 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm">1</span>
                    Jenis Perundungan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {bullyingTypes.map((type) => {
                    const Icon = type.icon;
                    const isActive = jenisKasus === type.id;
                    return (
                      <motion.button
                        key={type.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={dailyCount >= 2} 
                        onClick={() => setJenisKasus(type.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300 ${
                          dailyCount >= 2 ? 'opacity-50 cursor-not-allowed grayscale' : ''
                        } ${
                          isActive 
                            ? 'bg-blue-50 border-blue-300 text-blue-300 shadow-lg ring-1 ring-blue-300' 
                            : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <Icon size={32} className={`mb-3 ${isActive ? 'text-blue-300' : 'text-gray-500'}`} />
                        <span className="text-sm font-bold">{type.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Input Lokasi & Deskripsi */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="lokasi" className="block text-gray-800 font-bold mb-3 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm">2</span>
                    Lokasi Kejadian
                  </label>
                  <input
                    type="text"
                    id="lokasi"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    disabled={dailyCount >= 2} 
                    className="w-full px-6 py-4 bg-gray-50 text-gray-800 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparant transition-all text-base font-medium shadow-sm disabled:bg-gray-200"
                    placeholder="Contoh: Di Kantin, Di Kelas X-A, Area Parkir"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="deskripsi" className="block text-gray-800 font-bold mb-3 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm">3</span>
                    Kronologi / Deskripsi
                  </label>
                  <textarea
                    id="deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    disabled={dailyCount >= 2} 
                    rows={5} 
                    className="w-full px-6 py-4 bg-gray-50 text-gray-800 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all text-base font-medium shadow-sm disabled:bg-gray-200"
                    placeholder="Ceritakan apa yang terjadi, kapan waktunya, dan siapa yang terlibat..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-gray-800 font-bold mb-3 text-lg flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm">4</span>
                    Bukti Foto <span className="text-gray-400 font-normal text-sm ml-1">(Opsional)</span>
                </label>
                
                {/* UPDATE: Kondisional render jika kuota penuh, dropzone tidak aktif */}
                {dailyCount >= 2 ? (
                    <div className="border-3 border-dashed border-gray-300 bg-gray-100 rounded-3xl p-10 text-center text-gray-400">
                        <UploadCloud size={40} className="mx-auto mb-4 opacity-50"/>
                        <p>Upload dinonaktifkan karena kuota harian habis.</p>
                    </div>
                ) : (
                    <div 
                    {...getRootProps()} 
                    className={`border-3 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 group ${
                        isDragActive ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    >
                    <input {...getInputProps()} />
                    {previewUrl ? (
                        <div className="relative inline-block group/image">
                        <Image 
                            src={previewUrl} 
                            alt="Preview Bukti" 
                            width={400} 
                            height={400} 
                            className="rounded-2xl shadow-lg object-cover max-h-80 w-auto mx-auto border-4 border-white" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                className="bg-red-500 text-white rounded-full px-6 py-2 font-bold shadow-lg hover:bg-red-600 transition-transform hover:scale-105 flex items-center gap-2"
                                type="button"
                            >
                                <X size={18} /> Hapus Gambar
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 font-bold truncate max-w-xs mx-auto bg-gray-100 py-1 px-3 rounded-full inline-block">{buktiGambar?.name}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-400 transition-colors py-4">
                        <div className="p-5 bg-gray-100 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                            <UploadCloud size={40} />
                        </div>
                        <p className="text-lg font-bold text-gray-600 group-hover:text-blue-400">Klik untuk upload atau seret gambar ke sini</p>
                        <p className="text-sm text-gray-400 mt-2 font-medium">Maksimal 2 MB (JPG, PNG, WEBP)</p>
                        </div>
                    )}
                    </div>
                )}
              </div>

              {/* Info Privasi & Tombol Submit */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl max-w-2xl">
                        <div className="flex-shrink-0 text-blue-600 mt-1">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-base">Privasi & Keamanan Terjamin</p>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                            Laporan ini akan tercatat di sistem kami. Identitas Anda <strong>hanya dapat dilihat oleh Guru BK dan Admin Sekolah</strong>.
                            </p>
                        </div>
                    </div>

                    <button
                    type="submit"
                    // UPDATE: Disable tombol jika loading atau kuota penuh
                    disabled={loading || dailyCount >= 2}
                    className={`w-full md:w-auto font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 text-lg flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95
                        ${(loading || dailyCount >= 2)
                        ? 'bg-gray-400 cursor-not-allowed text-gray-100 shadow-none translate-y-0' 
                        : 'bg-gradient-to-r from-blue-300 via-blue-300 to-blue-300 hover:from-blue-400 hover:via-blue-400 hover:to-blue-400 text-white'
                        }`}
                    >
                    {loading ? (
                        <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>Mengirim...</span>
                        </>
                    ) : dailyCount >= 2 ? (
                        <>
                        <AlertTriangle size={24} />
                        <span>Kuota Habis</span>
                        </>
                    ) : (
                        <>
                        <Send size={24} className="rotate-0 group-hover:rotate-12 transition-transform"/>
                        <span>Kirim Laporan</span>
                        </>
                    )}
                    </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}