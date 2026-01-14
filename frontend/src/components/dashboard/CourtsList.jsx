import React, { useRef, useState } from 'react';

// --- 1. IMPORT ASSETS ---
// Make sure these files exist in your assets folder
import lapA from '../../assets/lap_a.webp';
import lapB from '../../assets/lap_b.jpg';
import lapC from '../../assets/lap_c.jpg';
import bad1 from '../../assets/badminton1.jpg';
import bad2 from '../../assets/badminton2.jpg';

export const CourtsList = () => {
  // --- DRAG TO SCROLL LOGIC (Preserved) ---
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // --- 2. UPDATED DATA WITH LOCAL IMAGES ---
  const courtsList = [
    {
      id: 1,
      name: "Lapangan Utama A",
      desc: "Lapangan serbaguna untuk voli, basket, dan futsal dengan lantai anti-slip.",
      img: lapA
    },
    {
      id: 2,
      name: "Lapangan Utama B",
      desc: "Lapangan khusus untuk basket yang dilengkapi dengan area penonton.",
      img: lapB
    },
    {
      id: 3,
      name: "Lapangan Utama C",
      desc: "Lapangan modern untuk basket dan futsal yang dilengkapi pencahayaan LED.",
      img: lapC
    },
    {
      id: 4,
      name: "Lapangan Badminton 1",
      desc: "Lapangan badminton indoor dengan lantai vinyl hijau dan pencahayaan merata.",
      img: bad1
    },
    {
      id: 5,
      name: "Lapangan Badminton 2",
      desc: "Lapangan badminton standar internasional dengan karpet vinyl berkualitas.",
      img: bad2
    }
  ];

  return (
    <section className="py-10 bg-gray-50 overflow-hidden">
      
      {/* --- 3. HEADER: Changed to font-bebas --- */}
      <h3 className="text-center text-[#36499C] text-4xl font-bold uppercase tracking-wide mb-10 select-none font-bebas">
        Daftar Lapangan
      </h3>
      
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`
          flex flex-nowrap overflow-x-auto w-full px-6 md:px-12 gap-8 pb-8 no-scrollbar 
          ${isDragging ? 'cursor-grabbing scroll-auto snap-none' : 'cursor-grab scroll-smooth snap-x'}
        `}
      >
        
        {courtsList.map((court) => (
          <div 
            key={court.id} 
            className="min-w-[300px] md:min-w-[350px] bg-white rounded-2xl shadow-lg overflow-hidden snap-center flex-shrink-0 hover:-translate-y-2 transition-transform duration-300 select-none"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden pointer-events-none">
              <img src={court.img} alt={court.name} className="w-full h-full object-cover"/>
            </div>
            
            {/* Content */}
            <div className="p-6 text-center pointer-events-none">
              {/* --- 4. TITLE: Changed to font-oswald --- */}
              <h4 className="text-xl font-medium text-slate-800 mb-3 font-oswald tracking-wide">
                {court.name}
              </h4>
              
              {/* --- 5. DESCRIPTION: Changed to font-roboto --- */}
              <p className="text-sm text-gray-500 leading-relaxed font-roboto">
                {court.desc}
              </p>
            </div>
          </div>
        ))}

      </div>
      
      <div className="text-center text-gray-400 text-xs mt-2 md:hidden font-roboto">
        Geser untuk melihat lebih banyak →
      </div>
    </section>
  );
};