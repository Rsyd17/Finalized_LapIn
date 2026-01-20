import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

// --- IMPORT ASSETS ---
import logoWhite from '../../assets/logo lapin putih.png';
import bgLogin from '../../assets/bg_login.jpg';

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '', 
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          text: `Selamat datang, ${data.user.nama}`,
          showConfirmButton: false,
          timer: 800,
          timerProgressBar: true
        }).then(() => {
           if (data.user.role === 'admin') {
             navigate('/admin'); 
           } else {
             navigate('/dashboard'); 
           }
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: data.message || 'Username atau password salah',
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

  const inputClasses = "w-full px-6 py-4 rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-800 placeholder-gray-400";

  return (
    <div className="flex h-screen w-full font-sans">
      
      {/* LEFT SIDE: Image */}
      <div className="hidden md:flex w-1/2 relative bg-blue-900 items-center justify-center overflow-hidden">
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

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full md:w-1/2 bg-[#F5F5F5] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* UPDATED: Font Bebas Neue */}
          <h2 className="text-6xl font-bebas text-[#36499C] text-center mb-12 tracking-wide">
            Masuk
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className={inputClasses} required />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className={`${inputClasses} pr-12`} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
            <Link to="/forgot-password" className="text-gray-500 text-sm font-medium 
            hover:text-[#36499C] underline transition"> Lupa Password </Link>
            </div>

            <button className="w-full bg-[#36499C] hover:bg-[#2a3a7c] text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-transform transform active:scale-95">
              Masuk
            </button>

            <div className="text-center mt-6 text-sm text-gray-600">
              Belum punya akun? <Link to="/signup" className="font-bold text-black hover:underline">Daftar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};