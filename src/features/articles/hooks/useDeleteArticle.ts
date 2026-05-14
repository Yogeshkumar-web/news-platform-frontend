"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invalidateArticleData } from "@/lib/react-query/invalidations";
import { deleteArticle } from "../api/article-api";

/**
 * Delete Article Hook
 * Invalidates article queries on success
 */
export function useDeleteArticle() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteArticle,
        onSuccess: async (_data, articleId) => {
            await invalidateArticleData(queryClient, { articleId });
        },
    });

    return {
        deleteArticle: mutation.mutate,
        isDeleting: mutation.isPending,
        error: mutation.error,
    };
}
