import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../constants'; // Adjust path if needed

// Async thunks
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue, getState }) => {
    try {
      const { auth: { userInfo } } = getState();
      
      // Validate data before sending
      if (!bookingData.turf || !bookingData.bookingDate) {
        throw new Error('Missing required booking data');
      }

      const response = await axios.post(
        `${BASE_URL}/api/bookings`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          timeout: 10000 // 10 second timeout
        }
      );

      // Validate response structure
      if (!response.data || !response.data._id) {
        throw new Error('Invalid response from server');
      }

      return response.data;

    } catch (error) {
      // Enhanced error handling
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Request timeout - please try again');
      }
      
      if (!error.response) {
        return rejectWithValue('Network error - no server response');
      }

      return rejectWithValue(
        error.response.data?.message || 
        error.response.data?.error || 
        error.message || 
        'Booking failed'
      );
    }
  }
);

export const getMyBookings = createAsyncThunk(
  'bookings/getMyBookings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${BASE_URL}/api/bookings/mybookings`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getBookings = createAsyncThunk(
  'bookings/getBookings',
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${BASE_URL}/api/admin/bookings`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${BASE_URL}/api/admin/bookings/${id}`,
        { status },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Slice
const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = bookingSlice.actions;

export default bookingSlice.reducer;
