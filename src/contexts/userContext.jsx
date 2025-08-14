import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
export const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [user, setUser] = useState(null); // user details
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate =useNavigate();

  // Optionally, fetch user details if token exists

  const fetchUserDetails = async () => {
    if (token) {
      try {
        const res = await axios.get(backendUrl+'/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.log(error)
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
      }
    }
  };
  


 useEffect(() => {
        if (token) {
             fetchUserDetails();
        }
    }, [token])

  // Login function
  const login = (jwtToken) => {
    //setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    navigate('/login')
    
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, login, logout,fetchUserDetails,backendUrl}}>
      {children}
    </UserContext.Provider>
  );
};