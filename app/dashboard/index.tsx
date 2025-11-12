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
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '@/components/ui/Badge';
import Container from '@/components/ui/Container';
import * as WebBrowser from 'expo-web-browser';
import { CONFIG } from '@/constants/config';

export default function DashboardScreen() {
    const { user, logout } = useAuth();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const isAdmin = user?.role === 'hotel_admin';

    const openWeb = (path: string) => WebBrowser.openBrowserAsync(`${CONFIG.WEB_BASE}${path}`);

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
        <LinearGradient colors={["#fffbeb", "#fef3c7"]} style={styles.gradient}>
            <ScrollView style={styles.scroll} contentContainerStyle={{ paddingVertical: spacing.xl }}>
                <Container>
                    {/* Hero */}
                    <Text variant="hero" style={styles.heading}>Welcome to Your Dashboard! 🎉</Text>
                    <Text variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.lg }}>
                        {isAdmin
                            ? 'Manage your hotel and provide excellent guest experiences.'
                            : 'Help guests with their service requests at your hotel.'}
                    </Text>

                    {/* Dashboard Cards */}
                    <View style={{ gap: spacing.md }}>
                        {isAdmin && (
                            <Card>
                                <Text variant="subtitle">🏨 Hotel Profile</Text>
                                <Text color={colors.text.secondary}>Setup your hotel details</Text>
                                <View style={{ height: spacing.sm }} />
                                <Button title="Manage Hotel" onPress={() => openWeb('/dashboard/hotel')} />
                            </Card>
                        )}

                        <Card>
                            <Text variant="subtitle">🛏️ Rooms & QR Codes</Text>
                            <Text color={colors.text.secondary}>
                                {isAdmin ? 'Configure rooms and generate QR codes for guests' : 'View rooms and download QR codes for guest access'}
                            </Text>
                            <View style={{ height: spacing.sm }} />
                            <Button title={isAdmin ? 'Manage Rooms' : 'View Rooms'} onPress={() => openWeb('/dashboard/rooms')} />
                        </Card>

                        <Card>
                            <Text variant="subtitle">📋 Service Requests</Text>
                            <Text color={colors.text.secondary}>View and manage incoming guest service requests</Text>
                            <View style={{ height: spacing.sm }} />
                            <Button title="View Requests" onPress={() => load()} />
                        </Card>

                        {isAdmin && (
                            <>
                                <Card>
                                    <Text variant="subtitle">🛎️ Services Management</Text>
                                    <Text color={colors.text.secondary}>Configure services offered to your guests</Text>
                                    <View style={{ height: spacing.sm }} />
                                    <Button title="Manage Services" onPress={() => openWeb('/dashboard/services')} />
                                </Card>
                                <Card>
                                    <Text variant="subtitle">👥 Staff Management</Text>
                                    <Text color={colors.text.secondary}>Add and manage your hotel staff members</Text>
                                    <View style={{ height: spacing.sm }} />
                                    <Button title="Manage Staff" onPress={() => openWeb('/dashboard/staff')} />
                                </Card>
                            </>
                        )}
                    </View>

                    {/* Quick Stats (mobile friendly grid) */}
                    <Text variant="subtitle" style={styles.sectionTitle}>Quick Stats</Text>
                    <View style={styles.statsGrid}>
                        <Card style={styles.statCard}><Text variant="subtitle" color={colors.brand.accent}>0</Text><Text variant="caption" color={colors.text.secondary}>Rooms</Text></Card>
                        <Card style={styles.statCard}><Text variant="subtitle" color={colors.brand.primary}>{requests.filter(r => r.status !== 'completed').length}</Text><Text variant="caption" color={colors.text.secondary}>Active</Text></Card>
                        <Card style={styles.statCard}><Text variant="subtitle" color={colors.brand.success || colors.brand.accent}>0</Text><Text variant="caption" color={colors.text.secondary}>Staff</Text></Card>
                        <Card style={styles.statCard}><Text variant="subtitle" color={colors.brand.warning || colors.brand.accent}>N/A</Text><Text variant="caption" color={colors.text.secondary}>Plan</Text></Card>
                    </View>

                    {/* Getting Started */}
                    <Text variant="subtitle" style={styles.sectionTitle}>🚀 Getting Started</Text>
                    <View style={{ gap: spacing.md }}>
                        <Card>
                            <Text variant="subtitle">🏨 Complete Hotel Setup</Text>
                            <Text color={colors.text.secondary}>Add your hotel details, address, and contact information.</Text>
                            <View style={{ height: spacing.sm }} />
                            <Button title="Complete Setup" onPress={() => openWeb('/dashboard/hotel/setup')} />
                        </Card>
                        <Card>
                            <Text variant="subtitle">🛏️ Add Rooms</Text>
                            <Text color={colors.text.secondary}>Configure your rooms and generate QR codes for guest access.</Text>
                            <View style={{ height: spacing.sm }} />
                            <Button title="Add Rooms" onPress={() => openWeb('/dashboard/rooms/add')} />
                        </Card>
                    </View>

                    <Button color={colors.brand.danger} title="Logout" onPress={logout} />
                </Container>
            </ScrollView>
        </LinearGradient>
    );
}

function priorityTone(priority: string) {
    switch (priority) {
        case 'urgent': return 'danger' as const;
        case 'high': return 'warning' as const;
        case 'medium': return 'accent' as const;
        default: return 'success' as const;
    }
}

const styles = StyleSheet.create({
    gradient: { flex: 1 },
    scroll: { flex: 1 },
    heading: { marginBottom: spacing.md },
    sectionTitle: { marginVertical: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    unread: { borderColor: colors.brand.accent, borderWidth: 1 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: { width: '48%', alignItems: 'center', paddingVertical: spacing.md },
});
