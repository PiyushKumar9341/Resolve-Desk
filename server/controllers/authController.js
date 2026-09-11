const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const User = require('../models/User');
const { extractNameFromEmail } = require('../utils/nameExtractor');
const { sendOtpEmail } = require('../utils/mailer');

const RESEND_COOLDOWN_MS = 5 * 1000; // 5 seconds fast cooldown for presentation
const OTP_EXPIRY_MINUTES = 10;

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');
}

function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_mca_project_jwt_key_2026',
    { expiresIn: '30d' }
  );
}

// @desc    Send 6-digit OTP to student email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { email, roleMode = 'student' } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Early Role Pre-Check before generating or sending OTP
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (roleMode === 'admin') {
      if (!existingUser || existingUser.role !== 'admin') {
        return res.status(403).json({
          message: 'Access Denied: This email does not have administrator privileges. Please switch to Student Login.'
        });
      }
    } else if (roleMode === 'student') {
      if (existingUser && existingUser.role === 'admin') {
        return res.status(400).json({
          message: 'Administrator Account Detected: Please switch to the Admin Portal tab to log in.'
        });
      }
    }

    // Check resend cooldown only on active unused OTPs for the same email
    const recentOtp = await Otp.findOne({ email: normalizedEmail, used: false }).sort({ createdAt: -1 });
    if (recentOtp) {
      const timeElapsed = Date.now() - new Date(recentOtp.createdAt).getTime();
      if (timeElapsed < RESEND_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - timeElapsed) / 1000);
        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
          cooldownSeconds: remainingSeconds
        });
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOtp(otpCode);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP to DB
    await Otp.create({
      email: normalizedEmail,
      otpHash,
      expiresAt,
      used: false
    });

    // Send Email or fallback
    const mailResult = await sendOtpEmail(normalizedEmail, otpCode);

    return res.status(200).json({
      success: true,
      message: mailResult.deliveredViaEmail
        ? `OTP sent successfully to ${normalizedEmail}`
        : `OTP sent! (Demo mode fallback active)`,
      devOtp: mailResult.devOtp || null,
      cooldownSeconds: 60
    });
  } catch (error) {
    console.error('[Send OTP Error]', error);
    return res.status(500).json({ message: 'Server error while sending OTP. Please try again.' });
  }
};

// @desc    Verify 6-digit OTP & Login/Register student
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();
    const inputHash = hashOtp(cleanOtp);

    // Find active OTP record
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      otpHash: inputHash,
      used: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // Mark OTP as used (single-use)
    otpRecord.used = true;
    await otpRecord.save();

    // Check if User exists or create new student with extracted name
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const extractedName = extractNameFromEmail(normalizedEmail);
      user = await User.create({
        name: extractedName,
        email: normalizedEmail,
        role: 'student'
      });
      console.log(`[User Registered] Email: ${normalizedEmail} -> Extracted Name: "${extractedName}"`);
    } else {
      console.log(`[User Logged In] Email: ${normalizedEmail} -> Name: "${user.name}"`);
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful. Welcome!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('[Verify OTP Error]', error);
    return res.status(500).json({ message: 'Server error while verifying OTP. Please try again.' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};
