import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

interface CheckboxProps {
    checked: boolean;
    onChange: (next: boolean) => void;
    size?: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, size = 20 }) => {
    return (
        <Pressable onPress={() => onChange(!checked)} style={[styles.box, { width: size, height: size, borderRadius: 4 }]}>
            {checked && <View style={[styles.inner, { width: size - 6, height: size - 6 }]} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    box: {
        borderWidth: 1,
        borderColor: colors.surface.border,
        backgroundColor: colors.surface.card,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inner: {
        backgroundColor: colors.brand.primary,
        borderRadius: 3
    }
});

export default Checkbox;
