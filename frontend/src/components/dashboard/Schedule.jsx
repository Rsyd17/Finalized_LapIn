import React, { useState, useEffect } from 'react';

export const Schedule = () => {
  // --- STATE ---
  const [time, setTime] = useState(new Date());
  const [selectedCourtName, setSelectedCourtName] = useState("Lapangan Utama A");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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

  // --- FETCH SCHEDULE ---
  useEffect(() => {
    const fetchSchedule = async () => {
      const courtId = courtMapping[selectedCourtName];
      const today = new Date().toISOString().split('T')[0]; 

      try {
        const response = await fetch(`http://localhost:5000/api/schedule?courtId=${courtId}&date=${today}`);
        const data = await response.json();
        setBookedSlots(data);
      } catch (error) {
        console.error("Error loading schedule:", error);
      }
    };

    fetchSchedule();
  }, [selectedCourtName]);

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

  return (
    <section className="bg-[#F9FAFB] py-16 px-4 md:px-12 relative z-10">
      
      <h2 className="text-center text-[#36499C] text-4xl font-bold uppercase tracking-wide mb-10 select-none font-bebas">
        JADWAL REAL-TIME
      </h2>

      {/* TOP INFO ROW */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24 mb-8 text-black">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          <span className="text-2xl font-medium">
             {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-9 h-9"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-9 0h9" /></svg>
           <span className="text-2xl font-bold">Lapangan</span>
        </div>
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-2xl font-medium w-[120px]">{formatTime(time)}</span>
        </div>
      </div>

      {/* DROPDOWN */}
      <div className="flex justify-center mb-16 relative z-20">
        <div className="relative w-64">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 flex justify-between items-center text-slate-800 font-semibold shadow-sm hover:bg-gray-200 transition">
            {selectedCourtName}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-2 rounded-lg shadow-xl overflow-hidden">
              {courtOptions.map((option, index) => (
                <div key={index} onClick={() => { setSelectedCourtName(option); setIsDropdownOpen(false); }} className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 cursor-pointer text-slate-700 text-sm font-medium border-b border-gray-100 last:border-0">{option}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT (CENTERED) */}
      <div className="flex justify-center">
        
        {/* SCHEDULE LIST */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
            
            <div className="bg-[#1D77E6] text-white text-center py-8 flex-shrink-0">
              <h3 className="text-2xl font-bold">Jadwal</h3>
              <p className="text-lg opacity-90 mt-1">
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* HEADER ALIGNMENT */}
            <div className="flex justify-between px-10 py-6 border-b border-gray-100 flex-shrink-0">
              <h4 className="text-xl font-bold text-black">Waktu</h4>
              <div className="w-28">
                <h4 className="text-xl font-bold text-black">Status</h4>
              </div>
            </div>

            <div className="flex-grow">
              {visibleSchedule.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center px-10 py-4 hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                  <span className="text-lg font-medium text-black">{item.time}</span>
                  <div className="flex items-center gap-3 w-28">
                    <div className={`w-4 h-4 rounded-full ${item.color === 'red' ? 'bg-[#FF0000]' : 'bg-[#00FF00]'}`}></div>
                    <span className="text-lg font-medium text-black">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="p-8 flex-shrink-0 border-t border-gray-50">
              {isExpanded ? (
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="flex items-center gap-2 text-black font-semibold text-lg hover:text-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                  Kembali
                </button>
              ) : (
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsExpanded(true)} 
                    className="bg-[#1D77E6] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
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