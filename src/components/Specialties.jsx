import React from 'react';
import { Baby, Bone, Brain, Eye, HeartPulse, Lightbulb, Sparkles, Stethoscope, Smile, Zap } from 'lucide-react';

const SPECIALTY_ICONS = {
  cardiology: HeartPulse,
  dermatology: Sparkles,
  pediatrics: Baby,
  orthopedics: Bone,
  dentistry: Smile,
  internal: Stethoscope,
  ophthalmology: Eye,
  neurology: Brain,
  heart: HeartPulse,
  sparkles: Sparkles,
  baby: Baby,
  bone: Bone,
  tooth: Smile,
  stethoscope: Stethoscope,
  eye: Eye,
  brain: Brain
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
              const SpecialtyIcon = SPECIALTY_ICONS[spec.id] || SPECIALTY_ICONS[spec.icon] || Stethoscope;
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
                      <SpecialtyIcon className="spec-icon" aria-hidden="true" />
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
                    <span className="no-wait-pill">بدون انتظار <Zap size={14} aria-hidden="true" /></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Fast Search CTA */}
        <div className="specialties-footer-note">
          <Lightbulb className="info-icon" aria-hidden="true" />
          <span>لم تجد تخصصك المطلوب في القائمة؟ تصفح كافة التخصصات الإضافية من خلال مربع البحث في الأعلى أو اتصل بنا على <strong>16999</strong></span>
        </div>

      </div>
    </section>
  );
}
