import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme/tokens';
import { createRoom } from '@/api/rooms';
import { router } from 'expo-router';

export default function AddRoomScreen() {
    const ROOM_TYPES = [
        'Standard Single',
        'Standard Double',
        'Deluxe Single',
        'Deluxe Double',
        'Junior Suite',
        'Executive Suite',
        'Presidential Suite',
        'Family Room',
        'Connecting Rooms',
        'Accessible Room',
    ];

    const [roomNumber, setRoomNumber] = useState('');
    const [roomType, setRoomType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTypePicker, setShowTypePicker] = useState(false);

    const submit = async () => {
        setError(null);
        if (!roomNumber.trim() || !roomType.trim()) {
            setError('Please provide both room number and room type.');
            return;
        }
        setLoading(true);
        try {
            await createRoom({ roomNumber: roomNumber.trim(), roomType: roomType.trim() });
            router.replace('/rooms');
        } catch (e: any) {
            let msg = e?.message || 'Failed to add room';
            try {
                const parsed = JSON.parse(msg);
                if (parsed?.error === 'room_limit_reached') {
                    msg = 'You are on the Free plan and can only add one room. Please upgrade your subscription to add more rooms.';
                }
            } catch { }
            setError(msg);
        } finally { setLoading(false); }
    };

    return (
        <LinearGradient colors={["#fffbeb", "#fef3c7"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.xl }} keyboardShouldPersistTaps="handled">
                    <Container>
                        <Text variant="hero" style={{ marginBottom: spacing.sm }}>Add New Room</Text>
                        <Text variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.lg }}>Create a room for your hotel.</Text>

                        {error && <Text color={colors.brand.danger} style={{ marginBottom: spacing.md }}>{error}</Text>}

                        <Input label="Room Number" placeholder="101" value={roomNumber} onChangeText={setRoomNumber} keyboardType="numeric" />
                        {/* Room Type dropdown */}
                        <View style={{ marginBottom: spacing.md }}>
                            <Text variant="body" style={{ marginBottom: 6, fontWeight: '600' }}>Room Type</Text>
                            <TouchableOpacity
                                accessibilityRole="button"
                                activeOpacity={0.7}
                                onPress={() => setShowTypePicker(true)}
                                style={styles.select}
                            >
                                <Text color={roomType ? colors.text.primary : colors.text.secondary}>
                                    {roomType || 'Select a room type'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Modal
                            visible={showTypePicker}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setShowTypePicker(false)}
                        >
                            <View style={styles.modalBackdrop}>
                                <View style={styles.modalCard}>
                                    <Text variant="title" style={{ marginBottom: spacing.md }}>Choose Room Type</Text>
                                    <ScrollView style={{ maxHeight: 360 }}>
                                        {ROOM_TYPES.map((type) => (
                                            <TouchableOpacity
                                                key={type}
                                                style={styles.option}
                                                onPress={() => {
                                                    setRoomType(type);
                                                    setShowTypePicker(false);
                                                }}
                                            >
                                                <Text>{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    <View style={{ height: spacing.md }} />
                                    <Button title="Cancel" color={colors.surface.border} onPress={() => setShowTypePicker(false)} />
                                </View>
                            </View>
                        </Modal>

                        <Button title={loading ? 'Adding...' : 'Add Room'} onPress={submit} disabled={loading} />
                        <View style={{ height: spacing.md }} />
                        <Button title="Cancel" color={colors.surface.border} onPress={() => router.back()} />
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    select: {
        borderWidth: 1,
        borderColor: colors.surface.border,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface.card,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    modalCard: {
        borderRadius: 16,
        backgroundColor: '#fff',
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    option: {
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.surface.border,
    },
});
