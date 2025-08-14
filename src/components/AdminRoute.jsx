// components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.type !== 'admin') return <Navigate to="/unauthorised" />;
    return children;
  } catch (err) {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;