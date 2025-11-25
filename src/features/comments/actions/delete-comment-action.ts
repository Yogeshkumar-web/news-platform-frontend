"use server";

import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const API_URL = env.API_BASE_URL || "http://localhost:5000";

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

        // Get token
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Call backend
        const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                Cookie: `token=${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete comment",
            };
        }

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
