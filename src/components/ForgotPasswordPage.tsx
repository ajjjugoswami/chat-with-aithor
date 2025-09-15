import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Email, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://aithor-be.vercel.app/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to send reset email");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
          p: 2,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            maxWidth: 400,
            width: "100%",
            textAlign: "center",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Email sx={{ fontSize: 48, color: "#059669", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Check Your Email
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280", mb: 3 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              The link will expire in 1 hour. Please check your spam folder if
              you don't see it.
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/signin")}
            sx={{
              mt: 2,
              borderColor: "#059669",
              color: "#059669",
              "&:hover": {
                borderColor: "#047857",
                backgroundColor: "rgba(5, 150, 105, 0.04)",
              },
            }}
          >
            Back to Sign In
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => navigate("/sign-in")}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "#6b7280",
          }}
        >
          <ArrowBack />
        </IconButton>

        <Box sx={{ textAlign: "center", mb: 3, pt: 2 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
              margin: "0 auto 16px",
              border: "4px solid rgba(255, 255, 255, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src="/favicon.png" style={{ height: "60px", width: "60px" }} />
          </Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Forgot Password
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: "#9ca3af" }} />,
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !email.trim()}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "none",
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              borderRadius: 3,
              boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 35px rgba(5, 150, 105, 0.4)",
              },
              "&:disabled": {
                background: "#9ca3af",
                boxShadow: "none",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography
            variant="body2"
            onClick={() => navigate("/signin")}
            sx={{
              color: "#059669",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 500,
              "&:hover": {
                color: "#047857",
              },
            }}
          >
            Back to Sign In
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
