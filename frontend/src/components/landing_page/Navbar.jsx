import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../../assets/logo lapin biru.png'; 

export const Navbar = () => {
  return (
    // 1. Reduced 'py-4' to 'py-2' so the navbar stays slim even with a bigger logo
    <nav className="w-full bg-white py-2 px-6 md:px-12 flex justify-between items-center shadow-sm sticky top-0 z-50">
      
      {/* 2. Logo Section */}
      <div className="flex items-center cursor-pointer">
        <img 
          src={logo} 
          alt="LapIn Logo" 
          // 3. Try h-[50px], h-[60px], or h-[70px] to find the exact size you need
          className="h-[35px] w-auto object-contain" 
        />
      </div>

      {/* Login Link */}
      <Link 
        to="/login" 
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path
           strokeLinecap="round"
            strokeLinejoin="round"
          d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15M12 15l3-3m0 0l-3-3m3 3H3.75"
          />
        </svg>
        Masuk
      </Link>
    </nav>
  );
};