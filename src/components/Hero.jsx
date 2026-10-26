import React, { useState, useEffect } from 'react';
import { Stethoscope, Siren, UserRound } from 'lucide-react';

export default function Hero({ 
  onOpenEmergency, 
  onToast, 
  onSearch,
  stats = { doctorsCount: 216, bookingsCount: 15200, satisfactionRate: 98, specialtiesCount: 32, emergencyDoctorsCount: 16 },
  doctors = [],
  specialties = []
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Animated counters state
  const [counts, setCounts] = useState({
    doctors: 0,
    bookings: 0,
    satisfaction: 0,
    specialties: 0
  });

  useEffect(() => {
    const targetDoctors = stats.doctorsCount || 200;
    const targetBookings = stats.bookingsCount || 15000;
    const targetSatisfaction = stats.satisfactionRate || 98;
    const targetSpecialties = stats.specialtiesCount || 30;

    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCounts({
        doctors: Math.floor(easeProgress * targetDoctors),
        bookings: Math.floor(easeProgress * targetBookings),
        satisfaction: Math.floor(easeProgress * targetSatisfaction),
        specialties: Math.floor(easeProgress * targetSpecialties)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCounts({
          doctors: targetDoctors,
          bookings: targetBookings,
          satisfaction: targetSatisfaction,
          specialties: targetSpecialties
        });
      }
    };

    requestAnimationFrame(animate);
  }, [stats]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) {
      onToast('يرجى كتابة اسم الطبيب أو التخصص المطلوب للبحث', 'normal');
      return;
    }
    setIsDropdownOpen(false);
    onToast(`جارِ البحث عن: "${query}" في شبكة أطباء دكتورك...`, 'success');
    if (onSearch) {
      onSearch(query);
    }
    const docEl = document.getElementById('doctors');
    if (docEl) docEl.scrollIntoView({ behavior: 'smooth' });
  };

  const selectSuggestion = (value) => {
    setSearchTerm(value);
    setIsDropdownOpen(false);
    onToast(`جارِ البحث عن: "${value}"...`, 'success');
    if (onSearch) {
      onSearch(value);
    }
    const docEl = document.getElementById('doctors');
    if (docEl) docEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Dynamic suggestion lists
  const suggestedSpecialties = specialties.length > 0 
    ? specialties.slice(0, 6).map(s => s.shortName || s.name)
    : ['قلب وأوعية دموية', 'جلدية وتجميل', 'طب الأطفال', 'عظام ومفاصل', 'أسنان', 'باطنة عامة'];

  const suggestedDoctors = doctors.length > 0 
    ? doctors.slice(0, 3) 
    : [
        { id: 1, name: 'د. أحمد منصور', specialty: 'استشاري أمراض القلب والأوعية الدموية', initials: 'د.أ' },
        { id: 2, name: 'د. سارة العلي', specialty: 'أخصائية الجلدية والتجميل والليزر', initials: 'د.س' },
        { id: 3, name: 'د. مريم الشريف', specialty: 'استشاري طب وجراحة الأطفال', initials: 'د.م' }
      ];

  return (
    <section className="hero-section" id="heroSection">
      {/* Background Image & Emerald Atmospheric Overlay */}
      <div className="hero-bg" aria-hidden="true">
        <img 
          src="/assets/hero-bg.jpg" 
          alt="عيادة دكتورك الطبية" 
          className="hero-bg-img" 
          loading="eager"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-container">
        
        {/* Right Column in RTL: Headline, Subtitle, Search */}
        <div className="hero-content">
          
          {/* Headline */}
          <h1 className="hero-headline">
            <span className="headline-part line-white">احجز موعدك</span>
            <span className="headline-part line-orange">بدون زحمة</span>
            <span className="headline-part line-light">في أقل من دقيقة</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-description">
            وداعاً لساعات الانتظار، احجز موعدك أونلاين، اختار وقتك، وادخل عند الدكتور في موعدك بالضبط.
          </p>

          {/* Interactive Search Bar */}
          <div className="search-box-wrapper">
            <form className="search-form" onSubmit={handleSearchSubmit}>
              
              <div className="search-input-field">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="ابحث عن طبيب أو تخصص..." 
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    setIsDropdownOpen(true);
                    onSearch?.(value);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  aria-label="ابحث عن طبيب أو تخصص"
                />
                
                {/* Cyan/Blue Magnifying Glass Icon */}
                <span className="search-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                
                {/* Live Search Suggestions Dropdown */}
                {isDropdownOpen && (
                  <div className="search-dropdown">
                    <div className="dropdown-section">
                      <span className="section-title"><Stethoscope size={15} aria-hidden="true" /> التخصصات الشائعة المتاحة</span>
                      <div className="chips-list">
                        {suggestedSpecialties.map((spec) => (
                          <button 
                            key={spec} 
                            type="button" 
                            className="search-chip" 
                            onClick={() => selectSuggestion(spec)}
                          >
                            {spec}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="dropdown-section">
                      <span className="section-title"><UserRound size={15} aria-hidden="true" /> نخبة الأطباء</span>
                      <ul className="suggested-doctors">
                        {suggestedDoctors.map((doc) => (
                          <li key={doc.id} className="doctor-item" onClick={() => selectSuggestion(doc.name)}>
                            <span className="doc-avatar">{doc.initials || 'د'}</span>
                            <div className="doc-meta">
                              <span className="doc-name">{doc.name}</span>
                              <span className="doc-spec">{doc.specialty}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Search Button */}
              <button type="submit" className="btn btn-search">
                ابحث الآن
              </button>
            </form>
          </div>

        </div>

        {/* Left Column in RTL: Frosted Glass Stats Card */}
        <div className="hero-stats-wrapper">
          <div className="stats-glass-card">
            
            {/* Card Header Title */}
            <div className="stats-card-header">
              <span className="stats-title-badge">إحصائيات دكتورك</span>
            </div>

            {/* 2x2 Metrics Grid */}
            <div className="stats-grid">
              
              {/* Top-Right: طبيب متخصص */}
              <div className="stat-tile">
                <div className="stat-number-wrapper">
                  <span className="stat-number">+{counts.doctors}</span>
                </div>
                <span className="stat-label">طبيب متخصص</span>
              </div>

              {/* Top-Left: حجز ناجح */}
              <div className="stat-tile">
                <div className="stat-number-wrapper">
                  <span className="stat-number">
                    +{counts.bookings.toLocaleString('en-US')}
                  </span>
                </div>
                <span className="stat-label">حجز ناجح</span>
              </div>

              {/* Bottom-Right: رضا المرضى */}
              <div className="stat-tile">
                <div className="stat-number-wrapper">
                  <span className="stat-number">%{counts.satisfaction}</span>
                </div>
                <span className="stat-label">رضا المرضى</span>
              </div>

              {/* Bottom-Left: تخصص طبي */}
              <div className="stat-tile">
                <div className="stat-number-wrapper">
                  <span className="stat-number">+{counts.specialties}</span>
                </div>
                <span className="stat-label">تخصص طبي</span>
              </div>

            </div>

            {/* Bottom Emergency Banner inside the card */}
            <div className="emergency-bar">
              {/* Left Action Button in RTL */}
              <button 
                type="button" 
                className="btn btn-emergency-cta" 
                onClick={onOpenEmergency}
              >
                احجز
              </button>

              {/* Right Text & Siren in RTL */}
              <div className="emergency-info-group">
                <div className="emergency-texts">
                  <span className="emergency-headline">طوارئ متاحة</span>
                  <span className="emergency-subtext">
                    {stats.emergencyDoctorsCount || 14} طبيب متاح الآن
                  </span>
                </div>
                <div className="emergency-icon-wrap" aria-hidden="true">
                  <Siren className="siren-pulse" aria-hidden="true" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
