"use server";

import { updateCommentSchema } from "@/lib";
import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.SERVER_API_BASE_URL || "http://localhost:3001";

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

        // Get token
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

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

        // Call backend
        const response = await fetch(`${API_URL}/api/comments/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`,
            },
            body: JSON.stringify(validation.data),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Failed to update comment",
            };
        }

        // Revalidate to show updated comment
        const articleId = formData.get("articleId") as string;
        if (articleId) {
            revalidatePath(`/articles/${articleId}`);
        }

        return {
            success: true,
            message: "Comment updated successfully",
        };
    } catch (error: any) {
        console.error("[Update Comment Action] Error:", error);
        return {
            success: false,
            message: error.message || "An unexpected error occurred",
        };
    }
}
