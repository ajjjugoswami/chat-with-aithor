import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { Lock, Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { useTheme } from "../hooks/useTheme";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!formData.newPassword) {
      setError("New password is required");
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to change your password");
        return;
      }

      const response = await fetch(
        "https://aithor-be.vercel.app/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
          onSuccess?.();
        }, 2000);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={isMobile ? false : "sm"}
      fullWidth={!isMobile}
      fullScreen={isMobile}
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
          minHeight: isMobile ? "100dvh" : "500px",
          maxHeight: isMobile ? "100dvh" : "90vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
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
                maxWidth: isMobile ? "calc(100% - 56px)" : "none",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Lock sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: isMobile ? "1.1rem" : "1.25rem",
                    lineHeight: 1.2,
                  }}
                >
                  Change Password
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "0.875rem",
                    mt: 0.5,
                  }}
                >
                  Update your account security
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: isMobile ? 2 : 3, flex: 1 }}>
        <Box sx={{ mb: isMobile ? 2 : 3 }}>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password changed successfully! You can now use your new password
              to log in.
            </Alert>
          ) : (
            <>
              <Typography
                variant="body2"
                sx={{ color: mode === "light" ? "#6b7280" : "#cccccc", mb: 3 }}
              >
                Enter your current password and choose a new secure password.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("current")}
                          edge="end"
                        >
                          {showPasswords.current ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: mode === "light" ? "#ffffff" : "#333333",
                      "& fieldset": {
                        borderColor: mode === "light" ? "#d1d5db" : "#555555",
                      },
                      "&:hover fieldset": {
                        borderColor: mode === "light" ? "#9ca3af" : "#777777",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8b5cf6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: mode === "light" ? "#6b7280" : "#cccccc",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#8b5cf6",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("new")}
                          edge="end"
                        >
                          {showPasswords.new ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: mode === "light" ? "#ffffff" : "#333333",
                      "& fieldset": {
                        borderColor: mode === "light" ? "#d1d5db" : "#555555",
                      },
                      "&:hover fieldset": {
                        borderColor: mode === "light" ? "#9ca3af" : "#777777",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8b5cf6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: mode === "light" ? "#6b7280" : "#cccccc",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#8b5cf6",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("confirm")}
                          edge="end"
                        >
                          {showPasswords.confirm ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: mode === "light" ? "#ffffff" : "#333333",
                      "& fieldset": {
                        borderColor: mode === "light" ? "#d1d5db" : "#555555",
                      },
                      "&:hover fieldset": {
                        borderColor: mode === "light" ? "#9ca3af" : "#777777",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8b5cf6",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: mode === "light" ? "#6b7280" : "#cccccc",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#8b5cf6",
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <Box
        sx={{
          p: isMobile ? 2 : 3,
          pt: 2,
          borderTop: `1px solid ${mode === "light" ? "#e5e7eb" : "#404040"}`,
          backgroundColor: mode === "light" ? "#f9fafb" : "#262626",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            flexDirection: isMobile ? "row" : "row",
            "& > button": {
              minWidth: isMobile ? "auto" : "auto",
            },
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{
              borderColor: mode === "light" ? "#d1d5db" : "#555555",
              borderWidth: "1.5px",
              color: mode === "light" ? "#6b7280" : "#cccccc",
              backgroundColor: mode === "light" ? "#ffffff" : "#333333",
              "&:hover": {
                borderColor: mode === "light" ? "#9ca3af" : "#777777",
                backgroundColor: mode === "light" ? "#f9fafb" : "#404040",
                color: mode === "light" ? "#374151" : "#ffffff",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&:disabled": {
                borderColor: mode === "light" ? "#e5e7eb" : "#444444",
                color: mode === "light" ? "#9ca3af" : "#888888",
                backgroundColor: mode === "light" ? "#f9fafb" : "#333333",
              },
            }}
          >
            Cancel
          </Button>
          {!success && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background:
                  "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #8b5cf6 100%)",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #8b5cf6 50%, #a855f7 100%)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&:disabled": {
                  background: mode === "light" ? "#d1d5db" : "#555555",
                  color: mode === "light" ? "#9ca3af" : "#888888",
                  transform: "none",
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: "white" }} />
                  <span>Changing...</span>
                </Box>
              ) : (
                "Change Password"
              )}
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default ChangePasswordDialog;
