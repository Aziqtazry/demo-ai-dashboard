import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    BellRing,
    Bike,
    Camera,
    Car,
    CheckCircle2,
    CloudSun,
    Drone,
    Flame,
    Landmark,
    Lightbulb,
    MessageSquareText,
    ParkingCircle,
    Radio,
    ShieldAlert,
    Siren,
    TrafficCone,
    Users,
    Waves,
    Wifi,
} from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { MapVisual } from '../components/MapVisual';
import { cameraFeeds, integrations, parkingZones, smartDomains } from '../data/mock';

type Tone = 'cyan' | 'emerald' | 'amber' | 'red' | 'violet';

const toneClasses: Record<Tone, { icon: string; glow: string; bar: string }> = {
    cyan: { icon: 'text-cyan-300', glow: 'bg-cyan-400/10', bar: 'bg-cyan-400' },
    emerald: { icon: 'text-emerald-300', glow: 'bg-emerald-400/10', bar: 'bg-emerald-400' },
    amber: { icon: 'text-amber-300', glow: 'bg-amber-400/10', bar: 'bg-amber-400' },
    red: { icon: 'text-red-300', glow: 'bg-red-400/10', bar: 'bg-red-400' },
    violet: { icon: 'text-violet-300', glow: 'bg-violet-400/10', bar: 'bg-violet-400' },
};

const headlineMetrics: Array<{ label: string; value: string; detail: string; icon: LucideIcon; tone: Tone }> = [
    { label: 'CCTV', value: '1,250', detail: '1,080 online', icon: Camera, tone: 'cyan' },
    { label: 'Dron aktif', value: '15', detail: '6 dalam misi', icon: Drone, tone: 'violet' },
    { label: 'Lampu isyarat', value: '132', detail: '118 normal', icon: TrafficCone, tone: 'emerald' },
    { label: 'Aduan hari ini', value: '128', detail: '98 selesai', icon: MessageSquareText, tone: 'cyan' },
    { label: 'Parkir awam', value: '3,850', detail: '1,256 kosong', icon: ParkingCircle, tone: 'emerald' },
    { label: 'Amaran bencana', value: '5', detail: 'Perlu tindakan', icon: AlertTriangle, tone: 'red' },
    { label: 'Cuaca Klang', value: '28°C', detail: 'Hujan sederhana', icon: CloudSun, tone: 'amber' },
];

const eventFeed = [
    ['10:28', 'Amaran banjir di Sg. Jati', 'red'],
    ['10:15', 'Lampu isyarat rosak di Persiaran Raja Muda', 'amber'],
    ['10:05', 'Kompaun baharu dikeluarkan di Jalan Kapar', 'cyan'],
    ['09:58', 'Aduan sampah diterima di Taman Rakyat', 'emerald'],
    ['09:40', 'Titik panas dikesan di kawasan Kapar', 'red'],
] as const;

function WallPanel({ title, action, children, className = '' }: { title: string; action?: string; children: React.ReactNode; className?: string }) {
    return (
        <section className={`min-w-0 overflow-hidden rounded-lg border border-cyan-950 bg-[#08182a] shadow-[inset_0_1px_0_rgba(56,189,248,.05)] ${className}`}>
            <header className="flex h-9 items-center justify-between gap-3 border-b border-cyan-950 bg-[#0a1d32] px-3">
                <h2 className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-slate-200">{title}</h2>
                {action && <span className="shrink-0 text-[9px] font-semibold text-cyan-400">{action}</span>}
            </header>
            {children}
        </section>
    );
}

function MetricTile({ label, value, detail, icon: Icon, tone }: (typeof headlineMetrics)[number]) {
    const styles = toneClasses[tone];

    return (
        <article className="flex min-w-32 items-center gap-2 rounded-lg border border-cyan-950 bg-[#091a2d] px-3 py-2">
            <span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${styles.glow} ${styles.icon}`}><Icon size={17} /></span>
            <span className="min-w-0">
                <span className="block truncate text-[8px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
                <span className="block text-lg font-bold leading-5 tabular-nums text-slate-100">{value}</span>
                <span className="block truncate text-[8px] text-slate-500">{detail}</span>
            </span>
        </article>
    );
}

function CameraTile({ name, index }: { name: string; index: number }) {
    return (
        <div className="relative min-h-24 overflow-hidden bg-[#07111e]">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 240 120" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`road-${index}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#1b3449" /><stop offset="1" stopColor="#07111e" /></linearGradient>
                </defs>
                <rect width="240" height="120" fill="#0b2132" />
                <path d="M80 120 L112 38 L132 38 L177 120Z" fill={`url(#road-${index})`} />
                <path d="M121 48 L126 48 M117 61 L130 61 M111 80 L138 80 M102 106 L151 106" stroke="#d8d09c" strokeWidth="2" strokeDasharray="6 7" opacity=".6" />
                <path d="M0 76 L102 51 M240 79 L139 52" stroke="#233f4f" strokeWidth="5" />
                {Array.from({ length: 5 }, (_, carIndex) => <rect key={carIndex} x={99 + carIndex * 12} y={70 + (carIndex % 2) * 18} width="9" height="5" rx="1" fill={carIndex === 2 ? '#f59e0b' : '#7dd3fc'} />)}
            </svg>
            <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-emerald-500/85 px-1.5 py-0.5 text-[7px] font-bold text-white"><Radio size={7} /> LIVE</span>
            <div className="absolute inset-x-0 bottom-0 bg-slate-950/85 px-2 py-1 text-[8px] text-slate-300">{name}</div>
        </div>
    );
}

function MiniBar({ label, value, tone = 'cyan' }: { label: string; value: number; tone?: Tone }) {
    return (
        <div>
            <div className="flex items-center justify-between text-[8px] text-slate-400"><span>{label}</span><span className="font-semibold tabular-nums text-slate-200">{value}%</span></div>
            <div className="mt-1 h-1 rounded-full bg-slate-800"><div className={`h-1 rounded-full ${toneClasses[tone].bar}`} style={{ width: `${value}%` }} /></div>
        </div>
    );
}

export function CommandCentrePage() {
    return (
        <AppShell subtitle="Paparan operasi bersepadu untuk pusat kawalan bandar pintar" title="Command Centre">
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-1 xl:grid xl:grid-cols-7 xl:overflow-visible xl:pb-0">
                    {headlineMetrics.map((metric) => <MetricTile key={metric.label} {...metric} />)}
                </div>

                <div className="grid gap-3 xl:grid-cols-12">
                    <WallPanel action="12 lapisan aktif" className="xl:col-span-7" title="Peta GIS Bandar Klang">
                        <div className="grid min-h-80 sm:grid-cols-[140px_1fr] [&>.soft-grid]:h-[360px] xl:[&>.soft-grid]:h-[480px]">
                            <div className="hidden border-r border-cyan-950 bg-[#071421] p-3 sm:block">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Lapisan peta</p>
                                <div className="mt-3 flex flex-col gap-2">
                                    {[
                                        ['CCTV', Camera, 'text-cyan-300'],
                                        ['Traffic light', TrafficCone, 'text-emerald-300'],
                                        ['Street light', Lightbulb, 'text-amber-300'],
                                        ['Parkir awam', ParkingCircle, 'text-violet-300'],
                                        ['Lokasi aduan', BellRing, 'text-red-300'],
                                        ['Kawasan banjir', Waves, 'text-blue-300'],
                                    ].map(([label, Icon, color]) => (
                                        <div className="flex items-center gap-2 text-[9px] text-slate-400" key={label as string}><Icon className={color as string} size={11} /><span>{label as string}</span><CheckCircle2 className="ml-auto text-emerald-500" size={10} /></div>
                                    ))}
                                </div>
                                <div className="mt-5 border-t border-cyan-950 pt-3"><p className="text-[8px] text-slate-600">Zon DUN</p><div className="mt-1 rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-[9px] text-slate-300">Semua zon</div></div>
                            </div>
                            <MapVisual />
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-cyan-950 border-t border-cyan-950 sm:grid-cols-6">
                            {[['CCTV', '1,250'], ['Traffic', '132'], ['Lampu', '2,630'], ['Parkir', '3,850'], ['Aduan', '128'], ['Hotspot', '23']].map(([label, value]) => <div className="px-2 py-2 text-center" key={label}><p className="text-[8px] uppercase text-slate-600">{label}</p><p className="text-sm font-bold tabular-nums text-slate-200">{value}</p></div>)}
                        </div>
                    </WallPanel>

                    <WallPanel action="Lihat semua" className="xl:col-span-3" title="Paparan CCTV Langsung">
                        <div className="grid h-[480px] grid-cols-2 grid-rows-3 gap-px bg-cyan-950">
                            {cameraFeeds.slice(0, 6).map((camera, index) => <CameraTile index={index} key={camera[0]} name={camera[1]} />)}
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-cyan-950 border-t border-cyan-950 bg-[#071421]">
                            {[['ANPR', '1,245'], ['Vehicle', '1,582'], ['People', '346']].map(([label, value]) => <div className="p-2 text-center" key={label}><p className="text-[8px] text-slate-600">{label}</p><p className="text-xs font-bold text-cyan-300">{value}</p></div>)}
                        </div>
                    </WallPanel>

                    <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-1">
                        <WallPanel title="Status Sistem Penting">
                            <div className="divide-y divide-cyan-950/80">
                                {integrations.slice(0, 7).map((integration) => <div className="flex items-center gap-2 px-3 py-2 text-[8px]" key={integration.name}><Wifi className={integration.status === 'normal' ? 'text-cyan-400' : 'text-amber-400'} size={10} /><span className="min-w-0 flex-1 truncate text-slate-400">{integration.name}</span><span className={integration.status === 'normal' ? 'text-emerald-400' : 'text-amber-400'}>● {integration.status === 'normal' ? 'Online' : 'Perhatian'}</span></div>)}
                            </div>
                        </WallPanel>
                        <WallPanel action="Lihat semua" title="Notifikasi Terkini">
                            <div className="divide-y divide-cyan-950/80">
                                {eventFeed.map(([time, event, tone]) => <div className="flex gap-2 px-3 py-2" key={`${time}-${event}`}><span className={`mt-0.5 size-1.5 shrink-0 rounded-full ${toneClasses[tone].bar}`} /><span className="text-[8px] tabular-nums text-slate-600">{time}</span><p className="text-[8px] leading-3 text-slate-400">{event}</p></div>)}
                            </div>
                        </WallPanel>
                    </div>

                    <WallPanel className="xl:col-span-3" title="Trafik & Lampu Isyarat Pintar">
                        <div className="grid h-full grid-cols-[1.15fr_.85fr]">
                            <div className="soft-grid relative min-h-52 overflow-hidden border-r border-cyan-950">
                                <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 300 210"><path d="M20 190 L122 110 L280 28 M-20 90 L130 112 L320 165" fill="none" stroke="#203c50" strokeWidth="24" /><path d="M20 190 L122 110 L280 28 M-20 90 L130 112 L320 165" fill="none" stroke="#fbbf24" strokeDasharray="3 12" strokeWidth="2" opacity=".7" /><circle cx="124" cy="111" r="8" fill="#ef4444" /><circle cx="201" cy="72" r="6" fill="#22c55e" /></svg>
                            </div>
                            <div className="flex flex-col justify-center gap-4 p-3">
                                <MiniBar label="Normal" tone="emerald" value={89} /><MiniBar label="Kesesakan" tone="amber" value={32} /><MiniBar label="Gangguan" tone="red" value={11} />
                                <div className="rounded-md bg-amber-400/10 p-2 text-center"><p className="text-xl font-black text-amber-300">32%</p><p className="text-[8px] uppercase text-amber-200/60">Kesesakan semasa</p></div>
                            </div>
                        </div>
                    </WallPanel>

                    <WallPanel className="xl:col-span-2" title="Smart Street Light">
                        <div className="grid min-h-52 grid-cols-2">
                            <div className="relative overflow-hidden border-r border-cyan-950 bg-gradient-to-b from-[#11283d] to-[#050b16]"><Lightbulb className="absolute left-1/2 top-1/3 -translate-x-1/2 text-amber-200 drop-shadow-[0_0_18px_rgba(253,224,71,.9)]" size={42} /><div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-950 to-transparent" /></div>
                            <div className="flex flex-col gap-3 p-3 text-[8px]"><div><p className="text-slate-500">Jumlah lampu</p><p className="text-xl font-bold text-slate-100">2,630</p></div><p className="text-emerald-400">2,410 berfungsi</p><p className="text-red-400">220 tidak berfungsi</p><MiniBar label="Penjimatan tenaga" tone="emerald" value={18} /></div>
                        </div>
                    </WallPanel>

                    <WallPanel className="xl:col-span-3" title="Pengurusan Bencana">
                        <div className="grid min-h-52 grid-cols-3 divide-x divide-cyan-950">
                            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center"><Waves className="text-cyan-300" size={30} /><p className="text-[8px] text-slate-500">Paras air</p><p className="text-xl font-bold text-cyan-200">2.35 m</p><span className="text-[8px] text-emerald-400">Normal</span></div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center"><CloudSun className="text-slate-300" size={30} /><p className="text-[8px] text-slate-500">MET Malaysia</p><p className="text-xl font-bold text-slate-200">28°C</p><span className="text-[8px] text-slate-500">Hujan sederhana</span></div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center"><Flame className="text-red-400" size={30} /><p className="text-[8px] text-slate-500">Titik panas</p><p className="text-xl font-bold text-red-300">23</p><span className="text-[8px] text-red-400">5 amaran aktif</span></div>
                        </div>
                    </WallPanel>

                    <WallPanel className="xl:col-span-2" title="Operasi Dron">
                        <div className="flex min-h-52 items-center gap-4 p-4"><div className="flex size-24 shrink-0 items-center justify-center rounded-full border border-violet-400/20 bg-violet-400/5"><Drone className="text-violet-300" size={48} /></div><div className="flex flex-col gap-2 text-[9px]"><p className="text-slate-500">Dron aktif <span className="float-right pl-4 font-bold text-slate-100">15</span></p><p className="text-slate-500">Dalam misi <span className="float-right pl-4 font-bold text-emerald-300">6</span></p><p className="text-slate-500">Bersedia <span className="float-right pl-4 font-bold text-cyan-300">9</span></p><p className="text-slate-500">Jarak hari ini <span className="float-right pl-4 font-bold text-slate-100">12 km</span></p></div></div>
                    </WallPanel>

                    <WallPanel className="xl:col-span-2" title="Parkir Awam">
                        <div className="flex min-h-52 flex-col justify-center gap-3 p-4"><div className="flex items-center gap-4"><div className="flex size-20 items-center justify-center rounded-full border-[9px] border-cyan-400/20 border-t-cyan-400 text-lg font-black text-cyan-200">66%</div><div className="text-[8px] text-slate-500"><p><span className="font-bold text-emerald-400">1,256</span> kosong</p><p className="mt-2"><span className="font-bold text-red-400">2,594</span> terisi</p><p className="mt-2">3,850 jumlah</p></div></div>{parkingZones.slice(0, 3).map((zone, index) => <MiniBar key={zone.name} label={zone.name} tone={index === 0 ? 'cyan' : 'amber'} value={[78, 63, 54][index]} />)}</div>
                    </WallPanel>

                    <WallPanel className="xl:col-span-5" title="7 Komponen Bandar Pintar">
                        <div className="grid min-h-44 grid-cols-2 gap-px bg-cyan-950 sm:grid-cols-4 xl:grid-cols-7">
                            {smartDomains.map((domain, index) => {
                                const icons = [Landmark, Users, Lightbulb, Bike, ShieldAlert, Wifi, Siren];
                                const Icon = icons[index];
                                return <div className="flex flex-col items-center justify-center gap-2 bg-[#09192b] p-3 text-center" key={domain.name}><Icon size={21} style={{ color: domain.color }} /><p className="text-[8px] font-semibold uppercase leading-3 text-slate-300">{domain.name}</p><div className="flex size-10 items-center justify-center rounded-full border-4 border-slate-800 text-[8px] font-bold" style={{ borderTopColor: domain.color, color: domain.color }}>{domain.value}%</div></div>;
                            })}
                        </div>
                    </WallPanel>

                    <WallPanel className="xl:col-span-3" title="eKompaun & Penguatkuasaan">
                        <div className="grid min-h-44 grid-cols-2 divide-x divide-cyan-950 p-4"><div className="flex flex-col gap-2 pr-4 text-[9px]"><div className="flex items-center gap-2"><ShieldAlert className="text-cyan-300" size={22} /><span><strong className="block text-xl text-slate-100">86</strong><span className="text-slate-600">kompaun hari ini</span></span></div><p className="text-slate-500">Parkir <span className="float-right text-slate-200">45</span></p><p className="text-slate-500">Lalu lintas <span className="float-right text-slate-200">28</span></p><p className="text-slate-500">PBT <span className="float-right text-slate-200">13</span></p></div><div className="flex flex-col gap-3 pl-4 text-[9px]"><div className="flex items-center gap-2"><Car className="text-amber-300" size={22} /><span><strong className="block text-xl text-slate-100">12</strong><span className="text-slate-600">sitaan</span></span></div><MiniBar label="Tindakan selesai" tone="emerald" value={72} /><p className="text-slate-500">Zon operasi</p><p className="font-semibold text-cyan-300">DUN Klang</p></div></div>
                    </WallPanel>

                    <WallPanel className="xl:col-span-4" title="Hasil & Belanja (SKB)">
                        <div className="grid min-h-44 grid-cols-2 divide-x divide-cyan-950"><div className="p-4"><p className="text-[8px] uppercase text-slate-600">Hasil tahun ini</p><p className="mt-2 text-lg font-bold text-slate-100">RM 314.58 <span className="text-[9px] text-slate-500">juta</span></p><svg className="mt-4 h-14 w-full" viewBox="0 0 180 55" preserveAspectRatio="none"><path d="M0 45 L20 38 L40 43 L60 28 L80 32 L100 18 L120 24 L140 10 L160 16 L180 5" fill="none" stroke="#22c55e" strokeWidth="2" /></svg></div><div className="p-4"><p className="text-[8px] uppercase text-slate-600">Belanja tahun ini</p><p className="mt-2 text-lg font-bold text-slate-100">RM 268.37 <span className="text-[9px] text-slate-500">juta</span></p><svg className="mt-4 h-14 w-full" viewBox="0 0 180 55" preserveAspectRatio="none"><path d="M0 42 L20 46 L40 32 L60 38 L80 22 L100 28 L120 13 L140 19 L160 8 L180 12" fill="none" stroke="#38bdf8" strokeWidth="2" /></svg></div></div>
                    </WallPanel>
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cyan-950 bg-[#08182a] px-4 py-2 text-[8px] uppercase tracking-wider text-slate-600"><span>Pusat Kawalan Bandar Pintar MBDK</span><span className="flex items-center gap-4"><span className="text-emerald-400">● Normal</span><span className="text-amber-400">● Amaran</span><span className="text-red-400">● Kritikal</span></span><span>Dikemas kini secara langsung</span></footer>
            </div>
        </AppShell>
    );
}
