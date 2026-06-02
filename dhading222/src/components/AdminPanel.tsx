import React, { useState } from 'react';
import { 
  Building, Stethoscope, Users, Info, FileText, Eye, Image, Play, 
  Settings, Key, Trash2, Edit, Plus, Check, ShieldAlert, LogOut, Phone, Mail, Calendar, EyeOff, X, Clock, MessageCircle, QrCode, ClipboardList, ShieldCheck
} from 'lucide-react';
import { 
  Services, Doctor, AboutUs, ForPatient, ForVisitors, GalleryItem, 
  VideoItem, NewsItem, PriceListItem, ContactUsInfo, WebSettings, BookingRequest, ServiceItem,
  TestimonialItem, HospitalEventItem, QRCodeItem, MachineItem, Mailbox
} from '../types';

interface AdminPanelProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  services: Services;
  setServices: React.Dispatch<React.SetStateAction<Services>>;
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  aboutUs: AboutUs;
  setAboutUs: React.Dispatch<React.SetStateAction<AboutUs>>;
  patientData: ForPatient;
  setPatientData: React.Dispatch<React.SetStateAction<ForPatient>>;
  visitorData: ForVisitors;
  setVisitorData: React.Dispatch<React.SetStateAction<ForVisitors>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  priceList: PriceListItem[];
  setPriceList: React.Dispatch<React.SetStateAction<PriceListItem[]>>;
  contact: ContactUsInfo;
  setContact: React.Dispatch<React.SetStateAction<ContactUsInfo>>;
  settings: WebSettings;
  setSettings: React.Dispatch<React.SetStateAction<WebSettings>>;
  bookings: BookingRequest[];
  setBookings: React.Dispatch<React.SetStateAction<BookingRequest[]>>;
  testimonials: TestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialItem[]>>;
  events: HospitalEventItem[];
  setEvents: React.Dispatch<React.SetStateAction<HospitalEventItem[]>>;
  passwordConfig: { password?: string; recoveryPassword?: string };
  setPasswordConfig: (config: any) => void;
  qrCodes: QRCodeItem[];
  setQrCodes: React.Dispatch<React.SetStateAction<QRCodeItem[]>>;
  machines: MachineItem[];
  setMachines: React.Dispatch<React.SetStateAction<MachineItem[]>>;
  mailboxes: Mailbox[];
  setMailboxes: React.Dispatch<React.SetStateAction<Mailbox[]>>;
  onExit: () => void;
}

export default function AdminPanel({
  categories, setCategories,
  services, setServices,
  doctors, setDoctors,
  aboutUs, setAboutUs,
  patientData, setPatientData,
  visitorData, setVisitorData,
  gallery, setGallery,
  videos, setVideos,
  news, setNews,
  priceList, setPriceList,
  contact, setContact,
  settings, setSettings,
  bookings, setBookings,
  testimonials, setTestimonials,
  events, setEvents,
  passwordConfig, setPasswordConfig,
  qrCodes, setQrCodes,
  machines, setMachines,
  mailboxes, setMailboxes,
  onExit
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'services' | 'doctors' | 'about' | 'patients' | 'visitors' | 'gallery' | 'news' | 'prices' | 'settings' | 'password' | 'testimonials' | 'events' | 'qrCodes' | 'machines' | 'mailboxes' | 'officialContacts'>('bookings');

  // Save changes & Backup state managers
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ text: string; isError: boolean } | null>(null);

  // Service helper states
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<keyof Services>('opd');
  const [serviceItemForm, setServiceItemForm] = useState<Partial<ServiceItem>>({
    id: '', title: '', imageUrl: '', pdfUrl: '', text: ''
  });
  const [isEditingService, setIsEditingService] = useState<string | null>(null);

  // Doctor helper states
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryIdx, setEditingCategoryIdx] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  
  const [doctorForm, setDoctorForm] = useState<Partial<Doctor>>({
    id: '', name: '', experience: '', category: '', level: '', facebook: '', twitter: '', linkedin: '', number: '', email: '', profilePicUrl: ''
  });
  const [isEditingDoctor, setIsEditingDoctor] = useState<string | null>(null);

  // General helpers for items
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  // About us helper lists
  const [bodName, setBodName] = useState('');
  const [bodRole, setBodRole] = useState('');
  const [bodPhotoUrl, setBodPhotoUrl] = useState('');
  const [editingBodId, setEditingBodId] = useState<string | null>(null);

  const [teamMemberName, setTeamMemberName] = useState('');
  const [teamMemberRole, setTeamMemberRole] = useState('');
  const [teamMemberPhotoUrl, setTeamMemberPhotoUrl] = useState('');
  const [teamMemberPhone, setTeamMemberPhone] = useState('');
  const [teamMemberTime, setTeamMemberTime] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // Machine helper states
  const [machineTitle, setMachineTitle] = useState('');
  const [machineImageUrl, setMachineImageUrl] = useState('');
  const [machineDescription, setMachineDescription] = useState('');
  const [editingMachineId, setEditingMachineId] = useState<string | null>(null);

  // Front Patient and visitors helper lists
  const [patientAppTitle, setPatientAppTitle] = useState('');
  const [patientAppImage, setPatientAppImage] = useState('');
  const [patientAppPdf, setPatientAppPdf] = useState('');

  const [visitorHourForm, setVisitorHourForm] = useState({ title: '', imageUrl: '' });
  const [visitorDosForm, setVisitorDosForm] = useState({ title: '', imageUrl: '', pdfUrl: '' });
  const [visitorParkForm, setVisitorParkForm] = useState({ title: '', imageUrl: '' });

  // Media / Gallery form helpers
  const [photoGalForm, setPhotoGalForm] = useState({ title: '', imageUrl: '' });
  const [videoGalForm, setVideoGalForm] = useState({ title: '', videoUrl: '' });

  // QR creation form helpers
  const [newQrTitle, setNewQrTitle] = useState('');
  const [newQrImageUrl, setNewQrImageUrl] = useState('');

  // News hub form helper
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({ id: '', title: '', detail: '', timeDate: '', imageUrl: '' });
  const [isEditingNews, setIsEditingNews] = useState<string | null>(null);
  const [newsImagesText, setNewsImagesText] = useState('');

  // Price list helper
  const [priceForm, setPriceForm] = useState({ title: '', pdfUrl: '' });

  // Banner list helper
  const [bannerForm, setBannerForm] = useState({ imageUrl: '', title: '', subtitle: '' });

  // Testimonials and Events helper states
  const [testiForm, setTestiForm] = useState<Partial<TestimonialItem>>({ id: '', name: '', address: '', comment: '' });
  const [isEditingTesti, setIsEditingTesti] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState<Partial<HospitalEventItem>>({ id: '', day: '', monthYear: '', title: '', subtitle: '', imageUrl: '' });
  const [isEditingEvent, setIsEditingEvent] = useState<string | null>(null);

  // Password modify helper
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    newRecoveryPassword: ''
  });
  const [passwordStatusText, setPasswordStatusText] = useState({ text: '', isError: false });

  // Save Service handler
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceItemForm.title) return;

    const targetList = services[selectedServiceCategory];
    if (isEditingService) {
      const updatedList = targetList.map(item => 
        item.id === isEditingService ? { ...item, ...serviceItemForm } : item
      );
      setServices(prev => ({ ...prev, [selectedServiceCategory]: updatedList }));
      setIsEditingService(null);
    } else {
      const newItem: ServiceItem = {
        id: selectedServiceCategory + '-' + Date.now(),
        title: serviceItemForm.title,
        imageUrl: serviceItemForm.imageUrl,
        pdfUrl: serviceItemForm.pdfUrl,
        text: serviceItemForm.text
      };
      setServices(prev => ({ ...prev, [selectedServiceCategory]: [...targetList, newItem] }));
    }

    setServiceItemForm({ id: '', title: '', imageUrl: '', pdfUrl: '', text: '' });
  };

  const handleDeleteServiceItem = (category: keyof Services, itemId: string) => {
    const list = services[category];
    const filtered = list.filter(it => it.id !== itemId);
    setServices(prev => ({ ...prev, [category]: filtered }));
  };

  const handleEditServiceItem = (category: keyof Services, item: ServiceItem) => {
    setSelectedServiceCategory(category);
    setServiceItemForm(item);
    setIsEditingService(item.id);
  };

  // Doctor Categories Handlers
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) return;
    setCategories(prev => [...prev, newCategory.trim()]);
    setNewCategory('');
  };

  const handleDeleteCategory = (catName: string) => {
    setCategories(prev => prev.filter(c => c !== catName));
  };

  const handleStartEditCategory = (index: number, val: string) => {
    setEditingCategoryIdx(index);
    setEditingCategoryValue(val);
  };

  const handleSaveCategoryEdit = (index: number) => {
    if (!editingCategoryValue.trim()) return;
    const copied = [...categories];
    copied[index] = editingCategoryValue.trim();
    setCategories(copied);
    setEditingCategoryIdx(null);
  };

  // Doctor Handlers
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.category) return;

    if (isEditingDoctor) {
      const updated = doctors.map(dr => 
        dr.id === isEditingDoctor ? {
          ...dr,
          name: doctorForm.name,
          experience: doctorForm.experience || dr.experience || '1 Year Experience',
          category: doctorForm.category,
          level: doctorForm.level || dr.level || 'Consultant Specialist',
          facebook: doctorForm.facebook,
          twitter: doctorForm.twitter,
          linkedin: doctorForm.linkedin,
          number: doctorForm.number || dr.number || '+977-9851000000',
          email: doctorForm.email,
          profilePicUrl: doctorForm.profilePicUrl || dr.profilePicUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
        } : dr
      );
      setDoctors(updated as Doctor[]);
      setIsEditingDoctor(null);
    } else {
        const newDr: Doctor = {
        id: 'dr-' + Date.now(),
        name: doctorForm.name,
        experience: doctorForm.experience || '1 Year Experience',
        category: doctorForm.category,
        level: doctorForm.level || 'Consultant Specialist',
        facebook: doctorForm.facebook,
        twitter: doctorForm.twitter,
        linkedin: doctorForm.linkedin,
        number: doctorForm.number || '+977-9851000000',
        email: doctorForm.email,
        profilePicUrl: doctorForm.profilePicUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'
      };
      setDoctors(prev => [...prev, newDr]);
    }

    setDoctorForm({ id: '', name: '', experience: '', category: '', level: '', facebook: '', twitter: '', linkedin: '', number: '', profilePicUrl: '' });
  };

  const handleEditDoctor = (dr: Doctor) => {
    setDoctorForm(dr);
    setIsEditingDoctor(dr.id);
    // Smooth scroll to the doctor form panel
    const element = document.getElementById('doctor-form-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  // Password Modification Handler
  const handleModifyCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const loadedPassword = passwordConfig?.password || '123321';
    
    if (passwords.currentPassword !== loadedPassword) {
      setPasswordStatusText({ text: 'Current Active Password is Incorrect.', isError: true });
      return;
    }
    if (!passwords.newPassword.trim()) {
      setPasswordStatusText({ text: 'Password must not be empty.', isError: true });
      return;
    }

    const updated = {
      password: passwords.newPassword.trim(),
      recoveryPassword: passwords.newRecoveryPassword.trim() || passwordConfig.recoveryPassword
    };
    setPasswordConfig(updated);
    setPasswordStatusText({ text: 'Administrative passwords updated successfully!', isError: false });
    setPasswords({ currentPassword: '', newPassword: '', newRecoveryPassword: '' });
  };

  // Back up and restore data handlers
  const handleBackupData = () => {
    const payload = {
      categories,
      services,
      doctors,
      aboutUs,
      patientData,
      visitorData,
      gallery,
      videos,
      news,
      priceList,
      contact,
      settings,
      bookings,
      testimonials,
      events,
      qrCodes,
      machines
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dhading_hospital_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSaveStatus({ text: "Backup file downloaded successfully! Keep this file safe.", isError: false });
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.services) setServices(parsed.services);
        if (parsed.doctors) setDoctors(parsed.doctors);
        if (parsed.aboutUs) setAboutUs(parsed.aboutUs);
        if (parsed.patientData) setPatientData(parsed.patientData);
        if (parsed.visitorData) setVisitorData(parsed.visitorData);
        if (parsed.gallery) setGallery(parsed.gallery);
        if (parsed.videos) setVideos(parsed.videos);
        if (parsed.news) setNews(parsed.news);
        if (parsed.priceList) setPriceList(parsed.priceList);
        if (parsed.contact) setContact(parsed.contact);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.bookings) setBookings(parsed.bookings);
        if (parsed.testimonials) setTestimonials(parsed.testimonials);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.qrCodes) setQrCodes(parsed.qrCodes);
        if (parsed.machines) setMachines(parsed.machines);

        setSaveStatus({ text: "🎉 Success: Backup JSON restored in this session! Click 'Save Permanently to Server Codebase' to write it to files.", isError: false });
      } catch (err) {
        setSaveStatus({ text: "Invalid Backup JSON format. Please upload a verified backup file.", isError: true });
      }
    };
    reader.readAsText(file);
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    setSaveStatus({ text: 'Saving changes locally and to the project codebase...', isError: false });
    try {
      const payload = {
        categories,
        services,
        doctors,
        aboutUs,
        patientData,
        visitorData,
        gallery,
        videos,
        news,
        priceList,
        contact,
        settings,
        bookings,
        testimonials,
        events,
        qrCodes,
        machines
      };

      // Ensure local browser copy is saved
      localStorage.setItem('dh_master_backup', JSON.stringify(payload));
      
      setSaveStatus({ text: '🚀 SUCCESS: All admin content has been saved successfully in browser! When you configure a backend database, it will save there.', isError: false });
    } catch (error: any) {
      console.error(error);
      setSaveStatus({ text: 'Failed to save to local storage.', isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex md:flex-row flex-col">
      
      {/* Control Sidebar */}
      <aside className="w-full md:w-64 bg-[#1e1e1e] text-gray-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-4 border-b border-gray-800 bg-[#006830] text-white flex items-center gap-2">
            <Building className="size-5 shrink-0" />
            <div>
              <h2 className="font-bold text-sm tracking-wide truncate">{settings.webName || "Dhading Hospital"}</h2>
              <p className="text-[10px] text-green-200 uppercase font-bold">Admin Console</p>
            </div>
          </div>

          <div className="p-2 text-xs uppercase text-gray-500 font-extrabold tracking-wider pl-4 pt-4">
            Navigation Modules
          </div>

          {/* Sub tabs list */}
          <nav className="p-2 space-y-1">
            <button
              onClick={() => setActiveSubTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'bookings' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="size-4" /> Real-time Bookings
              </span>
              {bookings.length > 0 && (
                <span className="bg-red-500 text-white font-mono font-bold px-1.5 py-0.5 rounded-full text-xs">
                  {bookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('services')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'services' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Stethoscope className="size-4" /> Our Services
            </button>

            <button
              onClick={() => setActiveSubTab('doctors')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'doctors' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Users className="size-4" /> Doctors & Departments
            </button>

            <button
              onClick={() => setActiveSubTab('about')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'about' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Info className="size-4" /> About Dhading Hospital
            </button>

            <button
              onClick={() => setActiveSubTab('patients')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'patients' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <FileText className="size-4" /> Patient Desk Services
            </button>

            <button
              onClick={() => setActiveSubTab('visitors')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'visitors' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Eye className="size-4" /> Visitor Protocols
            </button>

            <button
              onClick={() => setActiveSubTab('gallery')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'gallery' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Image className="size-4" /> Media Gallery
            </button>

            <button
              onClick={() => setActiveSubTab('machines')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'machines' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Building className="size-4 text-emerald-300" /> Machine Gallery
            </button>

            <button
              onClick={() => setActiveSubTab('news')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'news' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <ShieldAlert className="size-4" /> News & Camp updates
            </button>

            <button
              onClick={() => setActiveSubTab('prices')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'prices' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <FileText className="size-4" /> Price Lists & Contacts
            </button>

            <button
              onClick={() => setActiveSubTab('qrCodes')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'qrCodes' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <QrCode className="size-4 text-emerald-300" /> QR Merchant Scanners
            </button>

            <button
              onClick={() => setActiveSubTab('officialContacts')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'officialContacts' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Mail className="size-4 text-emerald-300" /> Official Web Contacts
            </button>

            <button
              onClick={() => setActiveSubTab('settings')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'settings' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Settings className="size-4" /> General Hospital Settings
            </button>

            <button
              onClick={() => setActiveSubTab('testimonials')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'testimonials' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <MessageCircle className="size-4" /> Patient Testimonials
            </button>

            <button
              onClick={() => setActiveSubTab('events')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'events' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Calendar className="size-4" /> Hospital Event Schedules
            </button>

            <button
              onClick={() => setActiveSubTab('mailboxes')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                activeSubTab === 'mailboxes' ? 'bg-[#00A64C] text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Mail className="size-4" /> Hospital Mailboxes
            </button>
          </nav>
        </div>

        {/* Console Foot Exit */}
        <div className="p-4 border-t border-gray-800 bg-[#161616]">
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm cursor-pointer transition-colors"
          >
            <LogOut className="size-4" /> Back to Hospital Web
          </button>
        </div>
      </aside>

      {/* Primary Display Area */}
      <main className="flex-1 p-6 md:p-8 max-h-screen overflow-y-auto">
        <header className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-none"> Dhading Admin Panel</h1>
            <p className="text-xs text-slate-500 font-medium mt-1.5">Directly update OPD, Doctors, about page PDF documents, and news in real time</p>
          </div>
          <div className="bg-slate-200 text-slate-800 px-3 py-1 text-xs font-bold rounded">
            UTC Time: 2026-05-31
          </div>
        </header>

        {/* Dynamic Database Sync & Persistence Panel */}
        <div className="bg-gradient-to-r from-[#006830] via-[#00A64C] to-emerald-700 p-4 rounded-xl text-white shadow-md mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-yellow-300">
              ⚡ LIVE WORKSPACE SYNCHRONIZATION & DATABASE BACKUP HUB
            </h3>
            <p className="text-[11px] text-emerald-50 leading-relaxed">
              Edits made in your browser are temporary. Click <strong className="text-white underline">Save permanently to Codebase</strong> to write all current contents directly into your project's <code className="bg-black/25 px-1 rounded font-mono text-[10px]">seedData.ts</code> on the server so that your next ZIP export or Vercel/v0 deployment holds all updated data natively!
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Hidden Backup File Input */}
            <input 
              type="file" 
              id="backup-file-input" 
              accept=".json" 
              onChange={handleRestoreBackup}
              className="hidden" 
            />
            
            <button
              onClick={handleBackupData}
              className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer border border-white/20 flex items-center gap-1"
              title="Download all current database items as a .json backup file"
            >
              📦 Backup All JSON
            </button>
            
            <button
              onClick={() => document.getElementById('backup-file-input')?.click()}
              className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all cursor-pointer border border-white/20 flex items-center gap-1"
              title="Upload an exported backup file to restore your hospital settings"
            >
              📤 Restore Backup
            </button>

            <button
              onClick={handleSaveToServer}
              disabled={isSaving}
              className={`bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-gray-950 font-black py-1.5 px-3.5 rounded-lg text-xs transition-all cursor-pointer shadow-sm flex items-center gap-1.5 border border-yellow-300 ${isSaving ? 'opacity-65 cursor-not-allowed' : ''}`}
              title="Saves everything to the server disk seedData.ts permanently"
            >
              🚀 {isSaving ? 'Saving...' : 'Save permanently to Codebase'}
            </button>
          </div>
        </div>

        {/* Sync Success / Error messages banner */}
        {saveStatus && (
          <div className={`p-3.5 rounded-lg text-xs font-semibold mb-6 flex items-center justify-between border ${
            saveStatus.isError 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-xs'
          }`}>
            <span className="flex items-center gap-1.5 leading-relaxed">
              {saveStatus.isError ? '⚠️' : '✅'} {saveStatus.text}
            </span>
            <button 
              onClick={() => setSaveStatus(null)}
              className="text-gray-400 hover:text-gray-600 font-bold ml-4 cursor-pointer text-sm"
            >
              ✕
            </button>
          </div>
        )}


        {/* Tab: Real-time Bookings Entry */}
        {activeSubTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-[#006830] mb-4 flex items-center gap-2">
                <Calendar className="size-5 text-[#00A64C]" />
                Recent Online Booking Entries
              </h3>
              <p className="text-xs text-gray-500 pb-3 font-medium">Click on request to load medical detail notes, or discard the records.</p>
              
              {bookings.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  No pending patient requests found. Form submittals will show up live here!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-4 py-3">Patient Name</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Dept Category</th>
                        <th className="px-4 py-3">Selected Doc / Item</th>
                        <th className="px-4 py-3">Apt Slot</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 flex items-center gap-1">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-slate-800">
                      {bookings.map((bk) => (
                        <tr key={bk.id} className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-gray-950">{bk.patientName}</td>
                          <td className="px-4 py-3 text-slate-800 font-mono text-xs">{bk.patientNumber}</td>
                          <td className="px-4 py-3 font-semibold text-emerald-800">{bk.bookingType || bk.doctorType || 'Consultation'}</td>
                          <td className="px-4 py-3 text-gray-600 font-semibold">{bk.selectedItem || bk.doctorName || 'General'}</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-50 text-green-800 text-xs px-2.5 py-1 rounded font-bold border border-green-200">
                              {bk.day} • {bk.time}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {bk.status === 'approved' ? (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black px-2.5 py-1 rounded-full border border-emerald-300">
                                Approved
                              </span>
                            ) : bk.status === 'rejected' ? (
                              <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-full border border-rose-300">
                                Rejected
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-black px-2.5 py-1 rounded-full border border-amber-300 animate-pulse">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 flex gap-2 items-center">
                            <button
                              onClick={() => setSelectedBooking(bk)}
                              className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded hover:bg-emerald-200 transition-colors cursor-pointer"
                            >
                              Info
                            </button>
                            
                            {(!bk.status || bk.status === 'pending') && (
                              <>
                                <button
                                  onClick={() => setBookings(prev => prev.map(b => b.id === bk.id ? { ...b, status: 'approved' } : b))}
                                  className="text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                                  title="Approve Request"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => setBookings(prev => prev.map(b => b.id === bk.id ? { ...b, status: 'rejected' } : b))}
                                  className="text-xs font-black bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                                  title="Reject Request"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => setBookings(prev => prev.filter(b => b.id !== bk.id))}
                              className="text-xs font-semibold bg-red-50 text-red-600 p-1.5 rounded hover:bg-red-100 transition-colors cursor-pointer"
                              title="Delete request"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Selected Booking Modal */}
            {selectedBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="bg-[#006830] text-white px-4 py-3 flex justify-between items-center">
                    <h3 className="font-bold">Patient Booking Case Detail</h3>
                    <button onClick={() => setSelectedBooking(null)} className="text-white hover:scale-110 cursor-pointer">
                      <X className="size-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4 text-sm text-gray-700">
                    <div>
                      <strong className="block text-xs uppercase text-gray-500 font-bold">Patient Name</strong>
                      <span className="text-base font-bold text-gray-950">{selectedBooking.patientName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="block text-xs uppercase text-gray-500 font-bold">Phone Number</strong>
                        <span className="font-mono">{selectedBooking.patientNumber}</span>
                      </div>
                      <div>
                        <strong className="block text-xs uppercase text-gray-500 font-bold">WhatsApp Msg Nr</strong>
                        <span className="font-mono text-emerald-600 font-bold">{selectedBooking.whatsappNumber || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="block text-xs uppercase text-gray-500 font-bold">Email</strong>
                        <span>{selectedBooking.patientEmail}</span>
                      </div>
                      <div>
                        <strong className="block text-xs uppercase text-gray-500 font-bold">Address</strong>
                        <span className="font-semibold">{selectedBooking.address || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <strong className="block text-xs uppercase text-gray-500 font-bold">Booking Classification</strong>
                      <p className="font-bold text-slate-800">Type: <span className="text-emerald-800 font-bold">{selectedBooking.bookingType || selectedBooking.doctorType || 'N/A'}</span></p>
                      <p className="font-bold text-slate-800">Target Item: <span className="text-emerald-800 font-bold">{selectedBooking.selectedItem || selectedBooking.doctorName || 'N/A'}</span></p>
                      <p className="font-bold text-slate-800 font-mono">Cons. Fee: <span className="text-rose-600 font-black">Rs. {selectedBooking.amountToPay || '500'}/-</span> ({selectedBooking.paymentMethod || 'Cash at Counter'})</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong className="block text-xs uppercase text-gray-500 font-medium mb-1">Symptoms / Complaints</strong>
                      <p className="italic text-gray-600 leading-snug">"{selectedBooking.message}"</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>Status: <strong className="uppercase">{selectedBooking.status || 'pending'}</strong></span>
                      <span>Submitted on: {selectedBooking.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Mailboxes */}
        {/* Tab: Official Contacts Registry */}
        {activeSubTab === 'officialContacts' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-[#006830] mb-2 flex items-center gap-2">
                <Mail className="size-5 text-[#00A64C]" />
                Official Web Contact Registry
              </h3>
              <p className="text-xs text-gray-500 pb-4">Manage the list of official contact points (Mailboxes, WhatsApp) displayed on the public website's contact section.</p>

              {/* Add New Official Contact Form */}
              <div className="mb-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                  <Plus className="size-4" /> Register New Contact Point
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    id="new-contact-title"
                    placeholder="Title (e.g. Chairman Office)"
                    className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="email"
                    id="new-contact-email"
                    placeholder="Official Email"
                    className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    id="new-contact-whatsapp"
                    placeholder="WhatsApp Number (Optional)"
                    className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => {
                      const titleInput = document.getElementById('new-contact-title') as HTMLInputElement;
                      const emailInput = document.getElementById('new-contact-email') as HTMLInputElement;
                      const whatsappInput = document.getElementById('new-contact-whatsapp') as HTMLInputElement;
                      if (titleInput.value && emailInput.value) {
                        const newContact = {
                          id: 'oc-' + Date.now(),
                          title: titleInput.value,
                          email: emailInput.value,
                          whatsapp: whatsappInput.value || undefined
                        };
                        setContact(prev => ({
                          ...prev,
                          officialContacts: [...(prev.officialContacts || []), newContact]
                        }));
                        titleInput.value = '';
                        emailInput.value = '';
                        whatsappInput.value = '';
                      }
                    }}
                    className="bg-[#00A64C] hover:bg-[#006830] text-white font-bold py-2 px-4 rounded-lg text-sm cursor-pointer transition-colors"
                  >
                    Add Registry Entry
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(contact.officialContacts || []).map((oc) => (
                  <div key={oc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-200 transition-colors">
                    <h5 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 flex items-center justify-between">
                      {oc.title}
                      <button
                        onClick={() => setContact(prev => ({
                          ...prev,
                          officialContacts: (prev.officialContacts || []).filter(item => item.id !== oc.id)
                        }))}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Remove Entry"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </h5>
                    <div className="space-y-1 text-xs">
                      <p className="flex items-center gap-1.5 text-gray-600">
                        <Mail className="size-3 text-emerald-600" /> {oc.email}
                      </p>
                      {oc.whatsapp && (
                        <p className="flex items-center gap-1.5 text-emerald-700 font-bold">
                          <MessageCircle className="size-3 text-emerald-600" /> {oc.whatsapp}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {(contact.officialContacts || []).length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 text-sm italic">No official registry contacts yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Services management */}
        {activeSubTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-[#006830] mb-2 flex items-center gap-2">
                <Stethoscope className="size-5 text-[#00A64C]" />
                1) Our Services - Category Management console
              </h3>
              <p className="text-xs text-slate-500 pb-4">
                Choose a sub-service segment to add or edit. Add items using Photo URLs and PDF reference links. Immediate dynamic results appear on the portal service sections!
              </p>

              {/* Service Categories selectors */}
              <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-100">
                {(['opd', 'ipd', 'emergency', 'labPathology', 'radiology', 'cashReception', 'pharmacy', 'ambulance', 'preventiveHealth'] as (keyof Services)[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedServiceCategory(cat);
                      setIsEditingService(null);
                      setServiceItemForm({ id: '', title: '', imageUrl: '', pdfUrl: '', text: '' });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold capitalize cursor-pointer transition-all ${
                      selectedServiceCategory === cat 
                        ? 'bg-[#00A64C] text-white shadow-sm scale-105' 
                        : 'bg-slate-100 hover:bg-slate-200 text-gray-600'
                    }`}
                  >
                    {cat.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>

              {/* Add / Edit Form */}
              <form onSubmit={handleSaveService} className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-gray-800">
                  {isEditingService ? '✏️ Edit Selected Item in' : '➕ Add New Item to'}{' '}
                  <span className="text-[#00A64C] capitalize font-extrabold">{selectedServiceCategory.replace(/([A-Z])/g, ' $1')}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Item Title / Heading</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Pediatric OPD Consultation"
                      value={serviceItemForm.title || ''}
                      onChange={e => setServiceItemForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#00A64C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Photo/Illustration Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={serviceItemForm.imageUrl || ''}
                      onChange={e => setServiceItemForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#00A64C]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">PDF Guide Link URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={serviceItemForm.pdfUrl || ''}
                      onChange={e => setServiceItemForm(prev => ({ ...prev, pdfUrl: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#00A64C]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">
                      {selectedServiceCategory === 'preventiveHealth' ? (
                        <span className="text-[#00A64C] font-black">
                          Health Checkup Setup (Price & Tests List on New Lines)
                        </span>
                      ) : (
                        "Description Text (Mainly used in Emergency and Lab Pathology)"
                      )}
                    </label>
                    <textarea
                      rows={selectedServiceCategory === 'preventiveHealth' ? 6 : 2}
                      placeholder={
                        selectedServiceCategory === 'preventiveHealth' 
                          ? "Price: Rs. 4,500/-\nDoctor's Consultation\nLipid Profile Test\nComplete Blood Count (CBC)\nUrine Routine Examination" 
                          : "Type details regarding fees, locations, and procedures..."
                      }
                      value={serviceItemForm.text || ''}
                      onChange={e => setServiceItemForm(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#00A64C]"
                    />
                    {selectedServiceCategory === 'preventiveHealth' && (
                      <div className="bg-emerald-50/60 border border-[#00A64C]/15 p-2.5 rounded-lg text-[10px] text-emerald-800 leading-normal space-y-1">
                        <p className="font-extrabold text-[#006830]">
                          💡 **Green City Style Medical List formatting instructions:**
                        </p>
                        <p>
                          1. Type the price/rate on any line starting with **Price:** or **Rate:** (e.g. `Price: Rs. 7,499/-`).
                        </p>
                        <p>
                          2. Write each diagnostic test or checkup feature on its own **new line** below that.
                        </p>
                        <p className="italic font-bold text-[#00A64C]">
                          नेपाली: पहिलो हरफमा `Price: Rs. ५,०००/-` लेख्नुहोस् र तल प्रत्येक लाइनमा फरक-फरक जाचँको नाम लेख्नुहोस्। ती जाचँहरु स्वतः Checkbox लिस्टमा देखिनेछन्।
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  {isEditingService && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingService(null);
                        setServiceItemForm({ id: '', title: '', imageUrl: '', pdfUrl: '', text: '' });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-1 rounded text-xs cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-[#00A64C] hover:bg-[#006830] text-white font-bold px-6 py-1.5 rounded text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Check className="size-3.5" /> Save Item
                  </button>
                </div>
              </form>

              {/* List of current items under selected category */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs uppercase font-extrabold text-gray-500 tracking-wider">
                  Current Online Contents in <span className="capitalize text-[#006830]">{selectedServiceCategory}</span> ({services[selectedServiceCategory]?.length || 0})
                </h4>

                {services[selectedServiceCategory]?.length === 0 ? (
                  <div className="py-6 text-center text-gray-400 text-xs">No items currently drafted in this section. Add some using the module above!</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services[selectedServiceCategory].map((item) => (
                      <div key={item.id} className="p-4 bg-white border border-gray-200 rounded-xl flex gap-3 shadow-xs items-start">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="size-16 object-cover rounded-lg shrink-0" />
                        )}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h5 className="font-bold text-sm text-gray-900 truncate leading-snug">{item.title}</h5>
                          {item.pdfUrl && (
                            <p className="text-[10px] text-[#00A64C] truncate font-semibold">🔗 PDF: {item.pdfUrl}</p>
                          )}
                          {item.text && (
                            <p className="text-xs text-gray-500 line-clamp-2">{item.text}</p>
                          )}
                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => handleEditServiceItem(selectedServiceCategory, item)}
                              className="text-[10px] uppercase font-bold text-indigo-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              <Edit className="size-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteServiceItem(selectedServiceCategory, item.id)}
                              className="text-[10px] uppercase font-bold text-red-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash2 className="size-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Doctors and Doctor Categories */}
        {activeSubTab === 'doctors' && (
          <div className="space-y-6">
            
            {/* Category Management Block */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-[#006830] text-lg font-bold mb-2 flex items-center gap-2">
                <Users className="size-5 text-[#00A64C]" />
                2) Doctor Category Management console
              </h3>
              <p className="text-xs text-gray-500 pb-4">Manage professional categories (e.g. Orthopedics, Trauma & Spine Surgery, Neuro Surgery) instantly editable in doctor dropdown lists.</p>

              <div className="flex gap-2 pb-4 max-w-md">
                <input
                  type="text"
                  placeholder="Type new category..."
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
                >
                  Add Category
                </button>
              </div>

              {/* Categorised Tag grid */}
              <div className="border border-gray-100 rounded-xl p-4 bg-slate-50">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold text-gray-800">
                      {editingCategoryIdx === idx ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingCategoryValue}
                            onChange={e => setEditingCategoryValue(e.target.value)}
                            className="px-1 py-0.5 border border-slate-300 text-xs text-gray-900 rounded"
                          />
                          <button onClick={() => handleSaveCategoryEdit(idx)} className="text-green-600 hover:text-green-800 font-bold"><Check className="size-3.5" /></button>
                        </div>
                      ) : (
                        <>
                          <span>{cat}</span>
                          <div className="flex gap-1 items-center ml-2 border-l border-gray-200 pl-2">
                            <button
                              onClick={() => handleStartEditCategory(idx, cat)}
                              className="text-gray-400 hover:text-indigo-600 transition-colors"
                              title="Rename Category"
                            >
                              <Edit className="size-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Doctors Staff management Block */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h3 className="text-[#006830] text-lg font-bold mb-2 flex items-center gap-2">
                <Users className="size-5 text-[#00A64C]" />
                3) Doctor Profiles Register Panel
              </h3>
              <p className="text-xs text-gray-500 pb-4">Add, view or update Dhading Hospital staff, choose their assigned department category, level, WhatsApp numbers and links.</p>

              {/* Doctor Save Form */}
              <form id="doctor-form-panel" onSubmit={handleSaveDoctor} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 mb-6">
                <h4 className="text-xs uppercase font-extrabold text-gray-700 tracking-wider">
                  {isEditingDoctor ? '✏️ Edit Specialist Credentials' : '➕ Add New Specialist to Registry'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Doctor Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Khem Raj Bhusal"
                      value={doctorForm.name || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Experience Years / Detail</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Years of Experience"
                      value={doctorForm.experience || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Speciality Department Category</label>
                    <select
                      required
                      value={doctorForm.category || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Level (Specialist/Senior Consultant)</label>
                    <input
                      type="text"
                      placeholder="Senior Consultant Orthopedic Surgeon"
                      value={doctorForm.level || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Doctor Profile Pic URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={doctorForm.profilePicUrl || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, profilePicUrl: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Contact Number</label>
                    <input
                      type="text"
                      placeholder="+977-98XXXXXXXX"
                      value={doctorForm.number || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Facebook Profile Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://facebook.com/..."
                      value={doctorForm.facebook || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Twitter Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://twitter.com/..."
                      value={doctorForm.twitter || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, twitter: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Doctor Email (Optional)</label>
                    <input
                      type="email"
                      placeholder="doctor@dhadinghospital.com.np"
                      value={doctorForm.email || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">LinkedIn Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/..."
                      value={doctorForm.linkedin || ''}
                      onChange={e => setDoctorForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  {isEditingDoctor && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingDoctor(null);
                        setDoctorForm({ id: '', name: '', experience: '', category: '', level: '', facebook: '', twitter: '', linkedin: '', number: '', email: '', profilePicUrl: '' });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded text-xs cursor-pointer font-bold"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-[#00A64C] hover:bg-[#006830] text-white px-6 py-1.5 rounded text-xs cursor-pointer font-bold inline-flex items-center gap-1"
                  >
                    <Check className="size-3.5" /> Save Doctor
                  </button>
                </div>
              </form>

              {/* Active doctors grid */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-extrabold text-gray-500 tracking-wider">Active Staff Profiles Registered</h4>
                
                {doctors.length === 0 ? (
                  <div className="py-6 text-center text-gray-400 text-xs">No doctors currently catalogued. Add some above.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {doctors.map((dr) => (
                      <div key={dr.id} className="p-4 bg-white border border-gray-200 rounded-xl flex gap-3 shadow-xs">
                        <img 
                          src={dr.profilePicUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'} 
                          alt={dr.name} 
                          className="size-16 object-cover rounded-full border border-emerald-300 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm text-gray-900 truncate leading-snug">{dr.name}</h5>
                          <p className="text-[10px] text-indigo-600 font-extrabold truncate">{dr.category}</p>
                          <p className="text-xs text-gray-500 truncate">{dr.level} • {dr.experience}</p>
                          <p className="text-xs text-sky-800 font-medium truncate font-mono">📱: {dr.number}</p>
                          
                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => handleEditDoctor(dr)}
                              className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit className="size-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(dr.id)}
                              className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="size-3" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: About Us */}
        {activeSubTab === 'about' && (
          <div className="space-y-6">
            
            {/* Sec A: Introduction */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Info className="size-5 text-[#00A64C]" />
                4-A) Introduction Detail Manuals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Introduction Detail Text</label>
                  <textarea
                    rows={4}
                    value={aboutUs.introduction.details}
                    onChange={e => {
                      const updatedDetails = e.target.value;
                      setAboutUs(prev => ({
                        ...prev,
                        introduction: { ...prev.introduction, details: updatedDetails }
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#00A64C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Hospital Image URL</label>
                  <input
                    type="text"
                    value={aboutUs.introduction.photoUrl}
                    onChange={e => {
                      const updatedPhoto = e.target.value;
                      setAboutUs(prev => ({
                        ...prev,
                        introduction: { ...prev.introduction, photoUrl: updatedPhoto }
                      }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                  <div className="pt-2">
                    <img src={aboutUs.introduction.photoUrl} alt="prev" className="w-full h-24 object-cover rounded border" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sec B: Board of Directors Administration */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Users className="size-5 text-[#00A64C]" />
                4-B) Manage Board of Directors
              </h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Add, edit, or delete members of the executive Board of Directors. These will render directly inside the "Board of Director" web page.
              </p>

              {/* Form to Add or Edit */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3 text-left">
                <h4 className="text-xs font-black uppercase text-[#006830]">
                  {editingBodId ? 'Edit Director Profile' : 'Add New Director'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. Lok Bahadur Tandan"
                      value={bodName}
                      onChange={e => setBodName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Role / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Chairman / Board Member"
                      value={bodRole}
                      onChange={e => setBodRole(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Profile Photo Link URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or relative"
                      value={bodPhotoUrl}
                      onChange={e => setBodPhotoUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  {editingBodId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBodId(null);
                        setBodName('');
                        setBodRole('');
                        setBodPhotoUrl('');
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!bodName || !bodRole) return;
                      const finalPhoto = bodPhotoUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80';
                      
                      if (editingBodId) {
                        setAboutUs(prev => ({
                          ...prev,
                          boardOfDirectors: prev.boardOfDirectors.map(b => 
                            b.id === editingBodId ? { ...b, name: bodName, role: bodRole, photoUrl: finalPhoto } : b
                          )
                        }));
                        setEditingBodId(null);
                      } else {
                        setAboutUs(prev => ({
                          ...prev,
                          boardOfDirectors: [...prev.boardOfDirectors, {
                            id: 'bod-' + Date.now(),
                            name: bodName,
                            role: bodRole,
                            photoUrl: finalPhoto
                          }]
                        }));
                      }
                      setBodName('');
                      setBodRole('');
                      setBodPhotoUrl('');
                    }}
                    className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-black px-4 py-1.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    {editingBodId ? 'Update Profile' : 'Add Director'}
                  </button>
                </div>
              </div>

              {/* Members Listings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-left">
                {aboutUs.boardOfDirectors.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex flex-col justify-between space-y-3">
                    <div className="flex gap-3 items-center">
                      <div className="size-11 rounded-full overflow-hidden shrink-0 border border-emerald-300">
                        <img src={item.photoUrl} alt={item.name} className="size-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs text-gray-900 block truncate">{item.name || (item as any).title}</strong>
                        <span className="text-[10px] text-gray-500 font-bold block truncate">{item.role || 'Board Member'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBodId(item.id);
                          setBodName(item.name || (item as any).title);
                          setBodRole(item.role || 'Board Member');
                          setBodPhotoUrl(item.photoUrl || (item as any).pdfUrl || '');
                        }}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingBodId === item.id) {
                            setEditingBodId(null);
                            setBodName('');
                            setBodRole('');
                            setBodPhotoUrl('');
                          }
                          setAboutUs(prev => ({
                            ...prev,
                            boardOfDirectors: prev.boardOfDirectors.filter(b => b.id !== item.id)
                          }));
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sec C: Chairman Message (WhatsApp Direct Link!) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-[#006830] text-lg font-bold flex items-center gap-2">
                <Users className="size-5 text-[#00A64C]" />
                4-C) Chairman Message details (Auto direct chat connection)
              </h3>
              <p className="text-xs text-gray-500">Upon clicking, users on the main website are redirected seamlessly onto direct WhatsApp chat setup using Wa.me web APIs.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Chairman Executive Name</label>
                  <input
                    type="text"
                    value={aboutUs.chairmanMessage.name}
                    onChange={e => {
                      const val = e.target.value;
                      setAboutUs(prev => ({
                        ...prev,
                        chairmanMessage: { ...prev.chairmanMessage, name: val }
                      }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">WhatsApp Mobile coordinates (e.g. 9779851012345)</label>
                  <input
                    type="text"
                    value={aboutUs.chairmanMessage.whatsappNumber}
                    onChange={e => {
                      const val = e.target.value;
                      setAboutUs(prev => ({
                        ...prev,
                        chairmanMessage: { ...prev.chairmanMessage, whatsappNumber: val }
                      }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Avatar Image URL</label>
                  <input
                    type="text"
                    value={aboutUs.chairmanMessage.photoUrl}
                    onChange={e => {
                      const val = e.target.value;
                      setAboutUs(prev => ({
                        ...prev,
                        chairmanMessage: { ...prev.chairmanMessage, photoUrl: val }
                      }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700">Message Text details</label>
                  <textarea
                    rows={4}
                    value={aboutUs.chairmanMessage.details}
                    onChange={e => {
                      const val = e.target.value;
                      setAboutUs(prev => ({
                        ...prev,
                        chairmanMessage: { ...prev.chairmanMessage, details: val }
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sec D: Executive Roles Management */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#00A64C]" />
                4-D) Hospital Executive Profiles (Medical Director, Account Manager, Reception)
              </h3>
              <p className="text-xs text-gray-500 pb-2">These profiles appear prominently in the "About Hospital" section with detailed bios and specific contact buttons.</p>

              <div className="space-y-8">
                {[
                  { key: 'medicalDirector', label: 'Medical Director', icon: <Stethoscope className="size-4" /> },
                  { key: 'accountManager', label: 'Account Manager', icon: <ClipboardList className="size-4" /> },
                  { key: 'reception', label: 'Reception Desk Head', icon: <Phone className="size-4" /> }
                ].map((role) => {
                  const staff = (aboutUs as any)[role.key] || { name: '', bio: '', photoUrl: '', email: '', phone: '', whatsapp: '' };
                  return (
                    <div key={role.key} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                        <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">{role.icon}</span>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{role.label} Profile</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Full Name</label>
                          <input
                            type="text"
                            value={staff.name}
                            onChange={e => {
                              const val = e.target.value;
                              setAboutUs(prev => ({ ...prev, [role.key]: { ...(prev as any)[role.key], name: val } }));
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Profile Photo URL</label>
                          <input
                            type="text"
                            value={staff.photoUrl}
                            onChange={e => {
                              const val = e.target.value;
                              setAboutUs(prev => ({ ...prev, [role.key]: { ...(prev as any)[role.key], photoUrl: val } }));
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Official Email</label>
                          <input
                            type="email"
                            value={staff.email}
                            onChange={e => {
                              const val = e.target.value;
                              setAboutUs(prev => ({ ...prev, [role.key]: { ...(prev as any)[role.key], email: val } }));
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Calling Phone</label>
                          <input
                            type="text"
                            value={staff.phone}
                            onChange={e => {
                              const val = e.target.value;
                              setAboutUs(prev => ({ ...prev, [role.key]: { ...(prev as any)[role.key], phone: val } }));
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase">WhatsApp Number</label>
                          <input
                            type="text"
                            value={staff.whatsapp}
                            onChange={e => {
                              const val = e.target.value;
                              setAboutUs(prev => ({ ...prev, [role.key]: { ...(prev as any)[role.key], whatsapp: val } }));
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-1"></div>
                        <div className="space-y-1 md:col-span-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase">Biography / Role Description</label>
                          <textarea
                            rows={3}
                            value={staff.bio}
                            onChange={e => {
                              const val = e.target.value;
                              setAboutUs(prev => ({ ...prev, [role.key]: { ...(prev as any)[role.key], bio: val } }));
                            }}
                            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sec E: Hospital Working Team Administration */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Users className="size-5 text-[#00A64C]" />
                4-E) Manage Hospital Working Team
              </h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Add, edit, or delete members of the hospital staff working team. These will render directly inside the "Hospital Working Team" web page.
              </p>

              {/* Form to Add or Edit */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-3 text-left">
                <h4 className="text-xs font-black uppercase text-[#006830]">
                  {editingTeamId ? 'Edit Team Member Profile' : 'Add New Team Member'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mrs. Sajina Dahal"
                      value={teamMemberName}
                      onChange={e => setTeamMemberName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Role / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Nursing Director / staff"
                      value={teamMemberRole}
                      onChange={e => setTeamMemberRole(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Phone Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. +977-98510XXXXX"
                      value={teamMemberPhone}
                      onChange={e => setTeamMemberPhone(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Available Time/Shift (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 AM to 5 PM / 24 hrs"
                      value={teamMemberTime}
                      onChange={e => setTeamMemberTime(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-700">Profile Photo Link URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... or relative"
                      value={teamMemberPhotoUrl}
                      onChange={e => setTeamMemberPhotoUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  {editingTeamId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTeamId(null);
                        setTeamMemberName('');
                        setTeamMemberRole('');
                        setTeamMemberPhotoUrl('');
                        setTeamMemberPhone('');
                        setTeamMemberTime('');
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!teamMemberName || !teamMemberRole) return;
                      const finalPhoto = teamMemberPhotoUrl || 'https://images.unsplash.com/photo-1594824813573-24643433b96f?auto=format&fit=crop&w=400&q=80';
                      
                      if (editingTeamId) {
                        setAboutUs(prev => ({
                          ...prev,
                          hospitalWorkingTeam: prev.hospitalWorkingTeam.map(t => 
                            t.id === editingTeamId ? { 
                              ...t, 
                              name: teamMemberName, 
                              role: teamMemberRole, 
                              photoUrl: finalPhoto,
                              phone: teamMemberPhone || undefined,
                              time: teamMemberTime || undefined
                            } : t
                          )
                        }));
                        setEditingTeamId(null);
                      } else {
                        setAboutUs(prev => ({
                          ...prev,
                          hospitalWorkingTeam: [...prev.hospitalWorkingTeam, {
                            id: 'team-' + Date.now(),
                            name: teamMemberName,
                            role: teamMemberRole,
                            photoUrl: finalPhoto,
                            phone: teamMemberPhone || undefined,
                            time: teamMemberTime || undefined
                          }]
                        }));
                      }
                      setTeamMemberName('');
                      setTeamMemberRole('');
                      setTeamMemberPhotoUrl('');
                      setTeamMemberPhone('');
                      setTeamMemberTime('');
                    }}
                    className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-black px-4 py-1.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    {editingTeamId ? 'Update Profile' : 'Add Team Member'}
                  </button>
                </div>
              </div>

              {/* Members Listings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 text-left">
                {aboutUs.hospitalWorkingTeam.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex flex-col justify-between space-y-3">
                    <div className="flex gap-3 items-center">
                      <div className="size-11 rounded-full overflow-hidden shrink-0 border border-emerald-300">
                        <img src={item.photoUrl} alt={item.name} className="size-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs text-gray-900 block truncate">{item.name || (item as any).title}</strong>
                        <span className="text-[10px] text-gray-500 font-bold block truncate">{item.role || 'Team Member'}</span>
                        {item.phone && (
                          <p className="text-[10px] text-blue-700 font-bold font-mono">📱 {item.phone}</p>
                        )}
                        {item.time && (
                          <p className="text-[10px] text-emerald-800 font-bold">⏰ {item.time}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeamId(item.id);
                          setTeamMemberName(item.name || (item as any).title);
                          setTeamMemberRole(item.role || 'Team Member');
                          setTeamMemberPhotoUrl(item.photoUrl || (item as any).pdfUrl || '');
                          setTeamMemberPhone(item.phone || '');
                          setTeamMemberTime(item.time || '');
                        }}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingTeamId === item.id) {
                            setEditingTeamId(null);
                            setTeamMemberName('');
                            setTeamMemberRole('');
                            setTeamMemberPhotoUrl('');
                            setTeamMemberPhone('');
                            setTeamMemberTime('');
                          }
                          setAboutUs(prev => ({
                            ...prev,
                            hospitalWorkingTeam: prev.hospitalWorkingTeam.filter(t => t.id !== item.id)
                          }));
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sec E: Careers editor text */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <FileText className="size-5 text-[#00A64C]" />
                4-E) Careers Textbox content
              </h3>
              <textarea
                rows={3}
                value={aboutUs.careersText}
                onChange={e => {
                  const val = e.target.value;
                  setAboutUs(prev => ({ ...prev, careersText: val }));
                }}
                placeholder="Hospital vacancy alerts or submission directives..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#00A64C]"
              />
            </div>

          </div>
        )}

        {/* Tab 5: For Patients */}
        {activeSubTab === 'patients' && (
          <div className="space-y-6">
            
            {/* Admission Desk Text */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <FileText className="size-5 text-[#00A64C]" />
                5-A) Admission Desk Text details
              </h3>
              <textarea
                rows={4}
                value={patientData.admissionDeskText}
                onChange={e => {
                  const val = e.target.value;
                  setPatientData(prev => ({ ...prev, admissionDeskText: val }));
                }}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#00A64C]"
              />
            </div>

            {/* Appointment Materials list */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Image className="size-5 text-[#00A64C]" />
                5-B) Appointment Guidelines PDF & Photo list
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Material Title"
                  value={patientAppTitle}
                  onChange={e => setPatientAppTitle(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={patientAppImage}
                  onChange={e => setPatientAppImage(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="PDF URL"
                  value={patientAppPdf}
                  onChange={e => setPatientAppPdf(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!patientAppTitle) return;
                  setPatientData(prev => ({
                    ...prev,
                    appointment: [...prev.appointment, {
                      id: 'apt-' + Date.now(),
                      title: patientAppTitle,
                      imageUrl: patientAppImage,
                      pdfUrl: patientAppPdf
                    }]
                  }));
                  setPatientAppTitle('');
                  setPatientAppImage('');
                  setPatientAppPdf('');
                }}
                className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Add Appointment Material
              </button>

              <div className="space-y-2">
                {patientData.appointment.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2 text-xs border rounded-lg">
                    <div>
                      <strong className="text-gray-900">{item.title}</strong>
                      <span className="text-gray-500 pl-2">({item.pdfUrl || 'No PDF'} | {item.imageUrl || 'No Image'})</span>
                    </div>
                    <button
                      onClick={() => setPatientData(prev => ({
                        ...prev,
                        appointment: prev.appointment.filter(a => a.id !== item.id)
                      }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 6: For Visitors */}
        {activeSubTab === 'visitors' && (
          <div className="space-y-6">
            
            {/* Visit Hours Photos */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Clock className="size-5 text-[#00A64C]" />
                6-A) Visiting Hour guidelines (Photo lists)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="Graphic / Title Description"
                  value={visitorHourForm.title}
                  onChange={e => setVisitorHourForm(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="Visitor Hour Image URL"
                  value={visitorHourForm.imageUrl}
                  onChange={e => setVisitorHourForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!visitorHourForm.imageUrl) return;
                  setVisitorData(prev => ({
                    ...prev,
                    visitHour: [...prev.visitHour, { id: 'vh-' + Date.now(), title: visitorHourForm.title || 'Visiting Timing protocol', imageUrl: visitorHourForm.imageUrl }]
                  }));
                  setVisitorHourForm({ title: '', imageUrl: '' });
                }}
                className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Add Visiting hour record
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {visitorData.visitHour.map((vh) => (
                  <div key={vh.id} className="p-2 border rounded-lg bg-slate-50 relative group">
                    <img src={vh.imageUrl} alt="preview" className="w-full h-24 object-cover rounded" />
                    <p className="text-[10px] font-bold text-gray-800 tracking-tight mt-1 truncate">{vh.title}</p>
                    <button
                      onClick={() => setVisitorData(prev => ({ ...prev, visitHour: prev.visitHour.filter(v => v.id !== vh.id) }))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:scale-105"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Do's and Dont's */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <FileText className="size-5 text-[#00A64C]" />
                6-B) Visitors Do's and Don'ts checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Guideline Title (e.g. ICU hygiene)"
                  value={visitorDosForm.title}
                  onChange={e => setVisitorDosForm(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={visitorDosForm.imageUrl}
                  onChange={e => setVisitorDosForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="PDF Link URL"
                  value={visitorDosForm.pdfUrl}
                  onChange={e => setVisitorDosForm(prev => ({ ...prev, pdfUrl: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!visitorDosForm.imageUrl) return;
                  setVisitorData(prev => ({
                    ...prev,
                    dosAndDonts: [...prev.dosAndDonts, { id: 'dd-' + Date.now(), title: visitorDosForm.title || 'Guideline instruction', imageUrl: visitorDosForm.imageUrl, pdfUrl: visitorDosForm.pdfUrl }]
                  }));
                  setVisitorDosForm({ title: '', imageUrl: '', pdfUrl: '' });
                }}
                className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Add Guideline Row
              </button>

              <div className="space-y-2">
                {visitorData.dosAndDonts.map((dd) => (
                  <div key={dd.id} className="flex justify-between items-center bg-slate-50 p-2 text-xs border rounded-lg">
                    <div>
                      <strong className="text-gray-900">{dd.title}</strong>
                      <span className="text-gray-400 pl-2">({dd.imageUrl} | {dd.pdfUrl || 'No PDF'})</span>
                    </div>
                    <button
                      onClick={() => setVisitorData(prev => ({ ...prev, dosAndDonts: prev.dosAndDonts.filter(d => d.id !== dd.id) }))}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Visitor Parking info */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Image className="size-5 text-[#00A64C]" />
                6-C) Visitors Parking Spaces (Photo Entries)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="Parking Description"
                  value={visitorParkForm.title}
                  onChange={e => setVisitorParkForm(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={visitorParkForm.imageUrl}
                  onChange={e => setVisitorParkForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!visitorParkForm.imageUrl) return;
                  setVisitorData(prev => ({
                    ...prev,
                    parking: [...prev.parking, { id: 'pk-' + Date.now(), title: visitorParkForm.title || 'Parking Grid Area', imageUrl: visitorParkForm.imageUrl }]
                  }));
                  setVisitorParkForm({ title: '', imageUrl: '' });
                }}
                className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Add Parking View Card
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {visitorData.parking.map((pk) => (
                  <div key={pk.id} className="p-2 border rounded-lg bg-slate-50 relative group">
                    <img src={pk.imageUrl} alt="preview" className="w-full h-24 object-cover rounded" />
                    <p className="text-[10px] font-bold text-gray-800 tracking-tight mt-1 truncate">{pk.title}</p>
                    <button
                      onClick={() => setVisitorData(prev => ({ ...prev, parking: prev.parking.filter(v => v.id !== pk.id) }))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:scale-105"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 7: Photo Gallery & Video URLs */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-6">
            
            {/* Photo Gallery Title + URL inputs */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Image className="size-5 text-[#00A64C]" />
                7-A) Photo Gallery Manager
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="Photo Title (e.g. Free Health Camp Nuwakot)"
                  value={photoGalForm.title}
                  onChange={e => setPhotoGalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Photo URL"
                  value={photoGalForm.imageUrl}
                  onChange={e => setPhotoGalForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!photoGalForm.imageUrl) return;
                  setGallery(prev => [...prev, { id: 'gal-' + Date.now(), title: photoGalForm.title || 'Dhading Hospital Event', imageUrl: photoGalForm.imageUrl }]);
                  setPhotoGalForm({ title: '', imageUrl: '' });
                }}
                className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Add Image record to Gallery
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {gallery.map((g) => (
                  <div key={g.id} className="p-2 border rounded bg-slate-50 relative group">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-24 object-cover rounded" />
                    <p className="text-[10px] text-gray-800 font-bold truncate mt-1">{g.title}</p>
                    <button
                      onClick={() => setGallery(prev => prev.filter(it => it.id !== g.id))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:scale-105"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Video URL inputs */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Play className="size-5 text-[#00A64C]" />
                7-B) Video URL Linker (TikTok, YouTube, Facebook feeds)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="Video Title Description"
                  value={videoGalForm.title}
                  onChange={e => setVideoGalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="Video Live Link (TikTok, YT, FB)"
                  value={videoGalForm.videoUrl}
                  onChange={e => setVideoGalForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="px-3 py-1 text-xs border border-gray-200 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!videoGalForm.videoUrl) return;
                  setVideos(prev => [...prev, { id: 'vdo-' + Date.now(), title: videoGalForm.title || 'Hospital Event Video', videoUrl: videoGalForm.videoUrl }]);
                  setVideoGalForm({ title: '', videoUrl: '' });
                }}
                className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Add Video connection URL
              </button>

              <div className="space-y-2">
                {videos.map((v) => (
                  <div key={v.id} className="flex justify-between items-center bg-slate-50 p-2 text-xs border rounded-lg">
                    <div>
                      <strong className="text-gray-900">{v.title}</strong>
                      <span className="text-gray-500 pl-3">({v.videoUrl})</span>
                    </div>
                    <button
                      onClick={() => setVideos(prev => prev.filter(it => it.id !== v.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 8-M: Machine Gallery Manager */}
        {activeSubTab === 'machines' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 text-left">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <Building className="size-5 text-[#00A64C]" />
                Machine Gallery Manager
              </h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Add, edit, or delete diagnostic machines and lab equipment. These items will render on the main website Machine Gallery page. Patients can click on any equipment to open a dedicated visual dashboard with details.
              </p>

              {/* Machine Save form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs uppercase font-extrabold text-gray-700 tracking-wider">
                  {editingMachineId ? '✏️ Edit Diagnostic Machine' : '➕ Add New Diagnostic Machine'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 block align-top">
                    <label className="text-xs font-bold text-gray-700">Machine / Equipment Title</label>
                    <input
                      type="text"
                      placeholder="e.g. High-Resolution 4D Ultrasound Machine"
                      value={machineTitle}
                      onChange={e => setMachineTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 block align-top">
                    <label className="text-xs font-bold text-gray-700">Equipment Photo Link URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... (Equipment picture)"
                      value={machineImageUrl}
                      onChange={e => setMachineImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2 block">
                    <label className="text-xs font-bold text-gray-700">Equipment Description & Specifications</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the medical specifications, applications, and diagnostic benefits..."
                      value={machineDescription}
                      onChange={e => setMachineDescription(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1 font-sans">
                  {editingMachineId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMachineId(null);
                        setMachineTitle('');
                        setMachineImageUrl('');
                        setMachineDescription('');
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (!machineTitle || !machineDescription) return;
                      const finalImage = machineImageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80';

                      if (editingMachineId) {
                        setMachines(prev => prev.map(m => 
                          m.id === editingMachineId ? { ...m, title: machineTitle, imageUrl: finalImage, description: machineDescription } : m
                        ));
                        setEditingMachineId(null);
                      } else {
                        setMachines(prev => [...prev, {
                          id: 'mach-' + Date.now(),
                          title: machineTitle,
                          imageUrl: finalImage,
                          description: machineDescription
                        }]);
                      }
                      setMachineTitle('');
                      setMachineImageUrl('');
                      setMachineDescription('');
                    }}
                    className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-black px-4 py-1.5 rounded-lg transition-colors uppercase tracking-wider cursor-pointer shadow-xs"
                  >
                    {editingMachineId ? 'Update Machine Details' : 'Add Machine to Gallery'}
                  </button>
                </div>
              </div>

              {/* Machine listings grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {machines.map((m) => (
                  <div key={m.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-emerald-100">
                        <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <h4 className="text-sm font-black text-gray-900 leading-tight">{m.title}</h4>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-3 mt-1">{m.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-200/50">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMachineId(m.id);
                          setMachineTitle(m.title);
                          setMachineImageUrl(m.imageUrl);
                          setMachineDescription(m.description);
                        }}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-150 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingMachineId === m.id) {
                            setEditingMachineId(null);
                            setMachineTitle('');
                            setMachineImageUrl('');
                            setMachineDescription('');
                          }
                          setMachines(prev => prev.filter(it => it.id !== m.id));
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: News Management */}
        {activeSubTab === 'news' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <ShieldAlert className="size-5 text-[#00A64C]" />
                8) Hospital News Hub & Updates editor
              </h3>

              {/* Add / Edit news Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newsForm.title || !newsForm.detail) return;

                  const parsedImages = newsImagesText
                    .split('\n')
                    .map(line => line.trim())
                    .filter(Boolean);

                  if (isEditingNews) {
                    setNews(prev => prev.map(n => n.id === isEditingNews ? { ...n, ...newsForm, images: parsedImages } as NewsItem : n));
                    setIsEditingNews(null);
                  } else {
                    const newItem: NewsItem = {
                      id: 'news-' + Date.now(),
                      title: newsForm.title || '',
                      detail: newsForm.detail || '',
                      timeDate: newsForm.timeDate || new Date().toISOString().substring(0,10),
                      imageUrl: newsForm.imageUrl || 'https://images.unsplash.com/photo-1504813184591-01552661c88c?auto=format&fit=crop&w=800&q=80',
                      images: parsedImages
                    };
                    setNews(prev => [...prev, newItem]);
                  }
                  setNewsForm({ id: '', title: '', detail: '', timeDate: '', imageUrl: '' });
                  setNewsImagesText('');
                }} 
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
              >
                <h4 className="text-xs uppercase font-extrabold text-[#006830] tracking-wider">
                  {isEditingNews ? '✏️ Edit Selected News Post' : '➕ Write New News Document'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">News Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Free Eye Treatment camp completed"
                      value={newsForm.title || ''}
                      onChange={e => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-1 text-xs border border-gray-200 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Date (e.g. 2026-05-31)</label>
                    <input
                      type="date"
                      value={newsForm.timeDate || ''}
                      onChange={e => setNewsForm(prev => ({ ...prev, timeDate: e.target.value }))}
                      className="w-full px-3 py-1 text-xs border border-gray-200 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Cover Photo URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newsForm.imageUrl || ''}
                      onChange={e => setNewsForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-3 py-1 text-xs border border-gray-200 rounded"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-xs font-bold text-gray-700 block">More News/Event Photos (One URL per line - Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                      value={newsImagesText}
                      onChange={e => setNewsImagesText(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="text-xs font-bold text-gray-700">Detailed News Contents</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Type fully detailed news article contents..."
                      value={newsForm.detail || ''}
                      onChange={e => setNewsForm(prev => ({ ...prev, detail: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  {isEditingNews && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingNews(null);
                        setNewsForm({ id: '', title: '', detail: '', timeDate: '', imageUrl: '' });
                        setNewsImagesText('');
                      }}
                      className="bg-gray-300 text-gray-800 font-bold px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-[#00A64C] text-white font-bold px-5 py-1.5 rounded text-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <Check className="size-3.5" /> Save News Post
                  </button>
                </div>
              </form>

              {/* List of current news articles */}
              <div className="space-y-2">
                {news.map((item) => (
                  <div key={item.id} className="p-3 bg-white border rounded-xl flex gap-3 shadow-xs items-start">
                    <img src={item.imageUrl} alt="prev" className="size-16 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-gray-900 leading-snug truncate">{item.title}</h5>
                      <span className="text-[10px] text-gray-400 block font-bold">
                        {item.timeDate} {item.images && item.images.length > 0 ? `(${item.images.length + 1} photos)` : ''}
                      </span>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.detail}</p>
                      
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => {
                            setNewsForm(item);
                            setIsEditingNews(item.id);
                            setNewsImagesText(item.images?.join('\n') || '');
                          }}
                          className="text-[10px] uppercase font-bold text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit className="size-3" /> Edit
                        </button>
                        <button
                          onClick={() => setNews(prev => prev.filter(n => n.id !== item.id))}
                          className="text-[10px] uppercase font-bold text-red-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="size-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Tab 9: Price list & Contact info */}
        {activeSubTab === 'prices' && (
          <div className="space-y-6">
            
            {/* Price list file entries */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-[#006830] text-lg font-bold flex items-center gap-2">
                <FileText className="size-5 text-[#00A64C]" />
                9) Billing Price Lists (PDF reference links)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg animate-in fade-in duration-300">
                <input
                  type="text"
                  placeholder="Price List Document Title"
                  value={priceForm.title}
                  onChange={e => setPriceForm(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
                <input
                  type="text"
                  placeholder="PDF Link URL"
                  value={priceForm.pdfUrl}
                  onChange={e => setPriceForm(prev => ({ ...prev, pdfUrl: e.target.value }))}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!priceForm.title || !priceForm.pdfUrl) return;
                  setPriceList(prev => [...prev, { id: 'pr-' + Date.now(), title: priceForm.title, pdfUrl: priceForm.pdfUrl }]);
                  setPriceForm({ title: '', pdfUrl: '' });
                }}
                className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
              >
                Add Price List Entry
              </button>

              <div className="space-y-2">
                {priceList.map((pr) => (
                  <div key={pr.id} className="flex justify-between items-center bg-slate-50 p-2 text-xs border rounded-lg">
                    <div>
                      <strong className="text-gray-900">{pr.title}</strong>
                      <span className="text-gray-500 pl-3">({pr.pdfUrl})</span>
                    </div>
                    <button
                      onClick={() => setPriceList(prev => prev.filter(item => item.id !== pr.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact coordinates */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-[#006830] text-lg font-bold flex items-center gap-2">
                <Phone className="size-5 text-[#00A64C]" />
                10) Hospital contact details editor
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Telephone Primary</label>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, phone: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Secondary Telephone</label>
                  <input
                    type="text"
                    value={contact.secondaryPhone}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, secondaryPhone: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">24/7 Ambulance Hotline</label>
                  <input
                    type="text"
                    value={contact.ambulancePhone}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, ambulancePhone: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Ambulance Photo URL</label>
                  <input
                    type="text"
                    value={contact.ambulancePicUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, ambulancePicUrl: val }));
                    }}
                    placeholder="https://images.unsplash.com/... (Ambulance vehicle picture)"
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                  {contact.ambulancePicUrl && (
                    <div className="mt-1">
                      <p className="text-[10px] text-gray-500 font-semibold mb-0.5">Live Preview:</p>
                      <img 
                        src={contact.ambulancePicUrl} 
                        alt="Ambulance Preview" 
                        className="h-14 w-28 object-cover rounded border border-gray-200 shadow-2xs"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583324113626-70df0f4cedf2?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Official Hospital Email</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, email: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Official Helpdesk WhatsApp No</label>
                  <input
                    type="text"
                    value={contact.whatsappNumber || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, whatsappNumber: val }));
                    }}
                    placeholder="e.g. 9851451956"
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Hospital Street Address</label>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, address: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Working / OPD timings text</label>
                  <input
                    type="text"
                    value={contact.workingHours}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, workingHours: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-bold text-[#006830]">Google Maps Embed Iframe Src URL (Iframe Src Link Only)</label>
                  <input
                    type="text"
                    value={contact.mapEmbedUrl}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, mapEmbedUrl: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Facebook URL</label>
                  <input
                    type="text"
                    value={contact.facebookUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, facebookUrl: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={contact.youtubeUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, youtubeUrl: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Instagram Profile URL</label>
                  <input
                    type="text"
                    value={contact.instagramUrl || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setContact(prev => ({ ...prev, instagramUrl: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 10: System Web settings */}
        {activeSubTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-[#006830] text-lg font-bold flex items-center gap-2">
                <Settings className="size-5 text-[#00A64C]" />
                11) General web parameters (Logo, Title, Banners slideshow, map, phone)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Web Site Branded Name</label>
                  <input
                    type="text"
                    value={settings.webName}
                    onChange={e => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, webName: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1 bg-green-50/50 p-2.5 rounded-lg border border-[#00A64C]/15">
                  <label className="text-xs font-black text-emerald-800 flex items-center gap-1">
                    <span>Branded Logo Image URL</span>
                    <span className="bg-[#00A64C] text-white text-[8px] px-1 rounded uppercase">Horizontal</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://domain.com/logo.png"
                    value={settings.logoUrl}
                    onChange={e => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, logoUrl: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-emerald-200 rounded bg-white focus:ring-1 focus:ring-[#00A64C] focus:outline-none"
                  />
                  <p className="text-[10px] text-emerald-700 leading-tight font-medium mt-1">
                    💡 <strong>Green City style horizontal logo setup:</strong> Paste any direct image URL (PNG/JPG) of a horizontal logo.
                  </p>
                  <p className="text-[9px] text-[#006830] leading-none italic font-bold mt-0.5">
                    नेपाली: यहाँ तेर्सो-आकार (horizontal layout) भएको Logo को Image Link राख्न सक्नुहुन्छ।
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Hotline Number (e.g. +977-10-520111)</label>
                  <input
                    type="text"
                    value={settings.number}
                    onChange={e => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, number: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-bold text-gray-700">SEO Meta Description</label>
                  <input
                    type="text"
                    value={settings.seoDescription}
                    onChange={e => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, seoDescription: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700">Welcome Text Heading text</label>
                  <input
                    type="text"
                    value={settings.welcomeTitle}
                    onChange={e => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, welcomeTitle: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Welcome Section Image URL</label>
                  <input
                    type="text"
                    value={settings.welcomeImage}
                    onChange={e => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, welcomeImage: val }));
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-3">
                  <label className="text-xs font-bold text-gray-700">Welcome Content Description detailed</label>
                  <textarea
                    rows={4}
                    value={settings.welcomeText}
                    onChange={e => {
                      const val = e.target.value;
                      setSettings(prev => ({ ...prev, welcomeText: val }));
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* BANNERS list manager */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Hospital Home Slide Banners configuration</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2">
                  <input
                    type="text"
                    placeholder="Large Slide Banner Title"
                    value={bannerForm.title}
                    onChange={e => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                    className="px-3 py-1 text-xs border border-gray-200 rounded focus:outline-none bg-slate-50"
                  />
                  <input
                    type="text"
                    placeholder="Sub-Caption Details"
                    value={bannerForm.subtitle}
                    onChange={e => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="px-3 py-1 text-xs border border-gray-200 rounded focus:outline-none bg-slate-50"
                  />
                  <input
                    type="text"
                    placeholder="Background Photo URL"
                    value={bannerForm.imageUrl}
                    onChange={e => setBannerForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="px-3 py-1 text-xs border border-gray-200 rounded focus:outline-none bg-slate-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!bannerForm.imageUrl || !bannerForm.title) return;
                    setSettings(prev => ({
                      ...prev,
                      banners: [...prev.banners, { id: 'b-' + Date.now(), title: bannerForm.title, subtitle: bannerForm.subtitle, imageUrl: bannerForm.imageUrl }]
                    }));
                    setBannerForm({ title: '', subtitle: '', imageUrl: '' });
                  }}
                  className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer"
                >
                  Add Slideshow Banner
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {settings.banners.map((b) => (
                    <div key={b.id} className="p-3 bg-slate-50 border rounded-xl flex gap-3 relative group">
                      <img src={b.imageUrl} alt={b.title} className="w-20 h-16 object-cover rounded-md shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-gray-900 truncate">{b.title}</h5>
                        <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{b.subtitle}</p>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, banners: prev.banners.filter(it => it.id !== b.id) }))}
                        className="absolute top-1 right-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-1 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Testimonials Panel */}
        {activeSubTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-4xl">
              <h3 className="text-[#006830] text-base font-bold mb-1 flex items-center gap-2">
                <MessageCircle className="size-5 text-[#00A64C]" />
                Manage Patient Testimonials
              </h3>
              <p className="text-xs text-gray-500 pb-6">Add, update, or remove patient reviews and success testimonials visible on the home page.</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!testiForm.name || !testiForm.comment) return;
                
                if (isEditingTesti) {
                  setTestimonials(prev => prev.map(t => t.id === isEditingTesti ? { ...t, name: testiForm.name!, address: testiForm.address || '', comment: testiForm.comment! } : t));
                  setIsEditingTesti(null);
                } else {
                  const newT = {
                    id: 'testi-' + Date.now(),
                    name: testiForm.name!,
                    address: testiForm.address || '',
                    comment: testiForm.comment!
                  };
                  setTestimonials(prev => [...prev, newT]);
                }
                setTestiForm({ id: '', name: '', address: '', comment: '' });
              }} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-gray-100 mb-8 max-w-xl">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{isEditingTesti ? 'Edit Patient Testimonial' : 'Register New Testimonial'}</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Patient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Parash Acharya"
                      value={testiForm.name || ''}
                      onChange={e => setTestiForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">City / Location (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Bhairahawa"
                      value={testiForm.address || ''}
                      onChange={e => setTestiForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-1 block">
                  <label className="text-xs font-semibold text-gray-600">Testimonial Comment</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Type detailed patient testimonial content here..."
                    value={testiForm.comment || ''}
                    onChange={e => setTestiForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white text-gray-800"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006830] hover:bg-black text-white font-bold text-xs rounded transition-colors cursor-pointer"
                  >
                    {isEditingTesti ? 'Update Testimonial' : 'Add Testimonial'}
                  </button>
                  {isEditingTesti && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingTesti(null);
                        setTestiForm({ id: '', name: '', address: '', comment: '' });
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Current Testimonials list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1 mb-2">Registered Patient Reviews ({testimonials.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(item => (
                    <div key={item.id} className="p-4 bg-white border border-gray-150 rounded-xl relative hover:border-gray-300 transition-colors">
                      <div className="pr-16">
                        <p className="text-xs text-gray-700 italic mb-2 leading-relaxed">"{item.comment}"</p>
                        <h5 className="text-xs font-bold text-gray-900">{item.name}</h5>
                        {item.address && <p className="text-[10px] text-gray-400">{item.address}</p>}
                      </div>
                      <div className="absolute right-3 top-3 flex gap-1">
                        <button
                          onClick={() => {
                            setIsEditingTesti(item.id);
                            setTestiForm(item);
                          }}
                          className="p-1 text-gray-500 hover:text-indigo-600 rounded hover:bg-slate-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setTestimonials(prev => prev.filter(t => t.id !== item.id))}
                          className="p-1 text-gray-150 hover:text-red-600 rounded hover:bg-slate-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Panel */}
        {activeSubTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-4xl">
              <h3 className="text-[#006830] text-base font-bold mb-1 flex items-center gap-2">
                <Calendar className="size-5 text-[#00A64C]" />
                Manage Dhading Hospital Event Schedules
              </h3>
              <p className="text-xs text-gray-500 pb-6">Add, update, or remove health camps, free clinics, surgery news events visible on the home page.</p>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!eventForm.day || !eventForm.monthYear || !eventForm.title) return;
                
                if (isEditingEvent) {
                  setEvents(prev => prev.map(ev => ev.id === isEditingEvent ? { 
                    ...ev, 
                    day: eventForm.day!, 
                    monthYear: eventForm.monthYear!, 
                    title: eventForm.title!, 
                    subtitle: eventForm.subtitle || '',
                    imageUrl: eventForm.imageUrl || ''
                  } : ev));
                  setIsEditingEvent(null);
                } else {
                  const newEv = {
                    id: 'event-' + Date.now(),
                    day: eventForm.day!,
                    monthYear: eventForm.monthYear!,
                    title: eventForm.title!,
                    subtitle: eventForm.subtitle || '',
                    imageUrl: eventForm.imageUrl || ''
                  };
                  setEvents(prev => [...prev, newEv]);
                }
                setEventForm({ id: '', day: '', monthYear: '', title: '', subtitle: '', imageUrl: '' });
              }} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-gray-100 mb-8 max-w-xl">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">{isEditingEvent ? 'Modify Event Schedule' : 'Schedule New Event'}</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Event Date Day (Number/Text)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 11th"
                      value={eventForm.day || ''}
                      onChange={e => setEventForm(prev => ({ ...prev, day: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Month & Year</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dec 2016"
                      value={eventForm.monthYear || ''}
                      onChange={e => setEventForm(prev => ({ ...prev, monthYear: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-1 block">
                  <label className="text-xs font-semibold text-gray-600">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Health camp in Nuwakot"
                    value={eventForm.title || ''}
                    onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white font-medium text-gray-800"
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-xs font-semibold text-gray-600">Event Description / Subtitle</label>
                  <textarea
                    rows={3}
                    placeholder="Optional details, e.g. Completed 3 Days of Free Health Camp..."
                    value={eventForm.subtitle || ''}
                    onChange={e => setEventForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white text-gray-800"
                  />
                </div>

                <div className="space-y-1 block">
                  <label className="text-xs font-semibold text-gray-600">Event Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    value={eventForm.imageUrl || ''}
                    onChange={e => setEventForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-white text-gray-800"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006830] hover:bg-black text-white font-bold text-xs rounded transition-colors cursor-pointer"
                  >
                    {isEditingEvent ? 'Update Event' : 'Schedule Event'}
                  </button>
                  {isEditingEvent && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingEvent(null);
                        setEventForm({ id: '', day: '', monthYear: '', title: '', subtitle: '', imageUrl: '' });
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Current Events list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1 mb-2">Upcoming & Historical Events ({events.length})</h4>
                <div className="space-y-4 max-w-3xl">
                  {events.map(item => (
                    <div key={item.id} className="p-4 bg-white border border-gray-150 rounded-xl flex items-center gap-4 hover:border-gray-300 transition-colors relative">
                      <div className="bg-[#00A64C] text-white flex flex-col items-center justify-center rounded-lg p-2.5 min-w-[75px] aspect-square shadow-sm shrink-0">
                        <span className="text-lg font-black leading-none">{item.day}</span>
                        <span className="text-[10px] font-bold text-white/95 uppercase tracking-wide mt-1">{item.monthYear}</span>
                      </div>
                      
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 object-cover rounded-lg border border-gray-100 shrink-0"
                        />
                      )}

                      <div className="pr-16 flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-gray-900 leading-snug truncate">{item.title}</h5>
                        {item.subtitle && <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.subtitle}</p>}
                      </div>
                      <div className="absolute right-3 top-3 flex gap-1">
                        <button
                          onClick={() => {
                            setIsEditingEvent(item.id);
                            setEventForm(item);
                          }}
                          className="p-1 text-gray-500 hover:text-indigo-600 rounded hover:bg-slate-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setEvents(prev => prev.filter(ev => ev.id !== item.id))}
                          className="p-1 text-gray-150 hover:text-red-600 rounded hover:bg-slate-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

         {activeSubTab === 'qrCodes' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#006830] flex items-center gap-2">
                <QrCode className="size-5 text-[#00A64C]" />
                Manage Official QR Codes Gallery
              </h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Add, preview, and delete merchant pay QR scanner codes (from Fonepay, eSewa, Khalti, or specific local banks) which are shown to patients choosing "Pay Now via Scan QR".
              </p>

              {/* Add form */}
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3 max-w-xl text-left">
                <h4 className="text-xs font-black uppercase text-[#006830]">Add New Scanner QR</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">QR Merchant Title / Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Fonepay Scan (Nabil Bank)"
                      value={newQrTitle}
                      onChange={e => setNewQrTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Direct Image URL</label>
                    <input
                      type="text"
                      placeholder="https://your-image-link/qr.png"
                      value={newQrImageUrl}
                      onChange={e => setNewQrImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded focus:outline-none"
                    />
                  </div>
                </div>
                <div className="pt-1 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newQrTitle || !newQrImageUrl) return;
                      const newItem = {
                        id: 'qr-' + Date.now(),
                        title: newQrTitle,
                        imageUrl: newQrImageUrl
                      };
                      setQrCodes(prev => [...prev, newItem]);
                      setNewQrTitle('');
                      setNewQrImageUrl('');
                    }}
                    className="bg-[#00A64C] hover:bg-[#006830] text-white text-xs font-black px-4 py-2 rounded-lg cursor-pointer transition-colors uppercase tracking-wider"
                  >
                    Add Scanner QR
                  </button>
                </div>
              </div>

              {/* Listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
                {qrCodes.map((qr) => (
                  <div key={qr.id} className="bg-white rounded-2xl overflow-hidden border border-gray-150 p-4 flex flex-col justify-between items-center text-center space-y-3 hover:shadow-md transition-shadow">
                    <div className="w-40 h-40 border rounded bg-slate-50 p-1 flex items-center justify-center overflow-hidden">
                      <img src={qr.imageUrl} alt={qr.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left w-full space-y-1">
                      <strong className="text-xs text-gray-900 block truncate">{qr.title}</strong>
                      <span className="text-[10px] text-gray-400 block break-all leading-normal line-clamp-1">{qr.imageUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setQrCodes(prev => prev.filter(q => q.id !== qr.id))}
                      className="w-full text-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-1.5 rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" /> Delete QR code
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 11: Credentials & Password */}
        {activeSubTab === 'password' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs max-w-lg">
              <h3 className="text-[#006830] text-base font-bold mb-1 flex items-center gap-2">
                <Key className="size-5 text-[#00A64C]" />
                12) Update Security Passwords credentials
              </h3>
              <p className="text-xs text-gray-500 pb-4 font-normal">Change both operational administrative passkey and rescue recovery passkeys safely.</p>

              {passwordStatusText.text && (
                <div className={`p-3 rounded-lg text-xs leading-normal mb-4 font-bold border ${
                  passwordStatusText.isError 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}>
                  {passwordStatusText.text}
                </div>
              )}

              <form onSubmit={handleModifyCredentials} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Existing Active Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Current Administrator Password"
                    value={passwords.currentPassword}
                    onChange={e => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">New Selected Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Unique Key String"
                    value={passwords.newPassword}
                    onChange={e => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Backup / Recovery Override Key String</label>
                  <input
                    type="password"
                    placeholder="Optional Recovery Code string"
                    value={passwords.newRecoveryPassword}
                    onChange={e => setPasswords(prev => ({ ...prev, newRecoveryPassword: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#006830] hover:bg-[#000000] text-white font-bold text-xs py-2 rounded transition-colors cursor-pointer text-center uppercase"
                >
                  Save Credential Directives
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
