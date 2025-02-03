import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/notificationApi';

// Fetch notifications
export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/notifications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.notifications;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { notifications: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
