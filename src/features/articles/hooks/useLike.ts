"use client";

import { useState, useTransition } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeAction } from "../actions/toggle-like-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { invalidateArticleData } from "@/lib/react-query/invalidations";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { Article } from "@/types";
import type { ArticlesResponse } from "../api/article-api";

interface UseLikeProps {
    articleId: string;
    initialLikeCount: number;
    initialIsLiked: boolean;
}

function updateArticleLikeCount(
    article: Article,
    articleId: string,
    likeCount: number
) {
    if (article.id !== articleId) return article;

    return {
        ...article,
        _count: {
            comments: article._count?.comments || 0,
            likes: likeCount,
        },
    };
}

/**
 * Like Hook with Optimistic Updates
 * Shows instant feedback, reverts on error
 */
export function useLike({
    articleId,
    initialLikeCount,
    initialIsLiked,
}: UseLikeProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [_isRefreshing, startTransition] = useTransition();

    // Optimistic state
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    const mutation = useMutation({
        mutationFn: async () => {
            const result = await toggleLikeAction(articleId);

            if (!result.success) {
                throw new Error(result.message || "Failed to update like");
            }

            return result;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.articles.all,
            });

            const previousState = { likeCount, isLiked };
            const previousArticleQueries =
                queryClient.getQueriesData<ArticlesResponse>({
                    queryKey: queryKeys.articles.all,
                });

            const nextIsLiked = !isLiked;
            const nextLikeCount = Math.max(
                nextIsLiked ? likeCount + 1 : likeCount - 1,
                0
            );

            setIsLiked(nextIsLiked);
            setLikeCount(nextLikeCount);

            previousArticleQueries.forEach(([queryKey, previous]) => {
                if (!previous) return;

                queryClient.setQueryData<ArticlesResponse>(queryKey, {
                    ...previous,
                    articles: previous.articles.map((article) =>
                        updateArticleLikeCount(
                            article,
                            articleId,
                            nextLikeCount
                        )
                    ),
                });
            });

            return { previousState, previousArticleQueries };
        },
        onSuccess: (result) => {
            setLikeCount(result.likeCount);
            setIsLiked(result.isLiked);

            queryClient
                .getQueriesData<ArticlesResponse>({
                    queryKey: queryKeys.articles.all,
                })
                .forEach(([queryKey, previous]) => {
                    if (!previous) return;

                    queryClient.setQueryData<ArticlesResponse>(queryKey, {
                        ...previous,
                        articles: previous.articles.map((article) =>
                            updateArticleLikeCount(
                                article,
                                articleId,
                                result.likeCount
                            )
                        ),
                    });
                });
        },
        onError: (error, _variables, context) => {
            if (context?.previousState) {
                setLikeCount(context.previousState.likeCount);
                setIsLiked(context.previousState.isLiked);
            }

            context?.previousArticleQueries.forEach(([queryKey, previous]) => {
                queryClient.setQueryData(queryKey, previous);
            });

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update like"
            );
        },
        onSettled: () => {
            startTransition(() => {
                router.refresh();
            });
            void invalidateArticleData(queryClient, { articleId });
        },
    });

    return {
        likeCount,
        isLiked,
        toggleLike: () => mutation.mutate(),
        isPending: mutation.isPending,
    };
}
