import { useEffect, useRef } from 'react';
import { Box, Typography, Alert, IconButton, useMediaQuery, useTheme as useMuiTheme, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchUsersWithKeys, 
  deleteUser, 
  setSearchName, 
  setSearchEmail, 
  setCurrentPage, 
  clearError,
  resetUsersState 
} from '../../../store/slices/usersSlice';
import UsersTab from '../UsersTab';

export default function UsersPage() {
  const { mode } = useTheme();
  const dispatch = useAppDispatch();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalUsers,
    searchName,
    searchEmail,
    initialized,
  } = useAppSelector((state) => state.users);

  // Initial load only - fetch data once if not already initialized
  useEffect(() => {
    if (!initialized && !loading && !isInitializedRef.current) {
      isInitializedRef.current = true;
      dispatch(fetchUsersWithKeys({ name: '', email: '', page: 1 }));
    }
  }, [dispatch, initialized, loading]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchUsersWithKeys({ name: searchName, email: searchEmail, page }));
  };

  const handleDeleteUser = async (user: { _id: string }) => {
    const result = await dispatch(deleteUser(user._id));
    // Only refresh if deletion was successful
    if (deleteUser.fulfilled.match(result)) {
      dispatch(fetchUsersWithKeys({ name: searchName, email: searchEmail, page: currentPage }));
    }
  };

  const handleRefresh = () => {
    isInitializedRef.current = false; // Reset the ref for fresh initialization
    dispatch(resetUsersState()); // Reset state first to clear initialized flag
    dispatch(fetchUsersWithKeys({ name: '', email: '', page: 1 })); // Fetch fresh data
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleSearchNameChange = (name: string) => {
    dispatch(setSearchName(name));
    dispatch(setCurrentPage(1));
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new debounced search
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(fetchUsersWithKeys({ name, email: searchEmail, page: 1 }));
    }, 300);
  };

  const handleSearchEmailChange = (email: string) => {
    dispatch(setSearchEmail(email));
    dispatch(setCurrentPage(1));
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new debounced search
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(fetchUsersWithKeys({ name: searchName, email, page: 1 }));
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
          {isSmallMobile ? 'Users' : 'Users Management'}
        </Typography>
        
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            disabled={loading}
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

      <UsersTab
        usersWithKeys={users}
        loading={loading}
        setSelectedUser={() => {}} // Not used in this context
        handleOpenAddDialog={() => {}} // Will be handled differently
        setTabValue={() => {}} // Not used in new structure
        searchName={searchName}
        setSearchName={handleSearchNameChange}
        searchEmail={searchEmail}
        setSearchEmail={handleSearchEmailChange}
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        onPageChange={handlePageChange}
        handleDeleteUser={handleDeleteUser}
        onRefresh={handleRefresh}
      />
    </Box>
  );
}