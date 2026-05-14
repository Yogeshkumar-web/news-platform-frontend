"use server";

import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { serverDelete } from "@/lib/api/server";

type ActionResult = {
    success: boolean;
    message?: string;
};

/**
 * Delete Comment Server Action
 * Author, Admin, or Moderator can delete
 */
export async function deleteCommentAction(
    commentId: string,
    articleId?: string
): Promise<ActionResult> {
    try {
        // Check authentication
        await requireAuth();

        await serverDelete(`/api/comments/${commentId}`);

        // Revalidate article page
        if (articleId) {
            revalidatePath(`/articles/${articleId}`);
        }

        return {
            success: true,
            message: "Comment deleted successfully",
        };
    } catch (error: any) {
        console.error("[Delete Comment Action] Error:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
        };
    }
}
