import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as admin from 'firebase-admin';

// 1. Inisialisasi Firebase Admin (Hanya berjalan di Server)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    // 2. Minta Link Reset Password ke Firebase (sebagai Admin)
    const link = await admin.auth().generatePasswordResetLink(email);

    // 3. Siapkan Pengirim Email (Gmail Anda)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 4. Desain Isi Email (HTML)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password - Lapor Aman</title>
        <style>
          /* Reset Styles */
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; }
          table { border-spacing: 0; width: 100%; }
          td { padding: 0; }
          img { border: 0; }
          
          /* Container Styles */
          .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
          .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          
          /* Header Styles */
          .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 0; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
          .header h1 span { color: #fb923c; }
          .header p { color: #bfdbfe; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
          
          /* Content Styles */
          .content { padding: 40px 30px; text-align: center; }
          .icon-container { background-color: #eff6ff; width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 24px auto; display: block; }
          .icon { width: 32px; height: 32px; margin-top: 16px; }
          
          h2 { color: #111827; margin: 0 0 16px 0; font-size: 22px; font-weight: 700; }
          p { color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; }
          
          /* Button Styles */
          .btn-container { margin: 32px 0; }
          .btn { background-color: #f97316; color: #ffffff !important; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.25); transition: background-color 0.3s ease; }
          .btn:hover { background-color: #ea580c; }
          
          /* Footer Styles */
          .footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer p { font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5; }
          .warning { font-size: 13px; color: #6b7280; margin-top: 20px; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <table role="presentation">
            <tr>
              <td align="center" style="padding-top: 40px;">
                <div class="main">
                  
                  <!-- Header -->
                  <div class="header">
                    <h1>LAPOR <span>AMAN</span></h1>
                    <p>SMP Gelora Depok</p>
                  </div>
                  
                  <!-- Content -->
                  <div class="content">
                    <!-- Icon Kunci (Simulasi SVG) -->
                    <div class="icon-container">
                       <img src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" alt="Lock Icon" class="icon" style="width: 32px; height: 32px; vertical-align: middle;">
                    </div>

                    <h2>Permintaan Reset Password</h2>
                    
                    <p>Halo,</p>
                    <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun <strong>LAPOR AMAN</strong> Anda. Jangan khawatir, akun Anda aman. Klik tombol di bawah ini untuk membuat kata sandi baru:</p>
                    
                    <div class="btn-container">
                      <a href="${link}" class="btn">Reset Kata Sandi Saya</a>
                    </div>
                    
                    <p class="warning">Jika Anda tidak merasa meminta reset password, silakan abaikan email ini. Link ini akan kedaluwarsa dalam 1 jam.</p>
                  </div>
                  
                  <!-- Footer -->
                  <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} LAPOR AMAN - SMP Gelora. All rights reserved.</p>
                    <p style="margin-top: 8px;">Pesan otomatis dari sistem Lapor Aman. Jangan membalas email ini.</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
    // 5. Kirim Email!
    await transporter.sendMail({
      from: `"Admin Lapor Aman" <${process.env.GMAIL_USER}>`, // Nama Pengirim Keren
      to: email,
      subject: 'Reset Password Akun Lapor Aman', // Subjek Email
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Email berhasil dikirim' });

  } catch (error: any) {
    console.error('Reset Password API Error:', error);
    
    // Handle jika email tidak terdaftar
    if (error.code === 'auth/user-not-found') {
       return NextResponse.json({ error: 'Email tidak terdaftar dalam sistem.' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Gagal mengirim email. Silakan coba lagi.' }, { status: 500 });
  }
}