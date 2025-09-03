import React, { createContext, ReactNode, useContext, useState } from 'react';

export type UserRole = 'donor' | 'ngo' | 'driver' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: { [key: string]: User } = {
  'donor@resqmeal.com': {
    id: '1',
    name: 'Sarah Johnson',
    email: 'donor@resqmeal.com',
    role: 'donor',
    avatar: '👩‍🍳'
  },
  'ngo@resqmeal.com': {
    id: '2',
    name: 'Hope Foundation',
    email: 'ngo@resqmeal.com',
    role: 'ngo',
    avatar: '🏢'
  },
  'driver@resqmeal.com': {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'driver@resqmeal.com',
    role: 'driver',
    avatar: '🚚'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Mock authentication - in real app, this would be an API call
    const mockUser = mockUsers[email];
    
    if (mockUser && password === 'password123' && mockUser.role === role) {
      setUser(mockUser);
      setUserRole(role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      isAuthenticated,
      login,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
