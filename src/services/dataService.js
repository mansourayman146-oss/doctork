// ============================================================================
// DOCTORK DYNAMIC DATA SERVICE & MOCK API LAYER
// Handles persistent state, dynamic updates, bookings, reviews & authentication
// ============================================================================

const STORAGE_KEYS = {
  DOCTORS: 'doctork_doctors_v3',
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

// Default Doctors with multiple clinics and distinct appointments per clinic
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
    availableSlots: ['05:00 م', '05:30 م', '06:00 م', '07:00 م', '07:30 م', '08:00 م'],
    initials: 'د.أ',
    avatarBg: '#d8532c',
    gender: 'male',
    tags: ['كشف قلب شامل', 'رسم قلب فوري', 'متاح اليوم', 'متعدد العيادات'],
    clinics: [
      {
        id: 'c1-maadi',
        name: 'مركز القلب الدولي - المعادي',
        shortLocation: 'المعادي',
        city: 'القاهرة',
        location: 'القاهرة - المعادي، شارع النصر أمام ميدان الجزائر',
        days: 'السبت، الإثنين، الأربعاء',
        price: 350,
        waitingTime: '0 دقيقة (دخول فوري بالميعاد)',
        availableToday: true,
        availableSlots: ['05:00 م', '05:30 م', '06:00 م', '07:00 م', '08:00 م']
      },
      {
        id: 'c1-mohandessin',
        name: 'برج الأطباء التخصصي - المهندسين',
        shortLocation: 'المهندسين',
        city: 'الجيزة',
        location: 'الجيزة - المهندسين، شارع سوريا تقاطع البطل أحمد عبد العزيز',
        days: 'الأحد، الثلاثاء، الخميس',
        price: 350,
        waitingTime: '0 دقيقة (بدون زحمة)',
        availableToday: true,
        availableSlots: ['07:30 م', '08:00 م', '08:45 م', '09:30 م']
      },
      {
        id: 'c1-tagamoa',
        name: 'ميديكال بارك بريميير - التجمع الخامس',
        shortLocation: 'التجمع الخامس',
        city: 'القاهرة',
        location: 'القاهرة - التجمع الخامس، شارع التسعين الشمالي خلف المستشفى الجوي',
        days: 'الجمعة فقط',
        price: 350,
        waitingTime: '0 دقيقة (كشف فندقي VIP)',
        availableToday: false,
        availableSlots: ['02:00 م', '02:45 م', '03:30 م', '04:15 م']
      }
    ]
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
    availableSlots: ['01:00 م', '01:30 م', '06:30 م', '07:00 م', '07:30 م', '08:30 م'],
    initials: 'د.س',
    avatarBg: '#ec4899',
    gender: 'female',
    tags: ['ليزر وتجميل', 'علاج البشرة والشعر', 'متاح اليوم', 'فروع متعددة'],
    clinics: [
      {
        id: 'c2-zayed',
        name: 'عيادات ديرما كير كلينيك - الشيخ زايد',
        shortLocation: 'الشيخ زايد',
        city: 'الجيزة',
        location: 'الجيزة - الشيخ زايد، مول أركان بلازا، المبنى الطبي',
        days: 'السبت، الثلاثاء، الخميس',
        price: 300,
        waitingTime: '0 دقيقة (بدون زحمة)',
        availableToday: true,
        availableSlots: ['06:30 م', '07:00 م', '07:30 م', '08:30 م']
      },
      {
        id: 'c2-heliopolis',
        name: 'مركز النخبة للجلدية والليزر - مصر الجديدة',
        shortLocation: 'مصر الجديدة',
        city: 'القاهرة',
        location: 'القاهرة - مصر الجديدة، شارع الأهرام قرب الكوربة',
        days: 'الأحد والأربعاء',
        price: 300,
        waitingTime: '0 دقيقة (جلسات فردية)',
        availableToday: true,
        availableSlots: ['01:00 م', '01:30 م', '02:15 م', '03:00 م']
      },
      {
        id: 'c2-dokki',
        name: 'برج فينيسيا التخصصي - الدقي',
        shortLocation: 'الدقي',
        city: 'الجيزة',
        location: 'الجيزة - الدقي، ميدان المساحة، عمارة برج الأطباء',
        days: 'الإثنين والجمعة',
        price: 300,
        waitingTime: '0 دقيقة (دخول مباشر)',
        availableToday: false,
        availableSlots: ['04:00 م', '04:45 م', '05:30 م', '06:15 م']
      }
    ]
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
    availableToday: true,
    availableSlots: ['02:00 م', '04:30 م', '05:00 م', '06:00 م', '07:00 م', '07:30 م'],
    initials: 'د.ط',
    avatarBg: '#8b5cf6',
    gender: 'male',
    tags: ['مناظير مفاصل', 'إصابات ملاعب', 'كشف دقيق', 'أكثر من عيادة'],
    clinics: [
      {
        id: 'c3-heliopolis',
        name: 'مركز العظام والعمود الفقري - مصر الجديدة',
        shortLocation: 'مصر الجديدة',
        city: 'القاهرة',
        location: 'القاهرة - مصر الجديدة، ميدان تريومف، عمارة مصر للتأمين',
        days: 'السبت والإثنين والأربعاء',
        price: 400,
        waitingTime: '0 دقيقة (التزام تام بالموعد)',
        availableToday: false,
        availableSlots: ['04:30 م', '05:00 م', '06:00 م', '07:30 م']
      },
      {
        id: 'c3-nasrcity',
        name: 'مستشفى العظام التخصصي - مدينة نصر',
        shortLocation: 'مدينة نصر',
        city: 'القاهرة',
        location: 'القاهرة - مدينة نصر، شارع عباس العقاد بجوار جنينة مول',
        days: 'الأحد والثلاثاء',
        price: 400,
        waitingTime: '0 دقيقة (بدون انتظار)',
        availableToday: true,
        availableSlots: ['07:00 م', '07:45 م', '08:30 م', '09:15 م']
      },
      {
        id: 'c3-faisal',
        name: 'مجمع النيل لجراحة العظام - فيصل',
        shortLocation: 'فيصل والهرم',
        city: 'الجيزة',
        location: 'الجيزة - شارع فيصل الرئيسي، محطة العشرين',
        days: 'الخميس والجمعة',
        price: 400,
        waitingTime: '0 دقيقة (كشف منظم)',
        availableToday: true,
        availableSlots: ['02:00 م', '02:30 م', '03:15 م', '04:00 م']
      }
    ]
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
    availableSlots: ['01:30 م', '02:00 م', '05:00 م', '05:30 م', '06:30 م', '07:00 م'],
    initials: 'د.م',
    avatarBg: '#f59e0b',
    gender: 'female',
    tags: ['حديثي ولادة', 'تطعيمات', 'حساسية صدر', 'عيادات بالقاهرة والجيزة'],
    clinics: [
      {
        id: 'c4-tagamoa',
        name: 'مجمع بيبي كير التخصصي - التجمع الخامس',
        shortLocation: 'التجمع الخامس',
        city: 'القاهرة',
        location: 'القاهرة - التجمع الخامس، شارع التسعين الجنوبي، مجمع CMC',
        days: 'السبت، الإثنين، الخميس',
        price: 320,
        waitingTime: '0 دقيقة (غرفة كشف مخصصة للأطفال)',
        availableToday: true,
        availableSlots: ['05:00 م', '05:30 م', '06:30 م', '07:00 م']
      },
      {
        id: 'c4-maadi',
        name: 'مركز أطفال المستقبل - المعادي',
        shortLocation: 'المعادي',
        city: 'القاهرة',
        location: 'القاهرة - المعادي، شارع اللاسلكي أمام القرية الأولمبية',
        days: 'الأحد والثلاثاء',
        price: 320,
        waitingTime: '0 دقيقة (منطقة ألعاب للأطفال)',
        availableToday: true,
        availableSlots: ['01:30 م', '02:00 م', '02:45 م', '03:30 م']
      },
      {
        id: 'c4-october',
        name: 'عيادات كيدز كلينيك التخصصية - 6 أكتوبر',
        shortLocation: '6 أكتوبر',
        city: 'الجيزة',
        location: 'الجيزة - 6 أكتوبر، الحي المتميز، سنتر وادي الملوك',
        days: 'الأربعاء والجمعة',
        price: 320,
        waitingTime: '0 دقيقة (تطهير دوري بعد كل طفل)',
        availableToday: false,
        availableSlots: ['07:30 م', '08:00 م', '08:30 م', '09:00 م']
      }
    ]
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
    availableSlots: ['03:00 م', '03:45 م', '06:00 م', '07:00 م', '08:00 م', '08:30 م'],
    initials: 'د.ح',
    avatarBg: '#06b6d4',
    gender: 'male',
    tags: ['زراعة أسنان', 'تبييض بالليزر', 'حشو تجميلي', 'الإسكندرية والجيزة'],
    clinics: [
      {
        id: 'c5-smouha',
        name: 'مركز سمايل ديزاين - سموحة',
        shortLocation: 'سموحة',
        city: 'الإسكندرية',
        location: 'الإسكندرية - سموحة، شارع فوزي معاذ بجوار مسجد علي بن أبي طالب',
        days: 'السبت، الإثنين، الأربعاء',
        price: 250,
        waitingTime: '0 دقيقة (حجز غرفة تعقيم مسبق)',
        availableToday: true,
        availableSlots: ['06:00 م', '07:00 م', '08:00 م', '08:30 م']
      },
      {
        id: 'c5-loran',
        name: 'عيادات إيليت لطب وزراعة الأسنان - لوران',
        shortLocation: 'لوران',
        city: 'الإسكندرية',
        location: 'الإسكندرية - لوران، طريق الحرية أبو قير، عمارة لوران بالاس',
        days: 'الأحد والثلاثاء والخميس',
        price: 250,
        waitingTime: '0 دقيقة (تعقيم هواء متطور)',
        availableToday: true,
        availableSlots: ['03:00 م', '03:45 م', '04:30 م', '05:15 م']
      },
      {
        id: 'c5-mohandessin',
        name: 'مركز سمايل آرت الدولي - المهندسين',
        shortLocation: 'المهندسين',
        city: 'الجيزة',
        location: 'الجيزة - المهندسين، شارع لبنان، ميدان لبنان',
        days: 'الجمعة فقط',
        price: 250,
        waitingTime: '0 دقيقة (كشف وابتسامة رقمية)',
        availableToday: false,
        availableSlots: ['07:30 م', '08:15 م', '09:00 م', '09:45 م']
      }
    ]
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
    availableSlots: ['01:00 م', '01:30 م', '05:30 م', '06:00 م', '06:45 م', '07:45 م'],
    initials: 'د.ن',
    avatarBg: '#10b981',
    gender: 'female',
    tags: ['قولون عصبي', 'متابعة السكري', 'جرثومة معدة', 'فروع متعددة'],
    clinics: [
      {
        id: 'c6-mohandessin',
        name: 'عيادات الجاسترو كير - المهندسين',
        shortLocation: 'المهندسين',
        city: 'الجيزة',
        location: 'الجيزة - المهندسين، شارع جامعة الدول العربية أمام نادي الزمالك',
        days: 'السبت، الإثنين، الأربعاء',
        price: 350,
        waitingTime: '0 دقيقة (دخول بالاسم فوراً)',
        availableToday: true,
        availableSlots: ['05:30 م', '06:00 م', '06:45 م', '07:45 م']
      },
      {
        id: 'c6-shoubra',
        name: 'مجمع الرحمة التخصصي - شبرا',
        shortLocation: 'شبرا',
        city: 'القاهرة',
        location: 'القاهرة - شبرا، شارع شبرا الرئيسي أمام محطة روض الفرج',
        days: 'الأحد والثلاثاء',
        price: 350,
        waitingTime: '0 دقيقة (فحص سونار فوري)',
        availableToday: true,
        availableSlots: ['01:00 م', '01:30 م', '02:15 م', '03:00 م']
      },
      {
        id: 'c6-haram',
        name: 'عيادات صحتي التخصصية - الهرم',
        shortLocation: 'الهرم',
        city: 'الجيزة',
        location: 'الجيزة - شارع الهرم الرئيسي، محطة العريش',
        days: 'الخميس والجمعة',
        price: 350,
        waitingTime: '0 دقيقة (ملف صحي إلكتروني)',
        availableToday: false,
        availableSlots: ['08:00 م', '08:30 م', '09:15 م', '10:00 م']
      }
    ]
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
    availableToday: true,
    availableSlots: ['02:00 م', '04:30 م', '05:30 م', '06:30 م', '07:00 م', '07:45 م'],
    initials: 'د.ك',
    avatarBg: '#3b82f6',
    gender: 'male',
    tags: ['تصحيح إبصار', 'فحص قاع عين', 'ليزك', '3 مراكز مجهزة'],
    clinics: [
      {
        id: 'c7-nasrcity',
        name: 'المركز الدولي للعيون والليزك - مدينة نصر',
        shortLocation: 'مدينة نصر',
        city: 'القاهرة',
        location: 'القاهرة - مدينة نصر، شارع عباس العقاد تقاطع النصر',
        days: 'السبت والثلاثاء والخميس',
        price: 380,
        waitingTime: '0 دقيقة (فحص أجهزة فوري)',
        availableToday: false,
        availableSlots: ['04:30 م', '05:30 م', '06:30 م', '07:30 م']
      },
      {
        id: 'c7-dokki',
        name: 'مستشفى النور التخصصي للعيون - الدقي',
        shortLocation: 'الدقي',
        city: 'الجيزة',
        location: 'الجيزة - الدقي، ميدان مصطفى محمود، شارع سوريا',
        days: 'الأحد والإثنين',
        price: 380,
        waitingTime: '0 دقيقة (فحص قاع عين دقيق)',
        availableToday: true,
        availableSlots: ['07:00 م', '07:45 م', '08:30 م', '09:15 م']
      },
      {
        id: 'c7-heliopolis',
        name: 'مركز فيجن للرمد والليزك - مصر الجديدة',
        shortLocation: 'مصر الجديدة',
        city: 'القاهرة',
        location: 'القاهرة - مصر الجديدة، شارع الميرغني بجوار كلية البنات',
        days: 'الأربعاء والجمعة',
        price: 380,
        waitingTime: '0 دقيقة (قياس نظر كمبيوتر فوري)',
        availableToday: true,
        availableSlots: ['02:00 م', '02:45 م', '03:30 م', '04:15 م']
      }
    ]
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
    availableSlots: ['03:30 م', '04:15 م', '07:00 م', '08:00 م', '09:00 م', '09:45 م'],
    initials: 'د.ع',
    avatarBg: '#6366f1',
    gender: 'male',
    tags: ['انزلاق غضروفي', 'صداع مزمن', 'أعصاب طرفية', 'عيادات الدقي والمعادي وزايد'],
    clinics: [
      {
        id: 'c8-dokki',
        name: 'مستشفى العلوم العصبية التخصصي - الدقي',
        shortLocation: 'الدقي',
        city: 'الجيزة',
        location: 'الجيزة - الدقي، شارع التحرير بالقرب من مترو الدقي',
        days: 'السبت، الإثنين، الأربعاء',
        price: 450,
        waitingTime: '0 دقيقة (كشف مطول وشامل)',
        availableToday: true,
        availableSlots: ['07:00 م', '08:00 م', '09:00 م', '09:45 م']
      },
      {
        id: 'c8-maadi',
        name: 'مركز القاهرة للأعصاب والعمود الفقري - المعادي',
        shortLocation: 'المعادي',
        city: 'القاهرة',
        location: 'القاهرة - المعادي، كورنيش النيل، برج رويال المعادي',
        days: 'الأحد والثلاثاء',
        price: 450,
        waitingTime: '0 دقيقة (رسم عضلات وأعصاب)',
        availableToday: true,
        availableSlots: ['03:30 م', '04:15 م', '05:00 م', '06:00 م']
      },
      {
        id: 'c8-zayed',
        name: 'توب كير كلينيكس للأعصاب - الشيخ زايد',
        shortLocation: 'الشيخ زايد',
        city: 'الجيزة',
        location: 'الجيزة - الشيخ زايد، المحور المركزي، كابيتال بيزنس بارك',
        days: 'الخميس والجمعة',
        price: 450,
        waitingTime: '0 دقيقة (استشارات دقيقة بالموعد)',
        availableToday: false,
        availableSlots: ['12:30 م', '01:15 م', '02:00 م', '02:45 م']
      }
    ]
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

    // Auto-migrate if stored data lacks rich multi-clinic definitions
    if (!Array.isArray(doctors) || doctors.length === 0 || doctors.some(d => !Array.isArray(d.clinics) || d.clinics.length < 2)) {
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
