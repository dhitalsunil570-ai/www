import React, { useState, useEffect } from 'react';
import { 
  Building, Phone, Mail, MapPin, Clock, Stethoscope, HeartPulse, ShieldCheck, 
  ChevronRight, ChevronDown, Users, Eye, Image, Play, Key, Calendar, ArrowRight, ShieldAlert,
  Download, Sparkles, MessageCircle, Heart, ThumbsUp, Trash2, ArrowUpRight, Lock, Facebook, Twitter, Linkedin, X, Search, CheckCircle2
} from 'lucide-react';
import { Services, Doctor, AboutUs, ForPatient, ForVisitors, GalleryItem, VideoItem, NewsItem, PriceListItem, ContactUsInfo, WebSettings, BookingRequest, TestimonialItem, HospitalEventItem, QRCodeItem, MachineItem, Mailbox } from './types';
import { DETAILED_PRICE_LIST } from './priceListData';
import seedData from './seedData.json';
import { useFirebaseSync } from './useFirebaseSync';
const {
  categories: INITIAL_CATEGORIES = [],
  services: INITIAL_SERVICES = {},
  doctors: INITIAL_DOCTORS = [],
  aboutUs: INITIAL_ABOUT_US = {},
  patientData: INITIAL_FOR_PATIENT = [],
  visitorData: INITIAL_FOR_VISITORS = [],
  gallery: INITIAL_GALLERY = [],
  videos: INITIAL_VIDEOS = [],
  news: INITIAL_NEWS = [],
  priceList: INITIAL_PRICE_LIST = [],
  contact: INITIAL_CONTACT = {},
  settings: INITIAL_SETTINGS = { banners: [] },
  bookings: INITIAL_BOOKINGS = [],
  testimonials: INITIAL_TESTIMONIALS = [],
  events: INITIAL_EVENTS = [],
  machines: INITIAL_MACHINES = [],
  qrCodes: INITIAL_QR_CODES = []
} = seedData as any;
import { getWhatsAppLink, parseVideoEmbed, getYouTubeThumbnail } from './utils';
import MainNavbar from './components/MainNavbar';
import BannerSlider from './components/BannerSlider';
import InquiryModal from './components/InquiryModal';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import NewsDetailModal from './components/NewsDetailModal';

const daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timesList = [
  'Morning - 9 AM',
  'Morning - 10 AM to 2 PM',
  'Afternoon - 3 PM to 5 PM',
  'Evening - 6 PM to 8 PM',
  'Duty Consultant Hour'
];

export default function App() {
  // -------------------------------------------------------------
  // STATE MANAGEMENT WITH LOCAL PERSISTENCE
  // -------------------------------------------------------------
  const [mailboxes, setMailboxes] = useFirebaseSync<Mailbox[]>('mailboxes', []);
  const [passConfig, setPassConfig] = useFirebaseSync<any>('passConfig', { adminPassword: 'admin123', mailboxPassword: 'mail123' });

  // Firebase Real-time Sync
  const [categories, setCategories] = useFirebaseSync<string[]>('categories', INITIAL_CATEGORIES);
  const [services, setServices] = useFirebaseSync<Services>('services', INITIAL_SERVICES);
  const [doctors, setDoctors] = useFirebaseSync<Doctor[]>('doctors', INITIAL_DOCTORS);
  const [aboutUs, setAboutUs] = useFirebaseSync<AboutUs>('aboutUs', INITIAL_ABOUT_US);
  const [patientData, setPatientData] = useFirebaseSync<ForPatient>('patientData', INITIAL_FOR_PATIENT);
  const [visitorData, setVisitorData] = useFirebaseSync<ForVisitors>('visitorData', INITIAL_FOR_VISITORS);
  const [gallery, setGallery] = useFirebaseSync<GalleryItem[]>('gallery', INITIAL_GALLERY);
  const [videos, setVideos] = useFirebaseSync<VideoItem[]>('videos', INITIAL_VIDEOS);
  const [news, setNews] = useFirebaseSync<NewsItem[]>('news', INITIAL_NEWS);
  const [priceList, setPriceList] = useFirebaseSync<PriceListItem[]>('priceList', INITIAL_PRICE_LIST);
  const [contact, setContact] = useFirebaseSync<ContactUsInfo>('contact', INITIAL_CONTACT);
  const [settings, setSettings] = useFirebaseSync<WebSettings>('settings', INITIAL_SETTINGS);
  const [bookings, setBookings] = useFirebaseSync<BookingRequest[]>('bookings', INITIAL_BOOKINGS);
  const [testimonials, setTestimonials] = useFirebaseSync<TestimonialItem[]>('testimonials', INITIAL_TESTIMONIALS);
  const [events, setEvents] = useFirebaseSync<HospitalEventItem[]>('events', INITIAL_EVENTS);
  const [machines, setMachines] = useFirebaseSync<MachineItem[]>('machines', INITIAL_MACHINES);
  const [qrCodes, setQrCodes] = useFirebaseSync<QRCodeItem[]>('qrCodes', INITIAL_QR_CODES);
  
  // Local UI States (Not synced to Firebase)
  const [isAdminView, setIsAdminView] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const [selectedMachineDashboard, setSelectedMachineDashboard] = useState<MachineItem | null>(null);

  useEffect(() => {
    localStorage.setItem('dh_qr_codes', JSON.stringify(qrCodes));
  }, [qrCodes]);

  useEffect(() => {
    localStorage.setItem('dh_machines', JSON.stringify(machines));
  }, [machines]);

  // Prefill state for the online booking popup modal
  const [bookingPrefill, setBookingPrefill] = useState({
    dept: '',
    doc: '',
    day: 'Sunday',
    time: 'Morning - 9 AM'
  });

  // Admin Portal Secure Login States
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeServicesCategorySubTab, setActiveServicesCategorySubTab] = useState<keyof Services>('opd');
  const [selectedOpdDoctorCategory, setSelectedOpdDoctorCategory] = useState<string | null>(null);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string>('');
  const [isWelcomeExpanded, setIsWelcomeExpanded] = useState(false);
  const [priceSearchQuery, setPriceSearchQuery] = useState('');
  const [priceCurrentPage, setPriceCurrentPage] = useState(1);
  const [activeEventDetail, setActiveEventDetail] = useState<HospitalEventItem | null>(null);
  const [activeNewsDetail, setActiveNewsDetail] = useState<NewsItem | null>(null);
  const [featuredEventId, setFeaturedEventId] = useState<string>('');

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('dh_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('dh_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('dh_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('dh_about_us', JSON.stringify(aboutUs));
  }, [aboutUs]);

  useEffect(() => {
    localStorage.setItem('dh_patient', JSON.stringify(patientData));
  }, [patientData]);

  useEffect(() => {
    localStorage.setItem('dh_visitors', JSON.stringify(visitorData));
  }, [visitorData]);

  useEffect(() => {
    localStorage.setItem('dh_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('dh_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('dh_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('dh_price_list', JSON.stringify(priceList));
  }, [priceList]);

  useEffect(() => {
    localStorage.setItem('dh_contact', JSON.stringify(contact));
  }, [contact]);

  useEffect(() => {
    localStorage.setItem('dh_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dh_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('dh_pass_config', JSON.stringify(passConfig));
  }, [passConfig]);
  
  const passwordConfig = passConfig;

  // Reset selected OPD category when navigation tabs or services subtabs change
  useEffect(() => {
    setSelectedOpdDoctorCategory(null);
  }, [activeServicesCategorySubTab, activeTab]);

  useEffect(() => {
    localStorage.setItem('dh_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('dh_events', JSON.stringify(events));
  }, [events]);

  // Master database synchronizer (Fallback to local initial data if no backend)
  useEffect(() => {
    // Disabled for clean build
  }, []);


  // -------------------------------------------------------------
  // CONTROLLERS
  // -------------------------------------------------------------
  const handleAddBooking = async (request: BookingRequest) => {
    // 1. Optimistic UI update
    setBookings(prev => [request, ...prev]);
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = passwordConfig.password || '123321';
    const rescuePassword = passwordConfig.recoveryPassword || 'dhadingrecovery';

    if (adminPasswordInput === correctPassword || adminPasswordInput === rescuePassword) {
      setIsAdminView(true);
      setShowAdminLogin(false);
      setAdminPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('Invalid Passkey code. Please use the preset or recovery fallback!');
    }
  };


  // -------------------------------------------------------------
  // HOME PAGE DOCTOR BOOKING SELECTOR CONTROLLER
  // -------------------------------------------------------------
  const [quickDept, setQuickDept] = useState('');
  const [quickDoc, setQuickDoc] = useState('');
  const [quickDay, setQuickDay] = useState('');
  const [quickTime, setQuickTime] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const [testiIdx, setTestiIdx] = useState(0);

  const [filteredQuickDocs, setFilteredQuickDocs] = useState<Doctor[]>([]);

  // Meet Our Doctor Form Web Page section states
  const [meetDept, setMeetDept] = useState('');
  const [meetDocName, setMeetDocName] = useState('');
  const [meetDay, setMeetDay] = useState('Sunday');
  const [meetTime, setMeetTime] = useState('Morning - 10 AM to 2 PM');
  const [meetPatientName, setMeetPatientName] = useState('');
  const [meetEmail, setMeetEmail] = useState('');
  const [meetContact, setMeetContact] = useState('');
  const [meetWhatsapp, setMeetWhatsapp] = useState('');
  const [meetAddress, setMeetAddress] = useState('');
  const [meetMessage, setMeetMessage] = useState('');
  const [meetSuccessMsg, setMeetSuccessMsg] = useState(false);
  const [meetFilteredDocs, setMeetFilteredDocs] = useState<Doctor[]>([]);

  useEffect(() => {
    if (meetDept) {
      const filtered = doctors.filter(dr => dr.category === meetDept);
      setMeetFilteredDocs(filtered);
      if (filtered.length > 0) {
        setMeetDocName(filtered[0].name);
      } else {
        setMeetDocName('');
      }
    } else {
      setMeetFilteredDocs([]);
      setMeetDocName('');
    }
  }, [meetDept, doctors]);

  useEffect(() => {
    if (quickDept) {
      const filtered = doctors.filter(dr => dr.category === quickDept);
      setFilteredQuickDocs(filtered);
      if (filtered.length > 0) {
        setQuickDoc(filtered[0].name);
      }
    } else {
      setFilteredQuickDocs([]);
      setQuickDoc('');
    }
  }, [quickDept, doctors]);

  const handleQuickBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDept) return;
    
    // Set booking prefill values and open the high-quality popup modal
    setBookingPrefill({
      dept: quickDept,
      doc: quickDoc,
      day: quickDay || 'Sunday',
      time: quickTime || 'Morning - 9 AM'
    });
    setShowBookModal(true);
    
    // Reset Homepage widget form parameters
    setQuickDept('');
    setQuickDoc('');
    setQuickDay('');
    setQuickTime('');
    setQuickMessage('');
  };

  // Doctors category filter state
  const [selectedDoctorCategoryFilter, setSelectedDoctorCategoryFilter] = useState(categories[0] || "All Department Specials");


  // -------------------------------------------------------------
  // RENDER CONTROLLER
  // -------------------------------------------------------------
  if (isAdminView) {
    return (
      <AdminPanel
        categories={categories}
        setCategories={setCategories}
        services={services}
        setServices={setServices}
        doctors={doctors}
        setDoctors={setDoctors}
        aboutUs={aboutUs}
        setAboutUs={setAboutUs}
        patientData={patientData}
        setPatientData={setPatientData}
        visitorData={visitorData}
        setVisitorData={setVisitorData}
        gallery={gallery}
        setGallery={setGallery}
        videos={videos}
        setVideos={setVideos}
        news={news}
        setNews={setNews}
        priceList={priceList}
        setPriceList={setPriceList}
        contact={contact}
        setContact={setContact}
        settings={settings}
        setSettings={setSettings}
        bookings={bookings}
        setBookings={setBookings}
        testimonials={testimonials}
        setTestimonials={setTestimonials}
        events={events}
        setEvents={setEvents}
        passwordConfig={passwordConfig}
        setPasswordConfig={setPasswordConfig}
        qrCodes={qrCodes}
        setQrCodes={setQrCodes}
        machines={machines}
        setMachines={setMachines}
        mailboxes={mailboxes}
        setMailboxes={setMailboxes}
        onExit={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col justify-between pb-16 lg:pb-0">
      
      {/* 1) Dynamic Main Header Navbar */}
      <MainNavbar
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBookClick={() => setShowBookModal(true)}
        onAdminClick={() => setShowAdminLogin(true)}
        categories={categories}
        onNavigateSub={(tab, subTabId) => {
          setActiveTab(tab);
          if (tab === 'services') {
            setActiveServicesCategorySubTab(subTabId as keyof Services);
            setSelectedOpdDoctorCategory(null);
          } else if (tab === 'doctors') {
            setSelectedDoctorCategoryFilter(subTabId);
          } else {
            setTimeout(() => {
              const element = document.getElementById(subTabId);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }
        }}
      />

      {/* Main Portals staging */}
      <span className="block w-full">

        {/* Home Tab view */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-16">
            
            {/* Slideshow */}
            <BannerSlider banners={settings.banners} />

            {/* MOBILE ONLY SMART PORTAL QUICK ACCESS HUB */}
            <section className="lg:hidden px-4 -mt-8 relative z-20">
              <div className="bg-white rounded-3xl p-5 border border-emerald-600/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="size-4 text-[#00A64C] animate-spin" />
                      DHADING HOSPITAL SMART ACCESS
                    </h3>
                    <p className="text-[10px] text-gray-400 font-semibold leading-tight">Instant-response patient service & health links</p>
                  </div>
                  <span className="text-[9px] bg-red-100 text-red-600 font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                    On-Call Support
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      label: "Instant Book",
                      icon: <Calendar className="size-5" />,
                      action: () => setShowBookModal(true),
                      color: "text-emerald-700 bg-emerald-50 border-emerald-100/50"
                    },
                    {
                      label: "OPD Schedule",
                      icon: <Stethoscope className="size-5" />,
                      action: () => { 
                        setActiveTab('services'); 
                        setActiveServicesCategorySubTab('opd'); 
                        setSelectedOpdDoctorCategory(null); 
                      },
                      color: "text-teal-700 bg-teal-50 border-teal-100/50"
                    },
                     {
                      label: "Specialists",
                      icon: <Users className="size-5" />,
                      action: () => setActiveTab('doctors'),
                      color: "text-blue-700 bg-blue-50 border-blue-100/50"
                    },
                    {
                      label: "Official Rates",
                      icon: <Eye className="size-5" />,
                      action: () => setActiveTab('price-list'),
                      color: "text-violet-700 bg-violet-50 border-violet-100/50"
                    },
                    {
                      label: "Ambulance",
                      icon: <Phone className="size-5 text-red-600 animate-bounce" />,
                      href: `tel:${contact.ambulancePhone || "9851000102"}`,
                      color: "text-red-700 bg-red-50 border-red-100/50"
                    },
                    {
                      label: "WhatsApp",
                      icon: <MessageCircle className="size-5 fill-[#006830] text-emerald-50" />,
                      href: getWhatsAppLink(contact.whatsappNumber, "Dhading Hospital Helpdesk"),
                      color: "text-emerald-900 bg-emerald-100/40 border-emerald-200/50"
                    }
                  ].map((tile, idx) => {
                    const Element = tile.href ? 'a' : 'button';
                    return (
                      <Element
                        key={idx}
                        {...(tile.href ? { href: tile.href } : { onClick: tile.action })}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all hover:scale-102 active:scale-95 duration-200 cursor-pointer text-center space-y-1.5 h-[88px] shadow-xs ${tile.color}`}
                      >
                        <div className="p-1 px-2 bg-white rounded-lg shadow-xs flex items-center justify-center shrink-0">
                          {tile.icon}
                        </div>
                        <span className="text-[9px] leading-tight font-black tracking-tight text-slate-800 break-words w-full">
                          {tile.label}
                        </span>
                      </Element>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Meet Our Doctor Quick Booking Widget */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:-mt-16 mt-2 relative z-10">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-[#006830] flex items-center gap-1.5">
                      <Calendar className="size-6 text-[#00A64C]" />
                      Meet Our Specialist Doctor
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Select and reserve your slot instantly on our digital desk matrix Form.</p>
                  </div>
                  <span className="text-xs bg-[#00A64C] text-white font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                    Instant Schedule Service
                  </span>
                </div>

                <form onSubmit={handleQuickBookSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-end">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] sm:text-xs font-black uppercase text-gray-500">Pick Department</label>
                    <select
                      value={quickDept}
                      onChange={e => setQuickDept(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 text-xs px-3.5 py-3 rounded-xl focus:ring-2 focus:ring-[#00A64C]"
                      required
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] sm:text-xs font-black uppercase text-gray-500">Available Doctor</label>
                    <select
                      value={quickDoc}
                      onChange={e => setQuickDoc(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 text-xs px-3.5 py-3 rounded-xl focus:ring-2 focus:ring-[#00A64C]"
                      required
                      disabled={!quickDept}
                    >
                      <option value="">-- Allocated Doctor --</option>
                      {filteredQuickDocs.length > 0 ? (
                        filteredQuickDocs.map((dr) => (
                           <option key={dr.id} value={dr.name}>{dr.name}</option>
                        ))
                      ) : (
                        <option value="Specialist Duty Physician">Duty Specialist Officer (On-Call)</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] sm:text-xs font-black uppercase text-gray-500">Choose Day</label>
                    <select
                      value={quickDay}
                      onChange={e => setQuickDay(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 text-xs px-3.5 py-3 rounded-xl focus:ring-2 focus:ring-[#00A64C]"
                    >
                      <option value="Sunday">Sunday</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>

                  <div className="space-y-1 col-span-1">
                    <label className="text-[10px] sm:text-xs font-black uppercase text-gray-500">Time Range</label>
                    <select
                      value={quickTime}
                      onChange={e => setQuickTime(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 text-xs px-3.5 py-3 rounded-xl focus:ring-2 focus:ring-[#00A64C]"
                    >
                      <option value="Morning - 9 AM">Morning - 9 AM</option>
                      <option value="Morning - 10 AM to 2 PM">Morning - 10 AM to 2 PM</option>
                      <option value="Afternoon - 3 PM to 5 PM">Afternoon - 3 PM to 5 PM</option>
                      <option value="Evening - 6 PM to 8 PM">Evening - 6 PM to 8 PM</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="col-span-1 sm:col-span-2 lg:col-span-1 w-full bg-[#00A64C] hover:bg-[#006830] transition-colors py-3.5 px-4 rounded-xl text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-md inline-flex items-center justify-center gap-1.5"
                  >
                    Reserve Now <ArrowRight className="size-4" />
                  </button>
                </form>
              </div>
            </section>

            {/* Welcome to Dhading Hospital Intro & Chairman Message (Side-by-side) */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
              {/* Left Side: Welcome Content */}
              <div className="lg:col-span-2 space-y-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-150 shadow-xs">
                <span className="text-[#00A64C] uppercase text-[11px] tracking-widest font-black flex items-center gap-1.5 font-sans">
                  <Sparkles className="size-4 text-yellow-500 animate-spin" />
                  DURABLE ISO CLINICAL CARE STANDARDS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#006830] tracking-tight leading-tight">
                  {settings.welcomeTitle || "Welcome to Dhading Hospital"}
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-6 pt-2">
                  <img
                    src={settings.welcomeImage || "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"}
                    alt="Welcome Hospital view"
                    className="w-full sm:w-[240px] h-[200px] object-cover rounded-2xl border border-gray-200 shadow-sm shrink-0"
                  />
                  <div className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                        {isWelcomeExpanded 
                          ? (settings.welcomeText || "Dhading Hospital is a well equipped multi-speciality private hospital located in Dhading Besi. Led by a team of highly-trained doctors, nurses and tech specialists representing diverse core faculties. We focus on ISO guidelines, safe environments, emergency support, and local affordable healthcare.")
                          : `${(settings.welcomeText || "Dhading Hospital is a well equipped multi-speciality private hospital located in Dhading Besi. Led by a team of highly-trained doctors, nurses and tech specialists representing diverse core faculties. We focus on ISO guidelines, safe environments, emergency support, and local affordable healthcare.").substring(0, 115)}...`
                        }
                      </p>
                      <button 
                        type="button"
                        onClick={() => setIsWelcomeExpanded(!isWelcomeExpanded)}
                        className="text-[#00A64C] hover:text-[#006830] font-black underline inline-flex items-center gap-0.5 text-xs uppercase cursor-pointer block"
                      >
                        {isWelcomeExpanded ? "Read Less" : "Read More"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        onClick={() => setActiveTab('about')}
                        className="bg-[#00A64C] hover:bg-[#006830] text-white font-extrabold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm uppercase tracking-wide"
                      >
                        About us <ChevronRight className="size-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('services');
                          setSelectedOpdDoctorCategory(null);
                        }}
                        className="border border-[#00A64C]/35 text-[#006830] bg-white hover:bg-slate-50 font-extrabold py-2.5 px-5 rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wide"
                      >
                        Browse Services
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Message from Chairman Desk */}
              <div className="bg-[#00A64C] text-white p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-md relative overflow-hidden group">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
                <div className="space-y-4">
                  <h3 className="text-lg font-black tracking-wider uppercase border-b border-white/20 pb-2 flex items-center gap-1.5">
                    Message from Chairman
                  </h3>
                  <div className="flex gap-3 items-center pt-1">
                    <img
                      src={aboutUs.chairmanMessage.photoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"}
                      alt={aboutUs.chairmanMessage.name}
                      className="w-14 h-14 object-cover rounded-full border-2 border-white/65 bg-white shadow-xs shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm leading-tight">{aboutUs.chairmanMessage.name}</h4>
                      <p className="text-[10px] uppercase font-black text-white/75 tracking-wider mt-0.5">Chairman / Exec Board</p>
                    </div>
                  </div>
                  <p className="text-white/95 text-xs sm:text-[13px] leading-relaxed italic line-clamp-5">
                    "{aboutUs.chairmanMessage.details}"
                  </p>
                </div>

                <div className="pt-4 grid grid-cols-1 gap-2">
                  <a
                    href={getWhatsAppLink(aboutUs.chairmanMessage.whatsappNumber, aboutUs.chairmanMessage.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs py-3 px-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs uppercase hover:scale-[1.01]"
                  >
                    <MessageCircle className="size-4 fill-emerald-800 text-white" />
                    Direct Chairman Chat
                  </a>
                  <a
                    href={`mailto:${aboutUs.chairmanMessage.whatsappNumber ? 'chairman@dhadinghospital.com.np' : 'info@dhadinghospital.com.np'}`}
                    className="w-full bg-[#006830] hover:bg-[#004d24] text-white border border-white/20 font-black text-xs py-3 px-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs uppercase hover:scale-[1.01]"
                  >
                    <Mail className="size-4" />
                    Mail garnu hos (Send Mail)
                  </a>
                </div>
              </div>
            </section>

            {/* Some of our services quick overview */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-4">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight border-b-2 border-emerald-600/10 pb-2 relative">
                  Some of our services
                  <span className="absolute bottom-0 left-0 h-0.5 w-16 bg-[#00A64C]"></span>
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
                {/* OPD Card */}
                <div 
                  onClick={() => { 
                    setActiveTab('services'); 
                    setActiveServicesCategorySubTab('opd'); 
                    setSelectedOpdDoctorCategory(null);
                  }}
                  className="bg-[#52b685] py-5 px-3 md:py-14 md:px-8 rounded-2xl cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300 text-center flex flex-col items-center group shadow-md col-span-1"
                >
                  <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-3 md:mb-6 shadow-md transition-transform group-hover:scale-105 duration-300">
                    <Stethoscope className="size-6 md:size-12 text-[#52b685]" />
                  </div>
                  <h4 className="text-sm md:text-3xl font-black text-white mb-2 md:mb-5 tracking-wide uppercase font-sans">
                    OPD
                  </h4>
                  <p className="text-white/95 text-center text-xs sm:text-sm md:text-base leading-snug md:leading-relaxed px-1 font-medium line-clamp-3 md:line-clamp-none">
                    Dhading Hospital offers consultation, diagnostic services, health checkups, pathology tests and all treatment facilities. Our main goal is patient's satisfaction.
                  </p>
                </div>

                {/* IPD Card */}
                <div 
                  onClick={() => { 
                    setActiveTab('services'); 
                    setActiveServicesCategorySubTab('ipd'); 
                    setSelectedOpdDoctorCategory(null);
                  }}
                  className="bg-[#00bda7] py-5 px-3 md:py-14 md:px-8 rounded-2xl cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300 text-center flex flex-col items-center group shadow-md col-span-1"
                >
                  <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-3 md:mb-6 shadow-md transition-transform group-hover:scale-105 duration-300">
                    <Stethoscope className="size-6 md:size-12 text-[#00bda7]" />
                  </div>
                  <h4 className="text-sm md:text-3xl font-black text-white mb-2 md:mb-5 tracking-wide uppercase font-sans">
                    IPD
                  </h4>
                  <p className="text-white/95 text-center text-xs sm:text-sm md:text-base leading-snug md:leading-relaxed px-1 font-medium line-clamp-3 md:line-clamp-none">
                    Dhading Hospital has General Ward, Maternity Ward, Post Operative Ward, ICU, NICU, Dialysis and Cabins.
                  </p>
                </div>

                {/* Lab/Pathology Card */}
                <div 
                  onClick={() => { 
                    setActiveTab('services'); 
                    setActiveServicesCategorySubTab('labPathology'); 
                    setSelectedOpdDoctorCategory(null);
                  }}
                  className="bg-[#52b685] py-5 px-4 md:py-14 md:px-8 rounded-2xl cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300 text-center flex flex-col items-center group shadow-md col-span-2 md:col-span-1"
                >
                  <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-3 md:mb-6 shadow-md transition-transform group-hover:scale-105 duration-300">
                    <Stethoscope className="size-6 md:size-12 text-[#52b685]" />
                  </div>
                  <h4 className="text-sm md:text-3xl font-black text-white mb-2 md:mb-5 tracking-wide uppercase font-sans">
                    Lab/Pathology
                  </h4>
                  <p className="text-white/95 text-center text-xs sm:text-sm md:text-base leading-snug md:leading-relaxed px-2 font-medium line-clamp-2 md:line-clamp-none">
                    Pathology of our hospital runs 24hrs, 7days. Highlights high-efficiency diagnostic equipment and routine profiles delivered instantly.
                  </p>
                </div>
              </div>
            </section>

            {/* DC Events and Emergency 24/7 (Side-by-side) */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Events Left Block */}
              <div className="lg:col-span-2 space-y-5">
                <h3 className="text-2xl font-black text-[#006830] tracking-tight border-b-2 border-emerald-600/10 pb-2 relative uppercase">
                  DC EVENTS
                  <span className="absolute bottom-[-2px] left-0 h-0.5 w-16 bg-[#00A64C]"></span>
                </h3>
                
                <div className="space-y-5">
                  {(() => {
                    const featuredEvent = events.find(item => item.id === featuredEventId) || events[0];
                    if (featuredEvent) {
                      return (
                        <div className="space-y-4">
                          {/* Clean/Featured event photo card - completely clean image with no overlay text */}
                          <div 
                            onClick={() => setActiveEventDetail(featuredEvent)}
                            className="group relative overflow-hidden rounded-3xl border border-gray-150 bg-slate-100 cursor-pointer shadow-md aspect-video w-full h-[220px] sm:h-[350px]"
                          >
                            <img 
                              src={featuredEvent.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'} 
                              alt={featuredEvent.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-100 transition-all duration-700 group-hover:scale-102"
                            />
                            {/* Softer clickable indication hover overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                          </div>

                          {/* Info & Action button clearly set underneath the clean picture */}
                          <div className="p-5 sm:p-6 bg-white border border-gray-150 rounded-2xl space-y-3 shadow-xs text-left">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="bg-emerald-50 text-[#006830] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-emerald-100">
                                ★ Featured DC Event
                              </span>
                              <div className="bg-slate-100 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono">
                                Date: {featuredEvent.day} {featuredEvent.monthYear}
                              </div>
                            </div>
                            
                            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                              {featuredEvent.title}
                            </h4>

                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => setActiveEventDetail(featuredEvent)}
                                className="inline-flex items-center gap-2 bg-[#006830] hover:bg-[#00A64C] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                              >
                                View Event Details <ArrowRight className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return <p className="text-xs text-gray-400 pl-1">No camp events registered at the moment.</p>
                  })()}
                </div>
              </div>

              {/* Emergency Right Block */}
              <div className="bg-white border-2 border-[#00A64C]/35 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 text-[#00A64C] p-3 rounded-2xl shrink-0">
                      <Clock className="size-6 text-[#00A64C]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#006830] text-lg">Emergency 24/7</h4>
                      <p className="text-xs text-gray-500 font-extrabold uppercase tracking-wider">High speed clinical response</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-semibold">
                    The main goal of Emergency clinic has always been providing exceptional patient care 24 hours per day, 365 days a year. Equipped with critical triage.
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-100 mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-extrabold uppercase">Emergency Hotline</p>
                    <p className="text-sm sm:text-base font-black text-gray-950 font-mono">{contact.phone || "+977-10-520111"}</p>
                  </div>
                  <a
                    href={`tel:${contact.ambulancePhone || "9851000102"}`}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-black min-h-[38px] px-4 rounded-xl transition-all duration-300 animate-pulse cursor-pointer shadow-md inline-flex items-center justify-center"
                  >
                    Ambulance
                  </a>
                </div>
              </div>
            </section>

            {/* News and Updates Section */}
            <section className="bg-slate-100/50 py-12 border-y border-gray-150">
              <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight border-b-2 border-emerald-600/10 pb-2 relative inline-block">
                      News and Updates
                      <span className="absolute bottom-0 left-0 h-0.5 w-16 bg-[#00A64C]"></span>
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Read about our medical achievements, free health camps and diagnostics releases.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('news')}
                    className="text-xs font-black text-[#00A64C] hover:text-[#006830] inline-flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    View All news <ArrowUpRight className="size-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {news.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setActiveNewsDetail(item)}
                      className="bg-white rounded-xl sm:rounded-2xl border border-gray-150 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <div>
                        <div className="relative overflow-hidden group">
                          <img
                            src={item.imageUrl || "https://images.unsplash.com/photo-1504813184591-01552661c88c?auto=format&fit=crop&w=800&q=80"}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-44 object-cover transform group-hover:scale-102 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 bg-[#006830]/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.timeDate}
                          </span>
                        </div>
                        <div className="p-3 sm:p-5 space-y-1 sm:space-y-2">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#00A64C] transition-colors line-clamp-2 sm:line-clamp-3">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                      <div className="px-3 pb-3 pt-2 sm:px-5 sm:pb-5 sm:pt-3 border-t border-gray-100 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveNewsDetail(item);
                          }}
                          className="text-[10px] sm:text-xs font-black text-[#00A64C] hover:text-[#006830] transition-colors inline-flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                        >
                          Read Article <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials Slider (Premium bright green layout style) */}
            <section className="bg-[#00c56a] py-6 sm:py-14 text-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-6 relative">
                <div className="flex flex-col items-center">
                  <div className="bg-white/11 p-1.5 sm:p-3 rounded-full mb-1">
                    <MessageCircle className="size-5 sm:size-8 fill-white text-[#00c56a]" />
                  </div>
                  <h3 className="text-sm sm:text-xl md:text-2xl font-black uppercase tracking-widest font-sans mb-0.5">Testimonials</h3>
                  <p className="text-[9px] sm:text-[11px] text-emerald-50 font-black tracking-wider uppercase">What Our Patients Say About Dhading Hospital</p>
                </div>

                {testimonials.length > 0 && (
                  <div className="space-y-2 sm:space-y-4 max-w-2xl mx-auto min-h-[80px] sm:min-h-[100px] flex flex-col justify-center">
                    <p className="text-xs sm:text-base md:text-xl font-bold leading-relaxed italic text-white/95 px-2">
                      "{testimonials[testiIdx].comment}"
                    </p>
                    <div>
                      <h5 className="text-[11px] sm:text-sm font-black text-white">{testimonials[testiIdx].name}</h5>
                      {testimonials[testiIdx].address && (
                        <p className="text-[9px] sm:text-xs text-emerald-100 font-bold mt-0.5">{testimonials[testiIdx].address}</p>
                      )}
                    </div>
                  </div>
                )}

                {testimonials.length > 1 && (
                  <div className="flex justify-center gap-2 pt-1 sm:pt-4">
                    <button
                      onClick={() => setTestiIdx(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                      className="size-7 sm:size-10 bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center rounded-full transition-all cursor-pointer border border-white/25"
                    >
                      <ChevronRight className="size-3.5 sm:size-5 transform rotate-180" />
                    </button>
                    <button
                      onClick={() => setTestiIdx(prev => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                      className="size-7 sm:size-10 bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center rounded-full transition-all cursor-pointer border border-white/25"
                    >
                      <ChevronRight className="size-3.5 sm:size-5" />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Our Feature Gallery (Full-Width, Pristine Grid) */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
              <div className="flex justify-between items-end border-b-2 border-emerald-600/10 pb-3 relative">
                <h3 className="text-2xl font-black text-[#006830] tracking-tight">
                  Hospital Feature Gallery
                </h3>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="text-xs sm:text-sm font-black text-[#00A64C] hover:text-[#006830] flex items-center gap-1 transition-all"
                >
                  View Full Gallery <ArrowRight className="size-4" />
                </button>
                <span className="absolute bottom-[-2px] left-0 h-[2px] w-24 bg-[#00A64C]"></span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {gallery.slice(0, 6).map((g) => (
                  <div 
                    key={g.id} 
                    className="group relative overflow-hidden rounded-2xl border border-gray-150 aspect-square shadow-sm cursor-pointer bg-slate-50" 
                    onClick={() => setActiveTab('gallery')}
                  >
                    <img
                      src={g.imageUrl}
                      alt={g.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 duration-300">
                      <p className="text-[10px] sm:text-xs font-bold text-white leading-tight line-clamp-2">{g.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>



            {/* Request appointment bar (Click to booking modal) */}
            <section className="bg-slate-100 py-12 border-t border-gray-150">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowBookModal(true)}
                    className="w-16 h-16 bg-[#00A64C] hover:bg-[#006830] text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer border-4 border-white animate-bounce"
                  >
                    <Calendar className="size-7 text-white" />
                  </button>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl sm:text-2xl font-black text-[#006830] tracking-tight">
                    Request an appointment online or by phone
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-semibold">
                    Using our easy, secure online form, you can request an appointment with a Dhading Hospital specialist anytime, day or night. Our appointment coordinators will retrieve your bookings catalog, authenticate immediately and call you back in minutes.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-4 justify-center">
                  <span className="text-xs bg-white border border-gray-200 text-[#006830] py-2.5 px-4 rounded-xl font-bold flex items-center gap-1">
                    <Phone className="size-3.5" /> landline Hotline: {contact.phone || "+977-10-520111"}
                  </span>
                  <button
                    onClick={() => setShowBookModal(true)}
                    className="bg-[#000000] hover:bg-[#006830] text-white text-xs font-black py-2.5 px-6 rounded-xl cursor-pointer shadow-md transition-colors uppercase tracking-wider"
                  >
                    Interactive Form Portal
                  </button>
                </div>
              </div>
            </section>

            {/* Google Maps block */}
            <section className="w-full block">
              <iframe
                src={contact.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14101.401037599553!2d84.91891961621528!3d27.921822830605923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb00dcfbebe543%3A0xc3fa5e966c891398!2sDhading%20Besi!5e0!3m2!1sne!2snp!4v1654317602082"}
                width="100%"
                height="380"
                style={{ border: 0, filter: "grayscale(1%) contrast(98%)" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dhading Hospital Google Map"
              ></iframe>
            </section>

          </div>
        )}

        {/* Services Tab View */}
        {activeTab === 'services' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col lg:grid lg:grid-cols-4 gap-8">
            
            {/* Mobile Horizontal Selector & Dropdown Selector */}
            <div className="lg:hidden space-y-4">
              <label className="text-xs font-black uppercase text-[#00A64C] tracking-wider block font-mono">
                Select Department/Service
              </label>
              <div className="relative">
                <select
                  value={activeServicesCategorySubTab}
                  onChange={(e) => {
                    setActiveServicesCategorySubTab(e.target.value as keyof Services);
                    setSelectedOpdDoctorCategory(null);
                  }}
                  className="w-full bg-emerald-950 text-white font-extrabold py-4 pl-5 pr-12 rounded-2xl border border-emerald-800 focus:outline-none appearance-none cursor-pointer shadow-md text-sm"
                >
                  {[
                    { id: 'opd', label: 'OPD Services' },
                    { id: 'ipd', label: 'IPD Services' },
                    { id: 'emergency', label: 'Emergency Care 24/7' },
                    { id: 'labPathology', label: 'Lab & Pathology' },
                    { id: 'radiology', label: 'Radiology Services' },
                    { id: 'cashReception', label: 'Cash & Reception Desk' },
                    { id: 'pharmacy', label: 'In-Hospital Pharmacy' },
                    { id: 'ambulance', label: 'Ambulance Services' },
                    { id: 'preventiveHealth', label: 'Preventive Health Packages' }
                  ].map((tab) => (
                    <option key={tab.id} value={tab.id} className="text-gray-900 bg-white font-bold">
                      {tab.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <ChevronDown className="size-5" />
                </div>
              </div>

              {/* Horizontal scrollable chips with indicator */}
              <div className="flex gap-2 overflow-x-auto pb-3 pt-1 -mx-4 px-4 scrollbar-none scroll-smooth">
                {[
                  { id: 'opd', label: 'OPD Services' },
                  { id: 'ipd', label: 'IPD Services' },
                  { id: 'emergency', label: 'Emergency 24/7' },
                  { id: 'labPathology', label: 'Lab & Pathology' },
                  { id: 'radiology', label: 'Radiology' },
                  { id: 'cashReception', label: 'Cash/Billing' },
                  { id: 'pharmacy', label: 'In-Hospital Pharmacy' },
                  { id: 'ambulance', label: 'Ambulance Unit' },
                  { id: 'preventiveHealth', label: 'Health Packages' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveServicesCategorySubTab(tab.id as keyof Services);
                      setSelectedOpdDoctorCategory(null);
                    }}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs shrink-0 ${
                      activeServicesCategorySubTab === tab.id
                        ? 'bg-[#006830] text-white ring-2 ring-[#00A64C]'
                        : 'bg-white text-gray-700 border border-gray-100 hover:bg-slate-50'
                    }`}
                  >
                    {tab.id === 'labPathology' && '🔬 '}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar list items (Desktop Only) */}
            <div className="hidden lg:block space-y-2.5">
              <h3 className="text-[#006830] font-black text-base uppercase tracking-wider pl-3 py-3 border-b border-[#00A64C]/20">Category Sections</h3>
              {[
                { id: 'opd', label: 'OPD Services' },
                { id: 'ipd', label: 'IPD Services' },
                { id: 'emergency', label: 'Emergency Care 24/7' },
                { id: 'labPathology', label: 'Lab & Pathology' },
                { id: 'radiology', label: 'Radiology Services' },
                { id: 'cashReception', label: 'Cash & Reception Desk' },
                { id: 'pharmacy', label: 'In-Hospital Pharmacy' },
                { id: 'ambulance', label: 'Ambulance Services' },
                { id: 'preventiveHealth', label: 'Preventive Health Packages' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveServicesCategorySubTab(tab.id as keyof Services);
                    setSelectedOpdDoctorCategory(null);
                  }}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-black transition-all cursor-pointer flex justify-between items-center shadow-xs ${
                    activeServicesCategorySubTab === tab.id 
                      ? 'bg-[#001d0d] text-white border-l-4 border-[#00A64C]' 
                      : 'hover:bg-slate-100 text-gray-700 hover:text-[#00A64C]'
                  }`}
                >
                  {tab.label}
                  <ChevronRight className="size-4 opacity-80" />
                </button>
              ))}
            </div>

            {/* Display stage */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-lg space-y-8">
                <div>
                  <span className="text-[#00A64C] text-xs tracking-widest font-black uppercase font-mono">DEPARTMENT MODULE CONTENTS</span>
                  <h2 className="text-3xl md:text-4xl font-black text-[#006830] uppercase mt-1">
                    {activeServicesCategorySubTab === 'labPathology' ? 'Lab/Pathology Services' : activeServicesCategorySubTab.replace(/([A-Z])/g, ' $1') + ' Service Unit'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {activeServicesCategorySubTab === 'labPathology' ? (
                    <div className="space-y-10">
                      {/* Dhading Hospital Inspired Banner Header */}
                      <div className="relative rounded-3xl overflow-hidden min-h-[220px] bg-gradient-to-br from-[#004D23] via-[#006830] to-[#00A64C] flex items-center p-6 md:p-10 text-white shadow-xl">
                        <div className="absolute inset-0 opacity-10 overflow-hidden mix-blend-overlay">
                          <img
                            src="https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=800&q=80"
                            alt="Laboratory Background decoration"
                            className="w-full h-full object-cover scale-110 animate-pulse"
                          />
                        </div>
                        <div className="relative z-10 space-y-3 max-w-2xl">
                          <span className="text-[10px] sm:text-xs font-black tracking-widest bg-emerald-400/20 text-emerald-300 py-1 px-3 sm:px-4 rounded-full inline-block font-mono">
                            ISO 9001:2015 CERTIFIED DIAGNOSTICS UNIT
                          </span>
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-white">
                            Central Pathology Laboratory
                          </h3>
                          <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed font-medium">
                            Dhading Hospital's premium medical laboratory is equipped with molecular and fully automated clinical diagnostic systems with experienced pathologists on standby 24 hours a day.
                          </p>
                        </div>
                      </div>

                      {/* Advanced Laboratory Diagnostics Equipment (CLIA / Biochemistry) */}
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8 rounded-3xl border border-slate-200/50 space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs text-[#00A64C] font-black tracking-wider uppercase font-mono">Precision & Quality Control</span>
                          <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Advanced Diagnostics Machinery</h4>
                          <p className="text-xs sm:text-sm text-gray-500 font-medium">We ensure the highest accuracy of report metrics with direct machinery interfacing.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                          {[
                            { name: "CLIA System", desc: "Chemiluminescence Immunoassay for hormone diagnostics" },
                            { name: "5-Part CBC Counter", desc: "Fully automated laser-flow blood cytology analyzer" },
                            { name: "Fully Auto Biochemistry", desc: "High throughput quantitative serum assay processor" },
                            { name: "Electrolyte Analyzer", desc: "Automated Ion Selective Electrode medical metrics finder" },
                            { name: "ELISA Reader & Washer", desc: "Highly precise automated immunological test systems" },
                            { name: "Urine Auto Analyzer", desc: "Digital clinical specimen chemistry screening system" }
                          ].map((mach, idx) => (
                            <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200/40 shadow-xs hover:border-[#00A64C]/30 hover:shadow-xs transition-all duration-200">
                              <h5 className="font-extrabold text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
                                <span className="size-1.5 bg-[#00A64C] rounded-full shrink-0"></span>
                                {mach.name}
                              </h5>
                              <p className="text-[10px] text-gray-400 mt-1 font-semibold leading-relaxed">{mach.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lab test categories we provide section */}
                      <div className="space-y-6">
                        <div className="border-b border-dashed border-slate-200 pb-4 flex justify-between items-center sm:flex-row flex-col gap-3">
                          <div>
                            <h4 className="text-lg sm:text-xl font-black text-[#006830] tracking-tight uppercase flex items-center gap-2">
                              <span className="size-3 bg-[#00A64C] rounded-full inline-block animate-ping"></span>
                              Lab Tests Which We Provide
                            </h4>
                            <p className="text-xs text-gray-500 font-bold mt-0.5">Comprehensive wellness diagnostics profiles under specialized departments.</p>
                          </div>
                          <span className="text-xs sm:text-sm bg-emerald-50 text-[#006830] font-black py-1.5 px-4 rounded-full border border-[#00A64C]/10 text-center shrink-0">
                            ✓ 24/7 Priority Emergency Services
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Biochemistry Department */}
                          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#00A64C]/30 hover:bg-emerald-50/10 transition-all duration-300">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-[#00A64C] tracking-widest block font-mono">01. BIOCLINICAL DEPT</span>
                                <h5 className="font-black text-lg text-slate-900 leading-none">Clinical Biochemistry</h5>
                              </div>
                              <span className="bg-[#00A64C]/10 text-[#006830] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Interfaced</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                              Quantitative monitoring of serum components via high-accuracy clinical chemistry setups.
                            </p>
                            <div className="text-[11px] bg-slate-50 divide-y divide-slate-100 rounded-2xl font-bold text-gray-600 overflow-hidden border border-slate-100/80">
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Liver Function Tests (LFT / Bilirubin / SGPT)</span><span className="text-[#006830]">Daily Routine</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Renal (Kidney) Panels (RFT / Urea / Creatinine)</span><span className="text-[#006830]">Daily Routine</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Lipid Profiles & Sugar Profile (HbA1c)</span><span className="text-[#006830]">Daily Routine</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Serum Electrolytes & Amylase / Lipase assays</span><span className="text-[#00A64C] font-black font-mono">On-Demand</span></p>
                            </div>
                          </div>

                          {/* Hematology Department */}
                          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#00A64C]/30 hover:bg-emerald-50/10 transition-all duration-300">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-[#00A64C] tracking-widest block font-mono">02. CYTOLOGY DEPT</span>
                                <h5 className="font-black text-lg text-slate-900 leading-none">Hematology & Coagulation</h5>
                              </div>
                              <span className="bg-[#00A64C]/10 text-[#006830] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Laser Flow</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                              Comprehensive examination of cellular blood elements using modern automated flow cytometry counters.
                            </p>
                            <div className="text-[11px] bg-slate-50 divide-y divide-slate-100 rounded-2xl font-bold text-gray-600 overflow-hidden border border-slate-100/80">
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Complete Blood Count (CBC / ESR / Haemoglobin)</span><span className="text-emerald-700 font-extrabold flex items-center gap-1"><span className="size-1.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>Within 30 mins</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>PT/INR & APTT Coagulation Factors Study</span><span className="text-emerald-700">Critical Monitor</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Blood Grouping & Cross Matching Services</span><span className="text-emerald-700">Safe Sourcing</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Peripheral Smear & Bone Marrow Examinations</span><span className="text-orange-600 font-extrabold">On Schedule</span></p>
                            </div>
                          </div>

                          {/* Immunology Section */}
                          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#00A64C]/30 hover:bg-emerald-50/10 transition-all duration-300">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-[#00A64C] tracking-widest block font-mono">03. IMMUNOLOGICAL DEPT</span>
                                <h5 className="font-black text-lg text-slate-900 leading-none">Immunology & Serology</h5>
                              </div>
                              <span className="bg-[#00A64C]/10 text-[#006830] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Chemilumin</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                              Certified precise hormone profiling, infectious screenings, and antibody diagnostics.
                            </p>
                            <div className="text-[11px] bg-slate-50 divide-y divide-slate-100 rounded-2xl font-bold text-gray-600 overflow-hidden border border-slate-100/80">
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Thyroid Profile (T3, T4, ultra-sensitive TSH)</span><span className="text-emerald-700">Automated CLIA</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Cardiac Troponin I Assay & CK-MB screening</span><span className="text-red-600 font-black flex items-center gap-1"><span className="size-1.5 bg-red-500 rounded-full inline-block animate-ping"></span>Emergency 20 mins</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Infectious Panels (HIV, HBsAg, HCV screenings)</span><span className="text-emerald-700">Double Confirmed</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Widal, Dengue Duo Serologicals, CRP & RA</span><span className="text-emerald-700">Daily Run</span></p>
                            </div>
                          </div>

                          {/* Microbiology Department */}
                          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#00A64C]/30 hover:bg-emerald-50/10 transition-all duration-300">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-[#00A64C] tracking-widest block font-mono">04. PATHOGEN DEPT</span>
                                <h5 className="font-black text-lg text-slate-900 leading-none">Clinical Microbiology</h5>
                              </div>
                              <span className="bg-[#00A64C]/10 text-[#006830] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Certified Lab</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                              Culturing of pathogenic microbes with sensitive FDA approved antibacterial screens.
                            </p>
                            <div className="text-[11px] bg-slate-50 divide-y divide-slate-100 rounded-2xl font-bold text-gray-600 overflow-hidden border border-slate-100/80">
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Urine, Blood, Pus & Sputum cultures</span><span className="text-emerald-700">Antibiotic Sensitivity</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>AFB Smear testing for Pulmonary Tuberculosis</span><span className="text-emerald-700 font-bold">Priority TB Desk</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Gram Staining, Wet Mount, Stool examinations</span><span className="text-[#006830]">Daily Routine</span></p>
                            </div>
                          </div>

                          {/* Histopathology */}
                          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#00A64C]/30 hover:bg-emerald-50/10 transition-all duration-300">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-[#00A64C] tracking-widest block font-mono">05. TISSUE BIOP_DEPT</span>
                                <h5 className="font-black text-lg text-slate-900 leading-none">Histopathology & Cytology</h5>
                              </div>
                              <span className="bg-[#00A64C]/10 text-[#006830] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Expert Sign-Off</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                              Cervix pap screening, diagnostic FNAC operations, and tissue biopsies evaluated by experienced tissue pathologists.
                            </p>
                            <div className="text-[11px] bg-slate-50 divide-y divide-slate-100 rounded-2xl font-bold text-gray-600 overflow-hidden border border-slate-100/80">
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Biopsy Specimen Tissue Histopathology</span><span className="text-[#006830] font-bold">Consultant Sign</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>FNAC (Fine Needle Aspiration Cytology)</span><span className="text-[#001d0d] font-bold">On Schedule</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>PAP Smear for preventive cervix screening</span><span className="text-emerald-700">Daily Service</span></p>
                            </div>
                          </div>

                          {/* Clinical Pathology Support */}
                          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 space-y-4 shadow-sm hover:border-[#00A64C]/30 hover:bg-emerald-50/10 transition-all duration-300">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-black text-[#00A64C] tracking-widest block font-mono">06. FLUID CLINICAL_DEPT</span>
                                <h5 className="font-black text-lg text-slate-900 leading-none">Clinical Fluid Pathology</h5>
                              </div>
                              <span className="bg-[#00A64C]/10 text-[#006830] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">Fast Track</span>
                            </div>
                            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                              Diagnostic fluid screening of urine chemical, semen levels, and other physiological secretions.
                            </p>
                            <div className="text-[11px] bg-slate-50 divide-y divide-slate-100 rounded-2xl font-bold text-gray-600 overflow-hidden border border-slate-100/80">
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Routine & Microscopic Urinalysis</span><span className="text-emerald-700 flex items-center gap-1"><span className="size-1 bg-[#00A64C] rounded-full inline-block"></span>Immediate</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Stool Occult Blood & Routine analysis</span><span className="text-emerald-700">Hourly Bench</span></p>
                              <p className="p-3 bg-slate-50/50 flex justify-between"><span>Semen Analysis (Count & Morphology studies)</span><span className="text-[#006830] font-bold">ISO Metric</span></p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Official Dhading Hospital Quick Contact Reference & Ambulance block */}
                      <div className="bg-emerald-950 p-6 sm:p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl border border-emerald-800">
                        <div className="space-y-2 text-center md:text-left">
                          <span className="text-emerald-400 font-black uppercase text-xs tracking-wider block font-mono">EMERGENCY ASSISTANCE SERVICES</span>
                          <h4 className="text-xl sm:text-2xl font-black text-white leading-none">Request Fast-Track Diagnostics & Ambulance</h4>
                          <p className="text-xs text-emerald-100 hover:underline">
                            Direct help desk and prompt Ambulance service routing across the district.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 shrink-0">
                          <a
                            href={`tel:${contact.ambulancePhone}`}
                            className="bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all text-white font-black py-3 px-6 rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg animate-bounce"
                          >
                            ☎ Ambulance: {contact.ambulancePhone}
                          </a>
                          <button
                            onClick={() => setShowBookModal(true)}
                            className="bg-[#00A64C] hover:bg-[#006830] hover:scale-105 active:scale-95 transition-all text-white font-black py-3 px-6 rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg"
                          >
                            <Calendar className="size-4" /> Request Appointment
                          </button>
                        </div>
                      </div>

                      {/* PDF Guidelines links if set up */}
                      {services.labPathology?.map((item) => (
                        <div key={item.id} className="border border-slate-200/60 p-6 sm:p-8 rounded-3xl space-y-4 bg-gradient-to-r from-slate-50 to-white shadow-xs">
                          <h4 className="text-xs font-black text-[#006830] uppercase tracking-widest block font-mono">Official Dhading Hospital Guide & Instructions</h4>
                          {item.text && (
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold whitespace-pre-wrap">{item.text}</p>
                          )}
                          {item.pdfUrl && (
                            <div className="pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePdfUrl(item.pdfUrl!);
                                  setActivePdfTitle(item.title || 'Official Lab Guide');
                                }}
                                className="bg-[#006830] hover:bg-[#001d0d] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-black inline-flex items-center gap-2.5 cursor-pointer shadow-md transition-colors"
                              >
                                <Eye className="size-4" /> View Official Lab Guide (PDF)
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : activeServicesCategorySubTab === 'opd' ? (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* If an OPD category is clicked, show its doctor list */}
                      {selectedOpdDoctorCategory ? (
                        <div className="space-y-6 text-left">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
                            <div className="space-y-1">
                              <button
                                onClick={() => setSelectedOpdDoctorCategory(null)}
                                className="text-xs font-black text-[#00A64C] hover:text-[#006830] inline-flex items-center gap-1 cursor-pointer transition-colors pb-1 uppercase tracking-wider"
                              >
                                ← Back to OPD Specialty Categories
                              </button>
                              <h3 className="text-xl sm:text-2xl font-black text-[#006830] tracking-tight flex items-center gap-2">
                                <Stethoscope className="size-6 text-[#00A64C]" />
                                {selectedOpdDoctorCategory.toUpperCase()} Doctors List
                              </h3>
                              <p className="text-xs text-gray-400 font-semibold leading-tight">
                                Qualified and certified clinicians registered at Dhading Hospital
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setBookingPrefill({
                                  dept: selectedOpdDoctorCategory,
                                  doc: '',
                                  day: 'Sunday',
                                  time: 'Morning - 9 AM'
                                });
                                setShowBookModal(true);
                              }}
                              className="bg-[#00a64c] hover:bg-[#006830] text-white text-xs font-black font-mono px-4 py-2.5 rounded-xl uppercase tracking-wider shrink-0 transition-transform hover:scale-103 active:scale-97 cursor-pointer"
                            >
                              Book Appointment Now
                            </button>
                          </div>

                          {/* Filter current doctors under selected category */}
                          {(() => {
                            const norm = (s: string) => s.toLowerCase()
                              .replace(/ae/g, 'e')
                              .replace(/&/g, '')
                              .replace(/and/g, '')
                              .replace(/[^a-z0-9]/g, '');
                            const matchedDocs = doctors.filter(doc => norm(doc.category) === norm(selectedOpdDoctorCategory));
                            
                            if (matchedDocs.length === 0) {
                              return (
                                <div className="bg-slate-50 p-10 text-center rounded-2xl border border-gray-150 space-y-4">
                                  <p className="text-sm font-extrabold text-gray-500">
                                    We are currently arranging schedules with specialists under "{selectedOpdDoctorCategory}".
                                  </p>
                                  <p className="text-xs text-gray-400 font-semibold max-w-md mx-auto">
                                    Please call our landline referral coordinators or raise a quick booking form request to inquire about direct visit hours.
                                  </p>
                                  <div className="pt-2">
                                    <button
                                      onClick={() => {
                                        setBookingPrefill({
                                          dept: selectedOpdDoctorCategory,
                                          doc: '',
                                          day: 'Sunday',
                                          time: 'Morning - 9 AM'
                                        });
                                        setShowBookModal(true);
                                      }}
                                      className="bg-emerald-950 text-white hover:bg-[#006830] px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                                    >
                                      Submit In-Patient / Out-Patient Request
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                                {matchedDocs.map((dr) => (
                                  <div key={dr.id} className="bg-white rounded-2xl overflow-hidden border border-gray-150 hover:shadow-lg shadow-xs transition-all duration-300 flex flex-col justify-between">
                                    <div>
                                      <div className="h-44 relative bg-gradient-to-tr from-[#006830]/90 to-[#00A64C]/30 flex items-center justify-center overflow-hidden">
                                        <img
                                          src={dr.profilePicUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'}
                                          alt={dr.name}
                                          className="w-full h-full object-cover mix-blend-overlay"
                                          referrerPolicy="no-referrer"
                                        />
                                        <span className="absolute bottom-3 left-3 bg-[#001d0d]/90 text-white text-[8px] sm:text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
                                          {dr.level.length > 25 ? dr.level.substring(0, 22) + '...' : dr.level}
                                        </span>
                                      </div>
                                      <div className="p-4 space-y-2 text-left">
                                        <h4 className="font-extrabold text-[#006830] text-sm leading-snug line-clamp-1">{dr.name}</h4>
                                        <p className="text-[11px] text-gray-500 font-extrabold flex items-center gap-1 uppercase tracking-tight">
                                          ⭐️ {dr.experience}
                                        </p>
                                        <p className="text-[11px] text-[#00A64C] font-semibold">{dr.level}</p>
                                      </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 border-t border-gray-100 flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setBookingPrefill({
                                            dept: dr.category,
                                            doc: dr.name,
                                            day: 'Sunday',
                                            time: 'Morning - 9 AM'
                                          });
                                          setShowBookModal(true);
                                        }}
                                        className="flex-1 text-center bg-[#00A64C] hover:bg-[#006830] text-white py-2 rounded-xl text-xs font-black transition-colors uppercase tracking-wider cursor-pointer"
                                      >
                                        Book OPD Desk
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        /* Else show the complete categories grid with beautiful icon presentation */
                        <div className="space-y-8 text-left">
                          <div className="bg-gradient-to-br from-[#004D23] via-[#006830] to-[#00A64C] p-6 sm:p-8 rounded-3xl text-white shadow-lg space-y-1 md:space-y-2 relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6 scale-150">
                              <Stethoscope className="size-48" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 font-mono tracking-widest uppercase font-black px-3.5 py-1 rounded-full inline-block">
                              Dhading Hospital OPD Clinical Portals
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
                              OPD Specialities & Consultant Registries
                            </h3>
                            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl leading-relaxed">
                              Browse and filter specialized clinical departments. Click on any department specialization to inspect registered clinicians, view working hours, and reserve your consultation tokens directly.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat, idx) => {
                              const norm = (s: string) => s.toLowerCase()
                                .replace(/ae/g, 'e')
                                .replace(/&/g, '')
                                .replace(/and/g, '')
                                .replace(/[^a-z0-9]/g, '');
                              const drCount = doctors.filter(doc => norm(doc.category) === norm(cat)).length;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => setSelectedOpdDoctorCategory(cat)}
                                  className="bg-white hover:bg-emerald-50/10 hover:border-[#00A64C]/40 border border-gray-150 rounded-2xl p-4.5 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-50 text-[#006830] rounded-xl group-hover:bg-[#006830] group-hover:text-white transition-all shrink-0">
                                      <Stethoscope className="size-5" />
                                    </div>
                                    <div className="text-left font-sans">
                                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight leading-tight uppercase group-hover:text-[#00A64C] transition-colors line-clamp-2">
                                        {cat}
                                      </h4>
                                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                                        {drCount > 0 ? `${drCount} Active Specialists` : "Duty Clinicians"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="p-1 px-2.5 bg-slate-50 group-hover:bg-[#00A64C] text-gray-500 group-hover:text-white rounded-lg text-[10px] font-black transition-colors shrink-0 font-mono">
                                    {drCount > 0 ? "★" : "+"}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeServicesCategorySubTab === 'preventiveHealth' ? (
                    (() => {
                      const parseHealthPackage = (text: string = '') => {
                        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
                        let price = '';
                        const tests: string[] = [];
                        lines.forEach(line => {
                          if (line.toLowerCase().startsWith('price:') || line.toLowerCase().startsWith('rate:') || line.includes('Rs.') || line.includes('rs.')) {
                            price = line.replace(/^(price:|rate:)\s*/i, '');
                          } else {
                            tests.push(line);
                          }
                        });
                        return { price, tests };
                      };
                      return (
                        <div className="space-y-8 animate-in fade-in duration-300">
                          <div className="bg-gradient-to-br from-[#004D23] via-[#006830] to-[#00A64C] p-6 sm:p-8 rounded-3xl text-white shadow-lg space-y-1 relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6 scale-150">
                              <HeartPulse className="size-48" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 font-mono tracking-widest uppercase font-black px-3.5 py-1 rounded-full inline-block">
                              ISO 9001:2015 Preventive Health Care
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white uppercase mt-1">
                              Preventive Health Checkup Packages
                            </h3>
                            <p className="text-xs sm:text-sm text-emerald-100/95 font-medium max-w-2xl leading-relaxed">
                              Preventive health screenings help detect diseases early. Choose from our carefully designed health checkup package boxes, matching premium certification guidelines.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {services.preventiveHealth?.length === 0 ? (
                              <div className="md:col-span-2 py-12 text-center text-gray-400">
                                No packages currently added. You can add them from the Admin Panel.
                              </div>
                            ) : (
                              services.preventiveHealth.map((item) => {
                                const { price, tests } = parseHealthPackage(item.text);
                                return (
                                  <div key={item.id} className="bg-white border-2 border-emerald-100 hover:border-emerald-500/40 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#006830] to-[#00A64C]" />
                                    <div className="p-5 sm:p-6 space-y-4">
                                      <div className="space-y-1 text-left">
                                        <div className="flex justify-between items-start gap-2">
                                          <span className="bg-emerald-50 text-[#006830] text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider font-mono">
                                            🏥 Package Box
                                          </span>
                                          {price && (
                                            <span className="bg-orange-500 text-white font-mono text-xs font-black px-3 py-1 rounded-lg shadow-xs shrink-0">
                                              {price}
                                            </span>
                                          )}
                                        </div>
                                        <h4 className="text-base sm:text-lg font-black text-[#006830] uppercase tracking-tight leading-tight pt-1">
                                          {item.title}
                                        </h4>
                                      </div>

                                      {item.imageUrl && (
                                        <div className="h-36 w-full rounded-2xl overflow-hidden relative">
                                          <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                      )}

                                      <div className="space-y-2 text-left">
                                        <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider font-mono">
                                          Included Tests ({tests.length})
                                        </h5>
                                        
                                        <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 max-h-[260px] overflow-y-auto space-y-2.5">
                                          {tests.map((test, index) => (
                                            <div key={index} className="flex items-start gap-2 text-xs text-gray-700 font-semibold leading-normal">
                                              <span className="text-[#00A64C] shrink-0 mt-0.5">
                                                <svg className="size-3.5 shrink-0 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                                                  <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                              </span>
                                              <span className="leading-tight">{test}</span>
                                            </div>
                                          ))}
                                          {tests.length === 0 && (
                                            <p className="text-xs text-gray-400 italic">No tests listed in the description box.</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-4 bg-emerald-50/40 border-t border-emerald-100/50 flex items-center justify-between gap-3">
                                      <div className="text-left">
                                        <p className="text-[9px] text-[#006830] leading-none font-bold uppercase">Ready to Book?</p>
                                        <p className="text-[10px] text-gray-500 mt-1 font-semibold leading-none">Book instantly</p>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setBookingPrefill({
                                            dept: 'Preventive Health',
                                            doc: item.title,
                                            day: 'Sunday',
                                            time: 'Morning - 9 AM'
                                          });
                                          setShowBookModal(true);
                                        }}
                                        className="bg-[#00A64C] hover:bg-[#006830] text-white text-[10px] font-black py-2 px-3.5 rounded-xl shadow-xs transition-colors cursor-pointer uppercase font-mono tracking-wider"
                                      >
                                        Reserve Plan ✓
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : activeServicesCategorySubTab === 'ambulance' ? (
                    <div className="space-y-8 animate-in fade-in duration-300">
                      {/* Premium Ambulance Hero Card */}
                      <div className="bg-slate-50 border-2 border-red-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                          <div className="h-64 sm:h-80 w-full relative">
                            <img
                              src={contact.ambulancePicUrl || 'https://images.unsplash.com/photo-1583324113626-70df0f4cedf2?auto=format&fit=crop&w=800&q=80'}
                              alt="Dhading Hospital Emergency Ambulance"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
                              🚨 24/7 Service Unit
                            </div>
                          </div>
                          <div className="p-6 sm:p-8 space-y-4 text-left">
                            <span className="text-[10px] bg-red-50 text-red-700 font-mono tracking-widest uppercase font-black px-3.5 py-1 rounded-full inline-block">
                              Critical Life Support Dispatch
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-red-900 uppercase">
                              Dhading Hospital Ambulance Hotline
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                              Our ambulance fleet is fully equipped with critical care monitoring, oxygen tanks, trauma responders, and trained paramedical staff. Operating day and night to transport patients safely across the entire district.
                            </p>
                            
                            <div className="pt-2">
                              <a
                                href={`tel:${contact.ambulancePhone}`}
                                className="bg-red-600 hover:bg-red-700 hover:scale-103 active:scale-97 transition-all text-white font-black py-3 px-6 rounded-2xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-md animate-pulse"
                              >
                                ☎ Call Ambulance Now: {contact.ambulancePhone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Any other sub ambulance details if added under services */}
                      {services.ambulance?.map((item) => (
                        <div key={item.id} className="border border-slate-100 p-5 rounded-2xl space-y-4 bg-slate-50 text-left">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-64 object-cover rounded-xl shadow-xs"
                            />
                          )}
                          <div className="space-y-2">
                            <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                            {item.text && (
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{item.text}</p>
                            )}
                            {item.pdfUrl && (
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivePdfUrl(item.pdfUrl!);
                                    setActivePdfTitle(item.title || 'Guide PDF Document');
                                  }}
                                  className="bg-[#006830] hover:bg-[#001d0d] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black inline-flex items-center gap-2 cursor-pointer shadow-xs"
                                >
                                  View Guide Circular
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    services[activeServicesCategorySubTab]?.length === 0 ? (
                      <div className="py-12 text-center text-gray-400">
                        No contents published under this category yet. Please check back later.
                      </div>
                    ) : (
                      services[activeServicesCategorySubTab].map((item) => (
                        <div key={item.id} className="border border-slate-100 p-5 rounded-2xl space-y-4 bg-slate-50">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-64 object-cover rounded-xl shadow-xs"
                            />
                          )}
                          <div className="space-y-2">
                            <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                            {item.text && (
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{item.text}</p>
                            )}
                            {item.pdfUrl && (
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivePdfUrl(item.pdfUrl!);
                                    setActivePdfTitle(item.title || 'Guide PDF Document');
                                  }}
                                  className="bg-[#00A64C] hover:bg-[#006830] text-white px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                                >
                                  <Eye className="size-3.5" /> View Guide PDF Document
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Doctors Tab view */}
        {activeTab === 'doctors' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-10">
            <div className="text-center space-y-3">
              <span className="text-[#00A64C] uppercase text-xs sm:text-sm tracking-widest font-black font-mono">Our Certified Staff list</span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#006830] tracking-tight">Dhading Hospital Doctors Registry</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">Sift doctors according to medical speciality and consult with senior clinicians directly.</p>
              <span className="inline-block h-1 w-24 bg-[#00A64C] rounded-full"></span>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap justify-center gap-2 pb-4">
              <button
                onClick={() => setSelectedDoctorCategoryFilter('All Department Specials')}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs ${
                  selectedDoctorCategoryFilter === 'All Department Specials'
                    ? 'bg-[#00A64C] text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                }`}
              >
                All Department Specials
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDoctorCategoryFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs ${
                    selectedDoctorCategoryFilter === cat
                      ? 'bg-[#001d0d] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
                       {/* Output Doctors grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 pt-4">
              {doctors.filter(d => selectedDoctorCategoryFilter === 'All Department Specials' || d.category === selectedDoctorCategoryFilter).length === 0 ? (
                <div className="col-span-full py-16 text-center text-gray-500 font-bold text-lg">
                  We are recruiting Doctors for "{selectedDoctorCategoryFilter}" category. For immediate OPD, consult our Duty specialist.
                </div>
              ) : (
                doctors
                  .filter(d => selectedDoctorCategoryFilter === 'All Department Specials' || d.category === selectedDoctorCategoryFilter)
                  .map((dr) => (
                    <div key={dr.id} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-150 hover:shadow-xl shadow-xs transition-all duration-300 flex flex-col justify-between">
                      <div>
                        {/* Doctor Frame Portrait */}
                        <div className="h-28 sm:h-56 relative bg-gradient-to-tr from-[#006830]/95 to-[#00A64C]/35">
                          <img
                            src={dr.profilePicUrl}
                            alt={dr.name}
                            className="w-full h-full object-cover mix-blend-overlay"
                          />
                          <span className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-emerald-950/90 text-white text-[8px] sm:text-xs px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full font-black uppercase tracking-wider font-mono">
                            {dr.category.length > 14 ? dr.category.substring(0, 12) + '..' : dr.category}
                          </span>
                        </div>
                        
                        <div className="p-3 sm:p-6 space-y-1.5 sm:space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-sm sm:text-2xl font-black text-gray-900 leading-tight tracking-tight line-clamp-1">{dr.name}</h4>
                            <p className="text-[10px] sm:text-sm text-[#00A64C] font-black uppercase tracking-wide leading-none">{dr.level}</p>
                            <p className="text-[9px] sm:text-sm text-gray-400 font-bold leading-none">{dr.experience}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 pt-0 sm:p-6 sm:pt-0">
                        <div className="border-t border-gray-100 pt-2 sm:pt-4 flex justify-between items-center gap-1.5">
                          <a
                            href={`tel:${dr.number}`}
                            className="bg-emerald-50 hover:bg-[#00A44C]/10 text-[#006830] font-sans font-black px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl text-[9px] sm:text-sm transition-all shadow-2xs whitespace-nowrap inline-flex items-center gap-1"
                          >
                            📞 Call
                          </a>
                          
                          <div className="hidden sm:flex gap-2.5 text-gray-400 shrink-0">
                            {dr.facebook && (
                              <a href={dr.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-600 p-1">
                                <Facebook className="size-5" />
                              </a>
                            )}
                            {dr.twitter && (
                              <a href={dr.twitter} target="_blank" rel="noreferrer" className="hover:text-sky-400 p-1">
                                <Twitter className="size-5" />
                              </a>
                            )}
                            {dr.linkedin && (
                              <a href={dr.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-700 p-1">
                                <Linkedin className="size-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>      </div>

          </div>
        )}

        {/* About Tab view */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
            
            {/* 4a Introduction section */}
            <div id="about-intro" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md space-y-6 scroll-mt-24">
              <h2 className="text-3xl font-black text-[#006830] relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-20 after:bg-[#00A64C] tracking-tight">
                Introduction to Dhading Hospital
              </h2>
              <img src={aboutUs.introduction.photoUrl} alt="About portrait" className="w-full h-80 object-cover rounded-2xl shadow-sm" />
              <p className="text-gray-700 text-base md:text-[17px] leading-relaxed whitespace-pre-wrap">{aboutUs.introduction.details}</p>
            </div>

            {/* Board of Directors list */}
            <div id="about-board" className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-md space-y-10 scroll-mt-24">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#006830] tracking-tight relative pb-3 inline-block">
                  Board of Directors
                  <div className="h-1 w-20 bg-[#00A64C] mx-auto rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                </h2>
              </div>
              
              <div className="space-y-12">
                {/* Chairman section (Centered at Top) */}
                {aboutUs.boardOfDirectors.filter(b => (b.role || '').toLowerCase().includes('chairman')).map((chair) => (
                  <div key={chair.id} className="flex flex-col items-center text-center space-y-3">
                    <div className="size-48 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-lg bg-slate-50 p-1 flex items-center justify-center">
                      <img src={chair.photoUrl} alt={chair.name || (chair as any).title} className="size-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-[#006830]">{chair.name || (chair as any).title}</h3>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{chair.role || 'Chairman'}</p>
                    </div>
                  </div>
                ))}

                {/* Other Board Members (Grid below) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-4 justify-center">
                  {aboutUs.boardOfDirectors.filter(b => !(b.role || '').toLowerCase().includes('chairman')).map((member) => (
                    <div key={member.id} className="flex flex-col items-center text-center space-y-3 p-4 hover:scale-102 transition-transform duration-200">
                      <div className="size-40 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-md bg-slate-50 p-1 flex items-center justify-center">
                        <img src={member.photoUrl} alt={member.name || (member as any).title} className="size-full object-cover rounded-full" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-[#006830]">{member.name || (member as any).title}</h4>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{member.role || 'Board Member'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4c Chairman message details */}
            <div id="about-chairman" className="bg-emerald-50 p-8 md:p-10 rounded-3xl border border-[#00A64C]/15 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-8 items-center scroll-mt-24">
              <div>
                <img src={aboutUs.chairmanMessage.photoUrl} className="size-44 object-cover rounded-full mx-auto border-4 border-[#00A64C] shadow-lg bg-white" />
              </div>
              <div className="sm:col-span-2 space-y-4">
                <h3 className="text-2xl font-black text-[#006830]">Message from Chairman {aboutUs.chairmanMessage.name}</h3>
                <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed italic">"{aboutUs.chairmanMessage.details}"</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={getWhatsAppLink(aboutUs.chairmanMessage.whatsappNumber, aboutUs.chairmanMessage.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-6 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-101"
                  >
                    <MessageCircle className="size-4 text-emerald-600 fill-white" /> WhatsApp Chat
                  </a>
                  <a
                    href={`mailto:chairman@dhadinghospital.com.np`}
                    className="bg-[#006830] hover:bg-[#004d24] text-white font-extrabold py-3 px-6 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-md transition-transform hover:scale-101 border border-white/10"
                  >
                    <Mail className="size-4" /> Mail garnu hos
                  </a>
                </div>
              </div>
            </div>

            {/* Executive Staff: Medical Director, Account Manager, Reception */}
            {[
              { id: 'about-medical-director', data: aboutUs.medicalDirector, label: 'Medical Director' },
              { id: 'about-account-manager', data: aboutUs.accountManager, label: 'Account Manager' },
              { id: 'about-reception', data: aboutUs.reception, label: 'Reception & Inquiries' }
            ].map((staff) => staff.data && (
              <div key={staff.id} id={staff.id} className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-8 items-center scroll-mt-24">
                <div className="text-center">
                  <img src={staff.data.photoUrl} className="size-44 object-cover rounded-2xl mx-auto border-4 border-slate-100 shadow-sm bg-slate-50" referrerPolicy="no-referrer" />
                  <p className="text-[10px] font-black text-[#00A64C] uppercase tracking-[0.2em] mt-4">{staff.label}</p>
                </div>
                <div className="sm:col-span-2 space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-[#006830]">{staff.data.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{staff.data.role}</p>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">{staff.data.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                     <a
                      href={`mailto:${staff.data.email}`}
                      className="bg-[#00A64C] hover:bg-[#006830] text-white font-black py-2.5 px-5 rounded-xl text-[10px] uppercase tracking-widest inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Mail className="size-3.5" /> Mail garnu hos
                    </a>
                    <a
                      href={getWhatsAppLink(staff.data.whatsapp, staff.data.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-black py-2.5 px-5 rounded-xl text-[10px] uppercase tracking-widest inline-flex items-center gap-2 transition-all cursor-pointer border border-emerald-100 shadow-xs"
                    >
                      <MessageCircle className="size-3.5 fill-emerald-700 text-emerald-50" /> WhatsApp
                    </a>
                    <a
                      href={`tel:${staff.data.phone}`}
                      className="bg-slate-900 hover:bg-black text-white font-black py-2.5 px-5 rounded-xl text-[10px] uppercase tracking-widest inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Phone className="size-3.5 text-emerald-400" /> Direct Call
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* Hospital working team */}
            <div id="about-team" className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-md space-y-10 scroll-mt-24">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#006830] tracking-tight relative pb-3 inline-block">
                  Hospital Working Team
                  <div className="h-1 w-20 bg-[#00A64C] mx-auto rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-4 justify-center">
                {aboutUs.hospitalWorkingTeam.map((teamMember) => (
                  <div key={teamMember.id} className="flex flex-col items-center text-center space-y-3 p-4 hover:scale-102 transition-transform duration-200">
                    <div className="size-40 rounded-full overflow-hidden border-4 border-emerald-500/15 shadow-md bg-slate-50 p-1 flex items-center justify-center">
                      <img src={teamMember.photoUrl} alt={teamMember.name || (teamMember as any).title} className="size-full object-cover rounded-full" referrerPolicy="no-referrer" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-[#006830]">{teamMember.name || (teamMember as any).title}</h4>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{teamMember.role || 'Team Member'}</p>
                      {teamMember.phone && (
                        <p className="text-xs font-bold text-blue-700 font-mono mt-1">
                          📱 {teamMember.phone}
                        </p>
                      )}
                      {teamMember.time && (
                        <p className="text-[11px] font-bold text-gray-600 bg-slate-100 py-1 px-2.5 rounded-full mt-1.5 inline-block">
                          ⏰ Shift: {teamMember.time}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meet Our Doctor Form webpage section component */}
            <div id="about-meet-doctor" className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-md space-y-6 scroll-mt-24 text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-3xl font-black text-[#006830] tracking-tight">
                    Meet Our Doctor & Instant Booking Panel
                  </h2>
                  <p className="text-xs text-gray-500 font-semibold mt-1">Select your specialist clinician to initiate instant reservation directly to their active WhatsApp line.</p>
                </div>
                <span className="text-xs bg-[#00A64C] text-white font-black py-1 px-3 rounded-full uppercase tracking-wider shrink-0">
                  Direct SMS Service
                </span>
              </div>

              {meetSuccessMsg && (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-emerald-600 animate-bounce" />
                    <strong className="text-sm font-black">बुकिङ अनुरोध सफलता पुर्वक दर्ता र फरवार्ड भयो !</strong>
                  </div>
                  <p className="text-xs text-emerald-700 font-bold leading-normal">
                    The appointment request details have been logged in the hospital's priority administrative desk registry and forwarded to the doctor's official WhatsApp client successfully!
                  </p>
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!meetPatientName || !meetContact || !meetWhatsapp || !meetAddress) {
                    alert("Please fill in Patient Name, Contact Number, WhatsApp and Address.");
                    return;
                  }

                  const selectedDocObj = doctors.find(dr => dr.name === meetDocName);
                  const rawNo = (selectedDocObj?.number || '9851012345').replace(/\D/g, '');
                  const finalDoctorPhone = rawNo.startsWith('977') ? rawNo : `977${rawNo}`;

                  const bookingText = `प्रणाम डाक्टर साप, म तपाईंको ओपिडी सेवाको लागि अनलाइन बुकिङ गर्दैछु।
                  
📋 मेरो विवरण निम्नलिखित छ:
----------------------------------
👤 बिरामीको नाम: ${meetPatientName}
📞 सम्पर्क फोन नम्बर: ${meetContact}
💬 व्हाट्सएप नम्बर: ${meetWhatsapp}
📍 ठेगाना: ${meetAddress}
📅 बुकिङ गरिएको बार: ${meetDay}
⏰ बुकिङ समय: ${meetTime}

🏥 विभाग: ${meetDept || 'General Medicine'}
🩺 विशेषज्ञ चिकित्सक: ${meetDocName || 'Specialist Officer'}
✉ बिरामीको गुनासो/लक्षण: ${meetMessage || 'N/A'}

[यो बुकिङ अनुरोध अस्पतालको डिजिटल डेस्क वेबपेजबाट स्वचालित रूपमा तयार पारिएको हो। कृपया मेरो अपोइन्टमेन्ट समय निश्चित गरिदिनुहोला। ]`;

                  const encodedText = encodeURIComponent(bookingText);
                  const waLink = `https://wa.me/${finalDoctorPhone}?text=${encodedText}`;

                  const newRequest: BookingRequest = {
                    id: 'doc-req-' + Date.now(),
                    patientName: meetPatientName,
                    patientEmail: meetEmail || 'not-provided@hospital.org',
                    patientNumber: meetContact,
                    whatsappNumber: meetWhatsapp,
                    address: meetAddress,
                    bookingType: 'Doctor Consultation',
                    selectedItem: meetDocName,
                    amountToPay: '500',
                    paymentMethod: 'Cash on Hospital',
                    status: 'pending',
                    doctorType: meetDept,
                    doctorName: meetDocName,
                    day: meetDay,
                    time: meetTime,
                    message: meetMessage || 'Meet Doctor SMS request',
                    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
                  };

                  handleAddBooking(newRequest);
                  setMeetSuccessMsg(true);

                  try {
                    window.open(waLink, '_blank');
                  } catch (err) {
                    const tempAnchor = document.createElement('a');
                    tempAnchor.href = waLink;
                    tempAnchor.target = '_blank';
                    tempAnchor.rel = 'noopener noreferrer';
                    tempAnchor.click();
                  }

                  setMeetPatientName('');
                  setMeetEmail('');
                  setMeetContact('');
                  setMeetWhatsapp('');
                  setMeetAddress('');
                  setMeetMessage('');

                  setTimeout(() => {
                    setMeetSuccessMsg(false);
                  }, 8000);
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-gray-150">
                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase text-gray-500">1. Select Specialty Department *</label>
                    <select
                      required
                      value={meetDept}
                      onChange={e => setMeetDept(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 font-bold focus:ring-1 focus:ring-[#00A64C]"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase text-gray-500">2. Select Specialist Doctor *</label>
                    <select
                      required
                      disabled={!meetDept}
                      value={meetDocName}
                      onChange={e => setMeetDocName(e.target.value)}
                      className="w-full bg-white disabled:bg-gray-100 border border-gray-200 text-xs px-3 py-2.5 rounded-xl text-emerald-800 font-bold focus:ring-1 focus:ring-[#00A64C]"
                    >
                      <option value="">-- Allocated Doctor --</option>
                      {meetFilteredDocs.map((dr) => (
                        <option key={dr.id} value={dr.name}>{dr.name} ({dr.level})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase text-gray-500">3. Select Appointment Day *</label>
                    <select
                      value={meetDay}
                      onChange={e => setMeetDay(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 font-semibold focus:ring-1 focus:ring-[#00A64C]"
                    >
                      {daysList.map((day, idx) => (
                        <option key={idx} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase text-gray-500">4. Select Preferred Time *</label>
                    <select
                      value={meetTime}
                      onChange={e => setMeetTime(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs px-3 py-2.5 rounded-xl text-slate-800 font-semibold focus:ring-1 focus:ring-[#00A64C]"
                    >
                      {timesList.map((time, idx) => (
                        <option key={idx} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <h4 className="text-xs font-black text-[#006830] uppercase tracking-wider">
                    5. Personal Contact Information Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">Patient Full name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="बिरामीको पुरा नाम"
                        value={meetPatientName}
                        onChange={e => setMeetPatientName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">Contact Calling Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        required
                        placeholder="सम्पर्क फोन नम्बर"
                        value={meetContact}
                        onChange={e => setMeetContact(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">WhatsApp Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        required
                        placeholder="सम्पर्क व्हाट्सएप नम्बर"
                        value={meetWhatsapp}
                        onChange={e => setMeetWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">Suburb / City / District <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. निल��ण्ठ-३, धादिङ"
                        value={meetAddress}
                        onChange={e => setMeetAddress(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="बिरामीको इमेल"
                        value={meetEmail}
                        onChange={e => setMeetEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl bg-white font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700">Country Desk Selection *</label>
                      <input
                        type="text"
                        disabled
                        value="Nepal"
                        className="w-full px-3.5 py-2 text-xs border border-gray-150 rounded-xl bg-gray-50 text-gray-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Symptoms & Medical Message Note *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="चिकित्सकलाई जानकारी दिनको लागि समस्या वा लक्षण संक्षिप्तमा लेख्नुहोस्..."
                      value={meetMessage}
                      onChange={e => setMeetMessage(e.target.value)}
                      className="w-full px-4 py-3 text-xs border border-gray-200 rounded-2xl bg-white font-medium focus:ring-1 focus:ring-[#00A64C] resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#25D366] hover:bg-[#075e54] text-white py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-md uppercase tracking-wide hover:scale-[1.01] active:scale-[0.99] duration-150"
                  >
                    <MessageCircle className="size-5 shrink-0 fill-current" />
                    Send SMS & Reserve Appointment Now
                  </button>
                </div>
              </form>
            </div>

            {/* Careers text box */}
            <div id="about-careers" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md space-y-4 scroll-mt-24">
              <h2 className="text-3xl font-black text-[#006830] relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-20 after:bg-[#00A64C] tracking-tight">
                Careers & Opportunities
              </h2>
              <div className="p-6 border-l-4 border-yellow-500 bg-yellow-50 text-sm sm:text-base text-yellow-900 rounded-r-2xl whitespace-pre-wrap font-bold leading-relaxed shadow-sm">
                {aboutUs.careersText}
              </div>
            </div>

          </div>
        )}

        {/* Patients Tab view */}
        {activeTab === 'patient' && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
            
            {/* 5a Admission text */}
            <div id="patient-admission" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md space-y-4 scroll-mt-24">
              <h2 className="text-3xl font-black text-[#006830] relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-20 after:bg-[#00A64C] tracking-tight">
                Patient Admission Desk Instructions
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100">
                {patientData.admissionDeskText}
              </p>
            </div>

            {/* 5b Appointment files */}
            <div id="patient-appointment" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md space-y-6 scroll-mt-24">
              <h2 className="text-3xl font-black text-[#006830] relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-20 after:bg-[#00A64C] tracking-tight">
                Patient Appointment Guides & Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {patientData.appointment.map((apt) => (
                  <div key={apt.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-md bg-slate-50 relative">
                    {apt.imageUrl && (
                      <img src={apt.imageUrl} alt={apt.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-5 space-y-3">
                      <h4 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">{apt.title}</h4>
                      {apt.pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setActivePdfUrl(apt.pdfUrl);
                            setActivePdfTitle(apt.title || 'Patient Appointment Guide');
                          }}
                          className="bg-[#00A64C] hover:bg-[#006830] text-white py-1.5 px-3 rounded text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="size-3" /> View Guide PDF Document
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Visitor Tab View */}
        {activeTab === 'visitors' && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
            
            {/* Visiting Hour */}
            <div id="visitor-hours" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md space-y-6 scroll-mt-24">
              <h2 className="text-3xl font-black text-[#006830] relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-20 after:bg-[#00A64C] tracking-tight">
                Visiting Hours & Guidelines
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {visitorData.visitHour.map((vh) => (
                  <div key={vh.id} className="border rounded-2xl overflow-hidden shadow-md">
                    <img src={vh.imageUrl} alt="guides" className="w-full h-56 object-cover" />
                    <p className="p-4 text-sm sm:text-base font-extrabold text-slate-800 bg-slate-50 text-center">{vh.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Do's and Dont's */}
            <div id="visitor-rules" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md space-y-6 scroll-mt-24">
              <h2 className="text-3xl font-black text-[#006830] relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-20 after:bg-[#00A64C] tracking-tight">
                Hospital Rules & Regulations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {visitorData.dosAndDonts.map((dd) => (
                  <div key={dd.id} className="border rounded-2xl overflow-hidden bg-slate-50 shadow-md">
                    <img src={dd.imageUrl} alt={dd.title} className="w-full h-48 object-cover" />
                    <div className="p-5 space-y-3 text-center">
                      <h4 className="font-extrabold text-base sm:text-lg text-gray-900 leading-snug">{dd.title}</h4>
                      {dd.pdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setActivePdfUrl(dd.pdfUrl);
                            setActivePdfTitle(dd.title || 'Hospital Rules & Regulations');
                          }}
                          className="bg-[#00A64C] hover:bg-[#006830] text-white rounded-lg py-2.5 px-4 text-xs sm:text-sm font-black transition-colors inline-flex items-center gap-1.5 shadow-md shadow-emerald-100 cursor-pointer"
                        >
                          <Eye className="size-4" /> View PDF Regulations
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parking */}
            <div id="visitor-parking" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-md space-y-6 scroll-mt-24">
              <h2 className="text-3xl font-black text-[#006830] relative pb-3 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-20 after:bg-[#00A64C] tracking-tight">
                Visitor Parking & Ambulance Access
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {visitorData.parking.map((pk) => (
                  <div key={pk.id} className="border rounded-2xl overflow-hidden shadow-md">
                    <img src={pk.imageUrl} alt="guides" className="w-full h-56 object-cover" />
                    <p className="p-4 text-sm sm:text-base font-extrabold text-slate-800 bg-slate-50 text-center">{pk.title}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* News Tab View */}
        {activeTab === 'news' && (
          <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
            
            {/* 8) News updates */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[#00A64C] font-black uppercase text-xs">Stay Informed</span>
                <h2 className="text-3xl font-black text-[#006830] tracking-tight">Dhading Hospital Press Releases & Camp Events</h2>
                <span className="inline-block h-1 w-20 bg-[#00A64C] rounded-full"></span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                {news.map((item) => (
                  <article 
                    key={item.id} 
                    onClick={() => setActiveNewsDetail(item)}
                    className="bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer border-gray-200"
                  >
                    <div>
                      <div className="relative overflow-hidden aspect-video">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
                        />
                        <span className="absolute top-3 left-3 bg-[#006830]/90 backdrop-blur-xs text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-full tracking-wider">
                          🗓️ {item.timeDate}
                        </span>
                      </div>
                      
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mt-1 block">
                          Press Notification
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-[#006830] tracking-tight leading-snug group-hover:text-[#00A64C] transition-colors line-clamp-3">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-gray-50 bg-slate-55/40 text-left">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveNewsDetail(item);
                        }}
                        className="text-xs font-black text-[#00A64C] group-hover:text-[#006830] transition-colors inline-flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                      >
                        Read Article <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Gallery Tab View */}
        {activeTab === 'gallery' && (
          <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
            
            {/* 7a Photo gallery */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[#00A64C] font-black uppercase text-xs">Visual Portals</span>
                <h3 className="text-3xl font-black text-[#006830] tracking-tight">Our Feature Photo Gallery</h3>
                <span className="inline-block h-1 w-20 bg-[#00A64C] rounded-full"></span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pt-4">
                {gallery.map((g) => (
                  <div key={g.id} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs border border-gray-150 group relative">
                    <div className="h-28 sm:h-56 relative overflow-hidden">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="p-2 sm:p-3 text-[10px] sm:text-xs font-bold text-gray-800 bg-slate-50 text-center truncate">{g.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7b Video gallery */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[#00A64C] font-black uppercase text-xs">Video Streams</span>
                <h3 className="text-3xl font-black text-[#006830] tracking-tight">Dhading Hospital Social Video Channels</h3>
                <span className="inline-block h-1 w-20 bg-[#00A64C] rounded-full"></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {videos.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    {/* Embedded Iframe Player */}
                    <div className="aspect-video bg-black">
                      <iframe
                        src={parseVideoEmbed(v.videoUrl)}
                        title={v.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <p className="p-3.5 text-xs font-black text-gray-800 bg-slate-50">{v.title}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Machine Gallery Tab View */}
        {activeTab === 'machines' && (
          <div className="max-w-6xl mx-auto px-4 py-10 space-y-12 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <span className="text-[#00A64C] font-black uppercase text-xs tracking-widest font-mono">Precision Medical Infrastructure</span>
              <h3 className="text-3xl font-black text-[#006830] tracking-tight">Our Modern Medical Equipment & Lab Machines</h3>
              <span className="inline-block h-1 w-20 bg-[#00A64C] rounded-full"></span>
              <p className="text-xs text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed pt-1">
                Dhading Hospital is equipped with international-grade diagnostic and operative systems ensuring accurate investigations and rapid life support response. Click on any machine item to launch its diagnostic dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {machines.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMachineDashboard(m)}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-48 sm:h-56 relative overflow-hidden bg-slate-50 border-b border-gray-100">
                      <img
                        src={m.imageUrl}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span className="text-xs text-white font-black uppercase tracking-wider backdrop-blur-xs bg-black/40 py-1.5 px-3 rounded-full">
                          Click to Launch Dashboard Panel
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-2 text-left">
                      <h4 className="text-base sm:text-lg font-black text-[#006830] leading-snug group-hover:text-[#00A64C] transition-colors">{m.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-3">
                        {m.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 text-left">
                    <span className="text-[11px] font-black text-rose-600 bg-rose-50 py-1.5 px-3.5 rounded-full inline-flex items-center gap-1 group-hover:bg-[#00A64C] group-hover:text-white transition-colors duration-350">
                      🔬 Explore Device Matrix →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Immersive Dashboard Modal Panel (Left: Pic, Right: Details) */}
            {selectedMachineDashboard && (
              <div className="fixed inset-0 bg-black/75 z-55 flex items-center justify-center p-4 sm:p-6 md:p-8 backdrop-blur-xs animate-in fade-in duration-250">
                <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-250 flex flex-col md:flex-row relative animate-in zoom-in-95 duration-300 max-h-[90vh] md:max-h-[85vh]">
                  
                  {/* Close floating button */}
                  <button
                    onClick={() => setSelectedMachineDashboard(null)}
                    className="absolute top-4 right-4 bg-slate-900/80 hover:bg-black text-white hover:scale-105 transition-all p-2 rounded-full cursor-pointer z-50 shadow-md"
                    title="Close Screen"
                  >
                    <X className="size-5" />
                  </button>

                  {/* Left Side: Picture Column */}
                  <div className="w-full md:w-1/2 bg-slate-50 relative flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-200 min-h-[250px] sm:min-h-[350px] md:min-h-[auto]">
                    <img
                      src={selectedMachineDashboard.imageUrl}
                      alt={selectedMachineDashboard.title}
                      className="w-full h-full object-cover absolute top-0 left-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-left text-white max-w-md">
                      <span className="text-[10px] bg-emerald-600/90 text-white font-mono uppercase tracking-widest font-black px-2.5 py-1 rounded-sm">
                        Active Operation Mode
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase mt-2">{selectedMachineDashboard.title}</h4>
                    </div>
                  </div>

                  {/* Right Side: Specifications and Benefits Dashboard */}
                  <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[100%]">
                    <div className="space-y-6 text-left">
                      <div className="border-b border-gray-100 pb-4">
                        <span className="text-[10px] bg-[#00A64C]/10 text-[#006830] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block">
                          Diagnostic Core Matrix
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#006830] tracking-tight mt-1 leading-snug">
                          {selectedMachineDashboard.title}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest block font-mono">
                          Equipment Specifications & Overview:
                        </span>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                          {selectedMachineDashboard.description}
                        </p>
                      </div>

                      <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                        <p className="text-xs text-gray-650 leading-relaxed font-semibold">
                          🌟 <strong>Guaranteed Quality System:</strong> This machine is calibrated every morning by our biomedical calibration engineers in correspondence with ISO 9001-2015 diagnostic protocols. Reports are available immediately.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setSelectedMachineDashboard(null)}
                        className="w-full sm:flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Keep Browsing
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingPrefill({
                            dept: 'All Department Specials',
                            doc: 'Duty Consultant Hour',
                            day: 'Sunday',
                            time: 'Duty Consultant Hour'
                          });
                          setSelectedMachineDashboard(null);
                          setActiveTab('home');
                          setTimeout(() => {
                            setShowBookModal(true);
                          }, 150);
                        }}
                        className="w-full sm:flex-1 bg-[#00A64C] hover:bg-[#006830] text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                      >
                        Book Appointment ✓
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* Price list Tab View */}
        {activeTab === 'price-list' && (() => {
          const filteredPrices = DETAILED_PRICE_LIST.filter(item =>
            item.name.toLowerCase().includes(priceSearchQuery.toLowerCase())
          );
          const itemsPerPage = 20;
          const totalPages = Math.ceil(filteredPrices.length / itemsPerPage);
          const currentPageNormalized = Math.max(1, Math.min(priceCurrentPage, totalPages || 1));
          const offset = (currentPageNormalized - 1) * itemsPerPage;
          const paginatedPrices = filteredPrices.slice(offset, offset + itemsPerPage);

          return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
              <div className="text-center space-y-3">
                <span className="text-[#00A64C] font-extrabold uppercase text-xs tracking-widest block">Dhading Hospital</span>
                <h2 className="text-3xl font-black text-[#006830]">Official Medical Test Price List</h2>
                <div className="flex justify-center items-center gap-2.5 text-xs text-gray-500 font-bold">
                  <span>How Can We Help?</span>
                  <span className="h-3 w-px bg-gray-300"></span>
                  <a href="tel:+97714981133" className="text-[#00A64C] hover:underline font-black">+977-1-4981133</a>
                </div>
                <span className="inline-block h-1.5 w-24 bg-[#00A64C] rounded-full mt-1"></span>
              </div>

              {/* Price list search & details */}
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-150 shadow-xs space-y-6">
                
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={priceSearchQuery}
                    onChange={(e) => {
                      setPriceSearchQuery(e.target.value);
                      setPriceCurrentPage(1);
                    }}
                    placeholder="Search diagnostic tests, cabins, OPD checkups..."
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#00A64C] focus:border-[#00A64C] text-sm text-gray-905 placeholder-gray-400 transition-all font-medium"
                  />
                  {priceSearchQuery && (
                    <button 
                      onClick={() => {
                        setPriceSearchQuery('');
                        setPriceCurrentPage(1);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-450 hover:text-gray-600 font-black"
                    >
                      CLEAR
                    </button>
                  )}
                </div>

                {/* Desktop and Tablet screens (Table Layout) */}
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-gray-150">
                  <table className="min-w-full divide-y divide-gray-150 text-left">
                    <thead className="bg-[#006830] text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider w-[80px] text-center">S.N.</th>
                        <th scope="col" className="px-4 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider">TESTNAME</th>
                        <th scope="col" className="px-4 py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-right w-[160px]">GENERALRATE</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedPrices.length > 0 ? (
                        paginatedPrices.map((item, index) => {
                          const serialNumber = offset + index + 1;
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3 text-xs sm:text-sm text-gray-500 font-mono text-center">{serialNumber}</td>
                              <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-950">{item.name}</td>
                              <td className="px-4 py-3 text-xs sm:text-sm font-black text-[#006830] text-right font-mono">{item.rate}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400 font-medium">
                            No medical procedures matched "{priceSearchQuery}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile screens only (Flexible List Card Layout) - Solves zooming & overflow on phone */}
                <div className="block sm:hidden space-y-3">
                  {paginatedPrices.length > 0 ? (
                    paginatedPrices.map((item, index) => {
                      const serialNumber = offset + index + 1;
                      return (
                        <div 
                          key={item.id} 
                          className="p-4 bg-slate-55/65 hover:bg-slate-50 border border-gray-150 rounded-2xl flex justify-between items-center gap-3 transition-colors"
                        >
                          <div className="space-y-1 min-w-0">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-[#006830] font-mono">
                              S.N: {serialNumber}
                            </span>
                            <h4 className="text-xs font-black text-gray-900 leading-snug break-words">{item.name}</h4>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider mb-0.5">Rate</span>
                            <span className="text-sm font-black text-[#006830] font-mono leading-none">{item.rate}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-xs text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-2xl">
                      No medical procedures matched "{priceSearchQuery}"
                    </div>
                  )}
                </div>

                {/* Pagination and summary */}
                {filteredPrices.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <span className="text-xs text-gray-500 font-bold">
                      Showing <span className="text-gray-900 font-extrabold">{offset + 1}</span> to{' '}
                      <span className="text-gray-900 font-extrabold">
                        {Math.min(offset + itemsPerPage, filteredPrices.length)}
                      </span>{' '}
                      of <span className="text-gray-900 font-extrabold">{filteredPrices.length}</span> tests
                    </span>

                    {totalPages > 1 && (
                      <div className="flex items-center gap-1.5 self-center">
                        <button
                          type="button"
                          disabled={currentPageNormalized === 1}
                          onClick={() => setPriceCurrentPage(prev => Math.max(prev - 1, 1))}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          Prev
                        </button>
                        
                        {/* Page Numbers */}
                        {(() => {
                          const pages = [];
                          const maxVisiblePages = 3;
                          let startPage = Math.max(1, currentPageNormalized - 1);
                          let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                          if (endPage - startPage < maxVisiblePages - 1) {
                            startPage = Math.max(1, endPage - maxVisiblePages + 1);
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <button
                                key={i}
                                type="button"
                                onClick={() => setPriceCurrentPage(i)}
                                className={`h-8 w-8 text-xs font-black rounded-lg transition-all ${
                                  currentPageNormalized === i
                                    ? 'bg-[#006830] text-white shadow-xs'
                                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-slate-50'
                                }`}
                              >
                                {i}
                              </button>
                            );
                          }
                          return pages;
                        })()}

                        <button
                          type="button"
                          disabled={currentPageNormalized === totalPages}
                          onClick={() => setPriceCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Booking Callout */}
              <div className="bg-gradient-to-r from-[#006830]/8 to-[#00A64C]/8 border border-[#006830]/10 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="space-y-1">
                  <h4 className="text-[#006830] font-black text-sm sm:text-base">Need to get tested or consult a specialized doctor?</h4>
                  <p className="text-xs text-gray-500 font-medium">Request an appointment online or by phone quickly with our diagnostics team.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="tel:+97714981133"
                    className="bg-white border border-[#006830]/20 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
                  >
                    <Phone className="size-3.5" /> Call Hotline
                  </a>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="bg-[#006830] hover:bg-[#00A64C] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    View Appointment desk <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })()}

        {/* Contact Tab View */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            
            <div className="text-center space-y-2">
              <span className="text-[#00A64C] font-black uppercase text-xs">Reach out 24/7</span>
              <h2 className="text-3xl font-black text-[#006830] tracking-tight">Contact Dhading Hospital Pvt. Ltd.</h2>
              <span className="inline-block h-1 w-20 bg-[#00A64C] rounded-full"></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4">
              
              {/* Official Registry Contacts Section */}
              <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[#006830] flex items-center gap-2 uppercase">
                    <ShieldCheck className="size-6 text-[#00A64C]" /> Official Contact Registry
                  </h3>
                  <p className="text-gray-500 text-xs font-bold leading-relaxed">Direct communication channels for specialized hospital departments and administration.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {(contact.officialContacts || []).map((oc) => (
                    <div key={oc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">{oc.title}</h4>
                        <p className="text-sm font-bold text-slate-800">{oc.email}</p>
                      </div>
                      <div className="flex gap-2">
                        {oc.whatsapp && (
                          <a
                            href={getWhatsAppLink(oc.whatsapp, oc.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-2.5 rounded-xl transition-colors cursor-pointer border border-emerald-100"
                            title="WhatsApp Chat"
                          >
                            <MessageCircle className="size-4 fill-emerald-700 text-emerald-50" />
                          </a>
                        )}
                        <a
                          href={`mailto:${oc.email}`}
                          className="bg-[#00A64C] hover:bg-[#006830] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          <Mail className="size-3.5" /> Mail garnu hos
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#006830]">Send us a message</h3>
                  <p className="text-gray-500 text-xs">Fill out the form below and we'll get back to you as soon as possible.</p>
                </div>

                <form className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Full Name"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A64C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-400">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Your Email"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A64C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-400">Subject</label>
                    <input 
                      type="text" 
                      placeholder="Message Subject"
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A64C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-gray-400">Message</label>
                    <textarea 
                      placeholder="How can we help you?"
                      rows={4}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A64C] resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-[#00A64C] hover:bg-[#006830] text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <Mail className="size-5" />
                    Mail garnu hos (Send Mail)
                  </button>
                </form>
              </div>

              {/* Info columns */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#006830]">Official Medical coordinates</h3>
                  <p className="text-gray-500 text-xs">For RTA emergencies or advanced reservations call clinical coordination counters.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <MapPin className="size-6 text-[#00A64C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs uppercase text-gray-400 font-black">Location Address</strong>
                      <span className="text-slate-800 text-sm font-bold">{contact.address}</span>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start font-mono">
                    <Phone className="size-6 text-[#00A64C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs uppercase text-gray-400 font-sans font-black">Direct Contacts</strong>
                      <span className="text-slate-800 text-sm font-bold">{contact.phone} | {contact.secondaryPhone}</span>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <Mail className="size-6 text-[#00A64C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs uppercase text-gray-400 font-black">Official Email ID</strong>
                      <span className="text-slate-800 text-sm font-bold">{contact.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    <Clock className="size-6 text-[#00A64C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs uppercase text-gray-400 font-black">Roster timing specifications</strong>
                      <span className="text-slate-800 text-xs leading-normal font-bold">{contact.workingHours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <span className="text-xs text-gray-400 block font-bold">24-hour stand-by assistance helpline</span>
                  <a href={`tel:${contact.ambulancePhone}`} className="text-xl font-black text-[#006830] hover:underline font-mono">
                    Ambulance Call: {contact.ambulancePhone}
                  </a>
                </div>
              </div>

            </div>

            {/* Embed Google Map MapPin frame */}
            <div className="bg-slate-200 rounded-3xl overflow-hidden shadow-sm h-[400px]">
              <iframe
                src={contact.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Dhading Hospital Google Map Location"
              ></iframe>
            </div>
          </div>
        )}

      </span>

      {/* 2) Dynamic Footer Module inside Front page */}
      <Footer
        settings={settings}
        contact={contact}
        onAdminClick={() => setShowAdminLogin(true)}
        setActiveTab={setActiveTab}
      />


      {/* -------------------------------------------------------------
          ADMIN CONSOLE SIGN-IN OVERLAY DIALOGUE
      ------------------------------------------------------------- */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1e1e1e] text-gray-200 border border-gray-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-[#006830] text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-yellow-300 animate-pulse" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Secure Administrative Login</h3>
              </div>
              <button 
                onClick={() => { setShowAdminLogin(false); setLoginError(''); }}
                className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400 leading-normal">
                Dhading Hospital administrative controls are protected for safety purposes. Type passkey to proceed. 
                <br/>
                <span className="text-slate-500 text-[10px]">Preset default: <strong>admin</strong> (or use recovery bypass)</span>
              </p>

              {loginError && (
                <div className="bg-red-950 text-red-400 text-xs p-3.5 rounded-xl border border-red-900 leading-snug font-semibold">
                  ⚠️ {loginError}
                </div>
              )}

              <form onSubmit={handleAdminVerify} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-gray-400">Authentication Passkey</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    className="w-full bg-[#141414] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A64C] text-white"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowAdminLogin(false); setLoginError(''); }}
                    className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#2d2d2d] hover:bg-gray-800 transition-colors cursor-pointer text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#00A64C] hover:bg-[#006830] transition-colors text-white cursor-pointer"
                  >
                    Verify Pass
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* -------------------------------------------------------------
          SECURE ONLINE PDF VIEWER MODAL
      ------------------------------------------------------------- */}
      {activePdfUrl && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity"
          onClick={() => { setActivePdfUrl(null); }}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] sm:h-[85vh] max-h-[900px] flex flex-col shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Control Bar */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="bg-[#00A64C] p-2 rounded-xl text-white">
                  <Eye className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight line-clamp-1">
                    {activePdfTitle || 'Document Viewer'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">Dhading Hospital Secure Portal Web Reader — View Only Mode</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => { setActivePdfUrl(null); }}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
                title="Close document reader"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Secure Viewing Alert Bar */}
            <div className="bg-[#00A64C]/10 border-b border-[#00A64C]/15 px-5 py-2.5 flex items-center justify-between text-xs text-[#006830] font-bold">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-[#00A64C]" />
                सञ्चार/कागजात हेर्नुहोस् (Direct Web View - This document parses as interactive content entries)
              </span>
              <span className="hidden sm:inline text-[10px] text-gray-400 font-medium">Copying/Downloading disabled for records</span>
            </div>

            {/* Content IFrame */}
            <div className="flex-1 w-full h-full bg-slate-100 relative">
              <iframe
                src={`${activePdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                title={activePdfTitle}
                className="w-full h-full border-0"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Footer Bar */}
            <div className="bg-slate-50 px-5 py-3 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
              <span>Dhading Hospital Portal Document Security Module</span>
              <button 
                onClick={() => { setActivePdfUrl(null); }}
                className="text-xs font-bold text-[#00A64C] hover:underline"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}


      {/* -------------------------------------------------------------
          FULL PATIENT BOOKING MODAL TRIGGER
      ------------------------------------------------------------- */}
      <InquiryModal
        categories={categories}
        doctors={doctors}
        preventiveHealth={services.preventiveHealth || []}
        qrCodes={qrCodes}
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSubmit={handleAddBooking}
        defaultDept={bookingPrefill.dept}
        defaultDoc={bookingPrefill.doc}
        defaultDay={bookingPrefill.day}
        defaultTime={bookingPrefill.time}
      />

      {/* -------------------------------------------------------------
          EVENT DETAILS DIALOG/MODAL
      ------------------------------------------------------------- */}
      {activeEventDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden border border-gray-150 shadow-2xl space-y-0 transform transition-all duration-300 relative">
            {/* Header image with close button */}
            <div className="relative aspect-video w-full bg-slate-950 border-b border-gray-100">
              <img 
                src={activeEventDetail.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'} 
                alt={activeEventDetail.title} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setActiveEventDetail(null)}
                className="absolute top-4 right-4 bg-black/60 text-white hover:bg-[#006830] transition-colors p-2 rounded-full cursor-pointer h-10 w-10 flex items-center justify-center font-black text-lg shadow-md hover:scale-105 active:scale-95 duration-100"
                title="Close"
              >
                ✕
              </button>
              
              <div className="absolute bottom-4 left-4">
                <span className="bg-[#00a64c] text-white px-3 py-1 rounded-xl text-xs font-black font-mono shadow-md">
                  {activeEventDetail.day} {activeEventDetail.monthYear}
                </span>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-8 space-y-4 text-left">
              <span className="text-[#00A64C] text-xs font-black uppercase tracking-widest block font-mono">
                ★ Dhading Hospital DC Event Details
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#006830] leading-tight font-sans">
                {activeEventDetail.title}
              </h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                {activeEventDetail.subtitle || "No further descriptions are published for this clinical release."}
              </p>

              {/* Action details */}
              <div className="p-4 bg-slate-50 border border-gray-150 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-[#006830] font-bold text-xs">Do you have questions about our upcoming health camps?</h4>
                  <p className="text-[10px] text-gray-400 font-semibold">Connect directly with our 24/7 client relations coordinator.</p>
                </div>
                <a 
                  href="tel:+977-10-520111"
                  className="bg-[#006830] hover:bg-[#00A64C] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-colors cursor-pointer text-center w-full sm:w-auto"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Bottom Info bar */}
            <div className="bg-slate-50 border-t border-gray-100 px-6 py-4 flex justify-end">
              <button 
                type="button"
                onClick={() => setActiveEventDetail(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          NEWS DETAILS DIALOG/MODAL WITH PHOTO GALLERY VIEWER
      ------------------------------------------------------------- */}
      <NewsDetailModal
        newsItem={activeNewsDetail}
        isOpen={activeNewsDetail !== null}
        onClose={() => setActiveNewsDetail(null)}
      />

      {/* -------------------------------------------------------------
          APP-STYLE BOTTOM NAVIGATION BAR (Mobile Views Only)
      ------------------------------------------------------------- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-150 py-1.5 px-4 flex justify-between items-center shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
        {[
          { tab: 'home', label: 'Home', icon: <Building className="size-5" /> },
          { tab: 'services', label: 'Services', icon: <Stethoscope className="size-5" /> },
          { tab: 'booking', label: 'Book Now', icon: <Calendar className="size-5 text-white" />, special: true },
          { tab: 'doctors', label: 'Doctors', icon: <Users className="size-5" /> },
          { tab: 'price-list', label: 'Rates', icon: <Eye className="size-5" /> }
        ].map((item, idx) => {
          if (item.special) {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setShowBookModal(true)}
                className="flex flex-col items-center justify-center -mt-6 cursor-pointer group"
              >
                <div className="bg-[#00A64C] text-white p-3.5 rounded-full shadow-lg shadow-emerald-700/20 hover:bg-[#006830] transition-colors hover:scale-105 active:scale-95 duration-150">
                  {item.icon}
                </div>
                <span className="text-[9px] font-black text-slate-800 mt-1 uppercase tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          }

          const isActive = activeTab === item.tab;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-[#00A64C] font-black' 
                  : 'text-gray-400 hover:text-gray-650 font-bold'
              }`}
            >
              <div className="transition-transform group-active:scale-95">
                {item.icon}
              </div>
              <span className="text-[9px] mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
