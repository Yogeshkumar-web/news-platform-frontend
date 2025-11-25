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

export async function uploadAvatarAction(
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
        console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
        }

        // Call backend
        const response = await fetch(`${API_URL}/api/auth/avatar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                // Note: Content-Type header is not set manually for FormData
                // fetch will automatically set it with the boundary
            },
            body: formData,
        });

        const result = await response.json();

        console.log("Backend response:", {
            status: response.status,
            success: result.success,
            message: result.message,
            fullResult: JSON.stringify(result, null, 2), // Pretty print the entire response
        });

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Failed to upload avatar",
            };
        }

        // Try different possible paths for the URL
        const extractedUrl = 
            result.data?.url ||           // Standard: { data: { url: "..." } }
            result.url ||                 // Alternative: { url: "..." }
            result.data?.imageUrl ||      // Alternative: { data: { imageUrl: "..." } }
            result.data?.path ||          // Alternative: { data: { path: "..." } }
            result.imageUrl;              // Alternative: { imageUrl: "..." }

        console.log("Extracted URL:", extractedUrl);
        console.log("result.data:", result.data);

        if (!extractedUrl) {
            console.error("Could not extract URL from response. Full result:", result);
            return {
                success: false,
                message: "Avatar uploaded but URL not found in response",
            };
        }

        return {
            success: true,
            message: "Avatar uploaded successfully",
            url: extractedUrl,
        };
    } catch (error) {
        console.error("Avatar upload error:", error);
        return {
            success: false,
            message: "An unexpected error occurred during upload",
        };
    }
}
