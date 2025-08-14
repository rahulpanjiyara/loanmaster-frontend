// src/utils/auth.js
export const getToken = () => localStorage.getItem('token');
export const isLoggedIn = () => !!getToken();
