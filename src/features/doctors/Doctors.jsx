import './Doctors.css';
import React, { useState, useMemo, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { EGYPT_GOVERNORATES } from '@/lib/constants';



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
              <Icon name="check-circle" size={14} /> موثق
            </span>
          </div>
          <span className="doc-card-specialty">{doc.specialty}</span>
          
          <div className="doc-rating-row">
            <div className="stars-group" aria-label={`تقييم ${doc.rating} من 5`}>
              <Icon name="star" className="star-icon" size={14} />
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
            <Icon name="building" size={13} className="clinics-picker-icon" />
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
                  <Icon name="pin" size={12} className="clinic-pill-pin" />
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
              <Icon name="building" size={14} className="meta-icon" />
              <strong className="clinic-hospital-title">{activeClinic.name}</strong>
            </div>
            <div className="clinic-address-line">
              <Icon name="pin" size={13} className="meta-icon" />
              <span className="clinic-address-sub">{activeClinic.location}</span>
            </div>
            {activeClinic.days && (
              <div className="clinic-days-line">
                <Icon name="calendar" size={13} className="meta-icon text-orange" />
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
                    <Icon name="clock" size={11} />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zero Waiting Banner */}
        <div className="doc-wait-badge">
          <Icon name="clock" className="wait-icon" size={14} />
          <span className="wait-text">وقت الانتظار: <strong>0 دقيقة (دخول فوري بدون زحمة)</strong></span>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="doc-card-footer">
        <div className="doc-price-slot">
          <div className="price-group">
            <span className="price-label">سعر الكشف</span>
            <span className="doc-price-val">{doc.price} ج.م</span>
          </div>
          <span className="price-note">داخل العيادة المحددة</span>
        </div>

        <button 
          type="button" 
          className="btn btn-primary btn-book-doctor"
          onClick={() => onBookDoctor(doc, activeSlots[0] || null, activeClinic.id)}
        >
          <span>احجز الآن في {activeClinic.shortLocation || 'العيادة'}</span>
          <span className="btn-sub-note">{nextSlotText}</span>
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
        const docMatchesCity = doc.city === selectedCity || doc.location.includes(selectedCity);
        const clinicMatchesCity = Array.isArray(doc.clinics) && doc.clinics.some(c => c.city === selectedCity || c.location?.includes(selectedCity));
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

  const pageSize = 4;
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
