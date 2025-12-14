# Backend Quick Start Guide

## 📁 Backend Directory Structure

```
Backend/
├── controller/                    # Business logic
│   ├── userController.js         # User auth & profile management
│   ├── adminController.js        # Admin auth & dashboard
│   ├── contactController.js      # Contact message handling
│   └── courseController.js       # Course management
│
├── routes/                        # API routes
│   ├── userRoutes.js             # /api/users endpoints
│   ├── adminRoutes.js            # /api/admin endpoints
│   ├── contactRoutes.js          # /api/contact endpoints
│   └── courseRoutes.js           # /api/courses endpoints
│
├── model/                         # Database schemas
│   ├── User.js                   # User schema
│   ├── Admin.js                  # Admin schema
│   ├── Contact.js                # Contact schema
│   └── Course.js                 # Course schema
│
├── middleware/                    # Express middleware
│   └── authMiddleware.js         # JWT authentication
│
├── index.js                      # Main server file (Port 8080)
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── API_DOCUMENTATION.md          # Full API docs
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Set Up Environment
The `.env` file is already configured with default values:
- PORT: 8080
- MONGO_URI: mongodb://localhost:27017/portfolio
- JWT_SECRET: your_jwt_secret_key_change_this_in_production

### 3. Ensure MongoDB is Running
```bash
# MongoDB should be running on localhost:27017
mongod
```

### 4. Start the Server
```bash
npm start
```

You should see:
```
═══════════════════════════════════════════════
🚀 Server running successfully on port 8080
═══════════════════════════════════════════════

🔐 Predefined Admin Credentials:
   Email: admin@example.com
   Password: admin123
   OR
   Email: moderator@example.com
   Password: moderator123
```

## 🔐 Predefined Admin Accounts

Two admin accounts are **automatically created** on first server run:

### Account 1 (Superadmin)
```
Email: admin@example.com
Password: admin123
Role: superadmin
```

### Account 2 (Moderator)
```
Email: moderator@example.com
Password: moderator123
Role: admin
```

## 📡 API Base URL
```
http://localhost:8080/api
```

## 🔑 Key Features

### User Management
- ✅ User registration with password hashing
- ✅ User login with JWT token
- ✅ User profile management
- ✅ Password security with bcrypt

### Admin Management
- ✅ Admin login with predefined credentials
- ✅ Admin dashboard access
- ✅ Create new admin accounts
- ✅ Role-based access control

### Contact Management
- ✅ Receive contact messages from users
- ✅ Mark messages as read/responded
- ✅ Contact statistics
- ✅ Message management

### Course Management
- ✅ Create, read, update, delete courses
- ✅ Filter courses by category
- ✅ Course statistics
- ✅ Difficulty levels (beginner, intermediate, advanced)

## 🔒 Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

## 🧪 Testing the API

### Test User Registration
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }'
```

### Test Admin Login
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Test Health Check
```bash
curl http://localhost:8080/api/health
```

## 📊 Database Models

### User
- name, email, phone, password (hashed), timestamps

### Admin
- name, email, password (hashed), role, permissions, timestamps

### Contact
- name, email, phone, subject, message, status, timestamp

### Course
- title, description, category, instructor, duration, level, topics, price, image, timestamps

## 🛠️ Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

## 📝 Important Notes

1. **First Run:** Predefined admins are created automatically
2. **JWT Secret:** Change the JWT_SECRET in production
3. **CORS:** Configured for frontend at http://localhost:5173
4. **Password Hashing:** All passwords are hashed with bcrypt
5. **Token Expiry:** JWT tokens expire after 7 days

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in `.env` file

### Port Already in Use
- Change PORT in `.env` file

### CORS Issues
- Update CORS_ORIGIN in `.env` file

### JWT Errors
- Ensure token is sent in Authorization header as: `Bearer <token>`

## 📚 Additional Resources

- See `API_DOCUMENTATION.md` for detailed endpoint documentation
- All controllers have comprehensive error handling
- All routes are properly protected with middleware

---

**Happy Coding! 🎉**
