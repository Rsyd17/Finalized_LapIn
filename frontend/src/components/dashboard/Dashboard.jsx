import React from 'react';
import { DashNavbar } from './DashNavbar';
import { DashHero } from './DashHero';
import { CourtsList } from './CourtsList';
import { Schedule } from './Schedule';
import { Gallery } from './Gallery';
import { Testimonials } from './Testimonials';
import { Footer } from '../landing_page/Footer'; 

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <DashNavbar />
      <DashHero />
      <CourtsList />
      <Schedule />
      
      {/* 3. Black Divider Line */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <hr className="border-t-2 border-black my-8 opacity-20" />
      </div>

      {/* 4. New Sections */}
      <Gallery />
      <Testimonials />

      <Footer /> 

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};