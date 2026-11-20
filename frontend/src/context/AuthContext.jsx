import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('fleet360_token');
    const savedUser = localStorage.getItem('fleet360_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('fleet360_token');
        localStorage.removeItem('fleet360_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await authService.login({ email, password, rememberMe });
    if (res.success && res.data) {
      const authData = res.data;
      setToken(authData.token);
      const userData = {
        id: authData.userId,
        email: authData.email,
        firstName: authData.firstName,
        lastName: authData.lastName,
        fullName: authData.fullName,
        designation: authData.designation,
        department: authData.department,
        roles: authData.roles || [],
        permissions: authData.permissions || [],
      };
      setUser(userData);
      localStorage.setItem('fleet360_token', authData.token);
      localStorage.setItem('fleet360_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    return res;
  };

  const logout = async () => {
    try {
      if (user?.email) {
        await authService.logout(user.email);
      }
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('fleet360_token');
      localStorage.removeItem('fleet360_user');
      window.location.href = '/login';
    }
  };

  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(roleName) || user.roles.includes('ROLE_SUPER_ADMIN');
  };

  const hasPermission = (permName) => {
    if (!user) return false;
    if (user.roles?.includes('ROLE_SUPER_ADMIN')) return true;
    return user.permissions?.includes(permName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
