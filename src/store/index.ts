import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './slices/usersSlice';
import adminSlice from './slices/adminSlice';
import feedbackSlice from './slices/feedbackSlice';
import appManagementSlice from './slices/appManagementSlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    users: usersSlice,
    admin: adminSlice,
    feedback: feedbackSlice,
    appManagement: appManagementSlice,
    dashboard: dashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;