import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserRole } from './types';

interface AuthContextValue {
    role: UserRole;
    setRole: (role: UserRole) => void;
    signedIn: boolean;
    signIn: (role: UserRole) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRoleState] = useState<UserRole>(() => (localStorage.getItem('mbdk-demo-role') as UserRole | null) ?? 'management');
    const [signedIn, setSignedIn] = useState(() => localStorage.getItem('mbdk-demo-auth') === 'true');

    const value = useMemo<AuthContextValue>(() => ({
        role,
        signedIn,
        setRole: (nextRole) => {
            setRoleState(nextRole);
            localStorage.setItem('mbdk-demo-role', nextRole);
        },
        signIn: (nextRole) => {
            setRoleState(nextRole);
            setSignedIn(true);
            localStorage.setItem('mbdk-demo-role', nextRole);
            localStorage.setItem('mbdk-demo-auth', 'true');
        },
        signOut: () => {
            setSignedIn(false);
            localStorage.removeItem('mbdk-demo-auth');
        },
    }), [role, signedIn]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}
