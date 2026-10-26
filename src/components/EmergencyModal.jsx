import React, { useState } from 'react';
import { Siren, Zap } from 'lucide-react';

export default function EmergencyModal({ 
  isOpen, 
  onClose, 
  onToast,
  emergencyDoctorsCount = 14,
  onRequestEmergency 
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: 'طوارئ عامة وباطنة'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      onToast('يرجى ملء جميع الحقول المطلوبة', 'normal');
      return;
    }

    setIsSubmitting(true);
    if (onRequestEmergency) {
      await onRequestEmergency(formData);
    }
    setIsSubmitting(false);

    onClose();
    onToast(`تم استقبال طلب الطوارئ لـ ${formData.name}. سيتم الاتصال بك فوراً خلال 3 دقائق!`, 'emergency');
    setFormData({ name: '', phone: '', specialty: 'طوارئ عامة وباطنة' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header emergency-modal-header">
          <div className="modal-title-wrap">
            <Siren className="modal-icon" aria-hidden="true" />
            <div>
              <h3 className="modal-title">حجز طوارئ فوري</h3>
              <p className="modal-subtitle">
                {emergencyDoctorsCount} طبيب استشاري متاحون حالياً للحالات العاجلة
              </p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">&times;</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">اسم المريض الكامل</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="أدخل اسم المريض..." 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">رقم الهاتف للتواصل الفوري</label>
            <input 
              type="tel" 
              className="form-control" 
              placeholder="01xxxxxxxxx" 
              dir="ltr"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">نوع الحالة أو التخصص العاجل</label>
            <select 
              className="form-control"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            >
              <option value="طوارئ عامة وباطنة">طوارئ عامة وباطنة</option>
              <option value="ألم صدر أو قلب عاجل">ألم صدر أو اشتباه قلب</option>
              <option value="طوارئ أطفال وسخونة">طوارئ أطفال وارتفاع حرارة</option>
              <option value="إصابات وكسور عظام">كسور وإصابات عظام</option>
              <option value="ألم أسنان حاد">ألم أسنان حاد</option>
            </select>
          </div>

          <div className="emergency-notice-card">
            <span><Zap size={15} aria-hidden="true" /> سيتم توجيه أقرب طبيب أو إرسال الإسعاف لك على الفور. الخدمة تعمل 24/7.</span>
          </div>

          <button 
            type="submit" 
            className="btn btn-emergency-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'جارِ الإرسال...'
            ) : (
              <>
                <Siren className="emergency-submit-icon" aria-hidden="true" />
                <span>تأكيد طلب الطوارئ فوراً</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
