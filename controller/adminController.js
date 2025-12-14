const Admin = require('../model/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Predefined admin credentials
const PREDEFINED_ADMINS = [
  {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD, 
    name: process.env.ADMIN_NAME,
    role: process.env.ADMIN_ROLE || 'superadmin'
  },
];

// Initialize predefined admins (call this once during startup)
exports.initializePredefinedAdmins = async () => {
  try {
    console.log('[initializePredefinedAdmins] Starting admin initialization...');
    
    // Check if admins already exist
    const existingAdmins = await Admin.find();
    console.log(`[initializePredefinedAdmins] Found ${existingAdmins.length} existing admins`);

    if (existingAdmins.length === PREDEFINED_ADMINS.length) {
      console.log('✓ Predefined admins already exist, skipping initialization');
      return;
    }

    // Delete existing admins if count doesn't match
    if (existingAdmins.length > 0) {
      await Admin.deleteMany({});
      console.log('✓ Cleared existing admin collection');
    }

    // Create predefined admins
    for (const predefinedAdmin of PREDEFINED_ADMINS) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(predefinedAdmin.password, salt);

      const newAdmin = new Admin({
        name: predefinedAdmin.name,
        email: predefinedAdmin.email,
        password: hashedPassword,
        role: predefinedAdmin.role,
        permissions: ['view_dashboard', 'manage_users', 'manage_content', 'manage_admins']
      });

      await newAdmin.save();
      console.log(`✓ Predefined admin created: ${predefinedAdmin.email}`);
    }

    console.log('[initializePredefinedAdmins] Admin initialization completed successfully');
  } catch (error) {
    console.error('[initializePredefinedAdmins] Error initializing predefined admins:', error.message);
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get admin dashboard (protected)
exports.getAdminDashboard = async (req, res) => {
  try {
    const Admin = require('../model/Admin');
    const User = require('../model/User');
    const Contact = require('../model/Contact');
    const Course = require('../model/Course');

    console.log('[getAdminDashboard] req.adminId:', req.adminId);

    // Try to find admin by ID first, then by email
    let admin = await Admin.findById(req.adminId).select('-password');
    
    if (!admin) {
      console.log('[getAdminDashboard] Admin not found by ID, trying by email');
      // Fallback: try to find by email from token
      admin = await Admin.findOne({ email: req.email }).select('-password');
    }

    if (!admin) {
      console.log('[getAdminDashboard] Admin not found by ID or email');
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalCourses = await Course.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });

    res.status(200).json({
      message: 'Admin dashboard data fetched successfully',
      dashboard: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          createdAt: admin.createdAt
        },
        stats: {
          totalUsers,
          totalContacts,
          totalCourses,
          newContacts
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.status(200).json({
      message: 'Admins fetched successfully',
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new admin (superadmin only)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
      permissions: ['view_dashboard', 'manage_users', 'manage_content']
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all users (admin management)
exports.getAllUsersForAdmin = async (req, res) => {
  try {
    const User = require('../model/User');
    const users = await User.find().select('-password');
    res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = require('../model/User');
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};