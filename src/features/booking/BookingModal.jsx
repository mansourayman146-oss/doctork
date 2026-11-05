import './BookingModal.css';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Icon from '@/components/ui/Icon';
import { DEFAULT_SLOTS } from '@/lib/constants';
import { isValidName, isValidEgyptianPhone, generateWhatsAppUrl } from './validate';

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

function isClinicWorkingOnDay(clinicDays, dayName) {
  if (!clinicDays) return true;
  if (clinicDays.includes('يومياً')) {
    if (clinicDays.includes('عدا الجمعة') && dayName === 'الجمعة') return false;
    return true;
  }
  return clinicDays.includes(dayName);
}

function generateUpcomingDays(clinicDays, maxWorkingDays = 12) {
  const list = [];
  const now = new Date();
  let dayOffset = 0;
  // Look ahead up to 60 days to collect only available working dates
  while (list.length < maxWorkingDays && dayOffset < 60) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
    const dayName = ARABIC_DAYS[d.getDay()];
    const isWorking = isClinicWorkingOnDay(clinicDays, dayName);

    if (isWorking) {
      const dayNumber = d.getDate();
      const monthName = ARABIC_MONTHS[d.getMonth()];
      const year = d.getFullYear();
      const isoDate = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

      let quickName = '';
      if (dayOffset === 0) quickName = 'اليوم';
      else if (dayOffset === 1) quickName = 'غداً';
      else if (dayOffset === 2) quickName = 'بعد غد';

      const fullLabel = dayOffset === 0 
        ? `اليوم (${dayName} ${dayNumber} ${monthName})`
        : (dayOffset === 1 
          ? `غداً (${dayName} ${dayNumber} ${monthName})` 
          : `${dayName} ${dayNumber} ${monthName}`);

      list.push({
        index: list.length,
        dayOffset,
        isoDate,
        dayName,
        dayNumber,
        monthName,
        year,
        quickName,
        fullLabel,
        isWorkingDay: true
      });
    }

    dayOffset++;
  }
  return list;
}

/**
 * Doctor Avatar within Booking Modal Header Banner
 */
function ModalDoctorAvatar({ doctor }) {
  const [imgError, setImgError] = useState(false);
  const showImg = Boolean(doctor?.image && !imgError);

  return (
    <div 
      className="booking-avatar-wrap" 
      style={{ backgroundColor: doctor?.avatarBg || '#183b2b' }}
    >
      {showImg ? (
        <img
          src={doctor.image}
          alt={doctor.name}
          className="booking-avatar-img"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{doctor?.initials}</span>
      )}
    </div>
  );
}

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
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClinicIndex, setSelectedClinicIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDay, setSelectedDay] = useState('اليوم');
  const [selectedDateIso, setSelectedDateIso] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });
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

  const upcomingDays = useMemo(() => generateUpcomingDays(activeClinic?.days), [activeClinic?.days]);

  // Track open transition and doctor changes to initialize wizard once per session
  const prevIsOpenRef = useRef(false);
  const prevDocIdRef = useRef(null);

  useEffect(() => {
    const justOpened = isOpen && !prevIsOpenRef.current;
    const docChanged = isOpen && doctor?.id !== prevDocIdRef.current;

    if (justOpened || docChanged) {
      setIsSuccess(false);
      setBookingResult(null);
      setCurrentStep(1);

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

      const chosenClinic = clinics[finalIndex] || clinics[0];
      const initialDays = generateUpcomingDays(chosenClinic?.days);
      if (initialDays.length > 0) {
        setSelectedDateIso(initialDays[0].isoDate);
        setSelectedDay(initialDays[0].fullLabel);
      }
      const clinicSlots = chosenClinic?.availableSlots || [];
      setSelectedSlot(initialSlot && clinicSlots.includes(initialSlot) ? initialSlot : (clinicSlots[0] || ''));
    }

    prevIsOpenRef.current = isOpen;
    prevDocIdRef.current = doctor?.id || null;
  }, [isOpen, doctor?.id, initialClinicId, initialSlot, currentUser, clinics]);

  // Direct clinic selection handler without reset loops
  const handleSelectClinic = (index) => {
    setSelectedClinicIndex(index);
    const chosenClinic = clinics[index];
    if (chosenClinic) {
      const days = generateUpcomingDays(chosenClinic.days);
      if (days.length > 0) {
        setSelectedDateIso(days[0].isoDate);
        setSelectedDay(days[0].fullLabel);
      }
      const slots = chosenClinic.availableSlots || [];
      setSelectedSlot(slots[0] || '');
    }
  };

  // Verify if the currently selected date is an official working day for the active clinic
  const isSelectedDateWorking = useMemo(() => {
    if (!selectedDateIso) return true;
    const [y, m, dNum] = selectedDateIso.split('-').map(Number);
    const dObj = new Date(y, m - 1, dNum);
    const dName = ARABIC_DAYS[dObj.getDay()];
    return isClinicWorkingOnDay(activeClinic?.days, dName);
  }, [selectedDateIso, activeClinic?.days]);

  // Handle custom date selection from HTML5 date picker
  const handleCustomDateChange = (val) => {
    if (!val) return;
    setSelectedDateIso(val);
    const [y, m, dNum] = val.split('-').map(Number);
    const dObj = new Date(y, m - 1, dNum);
    const dName = ARABIC_DAYS[dObj.getDay()];
    const mName = ARABIC_MONTHS[dObj.getMonth()];
    setSelectedDay(`${dName} ${dNum} ${mName} ${y}`);
  };

  if (!isOpen || !doctor) return null;

  const currentPrice = doctor.price;

  const handleNextFromLocation = () => {
    if (!activeClinic) {
      onToast('يرجى اختيار العيادة أولاً للمتابعة', 'normal');
      return;
    }
    // Set first available slot if not selected
    if (!selectedSlot && activeSlots.length > 0) {
      setSelectedSlot(activeSlots[0]);
    }
    setCurrentStep(2);
  };

  const handleNextFromSlot = () => {
    if (!isSelectedDateWorking) {
      onToast(`عذراً، هذا اليوم (${selectedDay.split(' ')[0]}) غير متاح للحجز في هذه العيادة. أيام العمل هي: ${activeClinic?.days || 'يومياً'}`, 'normal');
      return;
    }
    if (!selectedSlot) {
      onToast('يرجى اختيار توقيت الكشف المناسب للمتابعة', 'normal');
      return;
    }
    setCurrentStep(3);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isSelectedDateWorking) {
      onToast(`لا يمكن تأكيد الحجز في يوم عطلة. أيام العمل المعتمدة للعيادة: ${activeClinic?.days}`, 'normal');
      return;
    }
    if (!patientName.trim() || !patientPhone.trim()) {
      onToast('يرجى ملء اسم المريض ورقم الهاتف لتأكيد الموعد', 'normal');
      return;
    }

    if (!isValidName(patientName)) {
      onToast('يرجى إدخال اسم صحيح لا يقل عن 3 أحرف', 'normal');
      return;
    }

    if (!isValidEgyptianPhone(patientPhone)) {
      onToast('يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)', 'normal');
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
        day: selectedDay,
        slot: selectedSlot,
        bookingType,
        notes: notes.trim()
      });

      setBookingResult(result);
      setIsSuccess(true);
      onToast(`تم تأكيد حجزك بنجاح بكود: ${result.bookingCode} في ${activeClinic?.name}!`, 'success');
    } catch {
      onToast('حدث خطأ أثناء تأكيد الحجز، يرجى المحاولة مرة أخرى', 'normal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setBookingResult(null);
    setCurrentStep(1);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-dialog booking-modal-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header booking-modal-header">
          <div className="modal-title-wrap">
            <Icon name="calendar" className="modal-icon" />
            <div>
              <h3 className="modal-title">
                {isSuccess ? 'تأكيد الحجز الفوري' : 'حجز موعد كشف طبي'}
              </h3>
              <p className="modal-subtitle">
                {isSuccess 
                  ? 'بيانات التذكرة الطبية والموعد المؤكد' 
                  : 'احجز موعدك بسهولة في 3 خطوات سريعة بدون أي انتظار'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="إغلاق">&times;</button>
        </div>

        {/* Doctor Summary Bar */}
        <div className="booking-doctor-banner">
          <ModalDoctorAvatar doctor={doctor} />
          <div className="booking-doc-info">
            <h4 className="booking-doc-name">{doctor.name}</h4>
            <span className="booking-doc-spec">{doctor.specialty}</span>
            <div className="booking-doc-details">
              <span><Icon name="pin" size={13} /> {activeClinic?.shortLocation || doctor.location}</span>
              <span className="dot-divider">•</span>
              <span><Icon name="money" size={13} /> {currentPrice} ج.م (الدفع داخل العيادة)</span>
            </div>
          </div>
        </div>

        {isSuccess && bookingResult ? (
          /* Success Screen */
          <div className="booking-success-box">
            <div className="success-badge-icon"><Icon name="check" size={24} /></div>
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
                <Icon name="zap" size={15} /> <strong>تذكير مهم:</strong> حضورك قبل الميعاد بـ 5 دقائق يكفل لك الدخول فوراً بدون أي زحمة أو انتظار.
              </div>
            </div>

            {/* Functional WhatsApp Action */}
            <div className="ticket-whatsapp-action">
              <a 
                href={(() => {
                  const text = 
`🏥 *تأكيد حجز كشف طبي - منصة حجز الأطباء*
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
                  return generateWhatsAppUrl(bookingResult.patientPhone, text);
                })()}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-whatsapp-direct"
                id="whatsapp-confirm-link"
              >
                <Icon name="whatsapp" size={20} className="wa-icon-svg" />
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
          /* Multi-Step Wizard Flow */
          <div className="booking-wizard">
            {/* Progress Indicator Stepper */}
            <div className="wizard-stepper" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax="3">
              <div 
                className={`wizard-step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
                onClick={() => currentStep > 1 && setCurrentStep(1)}
              >
                <div className="wizard-step-circle">
                  {currentStep > 1 ? <Icon name="check" size={13} /> : '1'}
                </div>
                <div className="wizard-step-meta">
                  <span className="wizard-step-num">الخطوة 1</span>
                  <span className="wizard-step-title">المكان والفرع</span>
                </div>
              </div>

              <div className={`wizard-stepper-line ${currentStep > 1 ? 'active' : ''}`}></div>

              <div 
                className={`wizard-step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
                onClick={() => currentStep > 2 && setCurrentStep(2)}
              >
                <div className="wizard-step-circle">
                  {currentStep > 2 ? <Icon name="check" size={13} /> : '2'}
                </div>
                <div className="wizard-step-meta">
                  <span className="wizard-step-num">الخطوة 2</span>
                  <span className="wizard-step-title">الموعد والتوقيت</span>
                </div>
              </div>

              <div className={`wizard-stepper-line ${currentStep > 2 ? 'active' : ''}`}></div>

              <div className={`wizard-step-item ${currentStep === 3 ? 'active' : ''}`}>
                <div className="wizard-step-circle">
                  3
                </div>
                <div className="wizard-step-meta">
                  <span className="wizard-step-num">الخطوة 3</span>
                  <span className="wizard-step-title">تأكيد الحجز</span>
                </div>
              </div>
            </div>

            {/* STEP 1: CHOOSE LOCATION */}
            {currentStep === 1 && (
              <div className="wizard-step-card" id="booking-step-1">
                <div className="step-card-header">
                  <div className="step-title-row">
                    <span className="step-number-pill">1</span>
                    <div>
                      <h4 className="step-heading">اختر العيادة أو الفرع المناسب</h4>
                      <p className="step-instruction">
                        حدد مكان الكشف المناسب لموقعك لمشاهدة المواعيد المتاحة
                      </p>
                    </div>
                  </div>
                  <span className="step-count-badge">{clinics.length} فروع متاحة</span>
                </div>

                <div className="booking-clinics-grid">
                  {clinics.map((clinic, index) => {
                    const isSelected = selectedClinicIndex === index;
                    return (
                      <div
                        key={clinic.id}
                        role="button"
                        tabIndex={0}
                        className={`booking-clinic-card ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectClinic(index)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectClinic(index);
                          }
                        }}
                      >
                        <div className="modal-clinic-card-top">
                          <Icon name="building" size={16} className="clinic-modal-icon" />
                          <strong className="modal-clinic-name">{clinic.name}</strong>
                          <div className={`modal-clinic-radio ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Icon name="check" size={11} />}
                          </div>
                        </div>

                        <div className="modal-clinic-loc">
                          <Icon name="pin" size={13} />
                          <span>{clinic.location}</span>
                        </div>

                        {clinic.days && (
                          <div className="modal-clinic-days">
                            <Icon name="calendar" size={12} />
                            <span>أيام العمل: <strong>{clinic.days}</strong></span>
                          </div>
                        )}

                        <div className="modal-clinic-bottom">
                          <span className="modal-slots-count">
                            <Icon name="clock" size={11} /> {clinic.availableSlots.length} مواعيد متاحة
                          </span>
                          <span className="modal-clinic-price">{clinic.price} ج.م</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step 1 Actions */}
                <div className="wizard-actions">
                  <button type="button" className="btn btn-outline wizard-btn-cancel" onClick={handleClose}>
                    إلغاء
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary wizard-btn-next"
                    onClick={handleNextFromLocation}
                  >
                    <span>المتابعة لاختيار الموعد</span>
                    <Icon name="arrow-left" size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT DATE & TIME */}
            {currentStep === 2 && (
              <div className="wizard-step-card" id="booking-step-2">
                <div className="step-card-header">
                  <div className="step-title-row">
                    <span className="step-number-pill">2</span>
                    <div>
                      <h4 className="step-heading">اختر اليوم والموعد المناسب</h4>
                      <p className="step-instruction">
                        مواعيد مؤكدة بدون أي دقيقة انتظار بالعيادة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Location Summary Box */}
                <div className="selected-location-banner">
                  <div className="selected-location-content">
                    <Icon name="building" size={15} className="sel-loc-icon" />
                    <div>
                      <span className="sel-loc-label">العيادة المحددة:</span>
                      <strong className="sel-loc-name">{activeClinic?.name}</strong>
                      <span className="sel-loc-address"><Icon name="pin" size={11} /> {activeClinic?.location}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-change-step" 
                    onClick={() => setCurrentStep(1)}
                    title="تغيير العيادة أو الفرع"
                  >
                    <span>تغيير الفرع</span>
                    <Icon name="arrow-right" size={12} />
                  </button>
                </div>

                {/* Day & Full Schedule Selector */}
                <div className="form-group mb-3">
                  <div className="schedule-header-row">
                    <label className="form-label mb-0">اختر يوم وتاريخ الكشف:</label>
                    <span className="clinic-days-hint">
                      <Icon name="calendar" size={12} /> أيام عمل العيادة: <strong>{activeClinic?.days || 'يومياً'}</strong>
                    </span>
                  </div>

                  {/* Full Schedule Strip (Only Available Working Days with Dates) */}
                  <div className="schedule-strip-container">
                    <div className="schedule-strip-label">
                      <span>الأيام المتاحة للحجز في هذه العيادة بالتواريخ:</span>
                    </div>
                    <div className="schedule-days-scroll">
                      {upcomingDays.map((day) => {
                        const isSelected = selectedDateIso === day.isoDate;
                        return (
                          <button
                            key={day.isoDate}
                            type="button"
                            className={`schedule-day-card ${isSelected ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedDateIso(day.isoDate);
                              setSelectedDay(day.fullLabel);
                            }}
                            title={`${day.fullLabel} - موعد متاح بالعيادة`}
                          >
                            <span className="sched-day-name">
                              {day.quickName || day.dayName}
                            </span>
                            <span className="sched-date-num">{day.dayNumber}</span>
                            <span className="sched-month-name">{day.monthName}</span>
                            <span className="sched-status-dot open">متاح</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Custom Date Picker (Any future date) */}
                  <div className="custom-date-picker-row">
                    <div className="custom-date-input-wrap">
                      <label htmlFor="custom-booking-date" className="custom-date-label">
                        <Icon name="calendar" size={13} />
                        <span>أو حدد تاريخاً مخصصاً بعد أسبوع أو أكثر:</span>
                      </label>
                      <input
                        id="custom-booking-date"
                        type="date"
                        min={upcomingDays[0]?.isoDate}
                        value={selectedDateIso}
                        onChange={(e) => handleCustomDateChange(e.target.value)}
                        className={`form-control custom-date-input ${!isSelectedDateWorking ? 'input-error' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Day Availability Status & Warnings */}
                  {!isSelectedDateWorking ? (
                    <div className="day-unavailable-alert" role="alert">
                      <Icon name="alert" size={16} className="unavailable-alert-icon" />
                      <div className="unavailable-alert-body">
                        <strong>عذراً، هذا اليوم ({selectedDay.split(' ')[0]}) غير متاح للكشف بهذه العيادة!</strong>
                        <span>أيام العمل الرسمية لهذه العيادة هي: <strong>{activeClinic?.days || 'يومياً'}</strong>. يرجى اختيار أحد الأيام المتاحة أعلاه.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="selected-date-preview-pill">
                      <Icon name="check" size={13} className="text-forest" />
                      <span>الموعد المختار: <strong>{selectedDay}</strong> (متاح للحجز)</span>
                    </div>
                  )}
                </div>

                {/* Available Slots */}
                <div className="form-group">
                  <label className="form-label">
                    <span>التوقيت المناسب في ({activeClinic?.shortLocation || activeClinic?.name}):</span>
                    {isSelectedDateWorking && activeSlots.length > 0 && (
                      <span className="text-muted-small">({activeSlots.length} أوقات متوفرة)</span>
                    )}
                  </label>

                  {!isSelectedDateWorking ? (
                    <div className="day-unavailable-slots-box">
                      <Icon name="alert" size={24} className="box-alert-icon" />
                      <h4>العيادة مغلقة في هذا اليوم</h4>
                      <p>
                        لا تتوفر مواعيد للكشف في اليوم الذي حددته ({selectedDay.split(' ')[0]})، حيث أن أيام العمل المعتمدة للعيادة هي: <strong>{activeClinic?.days || 'يومياً'}</strong>.
                      </p>
                      {upcomingDays.length > 0 && (
                        <button 
                          type="button" 
                          className="btn btn-outline btn-sm btn-pick-first-available"
                          onClick={() => {
                            setSelectedDateIso(upcomingDays[0].isoDate);
                            setSelectedDay(upcomingDays[0].fullLabel);
                          }}
                        >
                          <Icon name="calendar" size={13} />
                          <span>التحويل لأقرب يوم متاح ({upcomingDays[0].fullLabel})</span>
                        </button>
                      )}
                    </div>
                  ) : activeSlots.length === 0 ? (
                    <div className="no-slots-alert">
                      <Icon name="alert" size={16} /> 
                      <div>
                        <strong>اكتملت مواعيد هذه العيادة حالياً.</strong>
                        <p>يمكنك الرجوع للخطوة 1 واختيار فرع آخر للطبيب.</p>
                      </div>
                      <button type="button" className="btn btn-outline btn-sm mt-2" onClick={() => setCurrentStep(1)}>
                        الرجوع لاختيار فرع آخر
                      </button>
                    </div>
                  ) : (
                    <div className="time-slots-grid">
                      {activeSlots.map((slot) => {
                        const isSlotSelected = selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            className={`slot-btn ${isSlotSelected ? 'active' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <Icon name="clock" size={13} className="inline-slot-icon" />
                            <span>{slot}</span>
                            {isSlotSelected && <Icon name="check" size={11} className="slot-check-icon" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Step 2 Actions */}
                <div className="wizard-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline wizard-btn-prev" 
                    onClick={() => setCurrentStep(1)}
                  >
                    <Icon name="arrow-right" size={14} />
                    <span>السابق</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary wizard-btn-next"
                    disabled={!isSelectedDateWorking || !selectedSlot}
                    onClick={handleNextFromSlot}
                    title={!isSelectedDateWorking ? 'اليوم المحدد غير متاح للحجز' : (!selectedSlot ? 'يرجى اختيار توقيت الكشف' : 'المتابعة لتأكيد البيانات')}
                  >
                    <span>{isSelectedDateWorking ? 'المتابعة لتأكيد البيانات' : 'اليوم المحدد مغلق'}</span>
                    <Icon name="arrow-left" size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ENTER DETAILS & CONFIRM */}
            {currentStep === 3 && (
              <form className="wizard-step-card" id="booking-step-3" onSubmit={handleConfirm}>
                <div className="step-card-header">
                  <div className="step-title-row">
                    <span className="step-number-pill">3</span>
                    <div>
                      <h4 className="step-heading">بيانات المريض وتأكيد الموعد</h4>
                      <p className="step-instruction">
                        أدخل بياناتك وسيصلك تأكيد الحجز الفوري وتذكرتك مباشرة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Full Booking Summary Card */}
                <div className="wizard-booking-summary">
                  <div className="summary-card-header">
                    <span className="summary-badge">ملخص الحجز</span>
                    <button 
                      type="button" 
                      className="summary-edit-btn" 
                      onClick={() => setCurrentStep(2)}
                      title="تعديل الموعد أو العيادة"
                    >
                      تعديل الموعد
                    </button>
                  </div>
                  <div className="summary-items-grid">
                    <div className="summary-item">
                      <span className="summary-label">العيادة والفرع:</span>
                      <strong>{activeClinic?.name} ({activeClinic?.shortLocation})</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">اليوم والتوقيت:</span>
                      <strong className="text-forest">{selectedDay} - الساعة {selectedSlot}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">الطبيب المعالج:</span>
                      <strong>{doctor.name} ({doctor.specialty})</strong>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">إجمالي الكشف:</span>
                      <strong className="price-tag">{currentPrice} ج.م (الدفع داخل العيادة)</strong>
                    </div>
                  </div>
                </div>

                {/* Booking Type */}
                <div className="form-group mb-3">
                  <label className="form-label">نوع الزيارة:</label>
                  <div className="booking-types-selector">
                    {['كشف أول مرة', 'استشارة ومتابعة', 'فحص مستعجل'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`booking-type-btn ${bookingType === type ? 'active' : ''}`}
                        onClick={() => setBookingType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient Information */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span>اسم المريض ثلاثي</span>
                      <span className="required-star">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="مثال: أحمد مصطفى كامل"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>رقم الهاتف (واتساب لتأكيد التذكرة)</span>
                      <span className="required-star">*</span>
                    </label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="01012345678"
                      dir="ltr"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">ملاحظات أو سبب الزيارة (اختياري)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="مثل: أعراض معينة أو استفسار للطبيب..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Step 3 Actions */}
                <div className="wizard-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline wizard-btn-prev" 
                    onClick={() => setCurrentStep(2)}
                    disabled={isSubmitting}
                  >
                    <Icon name="arrow-right" size={14} />
                    <span>السابق</span>
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-confirm-booking"
                    disabled={isSubmitting || !selectedSlot}
                  >
                    {isSubmitting ? (
                      'جارِ تأكيد الحجز...'
                    ) : (
                      <>
                        <span>تأكيد الحجز فوراً بدون انتظار</span>
                        <Icon name="check" size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
