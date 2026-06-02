import React, { useState, useEffect } from 'react';
import { X, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  newsItem: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsDetailModal({
  newsItem,
  isOpen,
  onClose
}: NewsDetailModalProps) {
  const [activePhoto, setActivePhoto] = useState<string>('');

  // Sync active photo when newsItem changes or opens
  useEffect(() => {
    if (newsItem) {
      setActivePhoto(newsItem.imageUrl);
    }
  }, [newsItem]);

  if (!isOpen || !newsItem) return null;

  // Combine cover image with additional photos
  const allPhotos = [
    newsItem.imageUrl,
    ...(newsItem.images || [])
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity cursor-pointer animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[90vh] md:max-h-[85vh] animate-scale-up">
        
        {/* Header Ribbon & Close Bar */}
        <div className="bg-[#006830] text-emerald-50 px-6 py-4 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 animate-pulse text-[#00C56A]" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#00C56A]">
              Hospital Press Publication
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 text-white transition-all cursor-pointer"
            aria-label="Close details"
          >
            <X className="size-5 sm:size-6" />
          </button>
        </div>

        {/* Scrollable Layout */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 md:space-y-8 flex-1">
          
          {/* Metadata & Title */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-emerald-50 text-[#00A64C] text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                News Update
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                <Calendar className="size-4" />
                <span>Published: {newsItem.timeDate}</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
              {newsItem.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            
            {/* Left: Dynamic Multi-Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-gray-150 shadow-xs group">
                <img 
                  src={activePhoto} 
                  alt={newsItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                
                {allPhotos.length > 1 && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <ImageIcon className="size-3.5 text-emerald-400" />
                    <span>Photo {allPhotos.indexOf(activePhoto) + 1} of {allPhotos.length}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails list if there are multiple images */}
              {allPhotos.length > 1 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">
                    Gallery Views ({allPhotos.length} pictures):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {allPhotos.map((url, idx) => {
                      const isActive = url === activePhoto;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhoto(url)}
                          className={`size-14 sm:size-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-50 relative ${
                            isActive 
                              ? 'border-[#006830] ring-2 ring-emerald-100 scale-95 shadow-sm' 
                              : 'border-transparent hover:border-gray-300 hover:scale-102'
                          }`}
                        >
                          <img 
                            src={url} 
                            alt={`View ${idx + 1}`} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Detailed Description Scroll Area */}
            <div className="space-y-4">
              <div className="prose prose-slate max-w-none">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {newsItem.detail}
                </p>
              </div>

              <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex items-center gap-3">
                <div className="size-10 bg-emerald-50 text-[#00A64C] flex items-center justify-center rounded-xl shrink-0">
                  <span className="font-extrabold text-sm">H</span>
                </div>
                <div>
                  <h5 className="text-xs font-black text-[#006830]">Dhading Hospital Media Desk</h5>
                  <p className="text-[11px] text-gray-400 font-bold">For emergency media verification, contact hospital administration.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
