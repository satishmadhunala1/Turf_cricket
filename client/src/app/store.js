import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import turfsReducer from '../features/turfs/turfSlice';
import bookingsReducer from '../features/bookings/bookingSlice';
import usersReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    turfs: turfsReducer,
    bookings: bookingsReducer,
    users: usersReducer,
  },
});