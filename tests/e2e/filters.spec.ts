import { test, expect } from '@playwright/test';

test.describe('Filters and Search', () => {
  test('filters by US and EU markets', async ({ page }) => {
    await page.goto('/');

    const usRadio = page.getByRole('radio', { name: /États-Unis/i });
    await usRadio.click();
    await expect(usRadio).toHaveAttribute('aria-checked', 'true');

    const euRadio = page.getByRole('radio', { name: /Europe/i });
    await euRadio.click();
    await expect(euRadio).toHaveAttribute('aria-checked', 'true');
  });

  test('searches companies by ticker symbol', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('AAPL');

    await expect(searchInput).toHaveValue('AAPL');
  });

  test('resets all combined filters', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('NonExistentSymbol9999');

    const emptyResetButton = page.getByRole('button', { name: /Réinitialiser les filtres/i });
    await expect(emptyResetButton).toBeVisible();

    await emptyResetButton.click();
    await expect(searchInput).toHaveValue('');
  });
});
