// src/models/user.model.js
// This file defines the Mongoose schema and model for our User documents.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema for the User collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    trim: true, // Removes whitespace from both ends of a string
    lowercase: true, // Converts username to lowercase
    minlength: [3, 'Username must be at least 3 characters long.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'],
  },
  avatar: {
    type: String,
    // We'll generate a default avatar URL for each new user.
    default: function() {
      // Uses a fun, free API to generate a unique monster avatar based on the username
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${this.username}`;
    }
  }
}, {
  // Adds createdAt and updatedAt timestamps to the document
  timestamps: true
});

// --- Mongoose Middleware ('pre-save hook') ---
// This function runs automatically *before* a new user document is saved to the database.
// We use it to hash the user's password for security.
userSchema.pre('save', async function(next) {
  // 'this' refers to the user document that is about to be saved.
  // We only want to hash the password if it's a new password or has been modified.
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a 'salt' - a random string to add to the password before hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;
