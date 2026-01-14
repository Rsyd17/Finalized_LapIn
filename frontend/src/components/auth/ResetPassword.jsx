import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import bg from '../../assets/bg_pw.jpg'; 

// --- 1. IMPORT LOGO ---
import logoWhite from '../../assets/logo lapin putih.png'; 

// Reusable Password Input Component
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-4 relative">
      <input 
        type={show ? "text" : "password"} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#EEEEEE] border border-gray-400 rounded-full px-6 py-4 text-gray-700 focus:outline-none focus:border-[#36499C] focus:ring-1 focus:ring-[#36499C] transition"
        required 
      />
      <button 
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        )}
      </button>
    </div>
  );
};

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Cocok',
        text: 'Password baru dan konfirmasi tidak sama!',
        confirmButtonColor: '#36499C'
      });
      return;
    }
    if (newPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Lemah',
        text: 'Password minimal 8 karakter!',
        confirmButtonColor: '#36499C'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Password berhasil direset! Silakan login.',
            confirmButtonColor: '#36499C'
        }).then(() => {
            navigate('/login');
        });
      } else {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: data.message || 'Token tidak valid atau kadaluarsa.',
            confirmButtonColor: '#36499C'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat menghubungi server.',
        confirmButtonColor: '#36499C'
      });
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
           className="h-16 w-auto object-contain" // Adjusted size (h-16 ~ 64px)
         />
      </div>

      {/* CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-lg bg-[#F5F5F5] rounded-[2.5rem] 
      shadow-2xl p-10 md:p-14 text-center animate-fade-in-up">
        
        <h2 className="text-3xl font-bold text-black mb-2 uppercase tracking-tight">BUAT PASSWORD BARU</h2>
        <p className="text-gray-600 mb-8">Masukkan password baru</p>

        <form onSubmit={handleSubmit}>
          
          <PasswordInput 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Masukkan Password"
          />

          <PasswordInput 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Konfirmasi Password"
          />

          <div className="text-left text-sm text-black space-y-1 mb-8 pl-2">
             <p className="font-medium">Minimal 8 karakter</p>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#36499C] text-white font-bold text-lg py-4 
            rounded-2xl hover:bg-[#2a3a7c] transition shadow-lg transform active:scale-95"
          >
            Verifikasi
          </button>
        </form>

      </div>
    </div>
  );
};