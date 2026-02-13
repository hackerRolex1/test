const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Custom Logger Utility
// ============================================
const Logger = {
  timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
  
  info: (message) => {
    console.log(`\x1b[36m[${Logger.timestamp()}] ℹ INFO:\x1b[0m ${message}`);
  },
  
  success: (message) => {
    console.log(`\x1b[32m[${Logger.timestamp()}] ✓ SUCCESS:\x1b[0m ${message}`);
  },
  
  error: (message) => {
    console.log(`\x1b[31m[${Logger.timestamp()}] ✗ ERROR:\x1b[0m ${message}`);
  },
  
  warning: (message) => {
    console.log(`\x1b[33m[${Logger.timestamp()}] ⚠ WARNING:\x1b[0m ${message}`);
  },
  
  debug: (message) => {
    console.log(`\x1b[35m[${Logger.timestamp()}] 🔍 DEBUG:\x1b[0m ${message}`);
  },
  
  request: (method, path, details) => {
    console.log(`\x1b[34m[${Logger.timestamp()}] 📨 REQUEST:\x1b[0m ${method.toUpperCase()} ${path} | ${details}`);
  },
  
  response: (status, message) => {
    const color = status >= 200 && status < 300 ? '\x1b[32m' : (status >= 400 ? '\x1b[31m' : '\x1b[33m');
    console.log(`${color}[${Logger.timestamp()}] 📤 RESPONSE:\x1b[0m Status ${status} | ${message}`);
  }
};

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Custom Morgan format for detailed request logging
app.use(morgan((tokens, req, res) => {
  return `\x1b[34m[${new Date().toLocaleTimeString('en-US', { hour12: false })}] 📨 HTTP:\x1b[0m ${tokens.method(req, res)} ${tokens.url(req, res)} - \x1b[32m${tokens.status(req, res)}\x1b[0m`;
}));

// Set JSON formatting
app.set('json spaces', 2);

// Simple in-memory user storage (for testing only)
const users = [];

Logger.success('Server initialized with detailed logging system');

// Routes
app.get('/', (req, res) => {
  Logger.request('GET', '/', 'Home/Login page requested');
  Logger.info('Sending login.html to client');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/login', (req, res) => {
  Logger.request('GET', '/login', 'Login page requested');
  Logger.info('Sending login.html to client');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  Logger.request('GET', '/signup', 'Signup page requested');
  Logger.info('Sending signup.html to client');
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
  Logger.request('GET', '/dashboard', 'Dashboard page requested');
  Logger.debug(`Client IP: ${req.ip}`);
  Logger.debug(`User Agent: ${req.get('user-agent')}`);
  Logger.info('Rendering dashboard HTML');
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          width: 100%;
          max-width: 600px;
          padding: 40px;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        .user-info {
          background: #f0f0f0;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
          text-align: left;
        }
        .user-info p {
          margin: 10px 0;
          color: #555;
        }
        button {
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Dashboard</h1>
        <div class="user-info">
          <p><strong>User Name:</strong> <span id="userName"></span></p>
          <p><strong>Email:</strong> <span id="userEmail"></span></p>
        </div>
        <button onclick="logout()">Logout</button>
      </div>

      <script>
        // Retrieve user data from localStorage
        const user = JSON.parse(localStorage.getItem('user')) || {};
        document.getElementById('userName').textContent = user.fullname || 'Guest';
        document.getElementById('userEmail').textContent = user.email || 'N/A';

        function logout() {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      </script>
    </body>
    </html>
  `);
});

// API Routes

// Check if email exists (for validation)
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;
  Logger.request('POST', '/api/check-email', `Checking email: ${email}`);
  Logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
  Logger.debug(`Client IP: ${req.ip}`);
  Logger.debug(`Content-Type: ${req.get('content-type')}`);

  if (!email) {
    Logger.error('Email validation failed: Email field is empty');
    Logger.debug('Request validation: FAILED - Email is required');
    Logger.response(400, 'Email is required');
    return res.status(400).json({ message: 'Email is required' });
  }

  Logger.info(`Email validation passed: ${email}`);
  Logger.debug(`Searching for email in database: ${email}`);
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    Logger.warning(`Email already registered: ${email}`);
    Logger.info(`User found: ID=${userExists.id}, Name=${userExists.fullname}`);
    Logger.debug(`Sending response: 200 OK - Email exists`);
    Logger.response(200, `Email exists - redirecting to login`);
    return res.status(200).json({ 
      exists: true,
      message: 'Email already registered. Please login.'
    });
  } else {
    Logger.success(`Email is available for registration: ${email}`);
    Logger.debug(`Sending response: 200 OK - Email available`);
    Logger.response(200, `Email available - can proceed with signup`);
    return res.status(200).json({ 
      exists: false,
      message: 'Email available. You can sign up.'
    });
  }
});

// Verify user token (check if user is logged in)
app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;
  Logger.request('POST', '/api/verify-token', 'Verifying session token');
  Logger.debug(`Request Body: ${JSON.stringify({ token: token ? token.substring(0, 20) + '...' : 'none' })}`);
  Logger.debug(`Client IP: ${req.ip}`);

  if (!token) {
    Logger.warning('Token verification failed: No token provided');
    Logger.debug('Request validation: FAILED - No token in request body');
    Logger.response(401, 'No session token found');
    return res.status(401).json({ message: 'No token provided' });
  }

  Logger.info(`Token received and attempting to decode`);
  Logger.debug(`Token received: ${token.substring(0, 20)}...`);
  try {
    // Decode token to get email
    const decodedEmail = Buffer.from(token, 'base64').toString('utf-8').split(Date.now().toString())[0];
    Logger.debug(`Token decoded successfully, extracted email: ${decodedEmail}`);
    
    const user = users.find(u => u.email === decodedEmail);

    if (user) {
      Logger.success(`Token is valid for user: ${user.fullname} (${user.email})`);
      Logger.info(`User ID: ${user.id}, Session restored`);
      Logger.debug(`Sending response: 200 OK - Session verified`);
      Logger.response(200, 'Token verified - user session restored');
      return res.status(200).json({
        valid: true,
        user: {
          id: user.id,
          fullname: user.fullname,
          email: user.email
        }
      });
    } else {
      Logger.error(`Token decoded but user not found: ${decodedEmail}`);
      Logger.debug(`Sending response: 401 UNAUTHORIZED - User not found`);
      Logger.response(401, 'User associated with token not found');
      return res.status(401).json({ valid: false, message: 'Invalid token' });
    }
  } catch (error) {
    Logger.error(`Token decoding failed: ${error.message}`);
    Logger.debug(`Exception: ${error.toString()}`);
    Logger.debug(`Sending response: 401 UNAUTHORIZED - Invalid format`);
    Logger.response(401, 'Invalid token format');
    return res.status(401).json({ valid: false, message: 'Invalid token format' });
  }
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  Logger.request('POST', '/api/login', `Login attempt for: ${email}`);
  Logger.debug(`Request Body: ${JSON.stringify({ email, password: password ? '***hidden***' : 'none' })}`);
  Logger.debug(`Client IP: ${req.ip}`);
  Logger.debug(`Content-Type: ${req.get('content-type')}`);
  Logger.debug(`Request Headers: Accept=${req.get('accept')}, Host=${req.get('host')}`);

  if (!email || !password) {
    Logger.warning('Login validation failed: Missing email or password');
    Logger.debug(`Email provided: ${email ? 'Yes' : 'No'}, Password provided: ${password ? 'Yes' : 'No'}`);
    Logger.debug('Sending response: 400 BAD REQUEST');
    Logger.response(400, 'Missing credentials');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  Logger.info(`Credentials received - Email: ${email}`);
  Logger.debug('Searching for user in database...');
  
  const user = users.find(u => u.email === email);

  if (!user) {
    Logger.error(`Login failed: User not found - ${email}`);
    Logger.info('User should register/sign up first');
    Logger.debug('Sending response: 404 NOT FOUND');
    Logger.response(404, 'User not found - redirect to signup');
    return res.status(404).json({ 
      message: 'User not found. Please sign up first.',
      userExists: false
    });
  }

  Logger.info(`User found: ID=${user.id}, Name=${user.fullname}`);
  Logger.debug('Validating password...');

  if (user.password !== password) {
    Logger.error(`Login failed: Invalid password for user ${email}`);
    Logger.debug('Sending response: 401 UNAUTHORIZED - Wrong password');
    Logger.response(401, 'Wrong password');
    return res.status(401).json({ 
      message: 'Invalid password',
      userExists: true
    });
  }

  // Generate a simple token (in real app, use JWT)
  const token = Buffer.from(email + Date.now()).toString('base64');
  Logger.debug(`Generated session token: ${token.substring(0, 20)}...`);

  Logger.success(`✓ Login successful for user: ${user.fullname} (${user.email})`);
  Logger.info(`Session token generated and sent to client`);
  Logger.debug(`Sending response: 200 OK - User authenticated`);
  Logger.response(200, `User authenticated - ${user.fullname}`);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      fullname: user.fullname,
      email: user.email
    }
  });
});

// Signup route
app.post('/api/signup', (req, res) => {
  const { fullname, email, password } = req.body;
  Logger.request('POST', '/api/signup', `Signup attempt for: ${email}`);
  Logger.debug(`Request Body: ${JSON.stringify({ fullname, email, password: password ? '***hidden***' : 'none' })}`);
  Logger.debug(`Client IP: ${req.ip}`);
  Logger.debug(`Content-Type: ${req.get('content-type')}`);
  Logger.debug(`Request Headers: User-Agent=${req.get('user-agent')}`);

  if (!fullname || !email || !password) {
    Logger.warning('Signup validation failed: Missing required fields');
    Logger.debug(`Fullname: ${fullname ? 'Yes' : 'No'}, Email: ${email ? 'Yes' : 'No'}, Password: ${password ? 'Yes' : 'No'}`);
    Logger.debug('Sending response: 400 BAD REQUEST');
    Logger.response(400, 'Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  Logger.info(`Signup data received - Name: ${fullname}, Email: ${email}`);
  Logger.debug('Validating email format...');

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Logger.error(`Invalid email format: ${email}`);
    Logger.debug('Email validation regex: FAILED');
    Logger.debug('Sending response: 400 BAD REQUEST');
    Logger.response(400, 'Invalid email format');
    return res.status(400).json({ message: 'Invalid email format' });
  }

  Logger.success(`✓ Email format is valid: ${email}`);
  Logger.debug('Validating password length...');

  // Validate password length
  if (password.length < 6) {
    Logger.warning(`Password too short (${password.length} chars): ${email}`);
    Logger.debug('Password length validation: FAILED - Less than 6 characters');
    Logger.debug('Sending response: 400 BAD REQUEST');
    Logger.response(400, 'Password must be at least 6 characters');
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  Logger.success(`✓ Password length is valid (${password.length} chars)`);
  Logger.debug('Checking if email already exists in database...');

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    Logger.error(`Signup failed: Email already registered - ${email}`);
    Logger.info('User should login with existing credentials');
    Logger.debug('Duplicate email detected in database');
    Logger.debug('Sending response: 409 CONFLICT');
    Logger.response(409, 'Email already exists - redirect to login');
    return res.status(409).json({ 
      message: 'Email already registered. Please login instead.',
      emailExists: true
    });
  }

  Logger.success(`✓ Email is unique, can proceed with registration`);
  Logger.info(`Creating new user account...`);

  const newUser = {
    id: users.length + 1,
    fullname,
    email,
    password
  };

  users.push(newUser);
  Logger.info(`User added to database - ID: ${newUser.id}`);
  Logger.debug(`Database operation: INSERT - Users count is now: ${users.length}`);

  // Generate token for auto-login after signup
  const token = Buffer.from(email + Date.now()).toString('base64');
  Logger.debug(`Generated session token for auto-login: ${token.substring(0, 20)}...`);

  Logger.success(`✓ Signup successful for: ${fullname} (${email})`);
  Logger.info(`Total registered users: ${users.length}`);
  Logger.info(`Auto-login token generated, redirecting to dashboard`);
  Logger.debug('Sending response: 201 CREATED');
  Logger.response(201, `New user registered - ${fullname}`);

  res.status(201).json({
    message: 'Sign up successful',
    token,
    user: {
      id: newUser.id,
      fullname: newUser.fullname,
      email: newUser.email
    }
  });
});

// Get client info for testing
app.get('/client-info', (req, res) => {
  Logger.request('GET', '/client-info', 'Client requesting their connection info');
  Logger.debug(`Query Parameters: ${JSON.stringify(req.query)}`);
  
  const clientInfo = {
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    host: req.get('host'),
    headers: req.headers,
    method: req.method,
    url: req.url,
    query: req.query,
    timestamp: new Date().toISOString()
  };
  
  Logger.info(`Client IP: ${clientInfo.ip}`);
  Logger.info(`Client User Agent: ${clientInfo.userAgent}`);
  Logger.info(`Request Host: ${clientInfo.host}`);
  Logger.debug(`Request Method: ${clientInfo.method}`);
  Logger.debug(`Request URL: ${clientInfo.url}`);
  Logger.debug('Sending response: 200 OK - Client info retrieved');
  Logger.response(200, 'Client info retrieved and sent');
  
  res.json(clientInfo);
});

// Get all users (for testing)
app.get('/api/users', (req, res) => {
  Logger.request('GET', '/api/users', 'Requesting list of all registered users');
  Logger.debug(`Query Parameters: ${JSON.stringify(req.query)}`);
  Logger.debug(`Client IP: ${req.ip}`);
  Logger.info(`Total registered users in database: ${users.length}`);
  
  if (users.length === 0) {
    Logger.debug('Database is empty, no users registered yet');
    Logger.debug('Sending response: 200 OK - Empty user list');
  } else {
    Logger.debug(`Retrieving ${users.length} users from database`);
    users.forEach(u => {
      Logger.debug(`  - User ID: ${u.id}, Name: ${u.fullname}, Email: ${u.email}`);
    });
  }
  
  Logger.debug('Sending response: 200 OK');
  Logger.response(200, `Returned ${users.length} users`);
  
  res.json({
    totalUsers: users.length,
    users: users.map(u => ({
      id: u.id,
      fullname: u.fullname,
      email: u.email
    }))
  });
  console.log("---Response---", Logger.response)
});

// Start server
app.listen(PORT, () => {
  console.log('\n');
  Logger.success('================================================');
  Logger.success('🚀 SERVER STARTED SUCCESSFULLY!');
  Logger.success('================================================');
  Logger.info(`📍 Server URL: http://localhost:${PORT}`);
  Logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  Logger.info(`⏰ Started at: ${new Date().toLocaleString()}`);
  Logger.info(`🔢 PID: ${process.pid}`);
  Logger.info(`💾 Node Version: ${process.version}`);
  Logger.success('================================================');
  
  console.log('\n📖 Available Page Routes:');
  Logger.info('  GET  /           → Login Page (Home)');
  Logger.info('  GET  /login      → Login Page');
  Logger.info('  GET  /signup     → Signup Page');
  Logger.info('  GET  /dashboard  → User Dashboard (Protected)');
  
  console.log('\n📡 Available API Routes:');
  Logger.info('  POST /api/login  → User Login (req: email, password | res: token, user)');
  Logger.info('  POST /api/signup → User Registration (req: fullname, email, password | res: token, user)');
  Logger.info('  POST /api/check-email → Check if Email Exists (req: email | res: exists, message)');
  Logger.info('  POST /api/verify-token → Verify Session Token (req: token | res: valid, user)');
  Logger.info('  GET  /api/users  → Get All Registered Users (res: totalUsers, users[])');
  Logger.info('  GET  /client-info → Get Client Connection Info (res: ip, userAgent, host, headers, etc)');
  
  Logger.success('================================================');
  Logger.info('💾 Database: In-Memory (Development) - Users: ' + users.length);
  Logger.info('🔐 Authentication: Token-based Session');
  Logger.info('📝 Logging: Detailed console logging with colors');
  Logger.info('🔄 Request/Response Logging: Enabled (Morgan + Custom Logger)');
  Logger.success('================================================\n');
  
  Logger.success('📌 Logging Details:');
  Logger.info('  - All requests logged with method, path, client IP');
  Logger.info('  - All responses logged with status code and message');
  Logger.info('  - Request body (except passwords) logged in debug');
  Logger.info('  - Response data logged for debugging');
  Logger.info('  - Database operations logged');
  Logger.info('  - Validation errors logged with details');
  Logger.success('================================================\n');
  
  Logger.info('✅ Server is ready to accept connections!');
  Logger.info(`👉 Open http://localhost:${PORT} in your browser to get started\n`);
});
