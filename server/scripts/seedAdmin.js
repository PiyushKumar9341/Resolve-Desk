const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

async function seedAdmin() {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_grievance_db';
  console.log(`[Seed Admin] Connecting to: ${connStr}`);
  await mongoose.connect(connStr);

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@resolvedesk.edu';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        role: 'admin'
      });
      console.log(`[Seed Admin] Created new Admin user successfully:`);
    } else {
      admin.role = 'admin';
      if (!admin.name || admin.name === 'Student') {
        admin.name = adminName;
      }
      await admin.save();
      console.log(`[Seed Admin] Existing user found and updated to Admin role:`);
    }

    console.log(`--------------------------------------------------`);
    console.log(`👤 Name:  ${admin.name}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🛡️ Role:  ${admin.role}`);
    console.log(`🆔 ID:    ${admin._id}`);
    console.log(`--------------------------------------------------`);
    console.log(`\n✅ Admin account ready for use.`);
    console.log(`Login via Portal using email "${admin.email}" and the 6-digit OTP.\n`);
  } catch (err) {
    console.error('[Seed Admin] Error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Seed Admin] Database connection closed.');
  }
}

seedAdmin();
