import React, { useState, useEffect } from 'react';
import { AlertTriangle, Banknote, CalendarDays, Check, MapPin, Zap } from 'lucide-react';

const DAYS = [
  { id: 'today', label: 'اليوم', sub: 'متاح الآن' },
  { id: 'tomorrow', label: 'غداً', sub: 'مواعيد مسائية' },
  { id: 'after', label: 'بعد غد', sub: 'مواعيد متنوعة' }
];

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
  currentUser = null,
  onClose, 
  onConfirmBooking,
  onToast 
}) {
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingType, setBookingType] = useState('كشف أول مرة');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available slots for this specific doctor
  const activeSlots = (doctor && Array.isArray(doctor.availableSlots) && doctor.availableSlots.length > 0)
    ? doctor.availableSlots
    : DEFAULT_SLOTS;

  useEffect(() => {
    if (isOpen) {
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
      // Pre-select slot
      if (initialSlot && activeSlots.includes(initialSlot)) {
        setSelectedSlot(initialSlot);
      } else {
        setSelectedSlot(activeSlots[0] || '06:00 م');
      }
    }
  }, [isOpen, doctor, initialSlot, currentUser]);

  if (!isOpen || !doctor) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      onToast('يرجى ملء اسم المريض ورقم الهاتف لتأكيد الموعد', 'normal');
      return;
    }

    if (!selectedSlot) {
      onToast('يرجى اختيار توقيت الكشف المناسب', 'normal');
      return;
    }

    setIsSubmitting(true);
    const dayLabel = selectedDay === 'today' ? 'اليوم' : selectedDay === 'tomorrow' ? 'غداً' : 'بعد غد';
    
    try {
      const result = await onConfirmBooking({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorLocation: doctor.location,
        price: doctor.price,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        day: dayLabel,
        slot: selectedSlot,
        bookingType,
        notes: notes.trim()
      });

      setBookingResult(result);
      setIsSuccess(true);
      onToast(`تم تأكيد حجزك بنجاح بكود: ${result.bookingCode} مع ${doctor.name}!`, 'success');
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

  const dayLabel = selectedDay === 'today' ? 'اليوم' : selectedDay === 'tomorrow' ? 'غداً' : 'بعد غد';

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-dialog booking-modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header booking-modal-header">
          <div className="modal-title-wrap">
            <CalendarDays className="modal-icon" aria-hidden="true" />
            <div>
              <h3 className="modal-title">
                {isSuccess ? 'تأكيد الحجز الفوري' : `حجز موعد كشف طبي`}
              </h3>
              <p className="modal-subtitle">
                {isSuccess ? 'بيانات التذكرة الطبية والموعد المؤكد' : `احجز في ثوانٍ بدون أي رسوم مسبقة وبدون أي دقيقة انتظار`}
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
              <span><MapPin size={14} aria-hidden="true" /> {doctor.location}</span>
              <span className="dot-divider">•</span>
              <span><Banknote size={14} aria-hidden="true" /> {doctor.price} ج.م (الدفع داخل العيادة)</span>
            </div>
          </div>
        </div>

        {isSuccess && bookingResult ? (
          /* Success Screen */
          <div className="booking-success-box">
            <div className="success-badge-icon"><Check size={24} aria-hidden="true" /></div>
            <h3 className="success-title">تم تأكيد حجزك بنجاح!</h3>
            <p className="success-subtitle">
              تم إرسال رسالة نصية SMS وتأكيد عبر واتساب إلى هاتفك ببيانات الموعد.
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
                  <span className="ticket-mini-label">قيمة الكشف</span>
                  <strong>{doctor.price} ج.م (بالعيادة)</strong>
                </div>
              </div>
              <div className="ticket-alert">
                <Zap size={15} aria-hidden="true" /> <strong>تذكير مهم:</strong> حضورك قبل الميعاد بـ 5 دقائق يكفل لك الدخول فوراً بدون أي زحمة أو انتظار.
              </div>
            </div>

            <button type="button" className="btn btn-primary w-100" onClick={handleClose} style={{ height: '48px', fontSize: '16px' }}>
              تم، العودة للصفحة الرئيسية
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form className="modal-body booking-modal-body" onSubmit={handleConfirm}>
            
            {/* Step 1: Choose Day */}
            <div className="form-group">
              <label className="form-label">
                <span className="step-num">1</span>
                <span>اختر يوم الكشف</span>
              </label>
              <div className="day-picker-grid">
                {DAYS.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    className={`day-card ${selectedDay === day.id ? 'active' : ''}`}
                    onClick={() => setSelectedDay(day.id)}
                  >
                    <span className="day-name">{day.label}</span>
                    <span className="day-sub">{day.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Slot */}
            <div className="form-group">
              <label className="form-label">
                <span className="step-num">2</span>
                <span>اختر الوقت المحدد (دخول بالدقيقة بدون انتظار)</span>
              </label>
              {activeSlots.length === 0 ? (
                <div className="no-slots-alert">
                  <AlertTriangle size={16} aria-hidden="true" /> اكتملت كافة مواعيد هذا اليوم. يمكنك اختيار يوم آخر للحجز.
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
                      {slot}
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
                <span className="summary-title">الميعاد المحدد:</span>
                <span className="summary-val">{dayLabel} - {selectedSlot || 'غير محدد'}</span>
              </div>
              <div className="summary-col">
                <span className="summary-title">إجمالي الكشف:</span>
                <span className="summary-val price-highlight">{doctor.price} جنيه (بالعيادة)</span>
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
