import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'; // <--- 1. Import SweetAlert
import { DashNavbar } from '../dashboard/DashNavbar';

export const BookingIdentity = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const fileInputRef = useRef(null);

  const bookingInfo = location.state || {}; 

  const [krsFile, setKrsFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. LIMIT SIZE (2MB)
      if (file.size > 2 * 1024 * 1024) { 
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: 'Maksimal ukuran file adalah 2MB.',
          confirmButtonColor: '#36499C'
        });
        return;
      }

      // 2. STRICT TYPE CHECK (Images Only)
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Format Salah',
          text: 'Mohon upload file gambar (JPG/PNG).',
          confirmButtonColor: '#36499C'
        });
        return;
      }

      setKrsFile(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!krsFile) {
        Swal.fire({
          icon: 'warning',
          title: 'Belum Upload Foto',
          text: 'Mohon upload file KRS terlebih dahulu.',
          confirmButtonColor: '#36499C'
        });
        return;
    }
    setShowConfirmModal(true);
  };

  const handleCloseModals = () => {
    setShowConfirmModal(false);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);

    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      if (!user) {
        Swal.fire({
          icon: 'warning',
          title: 'Sesi Habis',
          text: 'Silakan login kembali.',
          confirmButtonColor: '#36499C'
        }).then(() => {
           navigate('/login');
        });
        return;
      }

      const dataToSend = new FormData();
      dataToSend.append('userId', user.id);
      dataToSend.append('courtId', bookingInfo.courtId || 1); 
      
      const today = new Date().toISOString().split('T')[0];
      dataToSend.append('date', bookingInfo.date || today);
      
      dataToSend.append('timeSlot', bookingInfo.timeSlot || '09.00-10.00');
      dataToSend.append('krsFile', krsFile); 

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        body: dataToSend, 
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Booking Gagal',
          text: result.message || 'Gagal melakukan booking.',
          confirmButtonColor: '#36499C'
        });
      }

    } catch (error) {
      console.error("Booking Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error Server',
        text: 'Terjadi kesalahan koneksi ke server.',
        confirmButtonColor: '#36499C'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans relative">
      <DashNavbar />

      <main className="flex flex-col items-center justify-center pt-12 px-6 pb-20">
        
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-black mb-4 text-center">
          VERIFIKASI MAHASISWA
        </h1>
        <p className="text-gray-500 mb-12 text-center max-w-lg">
          Upload foto Kartu Rencana Studi (KRS) anda untuk memverifikasi status mahasiswa aktif.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col items-center">
          
          <div className="w-full mb-12">
            <div className="w-full h-80 border-3 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-white relative hover:bg-gray-50 transition-colors group cursor-pointer" onClick={handleBrowseClick}>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.png,.jpeg" // RESTRICTED HERE
                className="hidden" 
              />

              {krsFile ? (
                <div className="text-center p-6 animate-fade-in-up">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#36499C]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <div className="text-[#36499C] font-bold text-xl mb-1">Foto Siap Upload</div>
                  <div className="text-gray-500 text-sm mb-4 break-all max-w-sm mx-auto">{krsFile.name}</div>
                  <span className="text-xs text-blue-400 hover:text-blue-600 underline">Klik untuk ganti foto</span>
                </div>
              ) : (
                <div className="flex flex-col items-center p-6">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#36499C]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <button 
                    type="button" 
                    className="bg-[#36499C] text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-800 transition mb-3"
                  >
                    Pilih Foto KRS
                  </button>
                  <p className="text-gray-400 text-sm">Format: JPG atau PNG (Max 2MB)</p>
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full md:w-1/2 bg-[#36499C] text-white font-bold text-xl py-4 rounded-2xl shadow-xl hover:bg-blue-900 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!krsFile}
          >
            Konfirmasi Booking
          </button>
        </form>
      </main>

      {/* CONFIRM MODAL (Preserved your custom design) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModals}></div>
          <div className="relative bg-[#1D77E6] rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-2">Konfirmasi Booking</h3>
            <p className="text-blue-100 mb-8">Apakah foto KRS anda sudah jelas?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={handleCloseModals} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition backdrop-blur-md">Batal</button>
              <button onClick={handleFinalSubmit} className="flex-1 bg-white text-[#1D77E6] font-bold py-3 rounded-xl shadow-lg hover:bg-gray-50 transition transform active:scale-95">Ya, Kirim</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL (Preserved your custom design) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
           <div className="relative bg-[#1D77E6] rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-[#1D77E6]">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white">Booking Berhasil!</h3>
            <p className="text-blue-100 mt-4 text-sm">Menunggu verifikasi admin...</p>
          </div>
        </div>
      )}
    </div>
  );
};