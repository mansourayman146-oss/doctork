/**
 * Validation and normalization utilities for booking and patient data.
 */

export const EGYPTIAN_PHONE_REGEX = /^01[0125]\d{8}$/;

/**
 * Validates an Egyptian mobile phone number.
 * Must start with 010, 011, 012, or 015, followed by 8 digits (total 11 digits).
 * Strips whitespace and hyphens before testing.
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidEgyptianPhone(phone) {
  if (typeof phone !== 'string') return false;
  const clean = phone.trim().replace(/[\s-]/g, '');
  return EGYPTIAN_PHONE_REGEX.test(clean);
}

/**
 * Normalizes an Egyptian phone number to international E.164-like format (201XXXXXXXXX).
 * Strips all non-digit characters and prepends country code 20 without leading zero.
 * @param {string} phone
 * @returns {string}
 */
export function normalizeEgyptianPhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return '2' + digits;
  }
  if (digits.startsWith('20') && digits.length === 12) {
    return digits;
  }
  if (!digits.startsWith('2') && digits.length === 10) {
    return '20' + digits;
  }
  return digits;
}

/**
 * Validates patient or doctor name (at least 3 characters after trimming).
 * @param {string} name
 * @returns {boolean}
 */
export function isValidName(name) {
  if (typeof name !== 'string') return false;
  return name.trim().length >= 3;
}

/**
 * Safely generates a WhatsApp click-to-chat URL with normalized phone and encoded message.
 * @param {string} phone
 * @param {string} text
 * @returns {string}
 */
export function generateWhatsAppUrl(phone, text) {
  const normalizedPhone = normalizeEgyptianPhone(phone);
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text || '')}`;
}
