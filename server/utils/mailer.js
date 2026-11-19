const nodemailer = require('nodemailer');

/**
 * Sends OTP email using Nodemailer.
 * Optimized for Vercel / Cloud deployments.
 */
async function sendOtpEmail(recipientEmail, otpCode) {
  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : null;
  // Remove any spaces if user copied Google App Password with spaces
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : null;

  console.log(`\n==================================================`);
  console.log(`🔑 [OTP DISPATCH] Recipient: ${recipientEmail}`);
  console.log(`👉 Code: ${otpCode}`);
  console.log(`==================================================\n`);

  if (!emailUser || !emailPass) {
    console.warn(`⚠️ [Mailer Warning] EMAIL_USER ya EMAIL_PASS missing hai environment variables me!`);
    return {
      success: true,
      deliveredViaEmail: false,
      devOtp: otpCode,
      message: 'EMAIL_USER or EMAIL_PASS not set in environment variables.'
    };
  }

  try {
    // Explicit SMTP configuration for reliable delivery on Vercel/Cloud servers
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: (Number(process.env.EMAIL_PORT) || 465) === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10s timeout
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 700;">College Grievance Portal</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Student Identity Verification</p>
        </div>
        <div style="padding: 32px 24px; text-align: center;">
          <p style="font-size: 15px; color: #475569; margin-bottom: 24px;">Use the following 6-digit verification code to complete your login request:</p>
          <div style="background: #f1f5f9; padding: 18px 24px; border-radius: 10px; display: inline-block; letter-spacing: 8px; font-size: 32px; font-weight: 800; color: #1e293b; border: 1px dashed #cbd5e1;">
            ${otpCode}
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">This code will expire in <strong>10 minutes</strong>. Do not share this OTP with anyone.</p>
        </div>
        <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
          College Student Complaint & Grievance Management System &copy; 2026
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"College Grievance Portal" <${emailUser}>`,
      to: recipientEmail,
      subject: `Your Login Verification Code: ${otpCode}`,
      html: htmlContent
    });

    console.log(`✅ [Mailer Success] OTP sent via email to ${recipientEmail} | Message ID: ${info.messageId}`);
    return {
      success: true,
      deliveredViaEmail: true,
      message: 'OTP sent to email address successfully.'
    };
  } catch (error) {
    console.error(`❌ [Mailer Error] Failed to send email via SMTP:`, error.message);
    return {
      success: true,
      deliveredViaEmail: false,
      devOtp: otpCode,
      errorDetail: error.message,
      message: `Email sending failed (${error.message}).`
    };
  }
}

module.exports = {
  sendOtpEmail
};
