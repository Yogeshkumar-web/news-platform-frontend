"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { deleteComment } from "../api/comments-api";

/**
 * Delete Comment Hook (Client-side)
 * Invalidates comment queries on success
 */
export function useDeleteComment(articleId: string) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            // Invalidate comments for this article
            queryClient.invalidateQueries({
                queryKey: queryKeys.comments.byArticle(articleId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.comments.stats(articleId),
            });
        },
    });

    return {
        deleteComment: mutation.mutate,
        isDeleting: mutation.isPending,
        error: mutation.error,
    };
}
