import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme';
import { useTheme } from '../hooks/useTheme';
import LandingPage from './LandingPage';
import SignUpPage from './SignUpPage';

export default function ThemedApp() {
  const { mode } = useTheme();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              } 
            />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
