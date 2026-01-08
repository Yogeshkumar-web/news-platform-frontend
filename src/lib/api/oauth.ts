import { ApiResponse, OAuthError, User } from "@/types";
import { axiosInstance, extractData } from "./client";

/**
 * Initiate Google OAuth login
 * Redirects the browser to the backend OAuth endpoint
 * 
 * @param redirectTo - Optional URL to redirect to after successful login
 */
export function initiateGoogleLogin(redirectTo?: string) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!backendUrl) {
        console.error("API Base URL is not configured");
        return;
    }

    const url = new URL("/api/auth/google", backendUrl);
    
    if (redirectTo) {
        url.searchParams.set("redirect", redirectTo);
    }

    window.location.href = url.toString();
}

/**
 * Handle OAuth callback (if manually handling token exchange)
 * Note: Our current implementation uses HttpOnly cookies, so the backend
 * handles the callback and redirects to the frontend dashboard.
 * This is useful if we need to fetch the user immediately after redirect.
 */
export async function fetchCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<{ user: User }>>("/auth/me");
    return extractData(response.data).user;
}

/**
 * Logout the current user
 * Clears the HttpOnly cookie
 */
export async function logoutUser(): Promise<void> {
    await axiosInstance.post("/auth/logout");
    window.location.href = "/login";
}

/**
 * Parse OAuth error from URL search params
 */
export function getOAuthErrorFromUrl(searchParams: URLSearchParams): OAuthError | null {
    const error = searchParams.get("error");
    
    if (!error) return null;

    const errorMap: Record<string, OAuthError> = {
        auth_failed: {
            type: "auth_failed",
            message: "Authentication failed. Please try again.",
            provider: "google"
        },
        access_denied: {
            type: "access_denied",
            message: "Access was denied. We cannot log you in without permission.",
            provider: "google"
        },
        network_error: {
            type: "network_error",
            message: "Network error occurred. Please check your connection.",
            provider: "google"
        }
    };

    return errorMap[error] || {
        type: "unknown",
        message: "An unknown error occurred.",
        provider: "google"
    };
}
