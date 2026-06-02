export interface ServiceItem {
  id: string;
  title: string;
  imageUrl?: string;
  pdfUrl?: string;
  text?: string;
}

export interface Services {
  opd: ServiceItem[];
  ipd: ServiceItem[];
  emergency: ServiceItem[];
  labPathology: ServiceItem[];
  radiology: ServiceItem[];
  cashReception: ServiceItem[];
  pharmacy: ServiceItem[];
  ambulance: ServiceItem[];
  preventiveHealth: ServiceItem[];
}

export interface Doctor {
  id: string;
  name: string;
  experience: string;
  category: string;
  level: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  number: string;
  email?: string;
  profilePicUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  phone?: string;
  time?: string;
}

export interface ExecutiveStaff {
  id: string;
  role: string;
  name: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface AboutUs {
  introduction: {
    photoUrl: string;
    details: string;
  };
  boardOfDirectors: TeamMember[];
  chairmanMessage: {
    name: string;
    details: string;
    whatsappNumber: string;
    photoUrl: string;
  };
  hospitalWorkingTeam: TeamMember[];
  careersText: string;
  reception?: ExecutiveStaff;
  medicalDirector?: ExecutiveStaff;
  accountManager?: ExecutiveStaff;
}

export interface ForPatient {
  admissionDeskText: string;
  appointment: {
    id: string;
    title: string;
    imageUrl: string;
    pdfUrl: string;
  }[];
}

export interface ForVisitors {
  visitHour: {
    id: string;
    title: string;
    imageUrl: string;
  }[];
  dosAndDonts: {
    id: string;
    title: string;
    imageUrl: string;
    pdfUrl: string;
  }[];
  parking: {
    id: string;
    title: string;
    imageUrl: string;
  }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
}

export interface NewsItem {
  id: string;
  title: string;
  detail: string;
  timeDate: string;
  imageUrl: string;
  images?: string[];
}

export interface PriceListItem {
  id: string;
  title: string;
  pdfUrl: string;
}

export interface OfficialContact {
  id: string;
  title: string;
  email: string;
  whatsapp?: string;
}

export interface ContactUsInfo {
  phone: string;
  secondaryPhone: string;
  ambulancePhone: string;
  ambulancePicUrl?: string;
  whatsappNumber?: string;
  email: string;
  address: string;
  workingHours: string;
  mapEmbedUrl: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  officialContacts?: OfficialContact[];
}

export interface MachineItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface WebBanner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

export interface WebSettings {
  webName: string;
  logoUrl: string;
  banners: WebBanner[];
  welcomeTitle: string;
  welcomeText: string;
  welcomeImage: string;
  mapLink: string;
  number: string;
  seoDescription: string;
}

export interface BookingRequest {
  id: string;
  patientName: string;
  patientEmail: string;
  patientNumber: string;
  whatsappNumber?: string;
  address?: string;
  bookingType?: string; // 'Doctor Consultation' | 'Appointment' | 'Health Checkup Package' | 'Medical Services'
  selectedItem?: string;
  amountToPay?: string;
  paymentMethod?: string; // 'Cash on Hospital' | 'Pay Now'
  status?: 'pending' | 'approved' | 'rejected';
  doctorType?: string;
  doctorName?: string;
  day?: string;
  time?: string;
  message: string;
  createdAt: string;
}

export interface QRCodeItem {
  id: string;
  title: string;
  imageUrl: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  address?: string;
  comment: string;
}

export interface HospitalEventItem {
  id: string;
  day: string;
  monthYear: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
}

export interface Mailbox {
  id: string;
  email: string;
  password: string;
  inbox: EmailMessage[];
}

