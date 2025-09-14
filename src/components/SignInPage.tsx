import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import { Email, Lock, ArrowBack } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SignInPage: React.FC = () => {
  const { signIn, signInWithForm, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithForm(formData.email, formData.password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      signIn(response.credential);
      navigate("/");
    },
    [signIn, navigate]
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "filled_blue",
          size: "large",
          type: "standard",
          shape: "rectangular",
          text: "signin_with",
          logo_alignment: "left",
        });
      }
    };

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isAuthenticated, navigate, handleCredentialResponse]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
      }}
    >
      <div>
        <IconButton
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            backgroundColor: "#10b981",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            "&:hover": {
              backgroundColor: "#059669",
              transform: "scale(1.05)",
              border:"none"
            },
            zIndex: 100000,
          }}
          aria-label="back to landing page"
        >
          <ArrowBack />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "450px",
              padding: 4,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 3,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "3px",
                  background: "linear-gradient(90deg, #059669, #10b981)",
                  borderRadius: "2px",
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
                  marginBottom: 2,
                  border: "4px solid rgba(255, 255, 255, 0.8)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/favicon.png"
                  style={{ height: "60px", width: "60px" }}
                />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "800",
                  background:
                    "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#6b7280",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  maxWidth: "400px",
                  lineHeight: 1.6,
                }}
              >
                Sign in to continue your AI conversations
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 2,
                "& > div": {
                  borderRadius: "8px !important",
                  overflow: "hidden",
                },
              }}
            >
              <div ref={googleButtonRef}></div>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
              <Divider
                sx={{ flex: 1, borderColor: "rgba(5, 150, 105, 0.2)" }}
              />
              <Typography
                variant="body2"
                sx={{ mx: 2, color: "#6b7280", fontWeight: 500 }}
              >
                or continue with email
              </Typography>
              <Divider
                sx={{ flex: 1, borderColor: "rgba(5, 150, 105, 0.2)" }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleFormSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                InputProps={{
                  startAdornment: <Email sx={{ color: "#059669", mr: 1 }} />,
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
                InputLabelProps={{
                  sx: {
                    color: "#6b7280",
                    "&.Mui-focused": {
                      color: "#059669",
                      fontWeight: 600,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
                variant="outlined"
                InputProps={{
                  startAdornment: <Lock sx={{ color: "#059669", mr: 1 }} />,
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
                InputLabelProps={{
                  sx: {
                    color: "#6b7280",
                    "&.Mui-focused": {
                      color: "#059669",
                      fontWeight: 600,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8,
                  background:
                    "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  color: "white",
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #047857 0%, #065f46 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(5, 150, 105, 0.4)",
                  },
                  "&:disabled": {
                    background: "#9ca3af",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </Box>

            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: "1px solid rgba(5, 150, 105, 0.1)",
                textAlign: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#4b5563", fontWeight: 500 }}
              >
                Don't have an account?{" "}
                <Typography
                  component="span"
                  onClick={() => navigate("/sign-up")}
                  sx={{
                    color: "#059669",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontWeight: 700,
                    "&:hover": {
                      color: "#047857",
                    },
                  }}
                >
                  Sign Up
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default SignInPage;
