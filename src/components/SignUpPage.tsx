import { useEffect, useRef, useCallback, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Paper,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Security as Shield,
  CheckCircle,
} from "@mui/icons-material";
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Styled Components
const SignUpContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: "#f8fafc",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const SignUpCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 450,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  backgroundColor: "white",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    maxWidth: "100%",
  },
}));

const FeaturesList = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  "& > div": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    "&:last-child": {
      marginBottom: 0,
    },
  },
}));

const BrandSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
  "& img": {
    width: 48,
    height: 48,
    marginBottom: theme.spacing(1),
  },
}));

const GoogleSignInWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  "& > div": {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  "& iframe": {
    borderRadius: theme.spacing(1),
  },
}));

const BackgroundPattern = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `
    radial-gradient(circle at 25px 25px, rgba(5, 150, 105, 0.1) 2px, transparent 0),
    radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.1) 2px, transparent 0)
  `,
  backgroundSize: "100px 100px",
  backgroundPosition: "0 0, 50px 50px",
  zIndex: -1,
}));

export default function SignUpPage() {
  // Authentication hooks
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://aithor-be.vercel.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Trigger auth context update by reloading
        window.location.reload();
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  // Handle Google credential response
  const handleCredentialResponse = useCallback((response: { credential: string }) => {
    signIn(response.credential);
    navigate('/');
  }, [signIn, navigate]);

  // Initialize Google Sign-In
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
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
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signup_with',
            logo_alignment: 'left',
          });
        }
      }
    };

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isAuthenticated, navigate, handleCredentialResponse]);

  const features = [
    {
      icon: <CheckCircle sx={{ color: "#059669", fontSize: 20 }} />,
      text: "Use your own API keys",
    },
    {
      icon: <CheckCircle sx={{ color: "#059669", fontSize: 20 }} />,
      text: "Access multiple AI models",
    },
    {
      icon: <CheckCircle sx={{ color: "#059669", fontSize: 20 }} />,
      text: "Complete privacy & control",
    },
    {
      icon: <CheckCircle sx={{ color: "#059669", fontSize: 20 }} />,
      text: "No subscription fees",
    },
  ];

  return (
    <SignUpContainer>
      <BackgroundPattern />
      <Container maxWidth="sm">
        <SignUpCard>
          <BrandSection>
            <img src="/logo.png" alt="Aithor Logo" />
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#111827",
                mb: 1,
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              Welcome to Aithor
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6b7280",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                lineHeight: 1.6,
              }}
            >
              Chat with the world's most advanced AI models using your own API keys
            </Typography>
          </BrandSection>

          <GoogleSignInWrapper>
            <Box ref={googleButtonRef} sx={{ width: "100%" }} />
          </GoogleSignInWrapper>

          <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body2" sx={{ mx: 2, color: '#9ca3af' }}>
              or
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleFormSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 ,color: 'black'}}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 ,color: 'black'}}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 ,color: 'black'}}
              variant="outlined"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: '#059669',
                '&:hover': {
                  backgroundColor: '#047857',
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up with Email'}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              my: 3,
              "&::before, &::after": {
                content: '""',
                flex: 1,
                height: "1px",
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#9ca3af", fontSize: "0.875rem" }}
            >
              What you get
            </Typography>
          </Box>

          <FeaturesList>
            {features.map((feature, index) => (
              <Box key={index}>
                {feature.icon}
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </FeaturesList>

          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 2,
              p: 3,
              mt: 4,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Shield sx={{ color: "#059669", fontSize: 20 }} />
              <Typography
                variant="subtitle2"
                sx={{ color: "#059669", fontWeight: 600 }}
              >
                100% Secure & Private
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#047857",
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              Your API keys are encrypted and stored securely. We never access your data or share it with third parties.
            </Typography>
          </Paper>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#9ca3af",
                fontSize: "0.75rem",
                lineHeight: 1.5,
              }}
            >
              By signing up, you agree to our{" "}
              <Typography
                component="span"
                sx={{
                  color: "#059669",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Terms of Service
              </Typography>{" "}
              and{" "}
              <Typography
                component="span"
                sx={{
                  color: "#059669",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Privacy Policy
              </Typography>
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontSize: "0.875rem" }}
            >
              Already have an account?{" "}
              <Typography
                component="span"
                onClick={() => navigate('/signin')}
                sx={{
                  color: "#059669",
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#047857",
                  },
                }}
              >
                Sign In
              </Typography>
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontSize: "0.875rem", mt: 1 }}
            >
              Want to learn more?{" "}
              <Typography
                component="span"
                onClick={() => navigate('/')}
                sx={{
                  color: "#059669",
                  cursor: "pointer",
                  textDecoration: "underline",
                  "&:hover": {
                    color: "#047857",
                  },
                }}
              >
                Visit our landing page
              </Typography>
            </Typography>
          </Box>
        </SignUpCard>
      </Container>
    </SignUpContainer>
  );
}
