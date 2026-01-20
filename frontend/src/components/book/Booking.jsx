import React from 'react'; 
import { Link } from 'react-router-dom'; 
import { DashNavbar } from '../dashboard/DashNavbar';
import { Footer } from '../landing_page/Footer';
import { courtsData } from '../../data/courtsData';

// --- 1. IMPORT ASSETS (IMAGES) ---
// Backgrounds
import raketBg from '../../assets/raket.jpg'; 

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

export const Booking = () => {

  // --- 2. MAP DATA TO NEW IMAGES ---
  // This ensures the data uses the imported images above based on ID
  const updatedCourtsData = courtsData.map(court => {
    let newImg = court.img;
    if (court.id === 1) newImg = lapA;
    if (court.id === 2) newImg = lapB;
    if (court.id === 3) newImg = lapC;
    if (court.id === 4) newImg = bad1;
    if (court.id === 5) newImg = bad2;
    return { ...court, img: newImg };
  });

  // --- FILTER DATA ---
  const courtsTop = updatedCourtsData.filter(c => c.id === 1 || c.id === 2);
  const courtBottom = updatedCourtsData.find(c => c.id === 3);
  const courtsBadminton = updatedCourtsData.filter(c => c.id === 4 || c.id === 5);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <DashNavbar />

      {/* HERO SECTION */}
      <div className="relative h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* UPDATED: Uses imported variable raketBg */}
          <img 
            src={raketBg} 
            className="w-full h-full object-cover"
            alt="Booking Banner"
          />
          <div className="absolute inset-0 bg-[#1E3A8A] opacity-60"></div>
        </div>
        
        {/* UPDATED: Added 'font-bebas' */}
        <h1 className="relative z-10 text-5xl md:text-6xl font-bold text-white uppercase tracking-wider text-center drop-shadow-lg font-bebas">
          Booking Lapanganmu
        </h1>
      </div>

      <main className="w-full">
        
        {/* MAIN COURT SECTION */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
          <h2 className="text-center text-[#36499C] text-4xl font-bold uppercase tracking-wide mb-10 select-none font-bebas">
            LAPANGAN UTAMA
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
            {courtsTop.map((court) => (
              <CourtCard key={court.id} data={court} />
            ))}
          </div>
          <div className="flex justify-center">
            {courtBottom && <CourtCard data={courtBottom} />}
          </div>
        </section>

        {/* SEPARATOR IMAGE */}
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=1600&auto=format&fit=crop" 
            alt="Separator - Shuttlecocks" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* BADMINTON COURT SECTION */}
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
          <h2 className="text-center text-[#36499C] text-4xl font-bold uppercase tracking-wide mb-10 select-none font-bebas">
            LAPANGAN BADMINTON
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {courtsBadminton.map((court) => (
              <CourtCard key={court.id} data={court} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

// =========================================================
// REUSABLE COMPONENTS
// =========================================================

const CourtCard = ({ data }) => {
  return (
    <Link 
      to={`/court/${data.id}`} 
      className="block w-full md:w-[500px]" 
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full">
        <div className="h-64 overflow-hidden relative">
          <img 
            src={data.img} 
            alt={data.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        <div className="p-8">
          {/* Added font-oswald to Court Name for consistency with previous pages (optional) */}
          <h3 className="text-2xl font-bold text-black mb-1 font-oswald">{data.name}</h3>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 font-roboto">Tersedia Untuk</p>
          <div className="flex items-end justify-between">
            <div className="flex gap-4">
              {data.sports.map((sport, index) => (
                <div key={index} className="flex flex-col items-center gap-1 group">
                  {/* Calls the updated SportIcon */}
                  <SportIcon type={sport} />
                  <span className="text-[10px] font-medium text-black group-hover:text-[#36499C] transition font-roboto">{sport}</span>
                </div>
              ))}
            </div>
            <div className="text-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
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
      // FIX: Changed 'object-cover' to 'object-contain' to prevent cropping.
      // OPTIONAL: You can remove 'rounded-full' if you want the original square shape.
      className="w-8 h-8 object-contain rounded-full shadow-sm border border-gray-200 bg-white"
    />
  );
};