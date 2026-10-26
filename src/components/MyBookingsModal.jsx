import React from 'react';
import { BadgeCheck, CalendarDays, MapPin, Stethoscope, Zap } from 'lucide-react';

export default function MyBookingsModal({ 
  isOpen, 
  onClose, 
  bookings, 
  onCancelBooking,
  onToast 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog my-bookings-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <CalendarDays className="modal-icon" aria-hidden="true" />
            <div>
              <h3 className="modal-title">حجوزاتي الطبية</h3>
              <p className="modal-subtitle">
                {bookings.length > 0 
                  ? `لديك ${bookings.length} موعد مؤكد في عيادات دكتورك` 
                  : 'لا توجد حجوزات نشطة حالياً'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">&times;</button>
        </div>

        {/* Body */}
        <div className="modal-body my-bookings-body">
          {bookings.length === 0 ? (
            <div className="empty-bookings-state">
              <Stethoscope className="empty-icon" aria-hidden="true" />
              <h4>لم تقم بحجز أي موعد حتى الآن</h4>
              <p>تصفح قائمة الأطباء والاستشاريين واحجز ميعادك في أقل من دقيقة بدون أي زحمة أو انتظار.</p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  const docEl = document.getElementById('doctors');
                  if (docEl) docEl.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                تصفح الأطباء المتاحين الآن
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card-item">
                  <div className="b-card-header">
                    <div className="b-code-badge">
                      <span>كود التذكرة:</span>
                      <strong>{booking.bookingCode}</strong>
                    </div>
                    <span className="b-status-pill">{booking.status || 'مؤكد'} <BadgeCheck size={14} aria-hidden="true" /></span>
                  </div>

                  <div className="b-card-content">
                    <h4 className="b-doc-name">{booking.doctorName}</h4>
                    <p className="b-doc-spec">{booking.doctorSpecialty}</p>
                    <p className="b-doc-loc"><MapPin size={14} aria-hidden="true" /> {booking.doctorLocation}</p>
                    
                    <div className="b-meta-grid">
                      <div className="b-meta-tile">
                        <span className="tile-label">الموعد المحدد:</span>
                        <span className="tile-value">{booking.day} ({booking.slot})</span>
                      </div>
                      <div className="b-meta-tile">
                        <span className="tile-label">المريض:</span>
                        <span className="tile-value">{booking.patientName}</span>
                      </div>
                      <div className="b-meta-tile">
                        <span className="tile-label">قيمة الكشف:</span>
                        <span className="tile-value price">{booking.price} جنيه (بالعيادة)</span>
                      </div>
                      <div className="b-meta-tile">
                        <span className="tile-label">نوع الحجز:</span>
                        <span className="tile-value">{booking.bookingType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="b-card-footer">
                    <span className="no-wait-note"><Zap size={14} aria-hidden="true" /> دخول فوري بدون انتظار</span>
                    <button 
                      type="button" 
                      className="btn-cancel-booking"
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من رغبتك في إلغاء حجز ${booking.doctorName}؟`)) {
                          onCancelBooking(booking.id);
                          onToast(`تم إلغاء الحجز (${booking.bookingCode}) بنجاح. يمكنك الحجز مجدداً في أي وقت.`, 'normal');
                        }
                      }}
                    >
                      إلغاء الموعد
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
