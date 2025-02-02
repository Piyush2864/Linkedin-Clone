import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { likePost, addComment } from '../redux/slices/postSlice';

const PostCard = ({ post }) => {
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState('');

  const handleLike = () => {
    dispatch(likePost(post.id));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment({ postId: post.id, comment }));
      setComment('');
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4 bg-white">
      <h3 className="font-bold">{post.user.name}</h3>
      <p className="text-sm text-gray-500">{post.createdAt}</p>
      <p className="mt-2">{post.content}</p>
      {post.image && <img src={post.image} alt="Post" className="mt-2 rounded-md" />}
      
      <div className="flex gap-4 mt-2">
        <button onClick={handleLike} className="text-blue-500">👍 {post.likes} Likes</button>
        <button className="text-blue-500">💬 {post.comments.length} Comments</button>
        <button className="text-blue-500">🔄 Share</button>
      </div>

      
      <div className="mt-4">
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
            Post
          </button>
        </form>

       
        <div className="mt-2">
          {post.comments.map((c, index) => (
            <p key={index} className="text-gray-700">
              <strong>{c.user.name}:</strong> {c.comment}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
