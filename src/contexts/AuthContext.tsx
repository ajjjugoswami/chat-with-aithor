import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name?: string;
  email: string;
  picture?: string;
  isAdmin?: boolean;
}

interface QuotaInfo {
  usedCalls: number;
  maxFreeCalls: number;
  remainingCalls: number;
}

interface UserQuotas {
  openai: QuotaInfo;
  gemini: QuotaInfo;
}

interface AuthContextType {
  user: User | null;
  quotas: UserQuotas | null;
  isAuthenticated: boolean;
  signIn: (credential: string) => Promise<void>;
  signInWithForm: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
  updateAuthState: (token: string, userData: User) => void;
  refreshQuotas: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = 'https://aithor-be.vercel.app/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [quotas, setQuotas] = useState<UserQuotas | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedQuotas = localStorage.getItem('quotas');

    if (token && savedUser) {
      // Set initial data from localStorage
      setUser(JSON.parse(savedUser));
      if (savedQuotas) {
        setQuotas(JSON.parse(savedQuotas));
      }
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
          setQuotas(data.quotas);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('quotas', JSON.stringify(data.quotas));
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('quotas');
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

  const refreshQuotas = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await verifyToken(token);
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
    setQuotas(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('quotas');
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
    quotas,
    isAuthenticated: !!user,
    signIn,
    signInWithForm,
    signOut,
    loading,
    updateAuthState,
    refreshQuotas,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
