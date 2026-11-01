 import React from 'react';
import { CalendarDays, DoorOpen, MessageCircle, Search, Zap } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'ابحث عن تخصصك أو طبيبك',
    desc: 'ابحث بالاسم، التخصص الطبي، أو منطقتك السكنية وتصفح ملفات الأطباء وسنوات خبرتهم.',
    badge: 'خطوة سريعة'
  },
  {
    num: '02',
    icon: CalendarDays,
    title: 'اختر اليوم والموعد المناسب',
    desc: 'اطّلع على جدول المواعيد المتاحة بدقة، واختر التوقيت الذي يناسب جدولك اليومي.',
    badge: 'مرونة تامة'
  },
  {
    num: '03',
    icon: MessageCircle,
    title: 'استلم تأكيد الحجز فورياً',
    desc: 'يصلك كود الحجز وتفاصيل العنوان الدقيق عبر تطبيق واتساب فور تأكيد الطلب.',
    badge: 'مجاناً 100%'
  },
  {
    num: '04',
    icon: DoorOpen,
    title: 'ادخل الكشف في ميعادك',
    desc: 'توجّه للعيادة وادخل مباشرة لغرفة الطبيب دون الحاجة للجلوس في صالات الانتظار والزحمة.',
    badge: 'صفر انتظار'
  }
];

export default function HowItWorks() {
  const scrollToDoctors = () => {
    const el = document.getElementById('doctors');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header-center">
          <h2 className="section-main-title">
            كيف يعمل <span className="highlight-text">دكتورك؟</span>
          </h2>
          <p className="section-main-subtitle">
            خطوات بسيطة وسلسة تفصلك عن حجز موعدك الطبي والدخول فوراً بدون أي تعقيد أو انتظار.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-container">
          <div className="steps-grid">
            {STEPS.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-header">
                  <span className="step-number">{step.num}</span>
                  <div className="step-icon-bubble">
                    <step.icon className="step-icon" aria-hidden="true" />
                  </div>
                </div>

                <div className="step-body">
                  <span className="step-badge">
                    {step.badge}
                    {index === STEPS.length - 1 && <Zap size={14} aria-hidden="true" />}
                  </span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>

                {index < STEPS.length - 1 && (
                  <div className="step-connector-arrow" aria-hidden="true">
                    <span>←</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Callout */}
        <div className="how-cta-box">
          <div className="how-cta-text">
            <h3>جاهز لحجز موعدك الأول بدون أي انتظار؟</h3>
            <p>أكثر من 200 طبيب استشاري متاحون الآن ومستعدون لاستقبالك في عياداتهم.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={scrollToDoctors}>
            تصفح الأطباء واحجز الآن
          </button>
        </div>

      </div>
    </section>
  );
}
