import { useState } from 'react';
import {
    AlertOctagon,
    BatteryCharging,
    CheckCircle2,
    ChevronRight,
    CircleParking,
    Drone,
    Gauge,
    Layers3,
    Navigation,
    Play,
    RadioTower,
    Route,
    Satellite,
    Search,
    Signal,
    Siren,
    TrafficCone,
    Truck,
    Video,
    Waves,
    X,
    Zap,
} from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { MapVisual } from '../components/MapVisual';
import { Panel, SourceFooter, StatusBadge } from '../components/ui';
import { alerts, cameraFeeds, parkingZones } from '../data/mock';

export function CctvPage() {
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
    const [grid, setGrid] = useState('4x4');

    return (
        <AppShell subtitle="Integrasi DSS Pro dan CCTV SUK Selangor" title="Pemantauan CCTV & Amaran AI">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2"><label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-ink-800 px-3 py-2"><Search size={14} className="text-slate-500" /><input aria-label="Cari kamera" className="w-40 bg-transparent text-[11px] text-white outline-none placeholder:text-slate-600" placeholder="Cari lokasi / kamera" /></label><select className="rounded-lg border border-slate-700 bg-ink-800 px-3 py-2 text-[10px] text-slate-300"><option>Semua sumber</option><option>DSS Pro</option><option>SUK Selangor</option></select></div>
                    <div className="flex items-center gap-2"><StatusBadge tone="normal">208 aktif</StatusBadge><StatusBadge tone="critical">3 amaran AI</StatusBadge><select aria-label="Saiz grid" className="rounded-lg border border-slate-700 bg-ink-800 px-3 py-2 text-[10px] text-slate-300" onChange={(event) => setGrid(event.target.value)} value={grid}><option>2x2</option><option>3x3</option><option>4x4</option><option>8x8</option></select></div>
                </div>

                <div className={`grid gap-2 ${grid === '2x2' ? 'grid-cols-1 md:grid-cols-2' : grid === '3x3' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'}`}>
                    {[...cameraFeeds, ...cameraFeeds].slice(0, grid === '2x2' ? 4 : grid === '3x3' ? 9 : grid === '8x8' ? 16 : 12).map(([id, name, status], index) => (
                        <button className="group relative h-44 overflow-hidden rounded-lg border border-slate-700 bg-slate-950 text-left hover:border-cyan-500/60" key={`${id}-${index}`} onClick={() => setSelectedCamera(`${id}-${index}`)} type="button">
                            <div className="absolute inset-0 soft-grid opacity-70" /><div className="absolute inset-0 flex items-center justify-center"><Video className="text-slate-700 group-hover:text-cyan-700" size={38} /></div>
                            <div className="absolute left-2 top-2 flex items-center gap-2"><StatusBadge tone={status}>{status === 'normal' ? 'Live' : status}</StatusBadge>{index === 2 && <StatusBadge tone="warning">AI: kenderaan</StatusBadge>}</div>
                            <div className="absolute inset-x-0 bottom-0 bg-ink-950/95 p-3"><p className="truncate text-[11px] font-semibold text-white">{name}</p><p className="mt-1 text-[9px] text-slate-500">{id} · 1080p · SIMULASI</p></div>
                        </button>
                    ))}
                </div>

                <Panel eyebrow="Amaran AI" title="Pengesanan terkini">
                    <div className="grid gap-3 p-3 md:grid-cols-3">{alerts.map((alert) => <article className="rounded-lg border border-slate-700 bg-slate-950/30 p-4" key={alert.id}><div className="flex items-center justify-between"><StatusBadge tone={alert.severity}>{alert.status}</StatusBadge><span className="text-[9px] text-slate-600">{alert.observedAt}</span></div><p className="mt-3 text-xs font-semibold text-slate-200">{alert.title}</p><p className="mt-2 text-[10px] leading-5 text-slate-500">{alert.location} · {alert.source}</p><button className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-cyan-300" type="button">Semak amaran <ChevronRight size={12} /></button></article>)}</div>
                </Panel>
            </div>

            {selectedCamera && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-5"><div className="w-full max-w-5xl overflow-hidden rounded-xl border border-slate-700 bg-ink-900"><header className="flex items-center justify-between border-b border-slate-700 px-4 py-3"><div><p className="text-sm font-semibold text-white">Dewan Hamzah · Paparan penuh</p><p className="mt-1 text-[10px] text-slate-500">SIMULASI · DSS Pro · 1080p</p></div><button aria-label="Tutup paparan" onClick={() => setSelectedCamera(null)} type="button"><X size={20} /></button></header><div className="soft-grid flex aspect-video items-center justify-center"><Play className="text-cyan-300" size={60} /></div><div className="flex flex-wrap items-center gap-3 p-4"><button className="rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white" type="button">Main semula</button><button className="rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-semibold text-slate-300" type="button">Tanda peristiwa</button><div className="ml-auto text-[10px] text-slate-500">Latensi simulasi: 1.2s</div></div></div></div>}
        </AppShell>
    );
}

export function DronePage() {
    const fleet = [
        { name: 'MBDK Drone Alpha', status: 'Terbang', battery: 72, altitude: '120 m', signal: 'Kuat' },
        { name: 'MBDK Drone Beta', status: 'Sedia', battery: 95, altitude: '0 m', signal: 'Kuat' },
        { name: 'MBDK Drone Gamma', status: 'Mengecas', battery: 34, altitude: '0 m', signal: 'Luar talian' },
    ];

    return <AppShell subtitle="Data telemetri dan suapan simulasi Flight Hub" title="Pemantauan Operasi Dron"><div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <Panel eyebrow="Armada" title="Unit dron MBDK"><div className="divide-y divide-slate-700/50">{fleet.map((drone, index) => <button className={`w-full p-4 text-left ${index === 0 ? 'bg-cyan-500/8' : 'hover:bg-slate-800/30'}`} key={drone.name} type="button"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-semibold text-slate-200"><Drone size={15} className="text-cyan-300" />{drone.name}</span><StatusBadge tone={drone.status === 'Terbang' ? 'normal' : drone.status === 'Sedia' ? 'info' : 'warning'}>{drone.status}</StatusBadge></div><div className="mt-3 grid grid-cols-3 gap-2 text-[9px] text-slate-500"><span><b className="block text-slate-300">{drone.battery}%</b>Bateri</span><span><b className="block text-slate-300">{drone.altitude}</b>Altitud</span><span><b className="block text-slate-300">{drone.signal}</b>Isyarat</span></div></button>)}</div></Panel>
        <div className="grid gap-4">
            <Panel action={<StatusBadge tone="normal">1 Hz</StatusBadge>} eyebrow="Jejakan langsung" title="MBDK Drone Alpha"><MapVisual compact /><SourceFooter source="Flight Hub · telemetri simulasi" updated="sekarang" /></Panel>
            <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
                <Panel action={<StatusBadge tone="critical">Simulasi</StatusBadge>} eyebrow="Suapan video" title="Pandangan udara"><div className="soft-grid flex h-56 items-center justify-center"><div className="text-center"><Satellite className="mx-auto text-slate-600" size={38} /><p className="mt-2 text-[10px] text-slate-600">Video Flight Hub akan dipaparkan di sini</p></div></div></Panel>
                <Panel eyebrow="Telemetri" title="Status penerbangan"><div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">{[[BatteryCharging, 'Bateri', '72%', 'normal'], [Gauge, 'Ketinggian', '120 m', 'info'], [Navigation, 'Kelajuan', '15.5 km/j', 'info'], [Signal, 'Kawalan', 'Kuat', 'normal']].map(([Icon, label, value, tone]) => <div className="rounded-lg border border-slate-700 bg-slate-950/40 p-3" key={label as string}><Icon size={16} className="text-cyan-300" /><p className="mt-3 text-lg font-semibold text-white">{value as string}</p><p className="mt-1 text-[9px] text-slate-500">{label as string}</p><div className="mt-2"><StatusBadge tone={tone as 'normal' | 'info'}>stabil</StatusBadge></div></div>)}</div><div className="border-t border-slate-700/50 px-4 py-3 text-[10px] text-slate-500">Koordinat terakhir: 3.0449, 101.4456 · Laluan dikemas kini setiap saat</div></Panel>
            </div>
        </div>
    </div></AppShell>;
}

export function TrafficPage() {
    const roads = [
        ['Jalan Meru', 'Lancar', 'normal'], ['Jalan Tengku Kelana', 'Sesak', 'critical'], ['Persiaran Sultan Ibrahim', 'Perlahan', 'warning'], ['Jalan Kapar', 'Lancar', 'normal'],
    ] as const;
    return <AppShell subtitle="Aliran trafik, lampu isyarat, jalan dan penguatkuasaan" title="Trafik & Lampu Isyarat Pintar"><div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3">{[['Aliran kenderaan', '840 / jam', TrafficCone], ['Persimpangan aktif', '36', Zap], ['Anomali semasa', '1', AlertOctagon]].map(([label, value, Icon]) => <div className="panel flex items-center gap-4 p-4" key={label as string}><span className="rounded-xl bg-cyan-500/10 p-3 text-cyan-300"><Icon size={18} /></span><span><b className="block text-xl text-white">{value as string}</b><span className="text-[10px] text-slate-500">{label as string}</span></span></div>)}</div>
        <div className="grid gap-4 xl:grid-cols-[1.4fr_.6fr]"><Panel action={<StatusBadge tone="info">Kod warna masa nyata</StatusBadge>} eyebrow="Peta trafik" title="Ketumpatan jalan utama"><MapVisual /><SourceFooter source="Waze · kamera awam · simulasi" /></Panel><Panel eyebrow="Status segmen" title="Jalan dipantau"><div className="divide-y divide-slate-700/50">{roads.map(([road, status, tone]) => <button className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-800/30" key={road} type="button"><span><span className="block text-xs font-semibold text-slate-200">{road}</span><span className="mt-1 block text-[9px] text-slate-600">Dikemas kini 30s lalu</span></span><StatusBadge tone={tone}>{status}</StatusBadge></button>)}</div></Panel></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{[[Zap, 'Lampu Isyarat', '34 normal · 2 penyelenggaraan'], [RadioTower, 'Lampu Jalan', '1,246 aktif · 7 rosak'], [Truck, 'Tunda Kenderaan', '3 unit bertugas'], [TrafficCone, 'Kenderaan Berat', '2 amaran hari ini'], [AlertOctagon, 'Halangan Jalan', '1 insiden aktif'], [Route, 'Maklumat Warta', '18 zon dipaparkan']].map(([Icon, title, detail]) => <button className="panel flex items-center gap-4 p-4 text-left hover:border-cyan-500/30" key={title as string} type="button"><span className="rounded-lg bg-slate-800 p-3 text-cyan-300"><Icon size={17} /></span><span><span className="block text-xs font-semibold text-slate-200">{title as string}</span><span className="mt-1 block text-[10px] text-slate-500">{detail as string}</span></span><ChevronRight className="ml-auto text-slate-600" size={14} /></button>)}</div>
    </div></AppShell>;
}

export function DisasterPage() {
    return <AppShell subtitle="Pengesanan awal, pengesahan operator dan penyelarasan SOP" title="Pengurusan Bencana"><div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3">{[['Kritikal', '1', 'critical'], ['Amaran', '2', 'warning'], ['Normal', '3', 'normal']].map(([label, value, tone]) => <div className="panel p-4" key={label}><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-300">{label}</span><StatusBadge tone={tone as 'critical' | 'warning' | 'normal'}>{label}</StatusBadge></div><p className="mt-3 text-3xl font-bold text-white">{value}</p></div>)}</div>
        <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]"><Panel action={<StatusBadge tone="critical">Sasaran &lt;30 saat</StatusBadge>} eyebrow="Amaran aktif" title="Insiden semasa"><div className="divide-y divide-slate-700/50">{alerts.map((alert, index) => <article className="p-4" key={alert.id}><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><Siren size={15} className={alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'} /><p className="text-xs font-semibold text-slate-200">{alert.title}</p></div><StatusBadge tone={alert.severity}>{alert.status}</StatusBadge></div><p className="mt-2 text-[10px] text-slate-500">{alert.location} · {alert.observedAt}</p><p className="mt-2 text-[11px] leading-5 text-slate-400">{alert.description}</p>{index === 0 && <div className="mt-3 flex flex-wrap gap-2"><button className="rounded-lg bg-red-600 px-3 py-2 text-[10px] font-semibold text-white" type="button">Sahkan amaran</button><button className="rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-semibold text-slate-300" type="button">Aktifkan SOP banjir</button><button className="rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-semibold text-slate-300" type="button">Pratonton hebahan</button></div>}</article>)}</div></Panel><Panel eyebrow="Kawasan terjejas" title="Peta zon bencana"><MapVisual compact /><div className="grid grid-cols-2 gap-2 p-3">{[[Waves, 'Paras air', '4.2 m'], [Signal, 'Sensor', '6/6 aktif']].map(([Icon, label, value]) => <div className="rounded-lg border border-slate-700 p-3" key={label as string}><Icon className="text-cyan-300" size={15} /><p className="mt-2 text-sm font-semibold text-white">{value as string}</p><p className="text-[9px] text-slate-500">{label as string}</p></div>)}</div></Panel></div>
        <Panel eyebrow="Aliran kerja" title="SOP banjir kilat · ALT-2026-001"><div className="grid gap-3 p-4 md:grid-cols-4">{['Sahkan bacaan sensor', 'Maklumkan bilik kawalan', 'Aktifkan pasukan lapangan', 'Hantar hebahan awam'].map((step, index) => <div className="rounded-lg border border-slate-700 p-3" key={step}><div className="flex items-center gap-2">{index < 2 ? <CheckCircle2 className="text-emerald-400" size={16} /> : <span className="flex size-4 items-center justify-center rounded-full border border-slate-600 text-[8px] text-slate-500">{index + 1}</span>}<span className="text-[10px] font-semibold text-slate-300">{step}</span></div></div>)}</div><SourceFooter source="IoT · JPS · MET · JAS" updated="8 saat lalu" /></Panel>
    </div></AppShell>;
}

export function GisPage() {
    const layers = ['CCTV', 'Trafik', 'Parkir', 'Bencana', 'Aduan', 'Aset MBDK', 'Sempadan Zon'];
    return <AppShell subtitle="Lapisan spatial GES/iMAPS dan analitik hotspot" title="Perancangan Bandar & GIS"><div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <Panel eyebrow="Lapisan peta" title="Kawalan paparan"><div className="p-3"><label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2"><Search size={13} className="text-slate-500" /><input className="min-w-0 flex-1 bg-transparent text-[10px] text-white outline-none" placeholder="Cari aset atau lokasi" /></label><div className="mt-4 flex flex-col gap-2">{layers.map((layer, index) => <label className="flex items-center justify-between rounded-lg border border-slate-700/60 px-3 py-2.5 text-[11px] text-slate-300" key={layer}><span className="flex items-center gap-2"><Layers3 size={13} className="text-cyan-300" />{layer}</span><input defaultChecked={index < 4} type="checkbox" /></label>)}</div></div></Panel>
        <Panel action={<StatusBadge tone="normal">7 lapisan tersedia</StatusBadge>} eyebrow="GES / iMAPS" title="Kanvas peta interaktif"><MapVisual /><div className="grid gap-2 p-3 sm:grid-cols-3">{[['Aset dipaparkan', '1,246'], ['Hotspot aktif', '8'], ['Zon pentadbiran', '24']].map(([label, value]) => <div className="rounded-lg border border-slate-700 p-3" key={label}><p className="text-lg font-semibold text-white">{value}</p><p className="mt-1 text-[9px] text-slate-500">{label}</p></div>)}</div><SourceFooter source="GES / iMAPS · raster + vektor" /></Panel>
    </div></AppShell>;
}

export function ParkingPage() {
    const [tab, setTab] = useState<'availability' | 'anpr'>('availability');
    return <AppShell subtitle="Ketersediaan ruang, pelanggaran parkir dan ANPR" title="Pemantauan Parkir Awam"><div className="flex flex-col gap-4">
        <div className="flex items-center gap-2"><button className={`rounded-lg px-3 py-2 text-[10px] font-semibold ${tab === 'availability' ? 'bg-blue-600 text-white' : 'border border-slate-700 text-slate-400'}`} onClick={() => setTab('availability')} type="button">Ketersediaan parkir</button><button className={`rounded-lg px-3 py-2 text-[10px] font-semibold ${tab === 'anpr' ? 'bg-blue-600 text-white' : 'border border-slate-700 text-slate-400'}`} onClick={() => setTab('anpr')} type="button">ANPR · Pengecaman plat</button></div>
        {tab === 'availability' ? <><div className="grid gap-3 sm:grid-cols-4">{[['Purata penggunaan', '70%'], ['Jumlah petak', '830'], ['Tersedia', '253'], ['Hampir penuh', '1 zon']].map(([label, value], index) => <div className="panel p-4" key={label}><p className="text-[10px] text-slate-500">{label}</p><p className={`mt-2 text-2xl font-semibold ${index === 2 ? 'text-emerald-400' : index === 3 ? 'text-red-400' : 'text-white'}`}>{value}</p></div>)}</div><div className="grid gap-4 xl:grid-cols-[1fr_.55fr]"><Panel eyebrow="Zon parkir" title="Ketersediaan semasa"><div className="grid gap-3 p-3 sm:grid-cols-2">{parkingZones.map((zone) => { const used = zone.capacity - zone.available; const percentage = Math.round((used / zone.capacity) * 100); return <article className="rounded-lg border border-slate-700 p-4" key={zone.name}><div className="flex justify-between gap-3"><p className="text-xs font-semibold text-slate-200">{zone.name}</p><StatusBadge tone={percentage > 80 ? 'critical' : percentage > 55 ? 'warning' : 'normal'}>{zone.status}</StatusBadge></div><div className="mt-4 h-1.5 rounded-full bg-slate-800"><div className={`h-1.5 rounded-full ${percentage > 80 ? 'bg-red-400' : percentage > 55 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${percentage}%` }} /></div><div className="mt-2 flex justify-between text-[9px] text-slate-500"><span>{zone.available} tersedia</span><span>{percentage}% digunakan</span></div></article>; })}</div></Panel><Panel eyebrow="Lokasi terpilih" title="Paparan petak"><div className="soft-grid flex h-full min-h-72 items-center justify-center"><div className="text-center"><CircleParking className="mx-auto text-slate-600" size={50} /><p className="mt-3 text-[10px] text-slate-600">Pilih zon untuk melihat susun atur petak</p></div></div></Panel></div></> : <Panel action={<StatusBadge tone="warning">Sasaran ketepatan &gt;95%</StatusBadge>} eyebrow="ANPR" title="Log pengecaman nombor plat"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-[10px]"><thead className="border-b border-slate-700 text-slate-500"><tr>{['Plat', 'Jenis', 'Kamera', 'Lokasi', 'Masa', 'Keyakinan', 'Arah', 'Status'].map((head) => <th className="px-4 py-3 font-semibold" key={head}>{head}</th>)}</tr></thead><tbody className="divide-y divide-slate-700/40">{[['BKL 4321', 'Kereta', 'CAM-003', 'Jalan Meru', '06:33:20', '97%', 'Masuk', 'Semak imej'], ['BDB 8889', 'SUV', 'CAM-003', 'Bulatan Kota', '06:31:05', '95%', 'Keluar', 'Disahkan'], ['WXA 1234', 'Motosikal', 'CAM-004', 'Jalan Tengku Kelana', '06:28:17', '81%', 'Masuk', 'Perlu semakan'], ['BCT 5566', 'Lori', 'CAM-009', 'Jalan Meru', '06:22:48', '99%', 'Masuk', 'Hantar eKompaun']].map((row) => <tr className="hover:bg-slate-800/30" key={row[0]}>{row.map((cell, index) => <td className={`px-4 py-3 ${index === 0 ? 'font-bold text-white' : 'text-slate-400'}`} key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody></table></div><SourceFooter source="ANPR · data sintetik" /></Panel>}
    </div></AppShell>;
}
