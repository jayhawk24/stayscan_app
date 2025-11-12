import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/theme/tokens';
import { Input } from '@/components/ui/Input';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { View as RNView } from 'react-native';
import { router } from 'expo-router';
import Checkbox from '@/components/ui/Checkbox';

export default function LoginScreen() {
    const { loginUser, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [remember, setRemember] = useState(false);

    const submit = async () => {
        setError(null);
        try {
            await loginUser(email, password, remember);
        } catch (e: any) {
            setError(e.message || 'Login failed');
        }
    };

    return (
        <LinearGradient colors={["#fefce8", "#fef3c7"]} style={{ flex: 1 }}>
            <Container style={styles.outer}>
                <RNView style={styles.logoCircle}>
                    <Text variant="title" color={colors.text.inverse} style={{ textAlign: 'center' }}>🏨</Text>
                </RNView>
                <Text variant="title" style={styles.heading}>Welcome Back</Text>
                <Text variant="body" color={colors.text.secondary} style={styles.subheading}>Sign in to your account</Text>
                {error && <Text variant="body" color={colors.brand.danger} style={styles.error}>{error}</Text>}
                <Input
                    label="Email Address"
                    placeholder="hotel@example.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                />
                <Input
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={styles.inlineBetween}>
                    <Pressable onPress={() => setRemember(!remember)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Checkbox checked={remember} onChange={setRemember} />
                        <Text variant="caption" color={colors.text.secondary}>Remember me</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push('/forgot-password')}>
                        <Text variant="caption" color={colors.brand.primary}>Forgot password?</Text>
                    </Pressable>
                </View>
                <Button
                    title={loading ? '🔄 Signing in...' : '🔑 Sign In'}
                    onPress={submit}
                    disabled={loading || !email || !password}
                />
                <View style={{ height: spacing.lg }} />
                <Text variant="body" color={colors.text.secondary} style={{ textAlign: 'center', marginBottom: spacing.sm }}>New to Bello?</Text>
                <Button title="🏨 Create Hotel Account" color={colors.brand.accent} onPress={() => { router.push('/hotel/create'); }} />
                <View style={styles.divider} />
            </Container>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    outer: { flex: 1, justifyContent: 'center' },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.brand.accent,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: spacing.md,
    },
    heading: { textAlign: 'center', marginBottom: spacing.xs, color: colors.text.primary },
    subheading: { textAlign: 'center', marginBottom: spacing.lg },
    inlineBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    divider: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.surface.border },
    error: { marginBottom: spacing.md },
});
