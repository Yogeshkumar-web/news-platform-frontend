import { axiosInstance } from "@/lib/api/client";
import { serverGet } from "@/lib/api/server";
import type { Article, ApiResponse, PaginationMeta } from "@/types";

/**
 * Articles API - Client-side only
 * For React Query hooks
 */

export interface GetArticlesParams {
    page?: number;
    pageSize?: number;
    category?: string;
    status?: string;
    featured?: boolean;
    search?: string;
}

export interface ArticlesResponse {
    articles: Article[];
    pagination: PaginationMeta;
}

export async function getArticles(
    params: GetArticlesParams = {}
): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.pageSize)
        searchParams.set("pageSize", params.pageSize.toString());
    if (params.category) searchParams.set("category", params.category);
    if (params.status) searchParams.set("status", params.status);
    if (params.featured !== undefined)
        searchParams.set("featured", params.featured.toString());
    if (params.search) searchParams.set("search", params.search);

    const response = await axiosInstance.get<ApiResponse<Article[]>>(
        `/api/articles?${searchParams.toString()}`
    );

    if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to fetch articles");
    }

    return {
        articles: response.data.data,
        pagination: response.data.pagination!,
    };
}

export async function getMyArticles(
    params: { page?: number; pageSize?: number; status?: string } = {}
): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", params.page.toString());
    if (params.pageSize)
        searchParams.set("pageSize", params.pageSize.toString());
    if (params.status) searchParams.set("status", params.status);

    const response = await axiosInstance.get<ApiResponse<Article[]>>(
        `/api/articles/my/articles?${searchParams.toString()}`
    );

    if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to fetch articles");
    }

    return {
        articles: response.data.data,
        pagination: response.data.pagination!,
    };
}

/**
 * Get article by ID (server-side)
 * Used for edit page to fetch article data
 * Fetches from user's articles list since backend doesn't have a get-by-id endpoint
 */
export async function getArticleById(id: string): Promise<Article | null> {
    try {
        // Fetch user's articles (limit to 50 to avoid validation error)
        const articles = await serverGet<Article[]>("/api/articles/my/articles?page=1&pageSize=50");
        
        // Find the article by ID
        const article = articles.find(a => a.id === id);
        
        return article || null;
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return null;
    }
}

export async function deleteArticle(articleId: string): Promise<void> {
    const response = await axiosInstance.delete(`/api/articles/${articleId}`);

    if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete article");
    }
}
