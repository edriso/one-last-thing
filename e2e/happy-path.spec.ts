import { expect, test } from '@playwright/test';

test('close the day: tidy early, set an intention, persist', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Close the day/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Close the day/ })).toHaveCSS('opacity', '1');

  await page.getByRole('button', { name: 'Begin' }).click();
  await page.getByRole('button', { name: 'Done early' }).click();
  await page.getByLabel(/intention/i).fill('water the plants');
  await page.getByRole('button', { name: 'Set it down' }).click();
  await expect(page.getByRole('heading', { name: /That.?s everything/ })).toBeVisible();
  await expect(page.getByText('water the plants')).toBeVisible();

  await expect(page.evaluate(() => localStorage.getItem('olt-v1'))).resolves.toContain(
    'water the plants',
  );
});
