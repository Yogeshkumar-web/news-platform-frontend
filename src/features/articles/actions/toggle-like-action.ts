"use server";

import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { serverPost } from "@/lib/api/server";
import { getErrorMessage } from "@/lib/utils/error";

type ActionResult = {
    success: boolean;
    isLiked: boolean;
    likeCount: number;
    message?: string;
};

/**
 * Toggle Like Server Action
 * Optimistic UI ready
 */
export async function toggleLikeAction(
    articleId: string
): Promise<ActionResult> {
    try {
        // Check authentication
        await requireAuth();

        const result = await serverPost<{
            isLiked: boolean;
            likeCount: number;
        }>(`/api/articles/${articleId}/like`);

        // Revalidate article page
        revalidatePath(`/articles/${articleId}`);

        return {
            success: true,
            isLiked: result.isLiked,
            likeCount: result.likeCount,
        };
    } catch (error: unknown) {
        console.error("[Toggle Like Action] Error:", error);
        return {
            success: false,
            isLiked: false,
            likeCount: 0,
            message: getErrorMessage(error),
        };
    }
}
