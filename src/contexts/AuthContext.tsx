
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getCurrentUser, isLoggedIn, login, logout, register, UserCredentials, NewUser } from '../services/authService';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  register: (newUser: NewUser) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const isAuth = isLoggedIn();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (credentials: UserCredentials) => {
    setIsLoading(true);
    try {
      const userData = await login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (newUser: NewUser) => {
    setIsLoading(true);
    try {
      const userData = await register(newUser);
      setUser(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
