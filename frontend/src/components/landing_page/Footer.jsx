import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // NOTE: Changed from 'react-router' to standard 'react-router-dom'

// --- IMPORTANT: REPLACE THIS WITH THE ACTUAL PATH TO YOUR IMAGE FILE ---
// Assuming your image is in src/assets/ and named something like 'tata_tertib_sc.jpg'
// If it's a PNG, change the extension.
import tataTertibImage from '../../assets/tatattertib.png'; 
// -----------------------------------------------------------------------

export const Footer = () => {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to close modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
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
              <li><a href="https://baak.gunadarma.ac.id/" target="_blank" rel="noreferrer" className="hover:text-white transition">UG BAAK</a></li>
              <li><a href="https://studentsite.gunadarma.ac.id/index.php/aktivasi/index" target="_blank" rel="noreferrer" className="hover:text-white transition">UG STUDENT SITE</a></li>
              <li><a href="https://v-class.gunadarma.ac.id/" target="_blank" rel="noreferrer" className="hover:text-white transition">UG V-CLASS</a></li>
              <li><a href="https://library.gunadarma.ac.id/" target="_blank" rel="noreferrer" className="hover:text-white transition">UG LIBRARY</a></li>
            </ul>
          </div>

          {/* Column 3: Link */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Link</h3>
            <div className="h-0.5 w-12 bg-gray-500 mb-6"></div>
            <ul className="space-y-2 text-sm flex flex-col">
              <Link to="/faq" className="hover:text-white transition w-fit">FAQ</Link>            
              <li><a href="https://www.instagram.com/sc.gunadarma/" target="_blank" rel="noreferrer" className="hover:text-white transition">Instagram Sport Center</a></li>
              <li><a href="https://www.instagram.com/lapin.id/" target="_blank" rel="noreferrer" className="hover:text-white transition">Instagram LapIn</a></li>
              <li>
                {/* MODIFIED: Changed from <a> to <button> to open modal */}
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="hover:text-white transition text-left"
                  type="button"
                >
                  Tata Tertib Sport Center
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="text-center text-xs text-gray-500 pt-8 border-t border-gray-700/50">
          &copy;2025 LapIn All Rights Reserved
        </div>
      </footer>

      {/* --- IMAGE MODAL --- */}
      {isModalOpen && (
        // Backdrop - clicking outside closes modal
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm transition-opacity"
          onClick={closeModal}
        >
          {/* Modal Container - stops click propagation */}
          <div 
            className="relative bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            
            {/* The Image */}
            <img 
              src={tataTertibImage} 
              alt="Tata Tertib Sport Center Gunadarma" 
              className="w-full h-auto block"
            />
          </div>
        </div>
      )}
    </>
  );
};