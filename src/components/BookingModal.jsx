import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  Banknote, 
  Building2, 
  CalendarDays, 
  Check, 
  Clock3, 
  MapPin, 
  Zap 
} from 'lucide-react';

const DEFAULT_SLOTS = [
  '05:00 م',
  '05:30 م',
  '06:00 م',
  '06:30 م',
  '07:00 م',
  '07:30 م',
  '08:00 م',
  '08:30 م'
];

export default function BookingModal({ 
  isOpen, 
  doctor, 
  initialSlot = null,
  initialClinicId = null,
  currentUser = null,
  onClose, 
  onConfirmBooking,
  onToast 
}) {
  const [selectedClinicIndex, setSelectedClinicIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingType, setBookingType] = useState('كشف أول مرة');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clinics = useMemo(() => {
    if (!doctor) return [];
    if (Array.isArray(doctor.clinics) && doctor.clinics.length > 0) {
      return doctor.clinics.map((clinic, index) => ({
        ...clinic,
        id: clinic.id ?? `${doctor.id}-clinic-${index}`,
        name: clinic.name || clinic.hospital || `عيادة ${index + 1}`,
        shortLocation: clinic.shortLocation || clinic.city || `عيادة ${index + 1}`,
        location: clinic.location || doctor.location,
        city: clinic.city || doctor.city,
        price: doctor.price,
        days: clinic.days || 'يومياً بموعد مسبق',
        availableSlots: Array.isArray(clinic.availableSlots)
          ? clinic.availableSlots
          : DEFAULT_SLOTS
      }));
    }
    return [{
      id: `${doctor.id}-clinic`,
      name: doctor.hospital || 'العيادة الرئيسية',
      shortLocation: doctor.city || 'العيادة',
      location: doctor.location,
      city: doctor.city,
      price: doctor.price,
      days: 'يومياً بموعد مسبق',
      availableSlots: Array.isArray(doctor.availableSlots) && doctor.availableSlots.length > 0
        ? doctor.availableSlots
        : DEFAULT_SLOTS
    }];
  }, [doctor]);

  const activeClinic = clinics[selectedClinicIndex] || clinics[0];
  const activeSlots = activeClinic?.availableSlots || [];

  useEffect(() => {
    if (isOpen && clinics.length > 0) {
      setIsSuccess(false);
      setBookingResult(null);

      // Pre-fill user data if logged in
      if (currentUser) {
        setPatientName(currentUser.name || '');
        setPatientPhone(currentUser.phone || '');
      } else {
        setPatientName('');
        setPatientPhone('');
      }

      // Determine initial clinic index
      let targetIndex = -1;
      if (initialClinicId) {
        targetIndex = clinics.findIndex(c => c.id === initialClinicId);
      }
      if (targetIndex < 0 && initialSlot) {
        targetIndex = clinics.findIndex(c => Array.isArray(c.availableSlots) && c.availableSlots.includes(initialSlot));
      }
      const finalIndex = targetIndex >= 0 ? targetIndex : 0;
      setSelectedClinicIndex(finalIndex);

      const clinicSlots = clinics[finalIndex]?.availableSlots || [];
      if (initialSlot && clinicSlots.includes(initialSlot)) {
        setSelectedSlot(initialSlot);
      } else {
        setSelectedSlot(clinicSlots[0] || '');
      }
    }
  }, [isOpen, doctor, initialSlot, initialClinicId, currentUser, clinics]);

  if (!isOpen || !doctor) return null;

  const currentPrice = doctor.price;

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      onToast('يرجى ملء اسم المريض ورقم الهاتف لتأكيد الموعد', 'normal');
      return;
    }

    if (!selectedSlot) {
      onToast('يرجى اختيار توقيت الكشف المناسب في العيادة المحددة', 'normal');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onConfirmBooking({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorLocation: activeClinic?.location || doctor.location,
        clinicId: activeClinic?.id,
        clinicName: activeClinic?.name,
        price: currentPrice,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        day: 'اليوم',
        slot: selectedSlot,
        bookingType,
        notes: notes.trim()
      });

      setBookingResult(result);
      setIsSuccess(true);
      onToast(`تم تأكيد حجزك بنجاح بكود: ${result.bookingCode} في ${activeClinic?.name}!`, 'success');
    } catch (err) {
      onToast('حدث خطأ أثناء تأكيد الحجز، يرجى المحاولة مرة أخرى', 'normal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setBookingResult(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-dialog booking-modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header booking-modal-header">
          <div className="modal-title-wrap">
            <CalendarDays className="modal-icon" aria-hidden="true" />
            <div>
              <h3 className="modal-title">
                {isSuccess ? 'تأكيد الحجز الفوري' : 'حجز موعد كشف طبي'}
              </h3>
              <p className="modal-subtitle">
                {isSuccess ? 'بيانات التذكرة الطبية والموعد المؤكد' : 'اختر العيادة المناسبة لموقعك والوقت المحدد بدون أي دقيقة انتظار'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="إغلاق">&times;</button>
        </div>

        {/* Doctor Summary Bar */}
        <div className="booking-doctor-banner">
          <div className="booking-avatar-wrap" style={{ backgroundColor: doctor.avatarBg || '#183b2b' }}>
            <span>{doctor.initials}</span>
          </div>
          <div className="booking-doc-info">
            <h4 className="booking-doc-name">{doctor.name}</h4>
            <span className="booking-doc-spec">{doctor.specialty}</span>
            <div className="booking-doc-details">
              <span><MapPin size={14} aria-hidden="true" /> {activeClinic?.location || doctor.location}</span>
              <span className="dot-divider">•</span>
              <span><Banknote size={14} aria-hidden="true" /> {currentPrice} ج.م (الدفع داخل العيادة)</span>
            </div>
          </div>
        </div>

        {isSuccess && bookingResult ? (
          /* Success Screen */
          <div className="booking-success-box">
            <div className="success-badge-icon"><Check size={24} aria-hidden="true" /></div>
            <h3 className="success-title">تم تأكيد حجزك بنجاح!</h3>
            <p className="success-subtitle">
              تم تجهيز تأكيد حجزك الكامل لفتحه واستلامه عبر تطبيق واتساب على هاتفك: <strong>{bookingResult.patientPhone}</strong>
            </p>

            <div className="ticket-card">
              <div className="ticket-row">
                <span className="ticket-label">رقم كود التذكرة:</span>
                <span className="ticket-code">{bookingResult.bookingCode}</span>
              </div>
              <div className="ticket-divider"></div>
              <div className="ticket-grid">
                <div>
                  <span className="ticket-mini-label">اسم المريض</span>
                  <strong>{bookingResult.patientName}</strong>
                </div>
                <div>
                  <span className="ticket-mini-label">الطبيب</span>
                  <strong>{doctor.name}</strong>
                </div>
                <div>
                  <span className="ticket-mini-label">اليوم والوقت</span>
                  <strong className="text-forest">{bookingResult.day} - {bookingResult.slot}</strong>
                </div>
                <div>
                  <span className="ticket-mini-label">العيادة المحجوزة</span>
                  <strong>{bookingResult.clinicName}</strong>
                </div>
                <div>
                  <span className="ticket-mini-label">عنوان العيادة</span>
                  <strong>{bookingResult.doctorLocation}</strong>
                </div>
                <div>
                  <span className="ticket-mini-label">قيمة الكشف</span>
                  <strong>{bookingResult.price} ج.م (بالعيادة)</strong>
                </div>
              </div>
              <div className="ticket-alert">
                <Zap size={15} aria-hidden="true" /> <strong>تذكير مهم:</strong> حضورك قبل الميعاد بـ 5 دقائق يكفل لك الدخول فوراً بدون أي زحمة أو انتظار.
              </div>
            </div>

            {/* Functional WhatsApp Action */}
            <div className="ticket-whatsapp-action">
              <a 
                href={(() => {
                  let phone = (bookingResult.patientPhone || '').replace(/\D/g, '');
                  if (phone.startsWith('0')) {
                    phone = '2' + phone;
                  } else if (!phone.startsWith('2') && phone.length === 10) {
                    phone = '20' + phone;
                  }
                  const text = 
`🏥 *تأكيد حجز كشف طبي - منصة دكتورك*
══════════════════
🎫 *كود التذكرة:* ${bookingResult.bookingCode}
👤 *اسم المريض:* ${bookingResult.patientName}
👨‍⚕️ *الطبيب:* ${doctor.name} (${doctor.specialty})
🏢 *العيادة:* ${bookingResult.clinicName}
📍 *العنوان:* ${bookingResult.doctorLocation}
📅 *الموعد:* ${bookingResult.day} - الساعة ${bookingResult.slot}
💰 *سعر الكشف:* ${bookingResult.price} ج.م (الدفع داخل العيادة)
══════════════════
⚡ *تنبيه:* يرجى الحضور قبل الموعد بـ 5 دقائق للدخول فوراً بدون أي انتظار.`;
                  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
                })()}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-whatsapp-direct"
                id="whatsapp-confirm-link"
              >
                <svg className="wa-icon-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.09c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.12.82.83-3.04-.2-.32a8.03 8.03 0 0 1-1.23-4.28c0-4.47 3.64-8.11 8.13-8.11 2.17 0 4.21.85 5.74 2.38s2.38 3.57 2.38 5.74c0 4.48-3.64 8.11-8.12 8.11zm4.46-6.07c-.24-.12-1.45-.71-1.67-.79-.23-.09-.39-.12-.56.12-.17.24-.65.79-.8 1-.15.2-.29.24-.54.12-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.15-.24-.02-.37.1-.49.11-.11.24-.29.37-.43.12-.15.17-.24.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.24-.88.86-.88 2.09s.9 2.43 1.03 2.6c.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.45-.59 1.66-1.17.2-.57.2-1.07.14-1.17-.06-.1-.23-.16-.48-.28z"/>
                </svg>
                <span>فتح التذكرة وتأكيدها عبر واتساب</span>
              </a>
              <span className="wa-help-text">
                اضغط للفتح المباشر في واتساب وحفظ كود التذكرة وعنوان العيادة على هاتفك
              </span>
            </div>

            <button type="button" className="btn btn-outline w-100" onClick={handleClose} style={{ height: '46px', fontSize: '15px' }}>
              تم، العودة للصفحة الرئيسية
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form className="modal-body booking-modal-body" onSubmit={handleConfirm}>
            
            {/* Step 1: Choose Clinic Suitable for Location */}
            <div className="form-group">
              <label className="form-label">
                <span className="step-num">1</span>
                <span>اختر العيادة الأنسب لموقعك ({clinics.length} عيادات متاحة للطبيب):</span>
              </label>
              <div className="booking-clinics-grid">
                {clinics.map((clinic, index) => {
                  const isSelected = selectedClinicIndex === index;
                  return (
                    <button
                      key={clinic.id}
                      type="button"
                      className={`booking-clinic-card ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedClinicIndex(index);
                        setSelectedSlot(clinic.availableSlots[0] || '');
                      }}
                    >
                      <div className="modal-clinic-card-top">
                        <Building2 size={15} className="clinic-modal-icon" aria-hidden="true" />
                        <strong className="modal-clinic-name">{clinic.name}</strong>
                        {isSelected && <span className="modal-clinic-check"><Check size={13} /></span>}
                      </div>

                      <div className="modal-clinic-loc">
                        <MapPin size={13} aria-hidden="true" />
                        <span>{clinic.location}</span>
                      </div>

                      {clinic.days && (
                        <div className="modal-clinic-days">
                          <CalendarDays size={12} aria-hidden="true" />
                          <span>{clinic.days}</span>
                        </div>
                      )}

                      <div className="modal-clinic-bottom">
                        <span className="modal-slots-count">
                          {clinic.availableSlots.length} مواعيد متاحة
                        </span>
                        <span className="modal-clinic-price">{clinic.price} ج.م</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Slot for Selected Clinic */}
            <div className="form-group">
              <label className="form-label">
                <span className="step-num">2</span>
                <span>المواعيد المتاحة في ({activeClinic?.shortLocation || activeClinic?.name}):</span>
              </label>
              {activeSlots.length === 0 ? (
                <div className="no-slots-alert">
                  <AlertTriangle size={16} aria-hidden="true" /> لا توجد مواعيد متاحة في هذه العيادة حاليًا، يرجى اختيار عيادة أخرى من الخطوة 1 أعلاه.
                </div>
              ) : (
                <div className="time-slots-grid">
                  {activeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-btn ${selectedSlot === slot ? 'active' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <Clock3 size={12} className="inline-slot-icon" aria-hidden="true" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Patient Information */}
            <div className="form-group">
              <label className="form-label">
                <span className="step-num">3</span>
                <span>بيانات المريض</span>
              </label>

              <div className="form-row-2">
                <div className="input-with-label">
                  <span className="mini-label">اسم المريض الثلاثي *</span>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="مثال: محمد أحمد علي"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div className="input-with-label">
                  <span className="mini-label">رقم الهاتف للتأكيد (واتساب) *</span>
                  <input 
                    type="tel" 
                    className="form-control"
                    placeholder="01xxxxxxxxx"
                    required
                    dir="ltr"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Booking Type & Notes */}
            <div className="form-group">
              <div className="form-row-2">
                <div className="input-with-label">
                  <span className="mini-label">نوع الحجز</span>
                  <select 
                    className="form-control"
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                  >
                    <option value="كشف أول مرة">كشف عيادة أول مرة</option>
                    <option value="استشارة / متابعة">استشارة / متابعة كشف</option>
                    <option value="فحص شامل">فحص شامل وتحاليل</option>
                  </select>
                </div>

                <div className="input-with-label">
                  <span className="mini-label">ملاحظات للأخصائي (اختياري)</span>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="مثل: أعراض معينة أو تحاليل سابقة..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Booking Summary Box */}
            <div className="booking-summary-strip">
              <div className="summary-col">
                <span className="summary-title">العيادة والميعاد:</span>
                <span className="summary-val">{activeClinic?.name} - {selectedSlot || 'يرجى اختيار موعد'}</span>
              </div>
              <div className="summary-col">
                <span className="summary-title">إجمالي الكشف:</span>
                <span className="summary-val price-highlight">{currentPrice} جنيه (بالعيادة)</span>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="booking-actions">
              <button type="button" className="btn btn-outline" onClick={handleClose}>
                إلغاء
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-confirm-booking"
                disabled={isSubmitting || !selectedSlot}
              >
                {isSubmitting ? 'جارِ تأكيد الموعد...' : <>تأكيد الحجز فوراً بدون زحمة <Check size={16} aria-hidden="true" /></>}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
