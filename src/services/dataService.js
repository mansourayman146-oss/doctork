import { STORAGE_KEYS } from '@/lib/constants';
import { INITIAL_DOCTORS } from '@/features/doctors/data/doctors.data';
import { INITIAL_SPECIALTIES } from '@/features/landing/data/specialties.data';
import { INITIAL_REVIEWS } from '@/features/landing/data/reviews.data';

// Helper to get from LocalStorage safely
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

// Helper to save to LocalStorage safely
const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
};

export const dataService = {
  // --------------------------------------------------------------------------
  // 1. DOCTORS API
  // --------------------------------------------------------------------------
  async getDoctors(filters = {}) {
    // Simulate slight async network response
    await new Promise(resolve => setTimeout(resolve, 80));
    let doctors = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);

    // Auto-migrate if stored data lacks rich multi-clinic definitions
    if (!Array.isArray(doctors) || doctors.length === 0 || doctors.some(d => !Array.isArray(d.clinics) || d.clinics.length < 2) || doctors.length < INITIAL_DOCTORS.length) {
      doctors = INITIAL_DOCTORS;
      setStored(STORAGE_KEYS.DOCTORS, doctors);
    }

    // Guarantee consultation price is unified across all clinics of the same doctor
    doctors = doctors.map(doc => ({
      ...doc,
      clinics: Array.isArray(doc.clinics) 
        ? doc.clinics.map(clinic => ({ ...clinic, price: doc.price }))
        : doc.clinics
    }));

    if (filters.specialty && filters.specialty !== 'الكل') {
      doctors = doctors.filter(doc => 
        doc.specialtyFilter === filters.specialty || 
        doc.specialty.includes(filters.specialty)
      );
    }

    if (filters.city && filters.city !== 'كل المدن') {
      doctors = doctors.filter(doc => 
        doc.city === filters.city || 
        doc.location.includes(filters.city) ||
        (Array.isArray(doc.clinics) && doc.clinics.some(c => c.city === filters.city || c.location.includes(filters.city)))
      );
    }

    if (filters.onlyAvailableToday) {
      doctors = doctors.filter(doc => 
        doc.availableToday || 
        (Array.isArray(doc.clinics) && doc.clinics.some(c => c.availableToday && Array.isArray(c.availableSlots) && c.availableSlots.length > 0))
      );
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.trim().toLowerCase();
      doctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.location.toLowerCase().includes(q) ||
        (doc.hospital && doc.hospital.toLowerCase().includes(q)) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (Array.isArray(doc.clinics) && doc.clinics.some(c => 
          c.name.toLowerCase().includes(q) || 
          c.location.toLowerCase().includes(q) ||
          (c.shortLocation && c.shortLocation.toLowerCase().includes(q))
        ))
      );
    }

    return doctors;
  },

  async getDoctorById(id) {
    const doctors = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    return doctors.find(d => d.id === Number(id)) || null;
  },

  // --------------------------------------------------------------------------
  // 2. SPECIALTIES API
  // --------------------------------------------------------------------------
  async getSpecialties() {
    await new Promise(resolve => setTimeout(resolve, 50));
    const specialties = getStored(STORAGE_KEYS.SPECIALTIES, INITIAL_SPECIALTIES);
    const doctors = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);

    // Calculate dynamic doctor count per specialty
    return specialties.map(spec => {
      const count = doctors.filter(doc => 
        doc.specialtyFilter === spec.shortName || 
        doc.specialty.includes(spec.shortName)
      ).length;
      return {
        ...spec,
        doctorCount: count > 0 ? (count * 6 + 15) : 24
      };
    });
  },

  // --------------------------------------------------------------------------
  // 3. STATS API
  // --------------------------------------------------------------------------
  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 40));
    const doctors = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    const specialties = getStored(STORAGE_KEYS.SPECIALTIES, INITIAL_SPECIALTIES);
    const bookings = getStored(STORAGE_KEYS.BOOKINGS, []);
    const reviews = getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);

    // Calculate average satisfaction rate from dynamic reviews
    const avgRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + (r.stars || 5), 0) / reviews.length)
      : 4.9;
    const satisfactionPercent = Math.min(Math.round((avgRating / 5) * 100), 99);

    const baseBookings = 15200;
    const liveBookingsCount = baseBookings + bookings.length;
    const emergencyDocs = doctors.filter(d => d.availableToday).length * 2 + 6;

    return {
      doctorsCount: 200 + doctors.length * 2,
      bookingsCount: liveBookingsCount,
      satisfactionRate: satisfactionPercent,
      specialtiesCount: specialties.length > 0 ? specialties.length * 4 : 32,
      emergencyDoctorsCount: emergencyDocs
    };
  },

  // --------------------------------------------------------------------------
  // 4. BOOKINGS API
  // --------------------------------------------------------------------------
  async getBookings() {
    await new Promise(resolve => setTimeout(resolve, 60));
    return getStored(STORAGE_KEYS.BOOKINGS, []);
  },

  async createBooking(bookingData) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const bookings = getStored(STORAGE_KEYS.BOOKINGS, []);
    const doctors = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);

    const bookingCode = 'DOC-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: Date.now() + Math.random(),
      bookingCode,
      doctorId: bookingData.doctorId,
      doctorName: bookingData.doctorName,
      doctorSpecialty: bookingData.doctorSpecialty,
      clinicId: bookingData.clinicId,
      clinicName: bookingData.clinicName,
      doctorLocation: bookingData.doctorLocation,
      price: bookingData.price,
      patientName: bookingData.patientName,
      patientPhone: bookingData.patientPhone,
      day: bookingData.day, // 'اليوم' | 'غداً' | ...
      slot: bookingData.slot, // '06:00 م'
      bookingType: bookingData.bookingType || 'كشف عيادة أول مرة',
      notes: bookingData.notes || '',
      status: 'مؤكد',
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    // Remove the booked slot dynamically from doctor's available slots
    const updatedDoctors = doctors.map(doc => {
      if (doc.id !== bookingData.doctorId) return doc;

      if (Array.isArray(doc.clinics) && doc.clinics.length > 0) {
        const updatedClinics = doc.clinics.map(clinic => {
          const isSelectedClinic = clinic.id === bookingData.clinicId ||
            clinic.name === bookingData.clinicName ||
            clinic.clinicName === bookingData.clinicName ||
            clinic.hospital === bookingData.clinicName;
          if (!isSelectedClinic) return clinic;

          const slots = Array.isArray(clinic.availableSlots)
            ? clinic.availableSlots
            : doc.availableSlots || [];
          return {
            ...clinic,
            availableSlots: slots.filter(slot => slot !== bookingData.slot)
          };
        });
        const availableSlots = [...new Set(updatedClinics.flatMap(clinic =>
          Array.isArray(clinic.availableSlots) ? clinic.availableSlots : doc.availableSlots || []
        ))];
        return { ...doc, clinics: updatedClinics, availableSlots };
      }

      if (Array.isArray(doc.availableSlots)) {
        return {
          ...doc,
          availableSlots: doc.availableSlots.filter(slot => slot !== bookingData.slot)
        };
      }
      return doc;
    });
    setStored(STORAGE_KEYS.DOCTORS, updatedDoctors);

    return newBooking;
  },

  async cancelBooking(bookingId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    let bookings = getStored(STORAGE_KEYS.BOOKINGS, []);
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return false;

    bookings = bookings.filter(b => b.id !== bookingId);
    setStored(STORAGE_KEYS.BOOKINGS, bookings);

    // Return the slot back to the doctor
    if (target.doctorId && target.slot) {
      const doctors = getStored(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
      const updatedDoctors = doctors.map(doc => {
        if (doc.id === target.doctorId && Array.isArray(doc.clinics) && doc.clinics.length > 0 && target.clinicName) {
          const updatedClinics = doc.clinics.map(clinic => {
            const isSelectedClinic = clinic.id === target.clinicId ||
              clinic.name === target.clinicName ||
              clinic.clinicName === target.clinicName ||
              clinic.hospital === target.clinicName;
            if (!isSelectedClinic) return clinic;

            const slots = Array.isArray(clinic.availableSlots)
              ? clinic.availableSlots
              : doc.availableSlots || [];
            return {
              ...clinic,
              availableSlots: slots.includes(target.slot) ? slots : [...slots, target.slot].sort()
            };
          });
          const availableSlots = [...new Set(updatedClinics.flatMap(clinic =>
            Array.isArray(clinic.availableSlots) ? clinic.availableSlots : doc.availableSlots || []
          ))];
          return { ...doc, clinics: updatedClinics, availableSlots };
        }

        if (doc.id === target.doctorId && Array.isArray(doc.availableSlots)) {
          if (!doc.availableSlots.includes(target.slot)) {
            return {
              ...doc,
              availableSlots: [...doc.availableSlots, target.slot].sort()
            };
          }
        }
        return doc;
      });
      setStored(STORAGE_KEYS.DOCTORS, updatedDoctors);
    }

    return true;
  },

  // --------------------------------------------------------------------------
  // 5. REVIEWS & TESTIMONIALS API
  // --------------------------------------------------------------------------
  async getReviews() {
    await new Promise(resolve => setTimeout(resolve, 60));
    return getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  async addReview(reviewData) {
    await new Promise(resolve => setTimeout(resolve, 120));
    const reviews = getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const newReview = {
      id: Date.now() + Math.random(),
      name: reviewData.name.trim(),
      role: reviewData.role?.trim() || 'مريض موثق',
      location: reviewData.location?.trim() || 'مصر',
      doctorVisited: reviewData.doctorVisited || 'طبيب استشاري في دكتورك',
      stars: Number(reviewData.stars) || 5,
      text: reviewData.text.trim(),
      date: 'الآن (جديد)',
      verified: true,
      isUserAdded: true
    };
    reviews.unshift(newReview);
    setStored(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  // --------------------------------------------------------------------------
  // 6. EMERGENCY REQUESTS API
  // --------------------------------------------------------------------------
  async requestEmergency(data) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const emergencies = getStored(STORAGE_KEYS.EMERGENCIES, []);
    const newEmergency = {
      id: Date.now(),
      name: data.name,
      phone: data.phone,
      specialty: data.specialty,
      status: 'جارِ التواصل الفوري',
      timestamp: new Date().toISOString()
    };
    emergencies.unshift(newEmergency);
    setStored(STORAGE_KEYS.EMERGENCIES, emergencies);
    return newEmergency;
  },

  // --------------------------------------------------------------------------
  // 7. USER AUTHENTICATION API
  // --------------------------------------------------------------------------
  getCurrentUser() {
    return getStored(STORAGE_KEYS.USER, null);
  },

  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 120));
    // Dynamic mock user creation / login
    const user = {
      id: 'usr_' + Math.floor(100 + Math.random() * 900),
      name: email.split('@')[0] || 'المستخدم',
      email: email,
      phone: '010' + Math.floor(10000000 + Math.random() * 90000000)
    };
    setStored(STORAGE_KEYS.USER, user);
    return user;
  },

  async register(name, email, password) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const user = {
      id: 'usr_' + Math.floor(100 + Math.random() * 900),
      name: name,
      email: email,
      phone: '010' + Math.floor(10000000 + Math.random() * 90000000)
    };
    setStored(STORAGE_KEYS.USER, user);
    return user;
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {}
    return true;
  }
};
