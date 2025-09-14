import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { Refresh, AdminPanelSettings, ArrowBack } from '@mui/icons-material';

interface AdminHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  error: string;
  onClearError: () => void;
}

export default function AdminHeader({
  onRefresh,
  loading,
  error,
  onClearError,
}: AdminHeaderProps) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isSmallScreen = useMediaQuery('(max-width: 480px)');
  const navigate = useNavigate();

  const handleBackToChat = () => {
    navigate('/chat');
  };

  return (
    <Box sx={{ mb: isSmallScreen ? 3 : 4 }}>
      <Box sx={{ display: 'flex', alignItems: isSmallScreen ? 'flex-start' : 'center', gap: isSmallScreen ? 1.5 : 2, mb: 2, flexDirection: isSmallScreen ? 'column' : 'row' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBackToChat}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: isSmallScreen ? 1.5 : 2,
            py: isSmallScreen ? 0.75 : 1,
            borderColor: 'primary.main',
            color: 'primary.main',
            fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
            minWidth: 'auto',
            alignSelf: isSmallScreen ? 'flex-start' : 'auto',
          }}
        >
          {!isMobile && 'Back to Chat'}
        </Button>
        <AdminPanelSettings
          sx={{
            fontSize: isSmallScreen ? '2rem' : isMobile ? '2.25rem' : '2.5rem',
            color: 'primary.main',
            alignSelf: isSmallScreen ? 'center' : 'auto',
          }}
        />
        <Box sx={{ textAlign: isSmallScreen ? 'center' : 'left' }}>
          <Typography
            variant={isSmallScreen ? 'h6' : isMobile ? 'h5' : 'h4'}
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
              fontSize: isSmallScreen ? '1.25rem' : isMobile ? '1.5rem' : '2rem',
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
              fontSize: isSmallScreen ? '0.8rem' : isMobile ? '0.9rem' : '1rem',
            }}
          >
            Manage API keys for all users across different AI models
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontWeight: 500,
            },
          }}
          onClose={onClearError}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: isSmallScreen ? 'center' : 'flex-end', mt: isSmallScreen ? 2 : 0 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: isSmallScreen ? 2 : 3,
            py: isSmallScreen ? 0.75 : 1,
            borderColor: 'primary.main',
            color: 'primary.main',
            fontSize: isSmallScreen ? '0.8rem' : '0.875rem',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'primary.light',
              color: 'primary.dark',
            },
            '&:disabled': {
              borderColor: 'action.disabled',
              color: 'action.disabled',
            },
          }}
        >
          Refresh Data
        </Button>
      </Box>
    </Box>
  );
}