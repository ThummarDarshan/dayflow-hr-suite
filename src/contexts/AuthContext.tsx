import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, mockUsers } from '@/data/mockUsers';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface SignupData {
  employeeId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'dayflow_auth';
const USERS_KEY = 'dayflow_users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize users in localStorage if not exists
  useEffect(() => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (!storedUsers) {
      localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const foundUser = users.find((u: User) => u.id === authData.userId);
        if (foundUser) {
          setUser(foundUser);
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : mockUsers;
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, error: 'No account found with this email' };
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    if (!foundUser.isVerified) {
      return { success: false, error: 'Please verify your email before logging in' };
    }

    setUser(foundUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: foundUser.id, token: 'mock-token-' + Date.now() }));
    
    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getUsers();

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Check if employee ID already exists
    if (users.some(u => u.employeeId.toLowerCase() === data.employeeId.toLowerCase())) {
      return { success: false, error: 'This Employee ID is already registered' };
    }

    const newUser: User = {
      id: String(users.length + 1),
      employeeId: data.employeeId,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      department: '',
      position: '',
      phone: '',
      address: '',
      joinDate: new Date().toISOString().split('T')[0],
      isVerified: false, // Needs email verification
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveUsers(users);
      setUser(users[userIndex]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
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
