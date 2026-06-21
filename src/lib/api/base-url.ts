const DEFAULT_DEV_API_BASE_URL = "http://localhost:5000";

function normalizeBaseUrl(value: string): string {
    return value.replace(/\/+$/, "");
}

function isLocalApiUrl(value: string | undefined): boolean {
    if (!value) return false;

    try {
        const url = new URL(value);
        return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
    } catch {
        return false;
    }
}

function requireProductionApiUrl(value: string | undefined): string {
    if (!value) {
        throw new Error(
            "Production API URL is missing. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.",
        );
    }

    return normalizeBaseUrl(value);
}

export function getServerApiBaseUrl(): string {
    const privateUrl = process.env.API_BASE_URL;
    const publicUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (process.env.NODE_ENV === "production") {
        return requireProductionApiUrl(privateUrl || publicUrl);
    }

    if (isLocalApiUrl(privateUrl)) {
        return normalizeBaseUrl(privateUrl as string);
    }

    if (isLocalApiUrl(publicUrl)) {
        return normalizeBaseUrl(publicUrl as string);
    }

    return DEFAULT_DEV_API_BASE_URL;
}

export function getPublicApiBaseUrl(): string {
    const publicUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (process.env.NODE_ENV === "production") {
        return requireProductionApiUrl(publicUrl);
    }

    if (isLocalApiUrl(publicUrl)) {
        return normalizeBaseUrl(publicUrl as string);
    }

    return DEFAULT_DEV_API_BASE_URL;
}
