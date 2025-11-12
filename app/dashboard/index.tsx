import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRequests, ServiceRequest } from '@/api/requests';
import { fetchNotifications, NotificationItem, markAllNotificationsRead } from '@/api/notifications';
import { Link } from 'expo-router';
import * as Notifications from 'expo-notifications';

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
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
            <Text style={styles.heading}>Welcome {user?.role}</Text>
            <Button title="Refresh" onPress={load} />
            <Text style={styles.sectionTitle}>Service Requests</Text>
            {loading && <Text>Loading...</Text>}
            {!loading && requests.map((r) => (
                <Link key={r.id} href={{ pathname: '/requests/[id]', params: { id: r.id } }} asChild>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.title}>{r.title}</Text>
                            <Text style={[styles.badge, badgeColor(r.priority)]}>{r.priority}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.status}>{r.status}</Text>
                            <Text style={styles.room}>Room {r.room.roomNumber}</Text>
                        </View>
                    </View>
                </Link>
            ))}
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Button title="Mark All Read" onPress={async () => { await markAllNotificationsRead(); load(); }} />
            {notifications.map((n) => (
                <View key={n.id} style={[styles.card, !n.isRead && styles.unread]}>
                    <Text style={styles.title}>{n.title}</Text>
                    <Text style={styles.message}>{n.message}</Text>
                </View>
            ))}
            <View style={{ height: 20 }} />
            <Link href="/subscription" asChild><Button title="Subscription" /></Link>
            <Link href="/hotel" asChild><Button title="Hotel Info" /></Link>
            <View style={{ height: 20 }} />
            <Button color="#f44336" title="Logout" onPress={logout} />
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
    container: { flex: 1, backgroundColor: '#fafafa' },
    heading: { fontSize: 20, fontWeight: '600', marginBottom: 12, color: '#212121' },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginVertical: 12 },
    card: { backgroundColor: '#fff', padding: 14, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e0e0e0' },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: '600', color: '#212121' },
    badge: { color: '#212121', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', fontSize: 12 },
    status: { fontSize: 14, fontWeight: '500', color: '#2196f3' },
    room: { fontSize: 14, color: '#555' },
    unread: { borderColor: '#ffd700' },
    message: { fontSize: 13, color: '#555' },
});
