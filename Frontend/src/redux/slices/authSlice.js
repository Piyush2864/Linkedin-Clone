import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/authApi';


export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/signup', userData);
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post('/auth/login', credentials);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: JSON.parse(localStorage.getItem('user')) || null, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export default authSlice.reducer;
