import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // <--- 1. Import SweetAlert
import { DashNavbar } from '../dashboard/DashNavbar';

export const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // State for form inputs
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    npm: '',
    noHp: '',
    profilePic: null // The actual file object for upload
  });

  // State for visual preview of the image
  const [previewImage, setPreviewImage] = useState(null);

  // Getting the user ID from LocalStorage
  const localUserString = localStorage.getItem('user');
  const localUser = localUserString ? JSON.parse(localUserString) : null;

  // Safety Check
  useEffect(() => {
    if (!localUser) {
      navigate('/login');
    }
  }, [localUser, navigate]);

  // 1. FETCH FRESH DATA FROM DATABASE
  useEffect(() => {
    if (localUser?.id) {
      fetch(`http://localhost:5000/api/users/${localUser.id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            nama: data.nama || '',
            email: data.email || '',
            npm: data.npm || '',
            noHp: data.no_hp || '',
            profilePic: null
          });

          // If user has a profile picture, set the preview URL
          if (data.profile_picture) {
            setPreviewImage(`http://localhost:5000/uploads/${data.profile_picture}`);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching profile:", err);
          setLoading(false);
        });
    }
  }, [localUser?.id]);

  // 2. HANDLE TEXT INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. HANDLE IMAGE UPLOAD PREVIEW
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file });
      setPreviewImage(URL.createObjectURL(file)); // Show image instantly
    }
  };

  // 4. SUBMIT FORM TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use FormData for file uploads
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('email', formData.email);
    data.append('npm', formData.npm);
    data.append('noHp', formData.noHp);
    if (formData.profilePic) {
      data.append('profilePic', formData.profilePic);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${localUser.id}`, {
        method: 'PUT',
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        // Update LocalStorage so Navbar updates instantly
        const updatedUser = { ...localUser, ...result.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // SUCCESS POPUP
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Profile anda berhasil diperbarui.',
          confirmButtonColor: '#36499C'
        }).then(() => {
          // Reload to refresh navbar image/name everywhere
          window.location.reload();
        });

      } else {
        // ERROR POPUP (API)
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: result.message || 'Gagal memperbarui data.',
          confirmButtonColor: '#36499C'
        });
      }
    } catch (error) {
      console.error(error);
      // ERROR POPUP (Network)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal menghubungi server.',
        confirmButtonColor: '#36499C'
      });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#36499C] font-bold">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <DashNavbar />

      {/* === HERO HEADER (Blue) - PRESERVED EXACTLY === */}
      <div className="relative bg-[#2563EB] h-[220px] overflow-hidden">
        {/* Decorative Curves (SVG) */}
        <div className="absolute inset-0 opacity-30">
             <svg className="w-full h-full" viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                 <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 V300 H0 Z" fill="white" fillOpacity="0.2"/>
             </svg>
        </div>

        {/* Back Button & Title */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8 flex items-center gap-4 text-white">
          <button onClick={() => navigate('/dashboard')} className="hover:opacity-80 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-wide">WELCOME, {formData.nama.split(' ')[0]}</h1>
            <p className="text-blue-100 text-sm mt-1">Kelola data diri anda</p>
          </div>
        </div>
      </div>

      {/* === PROFILE CONTENT === */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        
        {/* Info Card - Wrapped in Form for Submission */}
        <form onSubmit={handleSubmit} className="relative -mt-16 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            
            {/* Header Row: Avatar + Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex items-center gap-6">
                    {/* AVATAR UPLOAD SECTION */}
                    <div className="relative group w-24 h-24">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                                </div>
                            )}
                        </div>
                        {/* Hidden Input & Overlay Label */}
                        <input 
                           type="file" 
                           id="profileUpload" 
                           accept="image/*"
                           className="hidden" 
                           onChange={handleImageChange}
                        />
                        <label 
                           htmlFor="profileUpload" 
                           className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition text-xs font-bold"
                        >
                           Ubah Foto
                        </label>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{formData.nama || 'User'}</h2>
                        <p className="text-gray-500">{formData.npm || 'NPM Belum diisi'}</p>
                    </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="bg-[#36499C] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition shadow-lg transform active:scale-95">
                    Simpan Perubahan
                </button>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                
                {/* Nama */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nama Lengkap</label>
                    <input 
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#36499C]"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#36499C]"
                    />
                </div>

                {/* NPM */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">NPM</label>
                    <input 
                        type="text"
                        name="npm"
                        value={formData.npm}
                        onChange={handleChange}
                        placeholder="Contoh: 10123001"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#36499C]"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Nomor HandPhone</label>
                    <input 
                        type="text"
                        name="noHp"
                        value={formData.noHp}
                        onChange={handleChange}
                        placeholder="Contoh: 08123456789"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#36499C]"
                    />
                </div>

            </div>

            {/* Footer Text */}
            <div className="text-center">
                <h3 className="text-xl font-bold text-[#213A75]">Lapangan Instan</h3>
            </div>

        </form>
      </main>

    </div>
  );
};