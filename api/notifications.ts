import { http } from "@/api/client";

export type NotificationItem = {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
};

export async function fetchNotifications(limit = 20) {
    const data = await http.get<{
        success: boolean;
        notifications: NotificationItem[];
    }>(`/notifications?limit=${limit}`);
    return data.notifications;
}

export async function markNotificationRead(notificationId: string) {
    return http.patch(`/notifications`, { notificationId });
}

export async function markAllNotificationsRead() {
    return http.patch(`/notifications`, { markAllAsRead: true });
}

export async function registerDeviceToken(
    deviceToken: string,
    platform: string = "android"
) {
    return http.post(`/notifications/device-tokens`, { deviceToken, platform });
}

    export async function deregisterDeviceToken(deviceToken: string) {
         return http.del(`/notifications/device-tokens?deviceToken=${encodeURIComponent(deviceToken)}`);
    }
