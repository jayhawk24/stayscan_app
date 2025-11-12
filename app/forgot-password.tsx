import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme/tokens';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const submit = async () => {
        setErr(null);
        try {
            // TODO: integrate with API endpoint when ready
            // await requestPasswordReset(email)
            setSent(true);
        } catch (e: any) {
            setErr(e?.message || 'Failed to submit');
        }
    };

    return (
        <LinearGradient colors={["#fefce8", "#fef3c7"]} style={{ flex: 1 }}>
            <Container style={styles.outer}>
                <Text variant="title" style={styles.heading}>Forgot Password</Text>
                <Text variant="body" color={colors.text.secondary} style={styles.subheading}>
                    Enter your email and we'll send you a reset link.
                </Text>
                {err && <Text variant="body" color={colors.brand.danger} style={{ marginBottom: spacing.sm }}>{err}</Text>}
                {sent ? (
                    <Text variant="body" color={colors.brand.primary} style={{ textAlign: 'center' }}>
                        If an account exists for {email}, you'll receive an email shortly.
                    </Text>
                ) : (
                    <>
                        <Input label="Email Address" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
                        <Button title="Send Reset Link" onPress={submit} disabled={!email} />
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
