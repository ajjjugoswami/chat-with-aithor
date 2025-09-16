import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface FeedbackItem {
  _id: string;
  name: string;
  email: string;
  feedback: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  message?: string;
  rating?: number;
  category?: string;
  status?: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

interface FeedbackState {
  feedbacks: FeedbackItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalFeedbacks: number;
  initialized: boolean;
}

const initialState: FeedbackState = {
  feedbacks: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalFeedbacks: 0,
  initialized: false,
};

// Async thunks for API calls
export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const url = `https://aithor-be.vercel.app/api/feedback/admin?page=${page}&limit=10`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch feedbacks');
      }

      const data = await response.json();
      return {
        feedback: data.feedback || [],
        pagination: data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalFeedback: 0,
        },
      };
    } catch {
      return rejectWithValue('Network error while fetching feedbacks');
    }
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'feedback/updateStatus',
  async ({ feedbackId, status }: { feedbackId: string; status: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`https://aithor-be.vercel.app/api/feedback/admin/${feedbackId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to update feedback status');
      }

      return { feedbackId, status };
    } catch {
      return rejectWithValue('Network error while updating feedback status');
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/deleteFeedback',
  async (feedbackId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`https://aithor-be.vercel.app/api/feedback/admin/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to delete feedback');
      }

      return feedbackId;
    } catch {
      return rejectWithValue('Network error while deleting feedback');
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFeedbackState: (state) => {
      state.feedbacks = [];
      state.loading = false;
      state.error = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalFeedbacks = 0;
      state.initialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.feedback;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalFeedbacks = action.payload.pagination.totalFeedback;
        state.initialized = true;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update feedback status
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        const { feedbackId, status } = action.payload;
        const feedbackIndex = state.feedbacks.findIndex(f => f._id === feedbackId);
        if (feedbackIndex !== -1) {
          state.feedbacks[feedbackIndex].status = status as 'pending' | 'reviewed' | 'resolved';
        }
      })
      .addCase(updateFeedbackStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete feedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(f => f._id !== action.payload);
        state.totalFeedbacks = Math.max(0, state.totalFeedbacks - 1);
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;