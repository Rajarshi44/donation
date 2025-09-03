import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { authService, FirebaseUser } from '../services/authService';

export type UserRole = 'donor' | 'ngo' | 'driver' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (role: UserRole) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = authService.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Anonymous',
          email: firebaseUser.email,
          role: firebaseUser.role,
          emailVerified: firebaseUser.emailVerified,
          avatar: firebaseUser.photoURL
        };
        setUser(userData);
        setUserRole(firebaseUser.role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const firebaseUser = await authService.signIn(email, password);
      
      const userData: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Anonymous',
        email: firebaseUser.email,
        role: firebaseUser.role,
        emailVerified: firebaseUser.emailVerified,
        avatar: firebaseUser.photoURL
      };
      
      setUser(userData);
      setUserRole(firebaseUser.role);
      return true;
    } catch (error: any) {
      console.error('Login error:', error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (role: UserRole): Promise<boolean> => {
    try {
      console.log('AuthContext: Starting Google Sign-In...', { role });
      setIsLoading(true);
      const firebaseUser = await authService.signInWithGoogle(role!);
      
      console.log('AuthContext: Google Sign-In successful', firebaseUser);
      
      const userData: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email,
        role: firebaseUser.role,
        emailVerified: firebaseUser.emailVerified,
        avatar: firebaseUser.photoURL
      };
      
      setUser(userData);
      setUserRole(firebaseUser.role);
      return true;
    } catch (error: any) {
      console.error('AuthContext: Google Sign-In error:', error);
      console.error('AuthContext: Error message:', error.message);
      
      // Show the actual error to help with debugging
      alert(`Google Sign-In failed: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: UserRole, displayName: string): Promise<boolean> => {
    try {
      console.log('AuthContext: Starting registration...', { email, role, displayName });
      setIsLoading(true);
      const firebaseUser = await authService.signUp(email, password, role!, displayName);
      
      console.log('AuthContext: Registration successful', firebaseUser);
      
      const userData: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || displayName,
        email: firebaseUser.email,
        role: firebaseUser.role,
        emailVerified: firebaseUser.emailVerified,
        avatar: firebaseUser.photoURL
      };
      
      setUser(userData);
      setUserRole(firebaseUser.role);
      return true;
    } catch (error: any) {
      console.error('AuthContext: Registration error:', error);
      console.error('AuthContext: Error message:', error.message);
      
      // Show the actual error to help with debugging
      alert(`Registration failed: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(null);
      setUserRole(null);
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await authService.resetPassword(email);
    } catch (error: any) {
      console.error('Reset password error:', error.message);
      throw error;
    }
  };

  const sendEmailVerification = async (): Promise<void> => {
    try {
      await authService.sendEmailVerification();
    } catch (error: any) {
      console.error('Send email verification error:', error.message);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      const firebaseUpdates: any = {};
      if (updates.name) firebaseUpdates.displayName = updates.name;
      if (updates.avatar) firebaseUpdates.photoURL = updates.avatar;
      if (updates.role) firebaseUpdates.role = updates.role;

      await authService.updateUserProfile(firebaseUpdates);
      
      // Update local state
      if (user) {
        setUser({ ...user, ...updates });
        if (updates.role) setUserRole(updates.role);
      }
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      throw error;
    }
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
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      resetPassword,
      sendEmailVerification,
      updateProfile,
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
