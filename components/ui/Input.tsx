import React, { useMemo, useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, ViewStyle, Pressable } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';
import { Text } from './Text';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface Props extends TextInputProps {
    label?: string;
    containerStyle?: ViewStyle | ViewStyle[];
    secureToggle?: boolean; // when true and secureTextEntry is set, show an eye icon to toggle visibility
}

export const Input: React.FC<Props> = ({ label, style, containerStyle, secureToggle, secureTextEntry, ...rest }) => {
    const initialSecure = !!secureTextEntry;
    const [isSecure, setIsSecure] = useState<boolean>(initialSecure);
    const showToggle = !!secureToggle && !!secureTextEntry;
    const inputPaddingRight = useMemo(() => (showToggle ? spacing.xl * 1.6 : spacing.md), [showToggle]);

    return (
        <View style={[containerStyle]}
        >
            {label ? (
                <Text variant="caption" style={{ marginBottom: spacing.xs, color: colors.text.secondary }}>
                    {label}
                </Text>
            ) : null}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, { paddingRight: inputPaddingRight }, style]}
                    placeholderTextColor={colors.text.secondary}
                    selectionColor={colors.brand.primary}
                    {...rest}
                    secureTextEntry={isSecure}
                />
                {showToggle && (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
                        onPress={() => setIsSecure(!isSecure)}
                        style={styles.eyeButton}
                        hitSlop={8}
                    >
                        <MaterialIcons name={isSecure ? 'visibility-off' : 'visibility'} size={20} color={colors.text.secondary} />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: colors.surface.card,
        padding: spacing.md,
        borderRadius: radii.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.surface.border,
        color: colors.text.primary,
    },
    eyeButton: {
        position: 'absolute',
        right: spacing.md,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Input;
