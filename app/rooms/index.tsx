import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '@/theme/tokens';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRooms, Room } from '@/api/rooms';
import { router } from 'expo-router';

export default function RoomsScreen() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'hotel_admin';
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRooms();
            setRooms(data);
        } catch (e: any) {
            setError(e?.message || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const counts = useMemo(() => {
        const total = rooms.length;
        const occupied = rooms.filter(r => r.isOccupied).length;
        const available = total - occupied;
        const occupancy = total > 0 ? Math.round((occupied / total) * 100) : 0;
        return { total, occupied, available, occupancy };
    }, [rooms]);

    return (
        <LinearGradient colors={["#fffbeb", "#fef3c7"]} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.xl }}>
                <Container>
                    <Text variant="hero" style={{ marginBottom: spacing.sm }}>Room Management 🛏️</Text>
                    <Text variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.lg }}>
                        {isAdmin ? 'Manage your hotel rooms and generate QR codes for guest access' : 'View hotel rooms and access QR codes'}
                    </Text>

                    {isAdmin && (
                        <View style={{ marginBottom: spacing.md }}>
                            <Button title="➕ Add New Room" onPress={() => router.push('/rooms/add')} />
                        </View>
                    )}

                    {error && (
                        <Card style={{ borderColor: colors.brand.danger, borderWidth: 1 }}>
                            <Text color={colors.brand.danger}>{error}</Text>
                            <View style={{ height: spacing.sm }} />
                            <Button title="Retry" onPress={load} />
                        </Card>
                    )}

                    {loading ? (
                        <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
                            <ActivityIndicator color={colors.brand.accent} />
                            <Text color={colors.text.secondary} style={{ marginTop: spacing.sm }}>Loading rooms...</Text>
                        </View>
                    ) : rooms.length === 0 ? (
                        <Card style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 48, marginBottom: spacing.sm }}>🛏️</Text>
                            <Text variant="subtitle" style={{ marginBottom: spacing.sm }}>No Rooms Added Yet</Text>
                            <Text color={colors.text.secondary} style={{ textAlign: 'center', marginBottom: spacing.md }}>
                                {isAdmin ? 'Start by adding your hotel rooms to enable guest services.' : 'No rooms have been set up yet. Please contact your hotel administrator.'}
                            </Text>
                            {isAdmin && <Button title="Add Your First Room" onPress={() => router.push('/rooms/add')} />}
                        </Card>
                    ) : (
                        <View style={styles.grid}>
                            {rooms.map((room) => (
                                <Card key={room.id}>
                                    <View style={styles.rowBetween}>
                                        <View>
                                            <Text variant="subtitle">Room {room.roomNumber}</Text>
                                            <Text color={colors.text.secondary}>{room.roomType}</Text>
                                        </View>
                                        <View style={[styles.badge, room.isOccupied ? styles.badgeDanger : styles.badgeSuccess]}>
                                            <Text variant="caption" color={room.isOccupied ? '#991b1b' : '#065f46'}>
                                                {room.isOccupied ? 'Occupied' : 'Available'}
                                            </Text>
                                        </View>
                                    </View>

                                    {room.currentBookingId && (
                                        <View style={styles.infoBox}>
                                            <Text variant="caption" color={colors.text.secondary}>Current Booking:</Text>
                                            <Text>{room.currentBookingId}</Text>
                                        </View>
                                    )}

                                    <View style={{ marginBottom: spacing.sm }}>
                                        <Text variant="caption" color={colors.text.secondary}>Access Code:</Text>
                                        <Text style={styles.code}>{room.accessCode}</Text>
                                    </View>

                                    <View style={{ gap: spacing.sm }}>
                                        {/* Future: View QR Code and Edit screens */}
                                        {/* <Button title="📱 View QR Code" onPress={() => router.push(`/rooms/${room.id}`)} /> */}
                                        {/* Admin edit planned later */}
                                        <Button title="👁️ View Details" onPress={() => router.push(`/rooms/${room.id}`)} />
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}

                    {rooms.length > 0 && (
                        <View style={{ marginTop: spacing.lg }}>
                            <Text variant="subtitle" style={{ marginBottom: spacing.sm }}>Quick Stats</Text>
                            <View style={styles.statsGrid}>
                                <Card style={styles.statCard}><Text variant="subtitle" color={colors.brand.accent}>{counts.total}</Text><Text variant="caption" color={colors.text.secondary}>Total</Text></Card>
                                <Card style={styles.statCard}><Text variant="subtitle" color="#16a34a">{counts.available}</Text><Text variant="caption" color={colors.text.secondary}>Available</Text></Card>
                                <Card style={styles.statCard}><Text variant="subtitle" color="#dc2626">{counts.occupied}</Text><Text variant="caption" color={colors.text.secondary}>Occupied</Text></Card>
                                <Card style={styles.statCard}><Text variant="subtitle" color="#2563eb">{counts.occupancy}%</Text><Text variant="caption" color={colors.text.secondary}>Occupancy</Text></Card>
                            </View>
                        </View>
                    )}
                </Container>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    grid: { gap: spacing.md },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#ecfdf5' },
    badgeSuccess: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0' },
    badgeDanger: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca' },
    infoBox: { marginBottom: spacing.sm, padding: spacing.sm, backgroundColor: '#fffbeb', borderRadius: 8, borderWidth: 1, borderColor: '#fde68a' },
    code: { fontFamily: 'monospace', backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statCard: { width: '48%', alignItems: 'center', paddingVertical: spacing.md },
});
