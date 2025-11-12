import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme/tokens';

export default function CreateHotelScreen() {
    const [hotelName, setHotelName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [created, setCreated] = useState(false);

    const submit = async () => {
        setError(null);
        try {
            // TODO: integrate with API endpoint when ready
            // await registerHotel({ hotelName, email, password })
            setCreated(true);
        } catch (e: any) {
            setError(e?.message || 'Failed to create account');
        }
    };

    return (
        <LinearGradient colors={["#fefce8", "#fef3c7"]} style={{ flex: 1 }}>
            <Container style={styles.outer}>
                <Text variant="title" style={styles.heading}>Create Hotel Account</Text>
                <Text variant="body" color={colors.text.secondary} style={styles.subheading}>
                    Set up your hotel admin account.
                </Text>
                {error && <Text variant="body" color={colors.brand.danger} style={{ marginBottom: spacing.sm }}>{error}</Text>}
                {created ? (
                    <Text variant="body" color={colors.brand.primary} style={{ textAlign: 'center' }}>
                        Account created. Please check your email to verify.
                    </Text>
                ) : (
                    <>
                        <Input label="Hotel Name" placeholder="Sunrise Suites" value={hotelName} onChangeText={setHotelName} />
                        <Input label="Email Address" placeholder="owner@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                        <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
                        <Button title="Create Account" onPress={submit} disabled={!hotelName || !email || !password} />
                    </>
                )}
            </Container>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    outer: { flex: 1, justifyContent: 'center' },
    heading: { textAlign: 'center', marginBottom: spacing.xs, color: colors.text.primary },
    subheading: { textAlign: 'center', marginBottom: spacing.lg },
});
