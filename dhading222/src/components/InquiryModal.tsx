import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, CheckCircle2, User, Phone, Mail, FileText, 
  AlertCircle, DollarSign, Download, MessageCircle, QrCode, Search, Check, Gift
} from 'lucide-react';
import { Doctor, BookingRequest, QRCodeItem, ServiceItem } from '../types';
import { DETAILED_PRICE_LIST } from '../priceListData';

interface InquiryModalProps {
  categories: string[];
  doctors: Doctor[];
  preventiveHealth: ServiceItem[];
  qrCodes: QRCodeItem[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: BookingRequest) => void;
  defaultDept?: string;
  defaultDoc?: string;
  defaultDay?: string;
  defaultTime?: string;
}

export default function InquiryModal({
  categories,
  doctors,
  preventiveHealth = [],
  qrCodes = [],
  isOpen,
  onClose,
  onSubmit,
  defaultDept = '',
  defaultDoc = '',
  defaultDay = 'Sunday',
  defaultTime = 'Morning - 9 AM'
}: InquiryModalProps) {
  // Step in the modal: 'details' -> 'payment' -> 'success'
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientNumber: '',
    whatsappNumber: '',
    address: '',
    bookingType: 'Doctor Consultation', // 'Doctor Consultation' | 'Appointment' | 'Health Checkup Package' | 'Medical Services'
    selectedItem: '', // Doctor name, package title, or service name
    day: 'Sunday',
    time: 'Morning - 9 AM',
    message: ''
  });

  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorDept, setSelectedDoctorDept] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [computedPrice, setComputedPrice] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Hospital' | 'Pay Now'>('Cash on Hospital');
  const [selectedQrCodeIdx, setSelectedQrCodeIdx] = useState(0);
  const [whatsappClicked, setWhatsappClicked] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Sift doctors corresponding to selected Category
  useEffect(() => {
    if (selectedDoctorDept) {
      const filtered = doctors.filter(dr => dr.category === selectedDoctorDept);
      setAvailableDoctors(filtered);
      if (filtered.length > 0) {
        setFormData(prev => ({ ...prev, selectedItem: filtered[0].name }));
      } else {
        setFormData(prev => ({ ...prev, selectedItem: 'Duty Specialist Doctor' }));
      }
    }
  }, [selectedDoctorDept, doctors]);

  // Set default pre-fills when opening
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setWhatsappClicked(false);
      setFormData({
        patientName: '',
        patientEmail: '',
        patientNumber: '',
        whatsappNumber: '',
        address: '',
        bookingType: defaultDoc ? 'Doctor Consultation' : defaultDept ? 'Doctor Consultation' : 'Doctor Consultation',
        selectedItem: defaultDoc || '',
        day: defaultDay,
        time: defaultTime,
        message: ''
      });
      if (defaultDept) {
        setSelectedDoctorDept(defaultDept);
      } else if (categories.length > 0) {
        setSelectedDoctorDept(categories[0]);
      }
      setComputedPrice('500');
    }
  }, [isOpen, defaultDept, defaultDoc, defaultDay, defaultTime]);

  // Dynamically update the price based on what is selected
  useEffect(() => {
    if (formData.bookingType === 'Doctor Consultation') {
      setComputedPrice('500'); // Standard consultation fee
    } else if (formData.bookingType === 'Appointment') {
      setComputedPrice('300'); // Standard appointment slot token
    } else if (formData.bookingType === 'Health Checkup Package') {
      // Find package and parse it
      const matched = preventiveHealth.find(p => p.title === formData.selectedItem);
      if (matched && matched.text) {
        const match = matched.text.match(/Rs\.\s*([\d,]+)/i);
        setComputedPrice(match ? match[1] : '3,500');
      } else {
        setComputedPrice('3,500');
      }
    } else if (formData.bookingType === 'Medical Services') {
      const matched = DETAILED_PRICE_LIST.find(s => s.name === formData.selectedItem);
      setComputedPrice(matched ? matched.rate : '250');
    }
  }, [formData.bookingType, formData.selectedItem, preventiveHealth]);

  if (!isOpen) return null;

  // Search filter for Medical services
  const filteredServices = DETAILED_PRICE_LIST.filter(item => 
    item.name.toLowerCase().includes(serviceSearch.toLowerCase())
  ).slice(0, 8);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientNumber || !formData.whatsappNumber || !formData.address) {
      setErrorText('Please provide Patient Name, Contact Phone, WhatsApp Number and Home Address.');
      return;
    }
    setErrorText('');
    setStep('payment');
  };

  const handleDownloadQR = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_${title.replace(/\s+/g, '_')}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppRedirection = () => {
    setWhatsappClicked(true);
    const textMessage = `प्रणाम, म धादिङ हस्पिटलमा अनलाइन बुकिङ गर्दैछु।

📋 मेरो विवरण निम्नलिखित छ:
----------------------------------
👤 बिरामीको नाम: ${formData.patientName}
📞 सम्पर्क नम्बर: ${formData.patientNumber}
💬 व्हाट्सएप नम्बर: ${formData.whatsappNumber}
📍 ठेगाना: ${formData.address}
📅 सम्पर्क समय: ${formData.day} (${formData.time})

🏥 बुकिङ प्रकार: ${formData.bookingType}
🩺 सेवा/चिकित्सक: ${formData.selectedItem}
💵 तिर्नुपर्ने जम्मा रकम: Rs. ${computedPrice}/-
💸 भुक्तानी प्रकार: Scan QR Mobile Banking

[नोट: मैले आधिकारिक QR स्क्यान गरी भुक्तानी गरिसकेको छु। भुक्तानीको स्क्रिनसट यहाँ एट्याच गरेको छु। कृपया मेरो बुकिङ स्वीकृत गरिदिनुहोला]`;

    const encodedText = encodeURIComponent(textMessage);
    // Open Official WhatsApp (Using the hospital hotline number 9779851012345 or patient number as fallback)
    const whatsappLink = `https://wa.me/9779851012345?text=${encodedText}`;
    try {
      window.open(whatsappLink, '_blank');
    } catch (e) {
      console.warn("Iframe popup support limited:", e);
      const tempLink = document.createElement('a');
      tempLink.href = whatsappLink;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      tempLink.click();
    }
  };

  const handleFinalSubmit = () => {
    if (paymentMethod === 'Pay Now' && !whatsappClicked) {
      setErrorText('कृपया हरियो बटनमा क्लिक गरी भुक्तानीको स्क्रिनसट व्हाट्सएपमा पठाउनुहोस्ँ, अनि मात्र बुकिङ पुष्टि हुनेछ ।');
      return;
    }

    const newBooking: BookingRequest = {
      id: 'b-' + Date.now(),
      patientName: formData.patientName,
      patientEmail: formData.patientEmail || 'not-provided@hospital.org',
      patientNumber: formData.patientNumber,
      whatsappNumber: formData.whatsappNumber,
      address: formData.address,
      bookingType: formData.bookingType,
      selectedItem: formData.selectedItem,
      amountToPay: computedPrice,
      paymentMethod: paymentMethod,
      status: 'pending',
      doctorType: formData.bookingType,
      doctorName: formData.selectedItem,
      day: formData.day,
      time: formData.time,
      message: formData.message || 'Booked online',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onSubmit(newBooking);
    setStep('success');
    setErrorText('');

    // Auto-close after 4 seconds
    setTimeout(() => {
      onClose();
    }, 4000);
  };

  const daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timesList = [
    'Morning - 9 AM',
    'Morning - 10 AM to 2 PM',
    'Afternoon - 3 PM to 5 PM',
    'Evening - 6 PM to 8 PM',
    'Duty Consultant Hour'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in-0 duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006830] to-[#00A64C] text-white px-6 py-4 flex justify-between items-center shrink-0 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-yellow-300" />
            <h3 className="text-lg font-black tracking-tight uppercase">Dhading Booking & Payment Desk</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white hover:scale-105 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'success' ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="size-16 text-[#00A64C] mx-auto animate-bounce" />
              <h4 className="text-xl font-extrabold text-[#006830]">बुकिङ अनुरोध सफल भयो !</h4>
              <p className="text-[#00A64C] text-sm font-bold">Booking Request Lodged Successfully!</p>
              <div className="bg-slate-50 p-4 rounded-xl text-gray-600 text-xs text-left space-y-1 max-w-md mx-auto border font-medium">
                <p><strong>Patient Name:</strong> {formData.patientName}</p>
                <p><strong>Booking Type:</strong> {formData.bookingType}</p>
                <p><strong>Selected Item:</strong> {formData.selectedItem}</p>
                <p><strong>Amount:</strong> Rs. {computedPrice}/- ({paymentMethod})</p>
                <p className="text-green-700 pt-1 font-bold">★ Status: PENDING (Admin panel list updated)</p>
              </div>
              <p className="text-xs text-gray-400">Our Admission desk will authenticate your schedule card shortly. Redirecting...</p>
            </div>
          ) : step === 'details' ? (
            <form onSubmit={handleNextStep} className="space-y-4">
              {errorText && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-xs font-bold leading-tight">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span>{errorText}</span>
                </div>
              )}

              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Choose the booking type you prefer (Doctor consultation, general token appointment, preventive health health checkup plans, or exact pricing test from the price list data).
              </p>

              {/* Booking Type Select buttons */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-wide">
                  1. What would you like to Book?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Doctor Consultation', label: 'Doctor Specialist' },
                    { id: 'Appointment', label: 'General Appointment' },
                    { id: 'Health Checkup Package', label: 'Checkup Package' },
                    { id: 'Medical Services', label: 'Medical Tests / Bed' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => {
                          let defaultItem = '';
                          if (btn.id === 'Doctor Consultation' && doctors.length > 0) {
                            defaultItem = doctors[0].name;
                          } else if (btn.id === 'Health Checkup Package' && preventiveHealth.length > 0) {
                            defaultItem = preventiveHealth[0].title;
                          } else if (btn.id === 'Medical Services') {
                            defaultItem = DETAILED_PRICE_LIST[0].name;
                            setServiceSearch(DETAILED_PRICE_LIST[0].name);
                          } else {
                            defaultItem = 'General Health Consultation';
                          }
                          return {
                            ...prev,
                            bookingType: btn.id,
                            selectedItem: defaultItem
                          };
                        });
                      }}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center cursor-pointer ${
                        formData.bookingType === btn.id
                          ? 'bg-[#00A64C] text-white border-transparent shadow-xs scale-103'
                          : 'bg-white text-gray-700 hover:bg-slate-50 border-gray-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic field rendering based on booking type selection */}
              {formData.bookingType === 'Doctor Consultation' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left space-y-3.5 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Select Specialty Department</label>
                    <select
                      value={selectedDoctorDept}
                      onChange={e => setSelectedDoctorDept(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-semibold"
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Select Specialist Clinician</label>
                    <select
                      value={formData.selectedItem}
                      onChange={e => setFormData(prev => ({ ...prev, selectedItem: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-bold text-emerald-800"
                    >
                      {availableDoctors.length > 0 ? (
                        availableDoctors.map((dr) => (
                          <option key={dr.id} value={dr.name}>{dr.name} ({dr.level})</option>
                        ))
                      ) : (
                        <option value="Duty Medical Officer">Duty Medical Officer (Staff Specialist On Call)</option>
                      )}
                    </select>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 text-xs rounded border">
                    <span className="text-gray-500 font-bold">Standard Consultation Fee:</span>
                    <span className="text-rose-600 font-black font-mono text-sm">Rs. {computedPrice}/-</span>
                  </div>
                </div>
              )}

              {formData.bookingType === 'Appointment' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Describe General Booking Speciality Area</label>
                    <input
                      type="text"
                      placeholder="e.g. Health Review, Dental Checkup, etc."
                      value={formData.selectedItem}
                      onChange={e => setFormData(prev => ({ ...prev, selectedItem: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-bold"
                    />
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 text-xs rounded border">
                    <span className="text-gray-500 font-bold">General Appointment Ticket fee:</span>
                    <span className="text-rose-600 font-black font-mono text-sm">Rs. {computedPrice}/-</span>
                  </div>
                </div>
              )}

              {formData.bookingType === 'Health Checkup Package' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1 pb-1">
                    <label className="block text-xs font-bold text-gray-700">Select Health Checkup Package Plan</label>
                    <select
                      value={formData.selectedItem}
                      onChange={e => setFormData(prev => ({ ...prev, selectedItem: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-bold text-emerald-800"
                    >
                      {preventiveHealth.length > 0 ? (
                        preventiveHealth.map((item) => (
                          <option key={item.id} value={item.title}>{item.title}</option>
                        ))
                      ) : (
                        <>
                          <option value="GROUP A: EXECUTIVE HEALTH CHECKUP PACKAGE PLAN">GROUP A: EXECUTIVE HEALTH CHECKUP (Rs. 12,000)</option>
                          <option value="GROUP B: COMPREHENSIVE MEDICAL CHECKUP PACKAGE">GROUP B: COMPREHENSIVE MEDICAL (Rs. 7,499)</option>
                          <option value="GROUP E: CHILD HEALTH WELLNESS PACKAGE">GROUP E: CHILD HEALTH WELLNESS (Rs. 3,500)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 text-xs rounded border">
                    <span className="text-gray-500 font-bold">Package Offer Rate:</span>
                    <span className="text-[#00A64C] font-black font-mono text-base">Rs. {computedPrice}/-</span>
                  </div>
                </div>
              )}

              {formData.bookingType === 'Medical Services' && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left space-y-3.5 relative animate-in fade-in duration-200">
                  <div className="space-y-1 relative">
                    <label className="block text-xs font-bold text-gray-700">Search and Select Medical Service / Test Rate</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 size-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Type to search (e.g. General Bed, ICU, Chest X-Ray, Lab, scan...)"
                        value={serviceSearch}
                        onChange={e => {
                          setServiceSearch(e.target.value);
                          setShowServiceDropdown(true);
                        }}
                        onFocus={() => setShowServiceDropdown(true)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-bold text-slate-800"
                      />
                    </div>

                    {showServiceDropdown && serviceSearch && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-gray-100 divide-dashed">
                        {filteredServices.length > 0 ? (
                          filteredServices.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, selectedItem: item.name }));
                                setServiceSearch(item.name);
                                setShowServiceDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#00A64C]/10 text-gray-800 hover:text-[#006830] transition-colors flex justify-between items-center font-bold"
                            >
                              <span>{item.name}</span>
                              <span className="text-rose-600 font-mono font-black shrink-0">Rs. {item.rate}/-</span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-xs text-gray-400">No matching clinical rates found.</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-2.5 rounded border border-gray-150 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-400 block font-bold text-[10px] uppercase">Currently Selected rate:</span>
                      <strong className="text-slate-800 text-xs line-clamp-1">{formData.selectedItem || "None selected - search above"}</strong>
                    </div>
                    <span className="text-rose-600 font-mono font-black text-base shrink-0 border-l pl-3">
                      Rs. {computedPrice}/-
                    </span>
                  </div>
                </div>
              )}

              {/* Patient Intake Fields */}
              <div className="space-y-3.5 border-t pt-4">
                <caption className="block text-left text-xs font-black uppercase text-[#006830] tracking-wider mb-2">
                  2. Patient Contact Details
                </caption>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Patient Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 size-3.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="बिरामीको नाम"
                        value={formData.patientName}
                        onChange={e => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Contact Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-3.5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="सम्पर्क फोन नम्बर"
                        value={formData.patientNumber}
                        onChange={e => setFormData(prev => ({ ...prev, patientNumber: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WhatsApp Number */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">WhatsApp Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-2.5 size-3.5 text-emerald-600" />
                      <input
                        type="tel"
                        required
                        placeholder="व्हाट्सएप नम्बर"
                        value={formData.whatsappNumber}
                        onChange={e => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Patient Full Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 size-3.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="सम्पर्क ठेगाना (e.g. नीलकण्ठ-३, धादिङ)"
                        value={formData.address}
                        onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Day & Time Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Preferred Visit Day</label>
                    <select
                      value={formData.day}
                      onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-semibold"
                    >
                      {daysList.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Preferred Time Block</label>
                    <select
                      value={formData.time}
                      onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-semibold"
                    >
                      {timesList.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Patient Case Message */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700">Symptoms / Medical Complaints Note</label>
                  <textarea
                    rows={2}
                    placeholder="Describe symptoms, complaints or special notes to doctors..."
                    value={formData.message}
                    onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A64C] bg-white font-medium resize-none"
                  />
                </div>
              </div>

              {/* Submit triggers via Payment routing */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#00A64C] hover:bg-[#006830] transition-colors py-3 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] duration-150"
                >
                  Proceed to Payment Selection (भुक्तानी विधि) →
                </button>
              </div>
            </form>
          ) : (
            /* PAYMENT PROCESS STEP */
            <div className="space-y-5 text-left animate-in fade-in duration-200">
              {errorText && (
                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 flex  gap-2 text-xs font-bold leading-relaxed">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span>{errorText}</span>
                </div>
              )}

              <div className="bg-[#006830]/5 p-4 rounded-xl border border-[#006830]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Total Package Amount</h4>
                  <p className="text-[#006830] font-black text-xl font-mono mt-1">Rs. {computedPrice}/-</p>
                </div>
                <div className="text-right text-xs">
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-black uppercase text-[10px]">
                    {formData.bookingType}
                  </span>
                </div>
              </div>

              {/* Choose dual option */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-gray-500 tracking-wider">
                  Select payment mode:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('Cash on Hospital');
                      setErrorText('');
                    }}
                    className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
                      paymentMethod === 'Cash on Hospital'
                        ? 'border-[#00A64C] bg-emerald-50/10'
                        : 'border-gray-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Check className={`size-5 p-1 rounded-full text-white shrink-0 ${paymentMethod === 'Cash on Hospital' ? 'bg-[#00A64C]' : 'bg-gray-150 text-transparent'}`} />
                    <div>
                      <strong className="text-xs font-black block text-gray-800">Cash on Hospital</strong>
                      <span className="text-[10px] text-gray-400 font-bold leading-none">Pay at counter upon arrival</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('Pay Now');
                      setErrorText('');
                    }}
                    className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between h-24 ${
                      paymentMethod === 'Pay Now'
                        ? 'border-[#00D05E] bg-[#00D05E]/5'
                        : 'border-gray-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Check className={`size-5 p-1 rounded-full text-white shrink-0 ${paymentMethod === 'Pay Now' ? 'bg-[#00D05E]' : 'bg-gray-150 text-transparent'}`} />
                    <div>
                      <strong className="text-xs font-black block text-gray-800">Pay Now (Scan QR)</strong>
                      <span className="text-[10px] text-[#00A64C]/90 font-bold leading-none">Instant Online Transfer</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Option View depending on option selected */}
              {paymentMethod === 'Cash on Hospital' ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-dashed text-xs text-gray-600 font-medium space-y-1">
                  <p className="text-emerald-800 font-bold text-xs uppercase mb-1">★ Free Reservation Option Activated</p>
                  <p>You can directly submit your slot bookings request without scanned screenshots now.</p>
                  <p>On arrival, show your booking ID <span className="font-mono text-black font-extrabold">(PENDING status)</span> at the hospital cash referral counter, complete payment, and proceed to consultation desks directly.</p>
                </div>
              ) : (
                /* PAY NOW: Renders QR GALLERY & Direct instruction set */
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border text-slate-800 animate-in fade-in-50 duration-200">
                  <div className="text-center font-bold">
                    <h5 className="text-rose-600 font-black text-sm uppercase tracking-wide leading-none select-none">
                      भुक्तानी निर्देशन (Payment Guidelines)
                    </h5>
                    {/* Big Nepali Text precisely matching user prompt */}
                    <p className="text-red-700 font-black text-lg md:text-xl px-2 py-1 bg-red-100/50 rounded-lg mt-2 inline-block border border-red-200 shadow-xs leading-normal">
                      पेमेन्ट गरेपछि रिमार्कमा आफ्नो नाम लेख्नुहोला
                    </p>
                  </div>

                  {/* QR Core gallery lists */}
                  <div className="space-y-2 border-t pt-3">
                    <span className="text-[10px] font-black uppercase text-gray-500 block">Choose available receiver merchant QR:</span>
                    {qrCodes.length === 0 ? (
                      <div className="p-4 border rounded-xl bg-white text-center text-xs text-gray-400 font-bold">
                        No official QRs uploaded yet in Settings admin console. Please consult staff.
                      </div>
                    ) : (
                      <div className="space-y-3 bg-white p-3 rounded-xl border">
                        <div className="flex gap-2 justify-center flex-wrap pb-2 border-b border-gray-100">
                          {qrCodes.map((qr, idx) => (
                            <button
                              key={qr.id}
                              type="button"
                              onClick={() => setSelectedQrCodeIdx(idx)}
                              className={`text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                                selectedQrCodeIdx === idx
                                  ? 'bg-[#00A64C] text-white border-transparent'
                                  : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                              }`}
                            >
                              {qr.title}
                            </button>
                          ))}
                        </div>

                        {/* Rendering the currently selected QR Image */}
                        {qrCodes[selectedQrCodeIdx] && (
                          <div className="flex flex-col items-center p-3 text-center space-y-3 bg-slate-50 rounded-xl relative group">
                            <div className="w-56 h-56 bg-white border rounded-xl overflow-hidden shadow-xs flex items-center justify-center p-2 relative">
                              <img
                                src={qrCodes[selectedQrCodeIdx].imageUrl}
                                alt="Official QR scan"
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-left leading-normal">
                              <p className="text-xs font-black text-gray-950 block">{qrCodes[selectedQrCodeIdx].title}</p>
                              <p className="text-[10px] text-gray-400">Scan via Esewa, Fonepay, Khalti or Mobile Banking App</p>
                            </div>
                            
                            {/* Download QR feature */}
                            <button
                              type="button"
                              onClick={() => handleDownloadQR(qrCodes[selectedQrCodeIdx].imageUrl, qrCodes[selectedQrCodeIdx].title)}
                              className="bg-white hover:bg-[#00A64C] text-gray-700 hover:text-white px-4 py-2 border border-gray-200 hover:border-transparent rounded-lg text-xs font-black transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Download className="size-3.5" /> Download Scanner QR Code
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* GREEN SEND WA BUTTON - ENFORCING SCREENSHOT ON WHATSAPP */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black uppercase text-gray-400 block leading-tight">
                      भुक्तानीको स्क्रिनसट र विवरण व्हाट्सएपमा अवश्य पठाउनुहोस्:
                    </span>
                    <button
                      type="button"
                      onClick={handleWhatsAppRedirection}
                      className="w-full bg-[#25D366] hover:bg-[#075e54] text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
                    >
                      <MessageCircle className="size-5 shrink-0 fill-current" />
                      Send Scanned Screenshot & Details via WhatsApp
                    </button>
                    <p className="text-[10px] text-emerald-800 leading-normal text-center font-bold">
                      {whatsappClicked 
                        ? "✓ Opened official WhatsApp chat successfully." 
                        : "⚠ WhatsApp button click is strictly mandated before confirming reservation on our portal"}
                    </p>
                  </div>
                </div>
              )}

              {/* Action confirmations */}
              <div className="pt-3 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={paymentMethod === 'Pay Now' && !whatsappClicked}
                  className={`flex-1 text-center py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                    paymentMethod === 'Pay Now' && !whatsappClicked
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-80'
                      : 'bg-[#00A64C] hover:bg-[#006830] text-white shadow-md'
                  }`}
                >
                  Confirm Booking Now
                </button>
              </div>

              {paymentMethod === 'Pay Now' && !whatsappClicked && (
                <p className="text-center text-[10px] text-red-500 font-bold animate-pulse">
                  ⚠ भुक्तानी गरी स्क्रिनसट व्हाट्सएपमा पठाउनको लागि माथिको ठुलो हरियो बटनमा क्लिक गर्नु पर्ने छ ।
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
