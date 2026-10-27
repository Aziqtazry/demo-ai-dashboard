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

test('staff can switch themes and retain their choice across navigation and reloads', async ({ page }, testInfo) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Jabatan Teknologi Maklumat/ }).click();
    await page.getByRole('button', { name: 'Teruskan dengan MFA' }).click();
    await page.getByRole('button', { name: 'Sahkan & buka dashboard' }).click();

    const shell = page.locator('.app-shell');
    await expect(shell).toHaveCSS('background-color', 'rgb(5, 11, 22)');
    await page.getByRole('button', { name: 'Aktifkan light mode' }).click();
    await expect(shell).toHaveCSS('background-color', 'rgb(241, 245, 249)');
    await expect(page.getByRole('heading', { name: 'Dashboard Pemantauan Bersepadu' })).toHaveCSS('color', 'oklch(0.208 0.042 265.755)');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Aktifkan dark mode' })).toHaveAttribute('aria-pressed', 'true');
    await page.screenshot({ fullPage: true, animations: 'disabled', path: testInfo.outputPath('dashboard-light.png') });

    await page.getByRole('button', { name: 'Buka Command Centre' }).click();
    await expect(page).toHaveURL(/\/command-centre$/);
    await expect(shell).toHaveCSS('background-color', 'rgb(241, 245, 249)');
    await page.screenshot({ fullPage: true, animations: 'disabled', path: testInfo.outputPath('command-centre-light.png') });
    await page.getByRole('button', { name: 'Aktifkan dark mode' }).click();
    await expect(shell).toHaveCSS('background-color', 'rgb(5, 11, 22)');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Aktifkan light mode' })).toHaveAttribute('aria-pressed', 'false');
});

test('header keeps the theme toggle between Command Centre and weather without overflow', async ({ page }, testInfo) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Jabatan Teknologi Maklumat/ }).click();
    await page.getByRole('button', { name: 'Teruskan dengan MFA' }).click();
    await page.getByRole('button', { name: 'Sahkan & buka dashboard' }).click();

    const widths = testInfo.project.name.startsWith('mobile') ? [320, 393, 768] : [1280, 1536, 1920];
    for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const command = await page.getByRole('button', { name: 'Buka Command Centre' }).boundingBox();
        const toggle = await page.getByRole('button', { name: 'Aktifkan light mode' }).boundingBox();
        expect(command).not.toBeNull();
        expect(toggle).not.toBeNull();
        expect(command!.x + command!.width).toBeLessThanOrEqual(toggle!.x);
        if (width >= 1280) {
            const weather = await page.locator('header').getByText(/28.*Klang/).boundingBox();
            expect(weather).not.toBeNull();
            expect(toggle!.x + toggle!.width).toBeLessThanOrEqual(weather!.x);
            expect(Math.abs(command!.y - toggle!.y)).toBeLessThan(8);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
});

test('CCTV demo feeds autoplay, loop and keep playing in every CCTV view', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.goto('/login');
    await page.getByRole('button', { name: /Jabatan Teknologi Maklumat/ }).click();
    await page.getByRole('button', { name: 'Teruskan dengan MFA' }).click();
    await page.getByRole('button', { name: 'Sahkan & buka dashboard' }).click();

    for (const path of ['/dashboard', '/command-centre', '/cctv']) {
        await page.goto(path);
        const videos = page.locator('video');
        for (const index of [0, 1]) {
            const video = videos.nth(index);
            await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2);
            await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
            await expect(video).toHaveAttribute('src', `/cctv_demo/cctv_demo_${index + 1}_edited.mp4`);
            expect(await video.evaluate((element: HTMLVideoElement) => element.controls)).toBe(false);
            expect(await video.evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
        }
        const first = videos.first();
        await first.evaluate((video: HTMLVideoElement) => video.pause());
        await expect.poll(() => first.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
        await first.evaluate((video: HTMLVideoElement) => { video.currentTime = video.duration - 0.25; });
        await expect.poll(() => first.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeLessThan(3);
    }

    const secondTile = page.getByRole('button', { name: /Buka kamera/ }).nth(1);
    await secondTile.click();
    const dialog = page.getByRole('dialog', { name: 'Paparan penuh CCTV' });
    await expect(dialog).toContainText('Dewan Hamzah - Lobi');
    const expanded = dialog.locator('video');
    await expect(expanded).toHaveAttribute('src', '/cctv_demo/cctv_demo_2_edited.mp4');
    await expect.poll(() => expanded.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
    await expect(dialog.getByRole('button', { name: 'Main semula' })).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath('cctv-demo.png') });
    await dialog.getByRole('button', { name: 'Tutup paparan' }).click();
    await expect(dialog).toHaveCount(0);
});
