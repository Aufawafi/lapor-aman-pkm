// src/app/api/delete-image/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary (Server Side)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ message: 'Image URL is required' }, { status: 400 });
    }

    // 1. Ekstrak Public ID dari URL
    // URL Contoh: https://res.cloudinary.com/demo/image/upload/v12345678/lapor_aman_preset/fotobukti.jpg
    // Kita butuh: lapor_aman_preset/fotobukti
    
    const urlParts = imageUrl.split('/');
    const versionIndex = urlParts.findIndex((part: string) => part.startsWith('v') && !isNaN(Number(part.substring(1))));
    
    // Ambil bagian setelah version (v12345), lalu gabungkan kembali, dan buang ekstensi (.jpg)
    const publicIdWithExtension = urlParts.slice(versionIndex + 1).join('/');
    const publicId = publicIdWithExtension.split('.')[0];

    // 2. Perintahkan Cloudinary menghapus
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
         console.error("Cloudinary delete failed:", result);
         // Kita return 200 saja biar proses delete di frontend tidak error, cukup log di server
         return NextResponse.json({ message: 'Gagal hapus di cloud, tapi lanjut hapus DB', result }, { status: 200 });
    }

    return NextResponse.json({ message: 'Gambar berhasil dihapus', result }, { status: 200 });

  } catch (error: any) {
    console.error('DELETE IMAGE ERROR:', error);
    return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
  }
}