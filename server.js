const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const { requireAuth } = require('./middleware/auth.middleware');
const { cherckUser } = require('./middleware/auth.middleware');
const app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());    


// jwt - apply user-check middleware globally
app.use(cherckUser);
app.get('/jwtid', requireAuth, (req, res, next) => {
  res.status(200).json({ userId: res.locals.user });
});

// Direct jwtid route (reads token from Authorization header)
app.get('/jwtid', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(200).json({ id: decoded.id });
  });
});

// Convenience route for Postman: accepts token in cookie `jwt` or `Authorization` header
app.get('/twtid', (req, res) => {
  const cookieToken = req.cookies && req.cookies.jwt ? req.cookies.jwt : null;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(200).json({ id: decoded.id });
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/user', userRoutes);

// server
app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port ' + (process.env.PORT || 5000));
});