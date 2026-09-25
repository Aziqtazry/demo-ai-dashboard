import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, KeyRound, ShieldCheck, Siren, UserCog, Users } from 'lucide-react';
import { useAuth } from '../auth';
import type { UserRole } from '../types';

const personas = [
    { role: 'it' as const, label: 'Jabatan Teknologi Maklumat', detail: 'Akses penuh · pentadbiran · konfigurasi integrasi', icon: UserCog },
    { role: 'management' as const, label: 'Pengurusan Atasan', detail: 'Dashboard eksekutif · laporan · analitik', icon: Building2 },
    { role: 'enforcement' as const, label: 'Pegawai Penguat Kuasa', detail: 'CCTV · dron · trafik · GIS · parkir', icon: Siren },
];

export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [persona, setPersona] = useState<UserRole>('management');
    const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
    const { signIn } = useAuth();
    const navigate = useNavigate();

    function submit(event: FormEvent) {
        event.preventDefault();
        if (step === 'credentials') {
            setStep('mfa');
            return;
        }
        signIn(persona);
        navigate('/dashboard');
    }

    return (
        <main className="grid min-h-screen bg-ink-950 lg:grid-cols-2">
            <section className="relative hidden overflow-hidden border-r border-slate-800 lg:flex lg:flex-col lg:items-center lg:justify-center">
                <div className="absolute inset-0 soft-grid opacity-50" />
                <div className="relative flex max-w-md flex-col items-center px-10 text-center">
                    <div className="rounded-3xl border border-amber-400/20 bg-white p-5 shadow-2xl"><img alt="Jata MBDK" className="h-40 w-32 object-contain" src="/mbdk-crest.png" /></div>
                    <h1 className="mt-7 text-3xl font-bold tracking-tight text-white">Dashboard Pemantauan Pintar MBDK</h1>
                    <p className="mt-3 text-sm text-slate-400">Pemantauan bandar bersepadu untuk Bandaraya Diraja Klang</p>
                    <div className="mt-8 flex gap-5 text-slate-600"><ShieldCheck size={20} /><KeyRound size={20} /><Users size={20} /></div>
                </div>
            </section>

            <section className="flex items-center justify-center px-5 py-12">
                <form className="w-full max-w-lg" onSubmit={submit}>
                    <div className="mb-8 flex items-center gap-3 lg:hidden"><img alt="Jata MBDK" className="h-14 w-12 object-contain" src="/mbdk-crest.png" /><div><p className="font-bold text-white">Pemantauan Pintar MBDK</p><p className="text-xs text-slate-500">Bandaraya Diraja Klang</p></div></div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Akses Kakitangan</p>
                    <h2 className="mt-2 text-3xl font-bold text-white">{step === 'credentials' ? 'Log masuk' : 'Pengesahan MFA'}</h2>
                    <p className="mt-2 text-sm text-slate-500">{step === 'credentials' ? 'Masukkan kelayakan anda untuk meneruskan.' : 'Masukkan kod 6 digit yang dihantar ke peranti berdaftar.'}</p>

                    {step === 'credentials' ? (
                        <div className="mt-8 flex flex-col gap-5">
                            <label className="flex flex-col gap-2 text-xs font-medium text-slate-300">Nama pengguna<input className="rounded-lg border border-slate-700 bg-ink-800 px-4 py-3 text-sm text-white placeholder:text-slate-600" defaultValue="ahmad.razak@mbdk.gov.my" required type="email" /></label>
                            <label className="flex flex-col gap-2 text-xs font-medium text-slate-300">Kata laluan<span className="relative"><input className="w-full rounded-lg border border-slate-700 bg-ink-800 px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-600" defaultValue="demonstrasi" required type={showPassword ? 'text' : 'password'} /><button aria-label={showPassword ? 'Sembunyikan kata laluan' : 'Tunjukkan kata laluan'} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
                        </div>
                    ) : (
                        <div className="mt-8"><label className="flex flex-col gap-2 text-xs font-medium text-slate-300">Kod pengesahan<input autoFocus className="rounded-lg border border-cyan-500/50 bg-ink-800 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white" defaultValue="246810" inputMode="numeric" maxLength={6} required /></label><p className="mt-3 text-center text-[11px] text-slate-500">Kod demo telah diisi secara automatik.</p></div>
                    )}

                    <div className="mt-7 rounded-xl border border-slate-700 bg-ink-900 p-4">
                        <div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-slate-300">Persona demonstrasi</p><span className="rounded bg-amber-400/10 px-2 py-1 text-[9px] font-bold uppercase text-amber-300">Bukan produksi</span></div>
                        <div className="mt-3 flex flex-col gap-2">
                            {personas.map(({ role, label, detail, icon: Icon }) => <button className={`flex items-center gap-3 rounded-lg border p-3 text-left ${persona === role ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-slate-700 bg-ink-800 hover:border-slate-600'}`} key={role} onClick={() => setPersona(role)} type="button"><span className={`rounded-lg p-2 ${persona === role ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}><Icon size={16} /></span><span><span className="block text-xs font-semibold text-slate-200">{label}</span><span className="mt-1 block text-[10px] text-slate-500">{detail}</span></span></button>)}
                        </div>
                    </div>

                    <button className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500" type="submit">{step === 'credentials' ? 'Teruskan dengan MFA' : 'Sahkan & buka dashboard'}</button>
                    {step === 'mfa' && <button className="mt-3 w-full px-4 py-2 text-xs text-slate-500 hover:text-white" onClick={() => setStep('credentials')} type="button">Kembali ke kelayakan</button>}
                    <p className="mt-7 text-center text-[10px] leading-5 text-slate-600">Mockup demonstrasi. Tiada kelayakan sebenar dihantar atau disimpan.</p>
                </form>
            </section>
        </main>
    );
}
