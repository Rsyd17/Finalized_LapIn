import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; 

// --- IMPORT ASSETS ---
import logoWhite from '../../assets/logo lapin putih.png';
import bgLogin from '../../assets/bg_login.jpg';

export const Signup = () => {
  const navigate = useNavigate(); 

  // State handles form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic Validation
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Tidak Cocok',
        text: 'Password dan Konfirmasi Password harus sama!',
        confirmButtonColor: '#36499C'
      });
      return;
    }

    try {
      // 2. Send Data to Backend
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Success
        Swal.fire({
            icon: 'success',
            title: 'Registrasi Berhasil!',
            text: 'Akun anda telah dibuat. Silakan login.',
            confirmButtonColor: '#36499C'
        }).then(() => {
            navigate('/login'); 
        });

      } else {
        // 4. Error (Email/Username taken)
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: data.message || 'Gagal mendaftar, silakan coba lagi.',
            confirmButtonColor: '#36499C'
        });
      }

    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error Server',
        text: 'Terjadi kesalahan saat menghubungi server.',
        confirmButtonColor: '#36499C'
      });
    }
  };

  // Styles
  const inputClasses = "w-full px-6 py-4 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:border-[#36499C] focus:ring-1 focus:ring-[#36499C] transition-all text-gray-800 placeholder-gray-400";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2 ml-1";
  const eyeIconClasses = "absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none";

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#F5F5F5]">
      
      {/* LEFT SIDE: Image */}
      <div className="hidden md:flex w-1/2 relative bg-blue-900 items-center justify-center overflow-hidden sticky top-0 h-screen">
        <div className="absolute inset-0">
          {/* UPDATED: Background Image */}
          <img src={bgLogin} alt="Tennis Court" className="w-full h-full object-cover opacity-80"/>
          <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
        </div>
        <div className="absolute inset-0 p-16 flex flex-col justify-between z-10">
          
          {/* UPDATED: Logo Image */}
          <div>
             <img src={logoWhite} alt="LapIn Logo" className="w-48 mb-4 object-contain" />
          </div>

          <div className="text-white">
            {/* UPDATED: Font Oswald */}
            <h2 className="text-5xl font-oswald font-medium leading-tight mb-2 tracking-wide">
              Booking Lapangan Instan
            </h2>
            <h2 className="text-5xl font-oswald font-medium leading-tight tracking-wide">
              Tanpa Ribet.
            </h2>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto py-12">
        <div className="w-full max-w-md space-y-8">
          {/* UPDATED: Font Bebas Neue */}
          <h2 className="text-6xl font-bebas text-[#36499C] text-center tracking-wide">
            daftar
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className={labelClasses}>Nama Lengkap</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
            </div>
             <div>
              <label htmlFor="username" className={labelClasses}>Username</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={inputClasses} required />
            </div>
            <div className="relative">
              <label htmlFor="password" className={labelClasses}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} className={`${inputClasses} pr-12`} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeIconClasses}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className={labelClasses}>Konfirmasi Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`${inputClasses} pr-12`} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={eyeIconClasses}>
                   {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#36499C] hover:bg-[#2a3a7c] text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-transform transform active:scale-95 mt-6">
              Daftar
            </button>

            <div className="text-center mt-6 text-sm text-gray-600">
              Sudah punya akun? <Link to="/login" className="font-bold text-[#36499C] hover:underline">Masuk</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};