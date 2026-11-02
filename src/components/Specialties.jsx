import React from 'react';
import Icon from './ui/Icon';

const SPECIALTY_ICONS = {
  cardiology: 'heart-pulse',
  dermatology: 'sparkles',
  pediatrics: 'baby',
  orthopedics: 'bone',
  dentistry: 'smile',
  internal: 'stethoscope',
  ophthalmology: 'eye',
  neurology: 'brain',
  heart: 'heart-pulse',
  sparkles: 'sparkles',
  baby: 'baby',
  bone: 'bone',
  tooth: 'smile',
  stethoscope: 'stethoscope',
  eye: 'eye',
  brain: 'brain'
};

export default function Specialties({ 
  specialties = [], 
  selectedSpecialty, 
  onSelectSpecialty,
  loading = false 
}) {
  const handleCardClick = (specName) => {
    onSelectSpecialty(specName);
    // Smooth scroll to doctors section
    const doctorsSection = document.getElementById('doctors');
    if (doctorsSection) {
      doctorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="specialties-section" id="specialties">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header-center">
          <h2 className="section-main-title">
            تصفح حسب <span className="highlight-text">التخصص الطبي</span>
          </h2>
          <p className="section-main-subtitle">
            نخبة من أمهر الأطباء والاستشاريين في أكثر من 30 تخصص طبي مختلف. اختر تخصصك واحجز موعدك فوراً بدون أي زحمة.
          </p>
        </div>

        {/* Dynamic Specialties Grid */}
        {loading ? (
          <div className="loading-state-wrapper">
            <div className="spinner"></div>
            <span>جارِ تحميل التخصصات المتاحة...</span>
          </div>
        ) : (
          <div className="specialties-grid">
            {specialties.map((spec) => {
              const isSelected = selectedSpecialty === spec.shortName || selectedSpecialty === spec.name;
              const iconName = SPECIALTY_ICONS[spec.id] || SPECIALTY_ICONS[spec.icon] || 'stethoscope';
              return (
                <div 
                  key={spec.id} 
                  className={`specialty-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCardClick(spec.shortName)}
                  style={{ '--accent-color': spec.color, '--accent-tint': spec.bgTint }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(spec.shortName);
                    }
                  }}
                >
                  <div className="spec-card-top">
                    <div className="spec-icon-box">
                      <Icon name={iconName} className="spec-icon" />
                    </div>
                    <span className="spec-count-badge">
                      {spec.doctorCount} طبيب متاح
                    </span>
                  </div>

                  <div className="spec-card-body">
                    <h3 className="spec-title">{spec.name}</h3>
                    <p className="spec-desc">{spec.desc}</p>
                  </div>

                  <div className="spec-card-footer">
                    <span className="spec-action-link">
                      عرض الأطباء المتاحين
                      <span className="arrow-icon">←</span>
                    </span>
                    <span className="no-wait-pill">بدون انتظار <Icon name="zap" size={14} /></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Fast Search CTA */}
        <div className="specialties-footer-note">
          <Icon name="lightbulb" className="info-icon" />
          <span>لم تجد تخصصك المطلوب في القائمة؟ تصفح كافة التخصصات الإضافية من خلال مربع البحث في الأعلى أو اتصل بنا على <strong>16999</strong></span>
        </div>

      </div>
    </section>
  );
}
