import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { courtsData } from '../../data/courtsData';
import { DashNavbar } from '../dashboard/DashNavbar';
import { Footer } from '../landing_page/Footer';

// --- 1. IMPORT ASSETS ---
// Court Images
import lapA from '../../assets/lap_a.webp';
import lapB from '../../assets/lap_b.jpg';
import lapC from '../../assets/lap_c.jpg';
import bad1 from '../../assets/badminton1.jpg';
import bad2 from '../../assets/badminton2.jpg';

// Sport Icons
import iconFutsal from '../../assets/futsal.jpg';
import iconVoli from '../../assets/voli.jpg';
import iconBasket from '../../assets/Basket.jpg';
import iconBadminton from '../../assets/bultang.jpg';

export const CourtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- 2. GET DATA AND OVERRIDE IMAGE ---
  // Find the basic data
  const rawCourt = courtsData.find((c) => c.id === parseInt(id));

  // Logic to swap the image with the imported local asset
  let court = null;
  if (rawCourt) {
    let localImg = rawCourt.img;
    if (rawCourt.id === 1) localImg = lapA;
    if (rawCourt.id === 2) localImg = lapB;
    if (rawCourt.id === 3) localImg = lapC;
    if (rawCourt.id === 4) localImg = bad1;
    if (rawCourt.id === 5) localImg = bad2;

    // Create updated court object
    court = { ...rawCourt, img: localImg };
  }

  // --- STATE ---
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); 
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Store real booked slots from DB
  const [bookedSlots, setBookedSlots] = useState([]); 

  // --- 1. DYNAMIC DATES (Real-Time) ---
  const generateDates = () => {
    const dateList = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dateList.push({
        day: nextDate.toLocaleDateString('id-ID', { weekday: 'long' }),
        dateLabel: nextDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        // Backend Value: YYYY-MM-DD
        value: nextDate.toISOString().split('T')[0] 
      });
    }
    return dateList;
  };

  const dates = generateDates();

  // --- 2. FETCH AVAILABILITY ---
  useEffect(() => {
    const fetchAvailability = async () => {
      const dateString = dates[selectedDateIndex].value;
      
      try {
        const response = await fetch(`http://localhost:5000/api/schedule?courtId=${id}&date=${dateString}`);
        const data = await response.json();
        setBookedSlots(data); 
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [selectedDateIndex, id]);


  // --- 3. GENERATE TIME SLOTS ---
  const generateTimeSlots = () => {
    const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    
    return hours.map((hour, index) => {
      const checkTime = `${hour < 10 ? '0' + hour : hour}:00`; 
      const displayTime = `${hour < 10 ? '0' + hour : hour}.00-${(hour + 1) < 10 ? '0' + (hour + 1) : (hour + 1)}.00`;

      const isBooked = bookedSlots.some(b => 
        b.start_time && b.start_time.toString().startsWith(checkTime)
      );

      return {
        id: index, 
        time: displayTime,
        status: isBooked ? "booked" : "available" 
      };
    });
  };

  const timeSlots = generateTimeSlots();

  // --- HELPERS ---
  const getSelectedTimeLabel = () => {
    const slot = timeSlots.find(s => s.id === selectedTimeSlot);
    return slot ? slot.time : "";
  };

  const getSelectedDateLabel = () => {
    const date = dates[selectedDateIndex];
    return `${date.day}, ${date.dateLabel} ${new Date().getFullYear()}`; 
  };

  // --- HANDLERS (UPDATED WITH SWEETALERT) ---
  const handleConfirmClick = () => {
    // 1. Check if Time is Selected
    if (selectedTimeSlot === null) {
      Swal.fire({
        icon: 'warning',
        title: 'Belum Memilih Jam',
        text: 'Mohon pilih jam booking terlebih dahulu.',
        confirmButtonColor: '#36499C'
      });
      return;
    }

    // 2. Check Profile Completeness
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (user) {
      if (!user.npm || user.npm === '-' || !user.no_hp || user.no_hp === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Profil Belum Lengkap',
          text: 'Data diri belum lengkap. Mohon lengkapi NPM dan Nomor HP di Profil sebelum melanjutkan.',
          showCancelButton: true,
          confirmButtonText: 'Lengkapi Sekarang',
          cancelButtonText: 'Batal',
          confirmButtonColor: '#36499C',
          cancelButtonColor: '#d33'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/profile');
          }
        });
        return; // Stop execution regardless of choice
      }
    } else {
       navigate('/login');
       return;
    }

    // 3. If all good, show modal
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleFinalBooking = () => {
    const selectedDateValue = dates[selectedDateIndex].value; 
    const bookingData = {
      courtId: court.id,
      courtName: court.name,
      date: selectedDateValue,
      timeSlot: getSelectedTimeLabel(),
    };
    navigate('/booking/identity', { state: bookingData });
  };

  if (!court) return <div className="text-center py-20">Lapangan tidak ditemukan!</div>;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans relative">
      <DashNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/booking" className="flex items-center gap-2 text-gray-500 hover:text-[#36499C] mb-6 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Kembali ke List Lapangan
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2">
              <div className="h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-6 shadow-md">
                <img src={court.img} alt={court.name} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-1">{court.name}</h1>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Available for</p>
              <div className="flex gap-6 mb-6">
                {court.sports.map((sport, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <SportIcon type={sport} />
                    <span className="text-sm font-medium text-black">{sport}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-start pt-2">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-black mb-3">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  {court.name} dapat digunakan untuk bermain Futsal, Bola Voli, dan Bola Basket.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black mb-4">Fasilitas</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-800 font-medium text-lg"> Parkir Mobil</li>
                  <li className="flex items-center gap-3 text-gray-800 font-medium text-lg">Parkir Motor</li>
                  <li className="flex items-center gap-3 text-gray-800 font-medium text-lg">Vending Machine</li>
                  <li className="flex items-center gap-3 text-gray-800 font-medium text-lg">Toilet</li>
                  <li className="flex items-center gap-3 text-gray-800 font-medium text-lg">Musholla</li>
                </ul>
              </div>
              <div className="mt-12">
                <button onClick={() => document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth'})} className="w-full bg-[#1E3A8A] text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition text-lg shadow-lg">
                  Pilih Jadwal
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="booking-section" className="flex flex-col items-center">
          <h2 className="text-[#36499C] text-2xl font-bold uppercase tracking-wide mb-6">PILIH JADWAL</h2>
          <div className="bg-[#1D77E6] p-4 rounded-2xl flex gap-4 overflow-x-auto w-full md:w-auto mb-12 no-scrollbar">
            {dates.map((item, index) => (
              <button key={index} onClick={() => setSelectedDateIndex(index)} className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl flex-shrink-0 transition-all duration-200 ${selectedDateIndex === index ? 'bg-[#FF0000] text-white shadow-lg scale-105' : 'bg-[#101E5A] text-white hover:bg-[#162a7a] opacity-80'}`}>
                <span className="text-lg font-medium">{item.day}</span>
                <span className="text-xl font-bold">{item.dateLabel}</span>
              </button>
            ))}
          </div>

          <h2 className="text-[#36499C] text-2xl font-bold uppercase tracking-wide mb-6">JADWAL TERSEDIA</h2>
          
          <div className="bg-[#1D77E6] p-8 rounded-3xl w-full max-w-4xl shadow-2xl">
            <div className="flex justify-center gap-8 mb-8 text-white font-medium">
               <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-white"></div> Available</div>
               <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#1E3A8A]"></div> Selected</div>
               <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-[#FF0000]"></div> Booked</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {timeSlots.map((slot) => {
                let styleClass = "bg-white text-black hover:bg-gray-100";
                if (slot.status === 'booked') styleClass = "bg-[#FF0000] text-white cursor-not-allowed";
                if (selectedTimeSlot === slot.id) styleClass = "bg-[#1E3A8A] text-white ring-2 ring-white";
                return (
                  <button 
                    key={slot.id} 
                    disabled={slot.status === 'booked'} 
                    onClick={() => setSelectedTimeSlot(slot.id === selectedTimeSlot ? null : slot.id)} 
                    className={`py-4 rounded-xl font-bold text-center transition-all duration-200 ${styleClass}`}
                  >
                    <div className="text-sm font-normal mb-1">1 Jam</div>
                    <div className="text-lg">{slot.time}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleConfirmClick} 
                className="bg-white text-[#1D77E6] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>

      </main>
      <Footer />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-[#1D77E6] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center pt-8 pb-4">
              <h3 className="text-3xl font-bold text-white tracking-wide">Jadwal Dipilih</h3>
              <div className="w-full h-0.5 bg-white/30 mt-4"></div>
            </div>
            <div className="px-8 py-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <p className="text-xl text-gray-800 font-medium mb-2">{getSelectedDateLabel()}</p>
                <p className="text-xl text-gray-800 font-medium">1 jam ({getSelectedTimeLabel().replace('-', ' - ')})</p>
              </div>
            </div>
            <div className="px-8 pb-8 flex justify-center">
              <button onClick={handleFinalBooking} className="bg-white text-[#1D77E6] text-lg font-bold py-3 px-12 rounded-xl shadow-lg hover:bg-gray-100 transition transform active:scale-95">
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3. UPDATED SPORT ICON COMPONENT ---
const SportIcon = ({ type }) => {
  let iconSrc = null;

  switch (type) {
    case "Futsal":
      iconSrc = iconFutsal;
      break;
    case "Basketball":
      iconSrc = iconBasket;
      break;
    case "Volleyball":
      iconSrc = iconVoli;
      break;
    case "Badminton":
      iconSrc = iconBadminton;
      break;
    default:
      return null;
  }

  return (
    <img 
      src={iconSrc} 
      alt={type} 
      className="w-6 h-6 object-contain rounded-full shadow-sm border border-gray-200 bg-white"
    />
  );
};

// --- FACILITY ICONS (Kept as SVGs) ---
const FacilityIcon = ({ type }) => {
  if (type === "car") return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 0a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2m-8 0V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 9v2m6-2v2" /></svg>;
  if (type === "motor") return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
  if (type === "drink") return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
  if (type === "toilet") return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
  if (type === "mosque") return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>;
  return null;
};