"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import {
    getCommentsByArticle,
    type GetCommentsParams,
} from "../api/comments-api";

/**
 * Comments Hook - Fetch comments for article
 *
 * @example
 * const { comments, pagination, isLoading } = useComments(articleId);
 */
export function useComments(articleId: string, params: GetCommentsParams = {}) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.comments.byArticle(articleId, params),
        queryFn: () => getCommentsByArticle(articleId, params),
        staleTime: 30 * 1000, // 30 seconds
        enabled: !!articleId,
    });

    return {
        comments: data?.comments || [],
        pagination: data?.pagination || null,
        isLoading,
        error,
        refetch,
    };
}
