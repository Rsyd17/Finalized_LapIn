import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import bg from '../../assets/bg_pw.jpg'; 

// --- 1. IMPORT LOGO ---
import logoWhite from '../../assets/logo lapin putih.png'; 

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Email Terkirim',
          text: data.message || 'Silakan cek inbox email anda untuk link reset password.',
          confirmButtonColor: '#36499C'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.message,
          confirmButtonColor: '#36499C'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal menghubungi server.',
        confirmButtonColor: '#36499C'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans relative flex flex-col items-center justify-center p-6">
      
      {/* BACKGROUND IMAGE - Overlay Removed */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bg} 
          alt="Court Background" 
          className="w-full h-full object-cover"
        />
        {/* The blue overlay div was removed here */}
      </div>

      {/* --- 2. UPDATED LOGO (Top Left) --- */}
      <div className="absolute top-8 left-8 z-10 hidden md:block">
         <img 
           src={logoWhite} 
           alt="LapIn Logo" 
           className="h-16 w-auto object-contain" 
         />
      </div>

      {/* CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-lg bg-[#F5F5F5] rounded-[2.5rem] shadow-2xl p-10 md:p-14 text-center animate-fade-in-up">
        
        <h2 className="text-3xl font-bold text-black mb-4 uppercase tracking-tight">LUPA PASSWORD</h2>
        <p className="text-gray-600 mb-8 px-4">
          Masukkan email yang terdaftar untuk memverifikasi akun Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#EEEEEE] border border-gray-400 rounded-full px-6 py-4 text-gray-700 focus:outline-none focus:border-[#36499C] focus:ring-1 focus:ring-[#36499C] transition"
            placeholder="Masukkan Email"
            required 
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#36499C] text-white font-bold text-lg py-4 rounded-2xl hover:bg-[#2a3a7c] transition shadow-lg transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Mengirim..." : "Kirim Email"}
          </button>
        </form>

        <div className="mt-8 text-gray-600 text-sm">
          Kembali ke <Link to="/login" className="font-bold text-black hover:underline">Login</Link>
        </div>

      </div>
    </div>
  );
};