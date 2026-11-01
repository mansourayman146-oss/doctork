import React from 'react';
import Icon from './ui/Icon';

export default function Testimonials({ reviews = [], onOpenAddReview }) {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="section-header-center">
          <h2 className="section-main-title">
            ماذا يقول <span className="highlight-text">مرضى دكتورك؟</span>
          </h2>
          <p className="section-main-subtitle">
            آلاف المرضى حجزوا موعدهم بدون زحمة وتخلصوا من ساعات الانتظار المرهقة. تجارب حقيقية نعتز بها يومياً.
          </p>

          {/* Add Review Action CTA */}
          <div className="add-review-cta-wrap">
            <button 
              type="button" 
              className="btn btn-outline btn-add-review"
              onClick={onOpenAddReview}
            >
              <span>شاركنا رأيك وتجربتك في دكتورك</span>
              <span className="arrow-icon">←</span>
            </button>
          </div>
        </div>

        {/* Dynamic Reviews Grid */}
        <div className="testimonials-grid">
          {reviews.map((review) => (
            <div key={review.id} className={`testimonial-card ${review.isUserAdded ? 'user-added' : ''}`}>
              
              <div className="test-top">
                <div className="test-avatar">
                  <span>{review.name.charAt(0)}</span>
                </div>
                <div className="test-author-info">
                  <div className="test-name-row">
                    <h4 className="test-name">{review.name}</h4>
                    {review.isUserAdded ? (
                      <span className="verified-badge-mini new-badge" title="تقييم مضاف حديثاً">
                        <Icon name="star" size={13} /> مراجعة جديدة
                      </span>
                    ) : review.verified && (
                      <span className="verified-badge-mini" title="حجز مؤكد تم بالفعل">
                        <Icon name="check-circle" size={13} /> مريض مؤكد
                      </span>
                    )}
                  </div>
                  <span className="test-role">{review.role} • {review.location}</span>
                </div>
              </div>

              <div className="test-stars">
                {[...Array(review.stars || 5)].map((_, i) => (
                  <span key={i} className="star"><Icon name="star" size={16} /></span>
                ))}
              </div>

              <p className="test-text">"{review.text}"</p>

              <div className="test-footer">
                <span className="test-doctor-tag"><Icon name="stethoscope" size={15} /> {review.doctorVisited}</span>
                <span className="test-date">{review.date}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
