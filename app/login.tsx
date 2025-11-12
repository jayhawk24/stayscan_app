import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, spacing, radii } from '@/theme/tokens';

export default function LoginScreen() {
    const { loginUser, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {
        setError(null);
        try {
            await loginUser(email, password);
        } catch (e: any) {
            setError(e.message || 'Login failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="title" style={styles.title}>Bello Staff/Admin Login</Text>
            {error && <Text variant="body" color={colors.brand.danger} style={styles.error}>{error}</Text>}
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                placeholderTextColor={colors.text.secondary}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor={colors.text.secondary}
            />
            <Button
                title={loading ? 'Loading...' : 'Login'}
                onPress={submit}
                disabled={loading || !email || !password}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: spacing.xl, justifyContent: 'center', backgroundColor: colors.surface.background },
    title: { marginBottom: spacing.lg, color: colors.text.primary },
    input: {
        backgroundColor: colors.surface.card,
        padding: spacing.md,
        borderRadius: radii.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.surface.border,
        color: colors.text.primary,
    },
    error: { marginBottom: spacing.md }
});
