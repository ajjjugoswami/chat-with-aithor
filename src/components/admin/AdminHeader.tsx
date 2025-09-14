import {
  Box,
  Typography,
  Button,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { Refresh, AdminPanelSettings } from '@mui/icons-material';

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

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <AdminPanelSettings
          sx={{
            fontSize: isMobile ? '2rem' : '2.5rem',
            color: 'primary.main',
          }}
        />
        <Box>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              mt: 0.5,
              fontSize: '1rem',
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRefresh}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1,
            borderColor: 'primary.main',
            color: 'primary.main',
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