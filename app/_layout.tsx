import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { colors } from '@/theme/tokens';
import { useFonts as useRaleway, Raleway_700Bold } from '@expo-google-fonts/raleway';
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ralewayLoaded] = useRaleway({ Raleway_700Bold });
  const [montLoaded] = useMontserrat({ Montserrat_400Regular, Montserrat_500Medium });

  useEffect(() => {
    // Show alerts for notifications received in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const sub1 = Notifications.addNotificationReceivedListener(() => {
      // Could trigger global state updates here if needed
    });
    const sub2 = Notifications.addNotificationResponseReceivedListener(() => {
      // Handle taps on notifications if we add deep linking later
    });
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  if (!ralewayLoaded || !montLoaded) return null;

  const navTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.brand.primary,
      background: colors.surface.background,
      card: colors.surface.card,
      text: colors.text.primary,
      border: colors.surface.border,
      notification: colors.brand.accent,
    },
  } as const;

  return (
    <AuthProvider>
      <ThemeProvider value={navTheme}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface.background }} edges={["top", "left", "right", "bottom"]}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" />
              <Stack.Screen name="dashboard/index" />
              <Stack.Screen name="requests/[id]" />
              <Stack.Screen name="subscription" />
              <Stack.Screen name="hotel/index" />
              <Stack.Screen name="hotel/edit" />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
