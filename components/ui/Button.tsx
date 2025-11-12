import React from 'react';
import { Pressable, StyleSheet, ViewStyle, PressableProps } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';
import { Text } from './Text';

interface Props extends Omit<PressableProps, 'style' | 'children'> {
    title: string;
    color?: string;
    style?: ViewStyle | ViewStyle[];
}

export const Button: React.FC<Props> = ({ title, onPress, color, disabled, style, ...rest }) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.base,
                { backgroundColor: color ?? colors.brand.primary, opacity: disabled ? 0.6 : pressed ? 0.9 : 1 },
                style as any,
            ]}
            {...rest}
        >
            <Text variant="button" color={colors.text.inverse}>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radii.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Button;
