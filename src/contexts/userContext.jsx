import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);   // 👈 NEW
  const [error, setError] = useState(null);        // 👈 NEW
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    if (token) {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(backendUrl + '/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
        setUser(null);
        setError(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      token, 
      setToken, 
      login, 
      logout, 
      fetchUserDetails, 
      backendUrl,
      loading,       // 👈 expose states
      error          // 👈 expose states
    }}>
      {children}
    </UserContext.Provider>
  );
};
