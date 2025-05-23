import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, userRoles, isLoading } = useAuth();
  console.log("ProtectedRoute", { isAuthenticated, userRoles, isLoading });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }
  const isAuthorized = allowedRoles.some((role) => userRoles.includes(role));
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />;
  }
  return children ? children : <Outlet />;
};
export default ProtectedRoute;