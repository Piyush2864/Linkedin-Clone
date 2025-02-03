import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/jobApi';

// Fetch jobs from API
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const response = await axios.get('/jobs');
  return response.data.jobs;
});

export const applyForJob = createAsyncThunk('jobs/applyForJob', async (jobId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/jobs/${jobId}/apply`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { jobId, applicationStatus: response.data.status };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const saveJob = createAsyncThunk('jobs/saveJob', async (jobId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/jobs/${jobId}/save`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return { jobId, saved: response.data.saved };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchRecommendedJobs = createAsyncThunk('jobs/fetchRecommendedJobs', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/jobs/recommended', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.jobs;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
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
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        const job = state.jobs.find((j) => j.id === action.payload.jobId);
        if (job) job.applied = true;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        const job = state.jobs.find((j) => j.id === action.payload.jobId);
        if (job) job.saved = action.payload.saved;
      })
      .addCase(fetchRecommendedJobs.fulfilled, (state, action) => {
        state.recommendedJobs = action.payload;
      });
  },
});

export default jobSlice.reducer;
