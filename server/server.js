const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend in production build if dist exists
const clientBuildPath = path.join(__dirname, '../client/dist');
if (require('fs').existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'College Student Complaint & Grievance Management API running successfully.',
      status: 'Active',
      time: new Date().toISOString()
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🎓 College Grievance Portal Server active on PORT ${PORT}`);
  console.log(`🚀 API Endpoint: http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);
});
