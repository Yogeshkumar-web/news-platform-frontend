"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { GetArticlesParams } from "@/types";
import { getArticles } from "../api/article-api";

/**
 * Articles Hook - Fetch articles with filters
 *
 * @example
 * const { articles, pagination, isLoading } = useArticles({
 *   page: 1,
 *   category: 'tech'
 * });
 */
export function useArticles(params: GetArticlesParams = {}) {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.articles.list(params),
        queryFn: () => getArticles(params),
        staleTime: 30 * 1000, // 30 seconds
    });

    return {
        articles: data?.articles || [],
        pagination: data?.pagination || null,
        isLoading,
        error,
        refetch,
    };
}
