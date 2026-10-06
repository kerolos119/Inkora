import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/index.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { username: string; email: string; password: string; address?: string; phoneNumber?: string }) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: Role) => Promise<void>;
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
    } else {
      // Default initial session as customer Eleanor Vance for delightful immediate experience
      const defaultUser: User = {
        id: 'usr-demo-user',
        username: 'eleanor_vance',
        email: 'user@inkora.com',
        role: 'USER',
        address: '742 Evergreen Terrace, Apt 4B, Portland, OR 97201',
        phoneNumber: '+1 (555) 234-5678',
      };
      setUser(defaultUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.accessToken);
      localStorage.setItem('inkora_token', res.accessToken);
      localStorage.setItem('inkora_user', JSON.stringify(res.user));
      showToast(`Welcome back, ${res.user.username}`);
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (data: { username: string; email: string; password: string; address?: string; phoneNumber?: string }): Promise<boolean> => {
    try {
      const res = await api.register(data);
      setUser(res.user);
      setToken(res.accessToken);
      localStorage.setItem('inkora_token', res.accessToken);
      localStorage.setItem('inkora_user', JSON.stringify(res.user));
      showToast('Account registered successfully!');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('inkora_token');
    localStorage.removeItem('inkora_user');
    api.logout().catch(() => {});
    showToast('Signed out of Inkora', 'info');
  };

  const switchDemoRole = async (role: Role) => {
    const email = role === 'ADMIN' ? 'admin@inkora.com' : role === 'AGENT' ? 'agent@inkora.com' : 'user@inkora.com';
    await login(email, 'Pass123!');
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
        switchDemoRole,
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
