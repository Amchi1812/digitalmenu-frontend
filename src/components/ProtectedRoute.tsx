import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Učitavanje...</p>
      </div>
    );
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

 
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    
    if (user.role === 'SuperAdmin') {
      return <Navigate to="/superadmin" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  
  return <Outlet />;
};