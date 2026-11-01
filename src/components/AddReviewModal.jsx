import React, { useState } from 'react';
import Icon from './ui/Icon';

export default function AddReviewModal({ isOpen, onClose, onSubmitReview, onToast, doctors = [] }) {
  const [name, setName] = useState('');
  const [doctorVisited, setDoctorVisited] = useState('');
  const [stars, setStars] = useState(5);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('القاهرة');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      onToast('يرجى ملء الاسم وتفاصيل تجربتك', 'normal');
      return;
    }

    setIsSubmitting(true);
    await onSubmitReview({
      name,
      doctorVisited: doctorVisited || (doctors[0] ? `${doctors[0].name} (${doctors[0].specialtyFilter})` : 'طبيب استشاري في دكتورك'),
      stars: Number(stars),
      role: role.trim() || 'مريض معتمد',
      location: location.trim() || 'مصر',
      text
    });
    setIsSubmitting(false);
    onToast(`شكراً لك يا ${name}! تم نشر تقييمك بنجاح وسيظهر للمرضى الآخرين.`, 'success');
    setName('');
    setText('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog add-review-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Icon name="star" className="modal-icon" />
            <div>
              <h3 className="modal-title">أضف تقييمك وتجربتك</h3>
              <p className="modal-subtitle">رأيك يساعد آلاف المرضى في اختيار أفضل رعاية صحية</p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">&times;</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">اسمك الكريم</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="مثال: أحمد مصطفى" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">الطبيب الذي قمت بزيارته</label>
              <select 
                className="form-control"
                value={doctorVisited}
                onChange={(e) => setDoctorVisited(e.target.value)}
              >
                <option value="">-- اختر الطبيب --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={`${doc.name} (${doc.specialtyFilter})`}>
                    {doc.name} - {doc.specialtyFilter}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">التقييم العام</label>
              <div className="star-rating-selector">
                {[5, 4, 3, 2, 1].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`star-select-btn ${stars >= s ? 'selected' : ''}`}
                    onClick={() => setStars(s)}
                    aria-label={`${s} نجوم`}
                  >
                    <Icon name="star" size={18} />
                  </button>
                ))}
                <span className="stars-count-label">({stars} من 5 نجوم)</span>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">المهنة / التخصص (اختياري)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="مثال: مهندس، معلمة، طبيب..." 
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">المدينة</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="مثال: القاهرة - المعادي" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">تفاصيل تجربتك ورأيك في الكشف</label>
            <textarea 
              className="form-control" 
              rows="3" 
              placeholder="صف كيف كانت دقة الموعد، المعاملة بالعيادة، وجودة الرعاية الطبية..."
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'جارِ النشر...' : 'نشر التقييم فوراً'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
