import { describe, it, expect } from 'vitest';
import {
  EGYPTIAN_PHONE_REGEX,
  isValidEgyptianPhone,
  normalizeEgyptianPhone,
  isValidName,
  generateWhatsAppUrl
} from '../validate';

describe('Booking Validation Utilities', () => {
  describe('EGYPTIAN_PHONE_REGEX & isValidEgyptianPhone', () => {
    it('exposes and matches valid phone numbers via EGYPTIAN_PHONE_REGEX', () => {
      expect(EGYPTIAN_PHONE_REGEX.test('01012345678')).toBe(true);
      expect(EGYPTIAN_PHONE_REGEX.test('01198765432')).toBe(true);
      expect(EGYPTIAN_PHONE_REGEX.test('01234567890')).toBe(true);
      expect(EGYPTIAN_PHONE_REGEX.test('01555555555')).toBe(true);
      expect(EGYPTIAN_PHONE_REGEX.test('01312345678')).toBe(false);
    });

    it('accepts valid 11-digit Egyptian mobile numbers', () => {
      expect(isValidEgyptianPhone('01012345678')).toBe(true);
      expect(isValidEgyptianPhone('01198765432')).toBe(true);
      expect(isValidEgyptianPhone('01234567890')).toBe(true);
      expect(isValidEgyptianPhone('01555555555')).toBe(true);
    });

    it('accepts numbers with whitespace or hyphens', () => {
      expect(isValidEgyptianPhone('010 1234 5678')).toBe(true);
      expect(isValidEgyptianPhone(' 011-9876-5432 ')).toBe(true);
    });

    it('rejects invalid prefixes (not 010, 011, 012, 015)', () => {
      expect(isValidEgyptianPhone('01312345678')).toBe(false);
      expect(isValidEgyptianPhone('01412345678')).toBe(false);
      expect(isValidEgyptianPhone('01612345678')).toBe(false);
      expect(isValidEgyptianPhone('01712345678')).toBe(false);
      expect(isValidEgyptianPhone('01812345678')).toBe(false);
      expect(isValidEgyptianPhone('01912345678')).toBe(false);
      expect(isValidEgyptianPhone('02012345678')).toBe(false);
    });

    it('rejects invalid lengths', () => {
      expect(isValidEgyptianPhone('0101234567')).toBe(false); // 10 digits
      expect(isValidEgyptianPhone('010123456789')).toBe(false); // 12 digits
      expect(isValidEgyptianPhone('')).toBe(false);
    });

    it('rejects non-digit characters and null/undefined values', () => {
      expect(isValidEgyptianPhone('010abc45678')).toBe(false);
      expect(isValidEgyptianPhone(null)).toBe(false);
      expect(isValidEgyptianPhone(undefined)).toBe(false);
      expect(isValidEgyptianPhone(1234567890)).toBe(false);
    });
  });

  describe('normalizeEgyptianPhone', () => {
    it('normalizes 11-digit local numbers starting with 0', () => {
      expect(normalizeEgyptianPhone('01012345678')).toBe('201012345678');
      expect(normalizeEgyptianPhone('01198765432')).toBe('201198765432');
    });

    it('preserves existing 20 prefix with 12 digits', () => {
      expect(normalizeEgyptianPhone('201012345678')).toBe('201012345678');
      expect(normalizeEgyptianPhone('+201012345678')).toBe('201012345678');
    });

    it('normalizes 10-digit number without leading 0', () => {
      expect(normalizeEgyptianPhone('1012345678')).toBe('201012345678');
    });

    it('handles empty or non-string inputs safely', () => {
      expect(normalizeEgyptianPhone('')).toBe('');
      expect(normalizeEgyptianPhone(null)).toBe('');
      expect(normalizeEgyptianPhone(undefined)).toBe('');
    });
  });

  describe('isValidName', () => {
    it('accepts names with 3 or more characters', () => {
      expect(isValidName('علي')).toBe(true);
      expect(isValidName('أحمد محمد')).toBe(true);
      expect(isValidName('Sara')).toBe(true);
    });

    it('rejects names with less than 3 characters', () => {
      expect(isValidName('مي')).toBe(false);
      expect(isValidName('A')).toBe(false);
      expect(isValidName('')).toBe(false);
    });

    it('rejects whitespace-only strings', () => {
      expect(isValidName('   ')).toBe(false);
      expect(isValidName(' \t\n ')).toBe(false);
    });

    it('handles non-string inputs safely', () => {
      expect(isValidName(null)).toBe(false);
      expect(isValidName(undefined)).toBe(false);
      expect(isValidName(123)).toBe(false);
    });
  });

  describe('generateWhatsAppUrl', () => {
    it('generates a valid WhatsApp URL with normalized phone and encoded message', () => {
      const url = generateWhatsAppUrl('01012345678', 'مرحبا، تأكيد الحجز');
      expect(url).toBe('https://wa.me/201012345678?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D8%8C%20%D8%AA%D8%A3%D9%83%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B2');
    });

    it('handles empty text gracefully', () => {
      const url = generateWhatsAppUrl('01012345678', '');
      expect(url).toBe('https://wa.me/201012345678?text=');
    });

    it('correctly encodes special characters and line breaks', () => {
      const url = generateWhatsAppUrl('01198765432', 'سطر 1\nسطر 2: #123');
      expect(url).toContain('https://wa.me/201198765432?text=');
      expect(url).toContain(encodeURIComponent('سطر 1\nسطر 2: #123'));
    });
  });
});
