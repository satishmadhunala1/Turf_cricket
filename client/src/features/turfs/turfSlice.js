import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../constants'; // adjust path as needed

// Async thunks
export const getTurfs = createAsyncThunk(
  'turfs/getTurfs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/turfs`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getTurfById = createAsyncThunk(
  'turfs/getTurfById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/turfs/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createTurf = createAsyncThunk(
  'turfs/createTurf',
  async (turfData, { rejectWithValue, getState }) => {
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

      const { data } = await axios.post(`${BASE_URL}/api/admin/turfs`, turfData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateTurf = createAsyncThunk(
  'turfs/updateTurf',
  async (turfData, { rejectWithValue, getState }) => {
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
        `${BASE_URL}/api/admin/turfs/${turfData._id}`,
        turfData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deleteTurf = createAsyncThunk(
  'turfs/deleteTurf',
  async (id, { rejectWithValue, getState }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`${BASE_URL}/api/admin/turfs/${id}`, config);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Slice
const turfSlice = createSlice({
  name: 'turfs',
  initialState: {
    turfs: [],
    turf: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTurfs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTurfs.fulfilled, (state, action) => {
        state.loading = false;
        state.turfs = action.payload;
      })
      .addCase(getTurfs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTurfById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTurfById.fulfilled, (state, action) => {
        state.loading = false;
        state.turf = action.payload;
      })
      .addCase(getTurfById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.turfs.push(action.payload);
      })
      .addCase(createTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.turfs = state.turfs.map((turf) =>
          turf._id === action.payload._id ? action.payload : turf
        );
      })
      .addCase(updateTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTurf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTurf.fulfilled, (state, action) => {
        state.loading = false;
        state.turfs = state.turfs.filter((turf) => turf._id !== action.payload);
      })
      .addCase(deleteTurf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default turfSlice.reducer;
