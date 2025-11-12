import Constants from "expo-constants";

function resolveApiBase() {
    // 1) Prefer explicit env (set EXPO_PUBLIC_API_BASE="http://<host>:3000/api")
    const envBase = process.env.EXPO_PUBLIC_API_BASE;
    if (envBase && typeof envBase === "string") {
        return envBase.replace(/\/$/, "");
    }

    // 2) Derive host from Expo dev host (works for device & simulator)
    const hostUri =
        (Constants as any).expoConfig?.hostUri ||
        (Constants as any).manifest2?.hostUri ||
        (Constants as any).manifest?.hostUri;
    if (hostUri && typeof hostUri === "string") {
        const host = hostUri.split(":")[0];
        if (host) return `http://${host}:3000/api`;
    }

    // 3) Fallback for web/simulator environments
    return "http://192.168.1.22:3000/api";
}

function resolveWebBase() {
    const envBase = process.env.EXPO_PUBLIC_WEB_BASE;
    if (envBase && typeof envBase === "string") {
        return envBase.replace(/\/$/, "");
    }
    const hostUri =
        (Constants as any).expoConfig?.hostUri ||
        (Constants as any).manifest2?.hostUri ||
        (Constants as any).manifest?.hostUri;
    if (hostUri && typeof hostUri === "string") {
        const host = hostUri.split(":")[0];
        if (host) return `http://${host}:3000`;
    }
    return "http://192.168.1.22:3000";
}

export const CONFIG = {
    API_BASE: resolveApiBase(),
    WEB_BASE: resolveWebBase()
};
