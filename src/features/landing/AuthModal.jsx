import React, { useState } from 'react';

export default function AuthModal({ 
  isOpen, 
  mode = 'login', 
  onClose, 
  onToast,
  onAuthSuccess 
}) {
  const [activeTab, setActiveTab] = useState(mode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'register' && !fullName.trim()) {
      onToast('يرجى إدخال الاسم الكامل', 'normal');
      return;
    }
    if (!email.trim() || !password) {
      onToast('يرجى ملء البريد الإلكتروني وكلمة المرور', 'normal');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onAuthSuccess) {
        await onAuthSuccess(activeTab, {
          name: fullName.trim(),
          email: email.trim(),
          password
        });
      }
      onClose();
    } catch (err) {
      onToast('حدث خطأ أثناء المصادقة، يرجى المحاولة ثانية', 'normal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="logo-icon small"><span>د</span></div>
            <div>
              <h3 className="modal-title">
                {activeTab === 'login' ? 'تسجيل الدخول إلى دكتورك' : 'إنشاء حساب جديد في دكتورك'}
              </h3>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق">&times;</button>
        </div>

        <div className="modal-tabs">
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            تسجيل الدخول
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            حساب جديد
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="form-group">
              <label className="form-label">الاسم الكامل</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="أدخل اسمك الكريم" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="example@domain.com" 
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            style={{ height: '48px', marginTop: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'جارِ التحقق...' 
              : activeTab === 'login' ? 'دخول لحسابي' : 'إنشاء الحساب مجاناً'}
          </button>
        </form>

      </div>
    </div>
  );
}
