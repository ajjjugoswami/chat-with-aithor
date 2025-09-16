import { useEffect, useRef } from 'react';
import { Box, Typography, Alert, IconButton, Tooltip, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllUsers, toggleAdminAccess, clearError, resetAdminState } from '../../../store/slices/adminSlice';
import AdminAccessTab from '../AdminAccessTab';
import type { UserWithKeys } from '../types';

export default function AdminAccessPage() {
  const { mode } = useTheme();
  const dispatch = useAppDispatch();
  const isInitializedRef = useRef(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const {
    allUsers,
    loadingAllUsers,
    error,
    allUsersInitialized,
  } = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (!allUsersInitialized && !loadingAllUsers && !isInitializedRef.current) {
      isInitializedRef.current = true;
      dispatch(fetchAllUsers());
    }
  }, [dispatch, allUsersInitialized, loadingAllUsers]);

  const handleToggleAdminAccess = async (user: UserWithKeys) => {
    // The toggleAdminAccess thunk already updates the state locally
    // No need to fetch all users again - the Redux state is updated automatically
    await dispatch(toggleAdminAccess(user));
  };

  const handleRefresh = () => {
    isInitializedRef.current = false; // Reset the ref for fresh initialization
    dispatch(resetAdminState()); // Reset state first to clear initialized flag
    dispatch(fetchAllUsers()); // Fetch fresh data
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 3, md: 4 }
      }}>
        <Typography
          variant={isMobile ? (isSmallMobile ? "h5" : "h4") : "h4"}
          component="h1"
          sx={{
            color: mode === 'light' ? '#333' : '#fff',
            fontWeight: 600,
            fontSize: { 
              xs: '1.5rem', 
              sm: '2rem', 
              md: '2.125rem' 
            },
            lineHeight: { xs: 1.2, sm: 1.167 }
          }}
        >
          {isSmallMobile ? 'Admin Access' : 'Admin Access Management'}
        </Typography>
        
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            disabled={loadingAllUsers}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: mode === 'light' ? '#1976d2' : '#90caf9',
              borderRadius: 2,
              border: `1px solid ${mode === 'light' ? '#1976d2' : '#90caf9'}`,
              '&:hover': {
                borderColor: mode === 'light' ? '#1565c0' : '#64b5f6',
                backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.04)' : 'rgba(144, 202, 249, 0.04)',
              },
              '&:disabled': {
                borderColor: 'action.disabled',
                color: 'action.disabled',
              }
            }}
          >
            <RefreshIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          onClose={handleClearError}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <AdminAccessTab
        handleToggleAdminAccess={handleToggleAdminAccess}
        usersWithKeys={allUsers}
        loading={loadingAllUsers}
      />
    </Box>
  );
}