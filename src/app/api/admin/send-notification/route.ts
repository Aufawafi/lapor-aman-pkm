import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, nama, status, catatan, jenisKasus } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email tujuan tidak ditemukan' }, { status: 400 });
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD, 
      },
    });

    const mailOptions = {
      from: '"Admin Lapor Aman" <no-reply@smpgelora.sch.id>',
      to: email,
      subject: `Update Status Laporan: ${status} - SMP Gelora`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 20px;">Update Laporan Pengaduan</h2>
          </div>
          <div style="padding: 20px; background-color: #f9fafb;">
            <p>Halo <strong>${nama || 'Siswa'}</strong>,</p>
            <p>Laporan kamu mengenai kasus <strong>${jenisKasus}</strong> telah ditindaklanjuti oleh pihak sekolah.</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; border-left: 5px solid ${status === 'Selesai' ? '#22c55e' : '#eab308'}; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Status Terbaru</p>
              <h3 style="margin: 5px 0 0; color: #111827; font-size: 18px;">${status}</h3>
            </div>

            ${catatan ? `
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #dbeafe;">
              <p style="margin: 0; font-weight: bold; color: #1e40af; font-size: 14px;">Pesan dari Guru/BK:</p>
              <p style="margin: 5px 0 0; color: #1e3a8a; line-height: 1.5; font-style: italic;">"${catatan}"</p>
            </div>
            ` : ''}

            <p style="margin-top: 20px; font-size: 14px; color: #4b5563;">Silakan login ke dashboard aplikasi <strong>Lapor Aman</strong> untuk melihat detail selengkapnya.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://lapor-aman-gelora.vercel.app/siswa/login" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Buka Dashboard</a>
            </div>
          </div>
          <div style="padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #1f2937;">
            &copy; ${new Date().getFullYear()} SMP Gelora - Lapor Aman
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email notifikasi berhasil dikirim' });
  } catch (err) {
    const error = err as Error;
    console.error('Gagal mengirim email:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengirim email' }, { status: 500 });
  }
}
