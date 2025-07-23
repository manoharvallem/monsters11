import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook for easy consumption of the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set the authorization token for all subsequent axios requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  // Function to handle user login
  const login = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return res;
    } catch (err) {
      console.error("Login failed:", err.response.data);
      throw err;
    }
  };
  
  // Function to handle user registration
  const register = async (username, password) => {
    try {
      const res = await axios.post('/api/auth/register', { username, password });
      setUser(res.data.user);
      setToken(res.data.token);
      return res;
    } catch (err) {
      console.error("Registration failed:", err.response.data);
      throw err;
    }
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // The value provided to consuming components
  const value = {
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated: !!token,
  };

  // We don't render the app until the loading state is false
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
