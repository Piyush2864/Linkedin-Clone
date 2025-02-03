import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/profileApi';


export const addEndorsement = createAsyncThunk(
  'profile/addEndorsement',
  async ({ userId, skill }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `/profile/endorse`,
        { userId, skill },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Remove endorsement
export const removeEndorsement = createAsyncThunk(
  'profile/removeEndorsement',
  async ({ userId, skill }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/profile/endorse`,
        { data: { userId, skill }, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: { profile: null, endorsements: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEndorsement.fulfilled, (state, action) => {
        const endorsement = action.payload;
        state.endorsements.push(endorsement);
      })
      .addCase(removeEndorsement.fulfilled, (state, action) => {
        state.endorsements = state.endorsements.filter(
          (endorsement) => endorsement.skill !== action.payload.skill
        );
      });
  },
});

export default profileSlice.reducer;
