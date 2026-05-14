"use client";

import { useQuery } from "@tanstack/react-query";
import { articleQueries } from "@/lib/react-query/query-options";
import { GetArticlesParams } from "@/types";

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
    const { data, isLoading, isFetching, error, refetch } = useQuery(
        articleQueries.list(params)
    );

    return {
        articles: data?.articles || [],
        pagination: data?.pagination || null,
        isLoading,
        isFetching,
        error,
        refetch,
    };
}
