import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRequests, ServiceRequest } from '@/api/requests';
import { fetchNotifications, NotificationItem, markAllNotificationsRead } from '@/api/notifications';
import { Link } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing } from '@/theme/tokens';

export default function DashboardScreen() {
    const { user, logout } = useAuth();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const [r, n] = await Promise.all([fetchRequests(), fetchNotifications()]);
            setRequests(r); setNotifications(n);
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    // Refresh data when a notification arrives while on dashboard
    useEffect(() => {
        const sub = Notifications.addNotificationReceivedListener(() => {
            load();
        });
        return () => sub.remove();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.xl }}>
            <Text variant="title" style={styles.heading}>Welcome {user?.role}</Text>
            <View style={{ height: spacing.sm }} />
            <Button title="Refresh" onPress={load} />
            <Text variant="subtitle" style={styles.sectionTitle}>Service Requests</Text>
            {loading && <Text>Loading...</Text>}
            {!loading && requests.map((r) => (
                <Link key={r.id} href={{ pathname: '/requests/[id]', params: { id: r.id } }} asChild>
                    <Card style={{ marginBottom: spacing.md }}>
                        <View style={styles.row}>
                            <Text variant="subtitle">{r.title}</Text>
                            <Text style={[styles.badge, badgeColor(r.priority)]}>{r.priority}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text color={colors.brand.primary}>{r.status}</Text>
                            <Text>Room {r.room.roomNumber}</Text>
                        </View>
                    </Card>
                </Link>
            ))}
            <Text variant="subtitle" style={styles.sectionTitle}>Notifications</Text>
            <Button title="Mark All Read" onPress={async () => { await markAllNotificationsRead(); load(); }} />
            {notifications.map((n) => (
                <Card key={n.id} style={!n.isRead ? styles.unread : undefined}>
                    <Text variant="subtitle">{n.title}</Text>
                    <Text>{n.message}</Text>
                </Card>
            ))}
            <View style={{ height: 20 }} />
            <Link href="/subscription" asChild><Button title="Subscription" /></Link>
            <Link href="/hotel" asChild><Button title="Hotel Info" /></Link>
            <View style={{ height: 20 }} />
            <Button color={colors.brand.danger} title="Logout" onPress={logout} />
        </ScrollView>
    );
}

function badgeColor(priority: string) {
    switch (priority) {
        case 'urgent': return { backgroundColor: '#f44336' };
        case 'high': return { backgroundColor: '#ff9800' };
        case 'medium': return { backgroundColor: '#ffd700' };
        default: return { backgroundColor: '#4caf50' };
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface.background },
    heading: { marginBottom: spacing.md },
    sectionTitle: { marginVertical: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badge: { color: colors.text.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', fontSize: 12 },
    unread: { borderColor: colors.brand.accent, borderWidth: 1 },
});
