"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useRouter } from "next/navigation";
import { logoutUser } from "../api/auth-api";

/**
 * Logout Hook - Client-side logout
 * Use this for navbar logout button
 *
 * @example
 * const { logout, isLoading } = useLogout();
 * <button onClick={logout}>Logout</button>
 */
export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            // Clear all auth-related cache
            queryClient.setQueryData(queryKeys.auth.me(), null);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.articles.myArticles(),
            });

            // Redirect to home
            router.push("/");
            router.refresh();
        },
    });

    return {
        logout: mutation.mutate,
        isLoading: mutation.isPending,
    };
}
