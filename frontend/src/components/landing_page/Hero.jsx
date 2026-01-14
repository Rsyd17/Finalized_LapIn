import React from 'react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src="./src/assets/lap_a.webp"  className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10 max-w-5xl px-6 text-center text-white mt-10">
        
        {/* TITLE: Using Bebas Neue */}
        <h1 className="text-8xl md:text-[10rem] font-bebas tracking-wide mb-6 uppercase leading-none">
          LapIn
        </h1>
        
        {/* DESCRIPTION: Using Roboto */}
        <p className="text-lg md:text-xl font-roboto leading-relaxed text-gray-200 mb-12 max-w-4xl mx-auto font-light">
          LapIn (Lapangan Instan) adalah sebuah platform yang mempermudah proses pemesanan lapangan 
          olahraga kampus secara cepat dan efisien. Pengguna hanya perlu membuka website, memilih lapangan, 
          serta menentukan jadwal sesuai kebutuhan. Dengan Lapin, proses pemesanan menjadi lebih teratur,
          praktis, dan bebas dari kendala perubahan jadwal.
        </p>

        {/* BUTTON: Using Roboto */}
        <Link 
          to="/login" 
          className="inline-block font-roboto bg-white text-slate-900 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors shadow-lg  tracking-wide"
        >
          Booking Sekarang
        </Link>
        
      </div>
    </section>
  );
};