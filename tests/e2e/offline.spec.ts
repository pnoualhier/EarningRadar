import { test, expect } from '@playwright/test';

test.describe('Offline mode and resilience', () => {
  test('retains cached calendar and displays offline indicator when network disconnects', async ({
    page,
    context,
  }) => {
    // 1. Initial load while online
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Earnings/i })).toBeVisible();

    // 2. Simulate offline network mode
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    // 3. Verify offline banner warning is visible
    const offlineAlert = page.getByRole('alert');
    await expect(offlineAlert).toBeVisible();
    await expect(offlineAlert).toContainText(/Mode hors ligne actif/i);

    // 4. Calendar events remain rendered from cache
    const mainBoard = page.locator('.calendar-board-container');
    await expect(mainBoard).toBeVisible();
  });
});
