export type UserRole = 'public' | 'management' | 'enforcement' | 'it';

export type Severity = 'critical' | 'warning' | 'normal' | 'info' | 'offline';

export interface StatMetric {
    label: string;
    value: string;
    detail: string;
    tone?: Severity;
    change?: string;
}

export interface AlertRecord {
    id: string;
    title: string;
    location: string;
    source: string;
    observedAt: string;
    severity: Severity;
    status: 'Baharu' | 'Disahkan' | 'Dalam tindakan' | 'Selesai';
    description: string;
}

export interface IntegrationHealth {
    name: string;
    category: string;
    status: Severity;
    latency: string;
    uptime: string;
}

export interface NavItem {
    label: string;
    path: string;
    roles: UserRole[];
}
