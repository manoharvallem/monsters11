import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return null; // Don't render anything if there are no comments
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.map((comment) => (
        <div key={comment._id} className="flex items-start space-x-3">
          <img
            src={comment.avatar}
            alt={`${comment.username}'s avatar`}
            className="w-8 h-8 bg-gray-700 rounded-full"
          />
          <div className="flex-1 p-3 text-sm bg-gray-700 rounded-lg">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold text-white">{comment.username}</p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
            <p className="mt-1 text-gray-300">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
