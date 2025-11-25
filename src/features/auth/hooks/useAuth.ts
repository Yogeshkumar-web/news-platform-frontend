"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { getCurrentUser } from "../api/auth-api";

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
        error,
        refetch,
    } = useQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: getCurrentUser,
        retry: false, // Don't retry on auth errors
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        user: user || null,
        isLoading,
        isAuthenticated: !!user,
        error,
        refetch,
    };
}
