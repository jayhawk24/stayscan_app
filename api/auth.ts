import { http } from "@/api/client";
import { storeTokens } from "@/lib/storage";

export async function login(
    email: string,
    password: string,
    deviceToken?: string,
    platform: string = "android",
    remember: boolean = false
) {
    const data = await http.post<{
        tokenType: string;
        accessToken: string;
        refreshToken: string;
        user: any;
    }>("/mobile/login", { email, password, deviceToken, platform });
    await storeTokens(data.accessToken, data.refreshToken, remember);
    return data.user as { id: string; role: string; hotelId?: string | null };
}
