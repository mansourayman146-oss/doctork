import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faClock,
  faPhone,
  faLocationDot,
  faMagnifyingGlass,
  faStar,
  faUser,
  faUsers,
  faStethoscope,
  faHeart,
  faHeartPulse,
  faCheck,
  faCircleCheck,
  faXmark,
  faBars,
  faChevronDown,
  faArrowLeft,
  faArrowRight,
  faEnvelope,
  faShieldHalved,
  faTriangleExclamation,
  faMoneyBillWave,
  faBuilding,
  faBolt,
  faTruckMedical,
  faBaby,
  faBone,
  faBrain,
  faEye,
  faLightbulb,
  faDoorOpen,
  faCommentDots,
  faFaceSmile,
  faSun,
  faMoon,
  faFilter,
  faPlay,
  faMobileScreenButton,
  faBell,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
  faApple,
  faGooglePlay
} from '@fortawesome/free-brands-svg-icons';

const ICONS = {
  // Navigation & Actions
  calendar: faCalendarDays,
  clock: faClock,
  phone: faPhone,
  pin: faLocationDot,
  search: faMagnifyingGlass,
  star: faStar,
  user: faUser,
  users: faUsers,
  stethoscope: faStethoscope,
  heart: faHeart,
  'heart-pulse': faHeartPulse,
  check: faCheck,
  'check-circle': faCircleCheck,
  close: faXmark,
  menu: faBars,
  'chevron-down': faChevronDown,
  back: faArrowLeft,
  'arrow-left': faArrowLeft,
  'arrow-right': faArrowRight,
  mail: faEnvelope,
  shield: faShieldHalved,
  alert: faTriangleExclamation,
  money: faMoneyBillWave,
  building: faBuilding,
  zap: faBolt,
  siren: faTruckMedical,
  baby: faBaby,
  bone: faBone,
  brain: faBrain,
  eye: faEye,
  lightbulb: faLightbulb,
  'door-open': faDoorOpen,
  message: faCommentDots,
  smile: faFaceSmile,
  sun: faSun,
  moon: faMoon,
  filter: faFilter,
  play: faPlay,
  smartphone: faMobileScreenButton,
  bell: faBell,
  sparkles: faWandMagicSparkles,

  // Social & Brands
  whatsapp: faWhatsapp,
  facebook: faFacebookF,
  instagram: faInstagram,
  apple: faApple,
  googleplay: faGooglePlay
};

// أيقونات اتجاهية: تتعكس في RTL
const DIRECTIONAL = new Set(['back', 'arrow-left', 'arrow-right']);

export default function Icon({ name, label, size, className = '', style, ...rest }) {
  const icon = ICONS[name];
  if (!icon) {
    if (import.meta.env.DEV) {
      console.warn(`Icon غير معرّفة: "${name}"`);
    }
    return null;
  }

  const a11y = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true };

  const dynamicStyle = size
    ? { fontSize: typeof size === 'number' ? `${size}px` : size, ...style }
    : style;

  return (
    <FontAwesomeIcon
      icon={icon}
      className={`${DIRECTIONAL.has(name) ? 'icon-flip-rtl ' : ''}${className}`.trim()}
      style={dynamicStyle}
      {...a11y}
      {...rest}
    />
  );
}
