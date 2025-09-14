import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Alert, useMediaQuery } from "@mui/material";
import { Refresh, AdminPanelSettings, ArrowBack } from "@mui/icons-material";

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

  const handleBackToChat = () => {
    navigate("/chat");
  };

  return (
    <Box sx={{ mb: isSmallScreen ? 3 : 4 }}>
      {/* Header with back button and centered title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          mb: 3,
        }}
      >
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
            borderColor: "primary.main",
            color: "primary.main",
            fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
            flexShrink: 0,
            "& .MuiButton-startIcon": {
              marginRight: isSmallScreen ? 0 : "5px",
              marginLeft: isSmallScreen ? 0 : "5px",
            },
          }}
        >
          {!isMobile && "Back to Chat"}
        </Button>
        {/* Centered Title with Icon */}
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
            <AdminPanelSettings
              sx={{
                fontSize: isSmallScreen ? "2rem" : isMobile ? "2.5rem" : "3rem",
                color: "primary.main",
              }}
            />
            <Typography
              variant={isSmallScreen ? "h6" : isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 700,
                color: "text.primary",
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
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: isSmallScreen ? "0.8rem" : isMobile ? "0.9rem" : "1rem",
              fontWeight: 400,
            }}
          >
            Manage users and API keys
          </Typography>
        </Box>
        {/* Spacer for balance */}
        <Button
          variant="outlined"
          startIcon={
            <Refresh sx={{ marginRight: isSmallScreen ? "0" : "5px" }} />
          }
          onClick={onRefresh}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            px: isSmallScreen ? 0 : 3,
            py: isSmallScreen ? 0.75 : 1,
            borderColor: "primary.main",
            color: "primary.main",
            fontSize: isSmallScreen ? "0.8rem" : "0.875rem",

            "&:disabled": {
              borderColor: "action.disabled",
              color: "action.disabled",
            },

            "& .MuiButton-startIcon": {
              marginRight: isSmallScreen ? 0 : "5px",
              marginLeft: isSmallScreen ? 0 : "5px",
            },
          }}
        >
          {isSmallScreen ? "" : "Refresh Data"}
        </Button>{" "}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
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
