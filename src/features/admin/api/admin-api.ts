import { serverGet, serverGetResponse } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { AdminCategory, AdminUser, SystemStats } from "@/types";

// System Stats
export const getSystemStats = async (): Promise<SystemStats> => {
    return serverGet<SystemStats>("/api/stats/system");
};

// User Management
export const getAdminUsers = async (page = 1, pageSize = 10, search = "", role = ""): Promise<{ users: AdminUser[], pagination: any }> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(role && { role })
    });
    const response = await serverGetResponse<AdminUser[]>(`/api/users?${queryParams.toString()}`);
    if (typeof response === "object" && response !== null && "success" in response) {
        return { users: response.data || [], pagination: response.pagination };
    }
    return { users: [], pagination: undefined };
};

// Category Management
export const getAdminCategories = async (): Promise<AdminCategory[]> => {
    try {
        // serverGet already extracts data from ApiResponse, so we get AdminCategory[] directly
        const categories = await serverGet<AdminCategory[]>("/api/categories/admin/all");
        return categories || [];
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
    const response = await serverGetResponse<any[]>(`/api/articles/admin/all?${queryParams.toString()}`);
    if (typeof response === "object" && response !== null && "success" in response) {
        return { articles: response.data || [], pagination: response.pagination };
    }
    return { articles: [], pagination: undefined };
};

export const getAdminComments = async (page = 1, limit = 10, status = "PENDING"): Promise<{ comments: any[], pagination: any }> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status
    });
    const response = await serverGetResponse<any[]>(`${API_ENDPOINTS.comments.adminAll}?${queryParams.toString()}`);
    if (typeof response === "object" && response !== null && "success" in response) {
        return { comments: response.data || [], pagination: response.pagination };
    }
    return { comments: [], pagination: undefined };
};
