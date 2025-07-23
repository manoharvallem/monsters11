import React, { useState } from 'react';
import axios from 'axios';

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    try {
      const res = await axios.post('/api/posts', { content });
      onPostCreated(res.data); // Pass the new post data back to the parent (FeedPage)
      setContent(''); // Clear the textarea
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    }
  };

  return (
    <div className="p-4 mb-6 bg-gray-800 border border-gray-700 rounded-lg">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows="3"
          placeholder="What's on your mind, monster?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition duration-200"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
