import { serverGet } from "@/lib/api/server";
import { AdminCategory, AdminUser, ApiResponse, SystemStats } from "@/types";

// System Stats
export const getSystemStats = async (): Promise<SystemStats> => {
    return serverGet<SystemStats>("/api/stats/system");
};

// User Management
export const getAdminUsers = async (page = 1, pageSize = 10, search = "", role = ""): Promise<{ users: AdminUser[], pagination: any }> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }), // Only add if not empty
        ...(role && { role })       // Only add if not empty
    });
    return serverGet<{ users: AdminUser[], pagination: any }>(`/api/users?${queryParams.toString()}`);
};

// Category Management
export const getAdminCategories = async (): Promise<AdminCategory[]> => {
    try {
        const response = await serverGet<{ success: boolean; data: AdminCategory[] }>("/api/categories/admin/all");
        // Backend returns { success: true, data: [...] }
        return response.data || [];
    } catch (error) {
        console.error("Failed to fetch admin categories:", error);
        return [];
    }
};

// Content Moderation
export const getAdminArticles = async (page = 1, limit = 10, status = ""): Promise<{ articles: any[], pagination: any }> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status
    });
    return serverGet<{ articles: any[], pagination: any }>(`/api/articles/admin/all?${queryParams.toString()}`);
};

export const getAdminComments = async (page = 1, limit = 10, status = "PENDING"): Promise<{ comments: any[], pagination: any }> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status
    });
    // Assuming this endpoint exists based on pattern
    return serverGet<{ comments: any[], pagination: any }>(`/api/comments/admin/all?${queryParams.toString()}`);
};
