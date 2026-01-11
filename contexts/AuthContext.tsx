import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  company?: string;
  room?: string;
  phone?: string;
  employeeId?: string;
  accessCardId?: string;
  vehicles?: { number: string; model: string }[];
  createdAt?: string;
  lastLogin?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  // In a real app, you might validate the token with the backend on load
  // For now, we'll just check if it exists and maybe persist user info in localStorage too 
  // or decode the token if it had user info. But for simplicity, we'll rely on login/logout actions.
  // Actually, let's store user in localStorage so it survives refresh along with token.
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse stored user", e);
            logout();
        }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
