import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get('token') || null);

  const login = (newToken) => {
    setToken(newToken);
    Cookies.set('token', newToken, { expires: 7 });
  };

  const logout = () => {
    setToken(null);
    Cookies.remove('token');
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
