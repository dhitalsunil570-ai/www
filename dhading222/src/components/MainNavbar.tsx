import React, { useState } from 'react';
import { Menu, X, Phone, HeartPulse, UserCheck, ShieldAlert, Calendar, ChevronDown, Facebook, Youtube, Instagram } from 'lucide-react';
import { WebSettings } from '../types';

interface MainNavbarProps {
  settings: WebSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookClick: () => void;
  onAdminClick: () => void;
  onNavigateSub?: (tab: string, subTabId: string) => void;
  categories?: string[];
}

export default function MainNavbar({
  settings,
  activeTab,
  setActiveTab,
  onBookClick,
  onAdminClick,
  onNavigateSub,
  categories
}: MainNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Split name for visual styling mirroring premium multi-line layout
  const rawName = settings.webName || "Dhading Hospital Pvt. Ltd.";
  const words = rawName.toUpperCase().split(" ");
  const firstWord = words[0] || "DHADING";
  const restOfName = words.slice(1).join(" ") || "HOSPITAL PVT. LTD.";

  // Dual Nepali subtitle based on name
  const isDhading = rawName.toLowerCase().includes("dhading");
  const nepaliTitle = isDhading ? "धादिङ हस्पिटल प्रा. लि." : "हस्पिटल प्रा. लि.";

  const menuItems = [
    { id: 'home', label: 'Home' },
    { 
      id: 'services', 
      label: 'Services',
      dropdownItems: [
        { subId: 'opd', label: 'OPD Services' },
        { subId: 'ipd', label: 'IPD Services' },
        { subId: 'emergency', label: 'Emergency Care 24/7' },
        { subId: 'labPathology', label: 'Lab & Pathology' },
        { subId: 'radiology', label: 'Radiology Services' },
        { subId: 'cashReception', label: 'Cash & Reception' },
        { subId: 'pharmacy', label: 'In-Hospital Pharmacy' },
        { subId: 'ambulance', label: 'Ambulance Services' },
        { subId: 'preventiveHealth', label: 'Preventive Health Packages' }
      ]
    },
    { 
      id: 'doctors', 
      label: 'Doctors',
      dropdownItems: [
        { subId: 'All Department Specials', label: 'All Department Specialists' },
        ...(categories || []).slice(0, 10).map((cat) => ({
          subId: cat,
          label: cat.length > 28 ? cat.substring(0, 28) + '...' : cat
        }))
      ]
    },
    { 
      id: 'about', 
      label: 'About Dhading Hospital',
      dropdownItems: [
        { subId: 'about-intro', label: 'Introduction to Dhading Hospital' },
        { subId: 'about-board', label: 'Board of Directors' },
        { subId: 'about-chairman', label: 'Chairman Message' },
        { subId: 'about-medical-director', label: 'Medical Director Info' },
        { subId: 'about-account-manager', label: 'Account Manager Info' },
        { subId: 'about-reception', label: 'Reception Info' },
        { subId: 'about-team', label: 'Working Team Directory' },
        { subId: 'about-meet-doctor', label: 'Meet Our Doctor' },
        { subId: 'about-careers', label: 'Careers & Opportunities' }
      ]
    },
    { 
      id: 'patient', 
      label: 'For Patient',
      dropdownItems: [
        { subId: 'patient-admission', label: 'Admission Desk Instructions' },
        { subId: 'patient-appointment', label: 'Appointment Guidelines & Bookings' }
      ]
    },
    { 
      id: 'visitors', 
      label: 'For Visitor',
      dropdownItems: [
        { subId: 'visitor-hours', label: 'Visiting Hour Schedules' },
        { subId: 'visitor-rules', label: 'Rules & Regulations' },
        { subId: 'visitor-parking', label: 'Parking & Ambulance Layouts' }
      ]
    },
    { id: 'news', label: 'News & Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'machines', label: 'Machine Gallery' },
    { id: 'price-list', label: 'Price List' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const handleDropdownClick = (tabId: string, subId: string) => {
    if (onNavigateSub) {
      onNavigateSub(tabId, subId);
    } else {
      setActiveTab(tabId);
    }
    setMobileOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-md relative z-30">
      {/* Top green helper-bar */}
      <div className="bg-[#006830] text-white py-2 text-xs md:text-sm px-4 md:px-8 flex justify-between items-center sm:flex-row flex-col gap-2">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="flex items-center gap-1">
            <Phone className="size-3.5" />
            24/7 Hotline: {settings.number || "+977-10-520111"}
          </span>
          <span className="opacity-80">|</span>
          <span className="flex items-center gap-1 text-center sm:text-left">
            <ShieldAlert className="size-3.5 text-yellow-300 animate-pulse" />
            Emergency Services Standby
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2.5 bg-black/10 px-2 py-0.5 rounded-md">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 hover:text-blue-300 text-white transition-colors hover:scale-110 duration-150 inline-flex"
              title="Official Facebook page"
            >
              <Facebook className="size-3.5 sm:size-4 fill-current text-white" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 hover:text-red-400 text-white transition-colors hover:scale-110 duration-150 inline-flex"
              title="Official Youtube channel"
            >
              <Youtube className="size-3.5 sm:size-4 text-white fill-current" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 hover:text-pink-400 text-white transition-colors hover:scale-110 duration-150 inline-flex"
              title="Official Instagram feed"
            >
              <Instagram className="size-3.5 sm:size-4 text-white" />
            </a>
          </div>

          <button 
            type="button" 
            onClick={onAdminClick}
            className="text-xs bg-white/20 px-2.5 py-1 rounded inline-flex items-center gap-1 hover:bg-white/30 transition-all font-medium text-white cursor-pointer"
          >
            <UserCheck className="size-3" /> Secure Admin Access
          </button>
        </div>
      </div>

      {/* Top Header Row with Logo, ISO certification, and Direct Actions */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center bg-white border-b border-gray-100">
        {/* Left Side: Logo & ISO Certification Indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          >
            {/* Horizontal Widescreen Logo Image or Custom Leaf-Cross Graphic Box */}
            {settings.logoUrl ? (
              <div className="h-12 sm:h-16 flex items-center transition-transform duration-200">
                <img 
                  src={settings.logoUrl} 
                  alt={settings.webName || "Hospital Logo"} 
                  referrerPolicy="no-referrer"
                  className="h-full w-auto max-w-[220px] sm:max-w-[320px] object-contain object-left animate-fade-in"
                />
              </div>
            ) : (
              /* Premium Horizontal Brand Box if logo url is not provided yet */
              <div className="flex items-center gap-2.5 border-2 border-dashed border-[#00A64C]/35 bg-[#00A64C]/5 px-3 py-2 rounded-xl h-14 sm:h-16 min-w-[200px] sm:min-w-[280px] transition-all hover:bg-[#00A64C]/10 hover:border-[#00A64C]/50 select-none">
                <div className="shrink-0 flex items-center justify-center">
                  <svg className="size-8 sm:size-10" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Left leaf wing in primary theme green */}
                    <path d="M24 12C12 18 8 32 14 44C16 48 20 50 24 52C20 44 20 32 24 24C26 20 28 16 24 12Z" fill="#00A64C" />
                    {/* Right leaf wing in deep medical green */}
                    <path d="M40 12C52 18 56 32 50 44C48 48 44 50 40 52C44 44 44 32 40 24C38 20 36 16 40 12Z" fill="#006830" />
                    {/* Central medical cross block (no background circles) */}
                    <rect x="29" y="15" width="6" height="34" rx="1.5" fill="#00A64C" />
                    <rect x="15" y="29" width="34" height="6" rx="1.5" fill="#00A64C" />
                    {/* Center crisp white accent dot */}
                    <circle cx="32" cy="32" r="3.5" fill="white" />
                  </svg>
                </div>
                <div className="flex flex-col justify-center leading-none text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[13px] sm:text-[16px] font-black tracking-tight text-[#006830] uppercase">
                      {firstWord}
                    </span>
                    <span className="text-[#00A64C] font-extrabold text-[10px] sm:text-[12px] tracking-normal uppercase">
                      HOSPITAL
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-sans font-bold text-gray-500 tracking-wider block mt-0.5 uppercase">
                    {nepaliTitle}
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-[#006830]/75 font-semibold uppercase mt-0.5 tracking-tight">
                    Custom logo can be set in settings
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Vertical Separator (Only on sm+) - Clean GCH spacing */}
          <div className="hidden sm:block h-10 w-[1.5px] bg-slate-200 mx-3"></div>

          {/* ISO 9001-2015 Certification Label matching Green City exactly */}
          <div className="hidden sm:block text-[10px] sm:text-[11px] font-black uppercase text-slate-700 tracking-wider max-w-[160px] sm:max-w-[220px] leading-tight select-none">
            ISO 9001-2015 CERTIFIED HOSPITAL
          </div>

          {/* Mobile Burger Button - Shows adjacent to logo */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Right Side: Support Calls */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          {/* Support call assistance info block */}
          <div className="text-right flex flex-col justify-center">
            <span className="text-[11px] font-black text-rose-500 uppercase tracking-wider block leading-none">How Can We Help?</span>
            <a 
              href={`tel:${settings.number || "+977-10-520111"}`}
              className="text-base font-black text-slate-900 hover:text-[#00A64C] transition-colors flex items-center justify-end gap-1.5 font-mono mt-1"
            >
              <Phone className="size-4 text-emerald-600 fill-current" />
              {settings.number || "+977-10-520111"}
            </a>
          </div>
        </div>
      </div>

      {/* Modern Horizontal Navigation Bar below upper row (Full Grid Space) */}
      <div className="hidden lg:block bg-[#00A64C] shadow-inner select-none transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center h-[52px]">
          {/* Menu items array */}
          <nav className="flex items-center h-full">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              
              if (item.dropdownItems) {
                return (
                  <div key={item.id} className="relative group h-full flex items-center">
                    <button
                      onClick={() => handleNav(item.id)}
                      className={`h-full px-4 text-xs xl:text-[13px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-[#004D23] text-white border-b-4 border-yellow-300'
                          : 'text-white/95 hover:text-white hover:bg-[#006830]'
                      }`}
                    >
                      {item.label === 'About Dhading Hospital' ? 'About Hospital' : item.label}
                      <ChevronDown className="size-3.5 opacity-80" />
                    </button>
                    
                    {/* Dropdown container */}
                    <div className="absolute left-0 top-full mt-0 w-64 bg-white border border-gray-150 rounded-b-2xl shadow-2xl py-3.5 invisible opacity-0 translate-y-3 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50 text-slate-800">
                      <div className="px-4 pb-2 border-b mb-1 border-slate-100 text-[10px] uppercase font-black text-[#00A64C] select-none tracking-widest font-mono">
                        ★ {item.label}
                      </div>
                      {item.dropdownItems.map((subItem) => (
                        <button
                          key={subItem.subId}
                          onClick={() => handleDropdownClick(item.id, subItem.subId)}
                          className="w-full text-left px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#00A64C]/10 hover:text-[#006830] transition-colors flex items-center justify-between"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`h-full px-4 text-xs xl:text-[13px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#004D23] text-white border-b-4 border-yellow-300'
                      : 'text-white/95 hover:text-white hover:bg-[#006830]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Slot Booking Button */}
          <button
            onClick={onBookClick}
            className="bg-[#006830] hover:bg-[#004D23] text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="size-3.5" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto px-4 py-4 animate-in fade-in-0 duration-200">
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => {
              if (item.dropdownItems) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => handleNav(item.id)}
                      className={`w-full text-left px-4 py-3 rounded-md text-base font-medium flex justify-between items-center ${
                        activeTab === item.id
                          ? 'bg-[#00A64C]/10 text-[#006830] font-bold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#00A64C]'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className="size-4" />
                    </button>
                    <div className="pl-6 border-l border-gray-100 flex flex-col gap-1 py-1">
                      {item.dropdownItems.map((subItem) => (
                        <button
                          key={subItem.subId}
                          onClick={() => handleDropdownClick(item.id, subItem.subId)}
                          className="text-left py-2 px-3 text-xs font-bold text-gray-500 hover:text-[#006830] rounded-md hover:bg-slate-50 transition-colors"
                        >
                          • {subItem.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-left px-4 py-3 rounded-md text-base font-medium ${
                    activeTab === item.id
                      ? 'bg-[#00A64C]/10 text-[#006830] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#00A64C]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onBookClick();
                }}
                className="w-full bg-[#00A64C] text-white text-center font-bold py-3 px-4 rounded-lg shadow-sm inline-flex justify-center items-center gap-2 cursor-pointer"
              >
                <Calendar className="size-5" /> Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
