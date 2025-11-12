import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme/tokens';
import { fetchRoom, Room } from '@/api/rooms';
import { useLocalSearchParams, router } from 'expo-router';

export default function RoomDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await fetchRoom(String(id));
                setRoom(data);
            } catch (e: any) {
                setError(e?.message || 'Failed to load room');
            } finally { setLoading(false); }
        };
        load();
    }, [id]);

    return (
        <LinearGradient colors={["#fffbeb", "#fef3c7"]} style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.xl }}>
                <Container>
                    {loading ? (
                        <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
                            <ActivityIndicator color={colors.brand.accent} />
                            <Text color={colors.text.secondary} style={{ marginTop: spacing.sm }}>Loading room...</Text>
                        </View>
                    ) : error ? (
                        <View>
                            <Text color={colors.brand.danger} style={{ marginBottom: spacing.md }}>{error}</Text>
                            <Button title="Back" onPress={() => router.back()} />
                        </View>
                    ) : room ? (
                        <View style={{ gap: spacing.md }}>
                            <Text variant="hero">Room {room.roomNumber}</Text>
                            <Text variant="body" color={colors.text.secondary}>{room.roomType}</Text>

                            <View style={[styles.badge, room.isOccupied ? styles.badgeDanger : styles.badgeSuccess]}>
                                <Text variant="caption" color={room.isOccupied ? '#991b1b' : '#065f46'}>
                                    {room.isOccupied ? 'Occupied' : 'Available'}
                                </Text>
                            </View>

                            {room.currentBookingId && (
                                <View style={styles.infoBox}>
                                    <Text variant="caption" color={colors.text.secondary}>Current Booking:</Text>
                                    <Text>{room.currentBookingId}</Text>
                                </View>
                            )}

                            <View>
                                <Text variant="caption" color={colors.text.secondary}>Access Code:</Text>
                                <Text style={styles.code}>{room.accessCode}</Text>
                            </View>

                            <Button title="Back to Rooms" onPress={() => router.replace('/rooms')} />
                        </View>
                    ) : null}
                </Container>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#ecfdf5', alignSelf: 'flex-start' },
    badgeSuccess: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0' },
    badgeDanger: { backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca' },
    infoBox: { marginVertical: spacing.sm, padding: spacing.sm, backgroundColor: '#fffbeb', borderRadius: 8, borderWidth: 1, borderColor: '#fde68a' },
    code: { fontFamily: 'monospace', backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
});
