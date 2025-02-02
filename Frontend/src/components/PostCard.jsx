import React from 'react';

const PostCard = ({ post }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md mb-4 bg-white">
      <h3 className="font-bold">{post.user.name}</h3>
      <p className="text-sm text-gray-500">{post.createdAt}</p>
      <p className="mt-2">{post.content}</p>
      {post.image && <img src={post.image} alt="Post" className="mt-2 rounded-md" />}
      <div className="flex gap-4 mt-2">
        <button className="text-blue-500">Like</button>
        <button className="text-blue-500">Comment</button>
        <button className="text-blue-500">Share</button>
      </div>
    </div>
  );
};

export default PostCard;
