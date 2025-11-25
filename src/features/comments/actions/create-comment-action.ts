"use server";

import { createCommentSchema } from "@/lib";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { serverPost } from "@/lib/api/server";

type ActionResult = {
    success: boolean;
    commentId?: string;
    message?: string;
    errors?: Record<string, string[]>;
};

/**
 * Create Comment Server Action
 * Requires authentication
 */
export async function createCommentAction(
    formData: FormData
): Promise<ActionResult> {
    try {
        // Check authentication
        await requireAuth();

        // Extract data
        const rawParentId = formData.get("parentId");
        const data = {
            content: formData.get("content") as string,
            articleId: formData.get("articleId") as string,
            parentId: (rawParentId && rawParentId !== "null" && rawParentId !== "undefined") ? (rawParentId as string) : undefined,
        };

        // Validate
        const validation = createCommentSchema.safeParse(data);

        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
            };
        }

        // Call backend using serverPost (handles URL, headers, and auth automatically)
        console.log("[Create Comment] Calling serverPost /api/comments/create");
        const result = await serverPost<{ success: boolean; data: any; message: string }>(
            "/api/comments/create",
            validation.data
        );

        console.log("[Create Comment] Response:", result);

        // Revalidate article page to show new comment
        revalidatePath(`/articles/${data.articleId}`);

        return {
            success: true,
            commentId: result.data?.id,
            message: "Comment posted successfully",
        };
    } catch (error: any) {
        console.error("[Create Comment Action] Error:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
        };
    }
}
