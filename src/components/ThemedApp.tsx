import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import App from '../App';
import { AdminApp } from './admin';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider, CssBaseline, Box, Fade } from '@mui/material';
import { getTheme } from '../theme';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import LandingPage from './LandingPage';
import SignUpPage from './SignUpPage';
import SignInPage from './SignInPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import CookieConsentBanner from './CookieConsentBanner';

export default function ThemedApp() {
  const { mode } = useTheme();
  const theme = getTheme(mode);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <AppWithAuth />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

function AppWithAuth() {
  const { loading } = useAuth();
  const { mode } = useTheme();
  // const theme = getTheme(mode);

  return (
    <>
      <Fade in={loading} timeout={300}>
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor={mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'}
          zIndex={9999}
          sx={{
            backdropFilter: 'blur(2px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              borderRadius: '50%',
              // bgcolor: theme.palette.background.paper,
              animation: 'breathe 2s ease-in-out infinite',
              '@keyframes breathe': {
                '0%, 100%': { 
                  transform: 'scale(1)', 
                  boxShadow: mode === 'light' 
                    ? '0 0 20px rgba(19, 52, 135, 0.3)' 
                    : '0 0 20px rgba(59, 130, 246, 0.3)' 
                },
                '50%': { 
                  transform: 'scale(1.1)', 
                  boxShadow: mode === 'light' 
                    ? '0 0 40px rgba(19, 52, 135, 0.6)' 
                    : '0 0 40px rgba(59, 130, 246, 0.6)' 
                },
              },
            }}
          >
            <Box
              component="img"
              src="/favicon.png"
              alt="AIthor Logo"
              sx={{
                width: 48,
                height: 48,
                animation: 'rotate 2s linear infinite',
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>
        </Box>
      </Fade>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/c/:id" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminApp />
            </ProtectedRoute>
          } 
        />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieConsentBanner />
    </>
  );
}
