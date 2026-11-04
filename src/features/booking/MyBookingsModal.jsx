import React from 'react';
import Icon from '@/components/ui/Icon';

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
            <Icon name="calendar" className="modal-icon" />
            <div>
              <h3 className="modal-title">حجوزاتي الطبية</h3>
              <p className="modal-subtitle">
                {bookings.length > 0 
                  ? `لديك ${bookings.length} موعد مؤكد عبر حجز الأطباء` 
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
              <Icon name="stethoscope" className="empty-icon" />
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
                    <span className="b-status-pill">{booking.status || 'مؤكد'} <Icon name="check-circle" size={14} /></span>
                  </div>

                  <div className="b-card-content">
                    <h4 className="b-doc-name">{booking.doctorName}</h4>
                    <p className="b-doc-spec">{booking.doctorSpecialty}</p>
                    <p className="b-doc-loc"><Icon name="pin" size={14} /> {booking.doctorLocation}</p>
                    
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
                    <span className="no-wait-note"><Icon name="zap" size={14} /> دخول فوري بدون انتظار</span>
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
