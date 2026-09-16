import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('portfolio_admin_token'));

  const getAuthStatus = async () => {
    const res = await api.get('/auth/status');
    return res.data;
  };

  const setupTotp = async (totpToken) => {
    const res = await api.post('/auth/setup-totp', { token: totpToken });
    if (res.data.token) {
      localStorage.setItem('portfolio_admin_token', res.data.token);
      setToken(res.data.token);
    }
    return res.data;
  };

  const loginWithTotp = async (totpToken) => {
    const res = await api.post('/auth/login-totp', { token: totpToken });
    if (res.data.token) {
      localStorage.setItem('portfolio_admin_token', res.data.token);
      setToken(res.data.token);
    }
    return res.data;
  };

  const regenerateQr = async () => {
    const res = await api.post('/auth/regenerate-qr');
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('portfolio_admin_token');
    setToken(null);
  };

  const loginLocally = () => {
    const localToken = 'local_admin_session';
    localStorage.setItem('portfolio_admin_token', localToken);
    setToken(localToken);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        getAuthStatus,
        setupTotp,
        loginWithTotp,
        regenerateQr,
        loginLocally,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
