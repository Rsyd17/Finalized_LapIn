import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { DashNavbar } from '../dashboard/DashNavbar';

// --- 1. IMPORT BACKGROUND ---
import bgTexture from '../../assets/bg_pw.jpg'; 

// --- Reusable Input Component (Preserved) ---
const PasswordInput = ({ name, value, onChange, show, setShow, placeholder }) => (
  <div className="mb-4">
    <div className="relative">
      <input 
        type={show ? "text" : "password"} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#F5F5F5] border border-gray-400 rounded-full px-6 py-4 text-gray-700 focus:outline-none focus:border-[#36499C] focus:ring-1 focus:ring-[#36499C] transition"
        required 
      />
      <button 
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        )}
      </button>
    </div>
  </div>
);

export const ChangePassword = () => {
  const navigate = useNavigate();

  // --- STATES ---
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Toggles for Eye Icons
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Success State
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation with SweetAlert
    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Cocok',
        text: 'Password baru dan konfirmasi tidak sama!',
        confirmButtonColor: '#36499C'
      });
      return;
    }

    if (formData.newPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Lemah',
        text: 'Password minimal 8 karakter!',
        confirmButtonColor: '#36499C'
      });
      return;
    }

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        navigate('/login');
        return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Password anda telah diperbarui',
            timer: 2000,
            showConfirmButton: false
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
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error Server',
        text: 'Gagal menghubungi server.',
        confirmButtonColor: '#36499C'
      });
    }
  };

  return (
    <div className="min-h-screen font-sans relative flex flex-col">
      <DashNavbar />

      <div className="flex-1 relative flex items-center justify-center p-6">
        {/* --- 2. UPDATED BACKGROUND IMAGE (Overlay Removed) --- */}
        <div className="absolute inset-0 z-0">
          <img 
            src={bgTexture} 
            alt="Court Background" 
            className="w-full h-full object-cover"
          />
          {/* Blue overlay deleted */}
        </div>

        {/* === CARD CONTAINER === */}
        <div className="relative z-10 w-full max-w-lg bg-[#F5F5F5] rounded-[2.5rem] shadow-2xl p-10 md:p-14 text-center">
          
          {!isSuccess ? (
            <>
              <h2 className="text-3xl font-bold text-black mb-2 uppercase tracking-tight">GANTI PASSWORD</h2>
              <p className="text-gray-500 mb-8">Amankan akun anda dengan password baru</p>
              
              <form onSubmit={handleSubmit}>
                <PasswordInput 
                   name="oldPassword" 
                   value={formData.oldPassword} 
                   onChange={handleChange} 
                   show={showOld} 
                   setShow={setShowOld} 
                   placeholder="Password Lama" 
                />
                
                <PasswordInput 
                   name="newPassword" 
                   value={formData.newPassword} 
                   onChange={handleChange}
                   show={showNew} 
                   setShow={setShowNew} 
                   placeholder="Password Baru" 
                />

                <PasswordInput 
                   name="confirmPassword" 
                   value={formData.confirmPassword} 
                   onChange={handleChange}
                   show={showConfirm} 
                   setShow={setShowConfirm} 
                   placeholder="Konfirmasi Password" 
                />

                <div className="text-left text-sm text-black space-y-1 mb-8 pl-2">
                   <p className="font-medium">Syarat Password:</p>
                   <ul className="list-disc list-inside text-gray-600">
                      <li>Minimal 8 karakter</li>
                   </ul>
                </div>

                <button type="submit" className="w-full bg-[#36499C] text-white font-bold text-lg py-4 rounded-2xl hover:bg-[#2a3a7c] transition shadow-lg transform active:scale-95">
                  Verifikasi
                </button>
              </form>
            </>
          ) : (
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold text-black mb-4 uppercase tracking-tight">PASSWORD BERHASIL DIUBAH</h2>
              <p className="text-gray-500 mb-8">Silahkan kembali ke halaman login</p>
              
              <button 
                onClick={() => {
                   localStorage.clear();
                   navigate('/login');
                }}
                className="w-full bg-[#36499C] text-white font-bold text-lg py-4 rounded-2xl hover:bg-[#2a3a7c] transition shadow-lg transform active:scale-95"
              >
                Kembali ke Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};