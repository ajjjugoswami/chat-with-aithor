import React, { useState, useEffect } from "react";
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
import {
  Lock,
  ArrowBack,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aithor-be.vercel.app/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
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
            <Lock sx={{ fontSize: 48, color: "#059669", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Password Reset Successful!
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280", mb: 3 }}>
              Your password has been successfully reset. You can now sign in
              with your new password.
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Redirecting to sign in page...
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/signin")}
            sx={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
              },
            }}
          >
            Go to Sign In
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
          onClick={() => navigate("/signin")}
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
            Reset Password
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Enter your new password below.
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
            label="New Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: "#059669" }} />,
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                color: "#1f2937",
                fontWeight: 500,
                "& fieldset": {
                  borderColor: "rgba(5, 150, 105, 0.2)",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(5, 150, 105, 0.4)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#059669",
                  boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: "#059669" }} />,
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                color: "#1f2937",
                fontWeight: 500,
                "& fieldset": {
                  borderColor: "rgba(5, 150, 105, 0.2)",
                  borderWidth: "2px",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(5, 150, 105, 0.4)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#059669",
                  boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)",
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={
              loading || !formData.password || !formData.confirmPassword
            }
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
                Resetting...
              </>
            ) : (
              "Reset Password"
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

export default ResetPasswordPage;
