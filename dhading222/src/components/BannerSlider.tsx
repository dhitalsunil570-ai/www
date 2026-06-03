import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { WebBanner } from '../types';

interface BannerSliderProps {
  banners: WebBanner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) {
    return (
      <div className="relative w-full h-[360px] md:h-[500px] bg-[#006830] flex items-center justify-center text-white">
        <div className="text-center px-4">
          <Activity className="size-16 mx-auto mb-4 animate-spin text-green-300" />
          <h2 className="text-3xl font-bold">Dhading Hospital Services</h2>
          <p className="text-gray-200 mt-2">Compassionate multi-disciplinary digital healthcare</p>
        </div>
      </div>
    );
  }

  const current = banners[currentIndex];

  return (
    <div className="relative w-full h-[280px] sm:h-[400px] md:h-[600px] overflow-hidden bg-slate-900 group">
      {/* Dynamic Slide Background with parallax fade effect */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center">
        <img
          src={current.imageUrl || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80"}
          alt={current.title}
          className="w-full h-full object-contain opacity-90"
        />
        {/* Soft elegant bottom gradient to make centered text exceptionally crisp and readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>

      {/* Slide Captions - Centered for mobile, lower for desktop */}
      <div className="absolute inset-x-0 bottom-10 sm:bottom-20 md:bottom-24 z-10 px-4 text-center">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white uppercase drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] font-sans">
            {current.title}
          </h2>
          {current.subtitle && (
            <p className="text-sm sm:text-base md:text-xl text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans max-w-2xl mx-auto">
              {current.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#00A64C] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#00A64C] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-[#00A64C]' : 'w-2.5 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
