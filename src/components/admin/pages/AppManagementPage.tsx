import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../../../hooks/useTheme';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAppManagementData } from '../../../store/slices/appManagementSlice';
import AppManagementTab from '../AppManagementTab';

export default function AppManagementPage() {
  const { mode } = useTheme();
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.appManagement);
  
  // Initialize data with useRef protection against StrictMode
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!initialized && !isInitializedRef.current) {
      isInitializedRef.current = true;
      dispatch(fetchAppManagementData());
    }
  }, [dispatch, initialized]);

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          gap: { xs: 2, sm: 0 },
          mb: 4 
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: mode === 'light' ? '#333' : '#fff',
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem' },
            lineHeight: { xs: 1.2, sm: 1.5 },
          }}
        >
          App Management
        </Typography>
        
        {/* AppManagementTab has its own refresh functionality */}
      </Box>

      <AppManagementTab />
    </Box>
  );
}