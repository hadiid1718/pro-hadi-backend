const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const courseRoutes = require('./routes/courseRoutes');
const workRoutes = require('./routes/workRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// Import controllers for initialization
const { initializePredefinedAdmins } = require('./controller/adminController');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI ;
    
    await mongoose.connect(mongoURI);

    console.log(' MongoDB connected successfully');

    // Initialize predefined admins after DB connection
    await initializePredefinedAdmins();
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/works', workRoutes);
app.use('/api/services', serviceRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check admin status
app.get('/api/debug/admins', async (req, res) => {
  try {
    const Admin = require('./model/Admin');
    const admins = await Admin.find().select('-password');
    res.status(200).json({
      message: 'Admins in database',
      count: admins.length,
      admins: admins.map(a => ({ id: a._id, name: a.name, email: a.email, role: a.role }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking admins', error: error.message });
  }
});

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Portfolio Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      admin: '/api/admin',
      contacts: '/api/contact',
      courses: '/api/courses',
      health: '/api/health',
      debug: '/api/debug/admins'
    },
    predefinedAdmins: [
      {
        email: 'admin@example.com',
        password: 'admin123',
        role: 'superadmin'
      },
      {
        email: 'moderator@example.com',
        password: 'moderator123',
        role: 'admin'
      }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Server setup
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════');
  console.log(`🚀 Server running successfully on port ${PORT}`);
  console.log('═══════════════════════════════════════════════\n');
  console.log('📝 API Documentation:');
  console.log(`   Base URL: http://localhost:${PORT}`);
  console.log('   Health Check: /api/health');
  console.log('\n🔐 Predefined Admin Credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
  console.log('   OR');
  console.log('   Email: moderator@example.com');
  console.log('   Password: moderator123');
  console.log('\n═══════════════════════════════════════════════\n');
});

module.exports = app;
