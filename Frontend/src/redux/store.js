import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import jobReducer from './slices/jobSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';
import paymentReducer from './slices/paymentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    jobs: jobReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    admin: adminReducer,
    payment: paymentReducer,
  },
});

export default store;
