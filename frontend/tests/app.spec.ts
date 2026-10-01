import { expect, test } from '@playwright/test';

test('public portal presents the URS civic landing content', async ({ page }, testInfo) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Selamat Datang ke/ })).toBeVisible();
    await expect(page.getByText('Urusan dalam talian')).toBeVisible();
    await expect(page.getByText('Keadaan bandar hari ini')).toBeVisible();
    await expect(page.getByRole('link', { name: /Log Masuk Kakitangan/ })).toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');

    await page.screenshot({ fullPage: true, path: testInfo.outputPath('public-portal.png') });
});

test('staff can complete the demo MFA flow and open the dashboard', async ({ page }, testInfo) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Jabatan Teknologi Maklumat/ }).click();
    await page.getByRole('button', { name: 'Teruskan dengan MFA' }).click();

    await expect(page.getByRole('heading', { name: 'Pengesahan MFA' })).toBeVisible();
    await page.getByRole('button', { name: 'Sahkan & buka dashboard' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard Pemantauan Bersepadu' })).toBeVisible();
    await expect(page.getByText('Situasi bandar semasa')).toBeVisible();

    await page.screenshot({ fullPage: true, path: testInfo.outputPath('dashboard.png') });
});

test('command centre opens from the dashboard header and presents the operational wallboard', async ({ page }, testInfo) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Jabatan Teknologi Maklumat/ }).click();
    await page.getByRole('button', { name: 'Teruskan dengan MFA' }).click();
    await page.getByRole('button', { name: 'Sahkan & buka dashboard' }).click();
    await expect(page.getByRole('navigation', { name: 'Navigasi modul' }).getByText('Command Centre')).toHaveCount(0);
    await page.getByRole('button', { name: 'Buka Command Centre' }).click();

    await expect(page).toHaveURL(/\/command-centre$/);
    await expect(page.getByRole('heading', { name: 'Command Centre' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Peta GIS Bandar Klang' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Paparan CCTV Langsung' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Status Sistem Penting' })).toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');

    await page.screenshot({ fullPage: true, path: testInfo.outputPath('command-centre.png') });

    await page.getByRole('button', { name: 'Kembali ke Dashboard Utama' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
});

test('IT persona can navigate every protected URS module', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Jabatan Teknologi Maklumat/ }).click();
    await page.getByRole('button', { name: 'Teruskan dengan MFA' }).click();
    await page.getByRole('button', { name: 'Sahkan & buka dashboard' }).click();

    const modules = [
        ['/command-centre', 'Command Centre'],
        ['/executive', 'Dashboard Eksekutif'],
        ['/cctv', 'Pemantauan CCTV & Amaran AI'],
        ['/drone', 'Pemantauan Operasi Dron'],
        ['/traffic', 'Trafik & Lampu Isyarat Pintar'],
        ['/disaster', 'Pengurusan Bencana'],
        ['/gis', 'Perancangan Bandar & GIS'],
        ['/parking', 'Pemantauan Parkir Awam'],
        ['/complaints', 'Aduan Awam'],
        ['/ai-analytics', 'Fungsi Integrasi & Analitik AI'],
        ['/smart-city', 'Smart City · Bandar Pintar Klang 2035'],
        ['/admin', 'Pentadbiran Sistem'],
    ] as const;

    for (const [path, heading] of modules) {
        await page.goto(path);
        await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
});

test('management persona is redirected away from restricted modules', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Pengurusan Atasan/ }).click();
    await page.getByRole('button', { name: 'Teruskan dengan MFA' }).click();
    await page.getByRole('button', { name: 'Sahkan & buka dashboard' }).click();

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard Pemantauan Bersepadu' })).toBeVisible();
});
