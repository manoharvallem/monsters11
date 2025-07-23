// src/models/post.model.js
// This file defines the Mongoose schema for Posts and embedded Comments.

import mongoose from 'mongoose';

const { Schema } = mongoose;

// --- Embedded Schema for Comments ---
// This defines the structure for individual comments which will be stored
// directly within the Post document's 'comments' array.
const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Comment text cannot be empty.'],
    trim: true,
  },
  // We store username and avatar here to avoid having to 'populate' them later,
  // making it faster to load comments on the frontend. This is a denormalization technique.
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt for each comment
});


// --- Main Schema for Posts ---
const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, // Establishes a relationship with the User model
    ref: 'User', // The 'ref' option tells Mongoose which model to use during population
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Post content is required.'],
    trim: true,
    maxlength: [280, 'Post content cannot be more than 280 characters.'],
  },
  imageUrl: {
    type: String, // URL to an image, optional
    default: '',
  },
  // An array of user IDs who have liked this post.
  // Storing just the IDs is efficient.
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // An array of comment documents using the schema defined above.
  comments: [commentSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt for each post
});

const Post = mongoose.model('Post', postSchema);

export default Post;
