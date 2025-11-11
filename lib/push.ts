import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

let LAST_PUSH_TOKEN: string | null = null;

export async function registerForPushNotificationsAsync(): Promise<
    string | null
> {
    // Android channel
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX
        });
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        return null;
    }

    // Determine projectId when available (EAS)
    const projectId =
        (Constants as any).easConfig?.projectId ||
        (Constants as any).expoConfig?.extra?.eas?.projectId;
    const tokenData = projectId
        ? await Notifications.getExpoPushTokenAsync({ projectId })
        : await Notifications.getExpoPushTokenAsync();

    const token = (tokenData as any).data ?? (tokenData as any).token ?? null;
    LAST_PUSH_TOKEN = token;
    return token;
}

export function getLastPushToken() {
    return LAST_PUSH_TOKEN;
}
