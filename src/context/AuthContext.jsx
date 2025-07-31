import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to check if user is logged in
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Here you would typically validate the token with your backend
      // For now, we'll just assume having a token means the user is authenticated
      try {
        // You could decode the JWT to get user info
        // For simplicity, we'll just set a basic user object
        setCurrentUser({ email: localStorage.getItem('userEmail') || 'user@example.com' });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error validating token:', error);
        logout(); // Clear invalid token
      }
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Update login function to store user email
  const login = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setCurrentUser({ email });
    setIsAuthenticated(true);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
    token: localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};