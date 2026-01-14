import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // 1. Get user data
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Check Logic
  // If no user, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but is NOT admin, kick them to main dashboard
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If Admin, allow access to the route (Outlet renders the child component)
  return <Outlet />;
};

export default AdminRoute;