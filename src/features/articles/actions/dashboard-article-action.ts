"use server";

import { revalidatePath } from "next/cache";
import { requireWriter } from "@/lib/auth/session";
import { serverDelete, serverPatch } from "@/lib/api/server";
import { getErrorMessage } from "@/lib/utils/error";
import type { ActionState, ArticleStatus } from "@/types";

function revalidateArticleLists(slug?: string) {
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath("/dashboard/articles");

    if (slug) {
        revalidatePath(`/articles/${slug}`);
    }
}

export async function deleteDashboardArticleAction(
    articleId: string,
    slug?: string,
): Promise<ActionState> {
    try {
        await requireWriter();
        await serverDelete(`/api/articles/${articleId}`);
        revalidateArticleLists(slug);

        return {
            success: true,
            message: "Article deleted successfully",
        };
    } catch (error: unknown) {
        console.error("[Delete Dashboard Article] Error:", error);
        return {
            success: false,
            message: getErrorMessage(error, "Failed to delete article"),
        };
    }
}

export async function updateDashboardArticleStatusAction(
    articleId: string,
    status: ArticleStatus,
    slug?: string,
): Promise<ActionState> {
    try {
        await requireWriter();
        await serverPatch(`/api/articles/${articleId}/status`, { status });
        revalidateArticleLists(slug);

        return {
            success: true,
            message:
                status === "PUBLISHED"
                    ? "Article published successfully"
                    : "Article unpublished successfully",
        };
    } catch (error: unknown) {
        console.error("[Update Dashboard Article Status] Error:", error);
        return {
            success: false,
            message: getErrorMessage(error, "Failed to update article status"),
        };
    }
}
