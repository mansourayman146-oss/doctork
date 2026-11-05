import { test, expect } from 'playwright/test';

test.describe('Responsive layouts', () => {
  test('keeps primary sections inside the viewport from mobile to desktop', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/حجز الأطباء/);

    for (const width of [320, 360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });

      const bounds = await page.locator(
        '.site-header, .header-container, .hero-section, .hero-container, .search-input-field, .btn-search, ' +
        '.stats-glass-card, .section-container, .specialty-card, .doctor-card, .feature-card, .step-card, ' +
        '.testimonial-card, .doctors-filter-card, .doctors-grid, .comparison-banner, .download-banner-card, ' +
        '.footer-container, .footer-grid'
      ).evaluateAll((elements) => elements.map((element) => {
        const { left, right, width: elementWidth } = element.getBoundingClientRect();
        return { left, right, width: elementWidth };
      }));

      for (const bound of bounds) {
        expect(bound.left, `left edge at ${width}px`).toBeGreaterThanOrEqual(-1);
        expect(bound.right, `right edge at ${width}px`).toBeLessThanOrEqual(width + 1);
      }

      if (width <= 991) {
        await expect(page.locator('.mobile-toggle')).toBeVisible();
        await expect(page.locator('.main-nav')).toBeHidden();

        if (width === 320) {
          const specialtyColumns = await page.locator('.specialties-grid').evaluate(
            (element) => getComputedStyle(element).gridTemplateColumns.split(' ').length
          );
          expect(specialtyColumns).toBe(1);
          await expect(page.locator('.doctor-card')).toHaveCount(1);

          const firstDoctor = await page.locator('.doctor-card').getAttribute('id');
          await page.getByRole('button', { name: 'عرض الطبيب التالي' }).click();
          await expect(page.locator('.doctor-card')).not.toHaveAttribute('id', firstDoctor);
          await page.getByRole('button', { name: 'عرض الطبيب السابق' }).click();
          await expect(page.locator('.doctor-card')).toHaveAttribute('id', firstDoctor);
        }

        if (width === 320) {
          await page.locator('.mobile-toggle').click();
          await expect(page.locator('.mobile-drawer')).toHaveClass(/open/);
          await expect(page.locator('.drawer-nav-list')).toBeVisible();
          await page.locator('.drawer-close').click();
        }
      } else {
        await expect(page.locator('.mobile-toggle')).toBeHidden();
        await expect(page.locator('.main-nav')).toBeVisible();
        await expect(page.locator('.doctor-card')).toHaveCount(6);
      }
    }
  });

  test('keeps the booking dialog within a narrow mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto('/');
    await page.locator('.btn-book-doctor').first().click();

    const dialog = page.locator('.booking-modal-dialog');
    await expect(dialog).toBeVisible();

    const bounds = await dialog.evaluate((element) => {
      const { left, right, top, bottom } = element.getBoundingClientRect();
      return { left, right, top, bottom };
    });

    expect(bounds.left).toBeGreaterThanOrEqual(0);
    expect(bounds.right).toBeLessThanOrEqual(320);
    expect(bounds.top).toBeGreaterThanOrEqual(0);
    expect(bounds.bottom).toBeLessThanOrEqual(720);
  });

  test('keeps the booking modal header dark in dark mode', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('doctork-theme', 'dark'));
    await page.goto('/');
    await page.locator('.btn-book-doctor').first().click();

    const modalHeader = page.locator('.booking-modal-header');
    await expect(modalHeader).toBeVisible();
    await expect(modalHeader).toHaveCSS('background-color', 'rgb(19, 30, 46)');
    await expect(modalHeader).toHaveCSS('background-image', 'none');
  });

  test('uses the booking mark, removes step-card arrows, and keeps dark surfaces dark', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('doctork-theme', 'light'));
    await page.goto('/');

    await expect(page.locator('.site-header .brand-logo .logo-icon svg')).toBeVisible();
    await expect(page.locator('.step-connector-arrow')).toHaveCount(0);

    await page.locator('.site-header .theme-toggle-btn:not(.drawer-theme-toggle)').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('.testimonial-card').first().evaluate((card) => card.classList.add('user-added'));
    await expect(page.locator('.testimonial-card').first()).toHaveCSS('background-color', 'rgb(19, 30, 46)');

    const whiteSurfaces = await page.locator('body *').evaluateAll((elements) => (
      elements
        .filter((element) => {
          const style = getComputedStyle(element);
          return style.backgroundColor === 'rgb(255, 255, 255)' ||
            (element.matches('.testimonial-card') && style.backgroundImage !== 'none');
        })
        .map((element) => `${element.tagName.toLowerCase()}.${String(element.className).replaceAll(' ', '.')}`)
    ));

    expect(whiteSurfaces).toEqual([]);
    const testimonialBackgrounds = await page.locator('.testimonial-card').evaluateAll((cards) => (
      cards.map((card) => ({
        color: getComputedStyle(card).backgroundColor,
        image: getComputedStyle(card).backgroundImage
      }))
    ));
    expect(testimonialBackgrounds.length).toBeGreaterThan(0);
    for (const background of testimonialBackgrounds) {
      expect(background.color).toBe('rgb(19, 30, 46)');
      expect(background.image).toBe('none');
    }
  });

  test('styles the signed-in header controls consistently in light mode', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('doctork_current_user_v1', JSON.stringify({
        id: 'test-user',
        name: 'ayman1',
        email: 'ayman@example.com'
      }));
      localStorage.setItem('doctork-theme', 'light');
    });
    await page.goto('/');

    const userControls = page.locator('.user-profile-menu');
    await expect(userControls).toBeVisible();
    await expect(userControls.locator('.btn-bookings-badge')).toHaveCSS('min-height', '46px');
    await expect(userControls.locator('.user-badge-wrap')).toHaveCSS('background-color', 'rgb(245, 248, 246)');
    await expect(userControls.locator('.btn-bookings-badge')).toHaveCSS('background-color', 'rgb(237, 245, 240)');
  });
});
