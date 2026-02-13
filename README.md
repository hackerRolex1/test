# Documentation Environment Server

A comprehensive authentication and logging system built with Express.js featuring user login, signup, session management, and detailed request/response logging with color-coded console output.

## 🚀 Features

### Authentication & User Management
- ✅ **User Registration (Signup)** - Create new user accounts with validation
- ✅ **User Login** - Authenticate with email and password
- ✅ **Token-Based Sessions** - Secure session management with auto-generated tokens
- ✅ **Auto-Login** - Automatic login after successful signup
- ✅ **Auto-Redirect** - Redirect already-logged-in users to dashboard
- ✅ **Email Validation** - Live email validation and duplicate prevention
- ✅ **Password Validation** - Minimum 6 characters required
- ✅ **User Dashboard** - Protected dashboard with user info display

### Frontend UI
- 🎨 **Beautiful Responsive Design** - Gradient backgrounds with modern styling
- 📱 **Mobile Friendly** - Fully responsive login and signup pages
- 🔄 **Form Validation** - Client-side validation with error messages
- 💅 **User-Friendly** - Smooth animations and transitions
- 📝 **Real-time Email Check** - Check email availability while typing

### Logging & Debugging
- 📊 **Detailed Console Logging** - Color-coded logs for all operations
- 📨 **Request Logging** - Log every HTTP request with method, path, IP, headers
- 📤 **Response Logging** - Log HTTP responses with status codes and messages
- 🔍 **Debug Information** - Detailed debug logs for troubleshooting
- 🎯 **Operation Tracking** - Track all validation steps and database operations
- 🔐 **Security Logging** - Log authentication attempts and failures
- 🚨 **Error Logging** - Detailed error messages with context

### API Endpoints
- **POST /api/login** - User login
- **POST /api/signup** - User registration
- **POST /api/check-email** - Check if email exists
- **POST /api/verify-token** - Verify session token
- **GET /api/users** - Get all registered users (testing)
- **GET /client-info** - Get client connection info (testing)

### Page Routes
- **GET /** - Home/Login page
- **GET /login** - Login page
- **GET /signup** - Signup page
- **GET /dashboard** - User dashboard (protected)

## 📋 Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Logging Features](#logging-features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Examples](#examples)
- [Security Notes](#security-notes)

## 💻 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

### Clone Repository

```bash
git clone https://github.com/hackerRolex1/test.git
cd Environments/Documentation-ENV
```

### Install Dependencies

```bash
npm install
```

This will install:
- **express** - Web framework
- **morgan** - HTTP request logging middleware
- **nodemon** - Auto-reload during development (optional)

## 🔧 Setup

### Configure Environment Variables (Optional)

```bash
# Set custom port (default is 3000)
export PORT=3000

# Set environment (development/production)
export NODE_ENV=development
```

### User Configuration

Git configuration (if not already set):

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## ▶️ Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Production Mode

```bash
npm start
```

### Direct Node Execution

```bash
node index.js
```

The server will start on **http://localhost:3000** by default.

## 📡 API Documentation

### Authentication Endpoints

#### 1. Check Email Existence

**Request:**
```bash
POST /api/check-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (Email exists):**
```json
{
  "exists": true,
  "message": "Email already registered. Please login."
}
```

**Response (Email available):**
```json
{
  "exists": false,
  "message": "Email available. You can sign up."
}
```

---

#### 2. User Signup

**Request:**
```bash
POST /api/signup
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (201):**
```json
{
  "message": "Sign up successful",
  "token": "am9obkBlc29uQGV4YW1wbGUuY29tMTcwODkxMjI3MDAw",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
```json
// Missing fields (400)
{
  "message": "All fields are required"
}

// Invalid email format (400)
{
  "message": "Invalid email format"
}

// Email already exists (409)
{
  "message": "Email already registered. Please login instead.",
  "emailExists": true
}

// Password too short (400)
{
  "message": "Password must be at least 6 characters"
}
```

---

#### 3. User Login

**Request:**
```bash
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "am9obkBlc29uQGV4YW1wbGUuY29tMTcwODkxMjI3MDAw",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
```json
// User not found (404)
{
  "message": "User not found. Please sign up first.",
  "userExists": false
}

// Wrong password (401)
{
  "message": "Invalid password",
  "userExists": true
}

// Missing credentials (400)
{
  "message": "Email and password are required"
}
```

---

#### 4. Verify Token

**Request:**
```bash
POST /api/verify-token
Content-Type: application/json

{
  "token": "am9obkBlc29uQGV4YW1wbGUuY29tMTcwODkxMjI3MDAw"
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "valid": false,
  "message": "Invalid token"
}
```

---

### Testing Endpoints

#### 5. Get All Users

**Request:**
```bash
GET /api/users
```

**Response:**
```json
{
  "totalUsers": 2,
  "users": [
    {
      "id": 1,
      "fullname": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "fullname": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

---

#### 6. Get Client Info

**Request:**
```bash
GET /client-info
```

**Response:**
```json
{
  "ip": "::1",
  "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
  "host": "localhost:3000",
  "method": "GET",
  "url": "/client-info",
  "query": {},
  "timestamp": "2026-02-13T11:42:30.123Z",
  "headers": {
    "host": "localhost:3000",
    "user-agent": "Mozilla/5.0...",
    ...
  }
}
```

---

## 📊 Logging Features

### Console Log Levels

The application uses **5 color-coded logging levels**:

| Level | Color | Icon | Usage |
|-------|-------|------|-------|
| **INFO** | Cyan | ℹ | General information |
| **SUCCESS** | Green | ✓ | Operation successful |
| **ERROR** | Red | ✗ | Error conditions |
| **WARNING** | Yellow | ⚠ | Warnings |
| **DEBUG** | Magenta | 🔍 | Debug details |

### Request Logging

Every request is logged with:
- HTTP Method (GET, POST, etc.)
- Request Path
- Request Body (passwords hidden)
- Client IP Address
- Content-Type
- User-Agent
- Query Parameters
- Headers (selected)

**Example:**
```
[11:42:30] 📨 REQUEST: POST /api/login | Login attempt for: user@example.com
[11:42:30] 🔍 DEBUG: Request Body: {"email":"user@example.com","password":"***hidden***"}
[11:42:30] 🔍 DEBUG: Client IP: ::1
[11:42:30] 🔍 DEBUG: Content-Type: application/json
```

### Response Logging

Every response is logged with:
- HTTP Status Code
- Response Description
- Operations Performed
- Validation Results
- Generated Tokens (truncated)

**Example:**
```
[11:42:30] ✓ SUCCESS: ✓ Login successful for user: John Doe (user@example.com)
[11:42:30] ℹ INFO: Session token generated and sent to client
[11:42:30] 📤 RESPONSE: Status 200 | User authenticated - John Doe
```

### Startup Logs

When the server starts, you'll see:
- Server initialization message
- Server URL and port
- Environment information
- PID and Node version
- All available routes with descriptions
- Database status
- Authentication type
- Logging capabilities

**Example Startup Output:**
```
[11:42:30] ✓ SUCCESS: Server initialized with detailed logging system

[11:42:30] ✓ SUCCESS: ================================================
[11:42:30] ✓ SUCCESS: 🚀 SERVER STARTED SUCCESSFULLY!
[11:42:30] ✓ SUCCESS: ================================================
[11:42:30] ℹ INFO: 📍 Server URL: http://localhost:3000
[11:42:30] ℹ INFO: 📊 Environment: development
[11:42:30] ℹ INFO: ⏰ Started at: 2/13/2026, 11:42:30 AM
[11:42:30] ℹ INFO: 🔢 PID: 16575
[11:42:30] ℹ INFO: 💾 Node Version: v18.19.1
```

## 📁 Project Structure

```
Documentation-ENV/
├── index.js                 # Main server file with all routes and logic
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── README.md              # This file
├── .gitignore             # Git ignore rules
└── public/
    ├── login.html         # Login page UI
    └── signup.html        # Signup page UI
```

### File Descriptions

#### `index.js` (Main Server File)
- **Logger Utility** - Custom color-coded logging functions
- **Express Setup** - Server initialization and middleware configuration
- **Page Routes** - HTML page serving (/, /login, /signup, /dashboard)
- **API Routes** - Authentication and testing endpoints
- **Server Listeners** - Request/response logging and error handling

#### `public/login.html`
- Beautiful login form
- Email and password inputs
- Form validation
- Auto-detection of logged-in users
- Auto-redirect to signup if user not found
- Session token storage

#### `public/signup.html`
- User registration form
- Full name, email, password inputs
- Confirm password field
- Live email validation
- Password strength validation
- Auto-login after signup
- Error handling with user guidance

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Morgan** - HTTP request logging middleware

### Frontend
- **HTML5** - Markup structure
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Client-side logic and API calls

### Development Tools
- **npm** - Package manager
- **nodemon** - Auto-reload development server
- **Git** - Version control

### Security
- **Base64 Encoding** - Token generation (note: use JWT in production)
- **Input Validation** - Email format and password strength
- **Duplicate Prevention** - Email uniqueness checks

## 🌍 Environment Variables

```bash
# Port (default: 3000)
PORT=3000

# Environment (default: development)
NODE_ENV=development
```

### Scripts in package.json

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

## 📚 Examples

### Using cURL

#### Signup
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Check Email
```bash
curl -X POST http://localhost:3000/api/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

#### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Using JavaScript/Fetch

#### Signup
```javascript
fetch('http://localhost:3000/api/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullname: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Signup successful:', data);
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
});
```

#### Login
```javascript
fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123'
  })
})
.then(res => res.json())
.then(data => {
  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = '/dashboard';
  }
});
```

## 🔐 Security Notes

### ⚠️ Development Only
This is a development/testing environment. For production use:

1. **Use JWT** instead of Base64 encoding for tokens
2. **Hash Passwords** - Use bcrypt or similar
3. **HTTPS Only** - Always use HTTPS in production
4. **Environment Variables** - Store sensitive data in .env files
5. **Database** - Use a proper database (MongoDB, PostgreSQL, etc.)
6. **CORS** - Implement proper CORS policies
7. **Rate Limiting** - Add rate limiting to prevent abuse
8. **Input Sanitization** - Sanitize all user inputs
9. **SQL Injection Prevention** - Use parameterized queries
10. **Session Management** - Implement secure session timeout

### Current Limitations (Development)
- ⚠️ Passwords stored in plaintext (use bcrypt in production)
- ⚠️ Tokens not encrypted (use JWT in production)
- ⚠️ In-memory database (use persistent database in production)
- ⚠️ No CORS configured (add CORS middleware in production)
- ⚠️ No rate limiting (add rate limiting in production)

## 🚀 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] JWT authentication
- [ ] Password hashing with bcrypt
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] OAuth2 integration
- [ ] Admin panel
- [ ] User profile management
- [ ] Activity logging to file
- [ ] API rate limiting
- [ ] Request validation middleware

## 📝 License

This project is part of the Mobzway Infrastructure Documentation Environment.

## 👨‍💻 Author

**Your Name**  
Email: your.email@example.com  
GitHub: [hackerRolex1](https://github.com/hackerRolex1)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact the maintainer.

---

## 🧪 Testing

### Quick Start Test

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:3000
   ```

3. **Test Signup:**
   - Fill in: Name, Email, Password
   - Click Sign Up
   - Should auto-login and redirect to dashboard

4. **Test Login:**
   - Go back to login
   - Enter same email/password
   - Should login successfully

5. **Test API (with cURL or Postman):**
   - GET http://localhost:3000/api/users
   - Should return list of registered users

### Terminal Logs While Testing

You'll see detailed console logs like:
```
📨 REQUEST: POST /api/signup | Signup attempt for: test@example.com
✓ SUCCESS: ✓ Email format is valid
✓ SUCCESS: ✓ Password length is valid (8 chars)
✓ SUCCESS: ✓ Signup successful for: Test User (test@example.com)
📤 RESPONSE: Status 201 | New user registered - Test User
```

---

**Last Updated:** February 13, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready for Development/Testing
