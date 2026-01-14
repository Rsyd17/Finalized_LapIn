import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

export const FAQ = () => {
  const navigate = useNavigate(); // 2. Initialize the hook

  // State to track which question is currently open
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Gimana cara booking lapangan ?",
      answer: "Pertama, Anda wajib login ke akun Anda, lalu pilih menu \"Booking Sekarang\" dan tentukan jadwal yang Anda inginkan. Setelah memilih jadwal, Anda perlu mengunggah KRS untuk verifikasi. Terakhir, silakan tunggu konfirmasi pemesanan dari pihak Admin kami."
    },
    {
      question: "Syarat apa aja untuk sewa lapangan ?",
      answer: "Syarat untuk peminjaman :\n• Mahasiswa Aktif Universitas Gunadarma\n• Wajib menunjukkan Kartu Rencana Studi (KRS)"
    },
    {
      question: "Apa khusus untuk mahasiswa atau bisa umum ?",
      answer: "Peminjaman lapangan khusus untuk mahasiswa Universitas Gunadarma dan wajib memiliki Kartu Rencana Studi (KRS) sebagai syarat peminjaman."
    },
    {
      question: "Apakah saya bisa membatalkan atau mengubah jadwal booking yang sudah dikonfirmasi?",
      answer: "Mohon maaf, anda tidak dapat membatalkan booking yang sudah anda buat."
    },
    {
      question: "Berapa lama waktu setiap peminjaman lapangan ?",
      answer: "Setiap KRS dapat melakukan peminjaman lapangan selama 1 jam untuk satu lapangan."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-x-hidden">
      
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative">
        
        {/* 3. CHANGED: Link to Button with navigate(-1) */}
        <button 
          onClick={() => navigate(-1)} // This commands the browser to go back 1 page
          className="absolute top-10 left-6 md:left-10 text-slate-800 hover:text-slate-600 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-center text-[#333541] tracking-tight uppercase mb-16 mt-4 md:mt-0">
          Frequently Ask Questions
        </h1>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-12 items-start justify-center">
          
          {/* LEFT COLUMN: Accordion Items */}
          <div className="w-full md:w-1/2 space-y-4">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center p-6 text-left focus:outline-none"
                >
                  <span className="text-3xl font-light text-[#333541] mr-6">
                    {openIndex === index ? '−' : '+'}
                  </span>
                  <span className="text-lg font-semibold text-[#333541]">
                    {item.question}
                  </span>
                </button>

                <div 
                  className={`px-6 pl-14 pb-6 text-slate-600 leading-relaxed text-sm transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'block' : 'hidden'
                  }`}
                >
                  <p className="whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Illustration & Contact */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center mt-8 md:mt-0">
            <div className="relative w-64 h-64 mb-6">
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
                <path fill="#36499C" d="M45.7,-52.3C60.9,-39.7,76.1,-27.2,81.4,-11.9C86.7,3.4,82.1,21.5,71.5,35.9C60.9,50.3,44.3,61,27.1,65.8C9.9,70.6,-7.9,69.5,-23.4,63.1C-38.9,56.7,-52.1,45,-61.6,30.3C-71.1,15.6,-76.9,-2.1,-71.9,-16.9C-66.9,-31.7,-51.1,-43.6,-36.4,-56.4C-21.7,-69.2,-8.1,-82.9,3.2,-86.7C14.5,-90.5,29,-84.4,45.7,-52.3Z" transform="translate(100 100) scale(1.1)" stroke="black" strokeWidth="3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-8xl font-bold pt-4">?</span>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-black mb-2">Ada Pertanyaan?</h3>
            <p className="text-sm font-medium text-black">
              Silakan bertanya di Live Chat kami !
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};