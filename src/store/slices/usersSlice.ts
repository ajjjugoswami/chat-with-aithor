import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserWithKeys } from '../../components/admin/types';

interface UsersState {
  users: UserWithKeys[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  pageSize: number;
  searchName: string;
  searchEmail: string;
  initialized: boolean; // Track if data has been loaded at least once
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
  pageSize: 10,
  searchName: '',
  searchEmail: '',
  initialized: false,
};

// Async thunks for API calls
export const fetchUsersWithKeys = createAsyncThunk(
  'users/fetchUsersWithKeys',
  async ({ name = '', email = '', page = 1 }: { name?: string; email?: string; page?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const params = new URLSearchParams();
      if (name && typeof name === 'string') params.append('name', name);
      if (email && typeof email === 'string') params.append('email', email);
      params.append('page', page.toString());
      params.append('limit', '10');
      const queryString = params.toString();

      const url = queryString 
        ? `https://aithor-be.vercel.app/api/api-keys/admin/all?${queryString}`
        : 'https://aithor-be.vercel.app/api/api-keys/admin/all';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch users and keys');
      }

      const data = await response.json();
      return {
        users: data.users || data,
        pagination: data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalUsers: (data.users || data).length,
        },
      };
    } catch {
      return rejectWithValue('Network error while fetching data');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`https://aithor-be.vercel.app/api/auth/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to delete user');
      }

      return userId;
    } catch {
      return rejectWithValue('Network error while deleting user');
    }
  }
);

export const saveAPIKey = createAsyncThunk(
  'users/saveAPIKey',
  async ({ 
    userId, 
    keyData, 
    keyId 
  }: { 
    userId: string; 
    keyData: { provider: string; name: string; isDefault: boolean; key?: string };
    keyId?: string;
  }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const url = keyId
        ? `https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}`
        : `https://aithor-be.vercel.app/api/api-keys/admin/${userId}`;

      const method = keyId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(keyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to save API key');
      }

      const savedKey = await response.json();
      return { userId, key: savedKey, isEdit: !!keyId };
    } catch {
      return rejectWithValue('Network error while saving API key');
    }
  }
);

export const deleteAPIKey = createAsyncThunk(
  'users/deleteAPIKey',
  async ({ userId, keyId }: { userId: string; keyId: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to delete API key');
      }

      return { userId, keyId };
    } catch {
      return rejectWithValue('Network error while deleting API key');
    }
  }
);

export const setActiveAPIKey = createAsyncThunk(
  'users/setActiveAPIKey',
  async ({ userId, keyId }: { userId: string; keyId: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`https://aithor-be.vercel.app/api/api-keys/admin/${userId}/${keyId}/active`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to set active API key');
      }

      return { userId, keyId };
    } catch {
      return rejectWithValue('Network error while setting active API key');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchName: (state, action: PayloadAction<string>) => {
      state.searchName = action.payload;
    },
    setSearchEmail: (state, action: PayloadAction<string>) => {
      state.searchEmail = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUsersState: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalUsers = 0;
      state.searchName = '';
      state.searchEmail = '';
      state.initialized = false; // Reset initialized flag for fresh data fetch
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users with keys
      .addCase(fetchUsersWithKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalUsers = action.payload.pagination.totalUsers;
        state.initialized = true; // Mark as initialized after first successful fetch
      })
      .addCase(fetchUsersWithKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload);
        state.totalUsers = Math.max(0, state.totalUsers - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Save API key
      .addCase(saveAPIKey.fulfilled, (state, action) => {
        const { userId, key, isEdit } = action.payload;
        const userIndex = state.users.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
          if (isEdit) {
            const keyIndex = state.users[userIndex].apiKeys.findIndex(k => k._id === key._id);
            if (keyIndex !== -1) {
              state.users[userIndex].apiKeys[keyIndex] = key;
            }
          } else {
            state.users[userIndex].apiKeys.push(key);
          }
        }
      })
      .addCase(saveAPIKey.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete API key
      .addCase(deleteAPIKey.fulfilled, (state, action) => {
        const { userId, keyId } = action.payload;
        const userIndex = state.users.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].apiKeys = state.users[userIndex].apiKeys.filter(key => key._id !== keyId);
        }
      })
      .addCase(deleteAPIKey.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Set active API key
      .addCase(setActiveAPIKey.fulfilled, (state, action) => {
        const { userId, keyId } = action.payload;
        const userIndex = state.users.findIndex(user => user._id === userId);
        if (userIndex !== -1) {
          // Set all keys to inactive first
          state.users[userIndex].apiKeys.forEach(key => {
            key.isActive = false;
          });
          // Set the target key to active
          const keyIndex = state.users[userIndex].apiKeys.findIndex(key => key._id === keyId);
          if (keyIndex !== -1) {
            state.users[userIndex].apiKeys[keyIndex].isActive = true;
          }
        }
      })
      .addCase(setActiveAPIKey.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSearchName, setSearchEmail, setCurrentPage, clearError, resetUsersState } = usersSlice.actions;
export default usersSlice.reducer;