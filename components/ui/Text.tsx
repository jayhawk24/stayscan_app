import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

type Variant = 'title' | 'subtitle' | 'body' | 'caption' | 'button' | 'hero';

export interface TextProps extends RNTextProps {
    variant?: Variant;
    color?: string;
}

export const Text: React.FC<TextProps> = ({ variant = 'body', style, color, children, ...rest }) => {
    const base = (() => {
        switch (variant) {
            case 'title':
                return { fontSize: 22, fontFamily: fonts.heading } as const;
            case 'hero':
                return { fontSize: 30, fontFamily: fonts.heading } as const;
            case 'subtitle':
                return { fontSize: 16, fontFamily: fonts.body } as const;
            case 'caption':
                return { fontSize: 12, fontFamily: fonts.bodyRegular } as const;
            case 'button':
                return { fontSize: 16, fontFamily: fonts.body, textTransform: 'uppercase' } as const;
            default:
                return { fontSize: 14, fontFamily: fonts.body } as const;
        }
    })();

    return (
        <RNText style={[{ color: color ?? colors.text.primary }, base, style]} {...rest}>
            {children}
        </RNText>
    );
};

export default Text;
