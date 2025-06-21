import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here if needed
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
