import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/jobApi';

// Fetch jobs from API
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const response = await axios.get('/jobs');
  return response.data.jobs;
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: { jobs: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default jobSlice.reducer;
