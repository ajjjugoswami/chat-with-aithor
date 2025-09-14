import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { mode } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const { user, isAuthenticated } = useAuth();

  // Auto-fill user data when dialog opens and user is authenticated
  useEffect(() => {
    if (open && isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [open, isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('https://aithor-be.vercel.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', feedback: '' });
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', feedback: '' });
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          minHeight: isMobile ? "100dvh" : "500px",
          maxHeight: isMobile ? "100dvh" : "90vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                maxWidth: isMobile ? "calc(100% - 56px)" : "none", // Leave space for close button
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
                <MessageSquare size={24} />
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
                    color: mode === "light" ? "#1a1a1a" : "white",
                    mb: 0.25,
                    fontSize: isMobile ? "0.95rem" : undefined,
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Share Your Feedback
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: mode === "light" ? "#666" : "#ccc",
                    fontWeight: 500,
                    fontSize: isMobile ? "0.75rem" : undefined,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Help us improve Aithor
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
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
                  color: mode === "light" ? "#666" : "white",
                  fontSize: isMobile ? "20px" : "24px"
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: isMobile ? 2 : 3, flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: mode === "light" ? "#666" : "#ccc",
            mb: 3,
            textAlign: "center",
            fontSize: isMobile ? "0.8rem" : "0.875rem",
          }}
        >
          Your feedback helps us make Aithor better for everyone.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "12px",
              bgcolor: mode === "light" ? "#fef2f2" : "#2d1b1b",
              color: mode === "light" ? "#dc2626" : "#fca5a5",
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: "12px",
              bgcolor: mode === "light" ? "#f0fdf4" : "#1b2d1b",
              color: mode === "light" ? "#16a34a" : "#86efac",
            }}
          >
            Thank you for your feedback! We'll review it soon.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: mode === "light" ? "#ffffff" : "#2a2a2a",
                '& fieldset': {
                  borderColor: mode === "light" ? "#e0e0e0" : "#404040",
                },
                '&:hover fieldset': {
                  borderColor: mode === "light" ? "#b3b3b3" : "#666",
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              },
              '& .MuiInputLabel-root': {
                color: mode === "light" ? "#666" : "#ccc",
                '&.Mui-focused': {
                  color: '#667eea',
                },
              },
            }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: mode === "light" ? "#ffffff" : "#2a2a2a",
                '& fieldset': {
                  borderColor: mode === "light" ? "#e0e0e0" : "#404040",
                },
                '&:hover fieldset': {
                  borderColor: mode === "light" ? "#b3b3b3" : "#666",
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              },
              '& .MuiInputLabel-root': {
                color: mode === "light" ? "#666" : "#ccc",
                '&.Mui-focused': {
                  color: '#667eea',
                },
              },
            }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Your Feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
            multiline
            rows={4}
            placeholder="Tell us what you think..."
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: mode === "light" ? "#ffffff" : "#2a2a2a",
                '& fieldset': {
                  borderColor: mode === "light" ? "#e0e0e0" : "#404040",
                },
                '&:hover fieldset': {
                  borderColor: mode === "light" ? "#b3b3b3" : "#666",
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              },
              '& .MuiInputLabel-root': {
                color: mode === "light" ? "#666" : "#ccc",
                '&.Mui-focused': {
                  color: '#667eea',
                },
              },
            }}
            disabled={loading}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{
                minWidth: '100px',
                py: 1.5,
                px: 3,
                borderRadius: '12px',
                bgcolor: mode === "light" ? "#f3f4f6" : "#374151",
                color: mode === "light" ? "#374151" : "#f3f4f6",
                '&:hover': {
                  bgcolor: mode === "light" ? "#e5e7eb" : "#4b5563",
                },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.name || !formData.email || !formData.feedback}
              sx={{
                minWidth: '120px',
                py: 1.5,
                px: 4,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                   boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                 },
                '&:disabled': {
                  background: mode === "light" ? "#d1d5db" : "#6b7280",
                  color: mode === "light" ? "#9ca3af" : "#d1d5db",
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Send Feedback'
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;