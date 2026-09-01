const nodemailer = require('nodemailer');

/**
 * Sends OTP email using Nodemailer if credentials are set,
 * or logs to server console as fallback for offline/demo mode.
 */
async function sendOtpEmail(recipientEmail, otpCode) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  console.log(`\n==================================================`);
  console.log(`🔑 [DEMO / DEV OTP LOG] Recipient: ${recipientEmail}`);
  console.log(`👉 Verification OTP Code: ${otpCode}`);
  console.log(`==================================================\n`);

  if (!emailUser || !emailPass) {
    console.log(`[Mailer Info] EMAIL_USER/EMAIL_PASS not configured in .env. Operating in Dev/Presentation mode.`);
    return {
      success: true,
      deliveredViaEmail: false,
      devOtp: otpCode,
      message: 'OTP generated. Demo/Console fallback active.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
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

    await transporter.sendMail({
      from: `"College Grievance Portal" <${emailUser}>`,
      to: recipientEmail,
      subject: `Your Login Verification Code: ${otpCode}`,
      html: htmlContent
    });

    console.log(`[Mailer Success] OTP sent via email to ${recipientEmail}`);
    return {
      success: true,
      deliveredViaEmail: true,
      message: 'OTP sent to email address.'
    };
  } catch (error) {
    console.error(`[Mailer Error] Failed to send email via SMTP: ${error.message}`);
    // Graceful fallback so presentation demo never halts on network/credential error
    return {
      success: true,
      deliveredViaEmail: false,
      devOtp: otpCode,
      message: `Email sending failed (${error.message}). Console OTP fallback active.`
    };
  }
}

module.exports = {
  sendOtpEmail
};
