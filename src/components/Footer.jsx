import React from 'react';
import Icon from './ui/Icon';

export default function Footer({ onOpenAuth, onOpenEmergency, onSelectSpecialty }) {
  const handleSpecClick = (specName, e) => {
    e.preventDefault();
    onSelectSpecialty(specName);
    const docSection = document.getElementById('doctors');
    if (docSection) {
      docSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      
      {/* Emergency Strip on top of footer */}
      <div className="footer-emergency-strip">
        <div className="footer-container strip-container">
          <div className="strip-info">
            <Icon name="siren" className="strip-siren" />
            <div>
              <strong>تحتاج استشارة أو رعاية عاجلة في الحال؟</strong>
              <p>طواقم الطوارئ وأطباء الرعاية الفورية متاحون 24 ساعة طوال أيام الأسبوع</p>
            </div>
          </div>
          <div className="strip-actions">
            <a href="tel:16999" className="hotline-btn">
              <span><Icon name="phone" size={15} /> اتصل بالخط الساخن:</span>
              <strong>16999</strong>
            </a>
            <button 
              type="button" 
              className="btn btn-emergency-cta"
              onClick={onOpenEmergency}
            >
              حجز طوارئ أونلاين
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            
            {/* Column 1: Brand Info */}
            <div className="footer-col brand-col">
              <a href="#" className="brand-logo footer-logo">
                <div className="logo-icon"><span>د</span></div>
                <div className="brand-text-group">
                  <span className="brand-name">دكتورك</span>
                  <span className="brand-divider">|</span>
                  <span className="brand-tagline">بدون زحمة</span>
                </div>
              </a>
              <p className="footer-about-text">
                أول منصة رقمية رائدة لحجز المواعيد الطبية المعتمدة في مصر والوطن العربي، بنظام دقيق يضمن دخولك في موعدك بالدقيقة بدون أي انتظار في العيادة.
              </p>
              
              <div className="footer-social-links">
                <a
                  href="https://www.facebook.com/ayman.mansour.31542841/?locale=ar_AR"
                  className="social-pill social-icon-link social-facebook"
                  aria-label="فيسبوك"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/Ayman%20Mansour/"
                  className="social-pill social-icon-link social-instagram"
                  aria-label="إنستغرام"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.7" cy="6.7" r="1.2" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/aymanmansournagy"
                  className="social-pill social-icon-link social-linkedin"
                  aria-label="لينكد إن"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.5 8.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM5 10h3v9H5v-9Zm5 0h2.9v1.2h.1a3.2 3.2 0 0 1 2.9-1.5c3.1 0 3.7 2 3.7 4.5V19h-3v-4.3c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3V19h-3v-9Z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">روابط سريعة</h4>
              <ul className="footer-links-list">
                <li><a href="#">الرئيسية</a></li>
                <li><a href="#specialties">التخصصات الطبية</a></li>
                <li><a href="#doctors">نخبة الأطباء</a></li>
                <li><a href="#how-it-works">كيف يعمل الحجز؟</a></li>
                <li><a href="#testimonials">آراء المرضى</a></li>
              </ul>
            </div>

            {/* Column 3: Medical Specialties */}
            <div className="footer-col">
              <h4 className="footer-col-title">أبرز التخصصات</h4>
              <ul className="footer-links-list">
                <li><a href="#doctors" onClick={(e) => handleSpecClick('قلب وأوعية دموية', e)}>أمراض القلب والأوعية</a></li>
                <li><a href="#doctors" onClick={(e) => handleSpecClick('جلدية وتجميل', e)}>جلدية وتجميل وليزر</a></li>
                <li><a href="#doctors" onClick={(e) => handleSpecClick('عظام ومفاصل', e)}>عظام ومفاصل ومناظير</a></li>
                <li><a href="#doctors" onClick={(e) => handleSpecClick('طب الأطفال', e)}>طب وجراحة الأطفال</a></li>
                <li><a href="#doctors" onClick={(e) => handleSpecClick('أسنان', e)}>طب وجراحة الأسنان</a></li>
                <li><a href="#doctors" onClick={(e) => handleSpecClick('باطنة عامة', e)}>باطنة وجهاز هضمي</a></li>
              </ul>
            </div>

            {/* Column 4: Doctors & Partners Portal */}
            <div className="footer-col doctor-join-col">
              <h4 className="footer-col-title">هل أنت طبيب أو مدير عيادة؟</h4>
              <p className="footer-join-text">
                انضم لأكثر من 200 طبيب متميز في شبكة دكتورك، نظّم مواعيد مرضاك باحترافية، واقضِ على الزحام في عيادتك.
              </p>
              <button 
                type="button" 
                className="btn btn-outline footer-join-btn"
                onClick={() => onOpenAuth('register')}
              >
                <span>انضم كطبيب الآن</span>
                <span className="arrow-left">←</span>
              </button>
              <div className="footer-contact-mini">
                <span>للاستفسارات الطبية:</span>
                <a
                  href="https://mail.google.com/mail/?view=cm&to=mansourayman146%40gmail.com"
                  target="_blank"
                  rel="noreferrer"
                  dir="ltr"
                >
                  mansourayman146@gmail.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="footer-bottom-bar">
        <div className="footer-container bottom-container">
          <p className="copyright-text">
            جميع الحقوق محفوظة © 2026 منصة دكتورك الطبية | رعاية صحية رقمية متكاملة.
          </p>
          <div className="bottom-policy-links">
            <a href="#terms">الشروط والأحكام</a>
            <span className="dot">•</span>
            <a href="#privacy">سياسة الخصوصية</a>
            <span className="dot">•</span>
            <a href="#faq">الأسئلة الشائعة</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
