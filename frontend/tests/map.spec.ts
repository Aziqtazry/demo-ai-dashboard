import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('mbdk-demo-auth', 'true');
        localStorage.setItem('mbdk-demo-role', 'it');
    });
});

test('local Klang map supports search, layers, coordinates and road selection without external map requests', async ({ page }, testInfo) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
        if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:5173')) { externalRequests.push(request.url()); }
    });
    await page.goto('/dashboard');
    const map = page.locator('.klang-map');
    const search = map.getByRole('textbox', { name: 'Cari lokasi atau koordinat pada peta' });
    await expect(search).toBeEnabled({ timeout: 20000 });
    await expect(map.locator('canvas')).toBeVisible();
    await expect(map.getByRole('link', { name: 'OpenStreetMap contributors' })).toBeVisible();
    await search.fill('Jalan Meru');
    await map.getByRole('button', { name: 'Jalan Meru', exact: true }).click();
    await expect(map.getByRole('status')).toHaveText('Jalan Meru');
    await map.getByRole('button', { name: 'Pilih lapisan peta' }).click();
    await map.getByRole('checkbox', { name: 'Rangkaian jalan' }).uncheck();
    await expect(map.getByRole('checkbox', { name: 'Rangkaian jalan' })).not.toBeChecked();
    await map.getByRole('checkbox', { name: 'Rangkaian jalan' }).check();
    await map.getByRole('button', { name: 'Pilih lapisan peta' }).click();
    await search.fill('3.043, 101.449');
    await search.press('Enter');
    await expect(map.locator('.leaflet-popup-content')).toContainText('3.043, 101.449');
    await search.fill('0, 0');
    await search.press('Enter');
    await expect(map.getByRole('status')).toContainText('di luar liputan');
    await search.fill('zzzznotfound');
    await search.press('Enter');
    await expect(map.getByRole('status')).toContainText('Tiada padanan');
    await map.getByRole('button', { name: 'Papar seluruh daerah Klang' }).click();
    await page.screenshot({ path: testInfo.outputPath('klang-dashboard.png'), fullPage: true });
    await page.goto('/traffic');
    await expect(search).toBeEnabled({ timeout: 20000 });
    await page.getByRole('button', { name: /Jalan Kapar.*Klik untuk lihat/ }).click();
    await expect(map.getByRole('status')).toHaveText('Jalan Kapar');
    await map.getByRole('button', { name: 'Papar seluruh daerah Klang' }).click();
    await page.getByRole('button', { name: /Jalan Kapar.*Klik untuk lihat/ }).click();
    await expect(map.getByRole('status')).toHaveText('Jalan Kapar');
    await expect(page.getByText('API trafik belum disambung')).toBeVisible();
    await expect(page.getByText('Tiada data', { exact: true })).toHaveCount(4);
    await page.screenshot({ path: testInfo.outputPath('klang-traffic.png'), fullPage: true });
    await map.screenshot({ path: testInfo.outputPath('klang-map.png') });
    await page.getByRole('button', { name: 'Aktifkan light mode' }).click();
    await page.screenshot({ path: testInfo.outputPath('klang-traffic-light.png'), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
    expect(externalRequests).toEqual([]);
});

test('map shows a recoverable error when the local dataset cannot load', async ({ page }) => {
    let fail = true;
    await page.route('**/klang.geojson', (route) => fail ? route.fulfill({ status: 503, body: 'unavailable' }) : route.continue());
    await page.goto('/traffic');
    await expect(page.getByRole('alert')).toContainText('Data peta tidak dapat dimuatkan');
    fail = false;
    await page.getByRole('button', { name: 'Cuba semula' }).click();
    await expect(page.getByRole('textbox', { name: 'Cari lokasi atau koordinat pada peta' })).toBeEnabled({ timeout: 20000 });
    await expect(page.getByRole('alert')).toHaveCount(0);
});
