// src/routes/post.routes.js
// This file defines the API routes for all post-related actions.

import express from 'express';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- Route to Create a New Post ---
// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    const newPost = new Post({
      content,
      imageUrl: imageUrl || '',
      user: req.user.id, // The user ID is attached by the 'protect' middleware
    });

    const savedPost = await newPost.save();
    
    // We populate the 'user' field to include username and avatar in the response
    const populatedPost = await Post.findById(savedPost._id).populate('user', 'username avatar');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error while creating post.' });
  }
});

// --- Route to Get All Posts (The Feed) ---
// @route   GET /api/posts
// @desc    Get all posts in reverse chronological order
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username avatar') // Replace user ID with user's username and avatar
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error while fetching posts.' });
  }
});

// --- Route to Like/Unlike a Post ---
// @route   PUT /api/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const userId = req.user.id;
    // Check if the 'likes' array already includes the current user's ID
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // If already liked, remove the user's ID from the array (unlike)
      post.likes.pull(userId);
    } else {
      // If not liked, add the user's ID to the array (like)
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error while liking post.' });
  }
});

// --- Route to Add a Comment to a Post ---
// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const newComment = {
      text,
      user: req.user.id,
      username: req.user.username, // Get username/avatar from the user object attached by 'protect' middleware
      avatar: req.user.avatar,
    };

    post.comments.unshift(newComment); // Add to the beginning of the array

    await post.save();
    
    // Return just the new comment object
    res.status(201).json(post.comments[0]);

  } catch (error) {
    console.error('Error commenting on post:', error);
    res.status(500).json({ message: 'Server error while commenting.' });
  }
});

export default router;
