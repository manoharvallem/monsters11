import React, { useState } from 'react';
import axios from 'axios';

function AddComment({ postId, onCommentAdded }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post(`/api/posts/${postId}/comment`, { text });
      onCommentAdded(res.data); // Pass the new comment back to the PostCard
      setText(''); // Clear the input field
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center mt-3">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        type="submit"
        className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-r-md hover:bg-cyan-700 disabled:bg-gray-500"
        disabled={!text.trim()}
      >
        Post
      </button>
    </form>
  );
}

export default AddComment;
