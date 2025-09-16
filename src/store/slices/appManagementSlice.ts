import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface AppKey {
  _id: string;
  provider: string;
  key?: string; // The actual API key value (optional for security)
  isActive: boolean;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
}

export interface UserQuota {
  userId: {
    _id: string;
    email: string;
    name?: string;
  } | null;
  provider: string;
  usedCalls: number;
  maxFreeCalls: number;
}

export interface AppManagementState {
  appKeys: AppKey[];
  userQuotas: UserQuota[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AppManagementState = {
  appKeys: [],
  userQuotas: [],
  loading: false,
  error: null,
  initialized: false,
};

// Async thunk to fetch app keys
export const fetchAppKeys = createAsyncThunk(
  'appManagement/fetchAppKeys',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch('https://aithor-be.vercel.app/api/admin/app-keys', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch app keys');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching app keys:', error);
      return rejectWithValue('Network error while fetching app keys');
    }
  }
);

// Async thunk to fetch user quotas
export const fetchUserQuotas = createAsyncThunk(
  'appManagement/fetchUserQuotas',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch('https://aithor-be.vercel.app/api/admin/user-quotas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch user quotas');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user quotas:', error);
      return rejectWithValue('Network error while fetching user quotas');
    }
  }
);

// Combined async thunk to fetch both app keys and user quotas
export const fetchAppManagementData = createAsyncThunk(
  'appManagement/fetchAppManagementData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Dispatch both thunks in parallel and wait for them to complete
      const results = await Promise.allSettled([
        dispatch(fetchAppKeys()),
        dispatch(fetchUserQuotas()),
      ]);

      // Check if either request failed
      const appKeysResult = results[0];
      const userQuotasResult = results[1];

      if (appKeysResult.status === 'rejected') {
        return rejectWithValue(appKeysResult.reason?.message || 'Failed to fetch app keys');
      }
      if (userQuotasResult.status === 'rejected') {
        return rejectWithValue(userQuotasResult.reason?.message || 'Failed to fetch user quotas');
      }

      // Don't return data here since the individual thunks already updated the store
      return { success: true };
    } catch {
      return rejectWithValue('Failed to fetch app management data');
    }
  }
);

const appManagementSlice = createSlice({
  name: 'appManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetInitialized: (state) => {
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch app keys
      .addCase(fetchAppKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.appKeys = action.payload;
        state.error = null;
      })
      .addCase(fetchAppKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user quotas
      .addCase(fetchUserQuotas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserQuotas.fulfilled, (state, action) => {
        state.loading = false;
        state.userQuotas = action.payload;
        state.error = null;
      })
      .addCase(fetchUserQuotas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch combined data
      .addCase(fetchAppManagementData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppManagementData.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
        state.error = null;
      })
      .addCase(fetchAppManagementData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.initialized = true; // Mark as initialized even on error to prevent retry
      });
  },
});

export const { clearError, resetInitialized } = appManagementSlice.actions;
export default appManagementSlice.reducer;