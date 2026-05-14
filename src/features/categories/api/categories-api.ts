import { axiosInstance } from "@/lib/api/client";
import type { Category } from "@/types";
import type { ApiResponse } from "@/types";

/**
 * Fetch all public categories
 * Endpoint: GET /api/categories
 */
export async function getCategories(): Promise<Category[]> {
    const response = await axiosInstance.get<ApiResponse<Category[]>>(
        "/api/categories"
    );

    if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || "Failed to fetch categories");
    }

    return response.data.data;
}
