import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken, clearTokens } from '@/lib/storage';
import { login } from '@/api/auth';
import { router, useSegments } from 'expo-router';
import { registerForPushNotificationsAsync, getLastPushToken } from '@/lib/push';
import { registerDeviceToken } from '@/api/notifications';

interface User { id: string; role: string; hotelId?: string | null }
interface AuthContextValue {
    user: User | null;
    loading: boolean;
    loginUser: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const segments = useSegments();

    useEffect(() => {
        (async () => {
            const token = await getAccessToken();
            if (token) {
                // In future: fetch /hotel/profile for role/hotel
                setUser({ id: 'pending', role: 'hotel_staff' });
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!loading) {
            const inAuthGroup = segments[0] === '(auth)';
            if (!user && !inAuthGroup) router.replace('/login');
            if (user && inAuthGroup) router.replace('/dashboard');
        }
    }, [segments, user, loading]);

    const loginUser = async (email: string, password: string) => {
        setLoading(true);
        try {
            const u = await login(email, password);
            setUser(u);
            // Attempt to register push token (best-effort)
            try {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    await registerDeviceToken(token, 'android');
                }
            } catch { }
            router.replace('/dashboard');
        } finally { setLoading(false); }
    };

    const logout = async () => {
        await clearTokens();
        setUser(null);
        router.replace('/login');
    };

    return <AuthContext.Provider value={{ user, loading, loginUser, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
