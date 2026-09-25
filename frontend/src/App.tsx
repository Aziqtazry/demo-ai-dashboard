import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import type { UserRole } from './types';

const PublicPortal = lazy(() => import('./pages/PublicPortal').then((module) => ({ default: module.PublicPortal })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const ExecutivePage = lazy(() => import('./pages/ExecutivePage').then((module) => ({ default: module.ExecutivePage })));
const CctvPage = lazy(() => import('./pages/OperationalPages').then((module) => ({ default: module.CctvPage })));
const DronePage = lazy(() => import('./pages/OperationalPages').then((module) => ({ default: module.DronePage })));
const TrafficPage = lazy(() => import('./pages/OperationalPages').then((module) => ({ default: module.TrafficPage })));
const DisasterPage = lazy(() => import('./pages/OperationalPages').then((module) => ({ default: module.DisasterPage })));
const GisPage = lazy(() => import('./pages/OperationalPages').then((module) => ({ default: module.GisPage })));
const ParkingPage = lazy(() => import('./pages/OperationalPages').then((module) => ({ default: module.ParkingPage })));
const SmartCityPage = lazy(() => import('./pages/StrategicPages').then((module) => ({ default: module.SmartCityPage })));
const AiAnalyticsPage = lazy(() => import('./pages/StrategicPages').then((module) => ({ default: module.AiAnalyticsPage })));
const ComplaintsPage = lazy(() => import('./pages/StrategicPages').then((module) => ({ default: module.ComplaintsPage })));
const AdminPage = lazy(() => import('./pages/StrategicPages').then((module) => ({ default: module.AdminPage })));

function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
    const { signedIn, role } = useAuth();
    const location = useLocation();

    if (!signedIn) {
        return <Navigate replace state={{ from: location.pathname }} to="/login" />;
    }

    if (roles && !roles.includes(role)) {
        return <Navigate replace to="/dashboard" />;
    }

    return children;
}

function AppRoutes() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-ink-950 text-sm text-slate-400">Memuatkan modul…</div>}>
            <Routes>
                <Route element={<PublicPortal />} path="/" />
                <Route element={<LoginPage />} path="/login" />
                <Route element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} path="/dashboard" />
                <Route element={<ProtectedRoute><ExecutivePage /></ProtectedRoute>} path="/executive" />
                <Route element={<ProtectedRoute roles={['enforcement', 'it']}><CctvPage /></ProtectedRoute>} path="/cctv" />
                <Route element={<ProtectedRoute roles={['enforcement', 'it']}><DronePage /></ProtectedRoute>} path="/drone" />
                <Route element={<ProtectedRoute roles={['enforcement', 'it']}><TrafficPage /></ProtectedRoute>} path="/traffic" />
                <Route element={<ProtectedRoute roles={['enforcement', 'it']}><DisasterPage /></ProtectedRoute>} path="/disaster" />
                <Route element={<ProtectedRoute roles={['enforcement', 'it']}><GisPage /></ProtectedRoute>} path="/gis" />
                <Route element={<ProtectedRoute roles={['enforcement', 'it']}><ParkingPage /></ProtectedRoute>} path="/parking" />
                <Route element={<ProtectedRoute><ComplaintsPage /></ProtectedRoute>} path="/complaints" />
                <Route element={<ProtectedRoute roles={['enforcement', 'it']}><AiAnalyticsPage /></ProtectedRoute>} path="/ai-analytics" />
                <Route element={<ProtectedRoute><SmartCityPage /></ProtectedRoute>} path="/smart-city" />
                <Route element={<ProtectedRoute roles={['it']}><AdminPage /></ProtectedRoute>} path="/admin" />
                <Route element={<Navigate replace to="/" />} path="*" />
            </Routes>
        </Suspense>
    );
}

export default function App() {
    return <AuthProvider><AppRoutes /></AuthProvider>;
}
