import { axiosInstance } from "@/lib/api/client";
import type { Comment, ApiResponse, PaginationMeta } from "@/types";

export interface GetCommentsParams {
    page?: number;
    limit?: number;
    includeSpam?: boolean;
    includeUnapproved?: boolean;
}

export interface CommentsResponse {
    comments: Comment[];
    pagination: PaginationMeta;
}

/**
 * Get comments for article
 */
export async function getCommentsByArticle(
    articleId: string,
    params: GetCommentsParams = {}
): Promise<CommentsResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.includeSpam) searchParams.set("includeSpam", "true");
    if (params.includeUnapproved) searchParams.set("includeUnapproved", "true");

    const response = await axiosInstance.get<ApiResponse<Comment[]>>(
        `/api/comments/${articleId}?${searchParams.toString()}`
    );

    if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to fetch comments");
    }

    return {
        comments: response.data.data,
        pagination: response.data.pagination!,
    };
}

/**
 * Get comment stats
 */
export async function getCommentStats(articleId: string): Promise<number> {
    const response = await axiosInstance.get<ApiResponse<{ total: number }>>(
        `/api/comments/stats/${articleId}`
    );

    if (!response.data.success || !response.data.data) {
        throw new Error("Failed to fetch comment stats");
    }

    return response.data.data.total;
}

/**
 * Delete comment (client-side)
 */
export async function deleteComment(commentId: string): Promise<void> {
    const response = await axiosInstance.delete(`/api/comments/${commentId}`);

    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete comment");
    }
}
