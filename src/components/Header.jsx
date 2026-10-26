import React, { useState } from 'react';
import { CalendarDays, Moon, Siren, Sun, UserRound } from 'lucide-react';

export default function Header({ 
  onOpenAuth, 
  onOpenEmergency, 
  currentUser = null,
  onLogout,
  bookingsCount = 0,
  onOpenBookings,
  theme = 'light',
  onToggleTheme
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const themeLabel = theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن';

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="header-container">
          
          {/* Brand Logo (Right side in RTL) */}
          <a href="#" className="brand-logo" aria-label="الصفحة الرئيسية لدكتورك">
            <div className="logo-icon">
              <span>د</span>
            </div>
            <div className="brand-text-group">
              <span className="brand-name">دكتورك</span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <nav className="main-nav" aria-label="القائمة الرئيسية">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#" className="nav-link active">الرئيسية</a>
              </li>
              <li className="nav-item">
                <a href="#specialties" className="nav-link">التخصصات</a>
              </li>
              <li className="nav-item">
                <a href="#doctors" className="nav-link">الأطباء</a>
              </li>
              <li className="nav-item">
                <button 
                  type="button" 
                  className="nav-link emergency-nav-item" 
                  onClick={onOpenEmergency}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Siren className="siren-icon" aria-hidden="true" />
                  <span>طوارئ</span>
                </button>
              </li>
              <li className="nav-item">
                <a href="#how-it-works" className="nav-link">كيف يعمل؟</a>
              </li>
              <li className="nav-item">
                <a href="#testimonials" className="nav-link">آراء المرضى</a>
              </li>
            </ul>
          </nav>

          {/* Action Buttons (Left side in RTL) */}
          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label={`التبديل إلى ${themeLabel}`}
              title={themeLabel}
            >
              <ThemeIcon size={18} aria-hidden="true" />
              <span>{themeLabel}</span>
            </button>
            {currentUser ? (
              <div className="user-profile-menu">
                <button 
                  type="button" 
                  className="btn btn-bookings-badge"
                  onClick={onOpenBookings}
                  title="عرض وإدارة حجوزاتي"
                >
                  <span><CalendarDays size={16} aria-hidden="true" /> حجوزاتي</span>
                  {bookingsCount > 0 && <span className="bookings-counter-pill">{bookingsCount}</span>}
                </button>

                <div className="user-badge-wrap">
                  <span className="user-greeting">أهلاً، <strong>{currentUser.name}</strong></span>
                  <button 
                    type="button" 
                    className="btn-logout-mini" 
                    onClick={onLogout}
                    title="تسجيل الخروج"
                  >
                    خروج
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => onOpenAuth('login')}
                >
                  دخول
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => onOpenAuth('register')}
                >
                  سجل مجاناً
                </button>
              </>
            )}
            
            {/* Mobile Hamburger Button */}
            <button 
              type="button" 
              className="mobile-toggle" 
              onClick={toggleDrawer}
              aria-label="فتح القائمة" 
              aria-expanded={isDrawerOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      <div 
        className={`mobile-drawer-overlay ${isDrawerOpen ? 'open' : ''}`} 
        onClick={closeDrawer} 
        aria-hidden="true"
      />
      
      <aside className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`} aria-label="قائمة الهاتف">
        <div className="drawer-header">
          <div className="brand-logo">
            <div className="logo-icon small">
              <span>د</span>
            </div>
            <span className="brand-name">دكتورك</span>
          </div>
          <button 
            type="button" 
            className="drawer-close" 
            onClick={closeDrawer} 
            aria-label="إغلاق القائمة"
          >
            &times;
          </button>
        </div>
        <div className="drawer-content">
          {currentUser && (
            <div className="drawer-user-info">
              <span className="drawer-avatar"><UserRound size={20} aria-hidden="true" /></span>
              <div>
                <strong>{currentUser.name}</strong>
                <p>{currentUser.email}</p>
              </div>
            </div>
          )}

          <ul className="drawer-nav-list">
            <li><a href="#" className="drawer-link active" onClick={closeDrawer}>الرئيسية</a></li>
            <li><a href="#specialties" className="drawer-link" onClick={closeDrawer}>التخصصات</a></li>
            <li><a href="#doctors" className="drawer-link" onClick={closeDrawer}>الأطباء</a></li>
            <li>
              <button 
                type="button" 
                className="drawer-link emergency-drawer-item w-100" 
                onClick={() => { closeDrawer(); onOpenEmergency(); }}
                style={{ textAlign: 'right', background: 'none', border: 'none' }}
              >
                <Siren size={16} aria-hidden="true" /> طوارئ فورية
              </button>
            </li>
            <li>
              <button 
                type="button" 
                className="drawer-link w-100" 
                onClick={() => { closeDrawer(); onOpenBookings(); }}
                style={{ textAlign: 'right', background: 'none', border: 'none' }}
              >
                <CalendarDays size={16} aria-hidden="true" /> حجوزاتي الطبية ({bookingsCount})
              </button>
            </li>
            <li><a href="#how-it-works" className="drawer-link" onClick={closeDrawer}>كيف يعمل؟</a></li>
            <li><a href="#testimonials" className="drawer-link" onClick={closeDrawer}>آراء المرضى</a></li>
          </ul>

          <button
            type="button"
            className="theme-toggle-btn drawer-theme-toggle"
            onClick={onToggleTheme}
          >
            <ThemeIcon size={18} aria-hidden="true" />
            <span>التبديل إلى {themeLabel}</span>
          </button>
          
          <div className="drawer-actions">
            {currentUser ? (
              <button 
                type="button" 
                className="btn btn-outline w-100" 
                onClick={() => { closeDrawer(); onLogout(); }}
              >
                تسجيل الخروج
              </button>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn btn-outline w-100" 
                  onClick={() => { closeDrawer(); onOpenAuth('login'); }}
                >
                  دخول
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary w-100" 
                  onClick={() => { closeDrawer(); onOpenAuth('register'); }}
                >
                  سجل مجاناً
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
