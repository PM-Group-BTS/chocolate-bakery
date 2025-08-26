# User Authentication Endpoint Documentation

This document provides information on how to set up and use the authentication endpoints for the Chocolate Bakery application.

## Setup

1. Install required dependencies:
   ```bash
   npm install bcrypt jsonwebtoken
   ```

2. Create the users table in your MySQL database:
   ```bash
   mysql -u your_username -p your_database < db/users_table.sql
   ```

3. Set environment variables (recommended for production):
   ```bash
   export JWT_SECRET=your_secure_secret_key
   ```

## Authentication Endpoints

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "role": "baker"
    }
  }
}
```

**Error Responses:**
- 400 Bad Request: Missing email or password
- 401 Unauthorized: Invalid credentials
- 500 Internal Server Error: Server error

### 2. Register

**Endpoint:** `POST /api/auth/register`

**Description:** Registers a new user.

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "sales"  // Optional, defaults to "user"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 2,
      "name": "New User",
      "email": "newuser@example.com",
      "role": "sales"
    }
  }
}
```

**Error Responses:**
- 400 Bad Request: Missing required fields
- 409 Conflict: User with email already exists
- 500 Internal Server Error: Server error

## Using Authentication in Protected Routes

To protect routes, use the authentication middleware:

```javascript
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Protected route for all authenticated users
router.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Protected route for specific roles
router.get('/baker-dashboard', 
  authenticate, 
  authorize(['baker']), 
  (req, res) => {
    res.json({ message: 'Baker dashboard data' });
  }
);

// Route with multiple roles allowed
router.get('/orders', 
  authenticate, 
  authorize(['baker', 'sales']), 
  (req, res) => {
    res.json({ message: 'Orders data' });
  }
);
```

## Testing the Authentication

You can test the authentication endpoints using tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"baker@example.com","password":"password123"}'

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com","password":"password123","role":"sales"}'

# Access protected route
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Considerations

1. Always use HTTPS in production
2. Store JWT_SECRET as an environment variable
3. Set appropriate token expiration times
4. Implement token refresh mechanism for long-lived sessions
5. Consider implementing rate limiting for login attempts

