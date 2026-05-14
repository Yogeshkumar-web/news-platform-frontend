import { serverGetResponse, serverPost } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Article } from "@/types";

/**
 * Get user's saved articles
 */
export async function getSavedArticles(
    page: number = 1,
    pageSize: number = 10
): Promise<{ articles: Article[]; total: number }> {
    try {
        const response = await serverGetResponse<Article[]>(
            `${API_ENDPOINTS.users.savedArticles}?page=${page}&pageSize=${pageSize}`
        );
        if (
            typeof response === "object" &&
            response !== null &&
            "success" in response
        ) {
            return {
                articles: response.data || [],
                total: response.pagination?.total || 0,
            };
        }
        return { articles: [], total: 0 };
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
