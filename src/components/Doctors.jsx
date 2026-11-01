import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  BadgeCheck, 
  Building2, 
  CalendarDays, 
  Clock3, 
  MapPin, 
  Search, 
  Star, 
  Stethoscope, 
  X, 
  Zap 
} from 'lucide-react';

const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'الدقهلية',
  'البحر الأحمر',
  'البحيرة',
  'الفيوم',
  'الغربية',
  'الإسماعيلية',
  'المنوفية',
  'المنيا',
  'القليوبية',
  'الوادي الجديد',
  'السويس',
  'أسوان',
  'أسيوط',
  'بني سويف',
  'بورسعيد',
  'دمياط',
  'الشرقية',
  'جنوب سيناء',
  'كفر الشيخ',
  'مطروح',
  'الأقصر',
  'قنا',
  'شمال سيناء',
  'سوهاج'
];

/**
 * Individual Doctor Card with Interactive Multi-Clinic Selector
 * and Real-Time Clinic-Specific Available Appointments
 */
function DoctorCard({ doc, selectedCity, onBookDoctor }) {
  const clinics = useMemo(() => {
    if (Array.isArray(doc.clinics) && doc.clinics.length > 0) {
      return doc.clinics.map(c => ({ ...c, price: doc.price }));
    }
    return [
      {
        id: `${doc.id}-main`,
        name: doc.hospital || 'العيادة الرئيسية',
        shortLocation: doc.city || 'العيادة',
        location: doc.location,
        city: doc.city,
        price: doc.price,
        days: 'يومياً بموعد مسبق',
        waitingTime: doc.waitingTime || '0 دقيقة (دخول فوري)',
        availableToday: doc.availableToday,
        availableSlots: doc.availableSlots || []
      }
    ];
  }, [doc]);

  // Find if a clinic matches the currently filtered city
  const cityMatchingClinic = useMemo(() => {
    if (!selectedCity || selectedCity === 'كل المدن') return null;
    return clinics.find(c => c.city === selectedCity || c.location?.includes(selectedCity));
  }, [clinics, selectedCity]);

  const [activeClinicId, setActiveClinicId] = useState(() => (cityMatchingClinic || clinics[0])?.id);

  // If city filter changes, automatically switch to the matching clinic if available
  useEffect(() => {
    if (cityMatchingClinic) {
      setActiveClinicId(cityMatchingClinic.id);
    }
  }, [cityMatchingClinic]);

  // Fallback to first clinic if activeClinicId not in list
  const activeClinic = clinics.find(c => c.id === activeClinicId) || clinics[0];
  const activeSlots = Array.isArray(activeClinic?.availableSlots) ? activeClinic.availableSlots : [];
  const hasSlots = activeSlots.length > 0;
  const isAvailableToday = Boolean(activeClinic?.availableToday);
  const nextSlotText = hasSlots
    ? (isAvailableToday ? `متاح اليوم: ${activeSlots[0]}` : `متاح غداً: ${activeSlots[0]}`)
    : 'اكتملت مواعيد هذه العيادة';

  return (
    <article className="doctor-card" id={`doctor-${doc.id}`}>
      {/* Doctor Card Top / Badges */}
      <div className="doc-card-header">
        <div className="doc-avatar-wrap" style={{ backgroundColor: doc.avatarBg || '#183b2b' }}>
          <span className="doc-initials">{doc.initials}</span>
          <span 
            className={`doc-status-dot ${hasSlots ? 'active' : 'busy'}`} 
            title={hasSlots ? 'متواجد وجاهز للحجز' : 'المواعيد ممتلئة'}
          ></span>
        </div>

        <div className="doc-header-info">
          <div className="doc-title-row">
            <h3 className="doc-card-name">{doc.name}</h3>
            <span className="verified-check" title="طبيب معتمد وموثق بنقابة الأطباء">
              <BadgeCheck size={14} aria-hidden="true" /> موثق
            </span>
          </div>
          <span className="doc-card-specialty">{doc.specialty}</span>
          
          <div className="doc-rating-row">
            <div className="stars-group" aria-label={`تقييم ${doc.rating} من 5`}>
              <Star className="star-icon" size={14} fill="currentColor" aria-hidden="true" />
              <strong className="rating-value">{doc.rating}</strong>
              <span className="reviews-count">({doc.reviewsCount} تقييم مريض)</span>
            </div>
            <span className="exp-pill">{doc.experience}</span>
          </div>
        </div>
      </div>

      {/* Doctor Subtitle & tags */}
      <div className="doc-card-body">
        <p className="doc-full-title">{doc.title}</p>

        {doc.tags && (
          <div className="doc-tags-row">
            {doc.tags.map((tag, i) => (
              <span key={i} className="doc-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Multi-Clinic Selection Section */}
        <div className="doc-clinics-picker">
          <div className="clinics-picker-header">
            <Building2 size={13} className="clinics-picker-icon" aria-hidden="true" />
            <span className="clinics-picker-label">اختر العيادة الأنسب لموقعك:</span>
            <span className="clinics-count-pill">{clinics.length} عيادات</span>
          </div>
          <div className="clinics-buttons-list" role="tablist" aria-label="اختر عيادة الطبيب">
            {clinics.map((clinic) => {
              const isSelected = clinic.id === activeClinic.id;
              return (
                <button
                  key={clinic.id}
                  type="button"
                  className={`clinic-pill-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveClinicId(clinic.id)}
                  role="tab"
                  aria-selected={isSelected}
                  title={`عرض مواعيد عيادة ${clinic.shortLocation || clinic.name}`}
                >
                  <MapPin size={12} className="clinic-pill-pin" aria-hidden="true" />
                  <span className="clinic-pill-name">{clinic.shortLocation || clinic.name}</span>
                  {clinic.availableToday && (
                    <span className="clinic-today-dot" title="متاح كشف اليوم"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Clinic Details Box */}
        <div className="selected-clinic-box">
          <div className="selected-clinic-header">
            <div className="clinic-title-line">
              <Building2 size={14} className="meta-icon" aria-hidden="true" />
              <strong className="clinic-hospital-title">{activeClinic.name}</strong>
            </div>
            <div className="clinic-address-line">
              <MapPin size={13} className="meta-icon" aria-hidden="true" />
              <span className="clinic-address-sub">{activeClinic.location}</span>
            </div>
            {activeClinic.days && (
              <div className="clinic-days-line">
                <CalendarDays size={13} className="meta-icon text-orange" aria-hidden="true" />
                <span className="clinic-work-days">أيام العمل: <strong>{activeClinic.days}</strong></span>
              </div>
            )}
          </div>

          {/* Underneath the Selected Clinic: Clinic-Specific Available Appointments */}
          <div className="clinic-slots-area">
            <div className="slots-header-line">
              <span className="slots-label">
                المواعيد المتاحة في ({activeClinic.shortLocation || activeClinic.name}):
              </span>
              {hasSlots && (
                <span className="slots-count-badge">{activeSlots.length} مواعيد</span>
              )}
            </div>

            {!hasSlots ? (
              <div className="no-slots-in-clinic">
                <span>اكتملت مواعيد هذه العيادة حالياً، يمكنك تجربة عيادة أخرى للطبيب بالأعلى.</span>
              </div>
            ) : (
              <div className="slots-mini-list">
                {activeSlots.map((slot, idx) => (
                  <button 
                    key={idx} 
                    type="button"
                    className="mini-slot-badge"
                    onClick={() => onBookDoctor(doc, slot, activeClinic.id)}
                    title={`اضغط للحجز الفوري في ${activeClinic.name} - الساعة ${slot}`}
                  >
                    <Clock3 size={11} aria-hidden="true" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zero Waiting Banner */}
        <div className="doc-wait-badge">
          <Clock3 className="wait-icon" size={14} aria-hidden="true" />
          <span className="wait-text">وقت الانتظار: <strong>0 دقيقة (دخول فوري بدون زحمة)</strong></span>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="doc-card-footer">
        <div className="doc-price-slot">
          <div className="price-group">
            <span className="price-label">سعر الكشف</span>
            <div className="price-val-wrap">
              <span className="price-val">{doc.price}</span>
              <span className="price-curr">ج.م</span>
            </div>
          </div>
          <div className={`next-slot-pill ${!hasSlots ? 'booked-out' : ''}`}>
            <span className="slot-indicator"></span>
            <span>{nextSlotText}</span>
          </div>
        </div>

        <div className="doc-cta-group">
          <button 
            type="button" 
            className="btn btn-book-doctor"
            onClick={() => onBookDoctor(doc, activeSlots[0] || null, activeClinic.id)}
            title={`احجز الآن في ${activeClinic.name}`}
          >
            <span>احجز الآن بالعيادة</span>
            <span className="btn-arrow">←</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Doctors({ 
  doctors = [],
  selectedSpecialty, 
  onSelectSpecialty, 
  searchQuery, 
  onBookDoctor,
  loading = false
}) {
  const [internalSearch, setInternalSearch] = useState('');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [selectedCity, setSelectedCity] = useState('كل المدن');
  const [pagination, setPagination] = useState({ page: 1, filterKey: '' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const updateIsMobile = () => setIsMobile(mobileQuery.matches);
    updateIsMobile();
    mobileQuery.addEventListener('change', updateIsMobile);
    return () => mobileQuery.removeEventListener('change', updateIsMobile);
  }, []);

  const doctorsPerPage = isMobile ? 1 : 6;

  // Dynamic Specialties derived from doctors data
  const specialtyTabs = useMemo(() => {
    const list = doctors.map(d => d.specialtyFilter).filter(Boolean);
    return ['الكل', ...Array.from(new Set(list))];
  }, [doctors]);

  const activeSpecialty = selectedSpecialty || 'الكل';

  // Dynamic Filter logic supporting multi-clinics & city matching
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // 1. Specialty filter
      if (activeSpecialty && activeSpecialty !== 'الكل') {
        const matchesSpec = 
          doc.specialtyFilter === activeSpecialty || 
          doc.specialty.includes(activeSpecialty);
        if (!matchesSpec) return false;
      }

      // 2. Today filter (check doctor or any clinic)
      if (onlyAvailableToday) {
        const hasAvailableToday = doc.availableToday || (
          Array.isArray(doc.clinics) && doc.clinics.some(c => c.availableToday && Array.isArray(c.availableSlots) && c.availableSlots.length > 0)
        );
        if (!hasAvailableToday) return false;
      }

      // 3. City filter (check doctor city OR any clinic city / location)
      if (selectedCity !== 'كل المدن') {
        const matchesMainCity = doc.city === selectedCity || (doc.location && doc.location.includes(selectedCity));
        const matchesClinicCity = Array.isArray(doc.clinics) && doc.clinics.some(c => 
          c.city === selectedCity || (c.location && c.location.includes(selectedCity))
        );
        if (!matchesMainCity && !matchesClinicCity) return false;
      }

      // 4. Search query
      const term = (internalSearch || searchQuery || '').trim().toLowerCase();
      if (term) {
        const matchesName = doc.name.toLowerCase().includes(term);
        const matchesSpec = doc.specialty.toLowerCase().includes(term);
        const matchesLoc = doc.location.toLowerCase().includes(term);
        const matchesHospital = doc.hospital && doc.hospital.toLowerCase().includes(term);
        const matchesTags = doc.tags?.some(tag => tag.toLowerCase().includes(term));
        const matchesClinics = Array.isArray(doc.clinics) && doc.clinics.some(c => 
          c.name.toLowerCase().includes(term) ||
          c.location.toLowerCase().includes(term) ||
          (c.shortLocation && c.shortLocation.toLowerCase().includes(term))
        );
        if (!matchesName && !matchesSpec && !matchesLoc && !matchesHospital && !matchesTags && !matchesClinics) {
          return false;
        }
      }

      return true;
    });
  }, [doctors, activeSpecialty, onlyAvailableToday, selectedCity, internalSearch, searchQuery]);

  const pageCount = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const filterKey = JSON.stringify([
    selectedSpecialty || 'الكل',
    onlyAvailableToday,
    selectedCity,
    internalSearch,
    searchQuery
  ]);
  const currentPage = pagination.filterKey === filterKey
    ? Math.min(pagination.page, Math.max(pageCount, 1))
    : 1;
  const visibleDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  return (
    <section className="doctors-section" id="doctors">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header-center">
          <h2 className="section-main-title">
            احجز مع <span className="highlight-text">أفضل الأطباء المعتمدين</span>
          </h2>
          <p className="section-main-subtitle">
            اختر الطبيب والعيادة الأقرب لموقعك واطّلع على المواعيد المتاحة لكل عيادة بدقة. جميع المواعيد مؤكدة بدون أي دقيقة انتظار.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="doctors-filter-card">
          
          {/* Top Search & City Bar */}
          <div className="filter-top-row">
            <div className="filter-search-box">
              <Search className="search-symbol" aria-hidden="true" />
              <input 
                type="text" 
                className="filter-search-input"
                placeholder="ابحث بالطبيب، التخصص، العيادة، أو المنطقة السكنية..."
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
              />
              {internalSearch && (
                <button 
                  type="button" 
                  className="clear-search-btn" 
                  onClick={() => setInternalSearch('')}
                  aria-label="مسح البحث"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="filter-select-group">
              <select 
                className="filter-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label="اختر المدينة"
              >
                {['كل المدن', ...EGYPT_GOVERNORATES].map(city => (
                  <option key={city} value={city}>
                    {city === 'كل المدن' ? 'كل المدن والمحافظات' : city}
                  </option>
                ))}
              </select>

              <button 
                type="button" 
                className={`filter-toggle-btn ${onlyAvailableToday ? 'active' : ''}`}
                onClick={() => setOnlyAvailableToday(prev => !prev)}
              >
                <Zap className="lightning-icon" aria-hidden="true" />
                <span>متاح اليوم فقط</span>
              </button>
            </div>
          </div>

          {/* Dynamic Specialty Filter Tabs */}
          <div className="filter-tabs-row" role="tablist">
            {specialtyTabs.map((tab) => {
              const isActive = (selectedSpecialty === tab) || (!selectedSpecialty && tab === 'الكل');
              return (
                <button
                  key={tab}
                  type="button"
                  className={`spec-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectSpecialty(tab)}
                  role="tab"
                  aria-selected={isActive}
                >
                  {tab}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Counter */}
        <div className="results-count-bar">
          <span className="results-badge">
            تم العثور على <strong>{filteredDoctors.length}</strong> طبيب متاح للحجز
          </span>
          {onlyAvailableToday && (
            <span className="filter-active-pill">
              عرض المتاحين اليوم فقط
              <button type="button" onClick={() => setOnlyAvailableToday(false)}>×</button>
            </span>
          )}
        </div>

        {/* Dynamic Doctors List */}
        {loading ? (
          <div className="loading-state-wrapper">
            <div className="spinner"></div>
            <span>جارِ تحميل جدول أطباء دكتورك وعياداتهم...</span>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="no-doctors-card">
            <Stethoscope className="no-doctors-icon" aria-hidden="true" />
            <h3 className="no-doctors-title">لم نجد أطباء يطابقون خيارات البحث الحالية</h3>
            <p className="no-doctors-desc">
              جرب تغيير التخصص، إلغاء فلتر "متاح اليوم فقط"، أو مسح كلمة البحث لرؤية كافة الأطباء والعيادات.
            </p>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => {
                onSelectSpecialty('الكل');
                setOnlyAvailableToday(false);
                setSelectedCity('كل المدن');
                setInternalSearch('');
              }}
            >
              عرض جميع الأطباء المتاحين
            </button>
          </div>
        ) : (
          <div className="doctors-grid-with-controls">
            {pageCount > 1 && (
              <button
                type="button"
                className="doctors-page-arrow previous"
                onClick={() => setPagination({ page: currentPage - 1, filterKey })}
                disabled={currentPage === 1}
                aria-label="عرض الأطباء السابقين"
              >
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            )}
            <div className="doctors-grid">
              {visibleDoctors.map((doc) => (
                <DoctorCard 
                  key={doc.id}
                  doc={doc}
                  selectedCity={selectedCity}
                  onBookDoctor={onBookDoctor}
                />
              ))}
            </div>
            {pageCount > 1 && (
              <button
                type="button"
                className="doctors-page-arrow next"
                onClick={() => setPagination({ page: currentPage + 1, filterKey })}
                disabled={currentPage === pageCount}
                aria-label="عرض باقي الأطباء"
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {!loading && pageCount > 1 && (
          <nav className="doctors-pagination" aria-label="صفحات الأطباء">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setPagination({ page, filterKey })}
                aria-label={`الصفحة ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </nav>
        )}

      </div>
    </section>
  );
}
