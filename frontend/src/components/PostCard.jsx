import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import AddComment from './AddComment';
import CommentList from './CommentList';

function PostCard({ post }) {
  const { user } = useAuth();
  
  // State for likes and comments, initialized from the post prop
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);

  // Check if the current user has liked this post
  const isLiked = user && likes.includes(user.id);

  const handleLikeToggle = async () => {
    if (!user) return; // Should not happen if UI is correct, but good practice

    try {
      // Optimistically update the UI first for a better user experience
      const newLikes = isLiked
        ? likes.filter((id) => id !== user.id)
        : [...likes, user.id];
      setLikes(newLikes);

      // Then, send the request to the backend
      await axios.put(`/api/posts/${post._id}/like`);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // If the API call fails, revert the state to the original
      setLikes(post.likes);
    }
  };
  
  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  // Fallback in case user data is not populated correctly
  const username = post.user?.username || 'Unknown User';
  const avatar = post.user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=error';

  return (
    <div className="p-4 mb-4 bg-gray-800 border border-gray-700 rounded-lg">
      {/* Post Header */}
      <div className="flex items-center mb-3">
        <img src={avatar} alt={`${username}'s avatar`} className="w-10 h-10 mr-3 bg-gray-700 rounded-full" />
        <div>
          <p className="font-semibold text-white">{username}</p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
      
      {post.imageUrl && (
        <div className="mt-3">
          <img src={post.imageUrl} alt="Post attachment" className="object-cover w-full rounded-lg max-h-96" />
        </div>
      )}

      {/* Post Actions (Like/Comment) */}
      <div className="flex items-center justify-between mt-4 text-gray-400">
        <div className="flex items-center space-x-1">
           <button 
             onClick={handleLikeToggle}
             className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-900/50' : 'hover:bg-red-900/50 hover:text-red-500'}`}
           >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
           </button>
           <span>{likes.length}</span>
        </div>
        <div className="flex items-center space-x-1">
           <button 
             onClick={() => setShowComments(!showComments)}
             className="p-2 rounded-full hover:bg-cyan-900/50 hover:text-cyan-400 transition-colors"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
           </button>
           <span>{comments.length}</span>
        </div>
      </div>
      
      {/* Comment Section */}
      {showComments && (
        <div className="pt-4 mt-4 border-t border-gray-700">
          <AddComment postId={post._id} onCommentAdded={handleCommentAdded} />
          <CommentList comments={comments} />
        </div>
      )}
    </div>
  );
}

export default PostCard;
