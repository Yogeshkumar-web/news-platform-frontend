"use server";

import { updateCommentSchema } from "@/lib";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { serverPut } from "@/lib/api/server";
import { getErrorMessage } from "@/lib/utils/error";

type ActionResult = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

/**
 * Update Comment Server Action
 * Only comment author can update
 */
export async function updateCommentAction(
    commentId: string,
    formData: FormData
): Promise<ActionResult> {
    try {
        // Check authentication
        await requireAuth();

        // Extract data
        const data = {
            content: formData.get("content") as string,
        };

        // Validate
        const validation = updateCommentSchema.safeParse(data);

        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
            };
        }

        await serverPut(`/api/comments/${commentId}`, validation.data);

        // Revalidate to show updated comment
        const articleId = formData.get("articleId") as string;
        if (articleId) {
            revalidatePath(`/articles/${articleId}`);
        }

        return {
            success: true,
            message: "Comment updated successfully",
        };
    } catch (error: unknown) {
        console.error("[Update Comment Action] Error:", error);
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}
