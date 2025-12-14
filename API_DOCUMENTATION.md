# Portfolio Backend API Documentation

## 🚀 Server Setup

The backend server runs on **port 8080** and provides RESTful API endpoints for the portfolio application.

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
cd Backend
npm install
npm start
```

The server will start and initialize predefined admin accounts automatically.

---

## 🔐 Predefined Admin Credentials

Two admin accounts are automatically created on first run:

### Superadmin
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** superadmin

### Moderator
- **Email:** `moderator@example.com`
- **Password:** `moderator123`
- **Role:** admin

---

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Health Check
```
GET /health
```

---

## 👥 User Routes (`/users`)

### Register User
```
POST /users/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

### Login User
```
POST /users/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

### Get User Profile (Protected)
```
GET /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

### Update User Profile (Protected)
```
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210"
}
```

### Get All Users
```
GET /users/all
```

---

## 🛡️ Admin Routes (`/admin`)

### Admin Login
```
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Admin login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "superadmin",
    "permissions": [...]
  }
}
```

### Get Admin Dashboard (Protected)
```
GET /admin/dashboard
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Get All Admins (Protected)
```
GET /admin/all
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Create New Admin (Protected - Superadmin only)
```
POST /admin/create
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "password123",
  "role": "admin"
}
```

---

## 📞 Contact Routes (`/contact`)

### Send Contact Message
```
POST /contact/send
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a project..."
}
```

### Get All Contacts (Protected - Admin only)
```
GET /contact/all
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Get Single Contact (Protected - Admin only)
```
GET /contact/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Update Contact Status (Protected - Admin only)
```
PUT /contact/:id/status
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "responded"
}
```

**Valid statuses:** `new`, `read`, `responded`

### Delete Contact (Protected - Admin only)
```
DELETE /contact/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Get Contact Statistics (Protected - Admin only)
```
GET /contact/stats/all
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## 📚 Course Routes (`/courses`)

### Get All Courses
```
GET /courses/all
```

### Get Course by ID
```
GET /courses/:id
```

### Get Courses by Category
```
GET /courses/category/:category
```

### Create Course (Protected - Admin only)
```
POST /courses/create
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Advanced React",
  "description": "Learn advanced React concepts...",
  "category": "web-development",
  "instructor": "John Instructor",
  "duration": "8 weeks",
  "level": "advanced",
  "topics": ["Hooks", "Context API", "Performance"],
  "price": 99.99,
  "image": "course_image_url"
}
```

### Update Course (Protected - Admin only)
```
PUT /courses/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Delete Course (Protected - Admin only)
```
DELETE /courses/:id
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

### Get Course Statistics (Protected - Admin only)
```
GET /courses/stats/all
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

## 🔑 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued upon:
- User registration
- User login
- Admin login

Tokens expire after 7 days.

---

## 🗄️ Database Models

### User Model
- `name` (String, required)
- `email` (String, unique, required)
- `phone` (String, required)
- `password` (String, hashed, required)
- `createdAt` (Date)
- `updatedAt` (Date)

### Admin Model
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `role` (String, enum: ['admin', 'superadmin'])
- `permissions` (Array)
- `createdAt` (Date)
- `updatedAt` (Date)

### Contact Model
- `name` (String, required)
- `email` (String, required)
- `phone` (String, required)
- `subject` (String, required)
- `message` (String, required)
- `status` (String, enum: ['new', 'read', 'responded'])
- `createdAt` (Date)

### Course Model
- `title` (String, required)
- `description` (String, required)
- `category` (String, required)
- `instructor` (String, required)
- `duration` (String)
- `level` (String, enum: ['beginner', 'intermediate', 'advanced'])
- `topics` (Array)
- `price` (Number)
- `image` (String)
- `createdAt` (Date)
- `updatedAt` (Date)

---

## 🔧 Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:5173
```

---

## 🚀 Running the Server

```bash
# Development mode (with nodemon - auto-restart on file changes)
npm start

# Or directly with Node
node index.js
```

The server will:
1. Connect to MongoDB
2. Initialize predefined admin accounts
3. Start listening on port 8080

---

## 📊 Response Format

All responses follow this format:

### Success Response
```json
{
  "message": "Success message",
  "data": {...}
}
```

### Error Response
```json
{
  "message": "Error message",
  "error": "Error details"
}
```

---

## 🔒 Security Features

- ✓ Password hashing with bcrypt
- ✓ JWT token authentication
- ✓ CORS enabled
- ✓ Input validation
- ✓ Error handling
- ✓ Predefined admin accounts for easy testing

---

## 📝 Notes

- All passwords are hashed before storage
- JWT tokens expire after 7 days
- Contact messages are marked as 'new' by default
- Admin operations require valid JWT token and admin role
- MongoDB must be running for the server to work

---

**Last Updated:** December 14, 2025
**Version:** 1.0.0
