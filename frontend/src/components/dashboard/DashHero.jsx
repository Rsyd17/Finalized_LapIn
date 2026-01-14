import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';

// --- 1. IMPORT ASSET ---
import bgHero from '../../assets/lapangan_biru.jpg'; 

export const DashHero = () => {
  const navigate = useNavigate();

  // --- HANDLE BOOKING CLICK (Logic Preserved) ---
  const handleBookingClick = () => {
    // 1. Get current user data directly from storage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (user) {
      // 2. Check if NPM or Phone is missing
      if (!user.npm || user.npm === '-' || !user.no_hp || user.no_hp === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Profil Belum Lengkap',
          text: 'Mohon lengkapi NPM dan Nomor HP di Profil sebelum melakukan booking!',
          confirmButtonText: 'Lengkapi Sekarang',
          confirmButtonColor: '#36499C',
          showCancelButton: true,
          cancelButtonText: 'Nanti Saja',
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/profile'); 
          }
        });
      } else {
        // 3. If complete, Go to Booking
        navigate('/booking');
      }
    } else {
      // If session expired or no user, go to login
      navigate('/login');
    }
  };

  return (
    <div className="relative w-full overflow-hidden text-white">
       
       {/* --- 1. BACKGROUND IMAGE WITH LIGHTER OVERLAY --- */}
       <div className="absolute inset-0">
         <img 
            src={bgHero} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
         />
         {/* UPDATED OVERLAY: 
            - Changed from bg-blue-900 to lighter bg-blue-600
            - Reduced opacity from /80 to /50
            - Removed 'mix-blend-multiply' for a brighter look
         */}
         <div className="absolute inset-0 bg-blue-600/50"></div>
       </div>
        
       <div className="relative z-10 px-6 md:px-16 py-20 md:py-28 max-w-7xl mx-auto">
          
          {/* --- 2. Title: Oswald --- */}
          <h1 className="text-6xl md:text-7xl font-bold mb-2 font-oswald tracking-wide">
            LapIn
          </h1>

          {/* --- 3. Subtitle: Oswald --- */}
          <h2 className="text-3xl md:text-4xl font-medium mb-6 font-oswald tracking-wide">
            Booking Lapangan Instan Tanpa Ribet
          </h2>

          {/* --- 4. Description: Roboto --- */}
          <p className="text-blue-50 max-w-lg mb-8 text-lg leading-relaxed font-roboto">
            Platform booking lapangan sport center<br/>
            Booking instan, olahraga senang
          </p>
          
          {/* --- 5. Button: Roboto --- */}
          <button 
            onClick={handleBookingClick} 
            className="bg-white text-slate-900 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition font-roboto transform hover:-translate-y-1"
          >
            Booking Sekarang
          </button>
       </div>

       {/* Bottom Curve Divider */}
       <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
         <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M1200 120L0 16.48V0h1200v120z" className="shape-fill" fill="#F9FAFB" fillOpacity="1"></path>
         </svg>
       </div>
    </div>
  );
};