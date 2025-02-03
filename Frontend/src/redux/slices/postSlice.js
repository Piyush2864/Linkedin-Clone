import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/postApi';

// Fetch posts from API
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('/posts');
  return response.data.posts;
});


export const createPost = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/posts', postData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.post;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const likePost = createAsyncThunk('posts/likePost', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { postId, likes: response.data.likes };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const addComment = createAsyncThunk('posts/addComment', async ({ postId, comment }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/posts/${postId}/comment`, { comment }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { postId, comment: response.data.comment };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const sharePost = createAsyncThunk('posts/sharePost', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/posts/${postId}/share`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.post;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


const postSlice = createSlice({
  name: 'posts',
  initialState: { posts: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.likes = action.payload.likes;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.comments.push(action.payload.comment);
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); // Add shared post to top of feed
      });
  },
});

export default postSlice.reducer;
