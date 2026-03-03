import { expect, test } from '@playwright/test';

test('can navigate from home to post detail page', async ({ page }) => {
  await page.goto('/');

  const firstPostLink = page.locator('.post-card-link').first();
  await expect(firstPostLink).toBeVisible();

  await firstPostLink.click();
  await expect(page).toHaveURL(/\/post\//);
  await expect(page.locator('.post-title')).toBeVisible();
});
