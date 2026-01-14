import React, { useState, useEffect } from 'react';
import { DashNavbar } from '../Dashboard/DashNavbar';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/my-bookings/${user.id}`)
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(err => console.error(err));
    }
  }, []);

  const getStatusColor = (status) => {
    if (status === 'approved') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <DashNavbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Riwayat Booking</h2>
        
        {/* Updated Container: Stronger Shadow and Rounded Corners */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            
            {/* Updated Header: Blue Background + White Text (Like Admin Dashboard) */}
            <thead className="bg-[#36499C] text-white">
              <tr>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Lapangan</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Tanggal</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Jam</th>
                <th className="p-5 font-bold text-sm uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.booking_id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                    <td className="p-5 font-bold text-slate-800">{booking.court_name}</td>
                    
                    <td className="p-5 text-gray-600 font-medium">
                        {new Date(booking.booking_date).toLocaleDateString('id-ID', {
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric'
                        })}
                    </td>
                    
                    <td className="p-5 text-gray-600 font-medium">
                      {booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)}
                    </td>
                    
                    <td className="p-5">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500 italic">
                    Belum ada riwayat booking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};