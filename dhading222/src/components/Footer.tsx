import React from 'react';
import { Mail, MapPin, Phone, Clock, ShieldCheck, HeartPulse, Facebook, Youtube, Instagram } from 'lucide-react';
import { ContactUsInfo, WebSettings } from '../types';

interface FooterProps {
  settings: WebSettings;
  contact: ContactUsInfo;
  onAdminClick: () => void;
  setActiveTab: (tab: string) => void;
}

export default function Footer({
  settings,
  contact,
  onAdminClick,
  setActiveTab
}: FooterProps) {
  return (
    <footer className="w-full bg-[#1e1e1e] text-[#f9fafb] border-t-4 border-[#00A64C] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Live Location Box & About Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#00A64C] p-2 rounded-full">
              <HeartPulse className="size-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {settings.webName || "Dhading Hospital"}
            </h3>
          </div>
          
          <p className="text-xs text-gray-400 leading-relaxed">
            {settings.seoDescription || "Compassionate medical services, state of the art ICU units, pediatric, general surgery, ent and critical care setup in Dhading district with emergency services running 24/7."}
          </p>

          {/* Embedded Google Maps / Live Location Box */}
          <div className="w-full h-[180px] rounded-2xl overflow-hidden border border-gray-700/60 shadow-inner relative bg-zinc-900">
            <iframe 
              src={contact.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14101.401037599553!2d84.91891961621528!3d27.921822830605923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb00dcfbebe543%3A0xc3fa5e966c891398!2sDhading%20Besi!5e0!3m2!1sne!2snp!4v1654317602082"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dhading Hospital Map Location"
              className="absolute inset-0"
            />
          </div>

          <div className="bg-[#006830]/30 p-3.5 rounded-xl border border-[#00A64C]/20 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-[10px] uppercase font-extrabold text-[#00A64C] tracking-widest flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-500 animate-ping"></span>
                Emergency Ambulance
              </h4>
              <p className="text-base font-bold text-white font-mono">{contact.ambulancePhone || "9851000102"}</p>
            </div>
            <p className="text-[10px] text-gray-400 max-w-[180px] text-right">Ambulance is standby 24Hrs</p>
          </div>
        </div>

        {/* Right Column: 2-column split (Left: Quick Links, Right: Contacts & Actions) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 border-t lg:border-t-0 border-gray-800 pt-6 lg:pt-0">
          
          {/* Adha Left: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm uppercase font-bold text-[#00A64C] tracking-wider relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:bg-[#00A64C]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • Home Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • Our Services
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('doctors')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • Meet Our Doctors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • About Dhading Hospital
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('patient')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • For Patients
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('visitors')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • For Visitors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('news')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • News & Camp Events
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-[#00A64C] transition-colors cursor-pointer text-left py-0.5">
                  • Photo Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Adha Right: Contact Info & Admin login */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm uppercase font-bold text-[#00A64C] tracking-wider relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:bg-[#00A64C]">
                Get In Touch
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li className="flex gap-1.5 items-start">
                  <MapPin className="size-4 text-[#00A64C] shrink-0 mt-0.5" />
                  <span>{contact.address || "Dhading Besi, Dhading"}</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <Phone className="size-4 text-[#00A64C] shrink-0 mt-0.5" />
                  <span className="font-mono">{contact.phone || "+977-10-520111"}</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <Mail className="size-4 text-[#00A64C] shrink-0 mt-0.5" />
                  <span className="break-all">{contact.email || "info@dhadinghospital.com.np"}</span>
                </li>
                <li className="flex gap-1.5 items-start">
                  <Clock className="size-4 text-[#00A64C] shrink-0 mt-0.5" />
                  <span>{contact.workingHours || "Duty: 24/7"}</span>
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs">
              <button
                onClick={onAdminClick}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-[#2d2d2d] hover:bg-[#00A64C] hover:text-white text-gray-300 font-bold px-3 py-2 rounded-lg border border-gray-700 transition-all cursor-pointer shadow-sm text-center text-[10px]"
              >
                <ShieldCheck className="size-3.5 text-emerald-400" />
                Admin Panel Login
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 3-Column Social Medias Grid (Left, Middle, Right) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-10 border-t border-gray-800/80 space-y-4">
        <h4 className="text-xs font-black uppercase text-[#00A64C] tracking-widest text-center sm:text-left mb-6 font-mono">
          ★ OFFICIAL HOSPITAL SOCIAL MEDIA CHANNELS
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Facebook - Left Column */}
          <a 
            href={contact.facebookUrl || "https://facebook.com"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group bg-[#2a2a2a]/60 hover:bg-[#1877F2]/10 p-5 rounded-2xl border border-gray-800 hover:border-[#1877F2]/40 transition-all flex items-center gap-4 cursor-pointer"
          >
            <div className="size-12 rounded-2xl bg-blue-600/10 text-blue-500 group-hover:bg-[#1877F2] group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <Facebook className="size-6 fill-current" />
            </div>
            <div className="min-w-0 text-left">
              <h5 className="text-sm font-black text-white group-hover:text-blue-500 transition-colors">Facebook Community</h5>
              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed font-semibold">Join our Facebook channel for instant community notices.</p>
            </div>
          </a>

          {/* YouTube - Middle Column */}
          <a 
            href={contact.youtubeUrl || "https://youtube.com"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group bg-[#2a2a2a]/60 hover:bg-red-600/10 p-5 rounded-2xl border border-gray-800 hover:border-red-600/40 transition-all flex items-center gap-4 cursor-pointer"
          >
            <div className="size-12 rounded-2xl bg-red-600/10 text-red-500 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <Youtube className="size-6 fill-current" />
            </div>
            <div className="min-w-0 text-left">
              <h5 className="text-sm font-black text-white group-hover:text-red-500 transition-colors">YouTube Health Stream</h5>
              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed font-semibold">Watch interactive specialist webinars and camp highlights.</p>
            </div>
          </a>

          {/* Instagram - Right Column */}
          <a 
            href={contact.instagramUrl || "https://instagram.com"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group bg-[#2a2a2a]/60 hover:bg-pink-600/10 p-5 rounded-2xl border border-gray-800 hover:border-pink-600/40 transition-all flex items-center gap-4 cursor-pointer"
          >
            <div className="size-12 rounded-2xl bg-pink-600/10 text-pink-500 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <Instagram className="size-6 font-bold" />
            </div>
            <div className="min-w-0 text-left">
              <h5 className="text-sm font-black text-white group-hover:text-pink-500 transition-colors">Instagram Desk</h5>
              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed font-semibold font-sans">Follow our clinical snapshots, machinery, and daily operations.</p>
            </div>
          </a>
        </div>
      </div>

      {/* Copy and Credits Info */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-gray-800 flex justify-between items-center sm:flex-row flex-col gap-4 text-xs text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} <strong className="text-gray-300 font-bold">{settings.webName || "Dhading Hospital Pvt. Ltd."}</strong>. All Rights Reserved.
        </div>
        <div>
          Engineered for <span className="text-gray-300 font-semibold">Compassionate Clinical Delivery</span>. ISO Certified diagnostics.
        </div>
      </div>
    </footer>
  );
}
