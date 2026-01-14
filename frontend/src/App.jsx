import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import { Navbar } from './components/landing_page/Navbar';
import { Hero } from './components/landing_page/Hero';
import { Footer } from './components/landing_page/Footer';
import { Login } from './components/login/Login';
import { FAQ } from './components/Help/FAQ';
import { Signup } from './components/login/Signup'; 
import { Dashboard } from './components/Dashboard/Dashboard';
import { Booking } from './components/book/Booking';
import { CourtDetail } from './components/court/CourtDetail';
import { BookingIdentity } from './components/book/BookingIdentity';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { Profile } from './components/profile/Profile';
import { MyBookings } from './components/book/MyBookings';
import { ChangePassword } from './components/auth/ChangePassword';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';

// Auth Guards
import AdminRoute from './components/auth/AdminRoute';
import UserRoute from './components/auth/UserRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
              <Hero />
            </main>
            <Footer />
          </div>
        } />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* === SHARED AUTH ROUTES === 
            Moved "Change Password" here so BOTH Admins and Users can access it.
            If it's inside UserRoute, Admins get blocked. 
        */}
        <Route path="/change-password" element={<ChangePassword />} />


        {/* --- PROTECTED USER ROUTES (Admins cannot enter here) --- */}
        <Route element={<UserRoute />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/booking" element={<Booking />} />
           <Route path="/court/:id" element={<CourtDetail />} />
           <Route path="/booking/identity" element={<BookingIdentity />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="/my-bookings" element={<MyBookings />} />
           {/* ChangePassword removed from here */}
        </Route>

        {/* --- PROTECTED ADMIN ROUTE --- */}
        <Route element={<AdminRoute />}>
           <Route path="/admin" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;