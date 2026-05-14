import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/auth-api";
import {
    getArticles,
    getMyArticles,
    type GetArticlesParams,
} from "@/features/articles/api/article-api";
import {
    getCommentStats,
    getCommentsByArticle,
    type GetCommentsParams,
} from "@/features/comments/api/comments-api";
import { getCategories } from "@/features/categories/api/categories-api";
import { queryKeys } from "./query-keys";
import { queryPolicies } from "./policies";

export const authQueries = {
    me: () =>
        queryOptions({
            queryKey: queryKeys.auth.me(),
            queryFn: getCurrentUser,
            ...queryPolicies.auth,
            retry: false,
        }),
};

export const articleQueries = {
    list: (params: GetArticlesParams = {}) =>
        queryOptions({
            queryKey: queryKeys.articles.list(params),
            queryFn: () => getArticles(params),
            placeholderData: keepPreviousData,
            ...queryPolicies.articles.list,
        }),
    myArticles: (
        params: { page?: number; pageSize?: number; status?: string } = {}
    ) =>
        queryOptions({
            queryKey: queryKeys.articles.myArticles(params),
            queryFn: () => getMyArticles(params),
            placeholderData: keepPreviousData,
            ...queryPolicies.articles.list,
        }),
};

export const commentQueries = {
    byArticle: (articleId: string, params: GetCommentsParams = {}) =>
        queryOptions({
            queryKey: queryKeys.comments.byArticle(articleId, params),
            queryFn: () => getCommentsByArticle(articleId, params),
            enabled: Boolean(articleId),
            placeholderData: keepPreviousData,
            ...queryPolicies.comments,
        }),
    stats: (articleId: string) =>
        queryOptions({
            queryKey: queryKeys.comments.stats(articleId),
            queryFn: () => getCommentStats(articleId),
            enabled: Boolean(articleId),
            ...queryPolicies.comments,
        }),
};

export const categoryQueries = {
    list: () =>
        queryOptions({
            queryKey: queryKeys.categories.list(),
            queryFn: getCategories,
            ...queryPolicies.categories,
        }),
};
