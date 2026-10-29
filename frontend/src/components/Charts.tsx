import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { trendData } from '../data/mock';

const tooltipStyle = {
    background: '#07101f',
    border: '1px solid #2a3b55',
    borderRadius: '8px',
    fontSize: '11px',
};

export function TrendChart() {
    return (
        <ResponsiveContainer height={210} width="100%">
            <AreaChart data={trendData} margin={{ top: 15, right: 12, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#1c2c42" strokeDasharray="3 3" vertical={false} />
                <XAxis axisLine={false} dataKey="month" fontSize={10} stroke="#66758c" tickLine={false} />
                <YAxis axisLine={false} fontSize={10} stroke="#66758c" tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area dataKey="trafik" fill="#146f9c" fillOpacity={0.22} name="Indeks trafik" stroke="#27b8ff" strokeWidth={2} type="monotone" />
                <Area dataKey="aduan" fill="#7b1123" fillOpacity={0.16} name="Aduan" stroke="#ef5168" strokeWidth={2} type="monotone" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const zoneData = [
    { zone: 'Klang Utara', total: 248 },
    { zone: 'Klang Selatan', total: 214 },
    { zone: 'Bandar', total: 186 },
    { zone: 'Pelabuhan', total: 142 },
    { zone: 'Kapar', total: 105 },
];

export function ZoneBarChart() {
    return (
        <ResponsiveContainer height={210} width="100%">
            <BarChart data={zoneData} layout="vertical" margin={{ top: 12, right: 16, left: 12, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="#1c2c42" strokeDasharray="3 3" />
                <XAxis axisLine={false} fontSize={10} stroke="#66758c" tickLine={false} type="number" />
                <YAxis axisLine={false} dataKey="zone" fontSize={10} stroke="#8b99ad" tickLine={false} type="category" width={82} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" fill="#28d7a1" name="Jumlah" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
