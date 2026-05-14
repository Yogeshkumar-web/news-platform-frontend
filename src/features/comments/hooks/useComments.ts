"use client";

import { useQuery } from "@tanstack/react-query";
import { commentQueries } from "@/lib/react-query/query-options";
import {
    type GetCommentsParams,
} from "../api/comments-api";

/**
 * Comments Hook - Fetch comments for article
 *
 * @example
 * const { comments, pagination, isLoading } = useComments(articleId);
 */
export function useComments(articleId: string, params: GetCommentsParams = {}) {
    const { data, isLoading, isFetching, error, refetch } = useQuery(
        commentQueries.byArticle(articleId, params)
    );

    return {
        comments: data?.comments || [],
        pagination: data?.pagination || null,
        isLoading,
        isFetching,
        error,
        refetch,
    };
}
