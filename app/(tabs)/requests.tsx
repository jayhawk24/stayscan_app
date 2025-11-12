import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme/tokens';
import { deleteRequest, fetchRequests, ServiceRequest, updateRequestStatus } from '@/api/requests';
import { Link } from 'expo-router';
import { fetchRooms, Room } from '@/api/rooms';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function RequestsTab() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedPriority, setSelectedPriority] = useState<string>('');
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    const load = async () => {
        setLoading(true);
        try {
            const [r, rm] = await Promise.all([
                fetchRequests({ status: selectedStatus || undefined, priority: selectedPriority || undefined }),
                fetchRooms()
            ]);
            setRequests(r);
            setRooms(rm);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStatus, selectedPriority]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await load();
        } finally {
            setRefreshing(false);
        }
    }, [selectedStatus, selectedPriority]);

    const counts = useMemo(() => ({
        pending: requests.filter(r => r.status === 'pending').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        completed: requests.filter(r => r.status === 'completed').length,
        rooms: rooms.length,
    }), [requests, rooms]);

    const toneForPriority = (p: string) => {
        switch (p) {
            case 'high': return 'danger' as const;
            case 'medium': return 'warning' as const;
            case 'low': return 'success' as const;
            default: return 'neutral' as const;
        }
    };

    const toneForStatus = (s: string) => {
        switch (s) {
            case 'pending': return 'warning' as const;
            case 'in_progress': return 'primary' as const;
            case 'completed': return 'success' as const;
            default: return 'neutral' as const;
        }
    };

    const startWork = async (id: string) => {
        setUpdatingIds(prev => new Set(prev).add(id));
        try {
            const updated = await updateRequestStatus(id, 'in_progress');
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
        } finally {
            setUpdatingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        }
    };

    const completeWork = async (id: string) => {
        setUpdatingIds(prev => new Set(prev).add(id));
        try {
            const updated = await updateRequestStatus(id, 'completed');
            setRequests(prev => prev.map(r => r.id === id ? updated : r));
        } finally {
            setUpdatingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        }
    };

    const removeRequest = async (id: string) => {
        setDeletingIds(prev => new Set(prev).add(id));
        try {
            await deleteRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } finally {
            setDeletingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
        }
    };

    return (
        <LinearGradient colors={["#fffbeb", "#fef3c7"]} style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingVertical: spacing.xl }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Container>
                    <Text variant="title" style={styles.heading}>Service Requests</Text>

                    {/* Stats */}
                    <View style={styles.grid}>
                        <Card style={styles.statCard}>
                            <Text variant="subtitle">📋 Pending</Text>
                            <Text variant="hero" color={colors.brand.warning}>{counts.pending}</Text>
                        </Card>
                        <Card style={styles.statCard}>
                            <Text variant="subtitle">🔄 In Progress</Text>
                            <Text variant="hero" color={colors.brand.primary}>{counts.in_progress}</Text>
                        </Card>
                        <Card style={styles.statCard}>
                            <Text variant="subtitle">✅ Completed</Text>
                            <Text variant="hero" color={colors.brand.success}>{counts.completed}</Text>
                        </Card>
                        <Card style={styles.statCard}>
                            <Text variant="subtitle">🛏️ Rooms</Text>
                            <Text variant="hero" color={colors.brand.accent}>{counts.rooms}</Text>
                        </Card>
                    </View>

                    {/* Filters */}
                    <Card style={{ marginBottom: spacing.lg }}>
                        <Text variant="subtitle" style={{ marginBottom: spacing.sm }}>Filters</Text>
                        <View style={styles.filtersRow}>
                            <View style={styles.filterGroup}>
                                <Text variant="caption" style={styles.filterLabel}>Status</Text>
                                <View style={styles.pillRow}>
                                    {[
                                        { key: '', label: 'All' },
                                        { key: 'pending', label: 'Pending' },
                                        { key: 'in_progress', label: 'In Progress' },
                                        { key: 'completed', label: 'Completed' }
                                    ].map(opt => (
                                        <Button
                                            key={opt.key}
                                            title={opt.label}
                                            color={selectedStatus === opt.key ? colors.brand.primary : colors.surface.border}
                                            onPress={() => setSelectedStatus(opt.key)}
                                            style={styles.pill}
                                        />
                                    ))}
                                </View>
                            </View>
                            <View style={styles.filterGroup}>
                                <Text variant="caption" style={styles.filterLabel}>Priority</Text>
                                <View style={styles.pillRow}>
                                    {[
                                        { key: '', label: 'All' },
                                        { key: 'high', label: 'High' },
                                        { key: 'medium', label: 'Medium' },
                                        { key: 'low', label: 'Low' }
                                    ].map(opt => (
                                        <Button
                                            key={opt.key}
                                            title={opt.label}
                                            color={selectedPriority === opt.key ? colors.brand.primary : colors.surface.border}
                                            onPress={() => setSelectedPriority(opt.key)}
                                            style={styles.pill}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* Requests list */}
                    {loading && <Text>Loading...</Text>}
                    {!loading && requests.length === 0 && (
                        <Card><Text>No service requests found.</Text></Card>
                    )}
                    {!loading && requests.map((r) => (
                        <Card key={r.id} style={{ marginBottom: spacing.md }}>
                            <View style={styles.rowBetween}>
                                <Text variant="subtitle">{r.title}</Text>
                                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                                    <Badge label={r.priority} tone={toneForPriority(r.priority)} />
                                    <Badge label={r.status.replace('_', ' ')} tone={toneForStatus(r.status)} />
                                </View>
                            </View>
                            <View style={[styles.rowBetween, { marginTop: spacing.sm }]}>
                                <Text>🏨 Room {r.room.roomNumber}</Text>
                                <Text>{new Date(r.requestedAt).toLocaleString()}</Text>
                            </View>
                            <View style={[styles.rowBetween, { marginTop: spacing.md }]}>
                                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                                    {r.status === 'pending' && (
                                        <Button
                                            title={updatingIds.has(r.id) ? 'Starting…' : 'Start Work'}
                                            disabled={updatingIds.has(r.id)}
                                            onPress={() => startWork(r.id)}
                                        />
                                    )}
                                    {r.status === 'in_progress' && (
                                        <Button
                                            title={updatingIds.has(r.id) ? 'Completing…' : 'Mark Complete'}
                                            color={colors.brand.success}
                                            disabled={updatingIds.has(r.id)}
                                            onPress={() => completeWork(r.id)}
                                        />
                                    )}
                                    <Link href={{ pathname: '/requests/[id]', params: { id: r.id } }} asChild>
                                        <Button title="Details" color={colors.brand.accent} />
                                    </Link>
                                </View>
                                {user?.role === 'hotel_admin' && (
                                    <Button
                                        title={deletingIds.has(r.id) ? 'Deleting…' : 'Delete'}
                                        color={colors.brand.danger}
                                        disabled={deletingIds.has(r.id)}
                                        onPress={() => removeRequest(r.id)}
                                    />
                                )}
                            </View>
                        </Card>
                    ))}
                </Container>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    heading: { marginBottom: spacing.md },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.lg
    },
    statCard: {
        flexBasis: '48%'
    },
    filtersRow: {
        gap: spacing.md
    },
    filterGroup: {
        marginBottom: spacing.md
    },
    filterLabel: {
        marginBottom: spacing.sm
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm
    },
    pill: {
        marginRight: 0
    }
});
