import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Specialties from './components/Specialties';
import Doctors from './components/Doctors';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import EmergencyModal from './components/EmergencyModal';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import MyBookingsModal from './components/MyBookingsModal';
import AddReviewModal from './components/AddReviewModal';
import Toast from './components/Toast';

import { dataService } from './services/dataService';

export default function App() {
  // Modal states
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });
  const [bookingModalState, setBookingModalState] = useState({ isOpen: false, doctor: null, initialSlot: null });
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('doctork-theme') === 'dark' ? 'dark' : 'light';
    } catch (error) {
      console.warn('Unable to read saved theme preference:', error);
      return 'light';
    }
  });

  // Search & Filters state
  const [selectedSpecialty, setSelectedSpecialty] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Dynamic Data States
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [stats, setStats] = useState({
    doctorsCount: 200,
    bookingsCount: 15200,
    satisfactionRate: 98,
    specialtiesCount: 32,
    emergencyDoctorsCount: 14
  });
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all dynamic data from service
  const loadDynamicData = useCallback(async () => {
    try {
      const [fetchedDoctors, fetchedSpecialties, fetchedStats, fetchedReviews, fetchedBookings] = await Promise.all([
        dataService.getDoctors(),
        dataService.getSpecialties(),
        dataService.getStats(),
        dataService.getReviews(),
        dataService.getBookings()
      ]);

      setDoctors(fetchedDoctors);
      setSpecialties(fetchedSpecialties);
      setStats(fetchedStats);
      setReviews(fetchedReviews);
      setBookings(fetchedBookings);
      setCurrentUser(dataService.getCurrentUser());
    } catch (err) {
      console.error('Error fetching dynamic data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDynamicData();
  }, [loadDynamicData]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('doctork-theme', theme);
    } catch (error) {
      console.warn('Unable to save theme preference:', error);
    }
  }, [theme]);

  useEffect(() => {
    const updateBackToTopVisibility = () => {
      const heroSection = document.getElementById('heroSection');
      setShowBackToTop(Boolean(heroSection && heroSection.getBoundingClientRect().bottom <= 0));
    };

    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
    window.addEventListener('resize', updateBackToTopVisibility);

    return () => {
      window.removeEventListener('scroll', updateBackToTopVisibility);
      window.removeEventListener('resize', updateBackToTopVisibility);
    };
  }, []);

  // Toast System
  const addToast = (message, type = 'normal') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers
  const openAuth = (mode = 'login') => {
    setAuthModalState({ isOpen: true, mode });
  };

  const closeAuth = () => {
    setAuthModalState({ isOpen: false, mode: 'login' });
  };

  const handleAuthSuccess = async (mode, credentials) => {
    let user;
    if (mode === 'login') {
      user = await dataService.login(credentials.email, credentials.password);
      addToast(`مرحباً بك مجدداً يا ${user.name}! تم تسجيل الدخول بنجاح.`, 'success');
    } else {
      user = await dataService.register(credentials.name, credentials.email, credentials.password);
      addToast(`أهلاً بك يا ${user.name}! تم إنشاء حسابك بنجاح في دكتورك.`, 'success');
    }
    setCurrentUser(user);
  };

  const handleLogout = () => {
    dataService.logout();
    setCurrentUser(null);
    addToast('تم تسجيل الخروج بنجاح. نراك قريباً!', 'normal');
  };

  // Booking Handlers
  const handleBookDoctor = (doctor, initialSlot = null) => {
    setBookingModalState({ isOpen: true, doctor, initialSlot });
  };

  const closeBookingModal = () => {
    setBookingModalState({ isOpen: false, doctor: null, initialSlot: null });
  };

  const handleConfirmBooking = async (bookingData) => {
    const created = await dataService.createBooking(bookingData);
    // Reload dynamic state
    const [updatedDoctors, updatedStats, updatedBookings] = await Promise.all([
      dataService.getDoctors(),
      dataService.getStats(),
      dataService.getBookings()
    ]);
    setDoctors(updatedDoctors);
    setStats(updatedStats);
    setBookings(updatedBookings);
    return created;
  };

  const handleCancelBooking = async (bookingId) => {
    await dataService.cancelBooking(bookingId);
    // Reload dynamic state
    const [updatedDoctors, updatedStats, updatedBookings] = await Promise.all([
      dataService.getDoctors(),
      dataService.getStats(),
      dataService.getBookings()
    ]);
    setDoctors(updatedDoctors);
    setStats(updatedStats);
    setBookings(updatedBookings);
  };

  // Emergency Handler
  const handleRequestEmergency = async (emergencyData) => {
    await dataService.requestEmergency(emergencyData);
  };

  // Review Handler
  const handleSubmitReview = async (reviewData) => {
    await dataService.addReview(reviewData);
    const [updatedReviews, updatedStats] = await Promise.all([
      dataService.getReviews(),
      dataService.getStats()
    ]);
    setReviews(updatedReviews);
    setStats(updatedStats);
  };

  // Search & Specialty Filters
  const handleHeroSearch = (query) => {
    setSearchQuery(query);
    setSelectedSpecialty('الكل');
  };

  const handleSelectSpecialty = (spec) => {
    setSelectedSpecialty(spec);
  };

  return (
    <div className="app-root">
      {/* Top Header */}
      <Header 
        onOpenAuth={openAuth}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
        currentUser={currentUser}
        onLogout={handleLogout}
        bookingsCount={bookings.length}
        onOpenBookings={() => setIsMyBookingsOpen(true)}
      />

      {/* Main Content */}
      <main>
        {/* 1. Hero Section - Driven by dynamic stats, doctors, and specialties */}
        <Hero 
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onToast={addToast}
          onSearch={handleHeroSearch}
          stats={stats}
          doctors={doctors}
          specialties={specialties}
        />

        {/* 2. Medical Specialties Section - Dynamic */}
        <Specialties 
          specialties={specialties}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={handleSelectSpecialty}
          loading={loading}
        />

        {/* 3. Doctors Section & Instant Booking - Dynamic */}
        <Doctors 
          doctors={doctors}
          selectedSpecialty={selectedSpecialty}
          onSelectSpecialty={handleSelectSpecialty}
          searchQuery={searchQuery}
          onBookDoctor={handleBookDoctor}
          loading={loading}
        />

        {/* 4. How It Works - 4 Simple Steps */}
        <HowItWorks />

        {/* 5. Patient Testimonials & Social Proof - Dynamic */}
        <Testimonials 
          reviews={reviews} 
          onOpenAddReview={() => setIsAddReviewOpen(true)}
        />

      </main>

      {/* 7. Footer */}
      <Footer 
        onOpenAuth={openAuth}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onSelectSpecialty={handleSelectSpecialty}
      />
      {showBackToTop && (
        <button
          type="button"
          className="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="العودة إلى أعلى الصفحة"
          title="العودة إلى أعلى الصفحة"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5m-7 7 7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Emergency Fast Modal */}
      <EmergencyModal 
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onToast={addToast}
        emergencyDoctorsCount={stats.emergencyDoctorsCount}
        onRequestEmergency={handleRequestEmergency}
      />

      {/* Login / Register Modal */}
      <AuthModal 
        isOpen={authModalState.isOpen}
        mode={authModalState.mode}
        onClose={closeAuth}
        onToast={addToast}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Interactive Appointment Booking Modal */}
      <BookingModal 
        isOpen={bookingModalState.isOpen}
        doctor={bookingModalState.doctor}
        initialSlot={bookingModalState.initialSlot}
        currentUser={currentUser}
        onClose={closeBookingModal}
        onConfirmBooking={handleConfirmBooking}
        onToast={addToast}
      />

      {/* User Dynamic Bookings Modal */}
      <MyBookingsModal 
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onToast={addToast}
      />

      {/* Add Dynamic Review Modal */}
      <AddReviewModal 
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        onSubmitReview={handleSubmitReview}
        onToast={addToast}
        doctors={doctors}
      />

      {/* Toast Notification Container */}
      <Toast 
        toasts={toasts}
        onDismiss={removeToast}
      />
    </div>
  );
}
