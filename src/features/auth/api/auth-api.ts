import { axiosInstance } from "@/lib/api/client";
import type { User, ApiResponse } from "@/types";

/**
 * Auth API - Client-side only
 * Used for React Query hooks
 */

export async function getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<{ user: User }>>(
        "/api/auth/me"
    );

    if (!response.data.success || !response.data.data?.user) {
        throw new Error(response.data.message || "Failed to get user");
    }

    return response.data.data.user;
}

export async function logoutUser(): Promise<void> {
    await axiosInstance.post("/api/auth/logout");
}
