// src/routes/auth.routes.js
// This file defines the API routes for user authentication (register and login).

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Create a new router instance
const router = express.Router();

// --- Helper Function to Generate JWT ---
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};


// --- Route for User Registration ---
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // 3. Create a new user instance (password will be hashed by the pre-save hook in the model)
    const newUser = new User({
      username,
      password,
    });

    // 4. Save the new user to the database
    const savedUser = await newUser.save();

    // 5. Generate a JWT and send response
    const token = generateToken(savedUser._id);

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        avatar: savedUser.avatar,
      },
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});


// --- Route for User Login ---
// @route   POST /api/auth/login
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password.' });
    }

    // 2. Find the user by username
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Use a generic message for security
    }

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 4. If credentials are correct, generate a JWT and send response
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});


export default router;
