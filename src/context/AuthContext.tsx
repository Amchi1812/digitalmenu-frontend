import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
import type { User, UserRole, LoginRequestDto, LoginResponseDto } from '../types';


interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequestDto) => Promise<void>;
  logout: () => void;
}


export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: UserRole;
  restaurant_id?: string;
  
  exp?: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    
    const email =
      decoded.email || 
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      '';
      
    const role = (
      decoded.role ||
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      ''
    ) as UserRole;

    const restaurantId =
      decoded.restaurant_id || null;

    if (!email || !role) return null;

    return { email, role, restaurantId };
  } catch (error) {
    console.error('Greška pri dekodiranju JWT tokena:', error);
    return null;
  }
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const decodedUser = getUserFromToken(savedToken);
      if (decodedUser) {
        setToken(savedToken);
        setUser(decodedUser);
      } else {
        
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false); 
  }, []);

  
  const login = async (credentials: LoginRequestDto) => {
    
    const response = await api.post<LoginResponseDto>('/auth/login', credentials);
    const { token: newToken, email, role, restaurantId } = response.data;

    
    localStorage.setItem('token', newToken);

    
    setToken(newToken);
    setUser({
      email,
      role,
      restaurantId: restaurantId || null,
    });
  };

  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišten unutar AuthProvider-a!');
  }
  return context;
};