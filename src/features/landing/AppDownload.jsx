import React from 'react';
import Icon from '@/components/ui/Icon';

export default function AppDownload({ onToast }) {
  const handleStoreClick = (storeName) => {
    onToast(`جارِ توجيهك لتحميل تطبيق حجز الأطباء على ${storeName}... قريباً متاح بالمتجر!`, 'normal');
  };

  return (
    <section className="app-download-section" id="mobile-app">
      <div className="section-container">
        
        <div className="download-banner-card">
          
          <div className="download-content">
            <div className="download-badge">
              <span><Icon name="smartphone" size={16} /> تطبيق دكتورك للهواتف الذكية</span>
            </div>
            
            <h2 className="download-title">
              احجز موعدك وتواصل مع طبيبك <br />
              <span className="highlight-text-orange">مباشرة من هاتفك في أي وقت</span>
            </h2>

            <p className="download-desc">
              حمّل تطبيق حجز الأطباء المجاني لتلقي إشعارات المواعيد، حفظ الروشتات والتحاليل الطبية في ملفك الصحي الموحد، وتعديل حجزك بسهولة تامة.
            </p>

            <div className="download-buttons-group">
              <button 
                type="button" 
                className="store-btn"
                onClick={() => handleStoreClick('App Store (iOS)')}
              >
                <Icon name="apple" className="store-icon" />
                <div className="store-text">
                  <span className="store-small">متوفر على</span>
                  <span className="store-brand">App Store</span>
                </div>
              </button>

              <button 
                type="button" 
                className="store-btn"
                onClick={() => handleStoreClick('Google Play (Android)')}
              >
                <Icon name="googleplay" className="store-icon" />
                <div className="store-text">
                  <span className="store-small">متوفر على</span>
                  <span className="store-brand">Google Play</span>
                </div>
              </button>

            </div>

            <div className="download-perks">
              <div className="perk-item">
                <span className="perk-check"><Icon name="check" size={14} /></span>
                <span>تطبيق خفيف وسريع</span>
              </div>
              <div className="perk-item">
                <span className="perk-check"><Icon name="check" size={14} /></span>
                <span>حفظ تاريخك الطبي وروشتاتك</span>
              </div>
              <div className="perk-item">
                <span className="perk-check"><Icon name="check" size={14} /></span>
                <span>دعم مباشر 24/7</span>
              </div>
            </div>
          </div>

          <div className="download-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="mock-app-header">
                  <div className="mock-logo">د</div>
                  <span>حجز الأطباء - تطبيق المريض</span>
                </div>
                <div className="mock-notification">
                  <Icon name="bell" className="mock-notif-icon" />
                  <div>
                    <strong>موعدك اليوم مع د. أحمد منصور</strong>
                    <p>الساعة 06:00 م - العيادة بانتظارك فوراً</p>
                  </div>
                </div>
                <div className="mock-card">
                  <div className="mock-card-header">
                    <span>كود الدخول السريع</span>
                    <span className="mock-qr">#DOC-8492</span>
                  </div>
                  <div className="mock-status">
                    <span className="status-dot"></span>
                    <span>الدخول متاح الآن بدون انتظار</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
