"use server";

import { requireAuth } from "@/lib/auth/session";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type ActionState = {
    success: boolean;
    message?: string;
    url?: string;
    errors?: Record<string, string[]>;
};

export async function uploadArticleImageAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        // Check authentication
        await requireAuth();

        // Get token
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return {
                success: false,
                message: "Authentication token missing",
            };
        }

        // Debug: Log FormData contents
        console.log("Article Image FormData entries:");
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
        }

        // Call backend
        const response = await fetch(`${API_URL}/api/articles/upload-image`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await response.json();

        console.log("Article Image Upload response:", {
            status: response.status,
            success: result.success,
            message: result.message,
            fullResult: JSON.stringify(result, null, 2),
        });

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Failed to upload image",
            };
        }

        // Try different possible paths for the URL
        const extractedUrl = 
            result.data?.url ||
            result.url ||
            result.data?.imageUrl ||
            result.data?.path ||
            result.imageUrl;

        console.log("Extracted Image URL:", extractedUrl);

        if (!extractedUrl) {
            console.error("Could not extract URL from response. Full result:", result);
            return {
                success: false,
                message: "Image uploaded but URL not found in response",
            };
        }

        return {
            success: true,
            message: "Image uploaded successfully",
            url: extractedUrl,
        };
    } catch (error) {
        console.error("Article image upload error:", error);
        return {
            success: false,
            message: "An unexpected error occurred during upload",
        };
    }
}
