import React, { useState, useEffect } from 'react';

export const Schedule = () => {
  // --- STATE ---
  const [time, setTime] = useState(new Date());
  const [selectedCourtName, setSelectedCourtName] = useState("Lapangan Utama A");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // State to handle "See More" / "Back" toggle
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Store the booked slots from database
  const [bookedSlots, setBookedSlots] = useState([]);

  // --- MAPPING HELPERS ---
  const courtMapping = {
    "Lapangan Utama A": 1,
    "Lapangan Utama B": 2,
    "Lapangan Utama C": 3,
    "Lapangan Badminton 1": 4,
    "Lapangan Badminton 2": 5
  };

  const courtOptions = Object.keys(courtMapping);

  // --- CLOCK ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour12: false });
  };

// --- FETCH SCHEDULE FUNCTION ---
const fetchSchedule = async () => {
  const courtId = courtMapping[selectedCourtName];
  
  // FIX: Get local YYYY-MM-DD instead of UTC
  const offset = selectedDate.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(selectedDate - offset)).toISOString().split('T')[0];

  try {
    const response = await fetch(`http://localhost:5000/api/schedule?courtId=${courtId}&date=${localISOTime}`);
    const data = await response.json();
    setBookedSlots(data);
  } catch (error) {
    console.error("Error loading schedule:", error);
  }
};

// --- FETCH ON COURT/DATE CHANGE ---
useEffect(() => {
  fetchSchedule();
}, [selectedCourtName, selectedDate]);

// --- AUTO REFRESH EVERY 10 SECONDS ---
useEffect(() => {
  const interval = setInterval(() => {
    fetchSchedule();
  }, 10000); // Refresh setiap 10 detik

  return () => clearInterval(interval);
}, [selectedCourtName, selectedDate]);

  // --- GENERATE LIST ---
  const generateScheduleList = () => {
    const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    
    return hours.map(hour => {
      const start = `${hour < 10 ? '0' + hour : hour}:00`;
      const end = `${(hour + 1) < 10 ? '0' + (hour + 1) : (hour + 1)}:00`;
      const timeLabel = `${start} - ${end}`;
      
      const isBooked = bookedSlots.some(booking => booking.start_time.startsWith(start));

      return {
        time: timeLabel,
        status: isBooked ? "Dipesan" : "Tersedia",
        color: isBooked ? "red" : "green"
      };
    });
  };

  const fullScheduleData = generateScheduleList();
  const visibleSchedule = isExpanded ? fullScheduleData : fullScheduleData.slice(0, 5);

  // --- CALENDAR FUNCTIONS ---
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const isDateSelected = (day) => {
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth.getMonth() &&
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           today.getMonth() === currentMonth.getMonth() &&
           today.getFullYear() === currentMonth.getFullYear();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            aspect-square flex items-center justify-center text-sm font-semibold rounded-lg transition
            ${isDateSelected(day) 
              ? 'bg-[#1D77E6] text-white shadow-lg' 
              : isToday(day)
              ? 'bg-gray-200 text-black'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <section className="bg-[#F9FAFB] py-12 px-4 md:px-8 relative z-10">
      
      <h2 className="text-center text-[#36499C] text-3xl md:text-4xl font-bold uppercase tracking-wide mb-6 select-none font-bebas">
        JADWAL REAL-TIME
      </h2>

      {/* TOP INFO ROW */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-20 mb-10 text-black">
        <div className="flex items-center gap-2 md:gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8 text-[#36499C]"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          <span className="text-lg md:text-xl font-medium">
             {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 md:gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8 text-[#36499C]"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-9 0h9" /></svg>
           <span className="text-lg md:text-xl font-semibold text-[#36499C]">Lapangan</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8 text-[#36499C]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-lg md:text-xl font-medium">{formatTime(time)}</span>
        </div>
      </div>

      {/* DROPDOWN */}
      <div className="flex justify-center mb-12 relative z-20">
        <div className="relative w-56 md:w-64">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-[#1D77E6] rounded-xl py-3 px-4 flex justify-between items-center text-slate-800 font-semibold shadow-md hover:shadow-lg transition duration-300">
            <span className="text-sm md:text-base">{selectedCourtName}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform duration-300 text-[#1D77E6] ${isDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border-2 border-[#1D77E6] mt-2 rounded-xl shadow-2xl overflow-hidden z-50">
              {courtOptions.map((option, index) => (
                <div key={index} onClick={() => { setSelectedCourtName(option); setIsDropdownOpen(false); }} className="px-4 py-3 hover:bg-blue-100 hover:text-[#1D77E6] cursor-pointer text-slate-700 text-sm font-medium border-b border-gray-100 last:border-0 transition duration-200">{option}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT (TWO COLUMNS) */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 lg:gap-8 max-w-6xl mx-auto">
        
        {/* CALENDAR WIDGET */}
        <div className="hidden lg:flex flex-col bg-white rounded-2xl shadow-xl p-7 w-full lg:w-96">
          {/* CALENDAR HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">{getMonthYear(currentMonth)}</h3>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-blue-100 rounded-lg transition duration-200"
                title="Bulan sebelumnya"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-[#1D77E6]"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-blue-100 rounded-lg transition duration-200"
                title="Bulan berikutnya"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-[#1D77E6]"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5L15.75 12l-7.5 7.5" /></svg>
              </button>
            </div>
          </div>

          {/* WEEKDAYS */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
              <div key={day} className="text-center text-xs md:text-sm font-bold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* CALENDAR DAYS */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>

        {/* SCHEDULE LIST */}
        <div className="w-full lg:flex-1 max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            
            <div className="bg-gradient-to-r from-[#1D77E6] to-[#1a5fbf] text-white text-center py-7 flex-shrink-0">
              <h3 className="text-xl md:text-2xl font-bold">Jadwal</h3>
              <p className="text-sm md:text-base opacity-90 mt-2">
                {selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* HEADER ALIGNMENT */}
            <div className="flex justify-between px-6 md:px-8 py-5 border-b-2 border-gray-100 flex-shrink-0 bg-gray-50">
              <h4 className="text-lg font-bold text-gray-800">Waktu</h4>
              <h4 className="text-lg font-bold text-gray-800 text-center">Status</h4>
            </div>

            <div className="flex-grow overflow-y-auto">
              {visibleSchedule.length > 0 ? (
                visibleSchedule.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-6 md:px-8 py-4 hover:bg-blue-50 transition duration-200 border-b border-gray-100 last:border-0">
                    <span className="text-base md:text-lg font-semibold text-gray-800">{item.time}</span>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color === 'red' ? 'bg-red-500' : 'bg-green-500'} shadow-sm`}></div>
                      <span className={`text-base font-semibold ${item.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>{item.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <span>Tidak ada data jadwal</span>
                </div>
              )}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="p-6 md:p-7 flex-shrink-0 border-t-2 border-gray-100 bg-gray-50">
              {isExpanded ? (
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="flex items-center gap-2 text-gray-700 font-semibold hover:text-[#1D77E6] transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                  <span>Kembali</span>
                </button>
              ) : (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsExpanded(true)} 
                    className="bg-gradient-to-r from-[#1D77E6] to-[#1a5fbf] text-white font-semibold py-3 px-7 rounded-xl shadow-md hover:shadow-lg hover:to-blue-700 transition duration-300"
                  >
                    Lihat Selengkapnya
                  </button>
                </div>
              )}
            </div>
        </div>

      </div>
    </section>
  );
};