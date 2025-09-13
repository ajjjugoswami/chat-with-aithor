import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Box, Paper, Typography, Container, TextField, Button, Alert, Divider } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SignInPage: React.FC = () => {
  const { signIn, signInWithForm, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);

    try {
      await signInWithForm(formData.email, formData.password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialResponse = useCallback((response: { credential: string }) => {
    signIn(response.credential);
    navigate('/');
  }, [signIn, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'filled_blue',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left',
        });
      }
    };

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isAuthenticated, navigate, handleCredentialResponse]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          radial-gradient(circle at 25% 25%, #667eea 0%, transparent 70%),
          radial-gradient(circle at 75% 75%, #764ba2 0%, transparent 70%),
          radial-gradient(circle at 50% 50%, #4facfe 0%, transparent 70%),
          linear-gradient(135deg, #0f0c29 0%, #24243e 35%, #313861 100%)
        `,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none',
        }
      }}
    >
      {/* Animated floating elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(180deg)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '15%',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(79, 172, 254, 0.1), rgba(0, 212, 170, 0.1))',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Container component="main"  >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 8,
              animation: 'fadeInDown 1s ease-out',
              '@keyframes fadeInDown': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                background: `
                  linear-gradient(45deg, #00d4aa 0%, #00f5ff 50%, #00d4aa 100%),
                  radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)
                `,
                borderRadius: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                boxShadow: `
                  0 20px 40px rgba(0, 212, 170, 0.4),
                  0 0 80px rgba(0, 245, 255, 0.2),
                  inset 0 2px 0 rgba(255, 255, 255, 0.3)
                `,
                border: '2px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { 
                    boxShadow: `
                      0 20px 40px rgba(0, 212, 170, 0.4),
                      0 0 80px rgba(0, 245, 255, 0.2),
                      inset 0 2px 0 rgba(255, 255, 255, 0.3)
                    ` 
                  },
                  '50%': { 
                    boxShadow: `
                      0 25px 50px rgba(0, 212, 170, 0.6),
                      0 0 120px rgba(0, 245, 255, 0.4),
                      inset 0 2px 0 rgba(255, 255, 255, 0.3)
                    ` 
                  },
                },
              }}
            >
              <Typography
                sx={{ 
                  color: 'white', 
                  fontWeight: 900, 
                  fontSize: '40px',
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  letterSpacing: '-1px'
                }}
              >
                AI
              </Typography>
            </Box>
            <Typography 
              variant="h2" 
              sx={{ 
                color: 'white', 
                fontWeight: 800,
                textAlign: 'center',
                mb: 2,
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', sm: '3.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Chat with Aithor
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                textAlign: 'center',
                fontWeight: 400,
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '18px',
                letterSpacing: '0.5px'
              }}
            >
              Experience the future of conversation
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 440,
              background: `
                linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)
              `,
              borderRadius: '32px',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 32px 64px rgba(0, 0, 0, 0.1),
                0 16px 32px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.4)
              `,
              position: 'relative',
              animation: 'fadeInUp 1s ease-out 0.3s both',
              '@keyframes fadeInUp': {
                from: {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '32px',
                padding: '1px',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'exclude',
              }
            }}
          >
            <Typography 
              component="h1" 
              variant="h3" 
              sx={{ 
                color: '#1a1a2e', 
                textAlign: 'center',
                fontWeight: 700,
                mb: 3,
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '2.2rem',
                letterSpacing: '-0.01em'
              }}
            >
              Welcome
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748b', 
                textAlign: 'center', 
                mb: 6,
                fontSize: '18px',
                lineHeight: 1.7,
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
                maxWidth: '320px'
              }}
            >
              Sign in with Google to unlock the power of AI conversations
            </Typography>
            
            <Box 
              sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                '& > div': {
                  borderRadius: '0px !important',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12) !important',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important',
                  transform: 'scale(1.1)',
                  '&:hover': {
                    transform: 'scale(1.15) translateY(-4px) !important',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2) !important',
                  },
                  '&:active': {
                    transform: 'scale(1.08) translateY(-2px) !important',
                  }
                }
              }}
            >
              <div ref={googleButtonRef}></div>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 4, width: '100%' }}>
              <Divider sx={{ flex: 1, borderColor: 'rgba(100, 116, 139, 0.3)' }} />
              <Typography variant="body2" sx={{ mx: 2, color: 'rgba(100, 116, 139, 0.7)' }}>
                or
              </Typography>
              <Divider sx={{ flex: 1, borderColor: 'rgba(100, 116, 139, 0.3)' }} />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleFormSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }
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
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: '#059669',
                  borderRadius: 2,
                  fontSize: '16px',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#047857',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(5, 150, 105, 0.5)',
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In with Email'}
              </Button>
            </Box>

            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(100, 116, 139, 0.7)', 
                textAlign: 'center', 
                mt: 3,
                fontSize: '14px'
              }}
            >
              Don't have an account?{' '}
              <Typography
                component="span"
                onClick={() => navigate('/signup')}
                sx={{
                  color: '#059669',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#047857',
                  },
                }}
              >
                Sign Up
              </Typography>
            </Typography>

            {!GOOGLE_CLIENT_ID && (
              <Box
                sx={{
                  mt: 6,
                  p: 4,
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: 3,
                  border: '1px solid #f59e0b',
                  width: '100%',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#92400e', 
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  ⚠️ Configuration Required
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#a16207', 
                    textAlign: 'center',
                    fontSize: '13px',
                    lineHeight: 1.5
                  }}
                >
                  Please set VITE_GOOGLE_CLIENT_ID in your .env.local file to enable Google Sign In
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default SignInPage;
