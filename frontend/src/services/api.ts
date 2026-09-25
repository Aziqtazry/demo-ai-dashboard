export type DataMode = 'fixture' | 'api';

export const runtimeConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
    dataMode: (import.meta.env.VITE_DATA_MODE ?? 'fixture') as DataMode,
};

export interface ApiEnvelope<T> {
    data: T;
    meta?: {
        source?: string;
        observedAt?: string;
        receivedAt?: string;
        freshness?: 'live' | 'recent' | 'stale';
        degraded?: boolean;
    };
}

export class ApiError extends Error {
    public constructor(
        message: string,
        public readonly status: number,
        public readonly correlationId?: string,
    ) {
        super(message);
    }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<ApiEnvelope<T>> {
    const response = await fetch(`${runtimeConfig.apiBaseUrl}${path}`, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
        },
        signal,
    });

    if (!response.ok) {
        throw new ApiError(
            `API request failed with status ${response.status}`,
            response.status,
            response.headers.get('X-Correlation-ID') ?? undefined,
        );
    }

    return response.json() as Promise<ApiEnvelope<T>>;
}
