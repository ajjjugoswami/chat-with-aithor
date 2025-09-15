import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name?: string;
  email: string;
  picture?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (credential: string) => Promise<void>;
  signInWithForm: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  updateAuthState: (token: string, userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://aithor-be.vercel.app/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      // Verify token with backend
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          // Use fresh user data from backend instead of localStorage
          setUser(data.user);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credential: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/');
      } else {
        throw new Error(data.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithForm = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Form sign in error:', error);
      throw error;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    // Redirect to landing page
    navigate('/');
  };

  const updateAuthState = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signInWithForm,
    signOut,
    loading,
    updateAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
