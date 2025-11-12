import { CONFIG } from "@/constants/config";
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    clearTokens
} from "@/lib/storage";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

async function request<T>(
    method: HttpMethod,
    path: string,
    body?: any,
    retry = true
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
    const token = await getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = `${CONFIG.API_BASE}${path}`;
    console.log("[http]", method, url); // instrumentation
    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    if (res.status === 401) {
        // Try to parse body to detect token expiration error
        let errBody: any = null;
        try {
            const text = await res.text();
            errBody = text ? JSON.parse(text) : null;
        } catch {}

        if (retry && errBody?.error === "token_expired") {
            const refreshed = await tryRefresh();
            if (refreshed) return request<T>(method, path, body, false);
        }
        // Fallthrough to throw
        const msg = errBody?.error || `HTTP 401`;
        throw new Error(msg);
    }

    if (!res.ok) {
        const text = await res.text();
        console.warn("[http] error", res.status, text);
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}

async function tryRefresh(): Promise<boolean> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;
    try {
        const refreshUrl = `${CONFIG.API_BASE}/mobile/refresh`;
        console.log("[http] refresh POST", refreshUrl);
        const res = await fetch(refreshUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });
        if (!res.ok) return false;
        const data = await res.json();
        if (data?.accessToken) {
            await setAccessToken(data.accessToken);
            return true;
        }
    } catch {}
    await clearTokens();
    return false;
}

export const http = {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body?: any) => request<T>("POST", path, body),
    patch: <T>(path: string, body?: any) => request<T>("PATCH", path, body),
    put: <T>(path: string, body?: any) => request<T>("PUT", path, body),
    del: <T>(path: string) => request<T>("DELETE", path)
};
