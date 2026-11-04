import { test, expect } from 'playwright/test';

test.describe('Booking Journey Flow (Multi-Step Wizard)', () => {
  test('guides patient through multi-step wizard: location, date/time, details, and WhatsApp ticket', async ({ page }) => {
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

    // 4. Stepper should be visible with 3 steps
    const stepper = modal.locator('.wizard-stepper');
    await expect(stepper).toBeVisible();

    // 5. Test navigation to Step 1 (Location Selection)
    const prevToStep1 = modal.locator('.wizard-btn-prev, .btn-change-step');
    if (await prevToStep1.count() > 0) {
      await prevToStep1.first().click();
    }

    // Verify Step 1 is active
    const step1 = modal.locator('#booking-step-1');
    await expect(step1).toBeVisible();

    // Select a clinic card in Step 1
    const clinicCards = step1.locator('.booking-clinic-card');
    await expect(clinicCards.first()).toBeVisible();
    await clinicCards.first().click();

    // Click Continue to Step 2
    const continueToStep2 = step1.locator('.wizard-btn-next');
    await expect(continueToStep2).toBeVisible();
    await continueToStep2.click();

    // 6. Verify Step 2 is active (Select Date & Time)
    const step2 = modal.locator('#booking-step-2');
    await expect(step2).toBeVisible();

    // Select an available slot if present
    const slotButtons = step2.locator('.slot-btn');
    if ((await slotButtons.count()) > 0) {
      await slotButtons.first().click();
    }

    // Click Continue to Step 3
    const continueToStep3 = step2.locator('.wizard-btn-next');
    await expect(continueToStep3).toBeEnabled();
    await continueToStep3.click();

    // 7. Verify Step 3 is active (Enter Details & Confirm)
    const step3 = modal.locator('#booking-step-3');
    await expect(step3).toBeVisible();

    // Verify booking summary card in Step 3
    await expect(step3.locator('.wizard-booking-summary')).toBeVisible();

    // Fill patient name and valid Egyptian phone
    const nameInput = step3.locator('input[placeholder*="أحمد مصطفى كامل"]');
    const phoneInput = step3.locator('input[type="tel"]');

    await nameInput.fill('أحمد مصطفى كامل');
    await phoneInput.fill('01012345678');

    // 8. Submit booking form
    const submitBtn = step3.locator('.btn-confirm-booking');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 9. Verify booking success screen appears
    const successBox = modal.locator('.booking-success-box');
    await expect(successBox).toBeVisible({ timeout: 10000 });
    await expect(successBox.locator('.success-title')).toContainText('تم تأكيد حجزك بنجاح');

    // 10. Verify ticket code is generated and displayed
    const ticketCode = successBox.locator('.ticket-code');
    await expect(ticketCode).toBeVisible();
    const codeText = await ticketCode.textContent();
    expect(codeText).toBeTruthy();
    expect(codeText.trim().length).toBeGreaterThan(3);

    // 11. Verify WhatsApp link is generated with normalized Egyptian number and encoded message
    const waLink = successBox.locator('#whatsapp-confirm-link');
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('https://wa.me/201012345678?text=');
    expect(href).toContain(encodeURIComponent(codeText.trim()));
  });
});
