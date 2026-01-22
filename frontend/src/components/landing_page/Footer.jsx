import React from 'react';
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer className="bg-[#333541] text-gray-300 py-16 px-6 md:px-20 border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        
        {/* Column 1: Lokasi */}
        <div>
          <h3 className="text-white font-bold text-lg mb-2">Lokasi LapIn</h3>
          <div className="h-0.5 w-24 bg-gray-500 mb-6"></div> {/* Underline style */}
          <address className="not-italic text-sm leading-6">
            <p>Jl. Akses Kelapa Dua Kelapa Dua, Cimanggis</p>
            <p>Phone : 085161856036</p>            
          </address>
        </div>

        {/* Column 2: UG Direktori */}
        <div>
          <h3 className="text-white font-bold text-lg mb-2">UG Direktori</h3>
          <div className="h-0.5 w-24 bg-gray-500 mb-6"></div>
          <ul className="space-y-2 text-sm">
            <li><a href="https://baak.gunadarma.ac.id/" target="_blank" className="hover:text-white transition">UG BAAK</a></li>
            <li><a href="https://studentsite.gunadarma.ac.id/index.php/aktivasi/index" target="_blank" className="hover:text-white transition">UG STUDENT SITE</a></li>
            <li><a href="https://v-class.gunadarma.ac.id/" target="_blank" className="hover:text-white transition">UG V-CLASS</a></li>
            <li><a href="https://library.gunadarma.ac.id/" target="_blank"className="hover:text-white transition">UG LIBRARY</a></li>
          </ul>
        </div>

        {/* Column 3: Link */}
        <div>
          <h3 className="text-white font-bold text-lg mb-2">Link</h3>
          <div className="h-0.5 w-12 bg-gray-500 mb-6"></div>
          <ul className="space-y-2 text-sm">
            <Link to="/faq" className="hover:text-white transition">FAQ</Link>      
            <li><a href="https://www.instagram.com/sc.gunadarma/" target="_blank" className="hover:text-white transition">Instagram Sport Center</a></li>
            <li><a href="https://www.instagram.com/lapin.id/" target="_blank" className="hover:text-white transition">Instagram LapIn</a></li>
          </ul>
        </div>

      </div>

      {/* Copyright Section */}
      <div className="text-center text-xs text-gray-500 pt-8 border-t border-gray-700/50">
        &copy;2025 LapIn All Rights Reserved
      </div>
    </footer>
  );
};

