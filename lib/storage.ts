// Token storage with in-memory cache and optional persistence via Expo SecureStore.
import * as SecureStore from "expo-secure-store";

let ACCESS_TOKEN: string | null = null;
let REFRESH_TOKEN: string | null = null;

const ACCESS_KEY = "ACCESS_TOKEN";
const REFRESH_KEY = "REFRESH_TOKEN";

export async function setAccessToken(token: string) {
    ACCESS_TOKEN = token;
}
export async function setRefreshToken(token: string) {
    REFRESH_TOKEN = token;
}
export async function getAccessToken() {
    if (ACCESS_TOKEN) return ACCESS_TOKEN;
    try {
        const stored = await SecureStore.getItemAsync(ACCESS_KEY);
        ACCESS_TOKEN = stored || null;
    } catch {
        /* ignore */
    }
    return ACCESS_TOKEN;
}
export async function getRefreshToken() {
    if (REFRESH_TOKEN) return REFRESH_TOKEN;
    try {
        const stored = await SecureStore.getItemAsync(REFRESH_KEY);
        REFRESH_TOKEN = stored || null;
    } catch {
        /* ignore */
    }
    return REFRESH_TOKEN;
}
export async function storeTokens(
    access: string,
    refresh: string,
    persist: boolean = false
) {
    ACCESS_TOKEN = access;
    REFRESH_TOKEN = refresh;
    if (persist) {
        try {
            await SecureStore.setItemAsync(ACCESS_KEY, access);
            await SecureStore.setItemAsync(REFRESH_KEY, refresh);
        } catch {
            /* ignore */
        }
    }
}
export async function clearTokens() {
    ACCESS_TOKEN = null;
    REFRESH_TOKEN = null;
    try {
        await SecureStore.deleteItemAsync(ACCESS_KEY);
        await SecureStore.deleteItemAsync(REFRESH_KEY);
    } catch {
        /* ignore */
    }
}
