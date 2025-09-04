import React, { useEffect, useRef, useCallback } from 'react';
import { Box, Paper, Typography, Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SignInPage: React.FC = () => {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

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
        bgcolor: '#1a1a1a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#00d4aa',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Typography
                sx={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}
              >
                AI
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              Chat with AI
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: 400,
              bgcolor: '#2a2a2a',
              borderRadius: 2,
              border: '1px solid #404040',
            }}
          >
            <Typography component="h2" variant="h5" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: '#888', textAlign: 'center', mb: 4 }}>
              Sign in to start chatting with multiple AI models
            </Typography>
            
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div ref={googleButtonRef}></div>
            </Box>

            {!GOOGLE_CLIENT_ID && (
              <Typography variant="body2" sx={{ color: '#f44336', textAlign: 'center', mt: 3 }}>
                ⚠️ Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env.local file.
              </Typography>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default SignInPage;
