import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, Clock3, Database, Radio } from 'lucide-react';
import type { Severity, StatMetric } from '../types';

const toneClasses: Record<Severity, string> = {
    critical: 'border-red-400/30 bg-red-400/10 text-red-300',
    warning: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    normal: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    info: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
    offline: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
};

export function StatusBadge({ tone, children }: { tone: Severity; children: ReactNode }) {
    return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${toneClasses[tone]}`}>{children}</span>;
}

export function MetricCard({ metric }: { metric: StatMetric }) {
    const positive = metric.change?.startsWith('+');

    return (
        <article className="panel min-w-0 p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-400">{metric.label}</p>
                    <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-white">{metric.value}</p>
                </div>
                {metric.tone && <StatusBadge tone={metric.tone}>{metric.tone}</StatusBadge>}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="truncate">{metric.detail}</span>
                {metric.change && (
                    <span className={positive ? 'flex items-center text-emerald-400' : 'flex items-center text-red-400'}>
                        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {metric.change}
                    </span>
                )}
            </div>
        </article>
    );
}

export function Panel({ title, eyebrow, action, children, className = '' }: { title: string; eyebrow?: string; action?: ReactNode; children: ReactNode; className?: string }) {
    return (
        <section className={`panel min-w-0 overflow-hidden ${className}`}>
            <header className="flex items-center justify-between gap-4 border-b border-slate-700/50 px-4 py-3">
                <div className="min-w-0">
                    {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-400">{eyebrow}</p>}
                    <h2 className="mt-0.5 truncate text-sm font-semibold text-slate-100">{title}</h2>
                </div>
                {action}
            </header>
            {children}
        </section>
    );
}

export function SourceFooter({ source = 'Data simulasi URS', updated = '1 min lalu' }: { source?: string; updated?: string }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-700/40 px-4 py-2 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><Database size={11} />{source}</span>
            <span className="flex items-center gap-1.5"><Clock3 size={11} />{updated}</span>
        </div>
    );
}

export function LiveBadge({ label = 'Simulasi langsung' }: { label?: string }) {
    return <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-300"><Radio className="animate-pulse" size={12} />{label}</span>;
}

export function EmptyState({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
    return (
        <div className="flex min-h-44 flex-col items-center justify-center gap-2 p-6 text-center">
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-slate-400">{icon}</div>
            <p className="text-sm font-semibold text-slate-200">{title}</p>
            <p className="max-w-sm text-xs leading-5 text-slate-500">{body}</p>
        </div>
    );
}
