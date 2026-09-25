import { useState } from 'react';
import { Download, FileInput, Filter, Save, UsersRound } from 'lucide-react';
import { AppShell } from '../components/AppShell';
import { TrendChart, ZoneBarChart } from '../components/Charts';
import { MetricCard, Panel, SourceFooter, StatusBadge } from '../components/ui';
import { executiveTabs } from '../data/mock';

const tabMetrics: Record<string, Array<{ label: string; value: string; detail: string; change?: string }>> = {
    'Populasi Penduduk': [
        { label: 'Jumlah penduduk', value: '1.183 Juta', detail: 'Anggaran penduduk 2026', change: '+1.8%' },
        { label: 'Isi rumah', value: '298.5K', detail: 'Purata 3.9 orang', change: '+1.2%' },
        { label: 'Kepadatan', value: '1,865', detail: 'Penduduk / km²' },
        { label: 'Penduduk bandar', value: '86.9%', detail: 'Taburan urban' },
    ],
    'Low Carbon City': [
        { label: 'Sisa dikitar semula', value: '342 t', detail: 'Tahun semasa', change: '+8.4%' },
        { label: 'Penjimatan tenaga', value: '24.5%', detail: 'Bangunan MBDK', change: '+3.1%' },
        { label: 'Kawasan hijau', value: '18.2%', detail: 'Daripada keluasan bandar' },
        { label: 'Pengecas EV', value: '47', detail: 'Lokasi aktif', change: '+12' },
    ],
    'Smart City': [
        { label: 'Inisiatif siap', value: '80/107', detail: '75% keseluruhan' },
        { label: 'Domain', value: '7', detail: 'MS ISO 37122:2019' },
        { label: 'Domain selesai', value: '1', detail: 'Digital Infrastructure' },
        { label: 'Jumlah indikator', value: '107', detail: 'Dinilai semasa' },
    ],
    'Safe City': [
        { label: 'Jenayah indeks', value: '2,014', detail: 'Tahun semasa', change: '-2.9%' },
        { label: 'Jenayah kekerasan', value: '479', detail: '24% keseluruhan' },
        { label: 'Harta benda', value: '1,535', detail: '76% keseluruhan' },
        { label: 'Hotspot aktif', value: '12', detail: '4 zon utama' },
    ],
    Aduan: [
        { label: 'Aduan diterima', value: '4,826', detail: 'Tahun semasa', change: '+4.2%' },
        { label: 'Selesai', value: '4,102', detail: '85% diselesaikan' },
        { label: 'Dalam tindakan', value: '618', detail: '12.8% keseluruhan' },
        { label: 'Melebihi SLA', value: '106', detail: 'Memerlukan perhatian' },
    ],
    'Hasil & Belanja': [
        { label: 'Sasaran hasil', value: 'RM 307.4J', detail: 'Tahun semasa' },
        { label: 'Hasil sebenar', value: 'RM 305.5J', detail: '99.4% sasaran' },
        { label: 'Perbelanjaan', value: 'RM 195.2J', detail: 'Operasi semasa' },
        { label: 'Baki peruntukan', value: 'RM 179.1J', detail: 'Sehingga bulan ini' },
    ],
};

export function ExecutivePage() {
    const [tab, setTab] = useState(executiveTabs[0]);
    const [entryOpen, setEntryOpen] = useState(false);

    return (
        <AppShell subtitle="Statistik dan trend keseluruhan bandaraya" title="Dashboard Eksekutif">
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
                        {executiveTabs.map((item) => <button className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-semibold ${tab === item ? 'bg-blue-600 text-white' : 'border border-slate-700 bg-ink-800 text-slate-400 hover:text-white'}`} key={item} onClick={() => setTab(item)} type="button">{item}</button>)}
                    </div>
                    <div className="flex gap-2"><button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-ink-800 px-3 py-2 text-[10px] font-semibold text-slate-300" type="button"><Filter size={13} />2026 · Semua zon</button><button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-ink-800 px-3 py-2 text-[10px] font-semibold text-slate-300" type="button"><Download size={13} />Eksport</button><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white" onClick={() => setEntryOpen((value) => !value)} type="button"><FileInput size={13} />Key-in</button></div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2"><p className="text-[10px] text-cyan-200">Sumber gabungan: data rasmi, integrasi dan rekod manual berkelulusan.</p><StatusBadge tone="info">Auto-refresh</StatusBadge></div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{tabMetrics[tab].map((metric) => <MetricCard key={metric.label} metric={metric} />)}</div>

                {entryOpen && (
                    <Panel action={<button className="text-[10px] text-slate-500" onClick={() => setEntryOpen(false)} type="button">Tutup</button>} eyebrow="Kemasukan Data (Key-in)" title={`Rekod baharu · ${tab}`}>
                        <form className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={(event) => event.preventDefault()}>
                            <label className="flex flex-col gap-2 text-[10px] text-slate-400">Tahun<select className="rounded-lg border border-slate-700 bg-ink-950 px-3 py-2.5 text-xs text-white"><option>2026</option><option>2025</option></select></label>
                            <label className="flex flex-col gap-2 text-[10px] text-slate-400">Suku tahun<select className="rounded-lg border border-slate-700 bg-ink-950 px-3 py-2.5 text-xs text-white"><option>Q3</option><option>Q2</option></select></label>
                            <label className="flex flex-col gap-2 text-[10px] text-slate-400">Nilai utama<input className="rounded-lg border border-slate-700 bg-ink-950 px-3 py-2.5 text-xs text-white" defaultValue="1,183,000" /></label>
                            <label className="flex flex-col gap-2 text-[10px] text-slate-400">Sumber laporan<input className="rounded-lg border border-slate-700 bg-ink-950 px-3 py-2.5 text-xs text-white" defaultValue="Laporan Rasmi Q3 2026" /></label>
                            <div className="flex items-end gap-2 md:col-span-2 xl:col-span-4 xl:justify-end"><button className="rounded-lg border border-slate-700 px-3 py-2.5 text-[10px] font-semibold text-slate-400" type="reset">Set semula</button><button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-[10px] font-semibold text-white" type="submit"><Save size={13} />Simpan rekod demo</button></div>
                        </form>
                    </Panel>
                )}

                <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
                    <Panel eyebrow={tab} title={tab === 'Hasil & Belanja' ? 'Prestasi anggaran dan sebenar' : 'Trend lima tahun'}><div className="p-2"><TrendChart /></div><SourceFooter source={`${tab} · rekod agregat`} /></Panel>
                    <Panel eyebrow="Pecahan" title={tab === 'Populasi Penduduk' ? 'Mengikut umur & jantina' : 'Mengikut zon'}><div className="p-2"><ZoneBarChart /></div><SourceFooter /></Panel>
                </div>

                <Panel action={<UsersRound size={15} className="text-slate-500" />} eyebrow="Sorotan eksekutif" title="Rumusan untuk tindakan pengurusan">
                    <div className="grid gap-3 p-4 md:grid-cols-3">
                        <article className="rounded-lg border border-slate-700 bg-slate-950/30 p-4"><StatusBadge tone="normal">Positif</StatusBadge><p className="mt-3 text-xs font-semibold text-slate-200">Prestasi bandar stabil</p><p className="mt-2 text-[11px] leading-5 text-slate-500">Sebahagian besar indikator utama kekal dalam julat sasaran suku tahunan.</p></article>
                        <article className="rounded-lg border border-slate-700 bg-slate-950/30 p-4"><StatusBadge tone="warning">Pantau</StatusBadge><p className="mt-3 text-xs font-semibold text-slate-200">Kesesakan waktu puncak</p><p className="mt-2 text-[11px] leading-5 text-slate-500">Tiga koridor utama menunjukkan kenaikan masa perjalanan melebihi 8%.</p></article>
                        <article className="rounded-lg border border-slate-700 bg-slate-950/30 p-4"><StatusBadge tone="info">Ramalan</StatusBadge><p className="mt-3 text-xs font-semibold text-slate-200">Permintaan kemudahan awam</p><p className="mt-2 text-[11px] leading-5 text-slate-500">Pertumbuhan penduduk dijangka meningkatkan penggunaan parkir di zon pusat.</p></article>
                    </div>
                </Panel>
            </div>
        </AppShell>
    );
}
