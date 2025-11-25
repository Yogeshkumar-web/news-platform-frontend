import { serverGet } from "@/lib/api/server";

export interface Category {
    key: string;
    label: string;
    count?: number;
}

/**
 * Fetch all public categories
 * Endpoint: GET /api/categories
 */
export async function getCategories(): Promise<Category[]> {
    try {
        return await serverGet<Category[]>("/api/categories");
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}
