import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme/tokens';
import { createRoom } from '@/api/rooms';
import { router } from 'expo-router';

export default function AddRoomScreen() {
    const [roomNumber, setRoomNumber] = useState('');
    const [roomType, setRoomType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError(e?.message || 'Failed to add room');
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
                        <Input label="Room Type" placeholder="Deluxe, Suite, Standard" value={roomType} onChangeText={setRoomType} />

                        <Button title={loading ? 'Adding...' : 'Add Room'} onPress={submit} disabled={loading} />
                        <View style={{ height: spacing.md }} />
                        <Button title="Cancel" color={colors.surface.border} onPress={() => router.back()} />
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({});
