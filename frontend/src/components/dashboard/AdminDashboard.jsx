import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // <--- 1. Import SweetAlert
import { DashNavbar } from './DashNavbar';

export const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/bookings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      // 2. Replaced Console Error with Popup
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: 'Tidak dapat mengambil data booking dari server.',
        confirmButtonColor: '#36499C'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    // 3. Replaced window.confirm with SweetAlert Confirmation
    Swal.fire({
      title: 'Konfirmasi Update',
      text: `Yakin ingin mengubah status menjadi ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#36499C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Ubah',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        // --- LOGIC MOVED INSIDE CONFIRMATION BLOCK ---
        
        // Get Admin ID
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        if (!user || !user.id) {
          Swal.fire({
            icon: 'error',
            title: 'Sesi Invalid',
            text: 'User ID tidak ditemukan. Silakan login ulang.',
            confirmButtonColor: '#36499C'
          });
          return;
        }

        try {
          const response = await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              status: newStatus,
              adminId: user.id 
            })
          });

          if (response.ok) {
            // Success Popup
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Status booking telah diperbarui!',
              timer: 1500,
              showConfirmButton: false
            });
            fetchBookings(); // Refresh table
          } else {
            const errorData = await response.json();
            // API Error Popup
            Swal.fire({
              icon: 'error',
              title: 'Gagal',
              text: errorData.message || 'Gagal memperbarui status.',
              confirmButtonColor: '#36499C'
            });
          }
        } catch (error) {
          // Network Error Popup
          Swal.fire({
            icon: 'error',
            title: 'Error Server',
            text: 'Gagal update status. Cek koneksi server.',
            confirmButtonColor: '#36499C'
          });
        }
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans flex justify-center items-center">
        <div className="text-xl font-bold text-[#36499C]">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <DashNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#36499C] uppercase tracking-wide">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-2">Kelola permintaan booking lapangan</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 mt-4 md:mt-0">
            <span className="text-gray-500 font-medium">Total Request: </span>
            <span className="text-[#36499C] font-bold text-xl">{bookings.length}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#36499C] text-white uppercase text-sm tracking-wider">
                <tr>
                  <th className="py-5 px-6 font-semibold">User Info</th>
                  <th className="py-5 px-6 font-semibold">Jadwal Booking</th>
                  <th className="py-5 px-6 font-semibold">File KRS</th>
                  <th className="py-5 px-6 text-center font-semibold">Status</th>
                  <th className="py-5 px-6 text-center font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400">
                      Belum ada data booking yang masuk.
                    </td>
                  </tr>
                ) : (
                  bookings.map((item) => (
                    <tr key={item.booking_id} className="border-b border-gray-100 hover:bg-blue-50/30 transition duration-200">
                      
                      {/* User Info */}
                      <td className="py-5 px-6">
                        <div className="font-bold text-slate-800 text-lg">{item.user_name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 font-medium mt-1">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
                             <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                           </svg>
                           {item.no_hp || "-"}
                        </div>
                      </td>

                      {/* Schedule Info */}
                      <td className="py-5 px-6">
                        <div className="text-[#36499C] font-bold">{item.court_name}</div>
                        <div className="text-sm text-gray-600 mt-1">{formatDate(item.booking_date)}</div>
                        <div className="text-xs font-mono bg-gray-100 inline-block px-2 py-1 rounded mt-1">
                          {item.start_time ? item.start_time.slice(0,5) : ""} - {item.end_time ? item.end_time.slice(0,5) : ""}
                        </div>
                      </td>

                      {/* KRS File */}
                      <td className="py-5 px-6">
                        <a 
                          href={`http://localhost:5000/uploads/${item.krs_photo}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 hover:underline font-medium transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          Lihat File
                        </a>
                      </td>

                      {/* Status */}
                      <td className="py-5 px-6 text-center">
                        <span className={`
                          px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider
                          ${item.status === 'approved' ? 'bg-green-100 text-green-700' : 
                            item.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'}
                        `}>
                          {item.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-5 px-6 text-center">
                        {item.status === 'pending' ? (
                          <div className="flex justify-center gap-3">
                            <button 
                              onClick={() => handleStatusChange(item.booking_id, 'approved')}
                              className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                              title="Terima Booking"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </button>
                            <button 
                              onClick={() => handleStatusChange(item.booking_id, 'rejected')}
                              className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                              title="Tolak Booking"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Selesai</span>
                        )}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};