import { Layers3, LocateFixed, Search, Video } from 'lucide-react';
import { StatusBadge } from './ui';

const markers = [
    { x: 68, y: 22, tone: '#28d7a1', label: 'CCTV' },
    { x: 61, y: 31, tone: '#28d7a1', label: 'CCTV' },
    { x: 73, y: 39, tone: '#ffb020', label: 'Amaran' },
    { x: 56, y: 45, tone: '#27b8ff', label: 'Sensor' },
    { x: 77, y: 53, tone: '#ef5168', label: 'Kritikal' },
    { x: 41, y: 62, tone: '#28d7a1', label: 'CCTV' },
    { x: 32, y: 69, tone: '#27b8ff', label: 'Sensor' },
    { x: 22, y: 76, tone: '#28d7a1', label: 'CCTV' },
    { x: 49, y: 27, tone: '#28d7a1', label: 'CCTV' },
    { x: 83, y: 66, tone: '#28d7a1', label: 'CCTV' },
];

export function MapVisual({ compact = false }: { compact?: boolean }) {
    return (
        <div className={`soft-grid relative overflow-hidden ${compact ? 'h-52' : 'h-80'}`}>
            <svg aria-label="Peta simulasi kawasan pentadbiran Klang" className="absolute inset-0 h-full w-full" viewBox="0 0 800 420" role="img">
                <g fill="none" stroke="#213650" strokeWidth="2">
                    <path d="M-30 330 C90 250, 180 355, 310 260 S510 155, 830 225" />
                    <path d="M25 80 C170 125, 235 45, 375 115 S580 210, 810 102" />
                    <path d="M75 430 C120 335, 115 225, 180 145 S315 35, 370 -20" />
                    <path d="M440 450 C470 340, 420 250, 530 175 S670 50, 740 -20" />
                    <path d="M-20 190 C120 205, 190 175, 290 200 S520 285, 825 335" />
                </g>
                <g fill="none" stroke="#172b42" strokeWidth="1">
                    {Array.from({ length: 13 }, (_, index) => <path key={index} d={`M${index * 70 - 30} 0 L${index * 65 + 10} 420`} />)}
                </g>
                <path d="M290 330 C380 260, 440 340, 520 235 S610 120, 740 105" fill="none" stroke="#185b84" strokeWidth="8" opacity=".55" />
                <path d="M290 330 C380 260, 440 340, 520 235 S610 120, 740 105" fill="none" stroke="#27b8ff" strokeDasharray="4 12" strokeWidth="2" opacity=".65" />
            </svg>

            {markers.map((marker, index) => (
                <button
                    aria-label={`${marker.label} pada peta`}
                    className="absolute size-3 rounded-full border-2 border-ink-900 shadow-[0_0_0_4px_rgba(39,184,255,.1)] transition-transform hover:scale-150"
                    key={`${marker.x}-${marker.y}-${index}`}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%`, backgroundColor: marker.tone }}
                    type="button"
                />
            ))}

            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg border border-slate-700/80 bg-ink-900/90 p-2">
                <Search size={14} className="text-slate-500" />
                <span className="text-[11px] text-slate-400">Cari lokasi atau koordinat</span>
            </div>
            <div className="absolute bottom-3 left-3 flex gap-2">
                <button className="rounded-md border border-slate-700 bg-ink-900/90 p-2 text-slate-300" type="button"><Layers3 size={14} /></button>
                <button className="rounded-md border border-slate-700 bg-ink-900/90 p-2 text-slate-300" type="button"><LocateFixed size={14} /></button>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md border border-slate-700 bg-ink-900/90 px-2 py-1.5">
                <Video size={12} className="text-cyan-400" />
                <StatusBadge tone="normal">208 aktif</StatusBadge>
                <StatusBadge tone="critical">3 amaran</StatusBadge>
            </div>
        </div>
    );
}
