import { AlertTriangle, ArrowRight, Camera, CheckCircle2, CloudCog, Siren } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { MapVisual } from '../components/MapVisual';
import { TrendChart, ZoneBarChart } from '../components/Charts';
import { LiveBadge, MetricCard, Panel, SourceFooter, StatusBadge } from '../components/ui';
import { alerts, cameraFeeds, cityStats, integrations } from '../data/mock';

export function DashboardPage() {
    return (
        <AppShell subtitle="Pandangan holistik operasi Bandaraya Diraja Klang" title="Dashboard Pemantauan Bersepadu">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
                    <div className="flex items-center gap-3"><AlertTriangle className="text-amber-300" size={18} /><div><p className="text-xs font-semibold text-amber-100">Satu integrasi memerlukan perhatian</p><p className="mt-0.5 text-[10px] text-amber-300/70">SMS Gateway tidak dapat dicapai. Saluran WhatsApp, Telegram dan e-mel masih beroperasi.</p></div></div>
                    <Link className="flex items-center gap-1 text-[10px] font-semibold text-amber-300" to="/admin">Semak status <ArrowRight size={12} /></Link>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.6fr_.8fr]">
                    <Panel action={<LiveBadge />} className="min-h-80" eyebrow="Peta GIS bersepadu" title="Situasi bandar semasa">
                        <MapVisual />
                        <SourceFooter source="GES / iMAPS · 5 lapisan aktif" />
                    </Panel>
                    <Panel action={<Link className="text-[10px] font-semibold text-cyan-300" to="/cctv">Lihat semua</Link>} eyebrow="DSS Pro + SUK" title="Paparan CCTV langsung">
                        <div className="grid grid-cols-2 gap-px bg-slate-700/40 p-px">
                            {cameraFeeds.slice(0, 4).map(([id, name, status], index) => (
                                <div className="relative h-[137px] overflow-hidden bg-slate-950" key={id}>
                                    <div className="absolute inset-0 soft-grid opacity-70" />
                                    <div className="absolute inset-0 flex items-center justify-center"><Camera className="text-slate-700" size={32} /></div>
                                    <div className="absolute left-2 top-2"><StatusBadge tone={status}>{status === 'normal' ? 'Live' : status}</StatusBadge></div>
                                    <div className="absolute inset-x-0 bottom-0 bg-ink-950/90 p-2"><p className="truncate text-[10px] font-semibold text-slate-200">{name}</p><p className="mt-0.5 text-[9px] text-slate-600">{id} · SIMULASI {index + 1}</p></div>
                                </div>
                            ))}
                        </div>
                        <SourceFooter source="Suapan simulasi · bukan CCTV sebenar" />
                    </Panel>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cityStats.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</div>

                <div className="grid gap-4 xl:grid-cols-3">
                    <Panel className="xl:col-span-2" eyebrow="6 bulan" title="Trend trafik dan aduan"><div className="p-2"><TrendChart /></div><SourceFooter source="Waze · SISPAA · data agregat" /></Panel>
                    <Panel eyebrow="Mengikut zon" title="Kompaun dikeluarkan"><div className="p-2"><ZoneBarChart /></div><SourceFooter source="eKompaun · agregat" /></Panel>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
                    <Panel action={<Link className="text-[10px] font-semibold text-cyan-300" to="/disaster">Buka modul</Link>} eyebrow="Amaran bersepadu" title="Insiden memerlukan tindakan">
                        <div className="divide-y divide-slate-700/50">
                            {alerts.map((alert) => <article className="flex gap-3 p-4" key={alert.id}><div className={`mt-1 size-2 shrink-0 rounded-full ${alert.severity === 'critical' ? 'bg-red-400' : alert.severity === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold text-slate-200">{alert.title}</p><StatusBadge tone={alert.severity}>{alert.status}</StatusBadge></div><p className="mt-1 text-[10px] text-slate-500">{alert.location} · {alert.source} · {alert.observedAt}</p><p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-400">{alert.description}</p></div></article>)}
                        </div>
                    </Panel>
                    <Panel action={<Link className="text-[10px] font-semibold text-cyan-300" to="/admin">Pentadbiran</Link>} eyebrow="14 perkhidmatan" title="Kesihatan integrasi">
                        <div className="grid grid-cols-2 gap-2 p-3">
                            {integrations.slice(0, 8).map((integration) => <div className="rounded-lg border border-slate-700/60 bg-slate-950/30 p-3" key={integration.name}><div className="flex items-center justify-between gap-2"><CloudCog size={14} className={integration.status === 'normal' ? 'text-emerald-400' : 'text-amber-400'} /><span className={`size-1.5 rounded-full ${integration.status === 'normal' ? 'bg-emerald-400' : 'bg-amber-400'}`} /></div><p className="mt-2 truncate text-[11px] font-semibold text-slate-200">{integration.name}</p><p className="mt-1 text-[9px] text-slate-600">{integration.latency} · {integration.uptime}</p></div>)}
                        </div>
                        <div className="flex items-center gap-2 border-t border-slate-700/50 px-4 py-3 text-[10px] text-emerald-300"><CheckCircle2 size={13} />12 normal · 1 terjejas · 1 luar talian</div>
                    </Panel>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {[['CCTV & AI', '208 kamera aktif', Camera, '/cctv'], ['Pengurusan Bencana', '1 amaran kritikal', Siren, '/disaster'], ['Integrasi Sistem', '86% sihat', CloudCog, '/admin']].map(([label, value, Icon, path]) => <Link className="panel flex items-center gap-4 p-4 hover:border-cyan-500/40" key={label as string} to={path as string}><span className="rounded-xl bg-cyan-500/10 p-3 text-cyan-300"><Icon size={19} /></span><span><span className="block text-xs font-semibold text-slate-200">{label as string}</span><span className="mt-1 block text-[10px] text-slate-500">{value as string}</span></span><ArrowRight className="ml-auto text-slate-600" size={15} /></Link>)}
                </div>
            </div>
        </AppShell>
    );
}
