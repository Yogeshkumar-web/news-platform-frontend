"use server";

import { updateArticleSchema } from "@/lib";
import { requireAuth } from "@/lib/auth/session";
import { serverPut } from "@/lib/api/server";
import { revalidatePath } from "next/cache";

import { ActionState } from "@/types";

/**
 * Update Article Server Action
 * Author or Admin can update
 */
export async function updateArticleAction(
    articleId: string,
    formData: FormData
): Promise<ActionState> {
    try {
        // Check authentication
        await requireAuth();

        // Extract data
        const data = {
            title: (formData.get("title") as string) || undefined,
            content: (formData.get("content") as string) || undefined,
            excerpt: (formData.get("excerpt") as string) || undefined,
            thumbnail: (formData.get("thumbnail") as string) || undefined,
            status: (formData.get("status") as string) || undefined,
            featured: formData.get("featured")
                ? formData.get("featured") === "true"
                : undefined,
            isPremium: formData.get("isPremium")
                ? formData.get("isPremium") === "true"
                : undefined,
            categories: formData.get("categories")
                ? JSON.parse(formData.get("categories") as string)
                : undefined,
        };

        // Remove undefined values
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );

        // Validate
        const validation = updateArticleSchema.safeParse(cleanData);

        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
            };
        }

        // Call backend using serverPut
        const result = await serverPut<{ success: boolean; data: { slug: string }; message?: string }>(
            `/api/articles/${articleId}`,
            validation.data
        );

        // Revalidate
        if (result.data?.slug) {
            revalidatePath(`/articles/${result.data.slug}`);
        }
        revalidatePath("/articles");
        revalidatePath("/dashboard/articles");

        return {
            success: true,
            message: "Article updated successfully",
        };
    } catch (error: unknown) {
        console.error("[Update Article Action] Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return {
            success: false,
            message: errorMessage,
        };
    }
}
