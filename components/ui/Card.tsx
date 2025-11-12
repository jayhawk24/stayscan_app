import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '@/theme/tokens';

export const Card: React.FC<ViewProps> = ({ style, children, ...rest }) => (
    <View style={[styles.card, style]} {...rest}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface.card,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.surface.border,
        padding: spacing.md,
    },
});

export default Card;
