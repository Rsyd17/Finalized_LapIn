import React, { useRef, useState } from 'react';

// --- 1. IMPORT ASSETS ---
import gal1 from '../../assets/galeri_1.jpeg';
import gal2 from '../../assets/galeri_2.jpeg';
import gal3 from '../../assets/galeri_3.png';
import gal4 from '../../assets/galeri_4.png';
import gal5 from '../../assets/galeri_5.png';
import gal6 from '../../assets/galeri_6.png';
import gal7 from '../../assets/galeri_7.png';
import gal8 from '../../assets/galeri_8.png';

export const Gallery = () => {
  // --- DRAG LOGIC (Preserved) ---
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // --- 2. USE IMPORTED IMAGES ---
  const images = [
    gal1,
    gal2,
    gal3,
    gal4,
    gal5,
    gal6,
    gal7,
    gal8
  ];

  return (
    <section className="py-8 px-6 md:px-12 bg-[#F9FAFB]">
      
      {/* --- NEW HEADER ADDED HERE --- */}
      <h2 className="text-center text-[#36499C] text-3xl md:text-4xl font-bold uppercase tracking-wide mb-8 font-bebas select-none">
        Gallery Sport Center
      </h2>

      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`
          flex flex-nowrap gap-6 overflow-x-auto no-scrollbar pb-4
          ${isDragging ? 'cursor-grabbing scroll-auto snap-none' : 'cursor-grab scroll-smooth snap-x'}
        `}
      >
        {images.map((src, index) => (
          <div 
            key={index} 
            className="min-w-[300px] h-[200px] md:min-w-[350px] md:h-[240px] rounded-3xl overflow-hidden shadow-md flex-shrink-0 select-none snap-center hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={src} 
              alt={`Gallery ${index}`} 
              className="w-full h-full object-cover pointer-events-none" 
            />
          </div>
        ))}
      </div>
    </section>
  );
};