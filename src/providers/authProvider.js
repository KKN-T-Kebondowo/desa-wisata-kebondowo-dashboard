import React, { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token']);
  const [accessToken, setAccessToken] = useState(cookies.access_token || null);
  const [refreshToken, setRefreshToken] = useState(cookies.refresh_token || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = cookies.access_token || null;

  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [accessToken]);

  const login = (tokens) => {
    const { access_token, refresh_token } = tokens;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    setCookie('access_token', access_token, { path: '/' });
    setCookie('refresh_token', refresh_token, { path: '/' });
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    removeCookie('access_token', { path: '/' });
    removeCookie('refresh_token', { path: '/' });
  };

  console.log(accessToken);

  console.log('api', process.env.REACT_APP_BACKEND_API);

  const api = axios.create({
    baseURL: process.env.BACKEND_API || 'http://localhost:8080',
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    },
    timeout: 5000,
    withCredentials: true,
    responseType: 'json',
    validateStatus: (status) => {
      return status >= 200 && status < 500; // Example: consider 4xx status codes as errors
    },
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axios.post('/api/auth/refresh', {
            refresh_token: refreshToken,
          });
          const { access_token } = response.data;
          setAccessToken(access_token);
          setCookie('access_token', access_token, { path: '/' });
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (error) {
          logout(); // Logout user if token refresh fails
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, isAuthenticated, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
