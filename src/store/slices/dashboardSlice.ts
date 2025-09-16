import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  feedbackCount: number;
  growth: {
    users: number;
    feedback: number;
    admins: number;
  };
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch('https://aithor-be.vercel.app/api/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch dashboard stats');
      }

      const data = await response.json();
      return data;
    } catch {
      return rejectWithValue('Network error while fetching dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.stats = null;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch dashboard stats';
      });
  },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;