import { QueryClient, DefaultOptions } from "@tanstack/react-query";
import { isAuthError } from "@/lib";
import { env } from "@/lib/env";

/**
 * Default options for React Query
 */
const queryConfig: DefaultOptions = {
    queries: {
        // Stale time: Data considered fresh for 30 seconds
        staleTime: 30 * 1000, // 30 seconds

        // Cache time: Keep unused data in cache for 5 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime in v4)

        // Retry failed requests
        retry: (failureCount, error) => {
            // Don't retry on auth errors
            if (isAuthError(error)) return false;
            // Retry max 2 times for other errors
            return failureCount < 2;
        },

        // Retry delay (exponential backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus (useful for real-time data)
        refetchOnWindowFocus: false,

        // Refetch on reconnect (after network issues)
        refetchOnReconnect: true,

        // Don't refetch on mount if data is fresh
        refetchOnMount: false,
    },
    mutations: {
        // Retry mutations only once
        retry: 1,

        // Log errors in development
        onError: (error) => {
            if (env.NODE_ENV === "development") {
                console.error("[Mutation Error]", error);
            }
        },
    },
};

/**
 * Create QueryClient instance
 * Used both on client and server (for prefetching)
 */
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: queryConfig,
    });
}

/**
 * Browser QueryClient instance
 * Singleton for client-side
 */
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (typeof window === "undefined") {
        // Server: always create new instance
        return makeQueryClient();
    } else {
        // Browser: create singleton
        if (!browserQueryClient) {
            browserQueryClient = makeQueryClient();
        }
        return browserQueryClient;
    }
}
