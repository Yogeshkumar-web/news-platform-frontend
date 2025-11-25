"use server";

import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.SERVER_API_BASE_URL || "http://localhost:3001";

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

        // Get token
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Call backend
        const response = await fetch(
            `${API_URL}/api/articles/${articleId}/like`,
            {
                method: "POST",
                headers: {
                    Cookie: `token=${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                isLiked: false,
                likeCount: 0,
                message: result.message || "Failed to update like",
            };
        }

        // Revalidate article page
        revalidatePath(`/articles/${articleId}`);

        return {
            success: true,
            isLiked: result.data.isLiked,
            likeCount: result.data.likeCount,
        };
    } catch (error: any) {
        console.error("[Toggle Like Action] Error:", error);
        return {
            success: false,
            isLiked: false,
            likeCount: 0,
            message: error.message || "An unexpected error occurred",
        };
    }
}
