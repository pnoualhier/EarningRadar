import { test, expect } from '@playwright/test';

test.describe('Calendar flow and company details', () => {
  test('loads home page and displays the current week and events', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Earnings/i })).toBeVisible();
    await expect(page.getByRole('searchbox')).toBeVisible();

    // Verify day columns or mobile view
    const mainBoard = page.locator('.calendar-board-container');
    await expect(mainBoard).toBeVisible();
  });

  test('navigates between weeks and restores current week', async ({ page }) => {
    await page.goto('/');

    const prevButton = page.getByRole('button', { name: 'Semaine précédente' });
    await expect(prevButton).toBeVisible();
    await prevButton.click();

    // "Aujourd'hui" button should appear when navigated away
    const todayButton = page.getByRole('button', { name: /Aujourd’hui/i });
    await expect(todayButton).toBeVisible();

    await todayButton.click();
    await expect(todayButton).not.toBeVisible();
  });

  test('opens company detail modal on card click', async ({ page }) => {
    await page.goto('/');

    const eventCard = page.locator('.event-card').first();
    if (await eventCard.isVisible()) {
      await eventCard.click();

      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      await expect(modal.getByText(/Fiabilité de la date/i)).toBeVisible();

      // Close modal
      const closeBtn = page.getByRole('button', { name: /Fermer la fiche détaillée/i });
      await closeBtn.click();
      await expect(modal).not.toBeVisible();
    }
  });
});
