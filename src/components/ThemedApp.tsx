import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme';
import { useTheme } from '../hooks/useTheme';
import StyledLandingPage from './StyledLandingPage';

export default function ThemedApp() {
  const { mode } = useTheme();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<StyledLandingPage />} />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
