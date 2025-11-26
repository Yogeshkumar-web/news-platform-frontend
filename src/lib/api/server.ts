import type { ApiResponse } from "@/types";
import { CustomAxiosError } from "./client";

// Server-side API base URL (can be internal)
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

if (!API_BASE_URL) {
    throw new Error("CRITICAL: Server API URL not configured");
}

/**
 * Next.js fetch options with revalidation support
 */
type ServerFetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
    headers?: Record<string, string>;
    cache?: RequestCache;
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
};

/**
 * Join URLs properly (removes double slashes)
 */
function joinUrl(base: string, path: string): string {
    const cleanBase = base.replace(/\/+$/, "");
    const cleanPath = path.replace(/^\/+/, "");
    return `${cleanBase}/${cleanPath}`;
}

/**
 * Type guard for ApiResponse
 */
function isApiResponse<T>(data: unknown): data is ApiResponse<T> {
    return (
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        "timestamp" in data
    );
}

/**
 * Extract data from API response
 */
function extractData<T>(response: ApiResponse<T> | T): T {
    if (isApiResponse<T>(response)) {
        if (!response.success) {
            const error = new Error(
                response.message || "API request failed"
            ) as CustomAxiosError;
            error.code = response.code;
            error.errors = response.errors;
            throw error;
        }

        if (response.data === undefined || response.data === null) {
            throw new Error("API returned success but no data");
        }

        return response.data;
    }

    return response as T;
}

/**
 * Server-side fetch wrapper with cookie forwarding
 * Used in Server Components and Server Actions
 *
 * @example
 * const articles = await serverFetch<Article[]>('/api/articles');
 */
export async function serverFetch<T = unknown>(
    path: string,
    options: ServerFetchOptions = {}
): Promise<T> {
    // eslint-disable-next-line
    const { cookies } = require("next/headers");
    const url = joinUrl(API_BASE_URL, path);

    try {
        // Get cookies for authentication
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Prepare headers
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers,
        };

        // Forward auth cookie and set Authorization header
        if (token) {
            headers.Cookie = `token=${token}`;
            headers.Authorization = `Bearer ${token}`;
        }

        // Prepare body
        const body =
            options.body && options.method !== "GET"
                ? JSON.stringify(options.body)
                : undefined;

        // Log request in development
        if (process.env.NODE_ENV === "development") {
            console.log(
                `[Server Fetch] ${options.method || "GET"} ${path}`,
                body ? "with body" : ""
            );
        }

        const response = await fetch(url, {
            method: options.method || "GET",
            headers,
            body,
            cache: options.cache || "no-store", // Default: no cache
            next: options.next,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const error = new Error(
                errorData.message || `HTTP ${response.status} Error`
            ) as CustomAxiosError;
            error.status = response.status;
            error.code = errorData.code;
            error.data = errorData;
            error.errors = errorData.errors;

            if (process.env.NODE_ENV === "development") {
                console.error(`[Server Fetch Error] ${response.status}`, error);
            }

            throw error;
        }

        const data = await response.json();

        if (process.env.NODE_ENV === "development") {
            console.log(`[Server Fetch Success] ${response.status} ${path}`);
        }

        return extractData<T>(data);
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error(`[Server Fetch Error] ${path}:`, error);
        }
        throw error;
    }
}

/**
 * Convenience methods for different HTTP verbs
 */
export const serverGet = <T = unknown>(
    path: string,
    options?: Omit<ServerFetchOptions, "method" | "body">
) => serverFetch<T>(path, { ...options, method: "GET" });

export const serverPost = <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<ServerFetchOptions, "method" | "body">
) => serverFetch<T>(path, { ...options, method: "POST", body });

export const serverPut = <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<ServerFetchOptions, "method" | "body">
) => serverFetch<T>(path, { ...options, method: "PUT", body });

export const serverPatch = <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<ServerFetchOptions, "method" | "body">
) => serverFetch<T>(path, { ...options, method: "PATCH", body });

export const serverDelete = <T = unknown>(
    path: string,
    options?: Omit<ServerFetchOptions, "method" | "body">
) => serverFetch<T>(path, { ...options, method: "DELETE" });
