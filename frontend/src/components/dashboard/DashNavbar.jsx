import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

// --- 1. IMPORT ASSETS ---
import logoBlue from '../../assets/logo lapin biru.png'; // Make sure this path is correct based on your folder structure

export const DashNavbar = () => {
  const navigate = useNavigate();
  
  // 1. Get Initial User Data from Local Storage
  const localUserString = localStorage.getItem('user');
  const localUser = localUserString ? JSON.parse(localUserString) : { nama: "Guest", npm: "-", role: "member", id: null };

  // 2. State to hold the REAL, FRESH user data
  const [user, setUser] = useState(localUser);

  // State for Dropdowns & Notifications
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // --- EFFECT: FETCH FRESH USER DATA & NOTIFICATIONS ---
  useEffect(() => {
    if (localUser.id) {
      // A. Fetch Notifications
      fetch(`http://localhost:5000/api/notifications/${localUser.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotifications(data);
        })
        .catch(err => console.error("Error notifications:", err));

      // B. Fetch FRESH User Profile
      fetch(`http://localhost:5000/api/users/${localUser.id}`)
        .then(res => res.json())
        .then(data => {
          setUser(prev => ({ ...prev, ...data }));
          const updatedLocal = { ...localUser, ...data };
          localStorage.setItem('user', JSON.stringify(updatedLocal));
        })
        .catch(err => console.error("Error fetching user profile:", err));
    }
  }, [localUser.id]);

  // --- NEW: VALIDATION HANDLER FOR BOOKING LINK ---
  const handleBookingClick = (e) => {
    e.preventDefault(); // Stop the link from going to URL immediately

    // Check if NPM or Phone is missing
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
      // If complete, Go to Booking
      navigate('/booking');
    }
  };

  // --- LOGOUT FUNCTION (SweetAlert2) ---
  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: "Anda harus login kembali untuk mengakses akun.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#36499C', 
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      reverseButtons: true, 
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl', 
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/login');
        
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Berhasil keluar'
        });
      }
    });
  };

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
  };

  const handleLogoClick = () => {
    if (user.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    // Updated padding to py-2 to accommodate logo height better
    <nav className="bg-white py-2 px-6 md:px-12 flex justify-between items-center shadow-sm sticky top-0 z-50 font-roboto">
      
      {/* Left: Logo (Replaced text with Image) */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <img 
          src={logoBlue} 
          alt="LapIn Logo" 
          className="h-[50px] w-auto object-contain" 
        />
      </div>

      {/* Center: Navigation (HIDDEN IF ADMIN) */}
      <div className="hidden md:flex items-center gap-8 font-medium text-gray-700 font-roboto">
        {user.role !== 'admin' && (
          <>
            <Link to="/dashboard" className="hover:text-[#36499C] transition">Beranda</Link>
            
            {/* UPDATED: Uses handleBookingClick instead of direct Link */}
            <a 
              href="#" 
              onClick={handleBookingClick} 
              className="hover:text-[#36499C] transition cursor-pointer"
            >
              Lapangan
            </a>

            <Link to="/my-bookings" className="hover:text-[#36499C] transition">Booking Saya</Link>
          </>
        )}
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-6 relative">
        
        {/* === NOTIFICATION BELL === */}
        <div className="relative">
          <button 
            onClick={handleNotifClick}
            className="text-[#36499C] hover:text-blue-800 transition relative focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up font-roboto">
              <div className="p-4 border-b border-gray-100 font-bold text-gray-700 bg-gray-50">Notifikasi</div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-gray-50 text-sm hover:bg-gray-50 transition ${notif.is_read ? 'bg-white text-gray-500' : 'bg-blue-50 text-gray-800'}`}>
                      <p className="font-medium mb-1">{notif.message}</p>
                      <span className="text-xs text-gray-400 block">
                        {new Date(notif.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm">Belum ada notifikasi.</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* === PROFILE DROPDOWN === */}
        <div className="relative">
          <button 
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="text-[#36499C] hover:text-blue-800 transition focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up font-roboto">
              
              {/* Header Section */}
              <div className="p-6 flex items-center gap-4 border-b border-gray-100 relative">
                <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#36499C] bg-gray-100 flex items-center justify-center">
                   {user.profile_picture ? (
                     <img 
                       src={`http://localhost:5000/uploads/${user.profile_picture}`} 
                       alt="Profile" 
                       className="w-full h-full object-cover" 
                     />
                   ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-gray-400">
                       <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                     </svg>
                   )}
                </div>
                <div>
                   <h4 className="font-bold text-lg text-slate-800">{user.nama}</h4>
                   {user.npm && user.npm !== "-" && (
                     <p className="text-sm text-gray-500">{user.npm}</p>
                   )}
                </div>
              </div>

              {/* Menu List */}
              <div className="py-2">
                 
                 {/* Only show Profile link if NOT Admin */}
                 {user.role !== 'admin' && (
                   <Link to="/profile" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition group">
                      <div className="flex items-center gap-3 text-gray-700 font-medium group-hover:text-[#36499C]">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          Profile
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                   </Link>
                 )}

                 <Link to="/change-password" className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition text-gray-700 font-medium hover:text-[#36499C]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    Ganti Password
                 </Link>

                 <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition text-gray-700 font-medium hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                    Keluar
                 </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};