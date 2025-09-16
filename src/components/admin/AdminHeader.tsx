import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Alert,
  useMediaQuery,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
 } from "@mui/material";
import {
  Refresh,
  AdminPanelSettings,
  ArrowBack,
   Notifications,
  Settings,
  Logout,
  Person,
} from "@mui/icons-material";
import { useTheme } from "../../hooks/useTheme";
import React from "react";

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
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const navigate = useNavigate();
  const { mode } = useTheme();
   const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<null | HTMLElement>(null);

 
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('token');
    navigate('/signin');
    handleProfileMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleProfileMenuClose();
  };

  const handleBackToChat = () => {
    navigate("/chat");
  };

  return (
    <Box
      sx={{
        mb: isSmallScreen ? 3 : 4,
        background: mode === 'light'
          ? 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          : 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderRadius: 3,
        p: 3,
        boxShadow: mode === 'light'
          ? '0 4px 20px rgba(0,0,0,0.08)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header with improved layout */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          mb: 3,
        }}
      >
        {/* Left section - Back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackToChat}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: isSmallScreen ? 1.5 : 2,
              py: isSmallScreen ? 0.75 : 1,
              borderColor: mode === 'light' ? '#e0e0e0' : '#333',
              color: mode === 'light' ? '#666' : '#ccc',
              '&:hover': {
                borderColor: mode === 'light' ? '#667eea' : '#667eea',
                color: '#667eea',
                bgcolor: mode === 'light' ? 'rgba(102, 126, 234, 0.04)' : 'rgba(102, 126, 234, 0.08)',
              },
              fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
              flexShrink: 0,
            }}
          >
            {!isMobile && "Back to Chat"}
          </Button>

          {/* Status indicator */}
          <Chip
            label="Admin Mode"
            size="small"
            sx={{
              bgcolor: mode === 'light' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
              color: '#667eea',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: `1px solid ${mode === 'light' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.3)'}`,
            }}
          />
        </Box>

        {/* Center section - Title */}
        <Box
          sx={{
            flex: 1,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: mode === 'light' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AdminPanelSettings
                sx={{
                  fontSize: isSmallScreen ? "2rem" : isMobile ? "2.5rem" : "3rem",
                  color: '#667eea',
                }}
              />
            </Box>
            <Box>
              <Typography
                variant={isSmallScreen ? "h6" : isMobile ? "h5" : "h4"}
                sx={{
                  fontWeight: 700,
                  color: mode === 'light' ? '#333' : '#fff',
                  lineHeight: 1.2,
                  fontSize: isSmallScreen
                    ? "1.25rem"
                    : isMobile
                    ? "1.5rem"
                    : "2rem",
                }}
              >
                Admin Dashboard
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: mode === 'light' ? '#666' : '#aaa',
                  fontSize: isSmallScreen ? "0.8rem" : isMobile ? "0.9rem" : "1rem",
                  fontWeight: 400,
                  mt: 0.5,
                }}
              >
                Manage users and system settings
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right section - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Refresh button */}
          <IconButton
            onClick={onRefresh}
            disabled={loading}
            sx={{
              bgcolor: mode === 'light' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
              color: '#667eea',
              '&:hover': {
                bgcolor: mode === 'light' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.3)',
              },
              '&:disabled': {
                bgcolor: mode === 'light' ? '#f5f5f5' : '#333',
                color: mode === 'light' ? '#ccc' : '#666',
              },
            }}
            title="Refresh data"
          >
            <Refresh sx={{
              fontSize: '1.25rem',
              animation: loading ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }} />
          </IconButton>

          {/* Notifications */}
          <IconButton
            sx={{
              color: mode === 'light' ? '#666' : '#ccc',
              '&:hover': {
                bgcolor: mode === 'light' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
              },
            }}
            title="Notifications"
          >
            <Notifications sx={{ fontSize: '1.25rem' }} />
          </IconButton>

          {/* Profile menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              p: 0.5,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: mode === 'light' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                border: `2px solid ${mode === 'light' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.3)'}`,
              }}
            >
              <Person />
            </Avatar>
          </IconButton>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            bgcolor: mode === 'light' ? '#fff' : '#2a2a2a',
            border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333'}`,
            borderRadius: 2,
            boxShadow: mode === 'light'
              ? '0 4px 20px rgba(0,0,0,0.1)'
              : '0 4px 20px rgba(0,0,0,0.4)',
          },
        }}
      >
        <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
          <Settings sx={{ mr: 2, fontSize: '1.25rem' }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <Logout sx={{ mr: 2, fontSize: '1.25rem' }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 0,
            borderRadius: 2,
            "& .MuiAlert-message": {
              fontWeight: 500,
            },
          }}
          onClose={onClearError}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
}
