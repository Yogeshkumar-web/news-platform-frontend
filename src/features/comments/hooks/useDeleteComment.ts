"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/query-keys";
import { invalidateCommentsForArticle } from "@/lib/react-query/invalidations";
import type { CommentsResponse } from "../api/comments-api";
import { deleteComment } from "../api/comments-api";
import type { Comment } from "@/types";

function removeCommentById(comments: Comment[], commentId: string): Comment[] {
    return comments
        .filter((comment) => comment.id !== commentId)
        .map((comment) => ({
            ...comment,
            replies: comment.replies
                ? removeCommentById(comment.replies, commentId)
                : comment.replies,
        }));
}

/**
 * Delete Comment Hook (Client-side)
 * Invalidates comment queries on success
 */
export function useDeleteComment(articleId: string) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteComment,
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.comments.article(articleId),
            });

            const previousCommentQueries =
                queryClient.getQueriesData<CommentsResponse>({
                    queryKey: queryKeys.comments.article(articleId),
                });
            const previousStats = queryClient.getQueryData<number>(
                queryKeys.comments.stats(articleId)
            );

            previousCommentQueries.forEach(([queryKey, previous]) => {
                if (!previous) return;

                queryClient.setQueryData<CommentsResponse>(queryKey, {
                    ...previous,
                    comments: removeCommentById(previous.comments, commentId),
                    pagination: previous.pagination
                        ? {
                              ...previous.pagination,
                              total: Math.max(
                                  previous.pagination.total - 1,
                                  0
                              ),
                          }
                        : previous.pagination,
                });
            });

            if (typeof previousStats === "number") {
                queryClient.setQueryData(
                    queryKeys.comments.stats(articleId),
                    Math.max(previousStats - 1, 0)
                );
            }

            return { previousCommentQueries, previousStats };
        },
        onError: (_error, _commentId, context) => {
            context?.previousCommentQueries.forEach(([queryKey, previous]) => {
                queryClient.setQueryData(queryKey, previous);
            });

            if (typeof context?.previousStats === "number") {
                queryClient.setQueryData(
                    queryKeys.comments.stats(articleId),
                    context.previousStats
                );
            }
        },
        onSettled: async () => {
            await invalidateCommentsForArticle(queryClient, articleId);
        },
    });

    return {
        deleteComment: mutation.mutate,
        isDeleting: mutation.isPending,
        error: mutation.error,
    };
}
