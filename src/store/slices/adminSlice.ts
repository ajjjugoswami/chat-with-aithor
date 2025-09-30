import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserWithKeys } from '../../components/admin/types';
import { authFetch } from '../../utils/authFetch';

interface AdminState {
  allUsers: UserWithKeys[];
  adminUsers: UserWithKeys[];
  loadingAllUsers: boolean;
  loadingAdminUsers: boolean;
  error: string | null;
  allUsersInitialized: boolean;
  adminUsersInitialized: boolean;
}

const initialState: AdminState = {
  allUsers: [],
  adminUsers: [],
  loadingAllUsers: false,
  loadingAdminUsers: false,
  error: null,
  allUsersInitialized: false,
  adminUsersInitialized: false,
};

// Async thunks for API calls
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const url = 'https://aithor-be.vercel.app/api/api-keys/admin/all?limit=1000';

      const response = await authFetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch all users');
      }

      const data = await response.json();
      return data.users || data;
    } catch {
      return rejectWithValue('Network error while fetching all users');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const url = 'https://aithor-be.vercel.app/api/api-keys/admin/all?limit=1000';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch admin users');
      }

      const data = await response.json();
      const allUsersData = data.users || data;
      // Filter to get only admin users
      const adminUsersData = allUsersData.filter((user: UserWithKeys) => user.isAdmin);
      return adminUsersData;
    } catch {
      return rejectWithValue('Network error while fetching admin users');
    }
  }
);

export const toggleAdminAccess = createAsyncThunk(
  'admin/toggleAdminAccess',
  async (user: UserWithKeys, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(
        `https://aithor-be.vercel.app/api/auth/${
          user.isAdmin ? 'revoke' : 'grant'
        }-admin/${user._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to update admin access');
      }

      return { userId: user._id, newAdminStatus: !user.isAdmin };
    } catch {
      return rejectWithValue('Network error while updating admin access');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAdminState: (state) => {
      state.allUsers = [];
      state.adminUsers = [];
      state.loadingAllUsers = false;
      state.loadingAdminUsers = false;
      state.error = null;
      state.allUsersInitialized = false;
      state.adminUsersInitialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingAllUsers = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingAllUsers = false;
        state.allUsers = action.payload;
        state.allUsersInitialized = true;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingAllUsers = false;
        state.error = action.payload as string;
      })

      // Fetch admin users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loadingAdminUsers = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loadingAdminUsers = false;
        state.adminUsers = action.payload;
        state.adminUsersInitialized = true;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loadingAdminUsers = false;
        state.error = action.payload as string;
      })

      // Toggle admin access
      .addCase(toggleAdminAccess.fulfilled, (state, action) => {
        const { userId, newAdminStatus } = action.payload;
        
        // Update in allUsers array
        const allUserIndex = state.allUsers.findIndex(user => user._id === userId);
        if (allUserIndex !== -1) {
          state.allUsers[allUserIndex].isAdmin = newAdminStatus;
        }

        // Update in adminUsers array
        if (newAdminStatus) {
          // User became admin, add to adminUsers if not already there
          const existsInAdmin = state.adminUsers.some(user => user._id === userId);
          if (!existsInAdmin && allUserIndex !== -1) {
            state.adminUsers.push(state.allUsers[allUserIndex]);
          }
        } else {
          // User lost admin access, remove from adminUsers
          state.adminUsers = state.adminUsers.filter(user => user._id !== userId);
        }
      })
      .addCase(toggleAdminAccess.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;