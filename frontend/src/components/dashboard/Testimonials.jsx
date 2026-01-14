import React, { useRef, useState } from 'react';

// --- 1. IMPORT ASSETS ---
import bgTexture from '../../assets/lapangan_biru.jpg'; 

// Import Profile Pictures
import taniaImg from '../../assets/tania.png';
import aryaImg from '../../assets/arya.png';
import firasImg from '../../assets/firas.png';
import rasyadImg from '../../assets/rasyad.png';
import shivaImg from '../../assets/shiva.png';

export const Testimonials = () => {
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

  // --- 2. REVIEWS DATA ---
  const reviews = [
    {
      id: 1,
      name: "Tania ElMaja",
      role: "Juragan Ikan",
      text: "Dipikir-pikir website ini bagus dan membantu banget sih... Jadi gaperlu booking dulu ke H cuman untuk liat jadwal yang tersedia. Tapi kira-kira bisa ga ya dibikin app-nya juga? 🤔",
      img: taniaImg
    },
    {
      id: 2,
      name: "Raden Arya Kusumaneg",
      role: "Fans Blackpink",
      text: "Good job, saya sangat mendukung adanya website yang memudahkan pemakaian fasilitas kampus 👍 Admin LapIn ramah jadi kalau mau tanya-tanya jadwal langsung aja ke livechat.",
      img: aryaImg
    },
    {
      id: 3,
      name: "Firas Nunu",
      role: "Anak Kosan",
      text: "Semenjak ada website LapIn, booking lapangan di kampus jadi mudah banget! Apalagi buat anak kosan yang mager ke kampus cuman buat check lapangan yang available. Fiturnya oke dan adminnya ramah.",
      img: firasImg
    },
    {
      id: 4,
      name: "Rasyad Gaming",
      role: "Gamers",
      text: "Gokil, websitenya mudah dipakai dan lengkap fiturnya. Pasti yang develop website ini orang-orangnya kece abiezzzz.",
      img: rasyadImg
    },
    {
      id: 5,
      name: "Shiva Cihuy",
      role: "Bos Tambang",
      text: "Suka banget olahraga bareng temen-temen di sport center. Untung sekarang ada LapIn, jadi mau booking lapangan gaperlu ribet ke kampus lagi deh.",
      img: shivaImg
    }
  ];

  return (
    <section className="relative pt-20 pb-32 overflow-hidden text-white">
      
      {/* BACKGROUND IMAGE SETUP */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgTexture} 
          alt="Testimonial Background" 
          className="w-full h-full object-cover"
        />
        {/* Light Blue Overlay */}
        <div className="absolute inset-0 bg-blue-500/20"></div>
      </div>

      {/* --- PART 1: HEADER (Constrained Width) --- */}
      {/* Kept inside max-w-7xl so the text aligns with the Navbar/rest of page */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide font-bebas">
          APA KATA MEREKA?
        </h2>
        <p className="text-blue-50 text-lg mt-2 font-roboto">
          Lapangan Instan
        </p>
      </div>

      {/* --- PART 2: SLIDER LIST (Full Width) --- */}
      {/* Removed max-w-7xl here so it spans the whole screen */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`
          flex flex-nowrap gap-6 md:gap-8 overflow-x-auto no-scrollbar 
          w-full px-6 md:px-12 pb-8 relative z-20
          ${isDragging ? 'cursor-grabbing scroll-auto snap-none' : 'cursor-grab scroll-smooth snap-x'}
        `}
      >
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="w-[350px] md:w-[450px] h-[250px] md:h-[260px] bg-[#F1F1F1] rounded-3xl p-6 shadow-lg flex-shrink-0 snap-center select-none relative flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="flex items-center gap-4 relative z-10">
              <img 
                src={review.img} 
                alt={review.name} 
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm pointer-events-none"
              />
              <div>
                <h4 className="font-bold text-lg text-slate-900 leading-tight">{review.name}</h4>
                <p className="text-sm text-gray-500">{review.role}</p>
              </div>
            </div>
              
            {/* Quote Icon */}
            <div className="absolute top-5 right-5 text-6xl text-gray-400 opacity-50 font-serif leading-none">❞</div>

            {/* Text Body */}
            <div className="mt-4 flex-grow flex items-center w-full">
              <p className="text-gray-700 leading-relaxed text-sm md:text-[15px] font-medium w-full">
                {review.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
         <svg className="relative block w-full h-[40px] md:h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" opacity="0.3"></path>
             <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="white" opacity="0.5"></path>
         </svg>
      </div>

    </section>
  );
};