import { test, expect } from 'playwright/test';

test.describe('Booking Journey Flow', () => {
  test('allows a patient to select a doctor, pick slot, fill details, and get WhatsApp confirmation', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');

    // 2. Locate first doctor booking button and click it
    const bookButton = page.locator('.btn-book-doctor').first();
    await expect(bookButton).toBeVisible();
    await bookButton.click();

    // 3. Modal should open
    const modal = page.locator('.booking-modal-dialog');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.modal-title')).toContainText('حجز موعد كشف طبي');

    // 4. Select an available slot if present
    const slotButtons = modal.locator('.slot-btn');
    if ((await slotButtons.count()) > 0) {
      await slotButtons.first().click();
    }

    // 5. Fill patient name and valid Egyptian phone
    const nameInput = modal.locator('input[placeholder*="محمد حسام"]');
    const phoneInput = modal.locator('input[type="tel"]');

    await nameInput.fill('أحمد مصطفى كامل');
    await phoneInput.fill('01012345678');

    // 6. Submit booking form
    const submitBtn = modal.locator('.btn-confirm-booking');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 7. Verify booking success screen appears
    const successBox = modal.locator('.booking-success-box');
    await expect(successBox).toBeVisible({ timeout: 10000 });
    await expect(successBox.locator('.success-title')).toContainText('تم تأكيد حجزك بنجاح');

    // 8. Verify ticket code is generated and displayed
    const ticketCode = successBox.locator('.ticket-code');
    await expect(ticketCode).toBeVisible();
    const codeText = await ticketCode.textContent();
    expect(codeText).toBeTruthy();
    expect(codeText.trim().length).toBeGreaterThan(3);

    // 9. Verify WhatsApp link is generated with normalized Egyptian number and encoded message
    const waLink = successBox.locator('#whatsapp-confirm-link');
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('https://wa.me/201012345678?text=');
    expect(href).toContain(encodeURIComponent(codeText.trim()));
  });
});

