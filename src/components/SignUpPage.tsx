import { useEffect, useRef, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Email, Lock, ArrowBack } from "@mui/icons-material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100%",
  display: "flex",
  background: "linear-gradient(135deg, #ffffff 0%, #d1fae5 100%)",
  position: "relative",
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
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Password validation function
  const validatePassword = (password: string) => {
    const validation = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password),
    };
    setPasswordValidation(validation);
    return validation;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate password when password field changes
    if (name === 'password') {
      validatePassword(value);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Enhanced email validation
    const email = formData.email.trim().toLowerCase();
    
    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address format");
      return;
    }

    // Extract domain from email
    const domain = email.split('@')[1];
    
    // List of common valid TLDs
    const validTLDs = [
      'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'info', 'biz', 'name',
      'pro', 'coop', 'aero', 'museum', 'travel', 'jobs', 'mobi', 'cat', 'tel',
      'asia', 'post', 'xxx', 'ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'an',
      'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd',
      'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt',
      'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck',
      'cl', 'cm', 'cn', 'co', 'cr', 'cu', 'cv', 'cx', 'cy', 'cz', 'de', 'dj',
      'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu',
      'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg',
      'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw',
      'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in',
      'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh',
      'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li',
      'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg',
      'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu',
      'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl',
      'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk',
      'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs',
      'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk',
      'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'su', 'sv', 'sx', 'sy', 'sz',
      'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tp',
      'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'us', 'uy', 'uz', 'va',
      'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'za', 'zm',
      'zw', 'io', 'sh', 'ac', 'gg', 'im', 'je', 'uk'
    ];

    // List of known fake/invalid domains
    const fakeDomains = [
      'mail.com', 'email.com', 'example.com', 'test.com', 'fake.com', 'dummy.com', 
      'temp.com', 'trash.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
      'temp-mail.org', 'throwaway.email', 'yopmail.com', 'maildrop.cc', 'tempail.com',
      'dispostable.com', '0-mail.com', 'anonbox.net', 'mailcatch.com', 'spamgourmet.com'
    ];

    // Check if domain has a valid TLD
    const tld = domain.split('.').pop();
    if (!tld || !validTLDs.includes(tld)) {
      setError("Please enter a valid email address with a proper domain");
      return;
    }

    // Check for obviously fake domains
    if (fakeDomains.includes(domain)) {
      setError("Please use a real email address, not a temporary or fake one");
      return;
    }

    // Additional checks for suspicious patterns
    if (domain.length < 4 || domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Comprehensive password strength validation
    const passwordStrength = validatePassword(formData.password);
    if (!passwordStrength.hasMinLength) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!passwordStrength.hasUpperCase) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!passwordStrength.hasLowerCase) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!passwordStrength.hasNumber) {
      setError("Password must contain at least one number");
      return;
    }
    if (!passwordStrength.hasSpecialChar) {
      setError("Password must contain at least one special character (!@#$%^&* etc.)");
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
            border: "none",
          },
          zIndex: 100000,
        }}
        aria-label="back to landing page"
      >
        <ArrowBack />
      </IconButton>
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
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: <Lock sx={{ color: "#059669", mr: 1 }} />,
                }}
              />
              
              {/* Password validation display */}
              {formData.password && !(
                passwordValidation.hasMinLength &&
                passwordValidation.hasUpperCase &&
                passwordValidation.hasLowerCase &&
                passwordValidation.hasNumber &&
                passwordValidation.hasSpecialChar
              ) && (
                <Box sx={{ mb: 2, pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#374151" }}>
                    Password must contain:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {passwordValidation.hasMinLength ? (
                        <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                      ) : (
                        <Cancel sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2" sx={{ 
                        color: passwordValidation.hasMinLength ? '#10b981' : '#ef4444',
                        fontSize: '0.875rem'
                      }}>
                        At least 8 characters
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {passwordValidation.hasUpperCase ? (
                        <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                      ) : (
                        <Cancel sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2" sx={{ 
                        color: passwordValidation.hasUpperCase ? '#10b981' : '#ef4444',
                        fontSize: '0.875rem'
                      }}>
                        One uppercase letter (A-Z)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {passwordValidation.hasLowerCase ? (
                        <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                      ) : (
                        <Cancel sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2" sx={{ 
                        color: passwordValidation.hasLowerCase ? '#10b981' : '#ef4444',
                        fontSize: '0.875rem'
                      }}>
                        One lowercase letter (a-z)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {passwordValidation.hasNumber ? (
                        <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                      ) : (
                        <Cancel sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2" sx={{ 
                        color: passwordValidation.hasNumber ? '#10b981' : '#ef4444',
                        fontSize: '0.875rem'
                      }}>
                        One number (0-9)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {passwordValidation.hasSpecialChar ? (
                        <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />
                      ) : (
                        <Cancel sx={{ color: '#ef4444', fontSize: 16 }} />
                      )}
                      <Typography variant="body2" sx={{ 
                        color: passwordValidation.hasSpecialChar ? '#10b981' : '#ef4444',
                        fontSize: '0.875rem'
                      }}>
                        One special character (!@#$%^&*)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
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
