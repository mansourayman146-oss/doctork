import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, Building2, Clock3, MapPin, Search, Star, Stethoscope, X, Zap } from 'lucide-react';

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

  // Dynamic Filter logic
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // 1. Specialty filter
      if (activeSpecialty && activeSpecialty !== 'الكل') {
        const matchesSpec = 
          doc.specialtyFilter === activeSpecialty || 
          doc.specialty.includes(activeSpecialty);
        if (!matchesSpec) return false;
      }

      // 2. Today filter
      if (onlyAvailableToday && !doc.availableToday) {
        return false;
      }

      // 3. City filter
      if (selectedCity !== 'كل المدن') {
        if (!doc.location.includes(selectedCity) && doc.city !== selectedCity) return false;
      }

      // 4. Search query
      const term = (internalSearch || searchQuery || '').trim().toLowerCase();
      if (term) {
        const matchesName = doc.name.toLowerCase().includes(term);
        const matchesSpec = doc.specialty.toLowerCase().includes(term);
        const matchesLoc = doc.location.toLowerCase().includes(term);
        const matchesHospital = doc.hospital.toLowerCase().includes(term);
        const matchesTags = doc.tags?.some(tag => tag.toLowerCase().includes(term));
        if (!matchesName && !matchesSpec && !matchesLoc && !matchesHospital && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [doctors, selectedSpecialty, onlyAvailableToday, selectedCity, internalSearch, searchQuery]);

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
            اختر الطبيب المناسب حسب التقييمات الحقيقية، موقع العيادة، وسعر الكشف. جميع المواعيد مؤكدة بدون أي دقيقة انتظار.
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
                placeholder="ابحث بالاسم، المستشفى، أو الكشف الطبي..."
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
            <span>جارِ تحميل جدول أطباء دكتورك...</span>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="no-doctors-card">
            <Stethoscope className="no-doctors-icon" aria-hidden="true" />
            <h3 className="no-doctors-title">لم نجد أطباء يطابقون خيارات البحث الحالية</h3>
            <p className="no-doctors-desc">
              جرب تغيير التخصص، إلغاء فلتر "متاح اليوم فقط"، أو مسح كلمة البحث لرؤية كافة الأطباء المتاحين.
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
              {visibleDoctors.map((doc) => {
                const hasSlots = Array.isArray(doc.availableSlots) && doc.availableSlots.length > 0;
                const nextSlotText = hasSlots 
                  ? (doc.availableToday ? `متاح اليوم: ${doc.availableSlots[0]}` : `متاح غداً: ${doc.availableSlots[0]}`)
                  : 'اكتملت مواعيد اليوم';

                return (
                  <article key={doc.id} className="doctor-card" id={`doctor-${doc.id}`}>
                  
                  {/* Doctor Card Top / Badges */}
                  <div className="doc-card-header">
                    <div className="doc-avatar-wrap" style={{ backgroundColor: doc.avatarBg || '#183b2b' }}>
                      <span className="doc-initials">{doc.initials}</span>
                      <span className={`doc-status-dot ${hasSlots ? 'active' : 'busy'}`} title={hasSlots ? 'متواجد وجاهز للحجز' : 'المواعيد ممتلئة'}></span>
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

                  {/* Subtitle / Hospital / Location */}
                  <div className="doc-card-body">
                    <p className="doc-full-title">{doc.title}</p>
                    
                    <div className="doc-meta-list">
                      <div className="doc-meta-item">
                        <Building2 className="meta-icon" aria-hidden="true" />
                        <span className="meta-text">{doc.hospital}</span>
                      </div>
                      <div className="doc-meta-item">
                        <MapPin className="meta-icon" aria-hidden="true" />
                        <span className="meta-text">{doc.location}</span>
                      </div>
                    </div>

                    {/* Highlights / Features */}
                    {doc.tags && (
                      <div className="doc-tags-row">
                        {doc.tags.map((tag, i) => (
                          <span key={i} className="doc-tag">{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Zero Waiting Banner */}
                    <div className="doc-wait-badge">
                      <Clock3 className="wait-icon" size={14} aria-hidden="true" />
                      <span className="wait-text">وقت الانتظار: <strong>0 دقيقة (بدون زحمة)</strong></span>
                    </div>

                    {/* Available Slots Preview */}
                    {hasSlots && (
                      <div className="doc-slots-preview">
                        <span className="slots-label">المواعيد المتاحة:</span>
                        <div className="slots-mini-list">
                          {doc.availableSlots.slice(0, 4).map((slot, idx) => (
                            <span 
                              key={idx} 
                              className="mini-slot-badge"
                              onClick={() => onBookDoctor(doc, slot)}
                              title="اضغط للحجز الفوري لهذا الموعد"
                            >
                              {slot}
                            </span>
                          ))}
                          {doc.availableSlots.length > 4 && (
                            <span className="mini-slot-more">+{doc.availableSlots.length - 4} مواعيد</span>
                          )}
                        </div>
                      </div>
                    )}
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
                        onClick={() => onBookDoctor(doc)}
                      >
                        <span>احجز الآن بدون زحمة</span>
                        <span className="btn-arrow">←</span>
                      </button>
                    </div>
                  </div>

                  </article>
                );
              })}
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
