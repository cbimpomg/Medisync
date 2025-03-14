import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'nurse' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType: string) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; role: User['role'] }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);