import { serverGet, serverPost } from "@/lib/api/server";
import type { Article } from "@/types";

/**
 * Get user's saved articles
 */
export async function getSavedArticles(
    page: number = 1,
    pageSize: number = 10
): Promise<{ articles: Article[]; total: number }> {
    try {
        const response = await serverGet<{ articles: Article[]; total: number }>(
            `/api/users/saved-articles?page=${page}&pageSize=${pageSize}`
        );
        return response;
    } catch (error) {
        console.error("Failed to fetch saved articles:", error);
        return { articles: [], total: 0 };
    }
}

/**
 * Toggle save/unsave article
 */
export async function toggleSaveArticle(articleId: string): Promise<boolean> {
    try {
        await serverPost(`/api/articles/${articleId}/toggle-save`, {});
        return true;
    } catch (error) {
        console.error("Failed to toggle save article:", error);
        return false;
    }
}
