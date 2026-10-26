// ============================================================================
// DOCTORK DYNAMIC DATA SERVICE & MOCK API LAYER
// Handles persistent state, dynamic updates, bookings, reviews & authentication
// ============================================================================

const STORAGE_KEYS = {
  DOCTORS: 'doctork_doctors_v1',
  SPECIALTIES: 'doctork_specialties_v1',
  BOOKINGS: 'doctork_bookings_v1',
  REVIEWS: 'doctork_reviews_v1',
  EMERGENCIES: 'doctork_emergencies_v1',
  USER: 'doctork_current_user_v1',
  STATS_BASE: 'doctork_stats_base_v1'
};

// Default Specialties
const INITIAL_SPECIALTIES = [
  {
    id: 'cardiology',
    name: 'أمراض القلب والأوعية الدموية',
    shortName: 'قلب وأوعية دموية',
    icon: 'heart',
    desc: 'تشخيص وعلاج أمراض القلب، رسم القلب، القسطرة، وضغط الدم المرتفع',
    color: '#ef4444',
    bgTint: 'rgba(239, 68, 68, 0.08)'
  },
  {
    id: 'dermatology',
    name: 'جلدية وتجميل وليزر',
    shortName: 'جلدية وتجميل',
    icon: 'sparkles',
    desc: 'علاج مشاكل البشرة والشعر، جلسات الليزر، والحقن التجميلي المعتمد',
    color: '#ec4899',
    bgTint: 'rgba(236, 72, 153, 0.08)'
  },
  {
    id: 'pediatrics',
    name: 'طب وجراحة الأطفال',
    shortName: 'طب الأطفال',
    icon: 'baby',
    desc: 'متابعة نمو وحديثي الولادة، التطعيمات، وعلاج نزلات البرد والحساسية',
    color: '#f59e0b',
    bgTint: 'rgba(245, 158, 11, 0.08)'
  },
  {
    id: 'orthopedics',
    name: 'عظام ومفاصل وعمود فقري',
    shortName: 'عظام ومفاصل',
    icon: 'bone',
    desc: 'علاج آلام المفاصل والخشونة، جراحات العظام والمناظير، والإصابات الرياضية',
    color: '#8b5cf6',
    bgTint: 'rgba(139, 92, 246, 0.08)'
  },
  {
    id: 'dentistry',
    name: 'طب وجراحة الأسنان',
    shortName: 'أسنان',
    icon: 'tooth',
    desc: 'زراعة الأسنان، تقويم وتبييض، علاج الجذور، وابتسامة هوليوود المتكاملة',
    color: '#06b6d4',
    bgTint: 'rgba(6, 182, 212, 0.08)'
  },
  {
    id: 'internal',
    name: 'باطنة وجهاز هضمي وكبد',
    shortName: 'باطنة عامة',
    icon: 'stethoscope',
    desc: 'علاج القولون العصبي، السكري ومقاومة الإنسولين، جرثومة المعدة والكبد',
    color: '#10b981',
    bgTint: 'rgba(16, 185, 129, 0.08)'
  },
  {
    id: 'ophthalmology',
    name: 'طب وجراحة العيون',
    shortName: 'عيون ورمد',
    icon: 'eye',
    desc: 'تصحيح الإبصار بالليزر والليزك، المياه البيضاء والزرقاء، وفحص قاع العين',
    color: '#3b82f6',
    bgTint: 'rgba(59, 130, 246, 0.08)'
  },
  {
    id: 'neurology',
    name: 'مخ وأعصاب وجراحة العمود الفقري',
    shortName: 'مخ وأعصاب',
    icon: 'brain',
    desc: 'علاج الصداع النصفي، آلام الأعصاب الطرفية، الصرع، واضطرابات النوم',
    color: '#6366f1',
    bgTint: 'rgba(99, 102, 241, 0.08)'
  }
];

// Default Doctors
const INITIAL_DOCTORS = [
  {
    id: 1,
    name: 'د. أحمد منصور',
    title: 'استشاري أول أمراض القلب والأوعية الدموية والقسطرة التداخلية',
    specialty: 'أمراض القلب والأوعية الدموية',
    specialtyFilter: 'قلب وأوعية دموية',
    rating: 4.95,
    reviewsCount: 382,
    experience: '18 سنة خبرة',
    location: 'القاهرة - المعادي، شارع النصر',
    city: 'القاهرة',
    hospital: 'مركز القلب التخصصي الدولي',
    price: 350,
    waitingTime: '0 دقيقة (دخول فوري بالميعاد)',
    availableToday: true,
    availableSlots: ['05:00 م', '05:30 م', '06:00 م', '07:00 م', '08:00 م'],
    initials: 'د.أ',
    avatarBg: '#d8532c',
    gender: 'male',
    tags: ['كشف قلب شامل', 'رسم قلب فوري', 'متاح اليوم']
  },
  {
    id: 2,
    name: 'د. سارة العلي',
    title: 'أخصائية الجلدية والتجميل والعلاج بالليزر - البورد الأوروبي',
    specialty: 'جلدية وتجميل وليزر',
    specialtyFilter: 'جلدية وتجميل',
    rating: 4.98,
    reviewsCount: 425,
    experience: '12 سنة خبرة',
    location: 'الجيزة - الشيخ زايد، مول أركان',
    city: 'الجيزة',
    hospital: 'عيادات ديرما كير كلينيك',
    price: 300,
    waitingTime: '0 دقيقة (بدون زحمة)',
    availableToday: true,
    availableSlots: ['06:30 م', '07:00 م', '07:30 م', '08:30 م'],
    initials: 'د.س',
    avatarBg: '#ec4899',
    gender: 'female',
    tags: ['ليزر وتجميل', 'علاج البشرة والشعر', 'متاح اليوم']
  },
  {
    id: 3,
    name: 'د. طارق عبد الرحمن',
    title: 'أستاذ واستشاري جراحة العظام والمفاصل والمناظير - قصر العيني',
    specialty: 'عظام ومفاصل وعمود فقري',
    specialtyFilter: 'عظام ومفاصل',
    rating: 4.88,
    reviewsCount: 295,
    experience: '22 سنة خبرة',
    location: 'القاهرة - مصر الجديدة، ميدان تريومف',
    city: 'القاهرة',
    hospital: 'مركز العظام والعمود الفقري المتقدم',
    price: 400,
    waitingTime: '0 دقيقة (التزام تام بالموعد)',
    availableToday: false,
    availableSlots: ['04:30 م', '05:00 م', '06:00 م', '07:30 م'],
    initials: 'د.ط',
    avatarBg: '#8b5cf6',
    gender: 'male',
    tags: ['مناظير مفاصل', 'إصابات ملاعب', 'كشف دقيق']
  },
  {
    id: 4,
    name: 'د. مريم الشريف',
    title: 'استشاري طب وجراحة الأطفال وحديثي الولادة وعلاج حساسية الصدر',
    specialty: 'طب وجراحة الأطفال',
    specialtyFilter: 'طب الأطفال',
    rating: 4.93,
    reviewsCount: 314,
    experience: '14 سنة خبرة',
    location: 'القاهرة - التجمع الخامس، شارع التسعين',
    city: 'القاهرة',
    hospital: 'مجمع عيادات بيبي كير التخصصي',
    price: 320,
    waitingTime: '0 دقيقة (غرفة كشف مخصصة للأطفال)',
    availableToday: true,
    availableSlots: ['05:00 م', '05:30 م', '06:30 م', '07:00 م'],
    initials: 'د.م',
    avatarBg: '#f59e0b',
    gender: 'female',
    tags: ['حديثي ولادة', 'تطعيمات', 'حساسية صدر']
  },
  {
    id: 5,
    name: 'د. حسام النجار',
    title: 'أخصائي جراحة الفم وزراعة الأسنان وتجميل الابتسامة الرقمية',
    specialty: 'طب وجراحة الأسنان',
    specialtyFilter: 'أسنان',
    rating: 4.89,
    reviewsCount: 198,
    experience: '10 سنوات خبرة',
    location: 'الإسكندرية - سموحة، شارع فوزي معاذ',
    city: 'الإسكندرية',
    hospital: 'مركز سمايل ديزاين لطب الأسنان',
    price: 250,
    waitingTime: '0 دقيقة (حجز غرفة تعقيم مسبق)',
    availableToday: true,
    availableSlots: ['06:00 م', '07:00 م', '08:00 م', '08:30 م'],
    initials: 'د.ح',
    avatarBg: '#06b6d4',
    gender: 'male',
    tags: ['زراعة أسنان', 'تبييض بالليزر', 'حشو تجميلي']
  },
  {
    id: 6,
    name: 'د. نهى يوسف',
    title: 'استشاري أمراض الباطنة العامة والجهاز الهضمي والكبد والمناظير',
    specialty: 'باطنة وجهاز هضمي وكبد',
    specialtyFilter: 'باطنة عامة',
    rating: 4.92,
    reviewsCount: 270,
    experience: '16 سنة خبرة',
    location: 'الجيزة - المهندسين، شارع جامعة الدول',
    city: 'الجيزة',
    hospital: 'عيادات الجاسترو كير للبطن والكبد',
    price: 350,
    waitingTime: '0 دقيقة (دخول بالاسم فوراً)',
    availableToday: true,
    availableSlots: ['05:30 م', '06:00 م', '06:45 م', '07:45 م'],
    initials: 'د.ن',
    avatarBg: '#10b981',
    gender: 'female',
    tags: ['قولون عصبي', 'متابعة السكري', 'جرثومة معدة']
  },
  {
    id: 7,
    name: 'د. كريم فهمي',
    title: 'استشاري طب وجراحة العيون والليزك وعلاج المياه البيضاء وزرع العدسات',
    specialty: 'طب وجراحة العيون',
    specialtyFilter: 'عيون ورمد',
    rating: 4.94,
    reviewsCount: 345,
    experience: '17 سنة خبرة',
    location: 'القاهرة - مدينة نصر، شارع عباس العقاد',
    city: 'القاهرة',
    hospital: 'المركز الدولي للعيون والليزك',
    price: 380,
    waitingTime: '0 دقيقة (فحص أجهزة فوري)',
    availableToday: false,
    availableSlots: ['04:30 م', '05:30 م', '06:30 م'],
    initials: 'د.ك',
    avatarBg: '#3b82f6',
    gender: 'male',
    tags: ['تصحيح إبصار', 'فحص قاع عين', 'ليزك']
  },
  {
    id: 8,
    name: 'د. عمر سليم',
    title: 'استشاري جراحة المخ والأعصاب والعمود الفقري والتدخل المحدود',
    specialty: 'مخ وأعصاب وجراحة العمود الفقري',
    specialtyFilter: 'مخ وأعصاب',
    rating: 4.91,
    reviewsCount: 185,
    experience: '20 سنة خبرة',
    location: 'الجيزة - الدقي، شارع التحرير',
    city: 'الجيزة',
    hospital: 'مستشفى العلوم العصبية التخصصي',
    price: 450,
    waitingTime: '0 دقيقة (كشف مطول وشامل)',
    availableToday: true,
    availableSlots: ['07:00 م', '08:00 م', '09:00 م'],
    initials: 'د.ع',
    avatarBg: '#6366f1',
    gender: 'male',
    tags: ['انزلاق غضروفي', 'صداع مزمن', 'أعصاب طرفية']
  }
];

// Default Reviews
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: 'م. أحمد الشناوي',
    role: 'مهندس برمجيات',
    location: 'القاهرة - المعادي',
    doctorVisited: 'د. أحمد منصور (قلب وأوعية دموية)',
    stars: 5,
    text: 'أفضل تجربة حجز عيادة عشتها في حياتي! حجزت موعدي الساعة 6:00 م، وصلت العيادة 5:55 م، ودخلت غرفة الدكتور الساعة 6:00 بالضبط. الدكتور ممتاز وشرح لي كل شيء بمنتهى الهدوء.',
    date: 'منذ يومين',
    verified: true
  },
  {
    id: 2,
    name: 'د. ميادة إبراهيم',
    role: 'صيدلانية',
    location: 'الجيزة - الشيخ زايد',
    doctorVisited: 'د. سارة العلي (جلدية وتجميل)',
    stars: 5,
    text: 'منصة دكتورك وفرت علي تعب الاتصال والانتظار في العيادة بالساعات مع طفلي. الحجز سريع ومباشر، والتأكيد جالي فوراً على واتساب باللوكيشن. دكتورة سارة شاطرة ومحترفة جداً.',
    date: 'منذ 5 أيام',
    verified: true
  },
  {
    id: 3,
    name: 'أ. سامح عبد الهادي',
    role: 'مدير تسويق',
    location: 'القاهرة - مصر الجديدة',
    doctorVisited: 'د. طارق عبد الرحمن (عظام ومفاصل)',
    stars: 5,
    text: 'كنت أعاني من خشونة الركبة وأجلت الكشف لشهور بسبب خوفي من زحمة عيادات العظام. مع دكتورك الموضوع كان أسهل مما أتخيل، دخلت في ميعادي بدون أي شخص قبلي أو بعدي.',
    date: 'منذ أسبوع',
    verified: true
  },
  {
    id: 4,
    name: 'مها الفقي',
    role: 'معلمة لغة إنجليزية',
    location: 'القاهرة - التجمع الخامس',
    doctorVisited: 'د. مريم الشريف (طب أطفال)',
    stars: 5,
    text: 'كأم، أكبر هم عندي هو الانتظار في عيادات الأطفال وسط أطفال مرضى ونقل العدوى. مع دكتورك ابني دخل فوراً في ميعاده والعيادة كانت هادئة جداً. شكراً دكتورك على هذا الرقي.',
    date: 'منذ أسبوعين',
    verified: true
  }
];

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

    if (filters.specialty && filters.specialty !== 'الكل') {
      doctors = doctors.filter(doc => 
        doc.specialtyFilter === filters.specialty || 
        doc.specialty.includes(filters.specialty)
      );
    }

    if (filters.city && filters.city !== 'كل المدن') {
      doctors = doctors.filter(doc => doc.city === filters.city || doc.location.includes(filters.city));
    }

    if (filters.onlyAvailableToday) {
      doctors = doctors.filter(doc => doc.availableToday);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.trim().toLowerCase();
      doctors = doctors.filter(doc => 
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.location.toLowerCase().includes(q) ||
        doc.tags.some(tag => tag.toLowerCase().includes(q))
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
      if (doc.id === bookingData.doctorId && Array.isArray(doc.availableSlots)) {
        return {
          ...doc,
          availableSlots: doc.availableSlots.filter(s => s !== bookingData.slot)
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
