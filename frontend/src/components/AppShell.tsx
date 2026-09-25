import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Activity,
    Bell,
    BrainCircuit,
    Camera,
    ChevronLeft,
    ChevronRight,
    CloudSun,
    Drone,
    Gauge,
    LayoutDashboard,
    LogOut,
    Map,
    Menu,
    ParkingCircle,
    Settings,
    ShieldCheck,
    Siren,
    Sparkles,
    TrafficCone,
    X,
} from 'lucide-react';
import { useAuth } from '../auth';
import type { UserRole } from '../types';

const roleNames: Record<UserRole, string> = {
    public: 'Pengguna Awam',
    management: 'Pengurusan Atasan',
    enforcement: 'Pegawai Penguat Kuasa',
    it: 'Jabatan Teknologi Maklumat',
};

const navItems = [
    { label: 'Dashboard Utama', path: '/dashboard', icon: LayoutDashboard, roles: ['management', 'enforcement', 'it'] },
    { label: 'Dashboard Eksekutif', path: '/executive', icon: Gauge, roles: ['management', 'enforcement', 'it'] },
    { label: 'Pemantauan CCTV', path: '/cctv', icon: Camera, roles: ['enforcement', 'it'] },
    { label: 'Operasi Dron', path: '/drone', icon: Drone, roles: ['enforcement', 'it'] },
    { label: 'Trafik & Lampu Isyarat', path: '/traffic', icon: TrafficCone, roles: ['enforcement', 'it'] },
    { label: 'Pengurusan Bencana', path: '/disaster', icon: Siren, roles: ['enforcement', 'it'] },
    { label: 'Perancangan Bandar & GIS', path: '/gis', icon: Map, roles: ['enforcement', 'it'] },
    { label: 'Parkir Awam', path: '/parking', icon: ParkingCircle, roles: ['enforcement', 'it'] },
    { label: 'Aduan', path: '/complaints', icon: Activity, roles: ['management', 'enforcement', 'it'] },
    { label: 'Fungsi Integrasi & AI', path: '/ai-analytics', icon: BrainCircuit, roles: ['enforcement', 'it'] },
    { label: 'Smart City', path: '/smart-city', icon: Sparkles, roles: ['management', 'enforcement', 'it'] },
    { label: 'Pentadbiran', path: '/admin', icon: Settings, roles: ['it'] },
] as const;

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
    const { role, setRole, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [clock, setClock] = useState(new Date());

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const timer = window.setInterval(() => setClock(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const visibleItems = navItems.filter((item) => (item.roles as readonly UserRole[]).includes(role));

    function handleSignOut() {
        signOut();
        navigate('/login');
    }

    const sidebar = (
        <div className="flex h-full flex-col bg-ink-900">
            <div className={`flex h-18 items-center border-b border-slate-800 px-4 ${collapsed ? 'justify-center' : 'gap-3'}`}>
                <img alt="Jata MBDK" className="h-10 w-9 object-contain" src="/mbdk-crest.png" />
                {!collapsed && (
                    <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">Pemantauan Pintar MBDK</p>
                        <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-400">Bandar Diraja Klang</p>
                    </div>
                )}
            </div>

            <nav aria-label="Navigasi modul" className="flex-1 overflow-y-auto p-2">
                <p className={`px-2 pb-2 pt-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600 ${collapsed ? 'sr-only' : ''}`}>Modul</p>
                <div className="flex flex-col gap-1">
                    {visibleItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                className={({ isActive }) => `flex items-center rounded-lg px-3 py-2.5 text-xs transition-colors ${collapsed ? 'justify-center' : 'gap-3'} ${isActive ? 'bg-cyan-500/15 font-semibold text-cyan-300 ring-1 ring-cyan-500/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}`}
                                key={item.path}
                                title={collapsed ? item.label : undefined}
                                to={item.path}
                            >
                                <Icon size={16} />
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <div className="border-t border-slate-800 p-3">
                {!collapsed && (
                    <div className="mb-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-500"><span>Kesihatan sistem</span><span className="text-emerald-400">12/14 normal</span></div>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-800"><div className="h-1.5 w-[86%] rounded-full bg-emerald-400" /></div>
                    </div>
                )}
                <button className={`flex w-full items-center rounded-lg px-3 py-2.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white ${collapsed ? 'justify-center' : 'gap-3'}`} onClick={handleSignOut} type="button">
                    <LogOut size={15} />{!collapsed && 'Log keluar'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-ink-950 text-slate-200">
            <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-800 lg:block ${collapsed ? 'w-18' : 'w-64'}`}>
                {sidebar}
                <button aria-label={collapsed ? 'Buka bar sisi' : 'Kecilkan bar sisi'} className="absolute -right-3 top-24 rounded-full border border-slate-700 bg-ink-800 p-1 text-slate-400 hover:text-white" onClick={() => setCollapsed((value) => !value)} type="button">
                    {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
                </button>
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">
                    <aside className="h-full w-72 border-r border-slate-800">{sidebar}</aside>
                    <button aria-label="Tutup menu" className="absolute right-4 top-4 rounded-lg border border-slate-700 bg-ink-900 p-2" onClick={() => setMobileOpen(false)} type="button"><X size={18} /></button>
                </div>
            )}

            <div className={collapsed ? 'lg:pl-18' : 'lg:pl-64'}>
                <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b border-slate-800 bg-ink-950/95 px-4 backdrop-blur md:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button aria-label="Buka menu" className="rounded-lg border border-slate-800 p-2 text-slate-400 lg:hidden" onClick={() => setMobileOpen(true)} type="button"><Menu size={18} /></button>
                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-semibold text-white md:text-base">{title}</h1>
                            <p className="mt-0.5 truncate text-[10px] text-slate-500">{subtitle}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="hidden items-center gap-2 border-r border-slate-800 pr-3 text-[10px] text-slate-400 sm:flex">
                            <CloudSun size={16} className="text-cyan-400" />
                            <span>28°C · Klang</span>
                        </div>
                        <div className="hidden text-right text-[10px] md:block">
                            <p className="font-semibold tabular-nums text-slate-200">{clock.toLocaleTimeString('ms-MY')}</p>
                            <p className="text-slate-600">{clock.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <button aria-label="Notifikasi" className="relative rounded-lg border border-slate-800 p-2 text-slate-400" type="button"><Bell size={16} /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-400" /></button>
                        <select aria-label="Tukar persona demo" className="max-w-36 rounded-lg border border-slate-700 bg-ink-800 px-2 py-2 text-[10px] text-slate-300" onChange={(event) => setRole(event.target.value as UserRole)} value={role}>
                            <option value="management">Pengurusan</option>
                            <option value="enforcement">Penguatkuasaan</option>
                            <option value="it">Pentadbir IT</option>
                        </select>
                        <div className="hidden items-center gap-2 border-l border-slate-800 pl-3 xl:flex">
                            <div className="flex size-8 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-300">AR</div>
                            <div className="text-[10px]"><p className="font-semibold text-slate-200">Ahmad Razak</p><p className="text-slate-600">{roleNames[role]}</p></div>
                        </div>
                    </div>
                </header>
                <main className="p-4 md:p-6">{children}</main>
                <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-6 py-3 text-[9px] text-slate-600">
                    <span>Mockup demonstrasi · Semua data adalah sintetik</span>
                    <span className="flex items-center gap-1"><ShieldCheck size={11} />URS MBDK/SEL/ET/URS/01</span>
                </footer>
            </div>
        </div>
    );
}
