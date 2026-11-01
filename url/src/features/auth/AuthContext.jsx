// AuthContext.jsx - Centralized Authentication State & Role-Based Access Control
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import apiClient, { setAccessToken, setOnSessionExpired } from '../../services/api';

const AuthContext = createContext({
  user: null,
  role: 'GUEST',
  isAuthenticated: false,
  isLoading: true,
  loginCustomer: async () => {},
  loginAdmin: async () => {},
  registerCustomer: async () => {},
  logout: async () => {},
  logoutAll: async () => {},
  changePassword: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('shorturl_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Synchronize user to localStorage for instant UI responsiveness
  const updateUserState = (userData, accessToken = null) => {
    setUser(userData);
    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (userData) {
      try {
        localStorage.setItem('shorturl_auth_user', JSON.stringify(userData));
      } catch {}
    } else {
      localStorage.removeItem('shorturl_auth_user');
      setAccessToken(null);
    }
  };

  const handleSessionExpired = useCallback(() => {
    updateUserState(null, null);
  }, []);

  useEffect(() => {
    setOnSessionExpired(handleSessionExpired);
  }, [handleSessionExpired]);

  // Initial silent session restoration on app boot
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await apiClient('/api/v1/auth/refresh', { method: 'POST' });
        if (res?.data?.user && res?.data?.accessToken) {
          updateUserState(res.data.user, res.data.accessToken);
        }
      } catch (err) {
        // If no active cookie session or offline mode, preserve local dev demo user if desired
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Customer Login
  const loginCustomer = async (email, password) => {
    const res = await apiClient('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res?.data?.user && res?.data?.accessToken) {
      updateUserState(res.data.user, res.data.accessToken);
      return res.data;
    }
    throw new Error('Login failed: invalid response envelope');
  };

  // Admin Login
  const loginAdmin = async (email, password) => {
    const res = await apiClient('/api/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res?.data?.user && res?.data?.accessToken) {
      updateUserState(res.data.user, res.data.accessToken);
      return res.data;
    }
    throw new Error('Admin login failed: invalid response envelope');
  };

  // Customer Registration (Always creates CUSTOMER role)
  const registerCustomer = async (name, email, password, confirmPassword) => {
    const res = await apiClient('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    if (res?.data?.user && res?.data?.accessToken) {
      updateUserState(res.data.user, res.data.accessToken);
      return res.data;
    }
    throw new Error('Registration failed: invalid response envelope');
  };

  // Logout current session
  const logout = async () => {
    try {
      await apiClient('/api/v1/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout network error, clearing local session:', err.message);
    } finally {
      updateUserState(null, null);
    }
  };

  // Logout all sessions across all devices
  const logoutAll = async () => {
    try {
      await apiClient('/api/v1/auth/logout-all', { method: 'POST' });
    } catch (err) {
      console.warn('Logout all error:', err.message);
    } finally {
      updateUserState(null, null);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    const res = await apiClient('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    // Invalidate local session since backend revokes all refresh tokens
    updateUserState(null, null);
    return res;
  };

  const role = user ? (user.role || 'CUSTOMER').toUpperCase() : 'GUEST';
  const isAuthenticated = !!user;

  const value = useMemo(
    () => ({
      user,
      role,
      isAuthenticated,
      isLoading,
      loginCustomer,
      loginAdmin,
      registerCustomer,
      logout,
      logoutAll,
      changePassword,
    }),
    [user, role, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

