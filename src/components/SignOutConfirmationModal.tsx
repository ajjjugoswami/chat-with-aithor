import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { useState } from "react";
import { Close, Logout, Warning } from "@mui/icons-material";
import { useTheme } from "../hooks/useTheme";

interface SignOutConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutConfirmationModal({
  open,
  onClose,
  onConfirm,
}: SignOutConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? false : "sm"}
      fullWidth={!isMobile}
      fullScreen={isMobile}
      TransitionComponent={Slide}
      slotProps={{
        transition: { direction: "up" },
      }}
      PaperProps={{
        sx: {
          bgcolor: mode === "light" ? "#ffffff" : "#1a1a1a",
          color: mode === "light" ? "#000000" : "white",
          borderRadius: isMobile ? "0px" : "20px",
          border: "none",
          boxShadow:
            mode === "light"
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          overflow: "hidden",
          background:
            mode === "light"
              ? "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
              : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          minHeight: isMobile ? "100dvh" : "400px",
          maxHeight: isMobile ? "100dvh" : "90vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
          p: isMobile ? 2 : 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 1 : 2,
                flex: 1,
                minWidth: 0,
                maxWidth: isMobile ? "calc(100% - 56px)" : "none",
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 32 : 48,
                  height: isMobile ? 32 : 48,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: isMobile ? "16px" : "24px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  flexShrink: 0,
                }}
              >
                <Warning />
              </Box>
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 0.25,
                    fontSize: isMobile ? "0.95rem" : undefined,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sign Out Confirmation
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    fontSize: isMobile ? "0.75rem" : undefined,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  This action cannot be undone
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                "&:active": { bgcolor: "rgba(255, 255, 255, 0.3)" },
                alignSelf: "flex-start",
                mt: isMobile ? 0 : 0,
                ml: 1,
                flexShrink: 0,
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
              }}
            >
              <Close
                sx={{
                  color: "white",
                  fontSize: isMobile ? "20px" : "24px",
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: isMobile ? 2 : 3, flex: 1, overflowY: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: isMobile ? 2 : 3,
            minHeight: isMobile ? "auto" : "300px",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: mode === "light" ? "#666" : "#ccc",
              mb: 1,
              lineHeight: 1.6,
              fontSize: isMobile ? "0.9rem" : undefined,
            }}
          >
            Signing out will permanently remove all your local data including:
          </Typography>

          <Box
            sx={{
              bgcolor: mode === "light" ? "#f8f9fa" : "#2a2a2a",
              borderRadius: 2,
              p: isMobile ? 2 : 2.5,
              width: "100%",
              textAlign: "left",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: mode === "light" ? "#1a1a1a" : "white",
                fontWeight: 500,
                mb: 1.5,
                fontSize: isMobile ? "0.85rem" : undefined,
              }}
            >
              The following data will be removed:
            </Typography>

            <Box component="ul" sx={{ m: 0, pl: 2 }}>
             
              <Box component="li" sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === "light" ? "#666" : "#ccc",
                    fontSize: isMobile ? "0.8rem" : undefined,
                  }}
                >
                  Your chat messages and conversations
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === "light" ? "#666" : "#ccc",
                    fontSize: isMobile ? "0.8rem" : undefined,
                  }}
                >
                  Panel configurations and settings
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "#f44336",
              fontWeight: 500,
              fontSize: isMobile ? "0.8rem" : undefined,
              textAlign: "center",
            }}
          >
            This action cannot be undone. You will need to re-enter your API
            keys and start new conversations.
          </Typography>
        </Box>
      </DialogContent>

      {/* Action Buttons */}
      <Box
        sx={{
          p: isMobile ? 2 : 3,
          pt: 0,
          display: "flex",
          gap: isMobile ? 1.5 : 2,
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={onClose}
          disabled={isConfirming}
          sx={{
            borderColor: mode === "light" ? "#e0e0e0" : "#404040",
            color: mode === "light" ? "#666" : "#ccc",
            borderWidth: "1.5px",
            borderRadius: 2,
            py: isMobile ? 1.25 : 1,
            px: isMobile ? 2 : 2.5,
            fontSize: isMobile ? "0.9rem" : "0.875rem",
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.025em",
            transition: "all 0.3s ease",
            backgroundColor: mode === "light" ? "#ffffff" : "#333333",
            "&:hover": {
              borderColor: mode === "light" ? "#ccc" : "#555",
              backgroundColor: mode === "light" ? "#f8f9fa" : "#404040",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            },
            "&:disabled": {
              opacity: 0.6,
              cursor: "not-allowed",
            },
            minWidth: isMobile ? "100%" : "120px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isConfirming}
          startIcon={!isConfirming && <Logout />}
          sx={{
            bgcolor: "#f44336",
            color: "white",
            borderRadius: 2,
            py: isMobile ? 1.25 : 1,
            px: isMobile ? 2 : 2.5,
            fontSize: isMobile ? "0.9rem" : "0.875rem",
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.025em",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#d32f2f",
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 2px 6px rgba(244, 67, 54, 0.2)",
            },

            minWidth: isMobile ? "100%" : "140px",
          }}
        >
          {isConfirming ? "Signing Out..." : "Yes, I Want to Sign Out"}
        </Button>
      </Box>
    </Dialog>
  );
}
