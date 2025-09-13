import { useEffect, useRef, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Email, Lock } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const LeftSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    flex: "none",
    minHeight: "auto",
    padding: theme.spacing(2),
  },
}));

const FormCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "450px",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  background: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    padding: theme.spacing(3),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: theme.spacing(3),
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
}));

const LogoAvatar = styled("div")(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: "50%",
  boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
  marginBottom: theme.spacing(2),
  border: "4px solid rgba(255, 255, 255, 0.8)",
  objectFit: "cover",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: theme.spacing(2),
    transition: "all 0.3s ease",
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
  "& .MuiInputLabel-root": {
    color: "#6b7280",
    "&.Mui-focused": {
      color: "#059669",
      fontWeight: 600,
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#1f2937",
    fontWeight: 500,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
  color: "white",
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(2),
  fontSize: "1rem",
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 8px 25px rgba(5, 150, 105, 0.3)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover": {
    background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 12px 35px rgba(5, 150, 105, 0.4)",
    "&::before": {
      left: "100%",
    },
  },
  "&:active": {
    transform: "translateY(0px)",
  },
  "&:disabled": {
    background: "#9ca3af",
    boxShadow: "none",
  },
}));

export default function SignUpPage() {
  // Authentication hooks
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
        "https://aithor-be.vercel.app/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Trigger auth context update by reloading
        window.location.reload();
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google credential response
  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      signIn(response.credential);
      navigate("/");
    },
    [signIn, navigate]
  );

  // Initialize Google Sign-In
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        // Render Google button
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "filled_blue",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: "signup_with",
            logo_alignment: "left",
          });
        }
      }
    };

    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isAuthenticated, navigate, handleCredentialResponse]);

  return (
    <PageContainer>
      <LeftSection>
        <FormCard>
          <LogoContainer>
            <LogoAvatar>
              <img
                src="/favicon.png"
                style={{ height: "60px", width: "60px" }}
              />
            </LogoAvatar>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "800",
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", sm: "2.5rem" },
                letterSpacing: "-0.02em",
              }}
            >
              Welcome to Aithor
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
              Join thousands of users chatting with the world's most advanced AI
              models
            </Typography>
          </LogoContainer>

          <Box sx={{ mb: 4 }}>
            <Box
              ref={googleButtonRef}
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
            />

            <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
              <Divider
                sx={{ flex: 1, borderColor: "rgba(102, 126, 234, 0.2)" }}
              />
              <Typography
                variant="body2"
                sx={{ mx: 2, color: "#6b7280", fontWeight: 500 }}
              >
                or continue with email
              </Typography>
              <Divider
                sx={{ flex: 1, borderColor: "rgba(102, 126, 234, 0.2)" }}
              />
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#dc2626",
                  "& .MuiAlert-icon": {
                    color: "#dc2626",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleFormSubmit}>
              <StyledTextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ color: "#059669", mr: 1 }} />,
                }}
              />
              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Lock sx={{ color: "#059669", mr: 1 }} />,
                }}
              />
              <StyledTextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ color: "#059669", mr: 1 }}>
                      <ShieldCheck />
                    </Box>
                  ),
                }}
              />
              <GradientButton
                type="submit"
                fullWidth
                disabled={loading}
                sx={{ py: 1.8 }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </GradientButton>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid rgba(102, 126, 234, 0.1)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "#4b5563", fontWeight: 500 }}
            >
              Already have an account?{" "}
              <Typography
                component="span"
                onClick={() => navigate("/signin")}
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
                Sign In
              </Typography>
            </Typography>
          </Box>
        </FormCard>
      </LeftSection>
    </PageContainer>
  );
}
