import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/endpoints';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const saveAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Signed out successfully');
  }, []);

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getMe();
      setUser(data.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    saveAuth(data.data.user, data.data.token);
    toast.success('Welcome back!');
    return data.data.user;
  };

  const register = async (formData) => {
    const { data } = await authApi.register(formData);
    saveAuth(data.data.user, data.data.token);
    toast.success('Account created successfully!');
    return data.data.user;
  };

  const googleLogin = async (credential) => {
    const { data } = await authApi.googleLogin(credential);
    saveAuth(data.data.user, data.data.token);
    toast.success('Logged in with Google!');
    return data.data.user;
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOwner: user?.role === 'owner' || user?.role === 'admin',
    login,
    register,
    googleLogin,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
