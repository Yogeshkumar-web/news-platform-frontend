"use client";

import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/lib/react-query/query-options";

/**
 * Auth Hook - Get current user
 * Uses React Query for caching and automatic refetching
 *
 * @example
 * const { user, isLoading, isAuthenticated } = useAuth();
 */
export function useAuth() {
    const {
        data: user,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useQuery(authQueries.me());

    return {
        user: user || null,
        isLoading,
        isFetching,
        isAuthenticated: !!user,
        error,
        refetch,
    };
}
