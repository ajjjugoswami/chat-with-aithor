import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from '../App';
import SignInPage from '../components/SignInPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme';
import { useTheme } from '../hooks/useTheme';

export default function ThemedApp() {
  const { mode } = useTheme();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/signin" element={<SignInPage />} />
            <Route 
              path="/" 
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
