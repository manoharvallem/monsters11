import React from 'react';
import { formatDistanceToNow } from 'date-fns';

// We'll add the like/comment functions later.
function PostCard({ post }) {
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

      {/* Post Actions (Like/Comment) - Functionality to be added */}
      <div className="flex items-center justify-between mt-4 text-gray-400">
        <div className="flex items-center space-x-1">
           {/* Like Button */}
           <button className="p-2 rounded-full hover:bg-red-900/50 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
           </button>
           <span>{post.likes.length}</span>
        </div>
        <div className="flex items-center space-x-1">
           {/* Comment Button */}
           <button className="p-2 rounded-full hover:bg-cyan-900/50 hover:text-cyan-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
           </button>
           <span>{post.comments.length}</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
