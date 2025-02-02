import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { createPost } from '../redux/slices/postSlice';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) return;

    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    await dispatch(createPost(formData));
    setContent('');
    setImage(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
        />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="mt-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
