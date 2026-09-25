import type { AlertRecord, IntegrationHealth, StatMetric } from '../types';

export const cityStats: StatMetric[] = [
    { label: 'Penduduk Klang', value: '1.18J', detail: 'Anggaran semasa', change: '+1.8%' },
    { label: 'Keluasan', value: '627 km²', detail: 'Kawasan pentadbiran' },
    { label: 'Aset dipantau', value: '2,134', detail: 'Daripada 14 sumber', change: '+32' },
    { label: 'Status bandar', value: 'Normal', detail: 'Dikemas kini 1 min lalu', tone: 'normal' },
];

export const alerts: AlertRecord[] = [
    {
        id: 'ALT-2026-001',
        title: 'Paras air melepasi tahap amaran',
        location: 'Sungai Klang - Jambatan Kota',
        source: 'Sensor IoT JPS-04',
        observedAt: '06:15:42',
        severity: 'critical',
        status: 'Baharu',
        description: 'Bacaan 4.2 m melepasi ambang amaran 4.0 m. Pengesahan operator diperlukan.',
    },
    {
        id: 'ALT-2026-002',
        title: 'Kenderaan berat dalam waktu sekatan',
        location: 'Jalan Tengku Kelana',
        source: 'AI Kamera CAM-021',
        observedAt: '06:12:09',
        severity: 'warning',
        status: 'Dalam tindakan',
        description: 'Lori komersial dikesan memasuki zon sekatan. Keyakinan model 94%.',
    },
    {
        id: 'ALT-2026-003',
        title: 'Aliran trafik kembali lancar',
        location: 'Persiaran Sultan Ibrahim',
        source: 'Waze Feed',
        observedAt: '06:08:11',
        severity: 'normal',
        status: 'Selesai',
        description: 'Masa perjalanan kembali kepada julat normal selepas penyuraian trafik.',
    },
];

export const integrations: IntegrationHealth[] = [
    { name: 'DSS Pro', category: 'CCTV', status: 'normal', latency: '45 ms', uptime: '99.8%' },
    { name: 'SUK Selangor', category: 'CCTV', status: 'normal', latency: '102 ms', uptime: '99.1%' },
    { name: 'Flight Hub', category: 'Dron', status: 'normal', latency: '88 ms', uptime: '99.2%' },
    { name: 'GES / iMAPS', category: 'GIS', status: 'warning', latency: '230 ms', uptime: '97.1%' },
    { name: 'eKompaun', category: 'Penguatkuasaan', status: 'warning', latency: '1.5 s', uptime: '95.3%' },
    { name: 'SKB', category: 'Kewangan', status: 'normal', latency: '180 ms', uptime: '99.8%' },
    { name: 'Direktori MBDK', category: 'Identiti', status: 'normal', latency: '95 ms', uptime: '99.6%' },
    { name: 'Waze', category: 'Trafik', status: 'normal', latency: '140 ms', uptime: '99.4%' },
    { name: 'WhatsApp Business', category: 'Notifikasi', status: 'normal', latency: '190 ms', uptime: '99.3%' },
    { name: 'Telegram Bot', category: 'Notifikasi', status: 'normal', latency: '70 ms', uptime: '99.6%' },
    { name: 'Email Gateway', category: 'Notifikasi', status: 'normal', latency: '50 ms', uptime: '99.9%' },
    { name: 'SMS Gateway', category: 'Notifikasi', status: 'critical', latency: 'Timeout', uptime: '92.1%' },
];

export const trendData = [
    { month: 'Jan', trafik: 68, aduan: 38 },
    { month: 'Feb', trafik: 72, aduan: 34 },
    { month: 'Mac', trafik: 65, aduan: 42 },
    { month: 'Apr', trafik: 77, aduan: 30 },
    { month: 'Mei', trafik: 82, aduan: 29 },
    { month: 'Jun', trafik: 74, aduan: 24 },
];

export const executiveTabs = [
    'Populasi Penduduk',
    'Low Carbon City',
    'Smart City',
    'Safe City',
    'Aduan',
    'Hasil & Belanja',
];

export const cameraFeeds = [
    ['CAM-001', 'Dewan Hamzah - Pintu Utama', 'normal'],
    ['CAM-014', 'Dewan Hamzah - Lobi', 'normal'],
    ['CAM-021', 'Jalan Tengku Kelana', 'warning'],
    ['CAM-032', 'Bulatan Kota', 'normal'],
    ['CAM-041', 'Pasar Jawa', 'normal'],
    ['CAM-046', 'Persiaran Sultan Ibrahim', 'normal'],
    ['CAM-052', 'Taman Rakyat', 'offline'],
    ['CAM-063', 'Kawasan Parkir Selatan', 'warning'],
] as const;

export const parkingZones = [
    { name: 'Parkir Dewan Hamzah', capacity: 180, available: 76, status: 'Sederhana' },
    { name: 'Parkir Pasar Jawa', capacity: 150, available: 18, status: 'Hampir penuh' },
    { name: 'Parkir MBDK HQ', capacity: 220, available: 84, status: 'Sederhana' },
    { name: 'Parkir Stesen KTM', capacity: 300, available: 42, status: 'Hampir penuh' },
    { name: 'Parkir Taman Bayu Perdana', capacity: 120, available: 89, status: 'Lapang' },
];

export const smartDomains = [
    { name: 'Smart Government', value: 73, count: '11/15', color: '#42a5ff' },
    { name: 'Smart Community', value: 75, count: '3/4', color: '#27b8ff' },
    { name: 'Smart Living', value: 76, count: '19/25', color: '#28d7a1' },
    { name: 'Smart Mobility', value: 86, count: '12/14', color: '#25c7d9' },
    { name: 'Smart Economy', value: 44, count: '4/9', color: '#eab630' },
    { name: 'Smart Environment', value: 70, count: '21/30', color: '#93d333' },
    { name: 'Digital Infrastructure', value: 100, count: '10/10', color: '#9c6cff' },
];
