"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { deleteArticle } from "../api/article-api";

/**
 * Delete Article Hook
 * Invalidates article queries on success
 */
export function useDeleteArticle() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            // Invalidate article lists
            queryClient.invalidateQueries({
                queryKey: queryKeys.articles.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.articles.myArticles(),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.categories.list(),
            });
        },
    });

    return {
        deleteArticle: mutation.mutate,
        isDeleting: mutation.isPending,
        error: mutation.error,
    };
}
