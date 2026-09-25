import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Banknote, CalendarDays, CarFront, ClipboardList, CloudSun, CreditCard, Landmark, MapPinned, MessageSquareText, ParkingCircle, ShieldCheck } from 'lucide-react';

const services = [
    { label: 'Aduan Awam', detail: 'SISPAA MBDK', icon: MessageSquareText, tone: 'text-red-700 bg-red-50' },
    { label: 'Bayaran MBDK', detail: 'Cukai & kompaun', icon: CreditCard, tone: 'text-emerald-700 bg-emerald-50' },
    { label: 'Smart Parking', detail: 'Bayaran letak kereta', icon: ParkingCircle, tone: 'text-violet-700 bg-violet-50' },
    { label: 'Smart Booking', detail: 'Tempahan dewan', icon: CalendarDays, tone: 'text-amber-700 bg-amber-50' },
    { label: 'GES · iMAPS', detail: 'Portal geospatial', icon: MapPinned, tone: 'text-blue-700 bg-blue-50' },
    { label: 'Tender & Borang', detail: 'Sebutharga dan borang', icon: ClipboardList, tone: 'text-fuchsia-700 bg-fuchsia-50' },
];

export function PublicPortal() {
    return (
        <div className="public-surface min-h-screen">
            <header className="border-b-4 border-civic-700 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
                    <div className="flex items-center gap-3">
                        <img alt="Jata MBDK" className="h-12 w-10 object-contain" src="/mbdk-crest.png" />
                        <div><p className="text-xs font-bold text-slate-900">Majlis Bandaraya Diraja Klang</p><p className="text-[10px] text-slate-500">Portal Bandar Pintar · Maklumat untuk warga Klang</p></div>
                    </div>
                    <Link className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-civic-700 hover:text-civic-700" to="/login">
                        <ShieldCheck size={15} /> Log Masuk Kakitangan
                    </Link>
                </div>
            </header>

            <main>
                <section className="border-b border-amber-100 bg-[#fffaf0]">
                    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.25fr_.75fr] lg:items-center lg:py-24">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-800"><Landmark size={12} /> Bandar Diraja sejak 2024</span>
                            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-900 md:text-6xl">Selamat Datang ke <span className="text-civic-700">Bandaraya Diraja Klang</span></h1>
                            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">Portal maklumat dan perkhidmatan digital untuk warga Klang — pantau keadaan bandar secara masa nyata, akses e-perkhidmatan, dan dapatkan hebahan rasmi Majlis.</p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <a className="flex items-center gap-2 rounded-lg bg-civic-700 px-4 py-3 text-xs font-semibold text-white hover:bg-civic-600" href="#services"><ClipboardList size={15} /> Buat Aduan</a>
                                <a className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 hover:border-civic-700" href="#services"><Banknote size={15} /> Bayaran Online</a>
                                <a className="flex items-center gap-2 px-3 py-3 text-xs font-semibold text-civic-700" href="#monitoring">Pemantauan Awam <ArrowRight size={14} /></a>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><CloudSun size={14} className="text-amber-500" />28°C · Klang</span><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600" />208 kamera dipantau aktif</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                ['1.18J', 'Penduduk Klang'],
                                ['#12', 'Kedudukan bandar'],
                                ['627', 'Keluasan km²'],
                                ['2024', 'Taraf Diraja'],
                            ].map(([value, label]) => <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm" key={label}><p className="text-2xl font-black text-slate-900 md:text-3xl">{value}</p><p className="mt-2 text-[11px] font-medium text-slate-500">{label}</p></div>)}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-16" id="services">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">E-Perkhidmatan</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Urusan dalam talian</h2>
                    <p className="mt-2 text-sm text-slate-500">Perkhidmatan digital rasmi MBDK untuk warga Klang.</p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map(({ label, detail, icon: Icon, tone }) => (
                            <button className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:border-amber-300" key={label} type="button">
                                <span className={`rounded-lg p-2.5 ${tone}`}><Icon size={18} /></span>
                                <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-800">{label}</span><span className="mt-1 block text-[11px] text-slate-500">{detail}</span></span>
                                <ArrowRight className="text-slate-300 group-hover:text-civic-700" size={16} />
                            </button>
                        ))}
                    </div>
                </section>

                <section className="bg-slate-50" id="monitoring">
                    <div className="mx-auto max-w-7xl px-5 py-16">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">Pemantauan Awam</p>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900">Keadaan bandar hari ini</h2>
                        <div className="mt-7 grid gap-4 lg:grid-cols-3">
                            <article className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold"><CarFront size={18} className="text-amber-600" />Status trafik utama</span><span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">Sederhana</span></div><div className="mt-5 flex flex-col gap-3 text-xs text-slate-600"><span className="flex justify-between">Jalan Meru <b className="text-amber-600">Perlahan</b></span><span className="flex justify-between">Persiaran Sultan Ibrahim <b className="text-emerald-600">Lancar</b></span><span className="flex justify-between">Jalan Tengku Kelana <b className="text-red-600">Sesak</b></span></div></article>
                            <article className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-sm font-bold"><AlertTriangle size={18} className="text-blue-600" />Amaran bencana & banjir</div><div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-center"><p className="text-xl font-black text-emerald-700">NORMAL</p><p className="mt-1 text-[11px] text-emerald-800">Paras air di semua stesen pemantauan</p></div></article>
                            <article className="rounded-xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-sm font-bold"><Landmark size={18} className="text-civic-700" />Hebahan rasmi terkini</div><p className="mt-5 text-sm font-semibold text-slate-800">Kerja penyelenggaraan longkang di Taman Sri Andalas</p><p className="mt-2 text-xs leading-5 text-slate-500">Penutupan sementara sebahagian laluan pada 27 September, 10 malam hingga 5 pagi.</p></article>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-[11px] text-slate-500"><span>© 2026 Majlis Bandaraya Diraja Klang</span><span>Mockup demonstrasi · Data bukan masa nyata</span></div></footer>
        </div>
    );
}
