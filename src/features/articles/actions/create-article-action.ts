"use server";

import { createArticleSchema } from "@/lib";
import { requireWriter } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

import { serverPost } from "@/lib/api/server";
import { ActionState } from "@/types";

/**
 * Create Article Server Action
 * Requires WRITER, ADMIN, or SUPERADMIN role
 */
export async function createArticleAction(
    formData: FormData
): Promise<ActionState<{ articleId: string }>> {
    try {
        // Check authentication
        await requireWriter();
        
        // Extract and parse data
        const data = {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            excerpt: formData.get("excerpt") as string,
            thumbnail: formData.get("thumbnail") as string,
            status: (formData.get("status") as string) || "DRAFT",
            featured: formData.get("featured") === "true",
            isPremium: formData.get("isPremium") === "true",
            categories: JSON.parse(
                (formData.get("categories") as string) || "[]"
            ),
        };

        // Validate
        const validation = createArticleSchema.safeParse(data);

        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
            };
        }

        // Call backend
        const result = await serverPost<{ id: string }>("/api/articles", validation.data);

        // Revalidate relevant paths
        revalidatePath("/articles");
        revalidatePath("/dashboard/articles");
        if (validation.data.status === "PUBLISHED") {
            revalidatePath("/");
        }

        return {
            success: true,
            data: { articleId: result.id },
            message: "Article created successfully",
        };
    } catch (error: unknown) {
        console.error("[Create Article Action] Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return {
            success: false,
            message: errorMessage,
        };
    }
}
