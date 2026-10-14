import { t } from '../i18n';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: { username: string; email: string; password: string; address?: string; phoneNumber?: string }) => Promise<User | null>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('inkora_token');
    const savedUser = localStorage.getItem('inkora_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('inkora_token');
        localStorage.removeItem('inkora_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.accessToken);
      localStorage.setItem('inkora_token', res.accessToken);
      localStorage.setItem('inkora_user', JSON.stringify(res.user));
      showToast(t('auth.welcome', { name: res.user.username }));
      return res.user;
    } catch (err: any) {
      showToast(t('auth.loginFail'), 'error');
      return null;
    }
  };

  const register = async (data: { username: string; email: string; password: string; address?: string; phoneNumber?: string }): Promise<User | null> => {
    try {
      const res = await api.register(data);
      setUser(res.user);
      setToken(res.accessToken);
      localStorage.setItem('inkora_token', res.accessToken);
      localStorage.setItem('inkora_user', JSON.stringify(res.user));
      showToast(t('auth.registered'));
      return res.user;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('inkora_token');
    localStorage.removeItem('inkora_user');
    api.logout().catch(() => {});
    showToast(t('auth.signedOut'), 'info');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
