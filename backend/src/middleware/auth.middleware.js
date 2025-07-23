// src/middleware/auth.middleware.js
// This middleware will protect routes that require a user to be logged in.

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protect = async (req, res, next) => {
  let token;

  // Check if the request headers contain an Authorization token, and if it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (e.g., "Bearer eyJhbGciOiJIUzI1Ni...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user by the ID from the token's payload.
      // We attach the user object to the request, but exclude the password for security.
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found.' });
      }

      // 4. If everything is okay, proceed to the next middleware or the actual route handler.
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

export { protect };
