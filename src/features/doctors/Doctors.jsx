import './Doctors.css';
import React, { useState, useMemo, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { EGYPT_MEDICAL_REGIONS } from '@/lib/constants';



/**
 * Creative Doctor Avatar with organic sculpted frame,
 * dynamic theme aura, live pulsing status indicator, and graceful fallback.
 */
function DoctorAvatar({ doc, hasSlots }) {
  const [imgError, setImgError] = useState(false);
  const showImg = Boolean(doc.image && !imgError);

  return (
    <div 
      className="doc-avatar-halo"
      style={{ '--avatar-theme': doc.avatarBg || '#183b2b' }}
    >
      <div 
        className="doc-avatar-wrap" 
        style={{ backgroundColor: doc.avatarBg || '#183b2b' }}
      >
        {showImg ? (
          <img
            src={doc.image}
            alt={doc.name}
            className="doc-avatar-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="doc-initials">{doc.initials}</span>
        )}
        <span 
          className={`doc-status-dot ${hasSlots ? 'active' : 'busy'}`} 
          title={hasSlots ? 'متواجد وجاهز للحجز الفوري' : 'المواعيد ممتلئة'}
          aria-label={hasSlots ? 'متواجد وجاهز للحجز' : 'المواعيد ممتلئة'}
        >
          <span className="doc-status-ping"></span>
        </span>
      </div>
      <div className="avatar-ambient-glow" aria-hidden="true"></div>
    </div>
  );
}

/**
 * Individual Doctor Card with Interactive Multi-Clinic Selector
 * and Real-Time Clinic-Specific Available Appointments
 */
function DoctorCard({ doc, selectedCity, searchQuery, onBookDoctor }) {
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

  // Find if a clinic matches the currently filtered city, region, or search term
  const effectiveFilter = useMemo(() => {
    if (selectedCity && selectedCity !== 'كل المدن') return selectedCity.trim().toLowerCase();
    if (searchQuery) return searchQuery.trim().toLowerCase();
    return '';
  }, [selectedCity, searchQuery]);

  const matchingClinic = useMemo(() => {
    if (!effectiveFilter) return null;
    return clinics.find(c => 
      c.city?.toLowerCase().includes(effectiveFilter) || 
      c.location?.toLowerCase().includes(effectiveFilter) ||
      c.shortLocation?.toLowerCase().includes(effectiveFilter) ||
      c.name?.toLowerCase().includes(effectiveFilter)
    );
  }, [clinics, effectiveFilter]);

  const [activeClinicId, setActiveClinicId] = useState(() => (matchingClinic || clinics[0])?.id);

  // If filter changes, automatically switch to the matching clinic if available
  useEffect(() => {
    if (matchingClinic) {
      setActiveClinicId(matchingClinic.id);
    }
  }, [matchingClinic]);

  // Fallback to first clinic if activeClinicId not in list
  const activeClinic = clinics.find(c => c.id === activeClinicId) || matchingClinic || clinics[0];
  const activeSlots = Array.isArray(activeClinic?.availableSlots) ? activeClinic.availableSlots : [];
  const hasSlots = activeSlots.length > 0;
  const isAvailableToday = Boolean(activeClinic?.availableToday);
  const nextSlotText = hasSlots
    ? (isAvailableToday ? `متاح اليوم: ${activeSlots[0]}` : `متاح غداً: ${activeSlots[0]}`)
    : 'اكتملت مواعيد هذه العيادة';

  return (
    <article 
      className="doctor-card modern-doc-card" 
      id={`doctor-${doc.id}`}
      style={{ '--doc-theme': doc.avatarBg || '#183b2b' }}
    >
      {/* Corner Geometric Triangle & Diagonal Accent Line */}
      <div className="doc-corner-triangle-wrap" aria-hidden="true">
        <svg 
          className="doc-corner-triangle-svg" 
          viewBox="0 0 170 170" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`doc-grad-${doc.id}`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={doc.avatarBg || '#183b2b'} stopOpacity="0.24" />
              <stop offset="60%" stopColor={doc.avatarBg || '#183b2b'} stopOpacity="0.10" />
              <stop offset="100%" stopColor={doc.avatarBg || '#183b2b'} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <polygon 
            points="0,0 170,0 170,170" 
            fill={`url(#doc-grad-${doc.id})`}
            className="corner-poly"
          />
          <line 
            x1="0" 
            y1="0" 
            x2="170" 
            y2="170" 
            stroke={doc.avatarBg || '#183b2b'} 
            strokeWidth="1.5" 
            strokeOpacity="0.38"
            className="corner-line"
          />
        </svg>
      </div>

      {/* Doctor Card Top / Badges */}
      <div className="doc-card-header">
        <DoctorAvatar doc={doc} hasSlots={hasSlots} />

        <div className="doc-header-info">
          <div className="doc-title-row">
            <h3 className="doc-card-name">{doc.name}</h3>
            <span className="verified-check" title="طبيب معتمد وموثق بنقابة الأطباء">
              <Icon name="check-circle" size={13} /> موثق
            </span>
          </div>
          <span className="doc-card-specialty">{doc.specialty}</span>
          
          <div className="doc-rating-row">
            <div className="stars-group" aria-label={`تقييم ${doc.rating} من 5`}>
              <Icon name="star" className="star-icon" size={13} />
              <strong className="rating-value">{doc.rating}</strong>
              <span className="reviews-count">({doc.reviewsCount})</span>
            </div>
            <span className="exp-pill">{doc.experience}</span>
          </div>
        </div>
      </div>

      {/* Doctor Subtitle & Highlights */}
      <div className="doc-card-body">
        <p className="doc-full-title">{doc.title}</p>

        {/* Location & Branches Overview (Informative Only) */}
        <div className="doc-location-snippet">
          <div className="doc-hospital-line">
            <Icon name="building" size={13} className="snippet-icon" />
            <strong className="hospital-name">{activeClinic.name}</strong>
          </div>
          <div className="doc-address-line">
            <Icon name="pin" size={12} className="snippet-icon text-muted" />
            <span>{activeClinic.location}</span>
          </div>

          {clinics.length > 1 && (
            <div className="doc-branches-display">
              <span className="branches-tag">الفروع المتاحة ({clinics.length}):</span>
              <div className="branches-tags-row">
                {clinics.map((clinic) => (
                  <span
                    key={clinic.id}
                    className="branch-static-tag"
                  >
                    {clinic.shortLocation || clinic.city || clinic.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Availability Badge */}
        <div className="doc-perks-row">
          <div className="doc-perk-item slot-highlight" title="أقرب موعد كشف متاح">
            <span className="perk-dot"></span>
            <span>{nextSlotText}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="doc-card-footer">
        <div className="doc-footer-meta">
          <div className="doc-price-slot">
            <span className="price-label">سعر الكشف</span>
            <div className="price-group">
              <span className="price-val">{doc.price}</span>
              <span className="price-curr">ج.م</span>
            </div>
            <span className="price-note">داخل العيادة</span>
          </div>

          <div className="doc-steps-indicator" title="حجز فوري في 3 خطوات بسيطة">
            <span className="steps-badge">3 خطوات للحجز</span>
          </div>
        </div>

        <button 
          type="button" 
          className="btn btn-primary btn-book-doctor"
          onClick={() => onBookDoctor(doc, activeSlots[0], activeClinic.id)}
          title={`بدء حجز موعد كشف مع ${doc.name}`}
        >
          <span className="btn-book-text">احجز موعد كشف</span>
          <Icon name="arrow-left" size={14} className="btn-arrow" />
        </button>
      </div>
    </article>
  );
}

export default function Doctors({ 
  doctors = [], 
  selectedSpecialty, 
  onSelectSpecialty, 
  searchQuery = '',
  onBookDoctor,
  loading = false 
}) {
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('كل المدن');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, filterKey: '' });

  // Sync internal search with hero search prop
  useEffect(() => {
    if (searchQuery) {
      setInternalSearch(searchQuery);
    }
  }, [searchQuery]);

  // Specialty tabs list
  const specialtyTabs = useMemo(() => {
    const list = ['الكل'];
    doctors.forEach(doc => {
      const spec = doc.specialtyFilter || doc.specialty;
      if (spec && !list.includes(spec)) {
        list.push(spec);
      }
    });
    return list;
  }, [doctors]);

  // Active specialty helper
  const activeSpecialty = selectedSpecialty || 'الكل';

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // 1. Specialty filter
      if (activeSpecialty !== 'الكل') {
        const matchesSpec = doc.specialtyFilter === activeSpecialty || doc.specialty.includes(activeSpecialty);
        if (!matchesSpec) return false;
      }

      // 2. City filter
      if (selectedCity !== 'كل المدن') {
        const cityTerm = selectedCity.trim().toLowerCase();
        const docMatchesCity = doc.city?.toLowerCase().includes(cityTerm) || doc.location?.toLowerCase().includes(cityTerm);
        const clinicMatchesCity = Array.isArray(doc.clinics) && doc.clinics.some(c => 
          c.city?.toLowerCase().includes(cityTerm) || 
          c.location?.toLowerCase().includes(cityTerm) ||
          c.shortLocation?.toLowerCase().includes(cityTerm) ||
          c.name?.toLowerCase().includes(cityTerm)
        );
        if (!docMatchesCity && !clinicMatchesCity) return false;
      }

      // 3. Available today filter
      if (onlyAvailableToday) {
        const docAvailable = doc.availableToday;
        const clinicAvailable = Array.isArray(doc.clinics) && doc.clinics.some(c => c.availableToday && Array.isArray(c.availableSlots) && c.availableSlots.length > 0);
        if (!docAvailable && !clinicAvailable) return false;
      }

      // 4. Search query
      const term = (internalSearch || searchQuery || '').trim().toLowerCase();
      if (term) {
        const nameMatch = doc.name.toLowerCase().includes(term);
        const specMatch = doc.specialty.toLowerCase().includes(term);
        const locMatch = doc.location.toLowerCase().includes(term);
        const hospMatch = doc.hospital && doc.hospital.toLowerCase().includes(term);
        const tagsMatch = doc.tags && doc.tags.some(t => t.toLowerCase().includes(term));
        const clinicMatch = Array.isArray(doc.clinics) && doc.clinics.some(c => 
          c.name.toLowerCase().includes(term) || 
          c.location.toLowerCase().includes(term) ||
          (c.shortLocation && c.shortLocation.toLowerCase().includes(term))
        );

        if (!nameMatch && !specMatch && !locMatch && !hospMatch && !tagsMatch && !clinicMatch) {
          return false;
        }
      }

      return true;
    });
  }, [doctors, activeSpecialty, onlyAvailableToday, selectedCity, internalSearch, searchQuery]);

  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredDoctors.length / pageSize));
  const filterKey = `${activeSpecialty}|${selectedCity}|${onlyAvailableToday}|${internalSearch}|${searchQuery}`;
  const currentPage = pagination.filterKey === filterKey
    ? Math.min(pagination.page, pageCount)
    : 1;

  const visibleDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(startIndex, startIndex + pageSize);
  }, [filteredDoctors, currentPage, pageSize]);

  return (
    <section className="doctors-section" id="doctors">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header-center">
          <div className="badge-pill-header">
            <span>نخبة الأطباء والعيادات المعتمدة</span>
          </div>
          <h2 className="section-main-title">
            احجز مع <span className="highlight-text">أفضل الاستشاريين</span> في مدينتك
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
              <Icon name="search" className="search-symbol" />
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
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>

            <div className="filter-select-group">
              <select 
                className="filter-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                aria-label="اختر المدينة أو المنطقة"
              >
                {['كل المدن', ...EGYPT_MEDICAL_REGIONS].map(city => (
                  <option key={city} value={city}>
                    {city === 'كل المدن' ? 'كل المدن والمناطق' : city}
                  </option>
                ))}
              </select>

              <button 
                type="button" 
                className={`filter-toggle-btn ${onlyAvailableToday ? 'active' : ''}`}
                onClick={() => setOnlyAvailableToday(prev => !prev)}
              >
                <Icon name="zap" className="lightning-icon" />
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
            <Icon name="stethoscope" className="no-doctors-icon" />
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
                <Icon name="arrow-right" size={20} />
              </button>
            )}
            <div className="doctors-grid">
              {visibleDoctors.map((doc) => (
                <DoctorCard 
                  key={doc.id}
                  doc={doc}
                  selectedCity={selectedCity}
                  searchQuery={internalSearch || searchQuery}
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
                <Icon name="arrow-left" size={20} />
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
