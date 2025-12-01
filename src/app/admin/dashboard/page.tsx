'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Image from 'next/image';
import { 
  LogOut, AlertCircle, CheckCircle, Clock, MapPin, Calendar, 
  Search, Filter, ChevronDown, User, Shield, 
  LayoutDashboard, FileText, Image as ImageIcon, Loader2, PieChart,
  Hand, MessageCircle, Globe, Users, HeartCrack, ShieldAlert, 
  UsersRound, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Tipe Data ---
type Laporan = {
  id: string;
  userId: string;
  userEmail?: string; 
  jenisKasus: string;
  lokasi: string;
  deskripsi: string;
  imageUrl: string;
  status: string;
  catatanAdmin?: string; 
  createdAt: any;
};

// --- Helper: Konfigurasi Warna & Icon Kasus ---
const getCaseConfig = (jenis: string) => {
    switch(jenis) {
        case 'Fisik': return { icon: <Hand size={20} />, color: 'bg-red-50 text-red-600 border-red-100' };
        case 'Verbal': return { icon: <MessageCircle size={20} />, color: 'bg-yellow-50 text-yellow-700 border-yellow-100' };
        case 'Siber': return { icon: <Globe size={20} />, color: 'bg-purple-50 text-purple-600 border-purple-100' };
        case 'Sosial': return { icon: <Users size={20} />, color: 'bg-blue-50 text-blue-600 border-blue-100' };
        case 'Emosional': return { icon: <HeartCrack size={20} />, color: 'bg-pink-50 text-pink-600 border-pink-100' };
        default: return { icon: <ShieldAlert size={20} />, color: 'bg-gray-50 text-gray-600 border-gray-100' };
    }
};

// --- Helper: Badge Status ---
const getStatusBadge = (status: string) => {
    const styles = {
        Diproses: "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/20",
        Selesai: "bg-green-50 text-green-700 border-green-200 ring-green-500/20",
        Dibatalkan: "bg-red-50 text-red-700 border-red-200 ring-red-500/20",
        Menunggu: "bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/20"
    };
    // @ts-ignore
    const style = styles[status] || styles.Menunggu;
    const icon = status === 'Diproses' ? <Clock size={12}/> : status === 'Selesai' ? <CheckCircle size={12}/> : <AlertCircle size={12}/>;

    return (
      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ring-1 ${style}`}>
        {icon} {status}
      </span>
    );
};

// --- Komponen: StatsChart ---
const StatsChart = ({ summary, totalSiswa, totalAdmin }: { summary: any, totalSiswa: number, totalAdmin: number }) => {
    // Pastikan semua nilai ada (fallback ke 0 jika undefined)
    const m = summary.menunggu || 0;
    const p = summary.diproses || 0;
    const s = summary.selesai || 0;
    const b = summary.dibatalkan || 0;
    const totalLaporan = m + p + s + b;
    
    // Helper Gradient untuk Individual Chart
    const createChartData = (count: number, color: string) => {
        const percentage = totalLaporan === 0 ? 0 : (count / totalLaporan) * 100;
        return `conic-gradient(${color} 0% ${percentage}%, #F3F4F6 ${percentage}% 100%)`;
    };

    const stats = [
        { 
            label: "Menunggu", count: m, color: "#6B7280", 
            gradient: createChartData(m, "#EF4444"), textColor: "text-red-600", bgColor: "bg-white"
        },
        { 
            label: "Diproses", count: p, color: "#F97316", 
            gradient: createChartData(p, "#F59E0B"), textColor: "text-yellow-600", bgColor: "bg-white"
        },
        { 
            label: "Selesai", count: s, color: "#22C55E", 
            gradient: createChartData(s, "#22C55E"), textColor: "text-green-600", bgColor: "bg-white"
        },
    
        { 
            label: "Dibatalkan", count: b, color: "#EF4444", 
            gradient: createChartData(b, "#EF4444"), textColor: "text-red-600", bgColor: "bg-white"
        }
    ];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8 relative z-10">
            
            {/* 1. Statistik Pengguna */}
            <div className="xl:col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Total Siswa</p>
                        <h3 className="text-3xl font-extrabold text-slate-600 mt-1">{totalSiswa}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <UsersRound size={28} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Total Admin</p>
                        <h3 className="text-3xl font-extrabold text-slate-600 mt-1">{totalAdmin}</h3>
                    </div>
                    <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                        <ShieldCheck size={28} />
                    </div>
                </div>
            </div>

            {/* 2. Statistik Laporan */}
            <div className="xl:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                        <PieChart size={20} className="text-orange-500"/> Statistik Laporan
                    </h3>
                    <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded-lg text-slate-500">Total: {totalLaporan}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-200 ${stat.bgColor} hover:shadow-md transition-shadow`}>
                            <div className="relative w-20 h-20 mb-3 transition-transform hover:scale-105">
                                <div className="w-full h-full rounded-full shadow-inner" style={{ background: stat.gradient }}></div>
                                <div className="absolute inset-0 m-auto w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className={`text-lg font-extrabold ${stat.textColor}`}>{stat.count}</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- PAGE UTAMA ---
export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [filteredList, setFilteredList] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stats User
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalDibatalkan, setTotalDibatalkan] = useState(0);

  // Filter States
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catatanInput, setCatatanInput] = useState<{[key: string]: string}>({});
  const [isUpdating, setIsUpdating] = useState<string | null>(null); 

  const router = useRouter();

  // 1. Auth & Data Fetching (UPDATED WITH SECURITY CHECK)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login'); 
      } else {
        
        // --- LOGIKA PROTEKSI RUANGAN (BARU) ---
        // Cek apakah user yang login benar-benar Admin
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.role !== 'admin' && userData.role !== 'guru') {
                    // Jika Siswa, tendang ke dashboard siswa
                    router.replace('/siswa/dashboard');
                    return; // Stop loading data admin
                }
            }
        } catch (error) {
            console.error("Gagal verifikasi admin:", error);
        }
        // --------------------------------------

        setUser(currentUser);
        
        // A. Listener Laporan
        const qLaporan = query(collection(db, "laporan_perundungan"), orderBy("createdAt", "desc"));
        const unsubLaporan = onSnapshot(qLaporan, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Laporan[];
          setLaporanList(data);
          setFilteredList(data);
          setLoading(false);
        });

        // B. Listener Users (Hitung Siswa & Admin)
        const qUsers = query(collection(db, "users"));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
             let siswaCount = 0;
             let adminCount = 0;
             let dibatalkanCount = 0;
             snapshot.docs.forEach(doc => {
                 const data = doc.data();
                 if (data.role === 'siswa') siswaCount++;
                 if (data.role === 'admin' || data.role === 'guru') adminCount++;
                 // Hitung akumulasi laporan yang dibatalkan dari setiap siswa
                 // (Karena data laporannya sudah dihapus, kita ambil dari counter di profil user)
                 if (data.stats_dibatalkan) {
                    dibatalkanCount += (typeof data.stats_dibatalkan === 'number' ? data.stats_dibatalkan : 0);
                 }
             });
             setTotalSiswa(siswaCount);
             setTotalAdmin(adminCount);
             setTotalDibatalkan(dibatalkanCount); 
        });

        return () => {
            unsubLaporan();
            unsubUsers();
        };
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  // 2. Filter Logic
  useEffect(() => {
    let result = laporanList;
    if (filterStatus !== 'Semua') {
      result = result.filter(item => item.status === filterStatus);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.deskripsi.toLowerCase().includes(lowerSearch) ||
        item.lokasi.toLowerCase().includes(lowerSearch) ||
        item.jenisKasus.toLowerCase().includes(lowerSearch) ||
        (item.userEmail && item.userEmail.toLowerCase().includes(lowerSearch))
      );
    }
    setFilteredList(result);
  }, [filterStatus, searchTerm, laporanList]);

  // 3. Actions (Logout, Update)
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  const updateStatus = async (item: Laporan, newStatus: string) => {
    if (isUpdating) return;
    setIsUpdating(item.id);
    const pesan = catatanInput[item.id] !== undefined ? catatanInput[item.id] : (item.catatanAdmin || "");
    
    try {
      const reportRef = doc(db, "laporan_perundungan", item.id);
      await updateDoc(reportRef, { status: newStatus, catatanAdmin: pesan });

      let namaSiswa = "Siswa";
      try {
        if (item.userId) {
            const userDoc = await getDoc(doc(db, "users", item.userId));
            if (userDoc.exists()) namaSiswa = userDoc.data().nama || "Siswa";
        }
      } catch (e) {}

      if (item.userEmail) {
          await fetch('/api/admin/send-notification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  email: item.userEmail,
                  nama: namaSiswa,
                  status: newStatus,
                  catatan: pesan,
                  jenisKasus: item.jenisKasus
              })
          });
      }
    } catch (error) {
      console.error("Error update:", error);
      alert("Gagal mengubah status.");
    } finally {
        setIsUpdating(null);
    }
  };

  const handleCatatanChange = (id: string, value: string) => {
    setCatatanInput(prev => ({...prev, [id]: value}));
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    return new Date(timestamp.seconds * 1000).toLocaleDateString("id-ID", {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Hitung summary laporan untuk Chart
  const summaryStats = {
    menunggu: laporanList.filter(i => i.status === 'Menunggu').length,
    diproses: laporanList.filter(i => i.status === 'Diproses').length,
    selesai: laporanList.filter(i => i.status === 'Selesai').length,
    dibatalkan: totalDibatalkan,
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-slate-800"></div>
       <p className="text-slate-500 font-medium animate-pulse">Memuat Dashboard Admin...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 relative">
      
      {/* --- DECORATION BACKGROUND --- */}
      <div className="absolute top-0 inset-x-0 h-[25rem] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 rounded-b-[3rem] shadow-lg z-0">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>
      
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center">
                <Image 
                    src="/LOGO-sekolahGHAMA.png" 
                    alt="Logo Sekolah Ghama" 
                    width={200} 
                    height={200} 
                    className="mr-3 w-auto h-10"/>
                <span className="mt-3 font-extrabold text-gray-800">LAPOR</span>
                <span className="ml-1.5 mt-3 font-extrabold text-orange-500">AMAN</span>
            </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-200 max-w-[200px]">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0">
                    <User size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-700 truncate">{user?.email?.split('@')[0]}</span>
                    <span className="text-[10px] text-slate-400">Administrator</span>
                </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all text-sm font-bold border border-transparent hover:border-red-100">
              <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header Page */}
        <div className="mb-8 pt-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 flex items-center gap-2">
                <LayoutDashboard className="text-slate-800"/>Dashboard <span className="text-orange-500"> Overview</span>
            </h2>
            <p className="text-slate-600 mt-1 ml-1 font-medium">Pantau aktivitas laporan siswa secara realtime.</p>
        </div>

        {/* STATISTIK */}
        <StatsChart summary={summaryStats} totalSiswa={totalSiswa} totalAdmin={totalAdmin} />

        {/* TOOLBAR */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 sticky top-20 z-30">
            <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Cari laporan (nama, deskripsi, lokasi)..." className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-700 text-sm font-medium transition-all"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative min-w-[180px]">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <select className="w-full pl-11 pr-8 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500/50 text-slate-500 text-sm font-bold cursor-pointer appearance-none transition-all"
                    value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="Semua">Semua Status</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
        </div>

        {/* REPORT LIST */}
        <div className="space-y-4">
            <AnimatePresence>
                {filteredList.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><FileText size={40} className="text-slate-300" /></div>
                        <h3 className="text-lg font-bold text-slate-800">Data tidak ditemukan</h3>
                        <p className="text-sm text-slate-600">Silahkan Ganti Kata Kunci Anda</p>
                        <button onClick={() => {setSearchTerm(''); setFilterStatus('Semua')}} className="mt-4 text-orange-500 font-bold text-sm hover:underline">Reset Filter</button>
                    </motion.div>
                ) : (
                    filteredList.map((item) => (
                        <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={item.id} 
                            className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md ${
                                item.status === 'Menunggu' ? 'border-l-4 border-l-red-500 border-slate-200' : 
                                item.status === 'Diproses' ? 'border-l-4 border-l-yellow-500 border-slate-200' :
                                item.status === 'Selesai' ? 'border-l-4 border-l-green-500 border-slate-200' :
                                'border-slate-200'
                            }`}>
                            <div className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                    <div className="flex gap-4 items-start flex-1 min-w-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm ${getCaseConfig(item.jenisKasus).color}`}>
                                            {getCaseConfig(item.jenisKasus).icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-800 text-lg truncate max-w-[350px]">{item.jenisKasus}</span>
                                                {getStatusBadge(item.status)}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1"><Calendar size={12}/> {formatDate(item.createdAt)}</span>
                                                {item.lokasi && <span className="flex items-center gap-1 truncate max-w-[350px]"><MapPin size={12}/> {item.lokasi}</span>}
                                                <span className="flex items-center gap-1 truncate max-w-[350px]"><User size={12}/> {item.userEmail || "Anonim"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center pl-2 border-l border-slate-100 ml-2 md:ml-0 md:pl-0 md:border-none">
                                        <div className={`p-2 rounded-full transition-transform duration-300 ${expandedId === item.id ? 'rotate-180 bg-slate-100 text-slate-800' : 'text-slate-400'}`}>
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === item.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200 bg-slate-100">
                                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div className="lg:col-span-2 space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={14}/> Deskripsi Laporan</h4>
                                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed shadow-sm">"{item.deskripsi}"</div>
                                                </div>
                                            
                                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2"><Shield size={14}/> Tindak Lanjut & Respon</h4>
                                                    <div className="mb-4">
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">Pesan untuk Siswa (Dikirim via email)</label>
                                                        <textarea className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-slate-50 text-slate-700"
                                                            placeholder="Tulis pesan tindak lanjut..." rows={3}
                                                            value={catatanInput[item.id] !== undefined ? catatanInput[item.id] : (item.catatanAdmin || "")}
                                                            onChange={(e) => handleCatatanChange(item.id, e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-200 pt-4">
                                                        <span className="text-xs text-slate-500 font-medium">{isUpdating === item.id ? "Mengirim..." : "Simpan & Kirim Email:"}</span>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                                                            {['Menunggu', 'Diproses', 'Selesai'].map((statusOption) => (
                                                                <button key={statusOption} disabled={!!isUpdating} onClick={() => updateStatus(item, statusOption)}
                                                                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 w-full ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''} ${item.status === statusOption ? (statusOption === 'Menunggu' ? 'bg-red-50 text-red-600 border-red-200' : statusOption === 'Diproses' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-green-50 text-green-600 border-green-200') + ' border ring-1' : 'text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200'}`}>
                                                                    {isUpdating === item.id && item.status !== statusOption ? <Loader2 className="animate-spin" size={12}/> : <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusOption === 'Menunggu' ? 'bg-red-500' : statusOption === 'Diproses' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>}
                                                                    {statusOption}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2"><ImageIcon size={14} /> Bukti Lampiran</h4>
                                                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                                                    {item.imageUrl ? (
                                                        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 group">
                                                            <Image src={item.imageUrl} alt="Bukti" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <a href={item.imageUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-100 transition">Lihat Penuh</a>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-48 w-full bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                                                            <ImageIcon size={32} className="opacity-20 mb-2" />
                                                            <span className="text-xs font-medium">Tidak ada foto</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}