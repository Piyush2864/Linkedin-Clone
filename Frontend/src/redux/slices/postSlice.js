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
      });
  },
});

export default postSlice.reducer;
