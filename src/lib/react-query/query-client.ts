import { DefaultOptions, QueryClient } from "@tanstack/react-query";
import {
    queryPolicies,
    retryDelay,
    shouldRetryMutation,
    shouldRetryQuery,
} from "./policies";

/**
 * Default options for React Query
 */
const queryConfig: DefaultOptions = {
    queries: {
        staleTime: queryPolicies.articles.list.staleTime,
        gcTime: queryPolicies.articles.list.gcTime,
        retry: shouldRetryQuery,
        retryDelay,

        // Refetch on window focus (useful for real-time data)
        refetchOnWindowFocus: false,

        // Refetch on reconnect (after network issues)
        refetchOnReconnect: true,

        // Don't refetch on mount if data is fresh
        refetchOnMount: false,
    },
    mutations: {
        retry: shouldRetryMutation,
        retryDelay,

        // Log errors in development
        onError: (error) => {
            if (process.env.NODE_ENV === "development") {
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
